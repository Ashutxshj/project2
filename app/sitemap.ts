import type { MetadataRoute } from "next";
import { RESUME_TEMPLATES, UNIVERSITIES } from "@/lib/data";

const BASE = "https://coverle.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/assignment-cover",
    "/assignment-cover/custom/generator",
    "/certificate",
    "/resume",
    "/internship-report",
    "/synopsis",
    "/thesis",
    "/ats-checker",
    "/terms",
    "/privacy",
    "/support",
    "/contact",
  ];

  const collegePaths = UNIVERSITIES.flatMap((u) => [
    `/assignment-cover/${u.slug}/select-template`,
    `/assignment-cover/${u.slug}/generator`,
  ]);

  const resumePaths = RESUME_TEMPLATES.map((t) => `/resume/${t.id}`);

  return [...staticPaths, ...collegePaths, ...resumePaths].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
