import { FieldState, makeField } from "./ui";

/* ------------------------------------------------------------------ */
/* Resume builder data model — shared by the editor and the templates  */
/* ------------------------------------------------------------------ */

export type ResumeTemplateId =
  | "professional-resume"
  | "technical-resume"
  | "modern-executive-resume";

export const RESUME_TEMPLATE_IDS: ResumeTemplateId[] = [
  "professional-resume",
  "technical-resume",
  "modern-executive-resume",
];

export interface LinkEntry {
  id: string;
  label: string;
  url: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string; // comma-separated skills
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  dates: string;
  achievements: string;
}

export interface ExperienceEntry {
  id: string;
  role: string;
  organization: string;
  dates: string;
  responsibilities: string; // multiline, one per line
}

export interface ProjectEntry {
  id: string;
  name: string;
  tech: string;
  link: string;
  description: string;
}

export interface BulletEntry {
  id: string;
  text: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ReferenceEntry {
  id: string;
  name: string;
  title: string;
  organization: string;
  contact: string;
}

export interface CustomSectionEntry {
  id: string;
  heading: string;
  content: string; // multiline
}

/** Sections that can be toggled off entirely from the form. */
export type SectionKey =
  | "links"
  | "summary"
  | "skills"
  | "education"
  | "experience"
  | "projects"
  | "achievements"
  | "languages"
  | "certifications"
  | "references"
  | "custom";

export interface ResumeData {
  photo: string | null;
  contact: {
    name: FieldState;
    title: FieldState;
    location: FieldState;
    email: FieldState;
    phone: FieldState;
  };
  links: LinkEntry[];
  summary: FieldState;
  skills: SkillCategory[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  achievements: BulletEntry[];
  coCurricular: BulletEntry[];
  languages: LanguageEntry[];
  certifications: CertificationEntry[];
  references: ReferenceEntry[];
  custom: CustomSectionEntry[];
  hiddenSections: Partial<Record<SectionKey, boolean>>;
}

export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function defaultResumeData(): ResumeData {
  return {
    photo: null,
    contact: {
      name: makeField("Full Name"),
      title: makeField("Job Title"),
      location: makeField("Location"),
      email: makeField("Email"),
      phone: makeField("Phone"),
    },
    links: [
      { id: uid(), label: "LinkedIn", url: "" },
      { id: uid(), label: "GitHub", url: "" },
    ],
    summary: makeField("Profile Summary"),
    skills: [{ id: uid(), category: "", items: "" }],
    education: [
      { id: uid(), institution: "", degree: "", dates: "", achievements: "" },
    ],
    experience: [
      { id: uid(), role: "", organization: "", dates: "", responsibilities: "" },
    ],
    projects: [{ id: uid(), name: "", tech: "", link: "", description: "" }],
    achievements: [],
    coCurricular: [],
    languages: [],
    certifications: [],
    references: [],
    custom: [],
    hiddenSections: {},
  };
}

/* ------------------------------------------------------------------ */
/* Visibility helpers — a section is skipped in the preview when it is */
/* hidden from the form or has no meaningful content.                  */
/* ------------------------------------------------------------------ */

export const hasText = (s: string) => s.trim().length > 0;

export function visibleLinks(d: ResumeData): LinkEntry[] {
  if (d.hiddenSections.links) return [];
  return d.links.filter((l) => hasText(l.label) || hasText(l.url));
}

export function visibleSkills(d: ResumeData): SkillCategory[] {
  if (d.hiddenSections.skills) return [];
  return d.skills.filter((s) => hasText(s.category) || hasText(s.items));
}

export function visibleEducation(d: ResumeData): EducationEntry[] {
  if (d.hiddenSections.education) return [];
  return d.education.filter(
    (e) => hasText(e.institution) || hasText(e.degree) || hasText(e.dates)
  );
}

export function visibleExperience(d: ResumeData): ExperienceEntry[] {
  if (d.hiddenSections.experience) return [];
  return d.experience.filter(
    (e) => hasText(e.role) || hasText(e.organization) || hasText(e.responsibilities)
  );
}

export function visibleProjects(d: ResumeData): ProjectEntry[] {
  if (d.hiddenSections.projects) return [];
  return d.projects.filter(
    (p) => hasText(p.name) || hasText(p.tech) || hasText(p.description)
  );
}

export function visibleAchievements(d: ResumeData): BulletEntry[] {
  if (d.hiddenSections.achievements) return [];
  return d.achievements.filter((a) => hasText(a.text));
}

export function visibleCoCurricular(d: ResumeData): BulletEntry[] {
  if (d.hiddenSections.achievements) return [];
  return d.coCurricular.filter((a) => hasText(a.text));
}

export function visibleLanguages(d: ResumeData): LanguageEntry[] {
  if (d.hiddenSections.languages) return [];
  return d.languages.filter((l) => hasText(l.language));
}

export function visibleCertifications(d: ResumeData): CertificationEntry[] {
  if (d.hiddenSections.certifications) return [];
  return d.certifications.filter((c) => hasText(c.name));
}

export function visibleReferences(d: ResumeData): ReferenceEntry[] {
  if (d.hiddenSections.references) return [];
  return d.references.filter((r) => hasText(r.name));
}

export function visibleCustom(d: ResumeData): CustomSectionEntry[] {
  if (d.hiddenSections.custom) return [];
  return d.custom.filter((c) => hasText(c.heading) || hasText(c.content));
}

export function visibleSummary(d: ResumeData): string | null {
  if (d.hiddenSections.summary || d.summary.hidden) return null;
  return hasText(d.summary.value) ? d.summary.value : null;
}

/** Contact line pieces respecting per-field hide toggles. */
export function contactPieces(d: ResumeData): string[] {
  const c = d.contact;
  return [c.location, c.email, c.phone]
    .filter((f) => !f.hidden && hasText(f.value))
    .map((f) => f.value.trim());
}

export function displayName(d: ResumeData): string {
  return !d.contact.name.hidden && hasText(d.contact.name.value)
    ? d.contact.name.value.trim()
    : "YOUR NAME";
}

export function displayTitle(d: ResumeData): string | null {
  return !d.contact.title.hidden && hasText(d.contact.title.value)
    ? d.contact.title.value.trim()
    : null;
}

export function splitLines(s: string): string[] {
  return s
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function splitComma(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}
