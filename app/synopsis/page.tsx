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
import SynopsisGenerator from "@/components/generator/SynopsisGenerator";

export const metadata: Metadata = {
  title: "Free Online Synopsis Generator | Draftly",
  description:
    "Create professional synopsis cover pages instantly. Enter your study title, student and college details, preview live and download a print-ready A4 PDF — 100% free, no watermarks.",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is a project synopsis cover page?",
    a: "A project synopsis cover page is the title page of your preliminary research proposal or project outline. It includes the study title, student details, institutional information, and the academic year.",
  },
  {
    q: "How do I format a synopsis title page?",
    a: "Using Draftly, simply enter your study title, student name, enrollment number, and college details. The tool automatically formats these into a university-approved, professional layout.",
  },
  {
    q: "Is the synopsis cover generator free to use?",
    a: "Yes, Draftly offers a completely free synopsis cover page generator. You can create and download as many high-quality PDFs as you need with zero watermarks.",
  },
  {
    q: "Can I add my university logo to the synopsis?",
    a: "Yes, you can easily upload your university's official logo. The generator will automatically center and scale it perfectly on your cover page.",
  },
  {
    q: "What information is required for a synopsis cover?",
    a: "A standard synopsis cover requires the Study Title, your Academic Program or Degree, Student Name, Enrollment Number, College Name, Campus Location, and the Academic Year.",
  },
  {
    q: "Can I hide fields that my university does not require?",
    a: "Absolutely. You have full control over field visibility. Simply toggle the 'INCLUDE / HIDE' button next to any field to remove it from the final PDF.",
  },
  {
    q: "In what format will I receive my synopsis cover?",
    a: "Your synopsis cover page will be generated and downloaded as a print-ready, high-resolution A4 PDF document.",
  },
  {
    q: "Can I save my synopsis details for later?",
    a: "Yes, Draftly automatically saves your inputs locally in your browser. You can even access your previous generations via the 'History' button.",
  },
];

const STEPS = [
  {
    name: "Enter Study Details",
    text: "Input your project title, organization, and academic program.",
  },
  {
    name: "Input Student Details",
    text: "Provide your full name and official enrollment number.",
  },
  {
    name: "Add College Info",
    text: "Supply college name, campus location, and academic year.",
  },
  {
    name: "Upload Official Logo",
    text: "Add your university's emblem for professionalism.",
  },
  {
    name: "Export PDF",
    text: "Review the live preview and download your high-resolution PDF.",
  },
];

const BENEFITS = [
  {
    name: "100% Free",
    text: "No subscriptions, no hidden fees, and absolutely no watermarks on your PDF.",
  },
  {
    name: "Perfect Alignment",
    text: "Text and logos are automatically centered to meet academic guidelines.",
  },
  {
    name: "Customizable Fields",
    text: "Easily toggle the visibility of any field your university doesn't require.",
  },
  {
    name: "Instant Live Preview",
    text: "See exactly how your cover page will print before you even download it.",
  },
];

const ESSENTIAL_DETAILS = [
  {
    name: "Study Title",
    text: "The formal, approved title of your proposed research or project.",
  },
  {
    name: "Academic Program",
    text: "Your exact degree course (e.g., Master of Business Administration).",
  },
  {
    name: "Student Details",
    text: "Your full legal name and university-issued roll or registration number.",
  },
  {
    name: "College Name",
    text: "The official name of the institution where you are submitting the synopsis.",
  },
  {
    name: "Academic Year",
    text: "The specific session or batch year in which the project is being undertaken.",
  },
  {
    name: "University Logo",
    text: "The official, high-resolution crest or emblem of your college.",
  },
];

export default function SynopsisPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-12 text-center sm:px-6">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Free Online{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Synopsis
            </span>{" "}
            Generator
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700">
            Create professional synopsis cover pages instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <SynopsisGenerator />

      {/* Landing content */}
      <LandingIntro
        titlePrefix="Create Synopsis Covers"
        titleHighlight="In Seconds"
        subtitle="Fill the form, preview your cover live, and download a print-ready A4 PDF — free, with zero watermarks."
      />

      <ProseSection
        title="What Is a Project Synopsis Cover Page?"
        paragraphs={[
          "A project synopsis cover page serves as the formal title page of your research proposal or preliminary project outline.",
          "Most universities require students to submit a synopsis for approval before starting any major academic work, and the cover page makes the critical first impression on your evaluators and guides.",
          "A dedicated generator ensures your cover complies with university formatting standards — handling alignment and margins automatically to produce a print-ready PDF that cleanly displays your study title, academic profile, and institutional details.",
        ]}
      />

      <StepsSection
        title="How to Create a Synopsis Cover Page"
        intro="Follow these five simple steps to generate a submission-ready cover page:"
        steps={STEPS}
      />

      <ChecklistSection title="Why Use Draftly's Generator?" items={BENEFITS} />

      <DetailsGridSection
        title="Essential Details for Synopsis Covers"
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
