import Link from "next/link";

/**
 * Shared long-form landing content used on every tool landing page:
 * intro band, "What is…" prose, numbered how-to steps, "Why use…" checks,
 * "!" details grid, Core Features chips and related-tool links.
 */

export function LandingIntro({
  titlePrefix,
  titleHighlight,
  subtitle,
}: {
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}) {
  return (
    <div className="border-y-4 border-black bg-brand/20 bg-grid-paper">
      <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6">
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
          {titlePrefix}{" "}
          <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
            {titleHighlight}
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export function ProseSection({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

export function StepsSection({
  title,
  intro,
  steps,
}: {
  title: string;
  intro?: string;
  steps: { name: string; text: string }[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          {intro}
        </p>
      )}
      <ol className="mt-6 space-y-4">
        {steps.map((s, i) => (
          <li
            key={s.name}
            className="flex gap-4 border-2 border-black bg-white p-4 shadow-brutal"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-brand text-sm font-black">
              {i + 1}
            </span>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              <strong className="font-black text-black">{s.name}:</strong>{" "}
              {s.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ChecklistSection({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: { name: string; text: string }[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          {intro}
        </p>
      )}
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item.name} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black bg-brand text-xs font-black">
              ✓
            </span>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              <strong className="font-black text-black">{item.name}</strong>{" "}
              {item.text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DetailsGridSection({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: { name: string; text: string }[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-black text-lg font-black text-brand">
          !
        </span>
        <div>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h2>
          {intro && (
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
              {intro}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="border-2 border-black bg-white p-4 shadow-brutal"
          >
            <h3 className="text-sm font-black uppercase tracking-widest">
              {item.name}
            </h3>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-slate-700">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CoreFeatures({ features }: { features: string[] }) {
  return (
    <section className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
        Core{" "}
        <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
          Features
        </span>
      </h2>
      <div className="mt-6 flex flex-wrap gap-3">
        {features.map((f) => (
          <span
            key={f}
            className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-brutal"
          >
            {f}
          </span>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({
  intro,
  links,
}: {
  intro: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section className="mx-auto max-w-4xl px-5 pb-8 pt-4 sm:px-6">
      <div className="border-2 border-black bg-brand/20 p-6 shadow-brutal">
        <p className="text-sm font-medium text-slate-700">{intro}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-black underline underline-offset-4 decoration-2 hover:decoration-brand"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
