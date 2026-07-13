"use client";

import { useRef, useState } from "react";

interface Dimension {
  name: string;
  score: number;
  feedback: string;
}

interface AtsResult {
  overallScore: number;
  dimensions: Dimension[];
  suggestions: string[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const clampScore = (score: number) => Math.max(0, Math.min(100, score));

function scoreBg(score: number): string {
  if (score >= 80) return "bg-brand";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-500";
}

function scoreText(score: number): string {
  return score < 60 ? "text-white" : "text-black";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "ATS-Ready";
  if (score >= 60) return "Needs Work";
  return "At Risk";
}

function validateFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf") || file.type === "application/pdf";
  const isDocx =
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (!isPdf && !isDocx) {
    return "Unsupported file type. Please upload a PDF or DOCX resume.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Please upload a resume under 5MB.";
  }
  return null;
}

export default function AtsChecker() {
  const [file, setFile] = useState<File | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptFile = (candidate: File) => {
    const problem = validateFile(candidate);
    if (problem) {
      setError(problem);
      setFile(null);
      return;
    }
    setError(null);
    setFile(candidate);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) acceptFile(dropped);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }
    if (!jobTitle.trim()) {
      setError("Please enter your target job title.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobTitle", jobTitle.trim());

      const res = await fetch("/api/ats-check", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          (data as { error?: string } | null)?.error ??
            "Something went wrong while analyzing your resume. Please try again.",
        );
        return;
      }
      setResult(data as AtsResult);
    } catch {
      setError("Network error - couldn't reach the analyzer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const overall = result ? clampScore(result.overallScore) : 0;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6">
      {/* Upload + form card */}
      <form
        onSubmit={handleSubmit}
        className="border-2 border-black bg-white p-5 shadow-brutal-lg sm:p-8"
      >
        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black px-6 py-10 text-center transition-colors ${
            dragActive ? "bg-brand/30" : "bg-brand/10 hover:bg-brand/20"
          }`}
        >
          <span className="flex h-12 w-12 items-center justify-center border-2 border-black bg-brand text-2xl font-black shadow-brutal-sm">
            ↑
          </span>
          {file ? (
            <>
              <p className="mt-4 text-sm font-black sm:text-base">{file.name}</p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                {(file.size / 1024).toFixed(0)} KB - click or drop to replace
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm font-black sm:text-base">
                Drag &amp; drop your resume here, or click to browse
              </p>
              <p className="mt-1 text-xs font-medium text-slate-600">
                PDF or DOCX, max 5MB
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) acceptFile(selected);
              e.target.value = "";
            }}
          />
        </div>

        {/* Job title */}
        <div className="mt-6">
          <label
            htmlFor="ats-job-title"
            className="block text-xs font-black uppercase tracking-widest"
          >
            Target Job Title
          </label>
          <input
            id="ats-job-title"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder='e.g. "Software Engineer"'
            className="mt-2 w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium shadow-brutal-sm outline-none placeholder:text-slate-400 focus:bg-brand/10"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 border-2 border-black bg-red-500 px-4 py-3 shadow-brutal-sm">
            <p className="text-sm font-black text-white">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full border-2 border-black bg-brand px-6 py-4 text-sm font-black uppercase tracking-widest shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-brutal"
        >
          {loading ? "Analyzing Your Resume…" : "Analyze Resume"}
        </button>

        {loading && (
          <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-slate-600">
            Our AI is reading your resume like an ATS - this usually takes under a
            minute
          </p>
        )}
      </form>

      {/* Results */}
      {result && (
        <div className="mt-10">
          {/* Overall score */}
          <div className="border-2 border-black bg-white p-6 shadow-brutal-lg sm:p-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div
                className={`flex h-32 w-32 shrink-0 flex-col items-center justify-center border-2 border-black shadow-brutal ${scoreBg(overall)} ${scoreText(overall)}`}
              >
                <span className="text-5xl font-black leading-none">{overall}</span>
                <span className="mt-1 text-[10px] font-black uppercase tracking-widest">
                  / 100
                </span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                  Overall ATS Score
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                  {scoreLabel(overall)}
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                  {overall >= 80
                    ? "Great work - your resume is well-structured for applicant tracking systems. Apply the suggestions below to push it even further."
                    : overall >= 60
                      ? "Your resume passes the basics but is likely losing points with ATS filters. The suggestions below will help you close the gap - aim for a score above 80."
                      : "Your resume is at high risk of being filtered out before a human sees it. Work through the suggestions below, then re-check - aim for a score above 80."}
                </p>
              </div>
            </div>
          </div>

          {/* Dimension cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.dimensions.map((dim) => {
              const score = clampScore(dim.score);
              return (
                <div
                  key={dim.name}
                  className="flex flex-col border-2 border-black bg-white p-4 shadow-brutal"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs font-black uppercase tracking-widest">
                      {dim.name}
                    </h3>
                    <span className="text-lg font-black">{score}</span>
                  </div>
                  <div className="mt-3 h-3 w-full border-2 border-black bg-white">
                    <div
                      className={`h-full ${scoreBg(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700">
                    {dim.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Suggestions */}
          {result.suggestions.length > 0 && (
            <div className="mt-8 border-2 border-black bg-brand/10 p-6 shadow-brutal">
              <h3 className="text-xl font-black tracking-tight sm:text-2xl">
                How to{" "}
                <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal-sm">
                  Improve
                </span>
              </h3>
              <ul className="mt-5 space-y-3">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black bg-black text-xs font-black text-brand">
                      {i + 1}
                    </span>
                    <p className="text-sm font-medium leading-relaxed text-slate-700">
                      {suggestion}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
