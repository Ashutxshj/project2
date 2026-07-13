"use client";

import { useEffect, useRef, useState } from "react";
import {
  A4L_H,
  A4L_W,
  DraftBar,
  FieldRow,
  FieldState,
  GeneratePanel,
  GenSection,
  makeField,
  ScaledPreview,
  SelectRow,
} from "@/components/generator/ui";
import { CERTIFICATE_DESCRIPTIONS } from "@/lib/data";
import { clearAutosave, loadAutosave, saveAutosave } from "@/lib/drafts";
import { exportElementToPdf } from "@/lib/pdf";

/* ------------------------------------------------------------------ */
/* Templates                                                           */
/* ------------------------------------------------------------------ */
type TemplateId = "classic-blue" | "vintage-black" | "completion-dark";

const TEMPLATES: {
  id: TemplateId;
  name: string;
  description: string;
  image: string;
}[] = [
  {
    id: "classic-blue",
    name: "Classic Blue",
    description: "Ornate blue guilloché border with a formal serif layout.",
    image: "/certificate-template.png",
  },
  {
    id: "vintage-black",
    name: "Vintage Black",
    description: "Vintage black & cream design with calligraphic flourishes.",
    image: "/certificate-template-1.png",
  },
  {
    id: "completion-dark",
    name: "Completion Dark",
    description: "Modern dark slate design with gold corner accents.",
    image: "/certificate-template-2.png",
  },
];

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */
interface CertificateData {
  template: TemplateId;
  name: FieldState;
  subtitle: FieldState;
  description: FieldState;
  date: FieldState;
  signature: FieldState;
}

function defaultData(): CertificateData {
  return {
    template: "classic-blue",
    name: makeField("Recipient Name"),
    subtitle: makeField("Subtitle"),
    description: makeField("Description", CERTIFICATE_DESCRIPTIONS[0]),
    date: makeField("Date"),
    signature: makeField("Signature"),
  };
}

const TOOL = "certificate";

/* ------------------------------------------------------------------ */
/* Preview typography helpers                                          */
/* ------------------------------------------------------------------ */
const SERIF = "Georgia, 'Times New Roman', serif";
const SCRIPT = "'Brush Script MT', 'Segoe Script', 'Lucida Handwriting', cursive";
const CREAM = "#f7f3e8";

function show(f: FieldState) {
  return !f.hidden && f.value.trim() !== "";
}

/* ------------------------------------------------------------------ */
/* A4 landscape certificate page (1123 x 794)                          */
/* ------------------------------------------------------------------ */
function CertificatePage({ data }: { data: CertificateData }) {
  const tpl = TEMPLATES.find((t) => t.id === data.template) ?? TEMPLATES[0];
  return (
    <div
      style={{
        width: A4L_W,
        height: A4L_H,
        position: "relative",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Full-bleed template art — plain <img> so html2canvas captures it */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tpl.image}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
        }}
      />

      {data.template === "classic-blue" && <ClassicBlueOverlay data={data} />}
      {data.template === "vintage-black" && <VintageBlackOverlay data={data} />}
      {data.template === "completion-dark" && (
        <CompletionDarkOverlay data={data} />
      )}
    </div>
  );
}

/* Classic Blue: title + "presented to" + DATE/SIGNATURE lines are baked
   into the art; text goes in the open centre and above the two lines.  */
function ClassicBlueOverlay({ data }: { data: CertificateData }) {
  return (
    <>
      {show(data.name) && (
        <div
          style={{
            position: "absolute",
            top: "37%",
            left: "10%",
            width: "80%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 52,
            fontWeight: 600,
            color: "#16337a",
            letterSpacing: 2,
            lineHeight: 1.1,
          }}
        >
          {data.name.value}
        </div>
      )}
      {show(data.subtitle) && (
        <div
          style={{
            position: "absolute",
            top: "48.5%",
            left: "15%",
            width: "70%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 22,
            fontStyle: "italic",
            color: "#334155",
          }}
        >
          {data.subtitle.value}
        </div>
      )}
      {show(data.description) && (
        <div
          style={{
            position: "absolute",
            top: "57%",
            left: "20%",
            width: "60%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#475569",
          }}
        >
          {data.description.value}
        </div>
      )}
      {show(data.date) && (
        <div
          style={{
            position: "absolute",
            top: "78.4%",
            left: "19%",
            width: "17%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 17,
            color: "#1f2937",
          }}
        >
          {data.date.value}
        </div>
      )}
      {show(data.signature) && (
        <div
          style={{
            position: "absolute",
            top: "77.4%",
            left: "68.5%",
            width: "17%",
            textAlign: "center",
            fontFamily: SCRIPT,
            fontSize: 24,
            color: "#1f2937",
          }}
        >
          {data.signature.value}
        </div>
      )}
    </>
  );
}

/* Vintage Black: the art carries baked-in "Name" / "Details" / "Date" /
   "Signature" placeholders on flat cream, so each text block sits on a
   cream panel that covers the placeholder underneath it.               */
function VintageBlackOverlay({ data }: { data: CertificateData }) {
  return (
    <>
      {show(data.name) && (
        <div
          style={{
            position: "absolute",
            top: "36.5%",
            left: "28%",
            width: "44%",
            height: "11%",
            background: CREAM,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: SCRIPT,
            fontSize: 46,
            color: "#1c1917",
            lineHeight: 1.05,
            textAlign: "center",
          }}
        >
          {data.name.value}
        </div>
      )}
      {(show(data.subtitle) || show(data.description)) && (
        <div
          style={{
            position: "absolute",
            top: "52.5%",
            left: "22%",
            width: "56%",
            height: "19%",
            background: CREAM,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
            paddingTop: 6,
            textAlign: "center",
          }}
        >
          {show(data.subtitle) && (
            <div
              style={{
                fontFamily: SERIF,
                fontSize: 19,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#292524",
              }}
            >
              {data.subtitle.value}
            </div>
          )}
          {show(data.description) && (
            <div
              style={{
                width: "92%",
                fontFamily: SERIF,
                fontSize: 15.5,
                lineHeight: 1.6,
                color: "#44403c",
              }}
            >
              {data.description.value}
            </div>
          )}
        </div>
      )}
      {show(data.date) && (
        <div
          style={{
            position: "absolute",
            top: "79%",
            left: "13%",
            width: "23%",
            height: "6%",
            background: CREAM,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontFamily: SERIF,
            fontSize: 17,
            color: "#1c1917",
          }}
        >
          {data.date.value}
        </div>
      )}
      {show(data.signature) && (
        <div
          style={{
            position: "absolute",
            top: "78.5%",
            left: "62.5%",
            width: "24%",
            height: "6.5%",
            background: CREAM,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            fontFamily: SCRIPT,
            fontSize: 26,
            color: "#1c1917",
          }}
        >
          {data.signature.value}
        </div>
      )}
    </>
  );
}

/* Completion Dark: big open centre under the baked title; DATE and
   SIGNATURE dotted lines sit at the bottom of the inner sheet.         */
function CompletionDarkOverlay({ data }: { data: CertificateData }) {
  return (
    <>
      {show(data.name) && (
        <div
          style={{
            position: "absolute",
            top: "39%",
            left: "12%",
            width: "76%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 52,
            fontWeight: 600,
            color: "#2b3547",
            letterSpacing: 1,
            lineHeight: 1.1,
          }}
        >
          {data.name.value}
        </div>
      )}
      {show(data.subtitle) && (
        <div
          style={{
            position: "absolute",
            top: "51.5%",
            left: "15%",
            width: "70%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 19,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a17c3f",
          }}
        >
          {data.subtitle.value}
        </div>
      )}
      {show(data.description) && (
        <div
          style={{
            position: "absolute",
            top: "58.5%",
            left: "21%",
            width: "58%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 15.5,
            lineHeight: 1.65,
            color: "#4b5563",
          }}
        >
          {data.description.value}
        </div>
      )}
      {show(data.date) && (
        <div
          style={{
            position: "absolute",
            top: "75.5%",
            left: "19%",
            width: "18%",
            textAlign: "center",
            fontFamily: SERIF,
            fontSize: 17,
            color: "#2b3547",
          }}
        >
          {data.date.value}
        </div>
      )}
      {show(data.signature) && (
        <div
          style={{
            position: "absolute",
            top: "74.5%",
            left: "62.5%",
            width: "18%",
            textAlign: "center",
            fontFamily: SCRIPT,
            fontSize: 24,
            color: "#2b3547",
          }}
        >
          {data.signature.value}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */
export default function CertificateGenerator() {
  const [data, setData] = useState<CertificateData>(defaultData);
  const [busy, setBusy] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // Restore autosaved session once on mount (client only).
  useEffect(() => {
    const saved = loadAutosave<CertificateData>(TOOL);
    if (saved) setData({ ...defaultData(), ...saved });
    hydrated.current = true;
  }, []);

  // Autosave on every change after hydration.
  useEffect(() => {
    if (hydrated.current) saveAutosave(TOOL, data);
  }, [data]);

  const setField =
    (key: "name" | "subtitle" | "description" | "date" | "signature") =>
    (next: FieldState) =>
      setData((d) => ({ ...d, [key]: next }));

  const handleGenerate = async () => {
    if (!exportRef.current || busy) return;
    setBusy(true);
    try {
      await exportElementToPdf(exportRef.current, "certificate.pdf", "landscape");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Form column */}
      <div className="space-y-6 lg:col-span-2">
        <DraftBar<CertificateData>
          tool={TOOL}
          getData={() => data}
          onLoad={(d) => setData({ ...defaultData(), ...d })}
          onDiscard={() => {
            clearAutosave(TOOL);
            setData(defaultData());
          }}
        />

        <GenSection number="01" title="Template">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setData((d) => ({ ...d, template: t.id }))}
                aria-pressed={data.template === t.id}
                className={`flex flex-col border-2 border-black p-2 text-left transition-all ${
                  data.template === t.id
                    ? "bg-brand shadow-brutal"
                    : "bg-white shadow-brutal-sm hover:bg-brand/20"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={`${t.name} certificate template`}
                  className="aspect-[1123/794] w-full border border-black/20 object-cover bg-white"
                />
                <span className="mt-2 text-xs font-black uppercase tracking-widest">
                  {t.name}
                </span>
                <span className="mt-1 text-[11px] font-medium leading-snug text-slate-700">
                  {t.description}
                </span>
              </button>
            ))}
          </div>
        </GenSection>

        <GenSection number="02" title="Recipient Details">
          <FieldRow
            field={data.name}
            onChange={setField("name")}
            placeholder="e.g. Aarav Sharma"
          />
          <FieldRow
            field={data.subtitle}
            onChange={setField("subtitle")}
            placeholder="e.g. For Outstanding Achievement"
          />
          <SelectRow
            field={data.description}
            onChange={setField("description")}
            options={[...CERTIFICATE_DESCRIPTIONS]}
            placeholderOption="-- Select a Description --"
          />
        </GenSection>

        <GenSection number="03" title="Sign-Off">
          <FieldRow
            field={data.date}
            onChange={setField("date")}
            placeholder="e.g. 12 July 2026"
          />
          <FieldRow
            field={data.signature}
            onChange={setField("signature")}
            placeholder="e.g. Dr. Meera Nair"
          />
        </GenSection>

        <GeneratePanel onGenerate={handleGenerate} busy={busy} />
      </div>

      {/* Live preview column */}
      <div className="lg:col-span-3">
        <div className="lg:sticky lg:top-6">
          <p className="mb-2 text-xs font-black uppercase tracking-widest text-slate-600">
            Live Preview
          </p>
          <div className="border-2 border-black bg-white p-2 shadow-brutal-lg">
            <ScaledPreview width={A4L_W} height={A4L_H}>
              <CertificatePage data={data} />
            </ScaledPreview>
          </div>
        </div>
      </div>

      {/* Off-screen, unscaled copy used for PDF capture */}
      <div
        aria-hidden
        style={{ position: "fixed", left: -2000 - A4L_W, top: 0 }}
        className="pointer-events-none"
      >
        <div ref={exportRef}>
          <CertificatePage data={data} />
        </div>
      </div>
    </div>
  );
}
