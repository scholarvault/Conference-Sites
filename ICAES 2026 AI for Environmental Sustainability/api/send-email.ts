export const config = { runtime: "edge" };

declare const process: any;

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
const FROM_NAME = "ISIAI-SGS 2026";
const FROM_EMAIL = "conferences@scholarvault.in";
const REPLY_TO = "conferences@scholarvault.in";
const ADMIN_EMAIL = "conferences@scholarvault.in";
const ROOT_URL = "https://isiaisgs2026.scholarvault.in";

async function send(to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      reply_to: REPLY_TO,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error ${response.status}: ${text}`);
  }

  return response.json();
}

function layout(body: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body{margin:0;padding:0;background:#081210;color:#eef7f3;font-family:Segoe UI,Arial,sans-serif}
    .wrap{max-width:620px;margin:0 auto;padding:28px 14px}
    .card{background:#0d1e1a;border:1px solid rgba(255,255,255,.08);border-radius:24px;overflow:hidden}
    .hero{padding:32px;background:radial-gradient(circle at top,rgba(127,224,75,.16),transparent 50%),linear-gradient(135deg,#0c1d19,#14342c)}
    .eyebrow{display:inline-block;padding:8px 14px;border-radius:999px;background:rgba(127,224,75,.12);border:1px solid rgba(127,224,75,.24);color:#98eb6c;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
    h1{margin:18px 0 8px;font-size:28px;line-height:1.1}
    .subtitle{margin:0;color:rgba(255,255,255,.72);font-size:14px;line-height:1.7}
    .body{padding:28px 28px 18px}
    .lead{color:rgba(238,247,243,.78);font-size:14px;line-height:1.8;margin:0 0 18px}
    .info{padding:18px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);margin:20px 0}
    .row{display:flex;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
    .row:last-child{border-bottom:0}
    .label{min-width:138px;color:rgba(238,247,243,.48)}
    .value{color:#eef7f3;font-weight:600}
    .cta{display:inline-block;margin-top:8px;padding:14px 24px;border-radius:999px;background:linear-gradient(135deg,#98eb6c,#79f5d2);color:#081210;text-decoration:none;font-size:14px;font-weight:800}
    .note{margin-top:20px;color:rgba(238,247,243,.52);font-size:12.5px;line-height:1.7}
    .footer{padding:18px 28px 28px;color:rgba(238,247,243,.38);font-size:12px}
    .footer a{color:#79f5d2;text-decoration:none}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      ${body}
      <div class="footer">
        <div>ISIAI-SGS 2026 - International Summit on Interdisciplinary AI and Sustainable Global Systems</div>
        <div>Organised by <a href="https://scholarvault.in">ScholarVault</a> - <a href="${ROOT_URL}">Conference Website</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function rows(data: Array<[string, string | undefined]>) {
  return data
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<div class="row"><div class="label">${label}</div><div class="value">${value}</div></div>`)
    .join("");
}

function shell(tag: string, title: string, subtitle: string, content: string) {
  return layout(`
    <div class="hero">
      <div class="eyebrow">${tag}</div>
      <h1>${title}</h1>
      <p class="subtitle">${subtitle}</p>
    </div>
    <div class="body">${content}</div>
  `);
}

function tplRegistration(d: Record<string, string>) {
  return shell(
    "Registration",
    "Registration received",
    "ISIAI-SGS 2026 - virtual conference - October 15-16, 2026",
    `
      <p class="lead">Thank you for registering your interest in ISIAI-SGS 2026. Your submission has been recorded in our delegate system and the team will share conference access details, payment confirmations, and next steps by email.</p>
      <div class="info">${rows([
        ["Name", d.name],
        ["Email", d.email],
        ["Institution", d.institution],
        ["Country", d.country],
        ["Category", d.category],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/register">Review registration page</a>
      <p class="note">All programme dates are currently marked TBA within October 15-16, 2026. A formal update email will be sent as soon as the schedule is locked.</p>
    `,
  );
}

function tplPaperSubmission(d: Record<string, string>) {
  return shell(
    "Paper Submission",
    "Your paper is in the review queue",
    "Double-blind review - 8 research tracks",
    `
      <p class="lead">Your paper has been submitted to ISIAI-SGS 2026 and will enter our peer-review workflow. We will email you once the editorial screening and reviewer assignment are complete.</p>
      <div class="info">${rows([
        ["Author", d.name],
        ["Email", d.email],
        ["Paper title", d.title],
        ["Track", d.track],
        ["Institution", d.institution],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/call-for-papers">View call for papers</a>
      <p class="note">If you need to update a file or correct metadata, reply to this email and mention your paper title in the subject line.</p>
    `,
  );
}

function tplSpeakerApplication(d: Record<string, string>) {
  return shell(
    "Speaker Application",
    "Your speaker application is received",
    "Climate AI - policy - sustainability technology",
    `
      <p class="lead">Thank you for proposing a talk for ISIAI-SGS 2026. Our programme team will review your profile, abstract, and relevance to the summit agenda before sending the next update.</p>
      <div class="info">${rows([
        ["Name", d.name],
        ["Email", d.email],
        ["Institution", d.institution],
        ["Designation", d.designation],
        ["Talk type", d.talk_type],
        ["Topic", d.topic],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/speakers">View speakers page</a>
      <p class="note">Speaker confirmations will be rolled out in batches. Shortlisted applicants may be asked for a final title, headshot, and session format preferences.</p>
    `,
  );
}

function tplCommitteeApplication(d: Record<string, string>) {
  return shell(
    "Committee Application",
    "Committee application submitted",
    "Reviewers - track leads - outreach support",
    `
      <p class="lead">We have received your committee application for ISIAI-SGS 2026. The organising team will review your domain expertise and determine the best fit across track, review, and programme support roles.</p>
      <div class="info">${rows([
        ["Name", d.name],
        ["Email", d.email],
        ["Institution", d.institution],
        ["Designation", d.designation],
        ["Role interest", d.expertise],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/committee">View committee page</a>
      <p class="note">Accepted committee members will receive an onboarding email with role scope, timelines, and reviewer or moderation expectations.</p>
    `,
  );
}

function tplInterest(d: Record<string, string>) {
  return shell(
    "Express Interest",
    "You're on the ISIAI-SGS update list",
    "Dates, CFP alerts, keynote announcements",
    `
      <p class="lead">Thank you for expressing interest in ISIAI-SGS 2026. We'll use this address to share the conference brochure, deadline announcements, and milestone updates as they are published.</p>
      <div class="info">${rows([
        ["Name", d.name],
        ["Email", d.email],
        ["Role", d.role],
        ["Country", d.country],
      ])}</div>
      <a class="cta" href="${ROOT_URL}">Return to conference website</a>
      <p class="note">You can reply directly to this email if you want us to prioritise updates for author, speaker, sponsor, or committee opportunities.</p>
    `,
  );
}

function tplSubscribe(d: Record<string, string>) {
  return shell(
    "Newsletter",
    "Subscription confirmed",
    "ISIAI-SGS 2026 conference updates",
    `
      <p class="lead">You're now subscribed to ISIAI-SGS 2026 updates. Expect a concise stream of milestone emails including call-for-papers alerts, keynote announcements, and final date releases.</p>
      <div class="info">${rows([
        ["Subscriber", d.name || "Subscriber"],
        ["Email", d.email],
      ])}</div>
      <a class="cta" href="${ROOT_URL}">Visit ISIAI-SGS 2026</a>
      <p class="note">If you ever want to stop receiving updates, reply with the word unsubscribe and we will remove you from the list.</p>
    `,
  );
}

function tplDownload(d: Record<string, string>) {
  const resourceMap: Record<string, string> = {
    brochure: "Conference brochure",
    cfp: "Call for papers kit",
    template: "Paper template",
    media: "Media kit",
    badge: "Verification overview",
  };
  const resource = resourceMap[d.type] || "Conference resource";
  return shell(
    "Download Request",
    `${resource} requested`,
    "ISIAI-SGS 2026 document delivery",
    `
      <p class="lead">Thank you for requesting the <strong>${resource}</strong>. Your request has been logged and the conference team will share the latest version to this address.</p>
      <div class="info">${rows([
        ["Recipient", d.name],
        ["Email", d.email],
        ["Resource", resource],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/downloads">Browse downloads page</a>
      <p class="note">If the file is not yet public, our team may send a manual delivery or a refreshed link as soon as the final version is ready.</p>
    `,
  );
}

function tplAwardNomination(d: Record<string, string>) {
  return shell(
    "Awards",
    "Award nomination received",
    "ISIAI-SGS 2026 recognition programme",
    `
      <p class="lead">Thank you for submitting an award nomination for ISIAI-SGS 2026. The awards committee will review all nominations after the final paper and speaker lists are consolidated.</p>
      <div class="info">${rows([
        ["Nominee", d.nominee_name],
        ["Email", d.email],
        ["Award category", d.award_category],
        ["Institution", d.institution],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/awards">View awards page</a>
      <p class="note">Winners will be announced during the virtual conference programme and featured in the event communication archive.</p>
    `,
  );
}

function tplContact(d: Record<string, string>) {
  return shell(
    "Contact",
    "We've received your message",
    "ISIAI-SGS 2026 organising desk",
    `
      <p class="lead">Thanks for reaching out. Your query has been logged and a member of the ISIAI-SGS support team will reply soon.</p>
      <div class="info">${rows([
        ["Name", d.name],
        ["Email", d.email],
        ["Topic", d.query_type],
      ])}</div>
      <a class="cta" href="${ROOT_URL}/contact">Back to contact page</a>
      <p class="note">If your question is deadline-sensitive, reply to this email with URGENT in the subject line and include any reference number or paper title.</p>
    `,
  );
}

const emailMap: Record<string, { subject: string; tpl: (d: Record<string, string>) => string }> = {
  registration: {
    subject: "Registration received - ISIAI-SGS 2026",
    tpl: tplRegistration,
  },
  paper_submission: {
    subject: "Paper submission received - ISIAI-SGS 2026",
    tpl: tplPaperSubmission,
  },
  speaker_application: {
    subject: "Speaker application received - ISIAI-SGS 2026",
    tpl: tplSpeakerApplication,
  },
  committee_application: {
    subject: "Committee application received - ISIAI-SGS 2026",
    tpl: tplCommitteeApplication,
  },
  interest: {
    subject: "Interest noted - ISIAI-SGS 2026",
    tpl: tplInterest,
  },
  subscribe: {
    subject: "You are subscribed to ISIAI-SGS 2026 updates",
    tpl: tplSubscribe,
  },
  download: {
    subject: "Your ISIAI-SGS 2026 resource request",
    tpl: tplDownload,
  },
  award_nomination: {
    subject: "Award nomination received - ISIAI-SGS 2026",
    tpl: tplAwardNomination,
  },
  contact: {
    subject: "ISIAI-SGS 2026 contact request received",
    tpl: tplContact,
  },
};


// ─── CORS Helpers ─────────────────────────────────────────────
export const ALLOWED_ORIGINS = [
  "https://aihealth.scholarvault.in",
  "https://scholarvault.in",
  "https://conf.scholarvault.in",
  "https://bizai.scholarvault.in",
  "https://greentech.scholarvault.in",
  "https://edtech.scholarvault.in",
  "https://isiaisgs2026.scholarvault.in"
];

export function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin");
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://isiaisgs2026.scholarvault.in",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

export default async function handler(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req),
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { type, data } = await req.json() as { type: string; data: Record<string, string> };
    if (!type || !data?.email) {
      return new Response(JSON.stringify({ error: "type and data.email required" }), {
        status: 400,
        headers: getCorsHeaders(req),
      });
    }

    // Sanitize input data to prevent HTML injection in emails
    const sanitizedData: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      // Sentinel: Ensure all inputs are strings before escaping to prevent array/object bypass
      const val = value == null ? "" : String(value);
      sanitizedData[key] = escapeHtml(val);
    }

    const config = emailMap[type];
    if (!config) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: getCorsHeaders(req),
      });
    }

    // Send to user
    await send(data.email, config.subject, config.tpl(sanitizedData));

    // Send to admin notification
    await send(ADMIN_EMAIL, `[ADMIN NOTIFICATION] ${config.subject}`, config.tpl(sanitizedData));

    return new Response(JSON.stringify({ success: true, type, to: data.email }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...getCorsHeaders(req),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: getCorsHeaders(req),
    });
  }
}
