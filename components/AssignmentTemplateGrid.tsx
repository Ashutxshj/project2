import Image from "next/image";
import Link from "next/link";
import { ASSIGNMENT_TEMPLATES } from "@/lib/data";

/**
 * Shared 11-template card grid used on the /assignment-cover landing page
 * and on each college's Step 2 select-template page. Every card links into
 * the given generator with `?template={id}` pre-selected.
 */
export default function AssignmentTemplateGrid({
  generatorBasePath,
  className,
}: {
  /** Generator route the Select Template buttons link into (no query). */
  generatorBasePath: string;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4${
        className ? ` ${className}` : ""
      }`}
    >
      {ASSIGNMENT_TEMPLATES.map((t) => (
        <div
          key={t.id}
          className="flex flex-col border-2 border-black bg-white shadow-brutal"
        >
          <div className="relative aspect-[210/297] w-full border-b-2 border-black bg-slate-50">
            <Image
              src={t.preview}
              alt={`${t.name} assignment cover template preview`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col p-4">
            <h3 className="text-base font-black tracking-tight">{t.name}</h3>
            <p className="mt-1 flex-1 text-sm font-medium text-slate-700">
              {t.description}
            </p>
            <Link
              href={`${generatorBasePath}?template=${t.id}`}
              className="mt-4 block border-2 border-black bg-brand px-4 py-2 text-center text-xs font-black uppercase tracking-widest shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Select Template
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
