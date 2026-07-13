"use client";

import { useRef, useState } from "react";

const CATEGORIES = [
  "General Question",
  "Bug Report",
  "PDF Generation Issue",
  "Template Issue",
  "Resume Builder",
  "Thesis Formatting",
  "Billing",
  "Feature Request",
  "Other",
];

const PRIORITIES = ["Low", "Medium", "High"];

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];
const ALLOWED_ATTACHMENT_EXT = /\.(pdf|png|jpe?g)$/i;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full border-2 border-black bg-white px-4 py-3 text-sm font-medium shadow-brutal-sm outline-none focus:bg-brand/10";

const labelClass = "block text-xs font-black uppercase tracking-widest";

const errorTextClass = "mt-2 text-xs font-black uppercase tracking-widest text-red-600";

interface TrackedTicket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface CreateFormValues {
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
}

const EMPTY_FORM: CreateFormValues = {
  name: "",
  email: "",
  category: CATEGORIES[0],
  priority: "Medium",
  subject: "",
  description: "",
};

function validateAttachment(file: File): string | null {
  if (
    !ALLOWED_ATTACHMENT_TYPES.includes(file.type) &&
    !ALLOWED_ATTACHMENT_EXT.test(file.name)
  ) {
    return "Only PDF, PNG, JPG or JPEG files are allowed.";
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return "Attachment must be 2MB or smaller.";
  }
  return null;
}

function validateForm(values: CreateFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.name.trim()) errors.name = "Full name is required.";
  if (!values.email.trim()) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.subject.trim()) errors.subject = "Subject is required.";
  if (!values.description.trim())
    errors.description = "Description is required.";
  if (!CATEGORIES.includes(values.category))
    errors.category = "Choose a valid category.";
  if (!PRIORITIES.includes(values.priority))
    errors.priority = "Choose a valid priority.";
  return errors;
}

function statusBadgeClass(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "open") return "bg-brand text-black";
  if (normalized === "resolved" || normalized === "closed")
    return "bg-black text-brand";
  return "bg-amber-400 text-black";
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type Tab = "create" | "track";

export default function SupportTickets() {
  const [tab, setTab] = useState<Tab>("create");

  // Create-ticket state
  const [values, setValues] = useState<CreateFormValues>(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track-ticket state
  const [trackId, setTrackId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackResult, setTrackResult] = useState<TrackedTicket | null>(null);
  const [trackNotFound, setTrackNotFound] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  const setField = (field: keyof CreateFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const acceptFile = (candidate: File) => {
    const problem = validateAttachment(candidate);
    if (problem) {
      setFile(null);
      setErrors((prev) => ({ ...prev, attachment: problem }));
      return;
    }
    setFile(candidate);
    setErrors((prev) => {
      if (!("attachment" in prev)) return prev;
      const next = { ...prev };
      delete next.attachment;
      return next;
    });
  };

  const removeFile = () => {
    setFile(null);
    setErrors((prev) => {
      if (!("attachment" in prev)) return prev;
      const next = { ...prev };
      delete next.attachment;
      return next;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetCreateForm = () => {
    setValues(EMPTY_FORM);
    setFile(null);
    setErrors({});
    setFormError(null);
    setCreatedId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) acceptFile(dropped);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const clientErrors = validateForm(values);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("email", values.email.trim());
      formData.append("category", values.category);
      formData.append("priority", values.priority);
      formData.append("subject", values.subject.trim());
      formData.append("description", values.description.trim());
      if (file) formData.append("attachment", file);

      const res = await fetch("/api/tickets", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json().catch(() => null)) as {
        id?: string;
        error?: string;
        errors?: Record<string, string>;
      } | null;

      if (!res.ok) {
        if (data?.errors && Object.keys(data.errors).length > 0) {
          setErrors(data.errors);
        } else {
          setFormError(
            data?.error ?? "Something went wrong. Please try again."
          );
        }
        return;
      }

      if (data?.id) {
        setCreatedId(data.id);
        setErrors({});
      } else {
        setFormError("Ticket was created but no ID was returned.");
      }
    } catch {
      setFormError("Network error - couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = trackId.trim();
    setTrackResult(null);
    setTrackNotFound(false);
    setTrackError(null);

    if (!id) {
      setTrackError("Enter your ticket ID first.");
      return;
    }

    setTracking(true);
    try {
      const res = await fetch(`/api/tickets?id=${encodeURIComponent(id)}`);
      const data = (await res.json().catch(() => null)) as
        | (TrackedTicket & { error?: string })
        | null;

      if (res.status === 404) {
        setTrackNotFound(true);
        return;
      }
      if (!res.ok || !data) {
        setTrackError(
          data?.error ?? "Something went wrong. Please try again."
        );
        return;
      }
      setTrackResult(data);
    } catch {
      setTrackError("Network error - couldn't reach the server. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  const tabButtonClass = (active: boolean) =>
    `border-2 border-black px-5 py-2 text-xs font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5 ${
      active ? "bg-black text-brand" : "bg-white text-black"
    }`;

  return (
    <div>
      {/* Tab strip — continues the hero band above */}
      <div className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 pb-14 pt-8 text-center sm:px-6">
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setTab("create")}
              className={tabButtonClass(tab === "create")}
              aria-pressed={tab === "create"}
            >
              Create Ticket
            </button>
            <button
              type="button"
              onClick={() => setTab("track")}
              className={tabButtonClass(tab === "track")}
              aria-pressed={tab === "track"}
            >
              Track Ticket
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
        {tab === "create" ? (
          createdId ? (
            /* Success confirmation */
            <div className="border-2 border-black bg-white p-6 text-center shadow-brutal-lg sm:p-8">
              <span className="mx-auto flex h-12 w-12 items-center justify-center border-2 border-black bg-brand text-2xl font-black shadow-brutal-sm">
                ✓
              </span>
              <h2 className="mt-5 text-2xl font-black uppercase tracking-tight sm:text-3xl">
                Ticket Created
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-700">
                Your support ticket has been submitted. We&apos;ll get back to
                you as soon as possible.
              </p>
              <div className="mx-auto mt-6 inline-block border-2 border-black bg-brand px-8 py-4 shadow-brutal">
                <p className="text-xs font-black uppercase tracking-widest">
                  Your Ticket ID
                </p>
                <p className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                  {createdId}
                </p>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-600">
                Save this ID to track your ticket
              </p>
              <button
                type="button"
                onClick={resetCreateForm}
                className="mt-8 w-full border-2 border-black bg-white px-6 py-4 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
              >
                Create Another Ticket
              </button>
            </div>
          ) : (
            /* Create-ticket form */
            <form
              onSubmit={handleSubmit}
              noValidate
              className="border-2 border-black bg-white p-6 shadow-brutal-lg sm:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="fullName" className={labelClass}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={`mt-2 ${inputClass}`}
                  />
                  {errors.name && (
                    <p className={errorTextClass}>{errors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className={`mt-2 ${inputClass}`}
                  />
                  {errors.email && (
                    <p className={errorTextClass}>{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="category" className={labelClass}>
                  Issue Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={(e) => setField("category", e.target.value)}
                  className={`mt-2 ${inputClass}`}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className={errorTextClass}>{errors.category}</p>
                )}
              </div>

              <fieldset className="mt-6">
                <legend className={labelClass}>Priority</legend>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  {PRIORITIES.map((p) => (
                    <label
                      key={p}
                      className="flex cursor-pointer items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2.5 text-xs font-black uppercase tracking-widest shadow-brutal-sm has-checked:bg-brand"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p}
                        checked={values.priority === p}
                        onChange={(e) => setField("priority", e.target.value)}
                        className="accent-black"
                      />
                      {p}
                    </label>
                  ))}
                </div>
                {errors.priority && (
                  <p className={errorTextClass}>{errors.priority}</p>
                )}
              </fieldset>

              <div className="mt-6">
                <label htmlFor="subject" className={labelClass}>
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder="Short summary of the issue"
                  value={values.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
                {errors.subject && (
                  <p className={errorTextClass}>{errors.subject}</p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Describe your issue in detail…"
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className={`mt-2 ${inputClass} resize-y`}
                />
                {errors.description && (
                  <p className={errorTextClass}>{errors.description}</p>
                )}
              </div>

              <div className="mt-6">
                <span className={labelClass}>Attachment</span>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  className={`mt-2 cursor-pointer border-2 border-dashed border-black p-6 text-center transition-colors ${
                    dragActive ? "bg-brand/30" : "bg-brand/10 hover:bg-brand/20"
                  }`}
                >
                  {file ? (
                    <div>
                      <p className="text-sm font-black">{file.name}</p>
                      <p className="mt-1 text-xs font-medium text-slate-600">
                        {(file.size / 1024).toFixed(0)} KB - click or drop to
                        replace
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="mt-3 border-2 border-black bg-white px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-transform hover:-translate-y-0.5"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-black">
                        Drag &amp; drop a file here, or click to browse
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase tracking-widest text-slate-600">
                        PDF, PNG, JPG, JPEG (Max: 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) acceptFile(selected);
                      e.target.value = "";
                    }}
                  />
                </div>
                {errors.attachment && (
                  <p className={errorTextClass}>{errors.attachment}</p>
                )}
              </div>

              {formError && (
                <div className="mt-6 border-2 border-black bg-red-500 px-4 py-3 shadow-brutal-sm">
                  <p className="text-sm font-black text-white">{formError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full border-2 border-black bg-brand px-6 py-4 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {submitting ? "Submitting…" : "Submit Ticket"}
              </button>
            </form>
          )
        ) : (
          /* Track ticket */
          <div>
            <form
              onSubmit={handleTrack}
              noValidate
              className="border-2 border-black bg-white p-6 shadow-brutal-lg sm:p-8"
            >
              <label htmlFor="trackId" className={labelClass}>
                Ticket ID
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="trackId"
                  name="trackId"
                  type="text"
                  placeholder="e.g. CVL-A1B2C3"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={tracking}
                  className="shrink-0 border-2 border-black bg-brand px-8 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {tracking ? "Tracking…" : "Track"}
                </button>
              </div>
              {trackError && <p className={errorTextClass}>{trackError}</p>}
            </form>

            {trackNotFound && (
              <div className="mt-8 border-2 border-black bg-white p-6 text-center shadow-brutal sm:p-8">
                <p className="text-lg font-black uppercase tracking-tight">
                  No Ticket Found
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  We couldn&apos;t find a ticket with that ID. Double-check it
                  and try again - it looks like{" "}
                  <span className="font-black">CVL-XXXXXX</span>.
                </p>
              </div>
            )}

            {trackResult && (
              <div className="mt-8 border-2 border-black bg-white p-6 shadow-brutal-lg sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-600">
                    Ticket{" "}
                    <span className="text-black">{trackResult.id}</span>
                  </p>
                  <span
                    className={`border-2 border-black px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal-sm ${statusBadgeClass(trackResult.status)}`}
                  >
                    {trackResult.status}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-black tracking-tight sm:text-2xl">
                  {trackResult.subject}
                </h2>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="border-2 border-black bg-brand/10 p-4">
                    <dt className="text-xs font-black uppercase tracking-widest text-slate-600">
                      Category
                    </dt>
                    <dd className="mt-1 text-sm font-black">
                      {trackResult.category}
                    </dd>
                  </div>
                  <div className="border-2 border-black bg-brand/10 p-4">
                    <dt className="text-xs font-black uppercase tracking-widest text-slate-600">
                      Priority
                    </dt>
                    <dd className="mt-1 text-sm font-black">
                      {trackResult.priority}
                    </dd>
                  </div>
                  <div className="border-2 border-black bg-brand/10 p-4">
                    <dt className="text-xs font-black uppercase tracking-widest text-slate-600">
                      Created
                    </dt>
                    <dd className="mt-1 text-sm font-black">
                      {formatDate(trackResult.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
