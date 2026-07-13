import type { Metadata } from "next";
import AtsChecker from "@/components/AtsChecker";
import FAQ from "@/components/FAQ";
import {
  ChecklistSection,
  CoreFeatures,
  DetailsGridSection,
  LandingIntro,
  ProseSection,
  RelatedTools,
  StepsSection,
} from "@/components/LandingContent";

export const metadata: Metadata = {
  title: "AI ATS Resume Checker - Free Instant ATS Score | CoverLe",
  description:
    "Upload your resume and get an instant AI-powered ATS compatibility score, missing keywords, and actionable improvements for your target role. 100% free, privacy-first.",
};

const FAQ_ITEMS = [
  {
    q: "How accurate is the AI ATS Checker?",
    a: "Our AI model is trained on modern hiring practices and understands context much better than legacy exact-match ATS systems. Instead of just counting keywords, it evaluates how relevant your skills and experience actually are to your target role.",
  },
  {
    q: "What is a good ATS score to aim for?",
    a: "Generally, you should aim for an ATS score above 80. A score of 80 or higher indicates that your resume is well-structured and contains a strong density of relevant keywords for your target role.",
  },
  {
    q: "Does this tool store my resume?",
    a: "No, we prioritize your privacy. Your resume is parsed in memory on our servers, sent securely to our AI for analysis, and then immediately discarded. It is never stored or used to train public models.",
  },
  {
    q: "What file formats are supported?",
    a: "You can upload your resume as a PDF or DOCX file up to 5MB. If your resume is a scanned image, export a text-based version first so the checker can read its content.",
  },
  {
    q: "Is the ATS checker really free?",
    a: "Yes. You get full, comprehensive AI feedback - overall score, section breakdown, and improvement suggestions - without any paywalls or hidden limits.",
  },
];

export default function AtsCheckerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            AI ATS Resume{" "}
            <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
              Checker
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Upload your resume and get an instant AI-powered ATS compatibility
            score, missing keywords, and actionable improvements for your target
            role.
          </p>
        </div>
      </section>

      {/* Interactive checker */}
      <AtsChecker />

      {/* Long-form landing content */}
      <LandingIntro
        titlePrefix="Free AI ATS Resume"
        titleHighlight="Checker"
        subtitle="Optimize your resume for applicant tracking systems and increase your chances of landing an interview."
      />

      <ProseSection
        title="What Is an ATS Resume Checker?"
        paragraphs={[
          "An ATS resume checker analyzes your resume the same way the automated applicant tracking systems used by recruiters do. Over 90% of Fortune 500 companies use an ATS to filter out applications before a human ever sees them.",
          "Our AI-powered checker identifies missing keywords, formatting errors, and structural issues that could trigger automatic rejection - so you can fix them before you apply, not after you've been silently filtered out.",
        ]}
      />

      <StepsSection
        title="How to Check Your ATS Score"
        intro="Getting your ATS compatibility score with CoverLe takes less than a minute. Just follow these five simple steps:"
        steps={[
          {
            name: "Upload Your Resume",
            text: "Drag and drop your resume as a PDF or DOCX file, or click to browse and select it.",
          },
          {
            name: "Enter Your Target Role",
            text: 'Type the job title you\'re applying for (e.g. "Software Engineer") so the analysis is tailored to that role.',
          },
          {
            name: "Run the Analysis",
            text: "Click Analyze Resume and our AI engine will evaluate your resume like a modern, context-aware ATS.",
          },
          {
            name: "Review Your Score",
            text: "See your overall ATS score along with a section-by-section breakdown of keyword match, formatting, action verbs, and more.",
          },
          {
            name: "Apply Improvements",
            text: "Work through the suggested improvements and missing keywords, then re-check until you score above 80.",
          },
        ]}
      />

      <ChecklistSection
        title="Why Use CoverLe?"
        intro="Job seekers trust CoverLe to get past the ATS filters. Here's why:"
        items={[
          {
            name: "100% Free Analysis:",
            text: "Get full, comprehensive AI feedback without any paywalls or hidden limits.",
          },
          {
            name: "AI-Powered Insights:",
            text: "We don't just count words; our AI understands context and relevance to your target role.",
          },
          {
            name: "Privacy First:",
            text: "Your resume text is processed securely and is never stored or used to train public models.",
          },
          {
            name: "Seamless Integration:",
            text: "Easily pull drafts directly from our CoverLe Resume Builder with one click.",
          },
        ]}
      />

      <DetailsGridSection
        title="What Makes a Good ATS Score?"
        intro="Generally, you should aim for an ATS score above 80. Your resume is evaluated across six dimensions that modern applicant tracking systems care about:"
        items={[
          {
            name: "Keyword Match",
            text: "How well your skills and experience align with the terminology recruiters use for your target role.",
          },
          {
            name: "Format Clarity",
            text: "Whether your layout parses cleanly - complex tables, columns, and graphics can garble ATS extraction.",
          },
          {
            name: "Action Verbs",
            text: "Strong, varied action verbs and quantified achievements instead of passive duty statements.",
          },
          {
            name: "Section Headers",
            text: "Standard, recognizable headings like Experience, Education, and Skills that an ATS can classify.",
          },
          {
            name: "Contact Info",
            text: "Name, email, phone, and location presented so automated systems can extract them reliably.",
          },
          {
            name: "Length & Density",
            text: "The right overall length and information density for your level of experience.",
          },
        ]}
      />

      <CoreFeatures
        features={[
          "Instant ATS Score",
          "Keyword Analysis",
          "AI-Powered",
          "PDF & DOCX",
          "Privacy First",
          "100% Free",
        ]}
      />

      <RelatedTools
        intro="Need to create a brand new resume that passes the ATS? Try our other tools:"
        links={[
          { label: "Resume Builder", href: "/resume" },
          { label: "Assignment Covers", href: "/assignment-cover" },
          { label: "Internship Reports", href: "/internship-report" },
        ]}
      />

      <FAQ items={FAQ_ITEMS} />
    </div>
  );
}
