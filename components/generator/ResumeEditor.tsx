"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  A4_H,
  A4_W,
  DraftBar,
  FieldRow,
  FieldState,
  GeneratePanel,
  LogoUpload,
  ScaledPreview,
} from "@/components/generator/ui";
import {
  RESUME_TEMPLATE_CONFIGS,
  ResumeTemplateConfig,
} from "@/components/generator/resume-templates";
import {
  BulletEntry,
  ResumeData,
  ResumeTemplateId,
  SectionKey,
  defaultResumeData,
  uid,
} from "@/components/generator/resume-types";
import { RESUME_TEMPLATES } from "@/lib/data";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementsToPdf } from "@/lib/pdf";

/* ------------------------------------------------------------------ */
/* Small form primitives (resume entries have plain labelled inputs;   */
/* the FieldState hide/rename chrome only applies to contact fields).  */
/* ------------------------------------------------------------------ */

const INPUT_CLASS =
  "w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand";
const LABEL_CLASS =
  "mb-1 block text-xs font-bold uppercase tracking-widest text-slate-700";

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      <input
        type="text"
        className={INPUT_CLASS}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className={LABEL_CLASS}>{label}</label>
      <textarea
        className={INPUT_CLASS}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-brand"
    >
      + {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-red-100"
    >
      Remove
    </button>
  );
}

/** Bordered card wrapping one dynamic entry, with a Remove control. */
function EntryCard({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 border-2 border-black/20 p-3">
      <div className="flex justify-end">
        <RemoveButton onClick={onRemove} />
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Collapsible form section with an optional section-level HIDE toggle */
/* ------------------------------------------------------------------ */
function BuilderSection({
  number,
  title,
  open,
  onToggle,
  hidden = false,
  onToggleHidden,
  children,
}: {
  number: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  hidden?: boolean;
  onToggleHidden?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`border-2 border-black bg-white shadow-brutal ${
        hidden ? "opacity-60" : ""
      }`}
    >
      <div
        className={`flex items-center gap-3 bg-brand/40 px-4 py-3 ${
          open ? "border-b-2 border-black" : ""
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="text-lg font-black tracking-tight">{number}</span>
          <h2 className="min-w-0 flex-1 truncate text-sm font-black uppercase tracking-widest">
            {title}
          </h2>
          <span aria-hidden className="text-base font-black">
            {open ? "−" : "+"}
          </span>
        </button>
        {onToggleHidden && (
          <button
            type="button"
            onClick={onToggleHidden}
            className={`shrink-0 border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm transition-colors ${
              hidden ? "bg-black text-brand" : "bg-white hover:bg-brand"
            }`}
          >
            {hidden ? "Include" : "Hide"}
          </button>
        )}
      </div>
      {open && <div className="space-y-4 p-4">{children}</div>}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pagination: measure template blocks off-screen and pack into pages  */
/* ------------------------------------------------------------------ */
function packPages(heights: number[], usableHeight: number): number[][] {
  const pages: number[][] = [[]];
  let used = 0;
  heights.forEach((h, i) => {
    const current = pages[pages.length - 1];
    if (current.length > 0 && used + h > usableHeight) {
      pages.push([i]);
      used = h;
    } else {
      current.push(i);
      used += h;
    }
  });
  return pages;
}

const PROFICIENCY_OPTIONS = [
  "Native",
  "Fluent",
  "Advanced",
  "Intermediate",
  "Basic",
];

type ListKey =
  | "links"
  | "skills"
  | "education"
  | "experience"
  | "projects"
  | "achievements"
  | "coCurricular"
  | "languages"
  | "certifications"
  | "references"
  | "custom";

interface SectionMeta {
  key: string;
  title: string;
  hideKey?: SectionKey;
}

const SECTION_ORDER: SectionMeta[] = [
  { key: "contact", title: "Contact Details" },
  { key: "links", title: "Social & Coding Links", hideKey: "links" },
  { key: "summary", title: "Profile Summary", hideKey: "summary" },
  { key: "skills", title: "Skills", hideKey: "skills" },
  { key: "education", title: "Education", hideKey: "education" },
  { key: "experience", title: "Work Experience", hideKey: "experience" },
  { key: "projects", title: "Projects", hideKey: "projects" },
  {
    key: "achievements",
    title: "Achievements & Co-Curricular",
    hideKey: "achievements",
  },
  { key: "languages", title: "Languages", hideKey: "languages" },
  { key: "references", title: "References", hideKey: "references" },
  { key: "certifications", title: "Certifications", hideKey: "certifications" },
  { key: "custom", title: "Custom Sections", hideKey: "custom" },
];

const DEFAULT_OPEN: Record<string, boolean> = {
  contact: true,
  links: true,
  summary: true,
  skills: true,
  education: true,
  experience: true,
  projects: true,
  achievements: false,
  languages: false,
  references: false,
  certifications: false,
  custom: false,
};

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */
export default function ResumeEditor({
  templateId,
}: {
  templateId: ResumeTemplateId;
}) {
  const config: ResumeTemplateConfig = RESUME_TEMPLATE_CONFIGS[templateId];
  const Page = config.Page;
  const withPhoto = templateId === "modern-executive-resume";
  const templateMeta = RESUME_TEMPLATES.find((t) => t.id === templateId);

  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [open, setOpen] = useState<Record<string, boolean>>(DEFAULT_OPEN);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pages, setPages] = useState<number[][]>([[0]]);
  const [pageIdx, setPageIdx] = useState(0);
  const [fontTick, setFontTick] = useState(0);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Autosave: restore on mount, persist on change */
  useEffect(() => {
    const saved = loadAutosave<ResumeData>(templateId);
    if (saved?.contact) {
      setData({
        ...defaultResumeData(),
        ...saved,
        contact: { ...defaultResumeData().contact, ...saved.contact },
      });
    }
    setHydrated(true);
  }, [templateId]);

  useEffect(() => {
    if (hydrated) saveAutosave(templateId, data);
  }, [data, hydrated, templateId]);

  /* Re-measure once webfonts finish loading */
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) setFontTick((t) => t + 1);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* Build + measure blocks, pack into A4 pages */
  const blocks = useMemo(() => config.buildBlocks(data), [config, data]);

  useLayoutEffect(() => {
    const heights = blocks.map(
      (_, i) => blockRefs.current[i]?.offsetHeight ?? 0
    );
    const next = packPages(heights, config.usableHeight);
    setPages((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next
    );
  }, [blocks, config, fontTick]);

  useEffect(() => {
    setPageIdx((p) => Math.min(p, pages.length - 1));
  }, [pages.length]);

  /* State helpers */
  const toggleOpen = (key: string) =>
    setOpen((o) => ({ ...o, [key]: !o[key] }));

  const toggleHidden = (key: SectionKey) =>
    setData((d) => ({
      ...d,
      hiddenSections: { ...d.hiddenSections, [key]: !d.hiddenSections[key] },
    }));

  const setContact =
    (key: keyof ResumeData["contact"]) => (next: FieldState) =>
      setData((d) => ({ ...d, contact: { ...d.contact, [key]: next } }));

  function patchEntry<K extends ListKey>(
    key: K,
    id: string,
    patch: Partial<ResumeData[K][number]>
  ) {
    setData(
      (d) =>
        ({
          ...d,
          [key]: (d[key] as { id: string }[]).map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        }) as ResumeData
    );
  }

  function addEntry<K extends ListKey>(key: K, entry: ResumeData[K][number]) {
    setData(
      (d) =>
        ({
          ...d,
          [key]: [...(d[key] as unknown[]), entry],
        }) as ResumeData
    );
  }

  function removeEntry(key: ListKey, id: string) {
    setData(
      (d) =>
        ({
          ...d,
          [key]: (d[key] as { id: string }[]).filter((e) => e.id !== id),
        }) as ResumeData
    );
  }

  const handleGenerate = async () => {
    if (busy) return;
    const nodes = pageRefs.current
      .slice(0, pages.length)
      .filter((el): el is HTMLDivElement => el !== null);
    if (!nodes.length) return;
    setBusy(true);
    try {
      await exportElementsToPdf(nodes, `${templateId}.pdf`, "portrait");
    } finally {
      setBusy(false);
    }
  };

  const sectionNumber = (key: string) =>
    String(SECTION_ORDER.findIndex((s) => s.key === key) + 1).padStart(2, "0");

  const meta = (key: string) =>
    SECTION_ORDER.find((s) => s.key === key) as SectionMeta;

  const sectionProps = (key: string) => {
    const m = meta(key);
    return {
      number: sectionNumber(key),
      title: m.title,
      open: !!open[key],
      onToggle: () => toggleOpen(key),
      hidden: m.hideKey ? !!data.hiddenSections[m.hideKey] : false,
      onToggleHidden: m.hideKey
        ? () => toggleHidden(m.hideKey as SectionKey)
        : undefined,
    };
  };

  const bulletList = (
    key: "achievements" | "coCurricular",
    heading: string,
    addLabel: string,
    placeholder: string
  ) => (
    <div className="space-y-3">
      <p className="text-xs font-black uppercase tracking-widest">{heading}</p>
      {(data[key] as BulletEntry[]).map((b) => (
        <div key={b.id} className="flex items-center gap-2">
          <input
            type="text"
            className={INPUT_CLASS}
            value={b.text}
            placeholder={placeholder}
            onChange={(e) => patchEntry(key, b.id, { text: e.target.value })}
          />
          <RemoveButton onClick={() => removeEntry(key, b.id)} />
        </div>
      ))}
      <AddButton
        label={addLabel}
        onClick={() => addEntry(key, { id: uid(), text: "" })}
      />
    </div>
  );

  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6">
          {templateMeta?.badge && (
            <span className="mb-4 inline-block border-2 border-black bg-black px-3 py-1 text-xs font-black uppercase tracking-widest text-brand shadow-brutal-sm">
              {templateMeta.badge}
            </span>
          )}
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Build your{" "}
            <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
              {templateMeta?.name ?? "Resume"}
            </span>
          </h1>
          {templateMeta && (
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700">
              {templateMeta.description}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* ----------------------------- Form ----------------------------- */}
        <div className="space-y-6">
          <DraftBar<ResumeData>
            tool={templateId}
            getData={() => data}
            onLoad={(d) =>
              setData({
                ...defaultResumeData(),
                ...d,
                contact: { ...defaultResumeData().contact, ...d.contact },
              })
            }
            onDiscard={() => {
              clearAutosave(templateId);
              setData(defaultResumeData());
            }}
          />

          {/* 01 Contact */}
          <BuilderSection {...sectionProps("contact")}>
            {withPhoto && (
              <LogoUpload
                label="Profile Photo"
                prompt="Drag and drop your photo here, or click to browse files."
                value={data.photo}
                onChange={(photo) => setData((d) => ({ ...d, photo }))}
              />
            )}
            <FieldRow
              field={data.contact.name}
              onChange={setContact("name")}
              placeholder="e.g., Rahul Verma"
            />
            <FieldRow
              field={data.contact.title}
              onChange={setContact("title")}
              placeholder="e.g., Software Engineer"
            />
            <FieldRow
              field={data.contact.location}
              onChange={setContact("location")}
              placeholder="e.g., Bengaluru, India"
            />
            <FieldRow
              field={data.contact.email}
              onChange={setContact("email")}
              placeholder="e.g., rahul@example.com"
            />
            <FieldRow
              field={data.contact.phone}
              onChange={setContact("phone")}
              placeholder="e.g., +91 98765 43210"
            />
          </BuilderSection>

          {/* 02 Links */}
          <BuilderSection {...sectionProps("links")}>
            {data.links.map((l) => (
              <EntryCard key={l.id} onRemove={() => removeEntry("links", l.id)}>
                <div className="grid grid-cols-2 gap-3">
                  <TextInput
                    label="Label"
                    value={l.label}
                    placeholder="e.g., LinkedIn"
                    onChange={(v) => patchEntry("links", l.id, { label: v })}
                  />
                  <TextInput
                    label="URL"
                    value={l.url}
                    placeholder="e.g., linkedin.com/in/rahul"
                    onChange={(v) => patchEntry("links", l.id, { url: v })}
                  />
                </div>
              </EntryCard>
            ))}
            <AddButton
              label="Add Link"
              onClick={() => addEntry("links", { id: uid(), label: "", url: "" })}
            />
          </BuilderSection>

          {/* 03 Summary */}
          <BuilderSection {...sectionProps("summary")}>
            <textarea
              className={INPUT_CLASS}
              rows={4}
              value={data.summary.value}
              placeholder="2–4 lines summarising your experience, strengths and career goals."
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  summary: { ...d.summary, value: e.target.value },
                }))
              }
            />
          </BuilderSection>

          {/* 04 Skills */}
          <BuilderSection {...sectionProps("skills")}>
            {data.skills.map((s) => (
              <EntryCard key={s.id} onRemove={() => removeEntry("skills", s.id)}>
                <TextInput
                  label="Category"
                  value={s.category}
                  placeholder="e.g., Programming Languages"
                  onChange={(v) => patchEntry("skills", s.id, { category: v })}
                />
                <TextInput
                  label="Skills (comma-separated)"
                  value={s.items}
                  placeholder="e.g., Python, C++, JavaScript"
                  onChange={(v) => patchEntry("skills", s.id, { items: v })}
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Skills List"
              onClick={() =>
                addEntry("skills", { id: uid(), category: "", items: "" })
              }
            />
          </BuilderSection>

          {/* 05 Education */}
          <BuilderSection {...sectionProps("education")}>
            {data.education.map((e) => (
              <EntryCard
                key={e.id}
                onRemove={() => removeEntry("education", e.id)}
              >
                <TextInput
                  label="Institution"
                  value={e.institution}
                  placeholder="e.g., Indian Institute of Technology Delhi"
                  onChange={(v) =>
                    patchEntry("education", e.id, { institution: v })
                  }
                />
                <TextInput
                  label="Degree / Details"
                  value={e.degree}
                  placeholder="e.g., B.Tech in Computer Science — CGPA 8.7"
                  onChange={(v) => patchEntry("education", e.id, { degree: v })}
                />
                <TextInput
                  label="Date Range"
                  value={e.dates}
                  placeholder="e.g., 2021 – 2025"
                  onChange={(v) => patchEntry("education", e.id, { dates: v })}
                />
                <TextArea
                  label="Achievements (one per line)"
                  value={e.achievements}
                  placeholder={"e.g., Department rank 3\nMerit scholarship recipient"}
                  onChange={(v) =>
                    patchEntry("education", e.id, { achievements: v })
                  }
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Education"
              onClick={() =>
                addEntry("education", {
                  id: uid(),
                  institution: "",
                  degree: "",
                  dates: "",
                  achievements: "",
                })
              }
            />
          </BuilderSection>

          {/* 06 Work Experience */}
          <BuilderSection {...sectionProps("experience")}>
            {data.experience.map((e) => (
              <EntryCard
                key={e.id}
                onRemove={() => removeEntry("experience", e.id)}
              >
                <TextInput
                  label="Role"
                  value={e.role}
                  placeholder="e.g., Software Development Intern"
                  onChange={(v) => patchEntry("experience", e.id, { role: v })}
                />
                <TextInput
                  label="Organization"
                  value={e.organization}
                  placeholder="e.g., Infosys Limited"
                  onChange={(v) =>
                    patchEntry("experience", e.id, { organization: v })
                  }
                />
                <TextInput
                  label="Date Range"
                  value={e.dates}
                  placeholder="e.g., May 2024 – July 2024"
                  onChange={(v) => patchEntry("experience", e.id, { dates: v })}
                />
                <TextArea
                  label="Responsibilities (one per line)"
                  value={e.responsibilities}
                  placeholder={"e.g., Built REST APIs used by 3 internal teams\nReduced report generation time by 40%"}
                  onChange={(v) =>
                    patchEntry("experience", e.id, { responsibilities: v })
                  }
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Work Experience"
              onClick={() =>
                addEntry("experience", {
                  id: uid(),
                  role: "",
                  organization: "",
                  dates: "",
                  responsibilities: "",
                })
              }
            />
          </BuilderSection>

          {/* 07 Projects */}
          <BuilderSection {...sectionProps("projects")}>
            {data.projects.map((p) => (
              <EntryCard
                key={p.id}
                onRemove={() => removeEntry("projects", p.id)}
              >
                <TextInput
                  label="Project Name"
                  value={p.name}
                  placeholder="e.g., Campus Event Portal"
                  onChange={(v) => patchEntry("projects", p.id, { name: v })}
                />
                <TextInput
                  label="Tech Stack"
                  value={p.tech}
                  placeholder="e.g., Next.js, PostgreSQL, Docker"
                  onChange={(v) => patchEntry("projects", p.id, { tech: v })}
                />
                <TextInput
                  label="Project Link"
                  value={p.link}
                  placeholder="e.g., github.com/rahul/event-portal"
                  onChange={(v) => patchEntry("projects", p.id, { link: v })}
                />
                <TextArea
                  label="Description"
                  value={p.description}
                  placeholder="What the project does and what you built."
                  onChange={(v) =>
                    patchEntry("projects", p.id, { description: v })
                  }
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Project"
              onClick={() =>
                addEntry("projects", {
                  id: uid(),
                  name: "",
                  tech: "",
                  link: "",
                  description: "",
                })
              }
            />
          </BuilderSection>

          {/* 08 Achievements & Co-Curricular */}
          <BuilderSection {...sectionProps("achievements")}>
            {bulletList(
              "achievements",
              "Achievements",
              "Add Achievement",
              "e.g., Winner, Smart India Hackathon 2024"
            )}
            {bulletList(
              "coCurricular",
              "Co-Curricular Activities",
              "Add Activity",
              "e.g., Core member, college coding club"
            )}
          </BuilderSection>

          {/* 09 Languages */}
          <BuilderSection {...sectionProps("languages")}>
            {data.languages.map((l) => (
              <div key={l.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <TextInput
                    label="Language"
                    value={l.language}
                    placeholder="e.g., English"
                    onChange={(v) =>
                      patchEntry("languages", l.id, { language: v })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className={LABEL_CLASS}>Proficiency</label>
                  <select
                    className={`${INPUT_CLASS} bg-white`}
                    value={l.proficiency}
                    onChange={(e) =>
                      patchEntry("languages", l.id, {
                        proficiency: e.target.value,
                      })
                    }
                  >
                    <option value="">Select proficiency</option>
                    {PROFICIENCY_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pb-2">
                  <RemoveButton onClick={() => removeEntry("languages", l.id)} />
                </div>
              </div>
            ))}
            <AddButton
              label="Add Language"
              onClick={() =>
                addEntry("languages", { id: uid(), language: "", proficiency: "" })
              }
            />
          </BuilderSection>

          {/* 10 References */}
          <BuilderSection {...sectionProps("references")}>
            {data.references.map((r) => (
              <EntryCard
                key={r.id}
                onRemove={() => removeEntry("references", r.id)}
              >
                <TextInput
                  label="Name"
                  value={r.name}
                  placeholder="e.g., Dr. Priya Nair"
                  onChange={(v) => patchEntry("references", r.id, { name: v })}
                />
                <TextInput
                  label="Title / Role"
                  value={r.title}
                  placeholder="e.g., Associate Professor"
                  onChange={(v) => patchEntry("references", r.id, { title: v })}
                />
                <TextInput
                  label="Organization"
                  value={r.organization}
                  placeholder="e.g., IIT Delhi"
                  onChange={(v) =>
                    patchEntry("references", r.id, { organization: v })
                  }
                />
                <TextInput
                  label="Contact (phone / email)"
                  value={r.contact}
                  placeholder="e.g., priya@iitd.ac.in"
                  onChange={(v) =>
                    patchEntry("references", r.id, { contact: v })
                  }
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Reference"
              onClick={() =>
                addEntry("references", {
                  id: uid(),
                  name: "",
                  title: "",
                  organization: "",
                  contact: "",
                })
              }
            />
          </BuilderSection>

          {/* 11 Certifications */}
          <BuilderSection {...sectionProps("certifications")}>
            {data.certifications.map((c) => (
              <EntryCard
                key={c.id}
                onRemove={() => removeEntry("certifications", c.id)}
              >
                <TextInput
                  label="Certification"
                  value={c.name}
                  placeholder="e.g., AWS Certified Cloud Practitioner"
                  onChange={(v) =>
                    patchEntry("certifications", c.id, { name: v })
                  }
                />
                <TextInput
                  label="Issuer"
                  value={c.issuer}
                  placeholder="e.g., Amazon Web Services"
                  onChange={(v) =>
                    patchEntry("certifications", c.id, { issuer: v })
                  }
                />
                <TextInput
                  label="Date"
                  value={c.date}
                  placeholder="e.g., March 2025"
                  onChange={(v) =>
                    patchEntry("certifications", c.id, { date: v })
                  }
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Certification"
              onClick={() =>
                addEntry("certifications", {
                  id: uid(),
                  name: "",
                  issuer: "",
                  date: "",
                })
              }
            />
          </BuilderSection>

          {/* 12 Custom sections */}
          <BuilderSection {...sectionProps("custom")}>
            {data.custom.map((c) => (
              <EntryCard key={c.id} onRemove={() => removeEntry("custom", c.id)}>
                <TextInput
                  label="Section Heading"
                  value={c.heading}
                  placeholder="e.g., Volunteering"
                  onChange={(v) => patchEntry("custom", c.id, { heading: v })}
                />
                <TextArea
                  label="Content"
                  value={c.content}
                  placeholder="Details for this section."
                  onChange={(v) => patchEntry("custom", c.id, { content: v })}
                />
              </EntryCard>
            ))}
            <AddButton
              label="Add Custom Section"
              onClick={() =>
                addEntry("custom", { id: uid(), heading: "", content: "" })
              }
            />
          </BuilderSection>

          <GeneratePanel onGenerate={handleGenerate} busy={busy} />
        </div>

        {/* --------------------------- Preview ---------------------------- */}
        <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {pages.length > 1 && (
            <div className="flex items-center justify-between border-2 border-black bg-white px-3 py-2 shadow-brutal">
              <button
                type="button"
                disabled={pageIdx === 0}
                onClick={() => setPageIdx((p) => Math.max(0, p - 1))}
                className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-brand disabled:opacity-40 disabled:hover:bg-white"
              >
                ← Prev
              </button>
              <p className="text-xs font-black uppercase tracking-widest">
                Page {pageIdx + 1} / {pages.length}
              </p>
              <button
                type="button"
                disabled={pageIdx === pages.length - 1}
                onClick={() =>
                  setPageIdx((p) => Math.min(pages.length - 1, p + 1))
                }
                className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-brand disabled:opacity-40 disabled:hover:bg-white"
              >
                Next →
              </button>
            </div>
          )}
          <div className="border-2 border-black bg-white p-3 shadow-brutal-lg">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-600">
              Live Canvas Preview — A4
            </p>
            <div className="border border-black/20">
              <ScaledPreview width={A4_W} height={A4_H}>
                <Page
                  data={data}
                  pageIndex={pageIdx}
                  totalPages={pages.length}
                >
                  {(pages[pageIdx] ?? []).map((i) => (
                    <div key={i}>{blocks[i]}</div>
                  ))}
                </Page>
              </ScaledPreview>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Off-screen: block measurement column + full-size pages for export */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-[-3000px]"
        style={{ zIndex: -1 }}
      >
        <div className={config.baseClass} style={{ width: config.contentWidth }}>
          {blocks.map((b, i) => (
            <div
              key={i}
              ref={(el) => {
                blockRefs.current[i] = el;
              }}
            >
              {b}
            </div>
          ))}
        </div>
        {pages.map((idxs, pi) => (
          <div
            key={pi}
            ref={(el) => {
              pageRefs.current[pi] = el;
            }}
          >
            <Page data={data} pageIndex={pi} totalPages={pages.length}>
              {idxs.map((i) => (
                <div key={i}>{blocks[i]}</div>
              ))}
            </Page>
          </div>
        ))}
      </div>
    </div>
  );
}
