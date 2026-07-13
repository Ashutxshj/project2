import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-grid-paper">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center sm:px-6">
        <span className="border-2 border-black bg-black px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand shadow-brutal">
          Error 404
        </span>
        <h1 className="mt-8 text-6xl font-black tracking-tight sm:text-8xl">
          4
          <span className="bg-brand border-2 border-black px-3 shadow-brutal inline-block">
            0
          </span>
          4
        </h1>
        <h2 className="mt-6 text-2xl font-black tracking-tight sm:text-3xl">
          Page Not Found
        </h2>
        <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved. Your documents, however, are still just seconds away.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-brand px-6 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
          >
            Back to Home
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 border-2 border-black bg-white px-6 py-3 text-sm font-black uppercase tracking-widest shadow-brutal transition-transform hover:-translate-y-0.5"
          >
            Get Support
          </Link>
        </div>
      </div>
    </div>
  );
}
