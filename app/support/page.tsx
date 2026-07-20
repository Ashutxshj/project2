import type { Metadata } from "next";

import SupportTickets from "@/components/SupportTickets";

export const metadata: Metadata = {
  title: "Support Center | Draftly",
  description:
    "Need help with Draftly? Create a support ticket for bug reports, PDF generation issues, template problems, feature requests and more.",
};

export default function SupportPage() {
  return (
    <div>
      <div className="bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 pt-14 text-center sm:px-6">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Support{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Center
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Need help? Create a support ticket and we&apos;ll get back to you.
          </p>
        </div>
      </div>

      <SupportTickets />
    </div>
  );
}
