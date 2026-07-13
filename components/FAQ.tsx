"use client";

import { useState } from "react";

export interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ({
  items,
  title = "Frequently Asked Questions",
}: {
  items: FAQItem[];
  title?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-4xl px-5 py-16 sm:px-6">
      <h2 className="text-center text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>
      <div className="mt-10 space-y-3">
        {items.map((item, i) => (
          <div
            key={item.q}
            className="border-2 border-black bg-white shadow-brutal"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm font-black sm:text-base">{item.q}</span>
              <span className="text-xl font-black">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <div className="border-t-2 border-black bg-brand/10 px-5 py-4">
                <p className="text-sm font-medium leading-relaxed text-slate-700">
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
