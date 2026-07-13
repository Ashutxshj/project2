"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Assignment", href: "/assignment-cover" },
  { label: "Certificate", href: "/certificate" },
  { label: "Resume", href: "/resume" },
  { label: "Internship", href: "/internship-report" },
  { label: "Synopsis", href: "/synopsis" },
  { label: "Thesis", href: "/thesis" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b-4 border-black bg-white relative z-50">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-[-0.08em] justify-self-start"
          style={{ fontFamily: "var(--font-inter), sans-serif" }}
        >
          <span className="text-[#111827]">Cover</span>
          <span className="text-[#14B8A6]">Le</span>
        </Link>
        <div className="col-start-3 justify-self-end min-[922px]:col-start-2 min-[922px]:justify-self-center">
          <nav className="relative flex items-center pr-2 min-[922px]:pr-0">
            <div className="hidden space-x-8 text-xs font-bold uppercase tracking-widest min-[922px]:flex items-center">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`hover:underline underline-offset-4 ${
                    pathname === item.href
                      ? "underline decoration-brand decoration-4"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="max-[921px]:block hidden border-2 border-black bg-white px-2.5 py-2 shadow-brutal"
              aria-label="Toggle navigation"
              aria-expanded={open}
              aria-controls="primary-nav-mobile"
            >
              <span className="block h-0.5 w-5 bg-black" />
              <span className="mt-1.5 block h-0.5 w-5 bg-black" />
              <span className="mt-1.5 block h-0.5 w-5 bg-black" />
            </button>
          </nav>
        </div>
      </div>
      {open && (
        <div
          id="primary-nav-mobile"
          className="min-[922px]:hidden border-t-2 border-black bg-white"
        >
          <nav className="mx-auto max-w-7xl px-5 py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-2 text-sm font-bold uppercase tracking-widest border-b border-gray-100 ${
                  pathname === item.href ? "text-[#14B8A6]" : "text-[#111827]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
