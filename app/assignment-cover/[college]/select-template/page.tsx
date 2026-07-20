import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AssignmentTemplateGrid from "@/components/AssignmentTemplateGrid";
import FAQ from "@/components/FAQ";
import { ChecklistSection, ProseSection } from "@/components/LandingContent";
import { UNIVERSITIES, getUniversity } from "@/lib/data";

export function generateStaticParams() {
  return UNIVERSITIES.map((u) => ({ college: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ college: string }>;
}): Promise<Metadata> {
  const { college } = await params;
  const university = getUniversity(college);
  if (!university) return {};
  return {
    title: `Choose a ${university.shortName} Assignment Cover Template | Draftly`,
    description: `Pick from 11 free assignment cover page templates for ${university.fullName}. Live preview and instant print-ready PDF download — no watermark.`,
  };
}

export default async function SelectTemplatePage({
  params,
}: {
  params: Promise<{ college: string }>;
}) {
  const { college } = await params;
  const university = getUniversity(college);
  if (!university) notFound();

  const faqItems = [
    {
      q: `How do I make a ${university.shortName} assignment front page?`,
      a: `Choose a template above, fill in your name, roll number, subject and faculty details in the generator, check the live preview and download your ${university.shortName} assignment front page as a print-ready PDF — all in under a minute.`,
    },
    {
      q: `What details should a ${university.shortName} assignment cover page include?`,
      a: "A complete assignment cover page should include your full name, enrollment or roll number, course, semester, subject name and code, the assignment title, your professor's name and the submission date.",
    },
    {
      q: `Is the ${university.shortName} assignment cover page generator free?`,
      a: "Yes. Every template and PDF download on Draftly is completely free, with no sign-up and no watermark.",
    },
    {
      q: `Can I customize the fields on my ${university.shortName} cover page?`,
      a: "Yes. Every text field is editable, individual fields can be hidden, and you can switch templates at any time inside the generator without losing your details.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-widest text-slate-700">
            {university.fullName}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
            Step 2:{" "}
            <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
              Choose a Template
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-700">
            Select a ready-to-use assignment cover page template for{" "}
            {university.fullName} — you can still switch templates inside the
            generator.
          </p>
          <Link
            href={`/assignment-cover/${university.slug}/generator`}
            className="mt-5 inline-block text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 hover:decoration-brand"
          >
            Or skip to the default {university.shortName} layout →
          </Link>
        </div>
      </section>

      {/* Template grid */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <AssignmentTemplateGrid
          generatorBasePath={`/assignment-cover/${university.slug}/generator`}
        />
      </section>

      {/* Long-form landing content */}
      <ProseSection
        title={`${university.shortName} Assignment Cover Page Generator`}
        paragraphs={[
          `Create a professional assignment front page for ${university.fullName} in about 30 seconds. Pick any template above and the generator opens with it pre-selected — just fill in your details, watch the live preview update and download a print-ready A4 PDF. Completely free, no watermark.`,
          `Every design works with the same set of fields, so you can compare templates without retyping anything. Your entries are saved as a draft in your browser while you experiment.`,
        ]}
      />

      <ChecklistSection
        title={`Why Use a Standardized ${university.shortName} Cover Page?`}
        items={[
          {
            name: "Professionalism:",
            text: "Presents your hard work in a neat, organized format that reflects your dedication.",
          },
          {
            name: "Accuracy:",
            text: "Ensures you never forget critical details like your roll number, subject code, or professor's name.",
          },
          {
            name: "Time-Saving:",
            text: "Instead of fighting with MS Word formatting every semester, generate a perfect PDF in seconds.",
          },
          {
            name: "Consistency:",
            text: "Maintain a uniform look across all your assignments for different subjects throughout your degree.",
          },
        ]}
      />

      <ChecklistSection
        title="Tips for a Perfect Academic Submission"
        items={[
          {
            name: "Verify your details:",
            text: "Double-check your enrollment number and spelling before downloading — evaluators match covers to records.",
          },
          {
            name: "Use official names:",
            text: "Copy the exact subject name and code from your syllabus or timetable.",
          },
          {
            name: "Match the tone:",
            text: "Pick a formal template for technical subjects and reserve creative designs for project work.",
          },
          {
            name: "Print smart:",
            text: "The PDF is A4-sized, so it prints edge-accurate on standard assignment sheets.",
          },
        ]}
      />

      <FAQ items={faqItems} />
    </div>
  );
}
