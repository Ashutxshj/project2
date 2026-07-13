import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Support | CoverLe",
  description:
    "Get assistance with CoverLe. Raise a support ticket through our Support Center for efficient tracking and faster response times.",
};

const BENEFITS = [
  {
    name: "Efficient Issue Tracking",
    text: "Every ticket gets a reference so nothing falls through the cracks.",
  },
  {
    name: "Faster Response Times",
    text: "Structured tickets let us route your issue to the right place immediately.",
  },
  {
    name: "Status Updates",
    text: "Follow the progress of your request from open to resolved.",
  },
  {
    name: "Organized Requests",
    text: "All your questions and reports stay in one manageable place.",
  },
];

export default function ContactPage() {
  return (
    <div>
      <div className="border-b-4 border-black bg-brand/20 bg-grid-paper">
        <div className="mx-auto max-w-4xl px-5 py-14 text-center sm:px-6">
          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Contact{" "}
            <span className="bg-brand border-2 border-black px-2 shadow-brutal inline-block">
              Support
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium text-slate-700 sm:text-base">
            Need assistance with CoverLe?
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
        <div className="border-2 border-black bg-white p-6 text-center shadow-brutal-lg sm:p-10">
          <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
            For any questions, bug reports or feature requests, please create a
            support ticket through our Support Center. Tickets help us help you
            faster.
          </p>
          <Link
            href="/support"
            className="mt-6 inline-flex items-center gap-2 border-2 border-black bg-brand px-6 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
          >
            Raise A Ticket
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10">
          <h2 className="text-center text-xl font-black tracking-tight sm:text-2xl">
            Why use the ticketing system?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div
                key={b.name}
                className="flex gap-3 border-2 border-black bg-white p-5 shadow-brutal"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-black bg-brand text-xs font-black">
                  ✓
                </span>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest">
                    {b.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
                    {b.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-2 border-black bg-brand/20 p-6 text-center shadow-brutal">
          <p className="text-xs font-black uppercase tracking-widest">
            Expected Response Time
          </p>
          <p className="mt-2 text-2xl font-black">24–72 hours</p>
        </div>
      </div>
    </div>
  );
}
