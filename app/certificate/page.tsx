import type { Metadata } from "next";
import CertificateGenerator from "@/components/generator/CertificateGenerator";
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

export const metadata: Metadata = {
  title: "Free Online Certificate Generator - No Watermarks | CoverLe",
  description:
    "Create professional certificates instantly. Pick a template, add the recipient's details and download a high-resolution, print-ready PDF — 100% free, no watermarks.",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is an online certificate generator?",
    a: "An online certificate generator is a web-based tool that allows you to easily design and create professional certificates for various achievements, awards, or completion of courses without needing graphic design skills.",
  },
  {
    q: "How do I make a custom certificate?",
    a: "Using CoverLe, making a custom certificate is simple. Select a certificate template, enter the recipient's name, add a subtitle or reason for the award, fill in the date and signature, and then click 'Generate PDF' to download your custom certificate.",
  },
  {
    q: "Is CoverLe's certificate maker free?",
    a: "Yes! CoverLe provides a completely free certificate maker. You can generate and download high-quality PDFs without any watermarks or hidden costs.",
  },
  {
    q: "Can I use these templates for professional awards?",
    a: "Absolutely. Our certificate templates are designed with professional aesthetics, making them suitable for corporate awards, academic achievements, employee recognition, and more.",
  },
  {
    q: "In what format do I receive the certificate?",
    a: "Your custom certificate is generated instantly as a high-resolution, print-ready PDF file that you can easily download and print or share digitally.",
  },
  {
    q: "Do I need design skills to use this tool?",
    a: "No design skills are required. The layout, typography, and visual elements are pre-configured in our templates. You just need to type in the details.",
  },
  {
    q: "Are the generated certificates printable?",
    a: "Yes, all our PDFs are generated in high resolution and are optimized for standard printing formats. You can print them on standard paper or specialized certificate paper.",
  },
  {
    q: "Does the tool work on mobile devices?",
    a: "Yes, CoverLe is fully responsive. You can build, preview, and download your certificates directly from your smartphone or tablet.",
  },
];

export default function CertificatePage() {
  return (
    <div>
      {/* Generator hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center sm:px-6 lg:px-8">
          <span className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
            100% Free · No Watermarks
          </span>
          <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Free Online{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Certificate Generator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Create professional certificates instantly.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <CertificateGenerator />
      </section>

      {/* Landing content */}
      <LandingIntro
        titlePrefix="Free"
        titleHighlight="Certificate Generator"
        subtitle="Create professional, customized certificates for academic achievements, corporate awards, and special recognitions instantly."
      />

      <ProseSection
        title="What Is an Online Certificate Maker?"
        paragraphs={[
          "An online certificate maker is a powerful tool designed to help you create stunning, professional certificates without the need for expensive design software or specialized skills. Whether you are an educator rewarding top students, a manager recognizing employee excellence, or an event organizer handing out participation certificates, a reliable generator streamlines the entire process.",
          "With a dedicated certificate generator, you can ensure consistency, uphold a professional standard, and save valuable time. Instead of wrestling with alignment issues or typography choices in a word processor, you simply select a high-quality certificate template, input the necessary details, and immediately download a print-ready document.",
        ]}
      />

      <StepsSection
        title="How to Create a Custom Certificate"
        intro="Designing a custom certificate is fast and completely frictionless with CoverLe."
        steps={[
          {
            name: "Select a Layout",
            text: "Choose from our curated selection of professional templates suited for various occasions.",
          },
          {
            name: "Enter Recipient Name",
            text: "Type in the name of the individual or team receiving the award.",
          },
          {
            name: "Add a Custom Message",
            text: "Use our smart presets or write a custom subtitle detailing the achievement.",
          },
          {
            name: "Sign-Off Details",
            text: "Fill in the exact issue date and the name of the authorizing signatory.",
          },
          {
            name: "Generate & Download",
            text: "Preview the design live, then click generate to get your high-resolution PDF.",
          },
        ]}
      />

      <ChecklistSection
        title="Why Use CoverLe's Generator?"
        intro="Our free certificate maker is built to deliver agency-quality results directly in your browser."
        items={[
          {
            name: "100% Free & No Watermarks:",
            text: "Download clean, branding-free PDFs at absolutely no cost.",
          },
          {
            name: "Real-Time Canvas Preview:",
            text: "See every keystroke reflected instantly on your certificate design.",
          },
          {
            name: "Smart Text Presets:",
            text: "Avoid writer's block with our pre-written professional achievement descriptions.",
          },
          {
            name: "Print-Ready PDF Export:",
            text: "Guaranteed crisp text and graphics whether you share digitally or print physically.",
          },
          {
            name: "Local History Sync:",
            text: "Securely resume your previous certificate sessions directly from your browser.",
          },
        ]}
      />

      <DetailsGridSection
        title="What Information Goes on a Certificate?"
        intro="A well-crafted certificate requires key elements to be considered official and meaningful."
        items={[
          {
            name: "Recipient Name",
            text: "The full name of the individual or group receiving the honor.",
          },
          {
            name: "Achievement",
            text: "A short description or subtitle explaining the reason for the award.",
          },
          {
            name: "Issue Date",
            text: "The exact day, month, and year the certificate was granted.",
          },
          {
            name: "Signatory Name",
            text: "The official name or title of the person authorizing the award.",
          },
        ]}
      />

      <CoreFeatures
        features={[
          "No Watermarks",
          "Live Preview",
          "PDF Export",
          "Text Presets",
          "Fast Generation",
        ]}
      />

      <div className="border-t-4 border-black bg-grid-paper">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <RelatedTools
        intro="Explore our suite of free professional document generators:"
        links={[
          { label: "Assignment Cover", href: "/assignment-cover" },
          { label: "Resume Builder", href: "/resume" },
          { label: "Internship Report", href: "/internship-report" },
          { label: "Thesis Cover", href: "/thesis" },
        ]}
      />
    </div>
  );
}
