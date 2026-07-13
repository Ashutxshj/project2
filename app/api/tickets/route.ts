import { promises as fs } from "node:fs";
import path from "node:path";
import { randomInt } from "node:crypto";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "tickets.json");

const CATEGORIES = [
  "General Question",
  "Bug Report",
  "PDF Generation Issue",
  "Template Issue",
  "Resume Builder",
  "Thesis Formatting",
  "Billing",
  "Feature Request",
  "Other",
] as const;

const PRIORITIES = ["Low", "Medium", "High"] as const;

const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
];
const ALLOWED_ATTACHMENT_EXT = /\.(pdf|png|jpe?g)$/i;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AttachmentMeta {
  filename: string;
  size: number;
  type: string;
}

interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  attachment: AttachmentMeta | null;
  status: string;
  createdAt: string;
}

async function readTickets(): Promise<Ticket[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Ticket[]) : [];
  } catch {
    // File missing or unreadable — treat as empty store.
    return [];
  }
}

async function writeTickets(tickets: Ticket[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(tickets, null, 2), "utf8");
}

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function generateTicketId(): string {
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_ALPHABET[randomInt(ID_ALPHABET.length)];
  }
  return `CVL-${suffix}`;
}

function formString(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Expected multipart/form-data." },
      { status: 400 }
    );
  }

  const name = formString(form, "name");
  const email = formString(form, "email");
  const subject = formString(form, "subject");
  const description = formString(form, "description");
  const category = formString(form, "category");
  const priority = formString(form, "priority");

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Full name is required.";
  if (!email) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(email))
    errors.email = "Enter a valid email address.";
  if (!subject) errors.subject = "Subject is required.";
  if (!description) errors.description = "Description is required.";
  if (!(CATEGORIES as readonly string[]).includes(category))
    errors.category = "Choose a valid category.";
  if (!(PRIORITIES as readonly string[]).includes(priority))
    errors.priority = "Choose a valid priority.";

  let attachment: AttachmentMeta | null = null;
  const file = form.get("attachment");
  if (file instanceof File && file.size > 0 && file.name) {
    if (
      !ALLOWED_ATTACHMENT_TYPES.includes(file.type) &&
      !ALLOWED_ATTACHMENT_EXT.test(file.name)
    ) {
      errors.attachment = "Only PDF, PNG, JPG or JPEG files are allowed.";
    } else if (file.size > MAX_ATTACHMENT_BYTES) {
      errors.attachment = "Attachment must be 2MB or smaller.";
    } else {
      // Store metadata only — never the file bytes.
      attachment = { filename: file.name, size: file.size, type: file.type };
    }
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed.", errors },
      { status: 400 }
    );
  }

  const tickets = await readTickets();

  let id = generateTicketId();
  while (tickets.some((t) => t.id === id)) {
    id = generateTicketId();
  }

  const ticket: Ticket = {
    id,
    name,
    email,
    subject,
    description,
    category,
    priority,
    attachment,
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  tickets.push(ticket);
  await writeTickets(tickets);

  return Response.json({ id }, { status: 201 });
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id")?.trim().toUpperCase();

  if (!id) {
    return Response.json(
      { error: "Query parameter 'id' is required." },
      { status: 400 }
    );
  }

  const tickets = await readTickets();
  const ticket = tickets.find((t) => t.id.toUpperCase() === id);

  if (!ticket) {
    return Response.json({ error: "Ticket not found." }, { status: 404 });
  }

  return Response.json({
    id: ticket.id,
    subject: ticket.subject,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    createdAt: ticket.createdAt,
  });
}
