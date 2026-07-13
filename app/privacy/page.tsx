import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CoverLe",
  description:
    "Learn how CoverLe handles your data: local browser storage for drafts, anonymous analytics, and no permanent server-side storage of your academic details.",
};

const SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "Information We Collect",
    paragraphs: [
      "We collect information in two ways: details you explicitly provide when filling document forms, and anonymous usage data collected automatically. This information is used only to generate your documents and improve the service.",
    ],
  },
  {
    title: "Information You Provide",
    paragraphs: [
      "When you use our tools you may enter academic details such as your name, enrollment number, university, course and similar information. This data is used exclusively to create the documents you request.",
    ],
  },
  {
    title: "Local Storage & Drafts",
    paragraphs: [
      "Form drafts and template selections are saved in your browser's local storage, on your own device. This information is not permanently transmitted to or stored on CoverLe's servers.",
    ],
  },
  {
    title: "Analytics & Usage Data",
    paragraphs: [
      "We collect anonymous usage metrics such as pages visited, tools used and general device information. We never sell or share your personal academic records with anyone.",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "CoverLe uses essential cookies for core functionality, preference cookies to remember your settings, and analytics cookies to understand usage. You can manage or disable cookies at any time through your browser settings.",
    ],
  },
  {
    title: "Uploaded Logos & Files",
    paragraphs: [
      "If you upload an institution logo or other files, they are processed solely to build your document. We do not claim ownership of your uploads and do not permanently store them.",
    ],
  },
  {
    title: "How We Use Information",
    paragraphs: [
      "Your information is used to generate documents, maintain and improve the platform, monitor usage patterns, and announce service updates. You retain full ownership of every document you generate.",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We keep personal information only as long as necessary for the purposes described in this policy. Drafts stored locally in your browser remain there until you clear them yourself.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "We use third-party providers for hosting, analytics, authentication and payments. These services operate under their own privacy policies, which we encourage you to review.",
    ],
  },
  {
    title: "Data Security",
    paragraphs: [
      "We implement reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "CoverLe is intended for students and academic professionals. We do not knowingly collect personal information from children under the age of 13.",
    ],
  },
  {
    title: "Your Rights",
    paragraphs: [
      "You may request access to, correction of, or deletion of your personal data at any time. Data stored locally in your browser is always fully under your control.",
    ],
  },
  {
    title: "Changes To This Policy",
    paragraphs: [
      "We may update this policy periodically. Updates are indicated by the \"Last Updated\" date at the top of this page, and continued use of the platform after changes constitutes acceptance.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "For any privacy-related questions or requests, reach out to us at anshulrajkumar777@gmail.com.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <div className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Privacy{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Policy
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Your data stays yours. Here is exactly what we collect, what we
            don&apos;t, and how everything is handled.
          </p>
          <span className="mt-6 inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
            Last Updated: June 2026
          </span>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <section
              key={section.title}
              className="border-2 border-black bg-white p-6 shadow-brutal"
            >
              <h2 className="flex items-center gap-3 text-lg font-black sm:text-xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-brand text-xs font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              {section.paragraphs.map((p, j) => (
                <p
                  key={j}
                  className="mt-3 text-sm font-medium leading-relaxed text-slate-700"
                >
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
        <div className="mt-10 border-2 border-black bg-brand/20 p-6 shadow-brutal">
          <h2 className="text-xs font-black uppercase tracking-widest">
            Privacy Questions?
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-700">
            Email us at{" "}
            <a
              href="mailto:anshulrajkumar777@gmail.com"
              className="font-black underline underline-offset-4 decoration-2"
            >
              anshulrajkumar777@gmail.com
            </a>{" "}
            and we&apos;ll get back to you.
          </p>
        </div>
      </div>
    </div>
  );
}
