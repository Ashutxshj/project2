export interface University {
  slug: string;
  shortName: string;
  fullName: string;
  tagline: string;
}

export const UNIVERSITIES: University[] = [
  {
    slug: "nfsu",
    shortName: "NFSU",
    fullName: "National Forensic Sciences University",
    tagline: "An Institution of National Importance",
  },
  {
    slug: "iitd",
    shortName: "IIT Delhi",
    fullName: "Indian Institute of Technology Delhi",
    tagline: "Hauz Khas, New Delhi",
  },
  {
    slug: "iitb",
    shortName: "IIT Bombay",
    fullName: "Indian Institute of Technology Bombay",
    tagline: "Powai, Mumbai",
  },
  {
    slug: "iitm",
    shortName: "IIT Madras",
    fullName: "Indian Institute of Technology Madras",
    tagline: "Chennai, Tamil Nadu",
  },
  {
    slug: "vit",
    shortName: "VIT",
    fullName: "Vellore Institute of Technology",
    tagline: "Vellore, Tamil Nadu",
  },
  {
    slug: "srm",
    shortName: "SRM",
    fullName: "SRM Institute of Science and Technology",
    tagline: "Kattankulathur, Chennai",
  },
  {
    slug: "du",
    shortName: "Delhi University",
    fullName: "University of Delhi",
    tagline: "New Delhi",
  },
  {
    slug: "au",
    shortName: "Anna University",
    fullName: "Anna University",
    tagline: "Chennai, Tamil Nadu",
  },
  {
    slug: "cu",
    shortName: "Chandigarh University",
    fullName: "Chandigarh University",
    tagline: "Mohali, Punjab",
  },
];

export function getUniversity(slug: string): University | undefined {
  return UNIVERSITIES.find((u) => u.slug === slug);
}

export interface AssignmentTemplateMeta {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export const ASSIGNMENT_TEMPLATES: AssignmentTemplateMeta[] = [
  {
    id: "elegant",
    name: "Elegant Design",
    description: "A sophisticated and elegant cover page design.",
    preview: "/templates/template1-preview.png",
  },
  {
    id: "classic",
    name: "Classic Academic",
    description: "Traditional academic cover page layout.",
    preview: "/templates/template2-preview.png",
  },
  {
    id: "modern",
    name: "Modern Academic",
    description: "A clean and modern layout with single borders.",
    preview: "/templates/template3-preview.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A distraction-free, elegant minimal design.",
    preview: "/templates/template4-preview.png",
  },
  {
    id: "scientific",
    name: "Scientific Paper",
    description: "Designed for research and scientific assignments.",
    preview: "/templates/template5-preview.png",
  },
  {
    id: "creative",
    name: "Creative Design",
    description: "An artistic and creative layout for visual assignments.",
    preview: "/templates/template6-preview.png",
  },
  {
    id: "scrapbook-biology",
    name: "Scrapbook Biology",
    description: "Creative black and orange scrapbook-style project cover",
    preview: "/templates/template7-preview.webp",
  },
  {
    id: "blue-white-border",
    name: "Blue White Border",
    description: "Clean blue and white professional academic page border",
    preview: "/templates/template8-preview.webp",
  },
  {
    id: "gray-vintage",
    name: "Gray Vintage",
    description: "Elegant gray vintage aesthetic cover page border",
    preview: "/templates/template9-preview.webp",
  },
  {
    id: "math-notebook",
    name: "Math Notebook",
    description: "Classic mathematics grid notebook style assignment cover",
    preview: "/templates/template10-preview.webp",
  },
  {
    id: "purple-watercolor",
    name: "Purple Watercolor",
    description: "Beautiful purple floral watercolor aesthetic assignment cover",
    preview: "/templates/template11-preview.webp",
  },
];

export const CERTIFICATE_DESCRIPTIONS = [
  "In recognition of your outstanding performance, unwavering dedication, and the remarkable results you have consistently achieved.",
  "Awarded for your exceptional contributions, creative problem-solving, and commitment to excellence in every endeavor.",
  "In acknowledgment of your tireless efforts, exemplary conduct, and the inspiring example you set for your peers.",
  "This certificate celebrates your consistent hard work, discipline, and the exceptional standards you uphold.",
  "Honoring your steadfast commitment, expert skills, and the invaluable impact of your work on the entire team.",
  "Recognizing your innovative spirit, leadership qualities, and outstanding achievements throughout the program.",
];

export const RESUME_TEMPLATES = [
  {
    id: "professional-resume",
    name: "Professional Resume Template",
    description:
      "ATS-friendly professional resume template ideal for students, freshers, internships, and corporate job applications.",
    preview: "/templates/resume1-preview.webp",
    badge: null as string | null,
  },
  {
    id: "technical-resume",
    name: "Technical Resume Template",
    description:
      "Designed for software engineers, developers, cybersecurity professionals, and technical roles. ATS optimized format.",
    preview: "/templates/resume2-preview.webp",
    badge: "⭐ Most Used by Engineering Students",
  },
  {
    id: "modern-executive-resume",
    name: "Modern Executive Resume",
    description:
      "Modern two-column resume with profile photo and professional layout. Perfect for management, design, and leadership roles.",
    preview: "/templates/resume3-preview.webp",
    badge: null as string | null,
  },
];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const YEARS = Array.from({ length: 20 }, (_, i) => String(2016 + i));
export const BATCH_YEARS = Array.from({ length: 21 }, (_, i) =>
  String(2016 + i)
);
export const SEMESTERS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];
