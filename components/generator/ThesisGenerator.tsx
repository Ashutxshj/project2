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
import { exportElementsToPdf } from "@/lib/pdf";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */
interface ThesisFields {
  // 01 Student Information
  studentName: FieldState;
  enrollment: FieldState;
  degreeName: FieldState;
  specialization: FieldState;
  // 02 Dissertation Details
  dissertationTitle: FieldState;
  academicSession: FieldState;
  similarityIndex: FieldState;
  plagiarismSoftware: FieldState;
  // 03 University Information
  universityName: FieldState;
  shortName: FieldState;
  campusName: FieldState;
  tagline: FieldState;
  affiliation: FieldState;
  department: FieldState;
  place: FieldState;
  month: FieldState;
  year: FieldState;
  // 04 Guide / Supervisor
  guideName: FieldState;
  guideDesignation: FieldState;
  guideDepartment: FieldState;
}

function defaultFields(): ThesisFields {
  return {
    studentName: makeField("Student Name"),
    enrollment: makeField("Enrollment Number"),
    degreeName: makeField("Degree Name"),
    specialization: makeField("Specialization"),
    dissertationTitle: makeField("Dissertation Title"),
    academicSession: makeField("Academic Session"),
    similarityIndex: makeField("Similarity Index"),
    plagiarismSoftware: makeField("Plagiarism Software"),
    universityName: makeField("University/College Name"),
    shortName: makeField("Short Name of College"),
    campusName: makeField("Campus Name"),
    tagline: makeField("University Tagline"),
    affiliation: makeField("University Affiliation"),
    department: makeField("Department"),
    place: makeField("Place/Location"),
    month: makeField("Month", "June"),
    year: makeField("Year", "2026"),
    guideName: makeField("Guide Name"),
    guideDesignation: makeField("Guide Designation"),
    guideDepartment: makeField("Guide Department"),
  };
}

interface ThesisDraft {
  fields: ThesisFields;
  logo: string | null;
}

/* ------------------------------------------------------------------ */
/* Preview helpers                                                     */
/* ------------------------------------------------------------------ */
/** Value for interpolation: empty string when hidden, sample when blank. */
function val(f: FieldState, sample: string): string {
  if (f.hidden) return "";
  return f.value.trim() || sample;
}

/** Should a dedicated line/block for this field be rendered at all? */
function show(f: FieldState): boolean {
  return !f.hidden;
}

const SAMPLE = {
  studentName: "Aarav Mehta",
  enrollment: "EN21CS301128",
  degreeName: "Master of Technology",
  specialization: "Computer Science & Engineering",
  dissertationTitle:
    "Deep Learning Approaches for Early Detection of Crop Diseases",
  academicSession: "2025–2026",
  similarityIndex: "8%",
  plagiarismSoftware: "Turnitin",
  universityName: "Indian Institute of Technology Delhi",
  shortName: "IIT Delhi",
  campusName: "Main Campus",
  tagline: "Dedicated to Excellence in Research",
  affiliation: "An Institution of National Importance",
  department: "Department of Computer Science and Engineering",
  place: "New Delhi",
  guideName: "Dr. Priya Nair",
  guideDesignation: "Associate Professor",
  guideDepartment: "Department of Computer Science and Engineering",
};

const SERIF = '"Times New Roman", Times, Georgia, serif';

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white text-black"
      style={{ width: A4_W, height: A4_H, fontFamily: SERIF, padding: 28 }}
    >
      <div
        className="h-full w-full"
        style={{ border: "3px solid #000", padding: 5 }}
      >
        <div
          className="flex h-full w-full flex-col"
          style={{ border: "1px solid #000", padding: "48px 56px" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function SignatureBlock({
  lines,
  align = "left",
}: {
  lines: string[];
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <div
        className={`mb-2 border-t border-black ${
          align === "right" ? "ml-auto" : ""
        }`}
        style={{ width: 190 }}
      />
      {lines.map(
        (l, i) =>
          l && (
            <p
              key={i}
              className={i === 0 ? "text-[15px] font-bold" : "text-[14px]"}
            >
              {l}
            </p>
          )
      )}
    </div>
  );
}

function PageHeading({ text }: { text: string }) {
  return (
    <h2 className="mb-10 text-center text-[26px] font-bold uppercase tracking-[0.2em] underline underline-offset-8">
      {text}
    </h2>
  );
}

function UniversityHeader({
  d,
  logo,
  compact = false,
}: {
  d: ThesisFields;
  logo: string | null;
  compact?: boolean;
}) {
  return (
    <div className="text-center">
      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt="University logo"
          className="mx-auto mb-3 object-contain"
          style={{ height: compact ? 64 : 96 }}
        />
      )}
      {show(d.universityName) && (
        <h1
          className={`font-bold uppercase leading-tight tracking-wide ${
            compact ? "text-[22px]" : "text-[28px]"
          }`}
        >
          {val(d.universityName, SAMPLE.universityName)}
        </h1>
      )}
      {show(d.tagline) && (
        <p className="mt-1 text-[14px] italic">
          {val(d.tagline, SAMPLE.tagline)}
        </p>
      )}
      {show(d.affiliation) && (
        <p className="mt-1 text-[13px]">
          ({val(d.affiliation, SAMPLE.affiliation)})
        </p>
      )}
      {show(d.campusName) && (
        <p className="mt-1 text-[13px] font-semibold uppercase tracking-wider">
          {val(d.campusName, SAMPLE.campusName)}
          {show(d.place) && ` , ${val(d.place, SAMPLE.place)}`}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page 1: Cover Page                                                  */
/* ------------------------------------------------------------------ */
function CoverPage({ d, logo }: { d: ThesisFields; logo: string | null }) {
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");
  return (
    <PageShell>
      <UniversityHeader d={d} logo={logo} />
      <div className="mx-auto my-6 h-[2px] w-2/3 bg-black" />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[14px] font-semibold uppercase tracking-[0.3em]">
          A Dissertation on
        </p>
        {show(d.dissertationTitle) && (
          <h2 className="mt-5 px-4 text-[24px] font-bold uppercase leading-snug">
            &ldquo;{val(d.dissertationTitle, SAMPLE.dissertationTitle)}&rdquo;
          </h2>
        )}
        <p className="mt-8 max-w-xl text-[15px] italic leading-relaxed">
          Submitted in partial fulfilment of the requirements for the award of
          the degree of
        </p>
        {show(d.degreeName) && (
          <p className="mt-3 text-[20px] font-bold uppercase">
            {val(d.degreeName, SAMPLE.degreeName)}
          </p>
        )}
        {show(d.specialization) && (
          <p className="mt-1 text-[16px] font-semibold">
            in {val(d.specialization, SAMPLE.specialization)}
          </p>
        )}
        {show(d.academicSession) && (
          <p className="mt-3 text-[14px]">
            Academic Session: {val(d.academicSession, SAMPLE.academicSession)}
          </p>
        )}
      </div>

      <div className="mb-8 flex items-end justify-between gap-8 text-[15px]">
        <div className="text-left">
          <p className="font-bold uppercase tracking-wider">Submitted by</p>
          {show(d.studentName) && (
            <p className="mt-2 font-semibold">
              {val(d.studentName, SAMPLE.studentName)}
            </p>
          )}
          {show(d.enrollment) && (
            <p>Enrollment No.: {val(d.enrollment, SAMPLE.enrollment)}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold uppercase tracking-wider">
            Under the Guidance of
          </p>
          {show(d.guideName) && (
            <p className="mt-2 font-semibold">
              {val(d.guideName, SAMPLE.guideName)}
            </p>
          )}
          {show(d.guideDesignation) && (
            <p>{val(d.guideDesignation, SAMPLE.guideDesignation)}</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <div className="mx-auto mb-4 h-[2px] w-2/3 bg-black" />
        {show(d.department) && (
          <p className="text-[15px] font-bold uppercase tracking-wide">
            {val(d.department, SAMPLE.department)}
          </p>
        )}
        {show(d.shortName) && (
          <p className="mt-1 text-[14px] font-semibold uppercase">
            {val(d.shortName, SAMPLE.shortName)}
          </p>
        )}
        {show(d.place) && (
          <p className="mt-1 text-[14px]">{val(d.place, SAMPLE.place)}</p>
        )}
        {monthYear && (
          <p className="mt-1 text-[14px] font-semibold">{monthYear}</p>
        )}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page 2: Certificate                                                 */
/* ------------------------------------------------------------------ */
function CertificatePage({
  d,
  logo,
}: {
  d: ThesisFields;
  logo: string | null;
}) {
  const student = val(d.studentName, SAMPLE.studentName);
  const title = val(d.dissertationTitle, SAMPLE.dissertationTitle);
  const degree = val(d.degreeName, SAMPLE.degreeName);
  const spec = val(d.specialization, SAMPLE.specialization);
  const session = val(d.academicSession, SAMPLE.academicSession);
  const uni = val(d.universityName, SAMPLE.universityName);
  const enr = val(d.enrollment, SAMPLE.enrollment);
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");
  return (
    <PageShell>
      <UniversityHeader d={d} logo={logo} compact />
      <div className="mx-auto my-6 h-[2px] w-2/3 bg-black" />
      <PageHeading text="Certificate" />

      <div className="space-y-6 text-justify text-[15px] leading-loose">
        <p>
          This is to certify that the dissertation entitled{" "}
          <strong>&ldquo;{title}&rdquo;</strong> submitted by{" "}
          <strong>{student}</strong>
          {show(d.enrollment) && enr && (
            <>
              {" "}
              (Enrollment No. <strong>{enr}</strong>)
            </>
          )}{" "}
          {uni && (
            <>
              to <strong>{uni}</strong>{" "}
            </>
          )}
          in partial fulfilment of the requirements for the award of the degree
          of <strong>{degree}</strong>
          {spec && (
            <>
              {" "}
              in <strong>{spec}</strong>
            </>
          )}{" "}
          is a bona fide record of the original research work carried out by
          the candidate
          {session && (
            <>
              {" "}
              during the academic session <strong>{session}</strong>
            </>
          )}{" "}
          under due supervision, and that the dissertation has reached the
          standard required for submission.
        </p>
        <p>
          The contents of this dissertation, in full or in part, have not been
          submitted to any other institute or university for the award of any
          degree or diploma. The candidate has fulfilled all the prescribed
          academic requirements in respect of the dissertation work.
        </p>
      </div>

      <div className="mt-auto">
        <div className="mb-14 text-[14px]">
          {show(d.place) && <p>Place: {val(d.place, SAMPLE.place)}</p>}
          {monthYear && <p>Date: {monthYear}</p>}
        </div>
        <div className="flex items-end justify-between gap-8">
          <SignatureBlock lines={["Internal Examiner", "Signature with Date"]} />
          <SignatureBlock
            align="right"
            lines={[
              "Head of Department",
              val(d.department, SAMPLE.department),
              val(d.shortName, SAMPLE.shortName),
            ]}
          />
        </div>
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page 3: Certificate by Guide                                        */
/* ------------------------------------------------------------------ */
function GuideCertificatePage({
  d,
  logo,
}: {
  d: ThesisFields;
  logo: string | null;
}) {
  const student = val(d.studentName, SAMPLE.studentName);
  const title = val(d.dissertationTitle, SAMPLE.dissertationTitle);
  const degree = val(d.degreeName, SAMPLE.degreeName);
  const spec = val(d.specialization, SAMPLE.specialization);
  const session = val(d.academicSession, SAMPLE.academicSession);
  const enr = val(d.enrollment, SAMPLE.enrollment);
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");
  return (
    <PageShell>
      <UniversityHeader d={d} logo={logo} compact />
      <div className="mx-auto my-6 h-[2px] w-2/3 bg-black" />
      <PageHeading text="Certificate by the Guide" />

      <div className="space-y-6 text-justify text-[15px] leading-loose">
        <p>
          This is to certify that the work embodied in the dissertation
          entitled <strong>&ldquo;{title}&rdquo;</strong> has been carried out
          by <strong>{student}</strong>
          {show(d.enrollment) && enr && (
            <>
              {" "}
              (Enrollment No. <strong>{enr}</strong>)
            </>
          )}{" "}
          under my supervision and guidance, in partial fulfilment of the
          requirements for the award of the degree of <strong>{degree}</strong>
          {spec && (
            <>
              {" "}
              in <strong>{spec}</strong>
            </>
          )}
          {session && (
            <>
              {" "}
              during the academic session <strong>{session}</strong>
            </>
          )}
          .
        </p>
        <p>
          To the best of my knowledge and belief, the dissertation embodies the
          candidate&apos;s own work, is a record of research completed to my
          satisfaction, and has not previously formed the basis for the award
          of any degree, diploma, associateship or fellowship of any other
          university or institution.
        </p>
        <p>
          I recommend that the dissertation be accepted for evaluation and
          consider the candidate&apos;s conduct during the research period to
          have been sincere and diligent.
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-8">
        <div className="text-[14px]">
          {show(d.place) && <p>Place: {val(d.place, SAMPLE.place)}</p>}
          {monthYear && <p>Date: {monthYear}</p>}
        </div>
        <SignatureBlock
          align="right"
          lines={[
            val(d.guideName, SAMPLE.guideName),
            val(d.guideDesignation, SAMPLE.guideDesignation),
            val(d.guideDepartment, SAMPLE.guideDepartment),
            val(d.shortName, SAMPLE.shortName),
          ]}
        />
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page 4: Declaration                                                 */
/* ------------------------------------------------------------------ */
function DeclarationPage({
  d,
  logo,
}: {
  d: ThesisFields;
  logo: string | null;
}) {
  const student = val(d.studentName, SAMPLE.studentName);
  const title = val(d.dissertationTitle, SAMPLE.dissertationTitle);
  const degree = val(d.degreeName, SAMPLE.degreeName);
  const spec = val(d.specialization, SAMPLE.specialization);
  const uni = val(d.universityName, SAMPLE.universityName);
  const enr = val(d.enrollment, SAMPLE.enrollment);
  const guide = val(d.guideName, SAMPLE.guideName);
  const guideDesig = val(d.guideDesignation, SAMPLE.guideDesignation);
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");
  return (
    <PageShell>
      <UniversityHeader d={d} logo={logo} compact />
      <div className="mx-auto my-6 h-[2px] w-2/3 bg-black" />
      <PageHeading text="Declaration" />

      <div className="space-y-6 text-justify text-[15px] leading-loose">
        <p>
          I, <strong>{student}</strong>
          {show(d.enrollment) && enr && (
            <>
              , Enrollment No. <strong>{enr}</strong>,
            </>
          )}{" "}
          hereby declare that the dissertation entitled{" "}
          <strong>&ldquo;{title}&rdquo;</strong>, submitted
          {uni && (
            <>
              {" "}
              to <strong>{uni}</strong>
            </>
          )}{" "}
          in partial fulfilment of the requirements for the award of the degree
          of <strong>{degree}</strong>
          {spec && (
            <>
              {" "}
              in <strong>{spec}</strong>
            </>
          )}
          , is my own original work carried out
          {guide && (
            <>
              {" "}
              under the supervision of <strong>{guide}</strong>
              {guideDesig && <>, {guideDesig}</>}
            </>
          )}
          .
        </p>
        <p>
          I further declare that the work reported in this dissertation has not
          been submitted, either in part or in full, for the award of any other
          degree or diploma of this university or of any other university or
          institution. All sources of information and literature used in this
          work have been duly acknowledged and cited.
        </p>
        <p>
          I understand that any violation of the above declaration will be
          treated as academic misconduct, and I shall be solely responsible for
          the consequences arising therefrom.
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-8">
        <div className="text-[14px]">
          {show(d.place) && <p>Place: {val(d.place, SAMPLE.place)}</p>}
          {monthYear && <p>Date: {monthYear}</p>}
        </div>
        <SignatureBlock
          align="right"
          lines={[
            student,
            show(d.enrollment) && enr ? `Enrollment No.: ${enr}` : "",
            "(Signature of the Candidate)",
          ]}
        />
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page 5: Plagiarism Report                                           */
/* ------------------------------------------------------------------ */
function PlagiarismPage({
  d,
  logo,
}: {
  d: ThesisFields;
  logo: string | null;
}) {
  const student = val(d.studentName, SAMPLE.studentName);
  const title = val(d.dissertationTitle, SAMPLE.dissertationTitle);
  const degree = val(d.degreeName, SAMPLE.degreeName);
  const session = val(d.academicSession, SAMPLE.academicSession);
  const software = val(d.plagiarismSoftware, SAMPLE.plagiarismSoftware);
  const index = val(d.similarityIndex, SAMPLE.similarityIndex);
  const enr = val(d.enrollment, SAMPLE.enrollment);
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");

  const rows: [string, string][] = [
    ["Title of the Dissertation", title],
    ["Name of the Candidate", student],
  ];
  if (show(d.enrollment)) rows.push(["Enrollment Number", enr]);
  if (show(d.degreeName)) rows.push(["Degree Programme", degree]);
  if (show(d.academicSession)) rows.push(["Academic Session", session]);
  if (show(d.plagiarismSoftware)) rows.push(["Software Used", software]);
  if (show(d.similarityIndex)) rows.push(["Similarity Index Found", index]);

  return (
    <PageShell>
      <UniversityHeader d={d} logo={logo} compact />
      <div className="mx-auto my-6 h-[2px] w-2/3 bg-black" />
      <PageHeading text="Plagiarism Verification Report" />

      <p className="text-justify text-[15px] leading-loose">
        This is to certify that the dissertation detailed below has been
        subjected to a plagiarism check
        {show(d.plagiarismSoftware) && software && (
          <>
            {" "}
            using <strong>{software}</strong>
          </>
        )}
        , as per the plagiarism policy of the university
        {show(d.academicSession) && session && (
          <>
            {" "}
            for the academic session <strong>{session}</strong>
          </>
        )}
        , and the outcome of the verification is recorded as follows:
      </p>

      <table
        className="mt-8 w-full border-collapse text-[14px]"
        style={{ border: "1px solid #000" }}
      >
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td
                className="w-1/2 px-4 py-3 font-bold"
                style={{ border: "1px solid #000" }}
              >
                {k}
              </td>
              <td className="px-4 py-3" style={{ border: "1px solid #000" }}>
                {v}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-8 text-justify text-[15px] leading-loose">
        {show(d.similarityIndex) && index ? (
          <>
            The similarity index of <strong>{index}</strong> reported above is
            within the permissible limit prescribed by the university, and
          </>
        ) : (
          <>The similarity found is within the permissible limit, and</>
        )}{" "}
        the dissertation is therefore considered fit for submission and
        evaluation. The candidate affirms that the report generated by the
        verification software has been reviewed and accepted.
      </p>

      <div className="mt-auto flex items-end justify-between gap-8">
        <SignatureBlock
          lines={[
            student,
            "(Signature of the Candidate)",
            monthYear ? `Date: ${monthYear}` : "",
          ]}
        />
        <SignatureBlock
          align="right"
          lines={[
            val(d.guideName, SAMPLE.guideName),
            val(d.guideDesignation, SAMPLE.guideDesignation),
            "(Signature of the Guide)",
          ]}
        />
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Page 6: Title Page                                                  */
/* ------------------------------------------------------------------ */
function TitlePage({ d, logo }: { d: ThesisFields; logo: string | null }) {
  const monthYear = [val(d.month, "June"), val(d.year, "2026")]
    .filter(Boolean)
    .join(" ");
  return (
    <PageShell>
      <div className="flex flex-1 flex-col items-center text-center">
        {show(d.dissertationTitle) && (
          <h1 className="mt-6 px-4 text-[26px] font-bold uppercase leading-snug">
            {val(d.dissertationTitle, SAMPLE.dissertationTitle)}
          </h1>
        )}
        <div className="mx-auto my-8 h-[2px] w-1/2 bg-black" />
        <p className="max-w-xl text-[15px] italic leading-relaxed">
          A dissertation submitted
          {show(d.universityName) && (
            <> to {val(d.universityName, SAMPLE.universityName)}</>
          )}{" "}
          in partial fulfilment of the requirements for the award of the degree
          of
        </p>
        {show(d.degreeName) && (
          <p className="mt-4 text-[20px] font-bold uppercase">
            {val(d.degreeName, SAMPLE.degreeName)}
          </p>
        )}
        {show(d.specialization) && (
          <p className="mt-1 text-[16px] font-semibold">
            ({val(d.specialization, SAMPLE.specialization)})
          </p>
        )}

        <p className="mt-12 text-[14px] font-semibold uppercase tracking-[0.3em]">
          By
        </p>
        {show(d.studentName) && (
          <p className="mt-2 text-[19px] font-bold uppercase">
            {val(d.studentName, SAMPLE.studentName)}
          </p>
        )}
        {show(d.enrollment) && (
          <p className="mt-1 text-[14px]">
            Enrollment No.: {val(d.enrollment, SAMPLE.enrollment)}
          </p>
        )}

        <p className="mt-10 text-[14px] font-semibold uppercase tracking-[0.3em]">
          Under the Supervision of
        </p>
        {show(d.guideName) && (
          <p className="mt-2 text-[17px] font-bold">
            {val(d.guideName, SAMPLE.guideName)}
          </p>
        )}
        {show(d.guideDesignation) && (
          <p className="text-[14px]">
            {val(d.guideDesignation, SAMPLE.guideDesignation)}
          </p>
        )}
        {show(d.guideDepartment) && (
          <p className="text-[14px]">
            {val(d.guideDepartment, SAMPLE.guideDepartment)}
          </p>
        )}
      </div>

      <div className="text-center">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logo}
            alt="University logo"
            className="mx-auto mb-4 object-contain"
            style={{ height: 72 }}
          />
        )}
        {show(d.department) && (
          <p className="text-[15px] font-bold uppercase tracking-wide">
            {val(d.department, SAMPLE.department)}
          </p>
        )}
        {show(d.universityName) && (
          <p className="mt-1 text-[15px] font-semibold uppercase">
            {val(d.universityName, SAMPLE.universityName)}
          </p>
        )}
        {show(d.place) && (
          <p className="mt-1 text-[14px]">{val(d.place, SAMPLE.place)}</p>
        )}
        {show(d.academicSession) && (
          <p className="mt-1 text-[14px]">
            Academic Session: {val(d.academicSession, SAMPLE.academicSession)}
          </p>
        )}
        {monthYear && (
          <p className="mt-1 text-[14px] font-semibold">{monthYear}</p>
        )}
      </div>
    </PageShell>
  );
}

/* ------------------------------------------------------------------ */
/* Generator                                                           */
/* ------------------------------------------------------------------ */
const PAGE_NAMES = [
  "Cover Page",
  "Certificate",
  "Certificate by Guide",
  "Declaration",
  "Plagiarism Report",
  "Title Page",
];

export default function ThesisGenerator() {
  const [fields, setFields] = useState<ThesisFields>(defaultFields);
  const [logo, setLogo] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const hydrated = useRef(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Autosave: restore on mount, persist on change */
  useEffect(() => {
    const saved = loadAutosave<ThesisDraft>("thesis");
    if (saved?.fields) {
      setFields((prev) => ({ ...prev, ...saved.fields }));
      setLogo(saved.logo ?? null);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    saveAutosave<ThesisDraft>("thesis", { fields, logo });
  }, [fields, logo]);

  const set =
    (key: keyof ThesisFields) =>
    (next: FieldState) =>
      setFields((f) => ({ ...f, [key]: next }));

  const resetAll = () => {
    setFields(defaultFields());
    setLogo(null);
    setPage(0);
    clearAutosave("thesis");
  };

  const renderPage = (i: number) => {
    switch (i) {
      case 0:
        return <CoverPage d={fields} logo={logo} />;
      case 1:
        return <CertificatePage d={fields} logo={logo} />;
      case 2:
        return <GuideCertificatePage d={fields} logo={logo} />;
      case 3:
        return <DeclarationPage d={fields} logo={logo} />;
      case 4:
        return <PlagiarismPage d={fields} logo={logo} />;
      default:
        return <TitlePage d={fields} logo={logo} />;
    }
  };

  const handleGenerate = async () => {
    const nodes = pageRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (!nodes.length) return;
    setBusy(true);
    try {
      await exportElementsToPdf(nodes, "thesis.pdf", "portrait");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* -------------------------------- Form -------------------------------- */}
      <div className="space-y-6">
        <DraftBar<ThesisDraft>
          tool="thesis"
          getData={() => ({ fields, logo })}
          onLoad={(data) => {
            setFields({ ...defaultFields(), ...data.fields });
            setLogo(data.logo ?? null);
          }}
          onDiscard={resetAll}
        />

        <GenSection number="01" title="Student Information">
          <FieldRow
            field={fields.studentName}
            onChange={set("studentName")}
            placeholder="e.g. Aarav Mehta"
            editableLabel
          />
          <FieldRow
            field={fields.enrollment}
            onChange={set("enrollment")}
            placeholder="e.g. EN21CS301128"
            editableLabel
          />
          <FieldRow
            field={fields.degreeName}
            onChange={set("degreeName")}
            placeholder="e.g. Master of Technology"
            editableLabel
          />
          <FieldRow
            field={fields.specialization}
            onChange={set("specialization")}
            placeholder="e.g. Computer Science & Engineering"
            editableLabel
          />
        </GenSection>

        <GenSection number="02" title="Dissertation Details">
          <FieldRow
            field={fields.dissertationTitle}
            onChange={set("dissertationTitle")}
            placeholder="Exact approved title of your research study"
            editableLabel
            multiline
          />
          <FieldRow
            field={fields.academicSession}
            onChange={set("academicSession")}
            placeholder="e.g. 2025–2026"
            editableLabel
          />
          <FieldRow
            field={fields.similarityIndex}
            onChange={set("similarityIndex")}
            placeholder="e.g. 8%"
            editableLabel
          />
          <FieldRow
            field={fields.plagiarismSoftware}
            onChange={set("plagiarismSoftware")}
            placeholder="e.g. Turnitin"
            editableLabel
          />
        </GenSection>

        <GenSection number="03" title="University Information">
          <LogoUpload
            label="University Logo"
            value={logo}
            onChange={setLogo}
          />
          <FieldRow
            field={fields.universityName}
            onChange={set("universityName")}
            placeholder="Official name of your university/college"
            editableLabel
          />
          <FieldRow
            field={fields.shortName}
            onChange={set("shortName")}
            placeholder="e.g. IIT Delhi"
            editableLabel
          />
          <FieldRow
            field={fields.campusName}
            onChange={set("campusName")}
            placeholder="e.g. Main Campus"
            editableLabel
          />
          <FieldRow
            field={fields.tagline}
            onChange={set("tagline")}
            placeholder="e.g. Dedicated to Excellence in Research"
            editableLabel
          />
          <FieldRow
            field={fields.affiliation}
            onChange={set("affiliation")}
            placeholder="e.g. An Institution of National Importance"
            editableLabel
          />
          <FieldRow
            field={fields.department}
            onChange={set("department")}
            placeholder="e.g. Department of Computer Science and Engineering"
            editableLabel
          />
          <FieldRow
            field={fields.place}
            onChange={set("place")}
            placeholder="e.g. New Delhi"
            editableLabel
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectRow
              field={fields.month}
              onChange={set("month")}
              options={MONTHS}
            />
            <SelectRow
              field={fields.year}
              onChange={set("year")}
              options={YEARS}
            />
          </div>
        </GenSection>

        <GenSection number="04" title="Guide/Supervisor">
          <FieldRow
            field={fields.guideName}
            onChange={set("guideName")}
            placeholder="e.g. Dr. Priya Nair"
            editableLabel
          />
          <FieldRow
            field={fields.guideDesignation}
            onChange={set("guideDesignation")}
            placeholder="e.g. Associate Professor"
            editableLabel
          />
          <FieldRow
            field={fields.guideDepartment}
            onChange={set("guideDepartment")}
            placeholder="e.g. Department of Computer Science and Engineering"
            editableLabel
          />
        </GenSection>
      </div>

      {/* ------------------------------ Preview ------------------------------- */}
      <div className="space-y-4 self-start lg:sticky lg:top-24">
        <div className="flex items-center justify-between border-2 border-black bg-white px-3 py-2 shadow-brutal">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-brand disabled:opacity-40 disabled:hover:bg-white"
          >
            ← Prev
          </button>
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-widest">
              {page + 1} / {PAGE_NAMES.length}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {PAGE_NAMES[page]}
            </p>
          </div>
          <button
            type="button"
            disabled={page === PAGE_NAMES.length - 1}
            onClick={() =>
              setPage((p) => Math.min(PAGE_NAMES.length - 1, p + 1))
            }
            className="border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm transition-colors hover:bg-brand disabled:opacity-40 disabled:hover:bg-white"
          >
            Next →
          </button>
        </div>

        <div className="border-2 border-black shadow-brutal-lg">
          <ScaledPreview width={A4_W} height={A4_H}>
            {renderPage(page)}
          </ScaledPreview>
        </div>

        <GeneratePanel onGenerate={handleGenerate} busy={busy} />
      </div>

      {/* Full-size pages rendered off-screen so refs exist for every page */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: -9999,
          top: 0,
          zIndex: -1,
          pointerEvents: "none",
        }}
      >
        {PAGE_NAMES.map((name, i) => (
          <div
            key={name}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
          >
            {renderPage(i)}
          </div>
        ))}
      </div>
    </div>
  );
}
