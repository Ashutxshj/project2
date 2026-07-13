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
  makeField,
} from "@/components/generator/ui";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementToPdf } from "@/lib/pdf";

const TOOL = "synopsis";

type FieldKey =
  | "studyTitle"
  | "organization"
  | "program"
  | "studentName"
  | "enrollment"
  | "collegeName"
  | "collegeCampus"
  | "collegeCity"
  | "academicYear";

interface SynopsisData {
  fields: Record<FieldKey, FieldState>;
  logo: string | null;
}

function initialData(): SynopsisData {
  return {
    fields: {
      studyTitle: makeField("Study Title"),
      organization: makeField("Organization / Company"),
      program: makeField("Program / Degree"),
      studentName: makeField("Student Name"),
      enrollment: makeField("Enrollment Number"),
      collegeName: makeField("College Name"),
      collegeCampus: makeField("College Campus Line"),
      collegeCity: makeField("College City & State Line"),
      academicYear: makeField("Academic Year"),
    },
    logo: null,
  };
}

/* ------------------------------------------------------------------ */
/* A4 cover preview (794 x 1123)                                       */
/* ------------------------------------------------------------------ */
function CoverPreview({ data }: { data: SynopsisData }) {
  const f = data.fields;
  const text = (key: FieldKey, fallback: string) =>
    f[key].value.trim() || fallback;
  const visible = (key: FieldKey) => !f[key].hidden;

  return (
    <div
      className="flex flex-col items-center bg-white px-16 py-14 text-center font-serif text-black"
      style={{ width: A4_W, height: A4_H }}
    >
      {/* Study title block */}
      <p className="text-sm uppercase tracking-[0.3em] text-neutral-600">
        A Synopsis On
      </p>
      {visible("studyTitle") && (
        <h1 className="mx-auto mt-4 max-w-xl text-4xl font-bold leading-tight">
          {text("studyTitle", "Title of the Proposed Study")}
        </h1>
      )}
      {visible("organization") && (
        <p className="mt-6 text-xl font-semibold">
          {text("organization", "Organization / Company")}
        </p>
      )}
      {visible("program") && (
        <p className="mt-3 text-base italic">
          {text("program", "Program / Degree")}
        </p>
      )}
      <div className="mt-8 h-0.5 w-40 bg-black" />

      {/* Student block */}
      {(visible("studentName") || visible("enrollment")) && (
        <div className="mt-12">
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
        </div>
      )}

      {/* College block pinned to the bottom */}
      <div className="mt-auto w-full pt-10">
        {data.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.logo}
            alt="College logo"
            className="mx-auto mb-5 h-28 w-28 object-contain"
          />
        )}
        {visible("collegeName") && (
          <p className="text-2xl font-bold uppercase leading-snug tracking-wide">
            {text("collegeName", "Your College Name")}
          </p>
        )}
        {visible("collegeCampus") && (
          <p className="mt-2 text-base font-medium">
            {text("collegeCampus", "Campus Name / Address Line")}
          </p>
        )}
        {visible("collegeCity") && (
          <p className="mt-1 text-base font-medium">
            {text("collegeCity", "City, State")}
          </p>
        )}
        {visible("academicYear") && (
          <p className="mt-3 text-base">
            Academic Year: {text("academicYear", "2025-2026")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */
export default function SynopsisGenerator() {
  const [data, setData] = useState<SynopsisData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [busy, setBusy] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadAutosave<SynopsisData>(TOOL);
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
        "synopsis-cover.pdf",
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
          <DraftBar<SynopsisData>
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
              field={f.studyTitle}
              onChange={setField("studyTitle")}
              placeholder="e.g., A Study on Consumer Buying Behaviour"
              editableLabel
            />
            <FieldRow
              field={f.organization}
              onChange={setField("organization")}
              placeholder="e.g., Reliance Retail Limited"
              editableLabel
            />
            <FieldRow
              field={f.program}
              onChange={setField("program")}
              placeholder="e.g., Master of Business Administration"
              editableLabel
            />
          </GenSection>

          <GenSection number="02" title="Student Information">
            <FieldRow
              field={f.studentName}
              onChange={setField("studentName")}
              placeholder="e.g., Priya Singh"
              editableLabel
            />
            <FieldRow
              field={f.enrollment}
              onChange={setField("enrollment")}
              placeholder="e.g., 2024MBA015"
              editableLabel
            />
          </GenSection>

          <GenSection number="03" title="Institution">
            <FieldRow
              field={f.collegeName}
              onChange={setField("collegeName")}
              placeholder="e.g., Symbiosis Institute of Management"
              editableLabel
            />
            <FieldRow
              field={f.collegeCampus}
              onChange={setField("collegeCampus")}
              placeholder="e.g., Lavale Campus, Hilltop Road"
              editableLabel
            />
            <FieldRow
              field={f.collegeCity}
              onChange={setField("collegeCity")}
              placeholder="e.g., Pune, Maharashtra"
              editableLabel
            />
            <FieldRow
              field={f.academicYear}
              onChange={setField("academicYear")}
              placeholder="e.g., 2025-2026"
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
