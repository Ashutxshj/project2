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
import ThesisGenerator from "@/components/generator/ThesisGenerator";

export const metadata: Metadata = {
  title: "Free Online Thesis Generator - Draftly",
  description:
    "Create professional, university-standard multi-page thesis documents instantly — cover page, certificates, declaration, plagiarism report and title page. 100% free, no watermarks.",
};

const FAQ_ITEMS: FAQItem[] = [
  {
    q: "What is a thesis cover page?",
    a: "A thesis cover page is the very first page of your dissertation or thesis document. It includes crucial information such as your dissertation title, academic session, university details, supervisor's name, and student information.",
  },
  {
    q: "How do I make a thesis title page?",
    a: "With Draftly, you can easily generate a thesis title page by filling out a simple form. Enter your student details, dissertation title, university information, and supervisor's details, then download the perfectly formatted PDF.",
  },
  {
    q: "Is the thesis cover page generator free?",
    a: "Yes! Draftly's thesis cover page generator is completely free to use. There are no watermarks or hidden charges.",
  },
  {
    q: "Can I include my university logo on the cover page?",
    a: "Absolutely. You can upload your university's official logo directly into the generator, and it will be perfectly centered on your final PDF.",
  },
  {
    q: "Does this generator support multi-page thesis documents?",
    a: "Yes, our tool generates a multi-page thesis introductory document, ensuring all necessary preliminary pages (like certificates and declarations) are consistently formatted.",
  },
  {
    q: "What if my university does not require a specific field?",
    a: "Draftly offers full field customization. You can easily toggle the visibility of any field (like 'Similarity Index' or 'Campus Name') so it doesn't appear on the final generated PDF.",
  },
  {
    q: "Are the PDFs print-ready?",
    a: "Yes, the generated PDFs use standard A4 dimensions with ultra-crisp resolution, ensuring they are completely print-ready for academic binding.",
  },
  {
    q: "Can I save my progress?",
    a: "Yes, your data is automatically saved locally in your browser. You can also explicitly save your academic profile for use across other document generators on Draftly.",
  },
];

export default function ThesisPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b-4 border-black bg-grid-paper">
        <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-6 lg:px-8">
          <span className="inline-block border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-widest shadow-brutal-sm">
            100% Free · Multi-Page Export · No Watermarks
          </span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl">
            Free Online{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Thesis Generator
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium text-slate-700 sm:text-lg">
            Create professional multi-page thesis documents instantly — cover
            page, certificates, declaration, plagiarism report and title page.
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <ThesisGenerator />
      </section>

      {/* Landing content */}
      <LandingIntro
        titlePrefix="Free Thesis"
        titleHighlight="Cover Generator"
        subtitle="Create professional, university-standard multi-page preliminary documents for your dissertation or thesis in seconds."
      />

      <ProseSection
        title="What Is a Thesis Cover Page?"
        paragraphs={[
          "A thesis cover page (or dissertation title page) is the very first page of your final academic research document. It provides the examination board with immediate context regarding the study's title, the author's credentials, the supervising faculty, and the granting institution.",
          "Because it is the first impression of years of research, its formatting matters. Draftly ensures your preliminary document set is authoritative, flawlessly aligned, and perfectly adheres to standard academic publishing requirements — from the cover page down to the certificates, declaration and plagiarism report.",
        ]}
      />

      <StepsSection
        title="How to Create a Thesis Cover Page"
        intro="Generating a complete, submission-ready thesis document set takes less than a minute:"
        steps={[
          {
            name: "Enter Student Details",
            text: "Input your full name, enrollment number, and degree specialization.",
          },
          {
            name: "Add Dissertation Info",
            text: "Type your exact thesis title and the academic session/year.",
          },
          {
            name: "University Information",
            text: "Upload your college logo and enter the university's official name and location.",
          },
          {
            name: "Add Supervisor Details",
            text: "Provide your research guide's name, designation, and department.",
          },
          {
            name: "Generate Multi-Page PDF",
            text: "Review the live preview and download your complete, print-ready document.",
          },
        ]}
      />

      <ChecklistSection
        title="Why Use Draftly's Generator?"
        items={[
          {
            name: "100% Free:",
            text: "Generate high-quality PDFs without any subscriptions or paywalls.",
          },
          {
            name: "Multi-Page Support:",
            text: "Automatically generates perfectly styled certificates and declaration pages alongside your cover page.",
          },
          {
            name: "Field Customization:",
            text: "Easily hide fields (like Similarity Index) that your specific university doesn't require.",
          },
          {
            name: "Ultra-Crisp Export:",
            text: "Uses high-DPI canvas rendering to ensure your text and logos look flawless in print.",
          },
        ]}
      />

      <DetailsGridSection
        title="Essential Details for a Thesis Cover"
        intro="Make sure your final document includes each of these elements — most universities require all of them for acceptance."
        items={[
          {
            name: "Dissertation Title",
            text: "The precise, approved title of your comprehensive research study.",
          },
          {
            name: "Degree & Specialization",
            text: "Your exact degree program (e.g., Ph.D., Master of Science) and area of specialization.",
          },
          {
            name: "Student Information",
            text: "Your full legal name and university registration/enrollment number.",
          },
          {
            name: "University Details",
            text: "The official name, logo, and departmental affiliation of your institution.",
          },
          {
            name: "Supervisor Details",
            text: "The name and formal academic designation of your research guide.",
          },
          {
            name: "Submission Date",
            text: "The specific month and year, or academic session, of your final submission.",
          },
        ]}
      />

      <CoreFeatures
        features={[
          "Multi-Page Export",
          "Logo Upload",
          "Live Preview",
          "Print-Ready PDF",
          "No Watermarks",
        ]}
      />

      <div className="border-t-4 border-black bg-grid-paper">
        <FAQ items={FAQ_ITEMS} />
      </div>

      <RelatedTools
        intro="Need other academic documents? Explore more free Draftly tools:"
        links={[
          { label: "Assignment Cover", href: "/assignment-cover" },
          { label: "Certificate Generator", href: "/certificate" },
          { label: "Resume Builder", href: "/resume" },
          { label: "Internship Report", href: "/internship-report" },
        ]}
      />
    </div>
  );
}
