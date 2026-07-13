import { Suspense } from "react";
import type { Metadata } from "next";
import CustomAssignmentGenerator from "@/components/generator/CustomAssignmentGenerator";

export const metadata: Metadata = {
  title: "Custom Assignment Cover Page Generator — Free, No Watermark | Coverle",
  description:
    "Create a print-ready A4 assignment cover page from 11 custom templates. Live preview, college logo upload, and instant PDF download — free, no watermark.",
};

export default function CustomAssignmentGeneratorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-widest shadow-brutal">
            Loading generator…
          </p>
        </div>
      }
    >
      <CustomAssignmentGenerator />
    </Suspense>
  );
}
