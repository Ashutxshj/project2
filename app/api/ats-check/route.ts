import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_TEXT_LENGTH = 120;

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const DIMENSION_NAMES = [
  "Keyword Match",
  "Format Clarity",
  "Action Verbs",
  "Section Headers",
  "Contact Info",
  "Length & Density",
] as const;

/**
 * Structured-output schema (Claude). Numeric range constraints (minimum/maximum)
 * are not supported in structured output schemas, so the 0-100 range is enforced
 * via the prompt instead.
 */
const ATS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["overallScore", "dimensions", "suggestions"],
  properties: {
    overallScore: { type: "integer" },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "score", "feedback"],
        properties: {
          name: { type: "string", enum: [...DIMENSION_NAMES] },
          score: { type: "integer" },
          feedback: { type: "string" },
        },
      },
    },
    suggestions: { type: "array", items: { type: "string" } },
  },
} as const;

/** Same schema in Gemini's OpenAPI-style responseSchema dialect. */
const ATS_SCHEMA_GEMINI = {
  type: "OBJECT",
  required: ["overallScore", "dimensions", "suggestions"],
  properties: {
    overallScore: { type: "INTEGER" },
    dimensions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        required: ["name", "score", "feedback"],
        properties: {
          name: { type: "STRING", enum: [...DIMENSION_NAMES] },
          score: { type: "INTEGER" },
          feedback: { type: "STRING" },
        },
      },
    },
    suggestions: { type: "ARRAY", items: { type: "STRING" } },
  },
} as const;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function buildPrompt(jobTitle: string, resumeText: string): string {
  return [
    "You are an expert ATS (Applicant Tracking System) resume analyst. Evaluate the resume below for the target role like a modern, context-aware ATS would — one that understands semantics and relevance, not just exact keyword matches.",
    "",
    `Target job title: ${jobTitle}`,
    "",
    "Resume text (extracted from the uploaded file):",
    "<resume>",
    resumeText,
    "</resume>",
    "",
    "Score the resume across exactly these six dimensions, each with an integer score from 0 to 100 and one or two sentences of specific, concrete feedback grounded in the resume's actual content:",
    "1. Keyword Match — how well the resume's skills, tools, and terminology align with what recruiters and ATS filters expect for the target role.",
    "2. Format Clarity — whether the extracted text suggests a clean, parseable layout (no garbled ordering, tables, or columns that break parsing).",
    "3. Action Verbs — use of strong, varied action verbs and quantified achievements rather than passive duty statements.",
    "4. Section Headers — presence of standard, recognizable sections (e.g. Experience, Education, Skills) that an ATS can classify.",
    "5. Contact Info — whether name, email, phone, and location/links are present and easy to extract.",
    "6. Length & Density — appropriate overall length and information density for the candidate's apparent seniority.",
    "",
    "Also provide an overallScore (an integer from 0 to 100, reflecting overall ATS compatibility for the target role — not a simple average) and a list of 5 to 8 concrete, actionable improvement suggestions. Each suggestion should be specific to this resume and this target role (e.g. name the exact missing keywords or the exact section to fix), not generic advice.",
    "",
    "Include each of the six dimensions exactly once in the dimensions array. All scores must be integers between 0 and 100.",
  ].join("\n");
}

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  const parser = new PDFParse({ data: bytes });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

async function analyzeWithGemini(prompt: string): Promise<Response> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: ATS_SCHEMA_GEMINI,
        },
      }),
    },
  );

  if (!res.ok) {
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return jsonError(
        "The server's Gemini API key was rejected. Check GEMINI_API_KEY in .env.local.",
        500,
      );
    }
    if (res.status === 429) {
      return jsonError(
        "The analyzer is receiving too many requests right now. Please wait a moment and try again.",
        429,
      );
    }
    return jsonError("The AI analysis service returned an error. Please try again shortly.", 502);
  }

  const data = await res.json();
  const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string" || text.length === 0) {
    return jsonError("The AI analysis returned no result. Please try again.", 502);
  }
  return Response.json(JSON.parse(text));
}

async function analyzeWithClaude(prompt: string): Promise<Response> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      format: { type: "json_schema", schema: ATS_SCHEMA },
    },
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return jsonError("The AI analysis returned no result. Please try again.", 502);
  }
  return Response.json(JSON.parse(textBlock.text));
}

export async function POST(request: Request) {
  // Validate the request payload
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("Expected multipart/form-data with a file and jobTitle.", 400);
  }

  const file = formData.get("file");
  const jobTitle = formData.get("jobTitle");

  if (!(file instanceof File)) {
    return jsonError("No resume file was uploaded.", 400);
  }
  if (typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
    return jsonError("Please provide a target job title.", 400);
  }
  if (file.size > MAX_FILE_SIZE) {
    return jsonError("File is too large. Please upload a resume under 5MB.", 400);
  }

  const fileName = file.name.toLowerCase();
  const isPdf = fileName.endsWith(".pdf") || file.type === "application/pdf";
  const isDocx =
    fileName.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPdf && !isDocx) {
    return jsonError("Unsupported file type. Please upload a PDF or DOCX resume.", 400);
  }

  // Extract the resume text server-side
  let resumeText: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    resumeText = isPdf
      ? await extractPdfText(new Uint8Array(arrayBuffer))
      : await extractDocxText(Buffer.from(arrayBuffer));
  } catch {
    return jsonError(
      "We couldn't read that file. Make sure it's a valid, non-password-protected PDF or DOCX.",
      400,
    );
  }

  resumeText = resumeText.trim();
  if (resumeText.length < MIN_TEXT_LENGTH) {
    return jsonError(
      "We couldn't extract enough text from that resume. If it's a scanned or image-only PDF, please export a text-based version and try again.",
      400,
    );
  }

  if (!process.env.GEMINI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
    return jsonError(
      "The server has no AI key configured. Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env.local (see .env.example) and restart the server.",
      500,
    );
  }

  const prompt = buildPrompt(jobTitle.trim(), resumeText);

  try {
    return process.env.GEMINI_API_KEY
      ? await analyzeWithGemini(prompt)
      : await analyzeWithClaude(prompt);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return jsonError(
        "The server's Anthropic API key is invalid or missing. Check ANTHROPIC_API_KEY in .env.local.",
        500,
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return jsonError(
        "The analyzer is receiving too many requests right now. Please wait a moment and try again.",
        429,
      );
    }
    if (error instanceof Anthropic.APIError) {
      return jsonError(
        "The AI analysis service returned an error. Please try again shortly.",
        502,
      );
    }
    if (error instanceof SyntaxError) {
      return jsonError("The AI returned an unreadable result. Please try again.", 502);
    }
    return jsonError("Something went wrong while analyzing your resume.", 500);
  }
}
