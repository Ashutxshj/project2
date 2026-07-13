"use client";

/**
 * Client-side PDF export.
 * Renders one or more DOM nodes (each an A4-proportioned page component)
 * to canvases at print resolution and assembles them into a single PDF.
 * No watermarks are added.
 */
export async function exportElementsToPdf(
  elements: HTMLElement[],
  filename: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  if (!elements.length) return;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageW = orientation === "portrait" ? 210 : 297;
  const pageH = orientation === "portrait" ? 297 : 210;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    const canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: el.scrollWidth,
      windowHeight: el.scrollHeight,
    });
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (i > 0) pdf.addPage("a4", orientation);
    pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
  }

  pdf.save(filename);
}

export async function exportElementToPdf(
  element: HTMLElement,
  filename: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  return exportElementsToPdf([element], filename, orientation);
}
