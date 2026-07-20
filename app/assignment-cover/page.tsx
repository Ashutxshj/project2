import type { Metadata } from "next";
import Link from "next/link";
import AssignmentTemplateGrid from "@/components/AssignmentTemplateGrid";
import FAQ from "@/components/FAQ";
import {
  ChecklistSection,
  CoreFeatures,
  DetailsGridSection,
  LandingIntro,
  ProseSection,
  RelatedTools,
  StepsSection,
} from "@/components/LandingContent";
import { UNIVERSITIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Assignment Cover Page Generator - Free Templates | Draftly",
  description:
    "Build your assignment cover page online for free. Pick a college or template, fill in your details, preview live and download a print-ready PDF in seconds.",
};

const FAQ_ITEMS = [
  {
    q: "What is an assignment cover page?",
    a: "An assignment cover page is the introductory page of an academic document that displays essential information such as the student's name, roll number, course details, and submission date. It helps evaluators easily identify the student and the subject of the assignment.",
  },
  {
    q: "How do I make an assignment cover page?",
    a: "You can easily make an assignment cover page using Draftly's assignment cover generator. Simply select a template, fill in your details like your name and course, preview the document, and download it as a high-quality PDF.",
  },
  {
    q: "Is Draftly free?",
    a: "Yes, Draftly is a completely free assignment cover generator. All templates and PDF downloads are available at no cost to students.",
  },
  {
    q: "Can I use it for university assignments?",
    a: "Absolutely! Our assignment cover templates are designed to meet standard college and university requirements, making them perfect for any higher education assignment format.",
  },
  {
    q: "Can I download the cover page as a PDF?",
    a: "Yes, Draftly provides instant PDF generation. Once you fill in your details, you can download a print-ready PDF immediately.",
  },
  {
    q: "Which information should be included?",
    a: "A standard assignment title page should include the student's name, roll number, subject name, course name, faculty name, semester, and the date of submission.",
  },
  {
    q: "Are the templates customizable?",
    a: "While the core layout is standardized to maintain a professional assignment format, you can customize all the text fields to match your specific assignment requirements.",
  },
  {
    q: "Can I use it on my mobile device?",
    a: "Yes, Draftly is highly optimized for mobile devices. You can generate and download your assignment cover directly from your smartphone or tablet.",
  },
];

export default function AssignmentCoverPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            Build Your{" "}
            <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
              Assignment Cover
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-bold uppercase tracking-widest text-slate-700">
            Want auto-formatted university branding? Click Select College
          </p>
        </div>
      </section>

      {/* Select College */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Select{" "}
          <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
            College
          </span>
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSITIES.map((u) => (
            <Link
              key={u.slug}
              href={`/assignment-cover/${u.slug}/select-template`}
              className="group border-2 border-black bg-white p-4 shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand/20 hover:shadow-none"
            >
              <p className="text-lg font-black tracking-tight">{u.shortName}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {u.fullName}
              </p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest underline underline-offset-4 decoration-2 group-hover:decoration-brand">
                Choose Template →
              </p>
            </Link>
          ))}
          <Link
            href="/assignment-cover/custom/generator"
            className="group border-2 border-black bg-black p-4 text-white shadow-brutal transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <p className="text-lg font-black tracking-tight text-brand">
              Custom Template
            </p>
            <p className="mt-1 text-sm font-medium text-slate-300">
              Skip college branding and pick a template to customize freely.
            </p>
            <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-brand underline underline-offset-4 decoration-2">
              Open Generator →
            </p>
          </Link>
        </div>
      </section>

      {/* Templates grid */}
      <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Choose a{" "}
          <span className="inline-block border-2 border-black bg-brand px-2 shadow-brutal">
            Template
          </span>
        </h2>
        <AssignmentTemplateGrid
          generatorBasePath="/assignment-cover/custom/generator"
          className="mt-6"
        />
      </section>

      {/* Long-form landing content */}
      <LandingIntro
        titlePrefix="Free Assignment Cover"
        titleHighlight="Generator"
        subtitle="Create professional assignment front pages for your college and university submissions in seconds."
      />

      <ProseSection
        title="What Is an Assignment Cover Page?"
        paragraphs={[
          "An assignment cover page is the very first page of your academic submission. It provides essential details like your name, course information, and submission date, giving evaluators everything they need to identify your work at a glance.",
          "A well-formatted cover sets a professional tone, showing that you take your academic responsibilities seriously. With Draftly, you can generate a clean, correctly structured assignment front page in seconds - no design software required.",
        ]}
      />

      <StepsSection
        title="How to Create an Assignment Cover Page"
        intro="Creating a professional assignment front page with Draftly takes less than a minute. Just follow these five simple steps:"
        steps={[
          {
            name: "Choose a Template",
            text: "Browse our collection and select a layout that fits your university guidelines.",
          },
          {
            name: "Enter Your Details",
            text: "Fill in the required fields including your name, roll number, course name, and subject.",
          },
          {
            name: "Add Faculty Info",
            text: "Input your professor or instructor's name so the assignment is routed properly.",
          },
          {
            name: "Review Live Preview",
            text: "Check the generated page in real-time to make sure every detail is accurate.",
          },
          {
            name: "Download as PDF",
            text: "Obtain a high-quality PDF that is ready for submission - print or upload it directly.",
          },
        ]}
      />

      <ChecklistSection
        title="Why Use Draftly?"
        intro="Thousands of students trust Draftly for their academic documents. Here's why:"
        items={[
          {
            name: "100% Free:",
            text: "Access premium assignment cover templates without hidden fees.",
          },
          {
            name: "No Design Skills Needed:",
            text: "Just fill in the blanks, and we handle the document layout.",
          },
          {
            name: "Professional Templates:",
            text: "Designs tailored specifically for university and college submissions.",
          },
          {
            name: "Instant PDF Generation:",
            text: "Generate a print-ready or digital-ready PDF format in seconds.",
          },
          {
            name: "Student-Friendly Interface:",
            text: "Built specifically for students, offering a straightforward, distraction-free environment.",
          },
        ]}
      />

      <DetailsGridSection
        title="Assignment Cover Page Format Details"
        intro="A complete assignment front page should clearly present the following fields:"
        items={[
          {
            name: "Student Name",
            text: "Your full legal name or the name registered with your institution.",
          },
          {
            name: "Roll Number",
            text: "The unique identifier provided by your college or university.",
          },
          {
            name: "Subject Name",
            text: "The specific subject or module the assignment belongs to.",
          },
          {
            name: "Course Name",
            text: "The overarching degree or program (e.g., B.Tech, BBA, BSc).",
          },
          {
            name: "Faculty Name",
            text: "The name of the professor or instructor evaluating the assignment.",
          },
          {
            name: "Semester & Date",
            text: "Your current academic term and the exact submission date.",
          },
        ]}
      />

      <CoreFeatures
        features={[
          "Multiple Templates",
          "Live Preview",
          "PDF Export",
          "Mobile Friendly",
          "Fast Generation",
        ]}
      />

      <RelatedTools
        intro="Beyond assignment covers, Draftly offers tools to help you throughout your academic and professional journey:"
        links={[
          { label: "Resume Builder", href: "/resume" },
          { label: "Internship Report", href: "/internship-report" },
          { label: "Thesis Cover", href: "/thesis" },
          { label: "Synopsis Cover", href: "/synopsis" },
        ]}
      />

      <FAQ items={FAQ_ITEMS} />
    </div>
  );
}
