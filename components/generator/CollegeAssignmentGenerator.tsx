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
} from "@/components/generator/assignment-templates";
import { ASSIGNMENT_TEMPLATES, BATCH_YEARS, SEMESTERS, University } from "@/lib/data";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementToPdf } from "@/lib/pdf";

/* ------------------------------------------------------------------ */
/* State                                                                */
/* ------------------------------------------------------------------ */
interface BatchState {
  label: string;
  hidden: boolean;
  start: string;
  end: string;
}

interface GenData {
  fullName: FieldState;
  enrNo: FieldState;
  batch: BatchState;
  semester: FieldState;
  course: FieldState;
  collegeName: FieldState;
  tagline: FieldState;
  logo: string | null;
  subjectName: FieldState;
  subjectCode: FieldState;
  docTitle: FieldState;
  submittedTo: FieldState;
  submissionDate: FieldState;
}

function defaultData(university: University): GenData {
  return {
    fullName: makeField("Full Name"),
    enrNo: makeField("Enrollment Number"),
    batch: { label: "Batch (YYYY–YYYY)", hidden: false, start: "2022", end: "2026" },
    semester: makeField("Semester"),
    course: makeField("Course"),
    collegeName: makeField("College Name", university.fullName),
    tagline: makeField("College Tagline", university.tagline),
    logo: null,
    subjectName: makeField("Subject Name"),
    subjectCode: makeField("Subject Code"),
    docTitle: makeField("Document Title"),
    submittedTo: makeField("Submitted To"),
    submissionDate: makeField("Submission Date"),
  };
}

/**
 * Map the college generator's field state onto the shared assignment
 * template props. Labels and hide toggles carry over as-is; fields the
 * templates have no slot for (batch, tagline) only appear in the built-in
 * "College Default" layout.
 */
function toTemplateProps(data: GenData): AssignmentTemplateProps {
  return {
    studentName: data.fullName,
    rollNumber: data.enrNo,
    subjectName: data.subjectName,
    subjectCode: data.subjectCode,
    courseName: data.course,
    faculty: data.submittedTo,
    semester: data.semester,
    college: data.collegeName,
    title: data.docTitle,
    submissionDate: data.submissionDate,
    logo: data.logo,
  };
}

/* ------------------------------------------------------------------ */
/* A4 cover page preview (794 x 1123 px)                               */
/* ------------------------------------------------------------------ */
function CoverPage({ data }: { data: GenData }) {
  const details: { label: string; value: string }[] = [];
  if (!data.fullName.hidden)
    details.push({ label: data.fullName.label, value: data.fullName.value });
  if (!data.enrNo.hidden)
    details.push({ label: data.enrNo.label, value: data.enrNo.value });
  if (!data.batch.hidden)
    details.push({
      label: "Batch",
      value: `${data.batch.start} – ${data.batch.end}`,
    });
  if (!data.semester.hidden)
    details.push({ label: data.semester.label, value: data.semester.value });
  if (!data.course.hidden)
    details.push({ label: data.course.label, value: data.course.value });
  if (!data.submittedTo.hidden)
    details.push({
      label: data.submittedTo.label,
      value: data.submittedTo.value,
    });
  if (!data.submissionDate.hidden)
    details.push({
      label: data.submissionDate.label,
      value: data.submissionDate.value,
    });

  const subjectLine =
    !data.subjectName.hidden &&
    (data.subjectName.value || !data.subjectCode.hidden)
      ? [
          data.subjectName.value,
          !data.subjectCode.hidden && data.subjectCode.value
            ? `(${data.subjectCode.value})`
            : "",
        ]
          .filter(Boolean)
          .join(" ")
      : "";

  return (
    <div
      style={{ width: A4_W, height: A4_H }}
      className="flex flex-col bg-white px-16 py-14 font-serif text-black"
    >
      {/* Header: logo, college name, tagline */}
      <div className="flex flex-col items-center text-center">
        {data.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.logo}
            alt="College logo"
            className="mb-6 h-32 max-w-[60%] object-contain"
          />
        )}
        {!data.collegeName.hidden && (
          <h1 className="text-[32px] font-bold leading-tight tracking-tight">
            {data.collegeName.value}
          </h1>
        )}
        {!data.tagline.hidden && data.tagline.value && (
          <p className="mt-2 text-lg italic text-slate-700">
            {data.tagline.value}
          </p>
        )}
        <div className="mt-6 h-1 w-40 bg-black" />
      </div>

      {/* Title + subject */}
      <div className="mt-24 flex flex-col items-center text-center">
        {!data.docTitle.hidden && (
          <h2 className="text-[26px] font-bold underline decoration-2 underline-offset-8">
            {data.docTitle.value || "Assignment Name Here"}
          </h2>
        )}
        {subjectLine && (
          <p className="mt-6 text-xl">
            <span className="font-semibold">Subject:</span> {subjectLine}
          </p>
        )}
      </div>

      {/* Details block */}
      <div className="mx-auto mb-10 mt-auto w-[72%]">
        <div className="space-y-4">
          {details.map((d) => (
            <div
              key={d.label}
              className="grid grid-cols-[220px_1fr] items-end gap-3 text-lg"
            >
              <span className="font-semibold">{d.label}:</span>
              <span
                className={
                  d.value
                    ? ""
                    : "block min-h-6 border-b border-dotted border-slate-400"
                }
              >
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generator                                                            */
/* ------------------------------------------------------------------ */
export default function CollegeAssignmentGenerator({
  university,
}: {
  university: University;
}) {
  const toolKey = `assignment-college-${university.slug}`;
  const router = useRouter();
  const searchParams = useSearchParams();

  // ?template= — a valid id swaps in the shared template component;
  // absent/unknown keeps the built-in formal college layout.
  const rawTemplate = searchParams.get("template");
  const templateId =
    rawTemplate && rawTemplate in ASSIGNMENT_TEMPLATE_COMPONENTS
      ? rawTemplate
      : null;

  const [data, setData] = useState<GenData>(() => defaultData(university));
  const [busy, setBusy] = useState(false);
  const hydrated = useRef(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const selectTemplate = useCallback(
    (id: string | null) => {
      router.replace(
        id
          ? `/assignment-cover/${university.slug}/generator?template=${id}`
          : `/assignment-cover/${university.slug}/generator`,
        { scroll: false }
      );
    },
    [router, university.slug]
  );

  // Load autosaved state on mount.
  useEffect(() => {
    const saved = loadAutosave<Partial<GenData>>(toolKey);
    if (saved) setData({ ...defaultData(university), ...saved });
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolKey]);

  // Autosave on every change.
  useEffect(() => {
    if (hydrated.current) saveAutosave(toolKey, data);
  }, [toolKey, data]);

  const set =
    <K extends keyof GenData>(key: K) =>
    (next: GenData[K]) =>
      setData((d) => ({ ...d, [key]: next }));

  const handleGenerate = async () => {
    if (!exportRef.current || busy) return;
    setBusy(true);
    try {
      await exportElementToPdf(
        exportRef.current,
        `${university.slug}-assignment-cover.pdf`
      );
    } finally {
      setBusy(false);
    }
  };

  const Template = templateId ? ASSIGNMENT_TEMPLATE_COMPONENTS[templateId] : null;
  const pageNode = Template ? (
    <Template {...toTemplateProps(data)} />
  ) : (
    <CoverPage data={data} />
  );

  return (
    <div className="bg-grid-paper">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
          {university.shortName}{" "}
          <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
            Assignment Front Page
          </span>
        </h1>
        <p className="mt-3 text-sm font-medium text-slate-700">
          Fill in your details below — the live preview updates instantly.
        </p>

        {/* Template switcher strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            Template
          </span>
          <button
            type="button"
            onClick={() => selectTemplate(null)}
            aria-pressed={templateId === null}
            className={`border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
              templateId === null
                ? "translate-x-0.5 translate-y-0.5 bg-brand shadow-none"
                : "bg-white shadow-brutal-sm hover:bg-brand/20"
            }`}
          >
            College Default
          </button>
          {ASSIGNMENT_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTemplate(t.id)}
              aria-pressed={templateId === t.id}
              className={`border-2 border-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                templateId === t.id
                  ? "translate-x-0.5 translate-y-0.5 bg-brand shadow-none"
                  : "bg-white shadow-brutal-sm hover:bg-brand/20"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
          {/* Form column */}
          <div className="space-y-6">
            <DraftBar<GenData>
              tool={toolKey}
              getData={() => data}
              onLoad={(d) => setData({ ...defaultData(university), ...d })}
              onDiscard={() => {
                clearAutosave(toolKey);
                setData(defaultData(university));
              }}
            />

            <GenSection number="01" title="Student Details">
              <FieldRow
                field={data.fullName}
                onChange={set("fullName")}
                placeholder="e.g. Aarav Sharma"
                editableLabel
              />
              <FieldRow
                field={data.enrNo}
                onChange={set("enrNo")}
                placeholder="e.g. 2022BTCS042"
                editableLabel
              />

              {/* Batch: two year selects */}
              <div className={data.batch.hidden ? "opacity-50" : ""}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-700">
                    {data.batch.label}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      set("batch")({ ...data.batch, hidden: !data.batch.hidden })
                    }
                    className={`border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm transition-colors ${
                      data.batch.hidden
                        ? "bg-black text-brand"
                        : "bg-white hover:bg-brand"
                    }`}
                  >
                    {data.batch.hidden ? "Include" : "Hide"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-slate-100"
                    value={data.batch.start}
                    disabled={data.batch.hidden}
                    aria-label="Batch start year"
                    onChange={(e) =>
                      set("batch")({ ...data.batch, start: e.target.value })
                    }
                  >
                    {BATCH_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-slate-100"
                    value={data.batch.end}
                    disabled={data.batch.hidden}
                    aria-label="Batch end year"
                    onChange={(e) =>
                      set("batch")({ ...data.batch, end: e.target.value })
                    }
                  >
                    {BATCH_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <SelectRow
                field={data.semester}
                onChange={set("semester")}
                options={SEMESTERS}
                placeholderOption="Select semester"
              />
              <FieldRow
                field={data.course}
                onChange={set("course")}
                placeholder="e.g. B.Tech Computer Science"
                editableLabel
              />
              <FieldRow
                field={data.collegeName}
                onChange={set("collegeName")}
                editableLabel
              />
              <FieldRow
                field={data.tagline}
                onChange={set("tagline")}
                placeholder="Optional tagline shown under the college name"
                editableLabel
              />
              <LogoUpload value={data.logo} onChange={set("logo")} />
            </GenSection>

            <GenSection number="02" title="Subject / Project Info">
              <FieldRow
                field={data.subjectName}
                onChange={set("subjectName")}
                placeholder="e.g. Digital Forensics"
                editableLabel
              />
              <FieldRow
                field={data.subjectCode}
                onChange={set("subjectCode")}
                placeholder="e.g. CTMTCS-101"
                editableLabel
              />
              <FieldRow
                field={data.docTitle}
                onChange={set("docTitle")}
                placeholder="e.g. Assignment 1 — Network Security"
                editableLabel
              />
              <FieldRow
                field={data.submittedTo}
                onChange={set("submittedTo")}
                placeholder="e.g. Prof. R. K. Verma"
                editableLabel
              />
              <FieldRow
                field={data.submissionDate}
                onChange={set("submissionDate")}
                placeholder="e.g. 12 July 2026"
                editableLabel
              />
            </GenSection>

            <GeneratePanel onGenerate={handleGenerate} busy={busy} />
          </div>

          {/* Preview column */}
          <div className="lg:sticky lg:top-6">
            <div className="border-2 border-black bg-white p-3 shadow-brutal-lg">
              <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-600">
                Live Preview
              </p>
              <div className="border border-black/20">
                <ScaledPreview width={A4_W} height={A4_H}>
                  {pageNode}
                </ScaledPreview>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen full-size copy used for PDF export */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -10000, top: 0, zIndex: -1 }}
      >
        <div ref={exportRef} style={{ width: A4_W, height: A4_H }}>
          {pageNode}
        </div>
      </div>
    </div>
  );
}
