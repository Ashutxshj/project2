import type { Metadata } from "next";
import FAQ, { type FAQItem } from "@/components/FAQ";
import {
  ChecklistSection,
  CoreFeatures,
  DetailsGridSection,
  LandingIntro,
  ProseSection,
  RelatedTools,
  StepsSection,
} from "@/components/LandingContent";
import InternshipGenerator from "@/components/generator/InternshipGenerator";

export const metadata: Metadata = {
  title: "Free Online Internship Report Generator | Draftly",
  description:
    "Create professional internship report cover pages instantly. Add your college logo, supervisor and student details, preview live and download a print-ready A4 PDF — 100% free, no watermarks.",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is an internship report cover page?",
    a: "An internship report cover page is the first page of your official training report. It includes essential details like your name, enrollment number, university details, and the organization where you completed your internship.",
  },
  {
    q: "How do I make an internship report cover page?",
    a: "With Draftly, just fill out the simple form with your internship details, upload your university logo if needed, preview the layout, and click 'Generate PDF' to download your cover page instantly.",
  },
  {
    q: "Is this internship cover page generator free?",
    a: "Yes, Draftly provides a completely free internship report cover page generator without any watermarks or hidden charges.",
  },
  {
    q: "Can I add my college logo to the cover page?",
    a: "Absolutely! Our generator includes a logo uploader that perfectly centers your university or college logo on the title page according to standard academic guidelines.",
  },
  {
    q: "What is the standard format for an internship report cover?",
    a: "A standard format includes the report title, company name, your academic program, your supervisor's name and designation, your details (name, enrollment number), and the university's details.",
  },
  {
    q: "Can I hide certain fields if they are not required?",
    a: "Yes, Draftly allows you to easily toggle the visibility of any field. If your university doesn't require a specific detail, just click 'HIDE' and it will be removed from the generated PDF.",
  },
  {
    q: "Is the generated PDF print-ready?",
    a: "Yes, the internship cover pages are generated as high-resolution, standard A4 PDFs that are completely print-ready.",
  },
];

const STEPS = [
  {
    name: "Enter Document Info",
    text: "Type your report title, company name, degree program, and date.",
  },
  {
    name: "Add Supervisor Info",
    text: "Provide the name and designation of your internal or external guide.",
  },
  {
    name: "Input Student Details",
    text: "Enter your full name, enrollment number, and the exact internship duration.",
  },
  {
    name: "Upload College Logo",
    text: "Enter your university details and upload your official college logo image.",
  },
  {
    name: "Generate PDF",
    text: "Review the live preview and download your high-resolution, print-ready file.",
  },
];

const BENEFITS = [
  {
    name: "100% Free",
    text: "Generate unlimited PDF cover pages without hidden costs or premium upgrades.",
  },
  {
    name: "Perfect Logo Alignment",
    text: "Easily upload your university logo and we will center it flawlessly on the page.",
  },
  {
    name: "Toggle Unnecessary Fields",
    text: "If your college doesn't require a specific field, simply hide it with one click.",
  },
  {
    name: "Real-Time Canvas Preview",
    text: "View how your final document will look before you hit the download button.",
  },
];

const ESSENTIAL_DETAILS = [
  {
    name: "Organization Name",
    text: "The official registered name of the company where you interned.",
  },
  {
    name: "Academic Program",
    text: "Your exact degree (e.g., Bachelor of Technology in Computer Science).",
  },
  {
    name: "Supervisor Details",
    text: "The name and formal designation of your mentor or guide.",
  },
  {
    name: "Student Information",
    text: "Your legal name and university-issued roll or enrollment number.",
  },
  {
    name: "Internship Duration",
    text: "The specific start and end months/years of your industrial training.",
  },
  {
    name: "University Logo",
    text: "A clear, high-resolution official emblem of your academic institution.",
  },
];

export default function InternshipReportPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Free Online{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Internship Report
            </span>{" "}
            Generator
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700">
            Create professional internship report cover pages instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <InternshipGenerator />

      {/* Landing content */}
      <LandingIntro
        titlePrefix="Create Internship Covers"
        titleHighlight="In Seconds"
        subtitle="Fill the form, preview your cover live, and download a print-ready A4 PDF — free, with zero watermarks."
      />

      <ProseSection
        title="What Is an Internship Report Cover Page?"
        paragraphs={[
          "An internship report cover page is the official front page of the final document you submit to your university after completing summer training, an industrial internship, or a corporate project.",
          "It gives evaluators immediate context about your report, the organization where you trained, and your academic profile — including your name, enrollment number, program, supervisor, and the exact duration of your internship.",
          "Because universities enforce strict formatting guidelines for these submissions, using a dedicated generator ensures your cover page looks professional and prevents the common alignment and spacing errors that cost marks.",
        ]}
      />

      <StepsSection
        title="How to Create an Internship Cover Page"
        intro="Follow these five simple steps to generate a submission-ready cover page:"
        steps={STEPS}
      />

      <ChecklistSection
        title="Why Use Draftly's Generator?"
        items={BENEFITS}
      />

      <DetailsGridSection
        title="Essential Details for Internship Covers"
        intro="Make sure your cover page includes each of these details before you submit:"
        items={ESSENTIAL_DETAILS}
      />

      <CoreFeatures
        features={[
          "Logo Upload",
          "Field Control",
          "Live Preview",
          "PDF Export",
          "No Watermarks",
        ]}
      />

      <div className="border-t-4 border-black bg-grid-paper">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <RelatedTools
        intro="Explore our suite of free professional document generators:"
        links={[
          { label: "Assignment Cover", href: "/assignment-cover" },
          { label: "Certificate Generator", href: "/certificate" },
          { label: "Resume Builder", href: "/resume" },
          { label: "Thesis Cover", href: "/thesis" },
        ]}
      />
    </div>
  );
}
