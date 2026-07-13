import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollegeAssignmentGenerator from "@/components/generator/CollegeAssignmentGenerator";
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
    title: `Generate ${university.shortName} Assignment Front Page | CoverLe`,
    description: `Create a professional ${university.fullName} assignment front page with live preview and instant PDF export. 100% free, no watermarks.`,
  };
}

export default async function CollegeGeneratorPage({
  params,
}: {
  params: Promise<{ college: string }>;
}) {
  const { college } = await params;
  const university = getUniversity(college);
  if (!university) notFound();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-brutal">
            Loading generator…
          </p>
        </div>
      }
    >
      <CollegeAssignmentGenerator university={university} />
    </Suspense>
  );
}
