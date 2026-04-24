export const config = { runtime: 'edge' };

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
const FROM_NAME      = "ICAES 2026";
const FROM_EMAIL     = "conferences@scholarvault.in";
const REPLY_TO       = "conferences@scholarvault.in";
const CONF_URL       = "https://greentech.scholarvault.in";

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
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

function layout(body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><style>
body{margin:0;padding:0;background:#061810;font-family:'Segoe UI',Arial,sans-serif;color:#f0fff8;}
.wrap{max-width:600px;margin:0 auto;padding:32px 16px;}
.card{background:#0b2318;border:1px solid rgba(0,168,120,0.15);border-radius:20px;overflow:hidden;}
.header{background:linear-gradient(135deg,#00A878,#7FE04B);padding:32px 32px 24px;text-align:center;}
.header h1{margin:0;font-size:1.5rem;font-weight:900;color:#fff;letter-spacing:-0.02em;}
.header p{margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);}
.body{padding:32px;}
.greeting{font-size:1.1rem;font-weight:700;margin-bottom:16px;color:#fff;}
.lead{font-size:14.5px;line-height:1.75;color:rgba(240,255,248,0.75);margin-bottom:20px;}
.info-box{background:rgba(0,168,120,0.06);border:1px solid rgba(0,168,120,0.2);border-radius:12px;padding:20px;margin:20px 0;}
.info-box h3{margin:0 0 12px;font-size:12px;font-weight:800;color:#00CC94;text-transform:uppercase;letter-spacing:0.1em;}
.info-row{display:flex;gap:8px;padding:7px 0;border-bottom:1px solid rgba(0,168,120,0.06);font-size:13.5px;}
.info-row:last-child{border-bottom:none;}
.info-label{color:rgba(240,255,248,0.45);min-width:140px;flex-shrink:0;}
.info-value{color:#f0fff8;font-weight:600;}
.cta{display:block;text-align:center;padding:14px 32px;background:linear-gradient(135deg,#00A878,#7FE04B);color:#fff;text-decoration:none;border-radius:100px;font-weight:700;font-size:14.5px;margin:24px auto;max-width:260px;}
.divider{border:none;border-top:1px solid rgba(0,168,120,0.1);margin:24px 0;}
.note{font-size:12.5px;color:rgba(240,255,248,0.35);line-height:1.7;}
.footer{padding:20px 32px;text-align:center;border-top:1px solid rgba(0,168,120,0.1);}
.footer p{font-size:12px;color:rgba(240,255,248,0.25);margin:4px 0;}
.footer a{color:#00CC94;text-decoration:none;}
</style></head><body><div class="wrap"><div class="card">
${body}
<div class="footer">
  <p>ICAES 2026 · International Conference on AI for Environmental Sustainability</p>
  <p>Organized by <a href="https://scholarvault.in">ScholarVault</a> · <a href="${CONF_URL}">Conference Website</a></p>
  <p>© 2026 ScholarVault · <a href="${CONF_URL}/privacy">Privacy Policy</a></p>
</div>
</div></div></body></html>`;
}

function tplInterest(d: Record<string,string>) {
  return layout(`
    <div class="header"><h1>Interest Received! 🌿</h1><p>ICAES 2026 · AI for Environmental Sustainability</p></div>
    <div class="body">
      <div class="greeting">Dear ${d.name || 'Researcher'},</div>
      <p class="lead">Thank you for expressing interest in <strong>ICAES 2026 — International Conference on AI for Environmental Sustainability</strong>. You'll be first to know when registration opens and dates are confirmed.</p>
      <div class="info-box">
        <h3>Conference Overview</h3>
        <div class="info-row"><span class="info-label">Event</span><span class="info-value">Q4 2026 (Dates TBA)</span></div>
        <div class="info-row"><span class="info-label">Format</span><span class="info-value">100% Virtual</span></div>
        <div class="info-row"><span class="info-label">Tracks</span><span class="info-value">8 Research Tracks</span></div>
        <div class="info-row"><span class="info-label">Proceedings</span><span class="info-value">ISBN-Indexed</span></div>
      </div>
      <a class="cta" href="${CONF_URL}/call-for-papers">View Call for Papers →</a>
      <hr class="divider"/>
      <p class="note">You registered interest at greentech.scholarvault.in. <a href="mailto:conferences@scholarvault.in?subject=Unsubscribe" style="color:#00CC94;">Unsubscribe</a></p>
    </div>`);
}

function tplSubscribe(d: Record<string,string>) {
  return layout(`
    <div class="header"><h1>You're Subscribed! 🌱</h1><p>ICAES 2026 Conference Updates</p></div>
    <div class="body">
      <div class="greeting">Hi ${d.name || 'there'},</div>
      <p class="lead">You're now subscribed to <strong>ICAES 2026</strong> updates — conference dates, call for papers launch, speaker announcements, and early bird alerts.</p>
      <div class="info-box">
        <h3>What's Coming</h3>
        <div class="info-row"><span class="info-label">Conference Dates</span><span class="info-value">Q4 2026 — Announcing Soon</span></div>
        <div class="info-row"><span class="info-label">Call for Papers</span><span class="info-value">Opening Q3 2026</span></div>
        <div class="info-row"><span class="info-label">Speaker Reveals</span><span class="info-value">Q3–Q4 2026</span></div>
      </div>
      <a class="cta" href="${CONF_URL}">Visit Conference Website →</a>
      <hr class="divider"/>
      <p class="note"><a href="mailto:conferences@scholarvault.in?subject=Unsubscribe" style="color:#00CC94;">Unsubscribe</a></p>
    </div>`);
}

function tplPaperSubmission(d: Record<string,string>) {
  return layout(`
    <div class="header"><h1>Paper Submission Received 📄</h1><p>ICAES 2026 · Peer Review in Progress</p></div>
    <div class="body">
      <div class="greeting">Dear ${d.author_name || d.name || 'Author'},</div>
      <p class="lead">Thank you for submitting your research to <strong>ICAES 2026</strong>. Your submission has been logged and will enter double-blind peer review.</p>
      <div class="info-box">
        <h3>Submission Details</h3>
        <div class="info-row"><span class="info-label">Paper Title</span><span class="info-value">${d.paper_title || d.title || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Author</span><span class="info-value">${d.author_name || d.name || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Track</span><span class="info-value">${d.track || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Review Process</span><span class="info-value">Double-blind (2–3 reviewers)</span></div>
      </div>
      <p class="lead">You will receive an acceptance / revision / rejection notice by the deadline communicated in the Call for Papers.</p>
      <a class="cta" href="${CONF_URL}/call-for-papers">View CFP Guidelines →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00CC94;">conferences@scholarvault.in</a></p>
    </div>`);
}

function tplSpeakerNomination(d: Record<string,string>) {
  return layout(`
    <div class="header"><h1>Speaker Application Received 🎤</h1><p>ICAES 2026 · Under Review</p></div>
    <div class="body">
      <div class="greeting">Dear ${d.speaker_name || d.name || 'Applicant'},</div>
      <p class="lead">Your speaker application for <strong>ICAES 2026</strong> has been received. The programme committee will review your profile within 14 business days.</p>
      <div class="info-box">
        <h3>Application Summary</h3>
        <div class="info-row"><span class="info-label">Speaker Name</span><span class="info-value">${d.speaker_name || d.name || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Expertise</span><span class="info-value">${d.expertise || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Proposed Topic</span><span class="info-value">${d.talk_title || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Decision Timeline</span><span class="info-value">Within 14 business days</span></div>
      </div>
      <a class="cta" href="${CONF_URL}/speakers">View Speakers Page →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00CC94;">conferences@scholarvault.in</a></p>
    </div>`);
}

function tplCommitteeApplication(d: Record<string,string>) {
  return layout(`
    <div class="header"><h1>Committee Application Received ⭐</h1><p>ICAES 2026 · Under Review</p></div>
    <div class="body">
      <div class="greeting">Dear ${d.name || 'Applicant'},</div>
      <p class="lead">Thank you for applying to join the <strong>ICAES 2026 Programme Committee</strong>. The conference chair will review your application within 14 business days.</p>
      <div class="info-box">
        <h3>Application Summary</h3>
        <div class="info-row"><span class="info-label">Name</span><span class="info-value">${d.name || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Institution</span><span class="info-value">${d.institution || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Role Preferred</span><span class="info-value">${d.role || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Status</span><span class="info-value">Pending Review</span></div>
      </div>
      <a class="cta" href="${CONF_URL}/committee">View Committee Page →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00CC94;">conferences@scholarvault.in</a></p>
    </div>`);
}

function tplDownload(d: Record<string,string>) {
  const labels: Record<string,string> = {
    brochure: 'Conference Brochure', cfp: 'Call for Papers PDF',
    template: 'Paper Submission Template', press: 'Press Release', branding: 'Brand Assets'
  };
  const resourceName = labels[d.type] || d.type || 'Document';
  return layout(`
    <div class="header"><h1>Download Request Received 📥</h1><p>ICAES 2026 · ${resourceName}</p></div>
    <div class="body">
      <div class="greeting">Hi ${d.name || 'there'},</div>
      <p class="lead">Thank you for your interest in the <strong>${resourceName}</strong> for ICAES 2026. Our team will send the file to <strong>${d.email}</strong> shortly.</p>
      <div class="info-box">
        <h3>Resource Requested</h3>
        <div class="info-row"><span class="info-label">Resource</span><span class="info-value">${resourceName}</span></div>
        <div class="info-row"><span class="info-label">Conference</span><span class="info-value">ICAES 2026</span></div>
      </div>
      <a class="cta" href="${CONF_URL}/downloads">View All Downloads →</a>
      <hr class="divider"/>
      <p class="note">Queries: <a href="mailto:conferences@scholarvault.in" style="color:#00CC94;">conferences@scholarvault.in</a></p>
    </div>`);
}

const emailMap: Record<string, {subject: string; tpl: (d: Record<string,string>) => string}> = {
  interest:              { subject: 'Interest Noted — ICAES 2026 Updates on the Way', tpl: tplInterest },
  subscribe:             { subject: "You're Subscribed to ICAES 2026 Updates", tpl: tplSubscribe },
  paper_submission:      { subject: 'Paper Submission Received — ICAES 2026', tpl: tplPaperSubmission },
  speaker_nomination:    { subject: 'Speaker Application Received — ICAES 2026', tpl: tplSpeakerNomination },
  committee_application: { subject: 'Committee Application Received — ICAES 2026', tpl: tplCommitteeApplication },
  download:              { subject: 'Your ICAES 2026 Download — ScholarVault', tpl: tplDownload },
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' }, status: 204 });
  }
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  try {
    const body = await req.json() as { type: string; data: Record<string,string> };
    const { type, data } = body;
    if (!type || !data?.email) return new Response(JSON.stringify({ error: 'type and data.email required' }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    // Sanitize input data to prevent HTML injection in emails
    const sanitizedData: Record<string, string> = {};
    for (const key in data) {
      if (typeof data[key] === "string") {
        sanitizedData[key] = escapeHtml(data[key]);
      } else {
        sanitizedData[key] = data[key];
      }
    }

    const conf = emailMap[type];
    if (!conf) return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    await send(data.email, conf.subject, conf.tpl(sanitizedData));
    return new Response(JSON.stringify({ success: true, type, to: data.email }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Email error:', message);
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
