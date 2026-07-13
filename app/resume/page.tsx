import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { RESUME_TEMPLATES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Free Online Resume Builder - ATS Friendly, No Watermarks | CoverLe",
  description:
    "Build a professional, ATS-friendly resume online for free. Pick a template, fill in your details, preview live and download a print-ready PDF — no watermarks.",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is an online resume builder?",
    a: "An online resume builder is a tool that helps you create a professional, well-formatted resume quickly. It provides pre-designed templates where you simply fill in your work experience, education, and skills.",
  },
  {
    q: "How do I build a resume for free?",
    a: "Using CoverLe, you can build a professional resume completely for free. Select a resume template, enter your details using our intuitive form, and download your finished resume as a high-quality PDF.",
  },
  {
    q: "Are the resume templates ATS-friendly?",
    a: "Yes, our resume templates are designed with clean, standard formatting that Applicant Tracking Systems (ATS) can easily read and parse, increasing your chances of passing automated screenings.",
  },
  {
    q: "Is the downloaded resume PDF free of watermarks?",
    a: "Absolutely. CoverLe provides completely free resume generation with zero watermarks or hidden fees when exporting your PDF.",
  },
  {
    q: "Can I customize the resume format?",
    a: "Our builder allows you to select from multiple professional templates and layouts, ensuring your resume format aligns perfectly with your industry standards.",
  },
  {
    q: "What sections should a professional resume include?",
    a: "A standard professional resume should include your Contact Information, a Professional Summary, Work Experience, Education, and Key Skills.",
  },
  {
    q: "Does the resume maker work on mobile phones?",
    a: "Yes, our resume generator is fully optimized for mobile devices, allowing you to create and download your resume on the go.",
  },
  {
    q: "Can I save my resume progress?",
    a: "Yes, your resume data is automatically synced locally in your browser, allowing you to leave and come back without losing your progress.",
  },
  {
    q: "Do I need design skills to build a resume?",
    a: "No design skills are required. The layout, typography, and spacing are pre-configured in our templates, so you can focus entirely on the content of your resume.",
  },
];

export default function ResumePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8">
          <span className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
            100% Free · No Watermarks
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Free Online{" "}
            <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
              Resume Builder
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Select a resume layout to start building your professional resume.
          </p>
        </div>
      </section>

      {/* Template picker */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Choose a{" "}
          <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
            Template
          </span>
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESUME_TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="flex flex-col border-2 border-black bg-white shadow-brutal"
            >
              <div className="relative aspect-[210/297] w-full border-b-2 border-black bg-slate-50">
                <Image
                  src={t.preview}
                  alt={`${t.name} preview`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-4">
                {t.badge && (
                  <span className="mb-2 self-start border-2 border-black bg-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-brand shadow-brutal-sm">
                    {t.badge}
                  </span>
                )}
                <h3 className="text-base font-black tracking-tight">
                  {t.name}
                </h3>
                <p className="mt-1 flex-1 text-sm font-medium text-slate-700">
                  {t.description}
                </p>
                <Link
                  href={`/resume/${t.id}`}
                  className="mt-4 block border-2 border-black bg-brand px-4 py-2 text-center text-xs font-black uppercase tracking-widest shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Long-form landing content */}
      <LandingIntro
        titlePrefix="Free Online"
        titleHighlight="Resume Builder"
        subtitle="Create a professional, ATS-friendly resume in minutes and download a print-ready PDF — completely free, no watermarks."
      />

      <ProseSection
        title="What Is an Online Resume Builder?"
        paragraphs={[
          "An online resume builder is a streamlined application designed to help job seekers create professional, perfectly formatted resumes without wrestling with complex word processors. Instead of starting from a blank page, you leverage pre-designed resume templates crafted specifically to highlight your career achievements.",
          "A high-quality resume maker takes the guesswork out of formatting, ensuring your document looks polished and reads perfectly. Whether you need a simple chronological layout or a modern professional resume, our tool automatically aligns your text, manages margins, and exports a print-ready PDF that you can attach directly to your job applications.",
        ]}
      />

      <StepsSection
        title="How to Build a Professional Resume"
        intro="Creating an impressive resume is completely frictionless with CoverLe."
        steps={[
          {
            name: "Select a Layout",
            text: "Choose from our curated selection of professional, ATS-optimized templates.",
          },
          {
            name: "Enter Contact Info",
            text: "Add your name, email, phone number, and professional links like LinkedIn.",
          },
          {
            name: "Detail Your Experience",
            text: "Fill in your work history, education, and key achievements clearly.",
          },
          {
            name: "List Your Skills",
            text: "Highlight your technical and soft skills to pass keyword screenings.",
          },
          {
            name: "Generate & Download",
            text: "Preview the live document and download your high-resolution PDF.",
          },
        ]}
      />

      <ChecklistSection
        title="Why Use CoverLe's Resume Maker?"
        intro="Our free resume builder is built to maximize your chances of getting hired."
        items={[
          {
            name: "100% Free & No Watermarks:",
            text: "Download premium PDFs without hitting paywalls at checkout.",
          },
          {
            name: "ATS-Friendly Formats:",
            text: "Clean, semantic layouts that automated hiring systems can easily parse.",
          },
          {
            name: "Real-Time Live Preview:",
            text: "See exactly how your resume looks as you type, with zero lag.",
          },
          {
            name: "No Design Skills Needed:",
            text: "We handle all the typography, spacing, and alignment automatically.",
          },
          {
            name: "Local Autosave:",
            text: "Close your tab safely; your draft is saved locally in your browser.",
          },
        ]}
      />

      <DetailsGridSection
        title="What Makes an ATS-Friendly Resume?"
        intro="Many employers use Applicant Tracking Systems (ATS) to filter resumes before a human ever reads them. A standard, optimized resume format ensures you pass the software screening:"
        items={[
          {
            name: "Standard Sections",
            text: "Clear headers like 'Experience' and 'Education' that software recognizes.",
          },
          {
            name: "Keyword Rich",
            text: "Including specific skills and tools mentioned directly in the job description.",
          },
          {
            name: "Clean Formatting",
            text: "Avoiding complex multi-column designs that break parsing algorithms.",
          },
          {
            name: "Standard Fonts",
            text: "Using highly readable, professional typography across the entire document.",
          },
        ]}
      />

      <CoreFeatures
        features={[
          "ATS-Friendly",
          "Live Preview",
          "PDF Export",
          "No Watermarks",
          "Local Autosave",
          "Mobile Friendly",
        ]}
      />

      <div className="border-t-4 border-black bg-grid-paper">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <RelatedTools
        intro="Beyond resumes, CoverLe offers free tools for your entire academic and professional journey:"
        links={[
          { label: "Assignment Cover", href: "/assignment-cover" },
          { label: "Certificate Generator", href: "/certificate" },
          { label: "Internship Report", href: "/internship-report" },
          { label: "Thesis Cover", href: "/thesis" },
        ]}
      />
    </div>
  );
}
