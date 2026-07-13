import Image from "next/image";
import Link from "next/link";
import FAQ, { type FAQItem } from "@/components/FAQ";

const TOOLS = [
  {
    title: "Assignment Covers",
    description: "Create assignment cover pages instantly",
    href: "/assignment-cover",
    image: "/assigment.png",
  },
  {
    title: "Certificates",
    description:
      "Create all types of certificates with different layouts and templates",
    href: "/certificate",
    image: "/certificate.png",
  },
  {
    title: "Resume Builder",
    description:
      "Create your resume with professional layouts, Capability of having ATS score > 80",
    href: "/resume",
    image: "/resume.png",
  },
  {
    title: "Internship Reports",
    description: "Create professional internship reports in seconds",
    href: "/internship-report",
    image: "/internship.png",
  },
  {
    title: "Synopsis",
    description: "Create synopsis cover pages within seconds",
    href: "/synopsis",
    image: "/synopsis.png",
  },
  {
    title: "Thesis Formatting",
    description:
      "Create academic thesis pages includes Title page, Abstract page, declaration page etc.",
    href: "/thesis",
    image: "/thesis.png",
  },
  {
    title: "ATS Checker",
    description:
      "Check your resume ATS compatibility score and get AI-powered feedback instantly",
    href: "/ats-checker",
    image: "/cv-checker.png",
  },
];

const VALUE_PROPS = [
  {
    title: "Generate in Seconds",
    description:
      "No more fighting with margins and spacing. Fill a short form and your document is structured instantly.",
    gif: "/rocket.gif",
  },
  {
    title: "Professional Templates",
    description:
      "A library of clean, minimalist designs made specifically for academic submissions.",
    gif: "/docs.gif",
  },
  {
    title: "Academic Ready",
    description:
      "Layouts built around university standards for assignments, reports, synopsis and thesis work.",
    gif: "/graduation-cap.gif",
  },
  {
    title: "Instant PDF Export",
    description:
      "Download high-resolution, print-ready PDFs. No watermarks, no sign-up, no fees.",
    gif: "/download.gif",
  },
];

const SUPPORTED_DOCS = [
  "Assignment Covers",
  "Internship Reports",
  "Resume Builder",
  "Certificates",
  "Synopsis Documents",
  "Thesis Formatting",
  "ATS Checker",
];

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is CoverLe?",
    a: "CoverLe is a free online tool that automates the formatting of academic documents like assignment covers, internship reports, resumes, synopsis pages and thesis sections — so you can focus on your content instead of wrestling with layout.",
  },
  {
    q: "Can I create thesis title pages?",
    a: "Yes. CoverLe includes a thesis formatting tool that generates university-compliant title pages, abstract pages, declaration pages and more, giving your final-year project a professional finish.",
  },
  {
    q: "Can I generate internship reports?",
    a: "Absolutely. The internship report generator uses structured templates that neatly incorporate your university and company details into a clean, submission-ready layout.",
  },
  {
    q: "Can I build resumes?",
    a: "Yes. The resume builder is designed for students — it highlights your education and projects using clean academic styling, and templates are ATS-friendly.",
  },
  {
    q: "Do I need Microsoft Word?",
    a: "No. CoverLe runs entirely in your browser with a real-time preview, and you can export your finished document directly as a PDF — no Word or other software required.",
  },
  {
    q: "Do I need to login or create an account?",
    a: "No account is needed. Every tool is accessible instantly and completely free — no email, no registration, no sign-up walls.",
  },
  {
    q: "Will I need to pay to download my PDF?",
    a: "No. Downloading your generated PDF is completely free. There are no paywalls, hidden charges or premium locks on downloads.",
  },
  {
    q: "Is there any watermark on the PDF?",
    a: "No. Exported PDFs are clean and professional with zero watermarks or branding — ready to print or submit as-is.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <div className="text-center lg:text-left">
            <span className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
              100% Free · No Watermarks
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Generate Resume,{" "}
              <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
                Academic Docs
              </span>{" "}
              In Seconds
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base font-medium text-slate-700 sm:text-lg lg:mx-0">
              Create professional, structured academic documents with live
              preview and instant PDF export.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                href="/assignment-cover"
                className="inline-flex items-center gap-2 border-2 border-black bg-brand px-6 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
              >
                Get Started
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/ats-checker"
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
              >
                Check ATS Score
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="hidden border-2 border-black bg-white p-2 shadow-brutal-lg sm:block">
              <Image
                src="/Image.webp"
                alt="Preview of academic documents generated with CoverLe"
                width={720}
                height={540}
                priority
                className="h-auto w-full"
              />
            </div>
            <div className="border-2 border-black bg-white p-2 shadow-brutal-lg sm:hidden">
              <Image
                src="/mobile_image.png"
                alt="Preview of academic documents generated with CoverLe"
                width={480}
                height={480}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
          Every Tool You Need for{" "}
          <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
            Campus Docs
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm font-medium text-slate-700 sm:text-base">
          Pick a document, fill the form, download the PDF. That&apos;s it.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col border-2 border-black bg-white shadow-brutal transition-transform hover:-translate-y-1"
            >
              <div className="border-b-2 border-black bg-brand/10 p-4">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  width={480}
                  height={320}
                  className="h-40 w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-black">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm font-medium leading-relaxed text-slate-700">
                  {tool.description}
                </p>
                <span className="mt-4 inline-flex w-fit items-center gap-2 border-2 border-black bg-brand px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-brutal-sm group-hover:bg-black group-hover:text-brand">
                  Generate <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why students choose CoverLe */}
      <section className="border-y-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
            Why Students Choose CoverLe?
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="border-2 border-black bg-white p-6 shadow-brutal"
              >
                <div className="flex h-14 w-14 items-center justify-center border-2 border-black bg-brand/20">
                  <Image
                    src={prop.gif}
                    alt=""
                    width={40}
                    height={40}
                    unoptimized
                    className="h-10 w-10"
                  />
                </div>
                <h3 className="mt-4 text-base font-black uppercase tracking-widest">
                  {prop.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-700">
                  {prop.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is CoverLe */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          What is{" "}
          <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
            CoverLe?
          </span>
        </h2>
        <div className="mt-5 space-y-4">
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            CoverLe is a specialized document generator built for students who
            are tired of fighting with word processors. Instead of manually
            adjusting margins, fonts and spacing for every submission, you
            simply fill in your details and let CoverLe handle the formatting.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Everything works through a simple form-based interface. As you
            type, a live preview renders your document in an academic-ready
            layout that follows the conventions universities expect.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Formatting mistakes cost marks. CoverLe eliminates them across
            assignment covers, internship reports, resumes, certificates,
            synopsis documents and thesis pages — turning twenty minutes of
            manual layout work into roughly thirty seconds.
          </p>
          <p className="text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            Best of all, every PDF you export is completely free and carries no
            watermark. CoverLe is a modern resource made for students, by
            people who understand student deadlines.
          </p>
        </div>
        <div className="mt-8">
          <h3 className="text-xs font-black uppercase tracking-widest">
            Supported Documents
          </h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {SUPPORTED_DOCS.map((doc) => (
              <span
                key={doc}
                className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-brutal"
              >
                {doc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <div className="border-t-4 border-black bg-grid-paper">
        <FAQ items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
