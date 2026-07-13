"use client";

/**
 * Assignment cover-page templates.
 *
 * Each component renders a full-size A4 portrait page (794 x 1123 px) as a
 * printable DOCUMENT — these deliberately use their own typography and do NOT
 * follow the neobrutalist site chrome. Hidden fields never render.
 */

import type { CSSProperties, ComponentType } from "react";
import type { FieldState } from "@/components/generator/ui";
import { A4_W, A4_H } from "@/components/generator/ui";

/* ------------------------------------------------------------------ */
/* Shared types + helpers                                              */
/* ------------------------------------------------------------------ */

export interface AssignmentTemplateProps {
  studentName: FieldState;
  rollNumber: FieldState;
  subjectName: FieldState;
  subjectCode: FieldState;
  courseName: FieldState;
  faculty: FieldState;
  semester: FieldState;
  college: FieldState;
  title: FieldState;
  submissionDate: FieldState;
  logo: string | null;
}

export const DEFAULT_TEMPLATE_ID = "elegant";

/** Small decorative swatch per template so switcher cards read visually. */
export const TEMPLATE_SWATCHES: Record<string, string> = {
  elegant: "linear-gradient(135deg, #1f2430, #6b7280)",
  classic: "linear-gradient(135deg, #111111, #444444)",
  modern: "linear-gradient(135deg, #0f172a, #64748b)",
  minimal: "linear-gradient(135deg, #e5e7eb, #f9fafb)",
  scientific: "linear-gradient(135deg, #334155, #94a3b8)",
  creative: "linear-gradient(135deg, #facc15, #f43f5e, #2563eb)",
  "scrapbook-biology": "linear-gradient(135deg, #141414, #f97316)",
  "blue-white-border": "linear-gradient(135deg, #1e40af, #93c5fd)",
  "gray-vintage": "linear-gradient(135deg, #78716c, #d6d3d1)",
  "math-notebook": "linear-gradient(135deg, #93c5fd, #fdfdf8)",
  "purple-watercolor": "linear-gradient(135deg, #7e22ce, #d8b4fe)",
};

const SERIF = `Georgia, 'Times New Roman', Times, serif`;
const TIMES = `'Times New Roman', Times, Georgia, serif`;
const SANS = `'Segoe UI', Helvetica, Arial, sans-serif`;
const HAND = `'Segoe Print', 'Comic Sans MS', 'Bradley Hand', cursive`;

const page: CSSProperties = {
  width: A4_W,
  height: A4_H,
  background: "#ffffff",
  position: "relative",
  overflow: "hidden",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
};

function val(f: FieldState, fallback: string): string {
  return f.value.trim() || fallback;
}

function fmtDate(f: FieldState): string {
  const raw = f.value.trim();
  if (!raw) return "Submission Date";
  const d = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function semText(f: FieldState): string {
  return f.value.trim() ? `${f.value.trim()} Semester` : "Semester";
}

interface Pair {
  label: string;
  value: string;
}

/** Detail rows (student / submission info) — skips hidden fields. */
function detailPairs(p: AssignmentTemplateProps): Pair[] {
  const out: Pair[] = [];
  if (!p.studentName.hidden)
    out.push({ label: p.studentName.label, value: val(p.studentName, "Student Name") });
  if (!p.rollNumber.hidden)
    out.push({ label: p.rollNumber.label, value: val(p.rollNumber, "Roll Number") });
  if (!p.courseName.hidden)
    out.push({ label: p.courseName.label, value: val(p.courseName, "Course Name") });
  if (!p.semester.hidden)
    out.push({ label: p.semester.label, value: semText(p.semester) });
  if (!p.faculty.hidden)
    out.push({ label: p.faculty.label, value: val(p.faculty, "Faculty Name") });
  if (!p.submissionDate.hidden)
    out.push({ label: p.submissionDate.label, value: fmtDate(p.submissionDate) });
  return out;
}

/** "Subject Name (CODE)" line respecting hide toggles; null when both hidden. */
function subjectLine(p: AssignmentTemplateProps): string | null {
  const name = p.subjectName.hidden ? null : val(p.subjectName, "Subject Name");
  const code = p.subjectCode.hidden ? null : val(p.subjectCode, "Subject Code");
  if (name && code) return `${name} (${code})`;
  return name ?? code;
}

function Logo({
  logo,
  size = 96,
  style,
}: {
  logo: string | null;
  size?: number;
  style?: CSSProperties;
}) {
  if (!logo) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt="Logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        ...style,
      }}
    />
  );
}

/* ================================================================== */
/* 1. ELEGANT — sophisticated serif, thin double border, centered      */
/* ================================================================== */

function ElegantTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div style={{ ...page, padding: 28, fontFamily: SERIF, color: "#1f2430" }}>
      <div
        style={{
          flex: 1,
          border: "4px double #1f2430",
          padding: 6,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid #1f2430",
            padding: "56px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Logo logo={p.logo} size={92} style={{ marginBottom: 20 }} />
          {!p.college.hidden && (
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
                lineHeight: 1.35,
              }}
            >
              {val(p.college, "College / University Name")}
            </div>
          )}
          <div
            style={{
              width: 180,
              borderBottom: "1px solid #9aa0ab",
              margin: "28px 0",
            }}
          />
          <div
            style={{
              fontSize: 13,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            Assignment
          </div>
          {!p.title.hidden && (
            <div
              style={{
                fontSize: 40,
                fontStyle: "italic",
                fontWeight: 500,
                margin: "18px 0 6px",
                lineHeight: 1.25,
              }}
            >
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 17, color: "#4b5563", marginTop: 8 }}>
              {subject}
            </div>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ width: "100%" }}>
            <div
              style={{
                width: 180,
                borderBottom: "1px solid #9aa0ab",
                margin: "0 auto 30px",
              }}
            />
            <table style={{ margin: "0 auto", borderCollapse: "collapse" }}>
              <tbody>
                {detailPairs(p).map((d) => (
                  <tr key={d.label}>
                    <td
                      style={{
                        padding: "5px 18px 5px 0",
                        fontSize: 12,
                        letterSpacing: 2.5,
                        textTransform: "uppercase",
                        color: "#6b7280",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.label}
                    </td>
                    <td
                      style={{
                        padding: "5px 0",
                        fontSize: 16,
                        textAlign: "left",
                      }}
                    >
                      {d.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 2. CLASSIC — traditional academic layout, solid border              */
/* ================================================================== */

function ClassicTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  const left: Pair[] = [];
  if (!p.studentName.hidden)
    left.push({ label: p.studentName.label, value: val(p.studentName, "Student Name") });
  if (!p.rollNumber.hidden)
    left.push({ label: p.rollNumber.label, value: val(p.rollNumber, "Roll Number") });
  if (!p.courseName.hidden)
    left.push({ label: p.courseName.label, value: val(p.courseName, "Course Name") });
  if (!p.semester.hidden)
    left.push({ label: p.semester.label, value: semText(p.semester) });
  return (
    <div style={{ ...page, padding: 32, fontFamily: TIMES, color: "#111111" }}>
      <div
        style={{
          flex: 1,
          border: "3px solid #111111",
          padding: "52px 56px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {!p.college.hidden && (
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1.3,
            }}
          >
            {val(p.college, "College / University Name")}
          </div>
        )}
        <Logo logo={p.logo} size={110} style={{ margin: "30px 0 10px" }} />
        <div
          style={{
            marginTop: 36,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: "uppercase",
            borderTop: "2px solid #111",
            borderBottom: "2px solid #111",
            padding: "10px 34px",
          }}
        >
          Assignment
        </div>
        {!p.title.hidden && (
          <div style={{ fontSize: 32, fontWeight: 700, marginTop: 34, lineHeight: 1.3 }}>
            {val(p.title, "Assignment Title")}
          </div>
        )}
        {subject && (
          <div style={{ fontSize: 18, marginTop: 12 }}>
            <span style={{ fontWeight: 700 }}>Subject: </span>
            {subject}
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 40,
            textAlign: "left",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 2,
                borderBottom: "1px solid #111",
                paddingBottom: 4,
                marginBottom: 12,
              }}
            >
              Submitted By
            </div>
            {left.map((d) => (
              <div key={d.label} style={{ fontSize: 15, padding: "3px 0" }}>
                <span style={{ fontWeight: 700 }}>{d.label}: </span>
                {d.value}
              </div>
            ))}
          </div>
          <div style={{ textAlign: "right" }}>
            {!p.faculty.hidden && (
              <>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    borderBottom: "1px solid #111",
                    paddingBottom: 4,
                    marginBottom: 12,
                  }}
                >
                  Submitted To
                </div>
                <div style={{ fontSize: 15, padding: "3px 0" }}>
                  {val(p.faculty, "Faculty Name")}
                </div>
              </>
            )}
            {!p.submissionDate.hidden && (
              <div style={{ fontSize: 15, padding: "3px 0", marginTop: p.faculty.hidden ? 0 : 14 }}>
                <span style={{ fontWeight: 700 }}>{p.submissionDate.label}: </span>
                {fmtDate(p.submissionDate)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 3. MODERN — clean single border, sans-serif, accent bar             */
/* ================================================================== */

function ModernTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div style={{ ...page, padding: 36, fontFamily: SANS, color: "#0f172a" }}>
      <div
        style={{
          flex: 1,
          border: "1px solid #0f172a",
          display: "flex",
          flexDirection: "column",
          padding: "56px 60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Logo logo={p.logo} size={70} />
          {!p.college.hidden && (
            <div>
              <div style={{ fontSize: 21, fontWeight: 700, lineHeight: 1.3 }}>
                {val(p.college, "College / University Name")}
              </div>
              <div
                style={{
                  width: 64,
                  height: 5,
                  background: "#0f172a",
                  marginTop: 10,
                }}
              />
            </div>
          )}
        </div>
        <div style={{ marginTop: 110 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#64748b",
            }}
          >
            Assignment Report
          </div>
          {!p.title.hidden && (
            <div
              style={{
                fontSize: 46,
                fontWeight: 800,
                lineHeight: 1.15,
                marginTop: 14,
                letterSpacing: -0.5,
              }}
            >
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 18, color: "#334155", marginTop: 16 }}>
              {subject}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            borderTop: "1px solid #cbd5e1",
            paddingTop: 28,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: 40,
            rowGap: 18,
          }}
        >
          {detailPairs(p).map((d) => (
            <div key={d.label}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                {d.label}
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 3 }}>
                {d.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 4. MINIMAL — no border, lots of whitespace                          */
/* ================================================================== */

function MinimalTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div
      style={{
        ...page,
        padding: "120px 100px",
        fontFamily: SANS,
        color: "#111827",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Logo logo={p.logo} size={56} style={{ marginBottom: 28 }} />
        {!p.college.hidden && (
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#6b7280",
            }}
          >
            {val(p.college, "College / University Name")}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: "center" }}>
        {!p.title.hidden && (
          <div style={{ fontSize: 44, fontWeight: 300, lineHeight: 1.25, letterSpacing: -0.5 }}>
            {val(p.title, "Assignment Title")}
          </div>
        )}
        {subject && (
          <div style={{ fontSize: 15, color: "#6b7280", marginTop: 20 }}>{subject}</div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ textAlign: "center" }}>
        <div
          style={{ width: 32, borderTop: "1px solid #111827", margin: "0 auto 26px" }}
        />
        {detailPairs(p).map((d) => (
          <div key={d.label} style={{ fontSize: 13, color: "#374151", padding: "3px 0" }}>
            <span style={{ color: "#9ca3af" }}>{d.label} — </span>
            {d.value}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 5. SCIENTIFIC — research-paper style, header/footer rules           */
/* ================================================================== */

function ScientificTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div
      style={{ ...page, padding: "64px 76px", fontFamily: TIMES, color: "#111111" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          borderBottom: "3px solid #111",
          paddingBottom: 14,
        }}
      >
        <div>
          {!p.college.hidden && (
            <div style={{ fontSize: 19, fontWeight: 700, textTransform: "uppercase" }}>
              {val(p.college, "College / University Name")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 13, fontStyle: "italic", marginTop: 4 }}>
              {subject}
            </div>
          )}
        </div>
        <Logo logo={p.logo} size={58} />
      </div>
      <div style={{ borderBottom: "1px solid #111", marginTop: 3 }} />
      <div style={{ textAlign: "center", marginTop: 130 }}>
        <div style={{ fontSize: 13, letterSpacing: 5, textTransform: "uppercase" }}>
          Assignment Report
        </div>
        {!p.title.hidden && (
          <div style={{ fontSize: 34, fontWeight: 700, marginTop: 22, lineHeight: 1.3 }}>
            {val(p.title, "Assignment Title")}
          </div>
        )}
        {!p.studentName.hidden && (
          <div style={{ marginTop: 44 }}>
            <div style={{ fontSize: 14, fontStyle: "italic" }}>by</div>
            <div style={{ fontSize: 21, fontWeight: 700, marginTop: 8 }}>
              {val(p.studentName, "Student Name")}
              {!p.rollNumber.hidden && (
                <span style={{ fontWeight: 400 }}>
                  {" "}
                  ({val(p.rollNumber, "Roll Number")})
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ margin: "0 auto", width: 460 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <tbody>
            {(
              [
                /* student name already shown above */
                !p.courseName.hidden
                  ? { label: p.courseName.label, value: val(p.courseName, "Course Name") }
                  : null,
                !p.semester.hidden
                  ? { label: p.semester.label, value: semText(p.semester) }
                  : null,
                !p.faculty.hidden
                  ? { label: p.faculty.label, value: val(p.faculty, "Faculty Name") }
                  : null,
                !p.submissionDate.hidden
                  ? { label: p.submissionDate.label, value: fmtDate(p.submissionDate) }
                  : null,
              ].filter(Boolean) as Pair[]
            ).map((d) => (
              <tr key={d.label} style={{ borderBottom: "1px dotted #9ca3af" }}>
                <td
                  style={{
                    padding: "7px 0",
                    fontWeight: 700,
                    width: "42%",
                    textTransform: "uppercase",
                    fontSize: 12,
                    letterSpacing: 1.5,
                  }}
                >
                  {d.label}
                </td>
                <td style={{ padding: "7px 0" }}>{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{
          marginTop: 46,
          borderTop: "1px solid #111",
          paddingTop: 3,
        }}
      />
      <div
        style={{
          borderTop: "3px solid #111",
          paddingTop: 12,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          fontStyle: "italic",
        }}
      >
        <span>Submitted in partial fulfilment of coursework requirements</span>
        {!p.submissionDate.hidden && <span>{fmtDate(p.submissionDate)}</span>}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 6. CREATIVE — artistic asymmetric layout, bold shapes               */
/* ================================================================== */

function CreativeTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div style={{ ...page, fontFamily: SANS, color: "#18181b" }}>
      {/* bold shapes */}
      <div
        style={{
          position: "absolute",
          top: -170,
          right: -170,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "#facc15",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 96,
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "#f43f5e",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          left: -120,
          width: 340,
          height: 340,
          background: "#2563eb",
          transform: "rotate(18deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 190,
          left: 210,
          width: 74,
          height: 74,
          background: "#f43f5e",
          transform: "rotate(28deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 64,
          width: 6,
          background: "#18181b",
        }}
      />
      {/* content */}
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "70px 80px 90px 120px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo logo={p.logo} size={62} />
          {!p.college.hidden && (
            <div style={{ fontSize: 17, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, maxWidth: 380 }}>
              {val(p.college, "College / University Name")}
            </div>
          )}
        </div>
        <div style={{ marginTop: 140 }}>
          <div
            style={{
              display: "inline-block",
              background: "#18181b",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 5,
              textTransform: "uppercase",
              padding: "8px 18px",
              transform: "rotate(-2deg)",
            }}
          >
            Assignment
          </div>
          {!p.title.hidden && (
            <div
              style={{
                fontSize: 58,
                fontWeight: 900,
                lineHeight: 1.05,
                marginTop: 24,
                textTransform: "uppercase",
                letterSpacing: -1,
                maxWidth: 520,
              }}
            >
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div
              style={{
                fontSize: 19,
                fontWeight: 600,
                marginTop: 20,
                color: "#3f3f46",
              }}
            >
              {subject}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ maxWidth: 420, marginLeft: "auto", textAlign: "right" }}>
          {detailPairs(p).map((d) => (
            <div key={d.label} style={{ padding: "4px 0", fontSize: 15 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#71717a",
                  marginRight: 10,
                }}
              >
                {d.label}
              </span>
              <span style={{ fontWeight: 700 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 7. SCRAPBOOK BIOLOGY — black & orange scrapbook style               */
/* ================================================================== */

function ScrapbookBiologyTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div style={{ ...page, background: "#141414", fontFamily: HAND, color: "#f5f5f4" }}>
      {/* orange washi tape strips */}
      <div
        style={{
          position: "absolute",
          top: 84,
          left: -60,
          width: 300,
          height: 34,
          background: "#f97316",
          transform: "rotate(-8deg)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 44,
          right: -70,
          width: 320,
          height: 34,
          background: "#fb923c",
          transform: "rotate(6deg)",
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: -50,
          width: 260,
          height: 30,
          background: "#f97316",
          transform: "rotate(-5deg)",
          opacity: 0.85,
        }}
      />
      {/* dotted doodle border */}
      <div
        style={{
          position: "absolute",
          inset: 26,
          border: "3px dashed #f97316",
          borderRadius: 18,
        }}
      />
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "80px 70px 60px",
        }}
      >
        {!p.college.hidden && (
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              textAlign: "center",
              color: "#fdba74",
              letterSpacing: 1,
            }}
          >
            {val(p.college, "College / University Name")}
          </div>
        )}
        <Logo
          logo={p.logo}
          size={78}
          style={{
            marginTop: 20,
            background: "#ffffff",
            borderRadius: 12,
            padding: 8,
            boxSizing: "content-box",
          }}
        />
        {/* title sticker */}
        <div
          style={{
            marginTop: 44,
            background: "#f97316",
            color: "#141414",
            padding: "22px 40px",
            transform: "rotate(-2deg)",
            boxShadow: "6px 6px 0 #000000",
            textAlign: "center",
            maxWidth: 540,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>
            Assignment
          </div>
          {!p.title.hidden && (
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginTop: 6 }}>
              {val(p.title, "Assignment Title")}
            </div>
          )}
        </div>
        {subject && (
          <div
            style={{
              marginTop: 26,
              fontSize: 18,
              color: "#fdba74",
              transform: "rotate(1deg)",
            }}
          >
            ✦ {subject} ✦
          </div>
        )}
        <div style={{ flex: 1 }} />
        {/* white paper note card */}
        <div
          style={{
            background: "#fffbf5",
            color: "#1c1917",
            width: 470,
            padding: "26px 34px 30px",
            transform: "rotate(1.5deg)",
            boxShadow: "8px 8px 0 rgba(249,115,22,0.65)",
          }}
        >
          {detailPairs(p).map((d) => (
            <div
              key={d.label}
              style={{
                fontSize: 15,
                padding: "5px 0",
                borderBottom: "1px dashed #d6d3d1",
              }}
            >
              <span style={{ fontWeight: 700, color: "#c2410c" }}>{d.label}: </span>
              {d.value}
            </div>
          ))}
        </div>
        <div style={{ height: 26 }} />
      </div>
    </div>
  );
}

/* ================================================================== */
/* 8. BLUE WHITE BORDER — blue & white professional page border        */
/* ================================================================== */

function BlueWhiteBorderTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div style={{ ...page, background: "#1e40af", padding: 22, fontFamily: SANS, color: "#1e293b" }}>
      <div
        style={{
          flex: 1,
          background: "#ffffff",
          border: "2px solid #ffffff",
          padding: 10,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "3px solid #1e40af",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "56px 64px",
            position: "relative",
          }}
        >
          {/* corner accents */}
          {(
            [
              { top: 10, left: 10, borderWidth: "6px 0 0 6px" },
              { top: 10, right: 10, borderWidth: "6px 6px 0 0" },
              { bottom: 10, left: 10, borderWidth: "0 0 6px 6px" },
              { bottom: 10, right: 10, borderWidth: "0 6px 6px 0" },
            ] as CSSProperties[]
          ).map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 34,
                height: 34,
                borderStyle: "solid",
                borderColor: "#1e40af",
                ...s,
              }}
            />
          ))}
          <Logo logo={p.logo} size={88} style={{ marginBottom: 18 }} />
          {!p.college.hidden && (
            <div
              style={{
                fontSize: 25,
                fontWeight: 800,
                color: "#1e40af",
                textTransform: "uppercase",
                lineHeight: 1.3,
              }}
            >
              {val(p.college, "College / University Name")}
            </div>
          )}
          <div
            style={{
              width: 220,
              height: 3,
              background: "#1e40af",
              margin: "26px 0",
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#3b82f6",
            }}
          >
            Assignment
          </div>
          {!p.title.hidden && (
            <div style={{ fontSize: 36, fontWeight: 800, marginTop: 16, lineHeight: 1.25 }}>
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 17, color: "#475569", marginTop: 12 }}>{subject}</div>
          )}
          <div style={{ flex: 1 }} />
          <div
            style={{
              width: "100%",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              padding: "22px 34px",
              textAlign: "left",
            }}
          >
            {detailPairs(p).map((d) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 15,
                  padding: "5px 0",
                  borderBottom: "1px solid #dbeafe",
                }}
              >
                <span style={{ fontWeight: 700, color: "#1e40af" }}>{d.label}</span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 9. GRAY VINTAGE — gray vintage aesthetic border                     */
/* ================================================================== */

function GrayVintageTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div
      style={{
        ...page,
        background: "linear-gradient(160deg, #e7e5e4 0%, #d6d3d1 55%, #e7e5e4 100%)",
        padding: 30,
        fontFamily: SERIF,
        color: "#44403c",
      }}
    >
      <div
        style={{
          flex: 1,
          border: "2px solid #78716c",
          padding: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            border: "1px solid #a8a29e",
            outline: "1px solid #a8a29e",
            outlineOffset: -8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "64px 70px",
            position: "relative",
          }}
        >
          {/* vintage corner squares */}
          {(
            [
              { top: -7, left: -7 },
              { top: -7, right: -7 },
              { bottom: -7, left: -7 },
              { bottom: -7, right: -7 },
            ] as CSSProperties[]
          ).map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 13,
                height: 13,
                background: "#78716c",
                transform: "rotate(45deg)",
                ...s,
              }}
            />
          ))}
          <div style={{ fontSize: 26, color: "#78716c", lineHeight: 1 }}>❦</div>
          <Logo
            logo={p.logo}
            size={82}
            style={{ margin: "18px 0 14px", filter: "grayscale(100%)" }}
          />
          {!p.college.hidden && (
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#57534e",
                lineHeight: 1.4,
              }}
            >
              {val(p.college, "College / University Name")}
            </div>
          )}
          <div
            style={{
              margin: "26px 0",
              fontSize: 15,
              color: "#78716c",
              letterSpacing: 8,
            }}
          >
            ────── ❧ ──────
          </div>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#78716c",
            }}
          >
            An Assignment Upon
          </div>
          {!p.title.hidden && (
            <div
              style={{
                fontSize: 38,
                fontStyle: "italic",
                marginTop: 16,
                color: "#3f3f46",
                lineHeight: 1.25,
              }}
            >
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 16, marginTop: 12, color: "#57534e" }}>{subject}</div>
          )}
          <div style={{ flex: 1 }} />
          <div>
            {detailPairs(p).map((d) => (
              <div key={d.label} style={{ fontSize: 15, padding: "4px 0" }}>
                <span
                  style={{
                    fontVariant: "small-caps",
                    letterSpacing: 2,
                    color: "#78716c",
                  }}
                >
                  {d.label.toLowerCase()}
                </span>
                <span style={{ margin: "0 10px", color: "#a8a29e" }}>·</span>
                <span style={{ fontStyle: "italic" }}>{d.value}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 22, color: "#78716c", marginTop: 22 }}>❦</div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 10. MATH NOTEBOOK — grid-paper background, notebook style           */
/* ================================================================== */

function MathNotebookTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  return (
    <div
      style={{
        ...page,
        background: "#fdfdf8",
        backgroundImage:
          "linear-gradient(to right, rgba(59,130,246,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.18) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        fontFamily: HAND,
        color: "#1f2937",
      }}
    >
      {/* red margin line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 84,
          width: 2,
          background: "#ef4444",
        }}
      />
      {/* spiral binding holes */}
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 26,
            top: 48 + i * 76,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#e5e7eb",
            border: "2px solid #9ca3af",
          }}
        />
      ))}
      {/* math doodles */}
      <div
        style={{
          position: "absolute",
          top: 34,
          right: 46,
          fontSize: 26,
          color: "#93c5fd",
          transform: "rotate(8deg)",
        }}
      >
        ∑ π √x ÷ ∞
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          fontSize: 22,
          color: "#93c5fd",
          transform: "rotate(-6deg)",
        }}
      >
        a² + b² = c²
      </div>
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "72px 80px 80px 130px",
        }}
      >
        <Logo logo={p.logo} size={74} style={{ marginBottom: 16 }} />
        {!p.college.hidden && (
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1d4ed8" }}>
            {val(p.college, "College / University Name")}
          </div>
        )}
        {/* boxed title label */}
        <div
          style={{
            marginTop: 60,
            border: "3px solid #1f2937",
            background: "#ffffff",
            boxShadow: "5px 5px 0 rgba(31,41,55,0.25)",
            padding: "26px 44px",
            maxWidth: 500,
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 4, textTransform: "uppercase", color: "#6b7280" }}>
            Mathematics · Assignment
          </div>
          {!p.title.hidden && (
            <div style={{ fontSize: 34, fontWeight: 800, marginTop: 8, lineHeight: 1.25 }}>
              {val(p.title, "Assignment Title")}
            </div>
          )}
          {subject && (
            <div style={{ fontSize: 16, marginTop: 10, color: "#374151" }}>{subject}</div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ width: 440, textAlign: "left" }}>
          {detailPairs(p).map((d) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontSize: 16,
                padding: "6px 2px",
                borderBottom: "2px solid rgba(59,130,246,0.35)",
              }}
            >
              <span style={{ fontWeight: 700, color: "#1d4ed8" }}>{d.label} =</span>
              <span>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 11. PURPLE WATERCOLOR — purple floral watercolor aesthetic          */
/* ================================================================== */

function PurpleWatercolorTemplate(p: AssignmentTemplateProps) {
  const subject = subjectLine(p);
  const blob = (styles: CSSProperties): CSSProperties => ({
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(2px)",
    ...styles,
  });
  return (
    <div style={{ ...page, background: "#ffffff", fontFamily: SERIF, color: "#3b0764" }}>
      {/* watercolor blobs */}
      <div
        style={blob({
          top: -140,
          left: -140,
          width: 420,
          height: 420,
          background:
            "radial-gradient(circle at 40% 40%, rgba(168,85,247,0.55), rgba(196,141,253,0.35) 55%, transparent 72%)",
        })}
      />
      <div
        style={blob({
          top: -60,
          right: -120,
          width: 360,
          height: 360,
          background:
            "radial-gradient(circle at 55% 45%, rgba(147,51,234,0.45), rgba(216,180,254,0.35) 55%, transparent 72%)",
        })}
      />
      <div
        style={blob({
          bottom: -150,
          right: -130,
          width: 440,
          height: 440,
          background:
            "radial-gradient(circle at 45% 55%, rgba(126,34,206,0.5), rgba(196,141,253,0.32) 55%, transparent 72%)",
        })}
      />
      <div
        style={blob({
          bottom: -80,
          left: -110,
          width: 330,
          height: 330,
          background:
            "radial-gradient(circle at 50% 40%, rgba(192,132,252,0.45), rgba(233,213,255,0.4) 55%, transparent 72%)",
        })}
      />
      {/* small floral accents */}
      <div style={{ position: "absolute", top: 52, left: 60, fontSize: 30, color: "#c084fc" }}>
        ✿
      </div>
      <div style={{ position: "absolute", top: 96, left: 108, fontSize: 18, color: "#d8b4fe" }}>
        ❀
      </div>
      <div style={{ position: "absolute", bottom: 64, right: 70, fontSize: 30, color: "#c084fc" }}>
        ✿
      </div>
      <div style={{ position: "absolute", bottom: 110, right: 118, fontSize: 18, color: "#d8b4fe" }}>
        ❀
      </div>
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "96px 110px",
        }}
      >
        <Logo logo={p.logo} size={80} style={{ marginBottom: 18 }} />
        {!p.college.hidden && (
          <div
            style={{
              fontSize: 23,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: "#581c87",
              lineHeight: 1.4,
            }}
          >
            {val(p.college, "College / University Name")}
          </div>
        )}
        <div
          style={{
            margin: "34px 0 0",
            fontSize: 13,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#9333ea",
          }}
        >
          Assignment
        </div>
        {!p.title.hidden && (
          <div
            style={{
              fontSize: 42,
              fontStyle: "italic",
              fontWeight: 500,
              marginTop: 16,
              color: "#4c1d95",
              lineHeight: 1.25,
            }}
          >
            {val(p.title, "Assignment Title")}
          </div>
        )}
        {subject && (
          <div style={{ fontSize: 17, marginTop: 14, color: "#7e22ce" }}>{subject}</div>
        )}
        <div style={{ margin: "26px 0", fontSize: 16, color: "#c084fc", letterSpacing: 6 }}>
          ❀ ✿ ❀
        </div>
        <div style={{ flex: 1 }} />
        <div
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid #e9d5ff",
            borderRadius: 14,
            padding: "24px 40px",
          }}
        >
          {detailPairs(p).map((d) => (
            <div key={d.label} style={{ fontSize: 15, padding: "4px 0" }}>
              <span style={{ color: "#9333ea", fontStyle: "italic" }}>{d.label}: </span>
              <span style={{ color: "#3b0764", fontWeight: 600 }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const ASSIGNMENT_TEMPLATE_COMPONENTS: Record<
  string,
  ComponentType<AssignmentTemplateProps>
> = {
  elegant: ElegantTemplate,
  classic: ClassicTemplate,
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  scientific: ScientificTemplate,
  creative: CreativeTemplate,
  "scrapbook-biology": ScrapbookBiologyTemplate,
  "blue-white-border": BlueWhiteBorderTemplate,
  "gray-vintage": GrayVintageTemplate,
  "math-notebook": MathNotebookTemplate,
  "purple-watercolor": PurpleWatercolorTemplate,
};
