import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Draftly",
  description:
    "Read the terms of service for Draftly, the free academic document generator for assignment covers, resumes, internship reports, synopsis and thesis formatting.",
};

const SECTIONS: { title: string; paragraphs: string[] }[] = [
  {
    title: "About Draftly",
    paragraphs: [
      "Draftly is an online platform that formats and generates academic documents such as assignment covers, certificates, resumes, internship reports, synopsis pages and thesis sections. By accessing or using the service you agree to be bound by these terms. If you do not agree with any part of them, please do not use the platform.",
    ],
  },
  {
    title: "Eligibility",
    paragraphs: [
      "The service is intended for students, educators and academic professionals. By using Draftly you confirm that you have the legal capacity and authority to enter into this agreement.",
    ],
  },
  {
    title: "User Responsibilities",
    paragraphs: [
      "You are solely responsible for the information you enter and the content of the documents you generate. You agree not to use the service for any unlawful purpose, including the creation of fraudulent or misleading academic materials.",
    ],
  },
  {
    title: "Academic Integrity",
    paragraphs: [
      "Draftly is a formatting tool — it does not write or create academic content for you. We firmly oppose plagiarism and academic dishonesty. You must ensure your use of generated documents complies with the policies of your institution.",
    ],
  },
  {
    title: "Generated Documents",
    paragraphs: [
      "Documents are provided on an as-is basis without any guarantee of formatting accuracy or suitability. It is your responsibility to review and verify every generated document before submitting it anywhere.",
    ],
  },
  {
    title: "Templates and Formatting",
    paragraphs: [
      "Our templates follow commonly accepted university formatting guidelines, but individual institutions may have specific requirements our templates do not satisfy. Always check your institution's guidelines before submission.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "The Draftly platform, including its templates, design and code, remains our property. You retain full rights to the personal data you enter and to the content of the documents you generate.",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "You may not reverse-engineer, scrape, or use automated bots to generate documents from the platform. Any attempt to disrupt or abuse the service is prohibited.",
    ],
  },
  {
    title: "Data Storage",
    paragraphs: [
      "Draft data is stored in your browser's localStorage on your own device. We do not permanently store your document data on our servers without notice.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "Draftly may rely on third-party services for hosting, analytics or other functionality. We are not responsible for failures, outages or security issues originating from those external services.",
    ],
  },
  {
    title: "Premium Features",
    paragraphs: [
      "Draftly is currently free to use. If paid features are introduced in the future, they will be clearly communicated along with any additional terms that apply.",
    ],
  },
  {
    title: "Service Availability",
    paragraphs: [
      "We strive to maintain 99.9% uptime, but we do not guarantee that the service will be available at all times. Maintenance, updates or factors beyond our control may cause temporary interruptions.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, Draftly shall not be liable for any indirect, incidental or consequential damages arising from your use of, or inability to use, the service.",
    ],
  },
  {
    title: "Termination",
    paragraphs: [
      "We reserve the right to suspend or terminate access to the service immediately, without prior notice, for any violation of these terms.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time. Changes take effect when posted on this page, indicated by the modified date. Continued use of the service after changes constitutes acceptance of the updated terms.",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These terms are governed by and construed in accordance with the laws of the applicable jurisdiction, without regard to conflict-of-law principles.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div>
      <div className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Terms of{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Service
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            The rules of the road for using Draftly. Please read them before
            generating your documents.
          </p>
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
            Questions?
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-700">
            If you have any questions about these terms, contact us at{" "}
            <a
              href="mailto:anshulrajkumar777@gmail.com"
              className="font-black underline underline-offset-4 decoration-2"
            >
              anshulrajkumar777@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
