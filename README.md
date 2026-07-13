# coverle-next

Exact replica of [coverle.in](https://coverle.in/) — CoverLe, a free academic document generator — built with **Next.js (App Router, TypeScript)** and Tailwind CSS.

34 routes, 7 document generators (assignment covers with 11 templates + 9 university variants, certificates, 3 resume builders, internship report, synopsis, 6-page thesis pack), each with live canvas preview, draft save/history (localStorage), and client-side PDF export (html2canvas-pro + jspdf, no watermark). Plus an AI ATS resume checker backed by the Claude API and a support ticket system, with sitemap.xml and robots.txt.

## How to run

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

Production build:

```bash
npm run build
npm run start      # serve the production build
```

## Environment variables (only for the ATS checker)

Everything works without configuration **except** `/ats-checker`, which calls the Claude API from the `/api/ats-check` route:

```bash
cp .env.example .env.local
# then set ANTHROPIC_API_KEY=sk-ant-...
```

Without a key the page still renders and shows a clear error on analysis. Uploaded resumes (PDF/DOCX) are parsed in memory and never stored.

## Notes

- Support tickets (`/support`) are stored locally in `data/tickets.json` via `/api/tickets` — create a ticket, then track it by its ID.
- All PDF generation happens in the browser; no documents ever leave the machine.
