"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  A4_H,
  A4_W,
  DraftBar,
  FieldRow,
  FieldState,
  GenSection,
  GeneratePanel,
  LogoUpload,
  ScaledPreview,
  SelectRow,
  makeField,
} from "@/components/generator/ui";
import {
  ASSIGNMENT_TEMPLATE_COMPONENTS,
  AssignmentTemplateProps,
  DEFAULT_TEMPLATE_ID,
  TEMPLATE_SWATCHES,
} from "@/components/generator/assignment-templates";
import { ASSIGNMENT_TEMPLATES, SEMESTERS } from "@/lib/data";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementToPdf } from "@/lib/pdf";

const TOOL = "assignment-custom";

type FieldKey =
  | "studentName"
  | "rollNumber"
  | "subjectName"
  | "subjectCode"
  | "courseName"
  | "faculty"
  | "semester"
  | "college"
  | "title"
  | "submissionDate";

type Fields = Record<FieldKey, FieldState>;

interface GenState {
  fields: Fields;
  logo: string | null;
}

function initialFields(): Fields {
  return {
    studentName: makeField("Student Name"),
    rollNumber: makeField("Roll Number"),
    subjectName: makeField("Subject Name"),
    subjectCode: makeField("Subject Code"),
    courseName: makeField("Course Name"),
    faculty: makeField("Submitted To"),
    semester: makeField("Semester"),
    college: makeField("College / University Name"),
    title: makeField("Assignment Title"),
    submissionDate: makeField("Submission Date"),
  };
}

/** Merge stored fields over defaults so old drafts survive schema changes. */
function mergeFields(saved?: Partial<Fields> | null): Fields {
  const base = initialFields();
  if (!saved) return base;
  (Object.keys(base) as FieldKey[]).forEach((k) => {
    const s = saved[k];
    if (s && typeof s.value === "string") {
      base[k] = { value: s.value, label: s.label ?? base[k].label, hidden: !!s.hidden };
    }
  });
  return base;
}

export default function CustomAssignmentGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTemplate = searchParams.get("template") ?? "";
  const templateId = ASSIGNMENT_TEMPLATES.some((t) => t.id === rawTemplate)
    ? rawTemplate
    : DEFAULT_TEMPLATE_ID;

  const [fields, setFields] = useState<Fields>(initialFields);
  const [logo, setLogo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const hydrated = useRef(false);
  const exportRef = useRef<HTMLDivElement>(null);

  /* Hydrate from autosave once on mount */
  useEffect(() => {
    const saved = loadAutosave<GenState>(TOOL);
    if (saved) {
      setFields(mergeFields(saved.fields));
      setLogo(saved.logo ?? null);
    }
    hydrated.current = true;
  }, []);

  /* Autosave on every change (after hydration) */
  useEffect(() => {
    if (!hydrated.current) return;
    saveAutosave<GenState>(TOOL, { fields, logo });
  }, [fields, logo]);

  const setField = useCallback(
    (key: FieldKey) => (next: FieldState) =>
      setFields((f) => ({ ...f, [key]: next })),
    []
  );

  const selectTemplate = useCallback(
    (id: string) => {
      router.replace(`/assignment-cover/custom/generator?template=${id}`, {
        scroll: false,
      });
    },
    [router]
  );

  const handleGenerate = useCallback(async () => {
    const node = exportRef.current;
    if (!node || busy) return;
    setBusy(true);
    try {
      await exportElementToPdf(node, `assignment-cover-${templateId}.pdf`);
    } finally {
      setBusy(false);
    }
  }, [busy, templateId]);

  const Template =
    ASSIGNMENT_TEMPLATE_COMPONENTS[templateId] ??
    ASSIGNMENT_TEMPLATE_COMPONENTS[DEFAULT_TEMPLATE_ID];
  const templateProps: AssignmentTemplateProps = { ...fields, logo };
  const activeMeta = ASSIGNMENT_TEMPLATES.find((t) => t.id === templateId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Heading */}
      <div className="mb-8">
        <span className="inline-block border-2 border-black bg-brand px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm">
          Custom Templates
        </span>
        <h1 className="mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Assignment Cover Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
          Fill in your details, pick a template, and export a print-ready A4
          cover page as PDF. Everything runs in your browser — no sign-up, no
          watermark.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        {/* ---------------- Left: form ---------------- */}
        <div className="space-y-6">
          <DraftBar<GenState>
            tool={TOOL}
            getData={() => ({ fields, logo })}
            onLoad={(d) => {
              setFields(mergeFields(d.fields));
              setLogo(d.logo ?? null);
            }}
            onDiscard={() => {
              setFields(initialFields());
              setLogo(null);
              clearAutosave(TOOL);
            }}
          />

          <GenSection number="01" title="Choose a template">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ASSIGNMENT_TEMPLATES.map((t) => {
                const active = t.id === templateId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTemplate(t.id)}
                    aria-pressed={active}
                    className={`border-2 border-black p-2 text-left transition-all ${
                      active
                        ? "bg-brand shadow-none translate-x-0.5 translate-y-0.5"
                        : "bg-white shadow-brutal-sm hover:bg-brand/20"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="mb-1.5 block h-6 w-full border border-black"
                      style={{ background: TEMPLATE_SWATCHES[t.id] }}
                    />
                    <span className="block text-[11px] font-black uppercase leading-tight tracking-wide">
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {activeMeta && (
              <p className="text-xs font-medium text-slate-500">
                {activeMeta.description}
              </p>
            )}
          </GenSection>

          <GenSection number="02" title="Student details">
            <FieldRow
              field={fields.studentName}
              onChange={setField("studentName")}
              placeholder="e.g. Ashutosh Jha"
              editableLabel
            />
            <FieldRow
              field={fields.rollNumber}
              onChange={setField("rollNumber")}
              placeholder="e.g. 2024BCS1234"
              editableLabel
            />
            <FieldRow
              field={fields.courseName}
              onChange={setField("courseName")}
              placeholder="e.g. B.Tech Computer Science"
              editableLabel
            />
            <SelectRow
              field={fields.semester}
              onChange={setField("semester")}
              options={SEMESTERS}
              placeholderOption="Select semester"
            />
          </GenSection>

          <GenSection number="03" title="Assignment details">
            <FieldRow
              field={fields.title}
              onChange={setField("title")}
              placeholder="e.g. Design and Analysis of Algorithms"
              editableLabel
              multiline
            />
            <FieldRow
              field={fields.subjectName}
              onChange={setField("subjectName")}
              placeholder="e.g. Data Structures"
              editableLabel
            />
            <FieldRow
              field={fields.subjectCode}
              onChange={setField("subjectCode")}
              placeholder="e.g. CS-201"
              editableLabel
            />
            <FieldRow
              field={fields.faculty}
              onChange={setField("faculty")}
              placeholder="e.g. Prof. R. Sharma"
              editableLabel
            />
            <FieldRow
              field={fields.submissionDate}
              onChange={setField("submissionDate")}
              type="date"
              editableLabel
            />
          </GenSection>

          <GenSection number="04" title="College & branding">
            <FieldRow
              field={fields.college}
              onChange={setField("college")}
              placeholder="e.g. Indian Institute of Technology Delhi"
              editableLabel
            />
            <LogoUpload value={logo} onChange={setLogo} />
          </GenSection>

          <GeneratePanel onGenerate={handleGenerate} busy={busy} />
        </div>

        {/* ---------------- Right: sticky live preview ---------------- */}
        <div className="lg:sticky lg:top-6">
          <div className="border-2 border-black bg-white shadow-brutal-lg">
            <div className="flex items-center justify-between border-b-2 border-black bg-brand/40 px-4 py-3">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Live preview
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                A4 · {activeMeta?.name ?? templateId}
              </span>
            </div>
            <div className="bg-grid-paper p-4">
              <div className="border border-black/20">
                <ScaledPreview width={A4_W} height={A4_H}>
                  <Template {...templateProps} />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-size A4 node used for PDF export */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: -20000,
          pointerEvents: "none",
        }}
      >
        <div ref={exportRef}>
          <Template {...templateProps} />
        </div>
      </div>
    </main>
  );
}
