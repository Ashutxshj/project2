"use client";

import {
  BulletEntry,
  CertificationEntry,
  contactPieces,
  CustomSectionEntry,
  displayName,
  displayTitle,
  EducationEntry,
  ExperienceEntry,
  hasText,
  ProjectEntry,
  ReferenceEntry,
  ResumeData,
  ResumeTemplateId,
  splitComma,
  splitLines,
  visibleAchievements,
  visibleCertifications,
  visibleCoCurricular,
  visibleCustom,
  visibleEducation,
  visibleExperience,
  visibleLanguages,
  visibleLinks,
  visibleProjects,
  visibleReferences,
  visibleSkills,
  visibleSummary,
} from "./resume-types";
import { A4_H, A4_W } from "./ui";

/* ------------------------------------------------------------------ */
/* Template plumbing                                                    */
/*                                                                      */
/* Each template exposes:                                               */
/*  - buildBlocks(data): flat list of block nodes. Block 0 is the       */
/*    document header. Blocks are measured off-screen and packed        */
/*    greedily into as many A4 pages as needed (usually 1–2).           */
/*  - Page: the 794x1123 chrome that receives a page's blocks.          */
/*  - contentWidth / usableHeight / baseClass: measurement context that */
/*    must match the Page's content column exactly.                     */
/* ------------------------------------------------------------------ */

export interface ResumePageProps {
  data: ResumeData;
  pageIndex: number;
  totalPages: number;
  children: React.ReactNode;
}

export interface ResumeTemplateConfig {
  contentWidth: number;
  usableHeight: number;
  baseClass: string;
  buildBlocks: (d: ResumeData) => React.ReactNode[];
  Page: React.ComponentType<ResumePageProps>;
}

/** Bundle a section heading with its first entry so headings never orphan. */
function sectionBlocks(
  key: string,
  heading: React.ReactNode,
  entries: React.ReactNode[],
  gapClass = "pb-3"
): React.ReactNode[] {
  if (entries.length === 0) return [];
  const [first, ...rest] = entries;
  return [
    <div key={`${key}-0`} className={gapClass}>
      {heading}
      {first}
    </div>,
    ...rest.map((e, i) => (
      <div key={`${key}-${i + 1}`} className={gapClass}>
        {e}
      </div>
    )),
  ];
}

/* ================================================================== */
/* 1. PROFESSIONAL — single-column, classic serif, black on white      */
/* ================================================================== */

function ProHeading({ title }: { title: string }) {
  return (
    <h3 className="mb-1.5 border-b border-black pb-1 text-[13px] font-bold uppercase tracking-[0.16em]">
      {title}
    </h3>
  );
}

function buildProfessionalBlocks(d: ResumeData): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  const pieces = contactPieces(d);
  const links = visibleLinks(d);
  const title = displayTitle(d);

  blocks.push(
    <div key="header" className="pb-4 text-center">
      <h1 className="text-[27px] font-bold uppercase tracking-[0.1em] leading-tight">
        {displayName(d)}
      </h1>
      {title && (
        <p className="mt-0.5 text-[13px] italic tracking-wide">{title}</p>
      )}
      {pieces.length > 0 && (
        <p className="mt-1 text-[11.5px]">{pieces.join("  •  ")}</p>
      )}
      {links.length > 0 && (
        <p className="mt-0.5 text-[11px]">
          {links.map((l, i) => (
            <span key={l.id}>
              {i > 0 && "  •  "}
              <span className="font-semibold">{l.label || "Link"}</span>
              {hasText(l.url) && `: ${l.url.trim()}`}
            </span>
          ))}
        </p>
      )}
      <div className="mx-auto mt-3 border-b-2 border-black" />
    </div>
  );

  const summary = visibleSummary(d);
  if (summary) {
    blocks.push(
      <div key="summary" className="pb-3.5">
        <ProHeading title="Professional Summary" />
        <p className="whitespace-pre-line text-justify">{summary}</p>
      </div>
    );
  }

  const skills = visibleSkills(d);
  blocks.push(
    ...sectionBlocks(
      "skills",
      <ProHeading title="Key Skills" />,
      skills.map((s) => (
        <p key={s.id} className="mb-0.5">
          {hasText(s.category) && (
            <span className="font-bold">{s.category.trim()}: </span>
          )}
          {splitComma(s.items).join(", ")}
        </p>
      )),
      "pb-3.5"
    )
  );

  const education = visibleEducation(d);
  blocks.push(
    ...sectionBlocks(
      "education",
      <ProHeading title="Education" />,
      education.map((e) => <ProEducation key={e.id} e={e} />),
      "pb-3.5"
    )
  );

  const experience = visibleExperience(d);
  blocks.push(
    ...sectionBlocks(
      "experience",
      <ProHeading title="Work Experience" />,
      experience.map((e) => <ProExperience key={e.id} e={e} />),
      "pb-3.5"
    )
  );

  const projects = visibleProjects(d);
  blocks.push(
    ...sectionBlocks(
      "projects",
      <ProHeading title="Projects" />,
      projects.map((p) => <ProProject key={p.id} p={p} />),
      "pb-3.5"
    )
  );

  blocks.push(
    ...bulletSection("achievements", "Achievements", visibleAchievements(d), ProHeading),
    ...bulletSection("cocurricular", "Co-Curricular Activities", visibleCoCurricular(d), ProHeading)
  );

  const languages = visibleLanguages(d);
  if (languages.length) {
    blocks.push(
      <div key="languages" className="pb-3.5">
        <ProHeading title="Languages" />
        <p>
          {languages
            .map((l) =>
              hasText(l.proficiency)
                ? `${l.language.trim()} (${l.proficiency.trim()})`
                : l.language.trim()
            )
            .join(", ")}
        </p>
      </div>
    );
  }

  const certifications = visibleCertifications(d);
  blocks.push(
    ...sectionBlocks(
      "certifications",
      <ProHeading title="Certifications" />,
      certifications.map((c) => (
        <p key={c.id} className="mb-0.5">
          <span className="font-bold">{c.name.trim()}</span>
          {hasText(c.issuer) && ` — ${c.issuer.trim()}`}
          {hasText(c.date) && (
            <span className="italic"> ({c.date.trim()})</span>
          )}
        </p>
      )),
      "pb-3.5"
    )
  );

  const references = visibleReferences(d);
  blocks.push(
    ...sectionBlocks(
      "references",
      <ProHeading title="References" />,
      references.map((r) => <ProReference key={r.id} r={r} />),
      "pb-3.5"
    )
  );

  for (const c of visibleCustom(d)) {
    blocks.push(
      <div key={`custom-${c.id}`} className="pb-3.5">
        <ProHeading title={c.heading.trim() || "Additional Information"} />
        <p className="whitespace-pre-line">{c.content}</p>
      </div>
    );
  }

  return blocks;
}

function ProEducation({ e }: { e: EducationEntry }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-bold">{e.institution.trim() || e.degree.trim()}</p>
        {hasText(e.dates) && (
          <p className="shrink-0 text-[11px] italic">{e.dates.trim()}</p>
        )}
      </div>
      {hasText(e.institution) && hasText(e.degree) && (
        <p className="italic">{e.degree.trim()}</p>
      )}
      {hasText(e.achievements) && (
        <ul className="mt-0.5 list-disc pl-5">
          {splitLines(e.achievements).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProExperience({ e }: { e: ExperienceEntry }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-bold">
          {e.role.trim()}
          {hasText(e.role) && hasText(e.organization) && ", "}
          {hasText(e.organization) && (
            <span className="font-normal italic">{e.organization.trim()}</span>
          )}
        </p>
        {hasText(e.dates) && (
          <p className="shrink-0 text-[11px] italic">{e.dates.trim()}</p>
        )}
      </div>
      {hasText(e.responsibilities) && (
        <ul className="mt-0.5 list-disc pl-5">
          {splitLines(e.responsibilities).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProProject({ p }: { p: ProjectEntry }) {
  return (
    <div className="mb-1.5">
      <p>
        <span className="font-bold">{p.name.trim()}</span>
        {hasText(p.tech) && <span className="italic"> — {p.tech.trim()}</span>}
      </p>
      {hasText(p.link) && <p className="text-[11px]">{p.link.trim()}</p>}
      {hasText(p.description) && (
        <p className="whitespace-pre-line">{p.description}</p>
      )}
    </div>
  );
}

function ProReference({ r }: { r: ReferenceEntry }) {
  return (
    <div className="mb-1.5">
      <p className="font-bold">{r.name.trim()}</p>
      <p className="italic">
        {[r.title.trim(), r.organization.trim()].filter(Boolean).join(", ")}
      </p>
      {hasText(r.contact) && <p className="text-[11px]">{r.contact.trim()}</p>}
    </div>
  );
}

function bulletSection(
  key: string,
  title: string,
  items: BulletEntry[],
  Heading: React.ComponentType<{ title: string }>
): React.ReactNode[] {
  if (!items.length) return [];
  return [
    <div key={key} className="pb-3.5">
      <Heading title={title} />
      <ul className="list-disc pl-5">
        {items.map((a) => (
          <li key={a.id}>{a.text.trim()}</li>
        ))}
      </ul>
    </div>,
  ];
}

function ProfessionalPage({ children }: ResumePageProps) {
  return (
    <div
      className="bg-white font-serif text-[12.5px] leading-[1.5] text-black"
      style={{ width: A4_W, height: A4_H }}
    >
      <div className="h-full overflow-hidden px-12 py-10">{children}</div>
    </div>
  );
}

/* ================================================================== */
/* 2. TECHNICAL — single-column, compact sans, section rules, skills   */
/*    grid                                                              */
/* ================================================================== */

function TechHeading({ title }: { title: string }) {
  return (
    <h3 className="mb-1.5 border-b-2 border-slate-800 pb-0.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-900">
      {title}
    </h3>
  );
}

function buildTechnicalBlocks(d: ResumeData): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  const pieces = contactPieces(d);
  const links = visibleLinks(d);
  const title = displayTitle(d);

  blocks.push(
    <div key="header" className="pb-4">
      <h1 className="text-[25px] font-black uppercase leading-tight tracking-tight">
        {displayName(d)}
      </h1>
      {title && (
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          {title}
        </p>
      )}
      {(pieces.length > 0 || links.length > 0) && (
        <p className="mt-1.5 text-[10.5px] text-slate-700">
          {[
            ...pieces,
            ...links.map((l) =>
              hasText(l.url)
                ? `${l.label ? `${l.label.trim()}: ` : ""}${l.url.trim()}`
                : l.label.trim()
            ),
          ].join("  |  ")}
        </p>
      )}
      <div className="mt-2 border-b-[3px] border-slate-900" />
    </div>
  );

  const summary = visibleSummary(d);
  if (summary) {
    blocks.push(
      <div key="summary" className="pb-3">
        <TechHeading title="Profile Summary" />
        <p className="whitespace-pre-line">{summary}</p>
      </div>
    );
  }

  const skills = visibleSkills(d);
  if (skills.length) {
    blocks.push(
      <div key="skills" className="pb-3">
        <TechHeading title="Technical Skills" />
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          {skills.map((s) => (
            <div key={s.id}>
              {hasText(s.category) && (
                <p className="font-bold text-slate-900">{s.category.trim()}</p>
              )}
              <p className="text-slate-700">{splitComma(s.items).join(" · ")}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const education = visibleEducation(d);
  blocks.push(
    ...sectionBlocks(
      "education",
      <TechHeading title="Education" />,
      education.map((e) => <TechEducation key={e.id} e={e} />)
    )
  );

  const experience = visibleExperience(d);
  blocks.push(
    ...sectionBlocks(
      "experience",
      <TechHeading title="Work Experience" />,
      experience.map((e) => <TechExperience key={e.id} e={e} />)
    )
  );

  const projects = visibleProjects(d);
  blocks.push(
    ...sectionBlocks(
      "projects",
      <TechHeading title="Projects" />,
      projects.map((p) => (
        <div key={p.id} className="mb-1.5">
          <p>
            <span className="font-bold">{p.name.trim()}</span>
            {hasText(p.tech) && (
              <span className="text-slate-600"> | {p.tech.trim()}</span>
            )}
          </p>
          {hasText(p.link) && (
            <p className="text-[10.5px] text-slate-600">{p.link.trim()}</p>
          )}
          {hasText(p.description) && (
            <p className="whitespace-pre-line text-slate-800">{p.description}</p>
          )}
        </div>
      ))
    )
  );

  blocks.push(
    ...bulletSection("achievements", "Achievements", visibleAchievements(d), TechHeading),
    ...bulletSection("cocurricular", "Co-Curricular Activities", visibleCoCurricular(d), TechHeading)
  );

  const languages = visibleLanguages(d);
  if (languages.length) {
    blocks.push(
      <div key="languages" className="pb-3">
        <TechHeading title="Languages" />
        <p>
          {languages
            .map((l) =>
              hasText(l.proficiency)
                ? `${l.language.trim()} — ${l.proficiency.trim()}`
                : l.language.trim()
            )
            .join("  |  ")}
        </p>
      </div>
    );
  }

  const certifications = visibleCertifications(d);
  blocks.push(
    ...sectionBlocks(
      "certifications",
      <TechHeading title="Certifications" />,
      certifications.map((c) => (
        <p key={c.id} className="mb-0.5">
          <span className="font-bold">{c.name.trim()}</span>
          {hasText(c.issuer) && (
            <span className="text-slate-700"> — {c.issuer.trim()}</span>
          )}
          {hasText(c.date) && (
            <span className="text-slate-500"> ({c.date.trim()})</span>
          )}
        </p>
      ))
    )
  );

  const references = visibleReferences(d);
  blocks.push(
    ...sectionBlocks(
      "references",
      <TechHeading title="References" />,
      references.map((r) => (
        <div key={r.id} className="mb-1.5">
          <p className="font-bold">{r.name.trim()}</p>
          <p className="text-slate-700">
            {[r.title.trim(), r.organization.trim()].filter(Boolean).join(", ")}
          </p>
          {hasText(r.contact) && (
            <p className="text-[10.5px] text-slate-600">{r.contact.trim()}</p>
          )}
        </div>
      ))
    )
  );

  for (const c of visibleCustom(d)) {
    blocks.push(
      <div key={`custom-${c.id}`} className="pb-3">
        <TechHeading title={c.heading.trim() || "Additional Information"} />
        <p className="whitespace-pre-line">{c.content}</p>
      </div>
    );
  }

  return blocks;
}

function TechEducation({ e }: { e: EducationEntry }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-bold">{e.institution.trim() || e.degree.trim()}</p>
        {hasText(e.dates) && (
          <p className="shrink-0 text-[10.5px] font-semibold text-slate-600">
            {e.dates.trim()}
          </p>
        )}
      </div>
      {hasText(e.institution) && hasText(e.degree) && (
        <p className="text-slate-700">{e.degree.trim()}</p>
      )}
      {hasText(e.achievements) && (
        <ul className="mt-0.5 list-disc pl-4 text-slate-800">
          {splitLines(e.achievements).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TechExperience({ e }: { e: ExperienceEntry }) {
  return (
    <div className="mb-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <p>
          <span className="font-bold">{e.role.trim()}</span>
          {hasText(e.organization) && (
            <span className="text-slate-700"> @ {e.organization.trim()}</span>
          )}
        </p>
        {hasText(e.dates) && (
          <p className="shrink-0 text-[10.5px] font-semibold text-slate-600">
            {e.dates.trim()}
          </p>
        )}
      </div>
      {hasText(e.responsibilities) && (
        <ul className="mt-0.5 list-disc pl-4 text-slate-800">
          {splitLines(e.responsibilities).map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TechnicalPage({ children }: ResumePageProps) {
  return (
    <div
      className="bg-white font-sans text-[11.5px] leading-[1.45] text-slate-900"
      style={{ width: A4_W, height: A4_H }}
    >
      <div className="h-full overflow-hidden px-10 py-9">{children}</div>
    </div>
  );
}

/* ================================================================== */
/* 3. MODERN EXECUTIVE — two-column, navy sidebar with photo, teal     */
/*    accent                                                            */
/* ================================================================== */

const EXEC_NAVY = "#16324f";
const EXEC_TEAL = "#0e7490";
const EXEC_SIDEBAR_W = 260;

function ExecHeading({ title }: { title: string }) {
  return (
    <h3
      className="mb-1.5 inline-block border-b-2 pb-0.5 text-[12px] font-bold uppercase tracking-[0.18em]"
      style={{ color: EXEC_NAVY, borderColor: EXEC_TEAL }}
    >
      {title}
    </h3>
  );
}

function buildExecutiveBlocks(d: ResumeData): React.ReactNode[] {
  const blocks: React.ReactNode[] = [];
  const title = displayTitle(d);

  blocks.push(
    <div key="header" className="pb-4">
      <h1
        className="text-[26px] font-extrabold uppercase leading-tight tracking-[0.08em]"
        style={{ color: EXEC_NAVY }}
      >
        {displayName(d)}
      </h1>
      {title && (
        <p
          className="mt-1 text-[12px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: EXEC_TEAL }}
        >
          {title}
        </p>
      )}
      <div
        className="mt-3 h-[3px] w-14"
        style={{ backgroundColor: EXEC_TEAL }}
      />
    </div>
  );

  const summary = visibleSummary(d);
  if (summary) {
    blocks.push(
      <div key="summary" className="pb-3.5">
        <ExecHeading title="Profile" />
        <p className="whitespace-pre-line">{summary}</p>
      </div>
    );
  }

  const experience = visibleExperience(d);
  blocks.push(
    ...sectionBlocks(
      "experience",
      <ExecHeading title="Work Experience" />,
      experience.map((e) => (
        <div key={e.id} className="mb-2">
          <p className="font-bold" style={{ color: EXEC_NAVY }}>
            {e.role.trim()}
          </p>
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
            {[e.organization.trim(), e.dates.trim()].filter(Boolean).join("  |  ")}
          </p>
          {hasText(e.responsibilities) && (
            <ul className="mt-1 list-disc pl-4">
              {splitLines(e.responsibilities).map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
        </div>
      )),
      "pb-3.5"
    )
  );

  const education = visibleEducation(d);
  blocks.push(
    ...sectionBlocks(
      "education",
      <ExecHeading title="Education" />,
      education.map((e) => (
        <div key={e.id} className="mb-2">
          <p className="font-bold" style={{ color: EXEC_NAVY }}>
            {e.degree.trim() || e.institution.trim()}
          </p>
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-slate-500">
            {[
              hasText(e.degree) ? e.institution.trim() : "",
              e.dates.trim(),
            ]
              .filter(Boolean)
              .join("  |  ")}
          </p>
          {hasText(e.achievements) && (
            <ul className="mt-1 list-disc pl-4">
              {splitLines(e.achievements).map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          )}
        </div>
      )),
      "pb-3.5"
    )
  );

  const projects = visibleProjects(d);
  blocks.push(
    ...sectionBlocks(
      "projects",
      <ExecHeading title="Projects" />,
      projects.map((p) => (
        <div key={p.id} className="mb-2">
          <p className="font-bold" style={{ color: EXEC_NAVY }}>
            {p.name.trim()}
          </p>
          {(hasText(p.tech) || hasText(p.link)) && (
            <p className="text-[10.5px] font-semibold text-slate-500">
              {[p.tech.trim(), p.link.trim()].filter(Boolean).join("  |  ")}
            </p>
          )}
          {hasText(p.description) && (
            <p className="mt-0.5 whitespace-pre-line">{p.description}</p>
          )}
        </div>
      )),
      "pb-3.5"
    )
  );

  blocks.push(
    ...bulletSection("achievements", "Achievements", visibleAchievements(d), ExecHeading),
    ...bulletSection("cocurricular", "Co-Curricular Activities", visibleCoCurricular(d), ExecHeading)
  );

  const certifications = visibleCertifications(d);
  blocks.push(
    ...sectionBlocks(
      "certifications",
      <ExecHeading title="Certifications" />,
      certifications.map((c) => (
        <p key={c.id} className="mb-0.5">
          <span className="font-bold" style={{ color: EXEC_NAVY }}>
            {c.name.trim()}
          </span>
          {hasText(c.issuer) && ` — ${c.issuer.trim()}`}
          {hasText(c.date) && (
            <span className="text-slate-500"> ({c.date.trim()})</span>
          )}
        </p>
      )),
      "pb-3.5"
    )
  );

  const references = visibleReferences(d);
  blocks.push(
    ...sectionBlocks(
      "references",
      <ExecHeading title="References" />,
      references.map((r) => (
        <div key={r.id} className="mb-1.5">
          <p className="font-bold" style={{ color: EXEC_NAVY }}>
            {r.name.trim()}
          </p>
          <p className="text-slate-600">
            {[r.title.trim(), r.organization.trim()].filter(Boolean).join(", ")}
          </p>
          {hasText(r.contact) && (
            <p className="text-[10.5px] text-slate-500">{r.contact.trim()}</p>
          )}
        </div>
      )),
      "pb-3.5"
    )
  );

  for (const c of visibleCustom(d)) {
    blocks.push(
      <div key={`custom-${c.id}`} className="pb-3.5">
        <ExecHeading title={c.heading.trim() || "Additional Information"} />
        <p className="whitespace-pre-line">{c.content}</p>
      </div>
    );
  }

  return blocks;
}

function ExecSidebarHeading({ title }: { title: string }) {
  return (
    <h4 className="mb-1.5 border-b border-white/30 pb-1 text-[10.5px] font-bold uppercase tracking-[0.22em] text-white">
      {title}
    </h4>
  );
}

function ExecSidebar({ data: d }: { data: ResumeData }) {
  const pieces: { label: string; value: string }[] = [];
  if (!d.contact.location.hidden && hasText(d.contact.location.value))
    pieces.push({ label: "Location", value: d.contact.location.value.trim() });
  if (!d.contact.email.hidden && hasText(d.contact.email.value))
    pieces.push({ label: "Email", value: d.contact.email.value.trim() });
  if (!d.contact.phone.hidden && hasText(d.contact.phone.value))
    pieces.push({ label: "Phone", value: d.contact.phone.value.trim() });

  const links = visibleLinks(d);
  const skills = visibleSkills(d);
  const languages = visibleLanguages(d);
  const initials =
    displayName(d)
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "YN";

  return (
    <div className="space-y-5">
      <div className="flex justify-center pt-1">
        {d.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.photo}
            alt="Profile"
            className="h-[130px] w-[130px] rounded-full border-4 border-white/60 object-cover"
          />
        ) : (
          <div className="flex h-[130px] w-[130px] items-center justify-center rounded-full border-4 border-white/60 bg-white/10 text-[34px] font-bold text-white/80">
            {initials}
          </div>
        )}
      </div>
      {(pieces.length > 0 || links.length > 0) && (
        <div>
          <ExecSidebarHeading title="Contact" />
          <div className="space-y-1.5">
            {pieces.map((p) => (
              <div key={p.label}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {p.label}
                </p>
                <p className="break-words text-[10.5px] text-white/95">
                  {p.value}
                </p>
              </div>
            ))}
            {links.map((l) => (
              <div key={l.id}>
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/60">
                  {l.label.trim() || "Link"}
                </p>
                <p className="break-all text-[10.5px] text-white/95">
                  {l.url.trim() || l.label.trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {skills.length > 0 && (
        <div>
          <ExecSidebarHeading title="Skills" />
          <div className="space-y-1.5">
            {skills.map((s) => (
              <div key={s.id}>
                {hasText(s.category) && (
                  <p className="text-[10.5px] font-bold text-white">
                    {s.category.trim()}
                  </p>
                )}
                <p className="text-[10.5px] leading-[1.5] text-white/85">
                  {splitComma(s.items).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {languages.length > 0 && (
        <div>
          <ExecSidebarHeading title="Languages" />
          <div className="space-y-1">
            {languages.map((l) => (
              <p key={l.id} className="text-[10.5px] text-white/95">
                {l.language.trim()}
                {hasText(l.proficiency) && (
                  <span className="text-white/60"> — {l.proficiency.trim()}</span>
                )}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExecutivePage({ data, pageIndex, children }: ResumePageProps) {
  return (
    <div
      className="flex bg-white font-montserrat text-[11.5px] leading-[1.5] text-slate-800"
      style={{ width: A4_W, height: A4_H }}
    >
      <aside
        className="h-full shrink-0 overflow-hidden px-6 py-8"
        style={{ width: EXEC_SIDEBAR_W, backgroundColor: EXEC_NAVY }}
      >
        {pageIndex === 0 && <ExecSidebar data={data} />}
      </aside>
      <div className="h-full min-w-0 flex-1 overflow-hidden px-7 py-8">
        {children}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Registry                                                            */
/* ================================================================== */

export const RESUME_TEMPLATE_CONFIGS: Record<
  ResumeTemplateId,
  ResumeTemplateConfig
> = {
  "professional-resume": {
    contentWidth: A4_W - 96, // px-12
    usableHeight: A4_H - 80, // py-10
    baseClass: "bg-white font-serif text-[12.5px] leading-[1.5] text-black",
    buildBlocks: buildProfessionalBlocks,
    Page: ProfessionalPage,
  },
  "technical-resume": {
    contentWidth: A4_W - 80, // px-10
    usableHeight: A4_H - 72, // py-9
    baseClass: "bg-white font-sans text-[11.5px] leading-[1.45] text-slate-900",
    buildBlocks: buildTechnicalBlocks,
    Page: TechnicalPage,
  },
  "modern-executive-resume": {
    contentWidth: A4_W - EXEC_SIDEBAR_W - 56, // main column, px-7
    usableHeight: A4_H - 64, // py-8
    baseClass:
      "bg-white font-montserrat text-[11.5px] leading-[1.5] text-slate-800",
    buildBlocks: buildExecutiveBlocks,
    Page: ExecutivePage,
  },
};
