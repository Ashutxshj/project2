import Link from "next/link";

const TOOL_LINKS = [
  { label: "Assignment Cover", href: "/assignment-cover" },
  { label: "Certificate Generator", href: "/certificate" },
  { label: "Resume Builder", href: "/resume" },
  { label: "Internship Report", href: "/internship-report" },
  { label: "Thesis Cover", href: "/thesis" },
  { label: "Synopsis", href: "/synopsis" },
];

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Support", href: "/support" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-white mt-16">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-[-0.08em]"
            >
              <span className="text-[#111827]">Cover</span>
              <span className="text-[#14B8A6]">Le</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm font-medium text-slate-600">
              Generate professional academic documents in seconds. Free, fast
              and watermark-free.
            </p>
            <a
              href="https://www.instagram.com/coverle.in"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CoverLe on Instagram"
              className="mt-4 inline-flex h-10 w-10 items-center justify-center border-2 border-black bg-white shadow-brutal hover:bg-brand transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest">
                Tools
              </h3>
              <ul className="mt-3 space-y-2">
                {TOOL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest">
                Company
              </h3>
              <ul className="mt-3 space-y-2">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm font-medium text-slate-700 hover:underline underline-offset-4"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t-2 border-black pt-6 flex flex-col items-center gap-1 text-center text-xs font-bold uppercase tracking-widest text-slate-600 sm:flex-row sm:justify-center sm:gap-2">
          <span>© 2026 CoverLe. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <span>Developed by Anshul Rajkumar</span>
        </div>
      </div>
    </footer>
  );
}
