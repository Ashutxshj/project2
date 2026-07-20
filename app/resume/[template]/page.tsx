import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResumeEditor from "@/components/generator/ResumeEditor";
import type { ResumeTemplateId } from "@/components/generator/resume-types";
import { RESUME_TEMPLATES } from "@/lib/data";

export function generateStaticParams() {
  return RESUME_TEMPLATES.map((t) => ({ template: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ template: string }>;
}): Promise<Metadata> {
  const { template } = await params;
  const meta = RESUME_TEMPLATES.find((t) => t.id === template);
  if (!meta) return {};
  return {
    title: `${meta.name} - Free Resume Builder | Draftly`,
    description: `${meta.description} Build it online with live preview and download a print-ready PDF — 100% free, no watermarks.`,
  };
}

export default async function ResumeTemplatePage({
  params,
}: {
  params: Promise<{ template: string }>;
}) {
  const { template } = await params;
  const meta = RESUME_TEMPLATES.find((t) => t.id === template);
  if (!meta) notFound();

  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              {meta.name}
            </span>{" "}
            Builder
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Builder */}
      <ResumeEditor templateId={template as ResumeTemplateId} />
    </div>
  );
}
