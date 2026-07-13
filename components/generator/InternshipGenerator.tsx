"use client";

import { useEffect, useRef, useState } from "react";
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
import { MONTHS, YEARS } from "@/lib/data";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementToPdf } from "@/lib/pdf";

const TOOL = "internship-report";

type FieldKey =
  | "reportTitle"
  | "organization"
  | "program"
  | "submissionDate"
  | "supervisorName"
  | "supervisorDesignation"
  | "studentName"
  | "enrollment"
  | "startMonth"
  | "startYear"
  | "endMonth"
  | "endYear"
  | "department"
  | "college"
  | "location";

interface InternshipData {
  fields: Record<FieldKey, FieldState>;
  logo: string | null;
}

function initialData(): InternshipData {
  return {
    fields: {
      reportTitle: makeField("Report Title"),
      organization: makeField("Organization / Company Name"),
      program: makeField("Program / Degree"),
      submissionDate: makeField("Submission Date"),
      supervisorName: makeField("Supervisor Name"),
      supervisorDesignation: makeField("Designation"),
      studentName: makeField("Student Name"),
      enrollment: makeField("Enrollment Number"),
      startMonth: makeField("Start Month"),
      startYear: makeField("Start Year"),
      endMonth: makeField("End Month"),
      endYear: makeField("End Year"),
      department: makeField("Department Name"),
      college: makeField("College / University Name"),
      location: makeField("Location / Pincode"),
    },
    logo: null,
  };
}

function formatSubmissionDate(value: string) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/* A4 cover preview (794 x 1123)                                       */
/* ------------------------------------------------------------------ */
function CoverPreview({ data }: { data: InternshipData }) {
  const f = data.fields;
  const text = (key: FieldKey, fallback: string) =>
    f[key].value.trim() || fallback;
  const visible = (key: FieldKey) => !f[key].hidden;

  const startPart = [
    visible("startMonth") ? f["startMonth"].value : "",
    visible("startYear") ? f["startYear"].value : "",
  ]
    .filter(Boolean)
    .join(" ");
  const endPart = [
    visible("endMonth") ? f["endMonth"].value : "",
    visible("endYear") ? f["endYear"].value : "",
  ]
    .filter(Boolean)
    .join(" ");
  const showDuration =
    visible("startMonth") ||
    visible("startYear") ||
    visible("endMonth") ||
    visible("endYear");
  const duration =
    startPart && endPart
      ? `${startPart} – ${endPart}`
      : startPart || endPart || "June 2025 – July 2025";

  return (
    <div
      className="flex flex-col items-center bg-white px-16 py-14 text-center font-serif text-black"
      style={{ width: A4_W, height: A4_H }}
    >
      {/* Institution header */}
      {data.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.logo}
          alt="College logo"
          className="mb-5 h-28 w-28 object-contain"
        />
      )}
      {visible("college") && (
        <h1 className="text-3xl font-bold uppercase leading-snug tracking-wide">
          {text("college", "Your College / University Name")}
        </h1>
      )}
      {visible("department") && (
        <p className="mt-2 text-lg font-medium">
          {text("department", "Department Name")}
        </p>
      )}
      <div className="mt-6 h-0.5 w-40 bg-black" />

      {/* Report title block */}
      <div className="mt-12">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-600">
          An Internship Report On
        </p>
        {visible("reportTitle") && (
          <h2 className="mx-auto mt-4 max-w-xl text-4xl font-bold leading-tight">
            {text("reportTitle", "Internship Report Title")}
          </h2>
        )}
        {visible("organization") && (
          <p className="mt-5 text-xl font-semibold">
            {text("organization", "Organization / Company Name")}
          </p>
        )}
        {visible("program") && (
          <p className="mt-3 text-base italic">
            {text("program", "Program / Degree")}
          </p>
        )}
      </div>

      {/* Supervisor block */}
      {(visible("supervisorName") || visible("supervisorDesignation")) && (
        <div className="mt-12">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-600">
            Under the Supervision of
          </p>
          {visible("supervisorName") && (
            <p className="mt-2 text-lg font-semibold">
              {text("supervisorName", "Supervisor Name")}
            </p>
          )}
          {visible("supervisorDesignation") && (
            <p className="mt-1 text-base">
              {text("supervisorDesignation", "Designation")}
            </p>
          )}
        </div>
      )}

      {/* Student block */}
      {(visible("studentName") || visible("enrollment") || showDuration) && (
        <div className="mt-10">
          <p className="text-sm uppercase tracking-[0.3em] text-neutral-600">
            Submitted By
          </p>
          {visible("studentName") && (
            <p className="mt-2 text-lg font-semibold">
              {text("studentName", "Student Name")}
            </p>
          )}
          {visible("enrollment") && (
            <p className="mt-1 text-base">
              Enrollment No: {text("enrollment", "0000000000")}
            </p>
          )}
          {showDuration && (
            <p className="mt-1 text-base">Internship Duration: {duration}</p>
          )}
        </div>
      )}

      {/* Footer: location + date */}
      <div className="mt-auto w-full pt-10">
        <div className="mx-auto mb-5 h-0.5 w-40 bg-black" />
        {visible("location") && (
          <p className="text-base font-medium">
            {text("location", "City, Pincode")}
          </p>
        )}
        {visible("submissionDate") && (
          <p className="mt-1 text-base">
            {formatSubmissionDate(f["submissionDate"].value) || "1 July 2025"}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */
export default function InternshipGenerator() {
  const [data, setData] = useState<InternshipData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadAutosave<InternshipData>(TOOL);
    if (saved?.fields) {
      setData((d) => ({
        fields: { ...d.fields, ...saved.fields },
        logo: saved.logo ?? null,
      }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveAutosave(TOOL, data);
  }, [data, hydrated]);

  const setField = (key: FieldKey) => (next: FieldState) =>
    setData((d) => ({ ...d, fields: { ...d.fields, [key]: next } }));

  const handleGenerate = async () => {
    if (!exportRef.current || busy) return;
    setBusy(true);
    try {
      await exportElementToPdf(
        exportRef.current,
        "internship-report-cover.pdf",
        "portrait"
      );
    } finally {
      setBusy(false);
    }
  };

  const f = data.fields;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        {/* Form column */}
        <div className="space-y-6">
          <DraftBar<InternshipData>
            tool={TOOL}
            getData={() => data}
            onLoad={(d) => setData(d)}
            onDiscard={() => {
              clearAutosave(TOOL);
              setData(initialData());
            }}
          />

          <GenSection number="01" title="Document Details">
            <FieldRow
              field={f.reportTitle}
              onChange={setField("reportTitle")}
              placeholder="e.g., Summer Internship Report"
              editableLabel
            />
            <FieldRow
              field={f.organization}
              onChange={setField("organization")}
              placeholder="e.g., Infosys Limited"
              editableLabel
            />
            <FieldRow
              field={f.program}
              onChange={setField("program")}
              placeholder="e.g., Bachelor of Technology in Computer Science"
              editableLabel
            />
            <FieldRow
              field={f.submissionDate}
              onChange={setField("submissionDate")}
              type="date"
              editableLabel
            />
          </GenSection>

          <GenSection number="02" title="Supervisor Details">
            <FieldRow
              field={f.supervisorName}
              onChange={setField("supervisorName")}
              placeholder="e.g., Dr. A. K. Sharma"
              editableLabel
            />
            <FieldRow
              field={f.supervisorDesignation}
              onChange={setField("supervisorDesignation")}
              placeholder="e.g., Assistant Professor"
              editableLabel
            />
          </GenSection>

          <GenSection number="03" title="Student Details">
            <FieldRow
              field={f.studentName}
              onChange={setField("studentName")}
              placeholder="e.g., Rahul Verma"
              editableLabel
            />
            <FieldRow
              field={f.enrollment}
              onChange={setField("enrollment")}
              placeholder="e.g., 2021BTCS042"
              editableLabel
            />
            <div className="grid grid-cols-2 gap-3">
              <SelectRow
                field={f.startMonth}
                onChange={setField("startMonth")}
                options={MONTHS}
                placeholderOption="Select month"
              />
              <SelectRow
                field={f.startYear}
                onChange={setField("startYear")}
                options={YEARS}
                placeholderOption="Select year"
              />
              <SelectRow
                field={f.endMonth}
                onChange={setField("endMonth")}
                options={MONTHS}
                placeholderOption="Select month"
              />
              <SelectRow
                field={f.endYear}
                onChange={setField("endYear")}
                options={YEARS}
                placeholderOption="Select year"
              />
            </div>
          </GenSection>

          <GenSection number="04" title="Institution Details">
            <FieldRow
              field={f.department}
              onChange={setField("department")}
              placeholder="e.g., Department of Computer Science"
              editableLabel
            />
            <FieldRow
              field={f.college}
              onChange={setField("college")}
              placeholder="e.g., Indian Institute of Technology Delhi"
              editableLabel
            />
            <FieldRow
              field={f.location}
              onChange={setField("location")}
              placeholder="e.g., New Delhi, 110016"
              editableLabel
            />
            <LogoUpload
              value={data.logo}
              onChange={(logo) => setData((d) => ({ ...d, logo }))}
            />
          </GenSection>

          <GeneratePanel onGenerate={handleGenerate} busy={busy} />
        </div>

        {/* Sticky live preview */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <div className="border-2 border-black bg-white p-3 shadow-brutal-lg">
            <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-600">
              Live Preview — A4
            </p>
            <div className="border border-black/20">
              <ScaledPreview width={A4_W} height={A4_H}>
                <CoverPreview data={data} />
              </ScaledPreview>
            </div>
          </div>
        </div>
      </div>

      {/* Off-screen full-size copy used for PDF export */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-[-3000px]"
      >
        <div ref={exportRef}>
          <CoverPreview data={data} />
        </div>
      </div>
    </div>
  );
}
