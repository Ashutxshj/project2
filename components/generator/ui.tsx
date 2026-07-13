"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DraftEntry, deleteDraft, listDrafts, saveDraft } from "@/lib/drafts";

/* ------------------------------------------------------------------ */
/* Section wrapper: "01 Student details" style                         */
/* ------------------------------------------------------------------ */
export function GenSection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-2 border-black bg-white shadow-brutal">
      <div className="flex items-center gap-3 border-b-2 border-black bg-brand/40 px-4 py-3">
        {number && (
          <span className="text-lg font-black tracking-tight">{number}</span>
        )}
        <h2 className="text-sm font-black uppercase tracking-widest">
          {title}
        </h2>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Field: label + optional Edit Text (label rename) + Hide toggle      */
/* ------------------------------------------------------------------ */
export interface FieldState {
  value: string;
  label: string;
  hidden: boolean;
}

export function makeField(label: string, value = ""): FieldState {
  return { value, label, hidden: false };
}

export function FieldRow({
  field,
  onChange,
  placeholder,
  editableLabel = false,
  multiline = false,
  hideToggle = true,
  type = "text",
}: {
  field: FieldState;
  onChange: (next: FieldState) => void;
  placeholder?: string;
  editableLabel?: boolean;
  multiline?: boolean;
  hideToggle?: boolean;
  type?: string;
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  return (
    <div className={field.hidden ? "opacity-50" : ""}>
      <div className="mb-1 flex items-center justify-between gap-2">
        {editingLabel ? (
          <input
            className="border-2 border-black px-2 py-0.5 text-xs font-bold uppercase tracking-widest"
            value={field.label}
            autoFocus
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            onBlur={() => setEditingLabel(false)}
            onKeyDown={(e) => e.key === "Enter" && setEditingLabel(false)}
          />
        ) : (
          <label className="text-xs font-bold uppercase tracking-widest text-slate-700">
            {field.label}
          </label>
        )}
        <div className="flex items-center gap-2">
          {editableLabel && (
            <button
              type="button"
              onClick={() => setEditingLabel((v) => !v)}
              className="text-[10px] font-bold uppercase tracking-widest text-slate-500 underline underline-offset-2 hover:text-black"
            >
              Edit Text
            </button>
          )}
          {hideToggle && (
            <button
              type="button"
              onClick={() => onChange({ ...field, hidden: !field.hidden })}
              className={`border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm transition-colors ${
                field.hidden ? "bg-black text-brand" : "bg-white hover:bg-brand"
              }`}
            >
              {field.hidden ? "Include" : "Hide"}
            </button>
          )}
        </div>
      </div>
      {multiline ? (
        <textarea
          className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-slate-100"
          rows={3}
          value={field.value}
          placeholder={placeholder}
          disabled={field.hidden}
          onChange={(e) => onChange({ ...field, value: e.target.value })}
        />
      ) : (
        <input
          type={type}
          className="w-full border-2 border-black px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-slate-100"
          value={field.value}
          placeholder={placeholder}
          disabled={field.hidden}
          onChange={(e) => onChange({ ...field, value: e.target.value })}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Select field with the same label / hide chrome                      */
/* ------------------------------------------------------------------ */
export function SelectRow({
  field,
  onChange,
  options,
  placeholderOption,
  editableLabel = false,
  hideToggle = true,
}: {
  field: FieldState;
  onChange: (next: FieldState) => void;
  options: string[];
  placeholderOption?: string;
  editableLabel?: boolean;
  hideToggle?: boolean;
}) {
  return (
    <div className={field.hidden ? "opacity-50" : ""}>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">
          {field.label}
        </label>
        <div className="flex items-center gap-2">
          {editableLabel && <span className="hidden" />}
          {hideToggle && (
            <button
              type="button"
              onClick={() => onChange({ ...field, hidden: !field.hidden })}
              className={`border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm transition-colors ${
                field.hidden ? "bg-black text-brand" : "bg-white hover:bg-brand"
              }`}
            >
              {field.hidden ? "Include" : "Hide"}
            </button>
          )}
        </div>
      </div>
      <select
        className="w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand disabled:bg-slate-100"
        value={field.value}
        disabled={field.hidden}
        onChange={(e) => onChange({ ...field, value: e.target.value })}
      >
        {placeholderOption !== undefined && (
          <option value="">{placeholderOption}</option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo / photo upload: drag-and-drop + click, PNG/JPG, max 2MB        */
/* ------------------------------------------------------------------ */
export function LogoUpload({
  label = "College Logo",
  hint = "PNG/JPG up to 2MB",
  prompt = "Drag and drop your logo here, or click to browse files.",
  value,
  onChange,
}: {
  label?: string;
  hint?: string;
  prompt?: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      setError(null);
      if (!file) return;
      if (!/^image\/(png|jpe?g)$/i.test(file.type)) {
        setError("Only PNG or JPG images are allowed.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("File is larger than 2MB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => onChange(reader.result as string);
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-700">
          {label}
        </label>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {hint}
        </span>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-black p-4 text-center text-xs font-medium text-slate-600 transition-colors ${
          dragging ? "bg-brand/40" : "bg-slate-50 hover:bg-brand/20"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Uploaded logo" className="max-h-20 object-contain" />
        ) : (
          <span>{prompt}</span>
        )}
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="border-2 border-black bg-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-brutal-sm hover:bg-red-100"
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && (
        <p className="mt-1 text-xs font-bold text-red-600">{error}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draft bar: Save as Draft / Discard Draft / History                  */
/* ------------------------------------------------------------------ */
export function DraftBar<T>({
  tool,
  getData,
  onLoad,
  onDiscard,
  showHistory = true,
}: {
  tool: string;
  getData: () => T;
  onLoad: (data: T) => void;
  onDiscard: () => void;
  showHistory?: boolean;
}) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<DraftEntry<T>[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  const refresh = useCallback(() => setDrafts(listDrafts<T>(tool)), [tool]);

  useEffect(() => {
    if (historyOpen) refresh();
  }, [historyOpen, refresh]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => {
          saveDraft(tool, getData());
          setSavedFlash(true);
          setTimeout(() => setSavedFlash(false), 1500);
        }}
        className="border-2 border-black bg-brand px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
      >
        {savedFlash ? "Saved ✓" : "Save as Draft"}
      </button>
      <button
        type="button"
        onClick={onDiscard}
        className="border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal hover:bg-red-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
      >
        Discard Draft
      </button>
      {showHistory && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="border-2 border-black bg-white px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal hover:bg-brand/30 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            History
          </button>
          {historyOpen && (
            <div className="absolute left-0 z-40 mt-2 w-72 border-2 border-black bg-white p-2 shadow-brutal-lg">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest">
                  Saved drafts
                </span>
                <button
                  type="button"
                  className="text-xs font-black"
                  onClick={() => setHistoryOpen(false)}
                >
                  ✕
                </button>
              </div>
              {drafts.length === 0 ? (
                <p className="py-4 text-center text-xs font-medium text-slate-500">
                  No saved drafts yet.
                </p>
              ) : (
                <ul className="max-h-64 space-y-1 overflow-y-auto">
                  {drafts.map((d) => (
                    <li
                      key={d.id}
                      className="flex items-center justify-between gap-2 border border-black/20 px-2 py-1.5"
                    >
                      <span className="truncate text-xs font-medium">
                        {new Date(d.savedAt).toLocaleString()}
                      </span>
                      <span className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onLoad(d.data);
                            setHistoryOpen(false);
                          }}
                          className="border border-black bg-brand px-1.5 py-0.5 text-[10px] font-black uppercase"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteDraft(tool, d.id);
                            refresh();
                          }}
                          className="border border-black bg-white px-1.5 py-0.5 text-[10px] font-black uppercase hover:bg-red-100"
                        >
                          Del
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Generate PDF panel                                                  */
/* ------------------------------------------------------------------ */
export function GeneratePanel({
  onGenerate,
  busy,
}: {
  onGenerate: () => void;
  busy: boolean;
}) {
  return (
    <div className="border-2 border-black bg-white p-4 shadow-brutal">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-600">
        Ready to export to PDF
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onGenerate}
        className="w-full border-2 border-black bg-brand px-4 py-3 text-sm font-black uppercase tracking-widest shadow-brutal-lg transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-60"
      >
        {busy ? "Generating…" : "Generate PDF"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A4 preview scaler — renders children at fixed px width and scales   */
/* to fit the container. Children should be sized W x H px.            */
/* ------------------------------------------------------------------ */
export function ScaledPreview({
  width,
  height,
  children,
}: {
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      <div style={{ height: height * scale }}>
        <div
          style={{
            width,
            height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export const A4_W = 794;
export const A4_H = 1123;
export const A4L_W = 1123;
export const A4L_H = 794;
