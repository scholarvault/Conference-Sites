export const config = { runtime: 'edge' };

declare const process: any;

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_NAME      = "ICAHCR 2026";
const FROM_EMAIL     = "conferences@scholarvault.in";
const REPLY_TO       = "conferences@scholarvault.in";
const ADMIN_EMAIL    = "conferences@scholarvault.in";


const ALLOWED_ORIGINS = [
  "https://aihealth.scholarvault.in",
  "https://scholarvault.in",
  "https://conf.scholarvault.in",
  "https://bizai.scholarvault.in",
  "https://greentech.scholarvault.in",
  "https://edtech.scholarvault.in",
  "https://isiaisgs2026.scholarvault.in"
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("Origin");
  const isAllowed = origin && ALLOWED_ORIGINS.includes(origin);
  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "https://scholarvault.in",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
  };
}

// ─── helpers ────────────────────────────────────────────────
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function send(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
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
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error ${res.status}: ${err}`);
  }
  return res.json();
}

// ─── base layout ────────────────────────────────────────────
function layout(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{margin:0;padding:0;background:#040b1a;font-family:'Segoe UI',Arial,sans-serif;color:#f0f4ff;}
  .wrap{max-width:600px;margin:0 auto;padding:32px 16px;}
  .card{background:#071225;border:1px solid rgba(255,255,255,0.08);border-radius:20px;overflow:hidden;}
  .header{background:linear-gradient(135deg,#0066ff,#00d4ff);padding:32px 32px 24px;text-align:center;}
  .header-icon{font-size:3rem;margin-bottom:8px;}
  .header h1{margin:0;font-size:1.5rem;font-weight:900;color:#fff;letter-spacing:-0.02em;}
  .header p{margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);}
  .body{padding:32px;}
  .greeting{font-size:1.1rem;font-weight:700;margin-bottom:16px;}
  .lead{font-size:14.5px;line-height:1.75;color:rgba(240,244,255,0.8);margin-bottom:20px;}
  .info-box{background:rgba(0,212,255,0.06);border:1px solid rgba(0,212,255,0.15);border-radius:12px;padding:20px;margin:20px 0;}
  .info-box h3{margin:0 0 12px;font-size:13px;font-weight:800;color:#00d4ff;text-transform:uppercase;letter-spacing:0.08em;}
  .info-row{display:flex;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13.5px;}
  .info-row:last-child{border-bottom:none;}
  .info-label{color:rgba(240,244,255,0.5);min-width:140px;flex-shrink:0;}
  .info-value{color:#f0f4ff;font-weight:600;}
  .cta{display:block;text-align:center;padding:14px 32px;background:linear-gradient(135deg,#0066ff,#00d4ff);color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:14.5px;margin:24px auto;max-width:260px;}
  .badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.2);border-radius:100px;font-size:12px;font-weight:700;color:#00d4ff;margin:16px 0;}
  .divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:24px 0;}
  .note{font-size:12.5px;color:rgba(240,244,255,0.4);line-height:1.7;}
  .footer{padding:20px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);}
  .footer p{font-size:12px;color:rgba(240,244,255,0.3);margin:4px 0;}
  .footer a{color:#00d4ff;text-decoration:none;}
</style>
</head>
<body>
<div class="wrap">
  <div class="card">
    ${body}
    <div class="footer">
      <p>ICAHCR 2026 · International Conference on AI and Healthcare Research</p>
      <p>Organized by <a href="https://scholarvault.in">Scholar Vault</a> · <a href="https://aihealth.scholarvault.in">Conference Website</a></p>
      <p>© 2026 Scholar Vault · <a href="https://aihealth.scholarvault.in/privacy.html">Privacy Policy</a></p>
    </div>
  </div>
</div>
</body>
</html>`;
}

// ─── email templates ─────────────────────────────────────────

function tplRegistration(d: Record<string, string>) {
  const tierMap: Record<string, string> = {
    student:   "Student / PhD Scholar",
    faculty:   "Faculty / Postdoc",
    presenter: "Presenter",
    listener:  "Listener",
  };
  const tierLabel = tierMap[d.tier] || d.tier;
  const goldBlock = d.sv_gold === "true"
    ? `<div class="badge">Scholar Vault Gold Member — 15% discount applied</div><br/>`
    : "";

  return layout(`
    <div class="header">
            <h1>Registration Confirmed!</h1>
      <p>ICAHCR 2026 · August 22–23, 2026</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Your registration for <strong>ICAHCR 2026 — International Conference on AI and Healthcare Research</strong>
        has been received and confirmed. We look forward to welcoming you!
      </p>
      ${goldBlock}
      <div class="info-box">
        <h3>Registration Details</h3>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${d.email}</span></div>
        <div class="info-row"><span class="info-label">Registration Tier</span><span class="info-value">${tierLabel}</span></div>
        ${d.institution ? `<div class="info-row"><span class="info-label">Institution</span><span class="info-value">${d.institution}</span></div>` : ""}
        ${d.country     ? `<div class="info-row"><span class="info-label">Country</span><span class="info-value">${d.country}</span></div>` : ""}
        <div class="info-row"><span class="info-label">Conference Date</span><span class="info-value">August 22–23, 2026</span></div>
        <div class="info-row"><span class="info-label">Format</span><span class="info-value">100% Virtual</span></div>
      </div>
      <p class="lead">
        Your <strong>virtual joining link</strong> will be sent 5 days before the conference (August 17, 2026).
        Your <strong>e-certificate</strong> will be emailed within 7 days after the conference.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in">Visit Conference Website →</a>
      <hr class="divider"/>
      <p class="note">
        If you submitted a paper, track its status at the conference portal.<br/>
        Questions? Reply to this email or write to <a href="mailto:conferences@scholarvault.in" style="color:#00d4ff;">conferences@scholarvault.in</a>
      </p>
    </div>
  `);
}

function tplPaperSubmission(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>Paper Submission Received</h1>
      <p>ICAHCR 2026 · Peer Review in Progress</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Thank you for submitting your research paper to <strong>ICAHCR 2026</strong>.
        Your submission has been logged and will enter the double-blind peer review process.
      </p>
      <div class="info-box">
        <h3>Submission Details</h3>
        <div class="info-row"><span class="info-label">Author</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${d.email}</span></div>
        <div class="info-row"><span class="info-label">Paper Title</span><span class="info-value">${d.title}</span></div>
        ${d.track ? `<div class="info-row"><span class="info-label">Conference Track</span><span class="info-value">${d.track}</span></div>` : ""}
        <div class="info-row"><span class="info-label">Review Process</span><span class="info-value">Double-blind (2–3 reviewers)</span></div>
        <div class="info-row"><span class="info-label">Decision Expected</span><span class="info-value">By July 15, 2026</span></div>
      </div>
      <p class="lead">
        <strong>What happens next?</strong><br/>
        Your paper will be assigned to 2–3 domain experts for independent review.
        You will receive an acceptance / revision / rejection notice by <strong>July 15, 2026</strong>.
        If accepted, camera-ready upload is due <strong>July 25, 2026</strong>.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in/call-for-papers.html">View CFP Guidelines →</a>
      <hr class="divider"/>
      <p class="note">
        Do NOT resubmit unless you receive an error notice. Your paper file has been securely stored.<br/>
        Queries: <a href="mailto:papers@scholarvault.in" style="color:#00d4ff;">papers@scholarvault.in</a>
      </p>
    </div>
  `);
}

function tplSpeakerApplication(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>Speaker Application Received</h1>
      <p>ICAHCR 2026 · Under Review</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Your speaker application for <strong>ICAHCR 2026</strong> has been received.
        The program committee will review your profile and proposed talk within 14 business days.
      </p>
      <div class="info-box">
        <h3>Application Details</h3>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${d.email}</span></div>
        ${d.designation  ? `<div class="info-row"><span class="info-label">Designation</span><span class="info-value">${d.designation}</span></div>` : ""}
        ${d.institution  ? `<div class="info-row"><span class="info-label">Institution</span><span class="info-value">${d.institution}</span></div>` : ""}
        ${d.talk_type    ? `<div class="info-row"><span class="info-label">Talk Type</span><span class="info-value">${d.talk_type}</span></div>` : ""}
        <div class="info-row"><span class="info-label">Decision Timeline</span><span class="info-value">Within 14 business days</span></div>
      </div>
      <p class="lead">
        If selected, you will receive a formal invitation letter with session details, presentation format guidelines,
        and a complimentary conference registration link.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in/speakers.html">View Current Speakers →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:speakers@scholarvault.in" style="color:#00d4ff;">speakers@scholarvault.in</a></p>
    </div>
  `);
}

function tplCommitteeApplication(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>Committee Application Received</h1>
      <p>ICAHCR 2026 · Under Review</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Thank you for applying to join the <strong>ICAHCR 2026 Organizing Committee</strong>.
        The conference chair will review your application within 14 business days.
      </p>
      <div class="info-box">
        <h3>Application Details</h3>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${d.email}</span></div>
        ${d.designation ? `<div class="info-row"><span class="info-label">Designation</span><span class="info-value">${d.designation}</span></div>` : ""}
        ${d.institution ? `<div class="info-row"><span class="info-label">Institution</span><span class="info-value">${d.institution}</span></div>` : ""}
        ${d.expertise   ? `<div class="info-row"><span class="info-label">Role Preference</span><span class="info-value">${d.expertise}</span></div>` : ""}
        <div class="info-row"><span class="info-label">Status</span><span class="info-value">Pending Review</span></div>
      </div>
      <p class="lead">
        <strong>Benefits on acceptance:</strong> complimentary registration, official certificate,
        your name and photo on the conference website, credit in proceedings, and global networking.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in/committee.html">View Committee →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00d4ff;">conferences@scholarvault.in</a></p>
    </div>
  `);
}

function tplInterest(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>Interest Received!</h1>
      <p>ICAHCR 2026 · We'll Keep You Updated</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Thank you for expressing interest in <strong>ICAHCR 2026 — International Conference on AI and Healthcare Research</strong>.
        We have noted your interest and will keep you updated on all conference announcements.
      </p>
      <div class="info-box">
        <h3>Key Dates to Remember</h3>
        <div class="info-row"><span class="info-label">Paper Submission</span><span class="info-value">June 30, 2026</span></div>
        <div class="info-row"><span class="info-label">Early Bird Ends</span><span class="info-value">July 15, 2026</span></div>
        <div class="info-row"><span class="info-label">Conference</span><span class="info-value">August 22–23, 2026</span></div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:24px 0;">
        <a class="cta" style="margin:0;display:inline-block;" href="https://aihealth.scholarvault.in/register.html">Register Now →</a>
        <a href="https://aihealth.scholarvault.in/submit-paper.html" style="display:inline-block;padding:14px 24px;border:1.5px solid rgba(0,212,255,0.3);color:#00d4ff;border-radius:100px;font-size:13.5px;font-weight:700;text-decoration:none;">Submit a Paper →</a>
      </div>
      <hr class="divider"/>
      <p class="note">You're receiving this because you submitted your interest at aihealth.scholarvault.in.
      <a href="mailto:conferences@scholarvault.in?subject=Unsubscribe" style="color:#00d4ff;">Unsubscribe</a></p>
    </div>
  `);
}

function tplAwardNomination(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>Nomination Received</h1>
      <p>ICAHCR 2026 · Awards Committee</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Your nomination for the <strong>${d.award_category}</strong> has been successfully received by the ICAHCR 2026 Organizing Committee.
      </p>
      <div class="info-box">
        <h3>Nomination Details</h3>
        <div class="info-row"><span class="info-label">Category</span><span class="info-value">${d.award_category}</span></div>
        <div class="info-row"><span class="info-label">Nominee</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Institution</span><span class="info-value">${d.institution}</span></div>
        <div class="info-row"><span class="info-label">Type</span><span class="info-value">${d.nom_type}</span></div>
      </div>
      <p class="lead">
        The awards committee will review all nominations carefully. Results will be announced live at the conference on August 22–23, 2026.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in/awards.html">View Award Categories →</a>
      <hr class="divider"/>
      <p class="note">
        Questions? Reply to this email or write to <a href="mailto:conferences@scholarvault.in" style="color:#00d4ff;">conferences@scholarvault.in</a>
      </p>
    </div>
  `);
}

function tplSubscribe(d: Record<string, string>) {
  return layout(`
    <div class="header">
            <h1>You're Subscribed!</h1>
      <p>ICAHCR 2026 Conference Updates</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Hi ${d.name || "there"},</div>
      <p class="lead">
        You're now subscribed to <strong>ICAHCR 2026</strong> updates.
        You'll be the first to know about early bird registration, speaker announcements,
        and key deadline reminders.
      </p>
      <div class="info-box">
        <h3>What to Expect</h3>
        <div class="info-row"><span class="info-label">Early Bird Alert</span><span class="info-value">~2 weeks before deadline</span></div>
        <div class="info-row"><span class="info-label">Speaker Reveals</span><span class="info-value">May – July 2026</span></div>
        <div class="info-row"><span class="info-label">Paper Deadline Reminder</span><span class="info-value">June 23, 2026</span></div>
        <div class="info-row"><span class="info-label">Agenda Announcement</span><span class="info-value">August 10, 2026</span></div>
      </div>
      <a class="cta" href="https://aihealth.scholarvault.in">Visit Conference Website →</a>
      <hr class="divider"/>
      <p class="note">Don't want updates? <a href="mailto:conferences@scholarvault.in?subject=Unsubscribe&body=Please unsubscribe ${d.email}" style="color:#00d4ff;">Unsubscribe</a></p>
    </div>
  `);
}

function tplDownload(d: Record<string, string>) {
  const labels: Record<string, string> = {
    "cfp-flyer":        "Call for Papers Flyer",
    "brochure":         "Conference Brochure",
    "paper-template":   "Paper Submission Template",
    "sponsorship-deck": "Sponsorship Deck",
    "sv-badge-cert":    "SV Verification Certificate",
  };
  const resourceName = labels[d.type] || d.type;
  return layout(`
    <div class="header">
            <h1>Your Download is Ready</h1>
      <p>ICAHCR 2026 · ${resourceName}</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Hi ${d.name || "there"},</div>
      <p class="lead">
        Thank you for downloading the <strong>${resourceName}</strong> for ICAHCR 2026.
      </p>
      <div class="info-box">
        <h3>Resource Links</h3>
        <div class="info-row"><span class="info-label">Resource</span><span class="info-value">${resourceName}</span></div>
        <div class="info-row"><span class="info-label">Conference</span><span class="info-value">ICAHCR 2026</span></div>
        <div class="info-row"><span class="info-label">Organized by</span><span class="info-value">Scholar Vault</span></div>
      </div>
      <p class="lead" style="background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.15);border-radius:12px;padding:14px;font-size:13.5px;">
        <strong>Note:</strong> The official downloadable file will be available here once the conference portal is live.
        In the interim, email <a href="mailto:conferences@scholarvault.in" style="color:#00d4ff;">conferences@scholarvault.in</a> to receive the file directly.
      </p>
      <a class="cta" href="https://aihealth.scholarvault.in/downloads.html">View All Downloads →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00d4ff;">conferences@scholarvault.in</a></p>
    </div>
  `);
}

// VANGUARD: Added missing contact template to ensure users get confirmation for contact form submissions
function tplContact(d: Record<string, string>) {
  return layout(`
    <div class="header">
      <h1>Message Received</h1>
      <p>ICAHCR 2026 · Organising Desk</p>
    </div>
    <div class="body">
      <div class="greeting" style="color: #ffffff;">Dear ${d.name},</div>
      <p class="lead">
        Thanks for reaching out. We have received your query and a member of the ICAHCR 2026 support team will reply within 24 hours.
      </p>
      <div class="info-box">
        <h3>Query Details</h3>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${d.name}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${d.email}</span></div>
        <div class="info-row"><span class="info-label">Topic</span><span class="info-value">${d.query_type}</span></div>
      </div>
      <a class="cta" href="https://aihealth.scholarvault.in/">Back to Conference Website →</a>
      <hr class="divider"/>
      <p class="note">
        If your question is deadline-sensitive, please reply to this email with URGENT in the subject line.
      </p>
    </div>
  `);
}

// ─── router ───────────────────────────────────────────────────
const emailMap: Record<string, { subject: string; tpl: (d: Record<string,string>) => string }> = {
  registration: {
    subject: "Registration Confirmed — ICAHCR 2026 (Aug 22–23)",
    tpl: tplRegistration,
  },
  paper_submission: {
    subject: "Paper Submission Received — ICAHCR 2026",
    tpl: tplPaperSubmission,
  },
  speaker_application: {
    subject: "Speaker Application Received — ICAHCR 2026",
    tpl: tplSpeakerApplication,
  },
  committee_application: {
    subject: "Committee Application Received — ICAHCR 2026",
    tpl: tplCommitteeApplication,
  },
  interest: {
    subject: "Interest Noted — ICAHCR 2026 Updates on the Way",
    tpl: tplInterest,
  },
  subscribe: {
    subject: "You're Subscribed to ICAHCR 2026 Updates",
    tpl: tplSubscribe,
  },
  download: {
    subject: "Your ICAHCR 2026 Download — Scholar Vault",
    tpl: tplDownload,
  },
  award_nomination: {
    subject: "Award Nomination Received — ICAHCR 2026",
    tpl: tplAwardNomination,
  },
  contact: {
    subject: "Contact Request Received — ICAHCR 2026",
    tpl: tplContact,
  },
};

// ─── handler ──────────────────────────────────────────────────
export default async function handler(req: Request) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getCorsHeaders(req)
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const body = await req.json() as {
      type: string;
      data: Record<string, string>;
    };

    const { type, data } = body;

    if (!type || !data?.email) {
      return new Response(JSON.stringify({ error: "type and data.email required" }), {
        status: 400,
        headers: getCorsHeaders(req),
      });
    }

    // Sanitize input data to prevent HTML injection in emails
    const sanitizedData: Record<string, string> = {};
    for (const key in data) {
      // Sentinel: Ensure all inputs are strings before escaping to prevent array/object bypass
      const val = data[key] == null ? "" : String(data[key]);
      sanitizedData[key] = escapeHtml(val);
    }

    const conf = emailMap[type];
    if (!conf) {
      return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
        status: 400,
        headers: getCorsHeaders(req),
      });
    }

    // Send to user
    await send(data.email, conf.subject, conf.tpl(sanitizedData));

    // Send to admin notification
    await send(ADMIN_EMAIL, `[ADMIN NOTIFICATION] ${conf.subject}`, conf.tpl(sanitizedData));

    return new Response(JSON.stringify({ success: true, type, to: data.email }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...getCorsHeaders(req) },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Email function error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: getCorsHeaders(req),
    });
  }
}
