import os, sys

dest = r"C:\Users\Shyam\Scholar Vault 2\Conference Sites\greentech"

# Shared nav/footer strings
NAV_SVG = '<svg width="52" height="52" viewBox="0 0 52 52" fill="none" style="border-radius:10px;background:white;padding:3px;flex-shrink:0;filter:drop-shadow(0 0 8px rgba(0,168,120,0.3));"><rect width="52" height="52" rx="10" fill="white"/><polygon points="26,4 44,14.5 44,37.5 26,48 8,37.5 8,14.5" fill="none" stroke="#00A878" stroke-width="2.5"/><line x1="26" y1="38" x2="26" y2="28" stroke="#1A4D3A" stroke-width="2.2" stroke-linecap="round"/><circle cx="26" cy="17" r="4" fill="#00A878"/><circle cx="18" cy="23" r="3.5" fill="#7FE04B" opacity=".9"/><circle cx="34" cy="20" r="3.5" fill="#7FE04B" opacity=".9"/><line x1="26" y1="38" x2="22" y2="43" stroke="#7FE04B" stroke-width="1.4" stroke-linecap="round"/><line x1="26" y1="38" x2="30" y2="43" stroke="#7FE04B" stroke-width="1.4" stroke-linecap="round"/><circle cx="19" cy="43" r="1.5" fill="#00A878"/><circle cx="33" cy="43" r="1.5" fill="#00A878"/></svg>'

def nav(active=""):
    active_class = lambda pg: ' class="active"' if pg == active else ""
    return f'''<nav class="navbar" id="navbar"><div class="navbar__inner"><a href="/" class="navbar__logo">{NAV_SVG}<div class="navbar__logo-text"><span class="navbar__logo-conf">ICAES 2026</span><span class="navbar__logo-year">AI for Environmental Sustainability</span></div></a><div class="navbar__links"><a href="/">Home</a><a href="/about"{active_class("about")}>About</a><a href="/call-for-papers"{active_class("cfp")}>Call for Papers</a><a href="/speakers"{active_class("speakers")}>Speakers</a><a href="/committee"{active_class("committee")}>Committee</a><a href="/awards"{active_class("awards")}>Awards</a><a href="/blog"{active_class("blog")}>Blog</a><a href="/media"{active_class("media")}>Media</a></div><div class="navbar__cta"><a href="/interest-form" class="btn-outline" style="padding:8px 16px;font-size:13px;border-color:rgba(0,168,120,0.3);color:var(--text-dark);">Express Interest</a><a href="/interest-form" class="btn-register">Get Notified &rarr;</a></div><button class="navbar__hamburger" id="hamburger"><span></span><span></span><span></span></button></div></nav><nav class="navbar__mobile" id="mobileMenu"><a href="/">Home</a><a href="/about">About</a><a href="/call-for-papers">Call for Papers</a><a href="/submit-paper">Submit Paper</a><a href="/speakers">Speakers</a><a href="/speaker-form">Become a Speaker</a><a href="/committee">Committee</a><a href="/awards">Awards</a><a href="/sdg">SDG Impact</a><a href="/blog">Blog</a><a href="/media">Media</a><a href="/scholarvault">About ScholarVault</a><a href="/interest-form" style="color:var(--emerald);font-weight:700;">Get Notified &rarr;</a></nav>'''

FOOTER = '''<footer class="footer"><div class="footer__inner"><div><div class="footer__brand-name">ICAES 2026</div><p class="footer__brand-desc">AI for Environmental Sustainability Conference. ScholarVault Platinum Verified. Q4 2026 &middot; Virtual.</p></div><div><div class="footer__col-title">Conference</div><div class="footer__links"><a href="/about">About</a><a href="/call-for-papers">Call for Papers</a><a href="/speakers">Speakers</a><a href="/committee">Committee</a></div></div><div><div class="footer__col-title">Participate</div><div class="footer__links"><a href="/interest-form">Express Interest</a><a href="/submit-paper">Submit Paper</a><a href="/speaker-form">Become a Speaker</a><a href="/register">Register</a></div></div><div><div class="footer__col-title">Info</div><div class="footer__links"><a href="/contact">Contact</a><a href="/privacy">Privacy Policy</a><a href="/refund">Refund Policy</a><a href="/scholarvault">ScholarVault</a></div></div></div><div class="footer__bottom"><span>&copy; 2026 ICAES 2026 &middot; ScholarVault</span><span>greentech.scholarvault.in</span></div></footer><script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script><script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script><script src="js/main.js"></script>'''

SCRIPTS = FOOTER  # footer includes scripts

def head(title, desc):
    return f'<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>\n<title>{title}</title>\n<meta name="description" content="{desc}"/>\n<link rel="stylesheet" href="css/style.css"/><link rel="icon" href="assets/icaes-logo.svg" type="image/svg+xml"/>\n</head><body>\n'

def hero_html(badge, h1, h1g, sub, cta=""):
    return f'''<section style="background:var(--forest);padding:140px 2rem 80px;text-align:center;">
  <div style="max-width:760px;margin:0 auto;">
    <div style="display:inline-flex;align-items:center;gap:8px;padding:5px 16px;border-radius:30px;border:1px solid rgba(127,224,75,0.3);background:rgba(127,224,75,0.06);font-size:12px;font-weight:700;color:#9FE86B;letter-spacing:.08em;margin-bottom:1.5rem;">{badge}</div>
    <h1 style="font-family:var(--font-head);font-weight:900;font-size:clamp(2rem,4vw,3.5rem);color:white;margin-bottom:1rem;">{h1} <span style="background:linear-gradient(130deg,#7FE04B,#00CC94);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">{h1g}</span></h1>
    <p style="color:rgba(255,255,255,0.6);font-size:1.05rem;line-height:1.8;">{sub}</p>{cta}
  </div>
</section>'''

def form_page(fname, title, desc, active, badge, h1, h1g, sub, form_id, form_title, form_sub, fields, btn, table, ok_msg, extra_script=""):
    body = hero_html(badge, h1, h1g, sub,
        '<div style="margin-top:1.5rem;"><span style="font-size:13px;color:rgba(255,255,255,0.45);">No payment required.</span></div>') + f'''
<section class="section section--white"><div class="container" style="max-width:760px;">
<div class="form-container reveal">
  <h2 class="form-title">{form_title}</h2>
  <p class="form-subtitle">{form_sub}</p>
  <div class="form-fields">
    <form id="{form_id}">
      {fields}
      <button type="submit" class="form-submit" data-default-text="{btn}">{btn}</button>
    </form>
  </div>
  <div class="form-success">
    <div class="form-success__title">Submitted!</div>
    <p class="form-success__text">{ok_msg}</p>
    <div class="form-success__actions"><a href="/" class="btn-primary">Back to Home</a></div>
  </div>
</div>
</div></section>
<script>
document.getElementById('{form_id}')?.addEventListener('submit',async function(e){{
  e.preventDefault();
  const fd=new FormData(this);
  const data=Object.fromEntries(fd.entries());
  const container=this.closest('.form-container');
  setFormLoading(container,true);
  try{{
    await insertRecord('{table}',data);
    showFormSuccess(container);
    trackEvent('{form_id}');
    sendEmail('{table}',data);
  }}catch(err){{
    showToast(err.code==='23505'?'Already submitted — we have your details!':'Submission failed. Please try again.','error');
  }}finally{{setFormLoading(container,false);}}
}});
{extra_script}
</script>'''
    return head(title, desc) + nav(active) + body + "\n" + FOOTER + "\n</body></html>"

INTEREST_FIELDS = '''<div class="form-row">
  <div class="form-group"><label>Full Name <span class="req">*</span></label><input type="text" name="name" placeholder="Dr. / Prof. / Your name" required/></div>
  <div class="form-group"><label>Email <span class="req">*</span></label><input type="email" name="email" placeholder="your@institution.edu" required/></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Phone</label><input type="tel" name="phone" placeholder="+91 XXXXX XXXXX"/></div>
  <div class="form-group"><label>Institution</label><input type="text" name="institution" placeholder="University / Organisation"/></div>
</div>
<div class="form-group"><label>Your Role</label>
  <select name="role"><option value="">Select your role</option><option>Researcher / PhD Scholar</option><option>Faculty / Professor</option><option>Industry Professional</option><option>Independent Researcher</option><option>Student</option><option>Other</option></select>
</div>
<div class="form-group"><label>Research Track of Interest</label>
  <select name="track"><option value="">Select a track</option><option>Track 1 &mdash; Climate AI &amp; Modelling</option><option>Track 2 &mdash; Precision Agriculture</option><option>Track 3 &mdash; Smart Energy Grids</option><option>Track 4 &mdash; Biodiversity Monitoring</option><option>Track 5 &mdash; Pollution Control &amp; Sensing</option><option>Track 6 &mdash; Ocean &amp; Water Systems</option><option>Track 7 &mdash; Carbon Accounting &amp; LCA</option><option>Track 8 &mdash; Green Computing &amp; AI Ethics</option></select>
</div>
<div class="form-group"><label>Message (optional)</label><textarea name="message" placeholder="Any questions, research areas, or collaboration interests..." rows="3"></textarea></div>'''

SUBMIT_FIELDS = '''<div class="form-row">
  <div class="form-group"><label>Corresponding Author Name <span class="req">*</span></label><input type="text" name="author_name" required/></div>
  <div class="form-group"><label>Email <span class="req">*</span></label><input type="email" name="email" required/></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Institution <span class="req">*</span></label><input type="text" name="institution" required/></div>
  <div class="form-group"><label>Country <span class="req">*</span></label><input type="text" name="country" required/></div>
</div>
<div class="form-group"><label>Paper Title <span class="req">*</span></label><input type="text" name="paper_title" required/></div>
<div class="form-group"><label>Research Track <span class="req">*</span></label>
  <select name="track" required><option value="">Select a track</option><option>Track 1 &mdash; Climate AI &amp; Modelling</option><option>Track 2 &mdash; Precision Agriculture</option><option>Track 3 &mdash; Smart Energy Grids</option><option>Track 4 &mdash; Biodiversity Monitoring</option><option>Track 5 &mdash; Pollution Control &amp; Sensing</option><option>Track 6 &mdash; Ocean &amp; Water Systems</option><option>Track 7 &mdash; Carbon Accounting &amp; LCA</option><option>Track 8 &mdash; Green Computing &amp; AI Ethics</option></select>
</div>
<div class="form-group"><label>Abstract (max 300 words) <span class="req">*</span></label><textarea name="abstract" rows="5" placeholder="Summarise your research, methodology, and key findings..." required></textarea></div>
<div class="form-group"><label>Co-authors (if any)</label><input type="text" name="coauthors" placeholder="Name (Institution), Name (Institution)..."/></div>
<div class="form-group"><label>Keywords</label><input type="text" name="keywords" placeholder="e.g. climate model, deep learning, carbon footprint"/></div>'''

SPEAKER_FIELDS = '''<div class="form-row">
  <div class="form-group"><label>Speaker Name <span class="req">*</span></label><input type="text" name="speaker_name" required/></div>
  <div class="form-group"><label>Email <span class="req">*</span></label><input type="email" name="email" required/></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Institution / Organisation</label><input type="text" name="institution"/></div>
  <div class="form-group"><label>Country</label><input type="text" name="country"/></div>
</div>
<div class="form-group"><label>Expertise / Research Area <span class="req">*</span></label><input type="text" name="expertise" placeholder="e.g. Climate AI, Precision Agriculture, Smart Energy Systems" required/></div>
<div class="form-group"><label>Proposed Talk Title / Topic</label><input type="text" name="talk_title" placeholder="Proposed keynote or session title"/></div>
<div class="form-group"><label>Brief Bio</label><textarea name="bio" rows="4" placeholder="Short professional biography (2-4 sentences)..."></textarea></div>
<div class="form-group"><label>LinkedIn / Website URL</label><input type="text" name="profile_url" placeholder="https://"/></div>
<div class="form-group"><label>Type of Nomination</label>
  <select name="nom_type"><option>Nominating myself</option><option>Nominating someone else</option></select>
</div>'''

COMMITTEE_FIELDS = '''<div class="form-row">
  <div class="form-group"><label>Full Name <span class="req">*</span></label><input type="text" name="name" required/></div>
  <div class="form-group"><label>Email <span class="req">*</span></label><input type="email" name="email" required/></div>
</div>
<div class="form-row">
  <div class="form-group"><label>Institution</label><input type="text" name="institution"/></div>
  <div class="form-group"><label>Designation</label><input type="text" name="designation" placeholder="Professor / Associate Professor / Dr."/></div>
</div>
<div class="form-group"><label>Research Expertise <span class="req">*</span></label><input type="text" name="expertise" placeholder="e.g. Climate AI, Environmental Sensing, Green Computing" required/></div>
<div class="form-group"><label>Role Interested In</label>
  <select name="role"><option>Technical Reviewer</option><option>Track Chair</option><option>Session Chair</option><option>Organising Committee</option><option>Advisory Board</option></select>
</div>
<div class="form-group"><label>Google Scholar / Scopus / ORCID URL</label><input type="text" name="profile_url" placeholder="https://"/></div>
<div class="form-group"><label>Brief Message</label><textarea name="message" rows="3" placeholder="Any specific areas of contribution or questions..."></textarea></div>'''

pages = {
    "interest-form.html": form_page(
        "interest-form.html",
        "Express Interest — ICAES 2026",
        "Register your interest in ICAES 2026 AI for Environmental Sustainability Conference.",
        "", "ICAES 2026", "Express", "Interest",
        "Be first to know when registration opens, dates are announced, and call for papers launches.",
        "interestForm", "Stay in the Loop",
        "Fill in your details and we will notify you when ICAES 2026 milestones are announced.",
        INTEREST_FIELDS, "Register My Interest", "conf_subscribers",
        "Thank you! We will notify you when registration opens and dates are confirmed.",
        extra_script="""
document.getElementById('interestForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const fd=new FormData(this);
  sendEmail('interest',Object.fromEntries(fd.entries())).catch(()=>{});
});"""
    ),

    "submit-paper.html": form_page(
        "submit-paper.html",
        "Submit Paper — ICAES 2026",
        "Submit your research paper to ICAES 2026 AI for Environmental Sustainability.",
        "cfp", "Call for Papers", "Submit Your", "Research Paper",
        "Original, unpublished work across 8 AI and sustainability research tracks.",
        "submitForm", "Paper Submission",
        "Submit your paper details below. Our programme team will contact you with next steps.",
        SUBMIT_FIELDS, "Submit Paper Details", "conf_paper_submissions",
        "Paper details received! Our programme team will review your submission and be in touch with next steps.",
        extra_script="""
document.getElementById('submitForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const fd=new FormData(this);
  sendEmail('paper_submission',Object.fromEntries(fd.entries())).catch(()=>{});
});"""
    ),

    "speaker-form.html": form_page(
        "speaker-form.html",
        "Become a Speaker — ICAES 2026",
        "Apply or nominate a speaker for ICAES 2026.",
        "speakers", "Speakers", "Become a", "Speaker",
        "Apply to present your work at ICAES 2026 or nominate an expert in your network.",
        "speakerForm", "Speaker Application",
        "Share details about yourself or the person you are nominating.",
        SPEAKER_FIELDS, "Submit Application", "conf_speaker_nominations",
        "Thank you for your speaker application! Our programme committee will review and be in touch.",
        extra_script="""
document.getElementById('speakerForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const fd=new FormData(this);
  sendEmail('speaker_nomination',Object.fromEntries(fd.entries())).catch(()=>{});
});"""
    ),

    "committee-form.html": form_page(
        "committee-form.html",
        "Join Committee — ICAES 2026",
        "Apply to join the ICAES 2026 scientific programme committee.",
        "committee", "Committee", "Join the", "Programme Committee",
        "We welcome senior researchers and academics to guide ICAES 2026.",
        "committeeForm", "Committee Application",
        "Apply to serve as a technical reviewer, track chair, or organising committee member.",
        COMMITTEE_FIELDS, "Submit Application", "conf_committee_applications",
        "Thank you! Your committee application has been received and will be reviewed by our organising team.",
        extra_script="""
document.getElementById('committeeForm').addEventListener('submit',async function(e){
  e.preventDefault();
  const fd=new FormData(this);
  sendEmail('committee_application',Object.fromEntries(fd.entries())).catch(()=>{});
});"""
    ),
}

# Simple pages (non-form)
def simple_page(fname, title, desc, active, badge, h1, h1g, sub, body_html):
    return head(title, desc) + nav(active) + hero_html(badge, h1, h1g, sub) + body_html + "\n" + FOOTER + "\n</body></html>"

pages["committee.html"] = simple_page(
    "committee.html", "Committee — ICAES 2026", "ICAES 2026 Programme Committee.",
    "committee", "ICAES 2026", "Programme", "Committee",
    "Guiding ICAES 2026 with expertise in AI and environmental sustainability.",
    '''<section class="section section--white"><div class="container">
  <div style="text-align:center;margin-bottom:3rem;" class="reveal"><div class="section-tag" style="justify-content:center;">Organising Committee</div><h2 class="section-title">Meet the <span class="grad">Committee</span></h2><p class="section-desc" style="margin:0 auto;text-align:center;">Committee nominations are open. We welcome senior researchers from all countries to join the ICAES 2026 scientific programme.</p><a href="/committee-form" class="btn-primary" style="display:inline-flex;margin-top:1.5rem;">Apply to Join Committee &rarr;</a></div>
  <div class="grid-3 stagger-children">
    <div class="card" style="text-align:center;"><div style="width:64px;height:64px;border-radius:50%;background:var(--emerald-soft);border:2px solid var(--emerald-border);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;"><svg width="28" height="28" fill="none" stroke="var(--emerald)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="card__title">General Chair</div><div class="card__body">Nomination in progress. Apply to serve on the ICAES 2026 organising committee.</div></div>
    <div class="card" style="text-align:center;"><div style="width:64px;height:64px;border-radius:50%;background:var(--emerald-soft);border:2px solid var(--emerald-border);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;"><svg width="28" height="28" fill="none" stroke="var(--emerald)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="card__title">Programme Chair</div><div class="card__body">Oversees the scientific programme and double-blind peer review across all 8 research tracks.</div></div>
    <div class="card" style="text-align:center;"><div style="width:64px;height:64px;border-radius:50%;background:var(--emerald-soft);border:2px solid var(--emerald-border);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;"><svg width="28" height="28" fill="none" stroke="var(--emerald)" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="card__title">Publicity Chair</div><div class="card__body">Manages outreach, community engagement, and communications for ICAES 2026.</div></div>
  </div>
</div></section>''')

pages["register.html"] = simple_page(
    "register.html", "Register — ICAES 2026", "Register for ICAES 2026 virtual conference.",
    "", "ICAES 2026", "Register for", "ICAES 2026",
    "Virtual attendance. Registration opens when conference dates are confirmed.",
    '''<section class="section section--white"><div class="container" style="max-width:760px;">
  <div class="reveal" style="text-align:center;margin-bottom:3rem;">
    <div style="padding:2.5rem;border-radius:var(--radius-xl);background:var(--page-alt);border:1px solid var(--card-border);">
      <div style="font-size:2.5rem;margin-bottom:1rem;">🗓️</div>
      <h3 style="font-family:var(--font-head);font-weight:800;font-size:1.3rem;color:var(--text-dark);margin-bottom:.5rem;">Registration Opens Soon</h3>
      <p style="color:var(--text-muted);font-size:15px;line-height:1.7;">Conference dates are being finalised. Registration will open once confirmed. Express your interest to be notified first.</p>
    </div>
    <a href="/interest-form" class="btn-primary" style="display:inline-flex;margin-top:2rem;font-size:15px;padding:14px 32px;">Express Interest &amp; Get Notified &rarr;</a>
  </div>
  <div class="divider"></div>
  <div class="reveal"><h3 class="section-title" style="font-size:1.5rem;margin-bottom:1.5rem;">Registration <span class="grad">Categories</span></h3>
    <div style="display:flex;flex-direction:column;gap:12px;">
      <div style="display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:white;"><span style="color:var(--emerald);font-size:18px;flex-shrink:0;">✓</span><div><strong style="color:var(--text-dark);font-size:14px;">Author Registration</strong><p style="font-size:13.5px;color:var(--text-muted);margin-top:2px;">Required for accepted paper authors to present and be included in ISBN proceedings.</p></div></div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:white;"><span style="color:var(--emerald);font-size:18px;flex-shrink:0;">✓</span><div><strong style="color:var(--text-dark);font-size:14px;">Listener Registration</strong><p style="font-size:13.5px;color:var(--text-muted);margin-top:2px;">Attend keynotes, sessions, and networking events without submitting a paper.</p></div></div>
      <div style="display:flex;gap:12px;align-items:flex-start;padding:14px;border-radius:var(--radius-md);border:1px solid var(--card-border);background:white;"><span style="color:var(--emerald);font-size:18px;flex-shrink:0;">✓</span><div><strong style="color:var(--text-dark);font-size:14px;">Group Discounts</strong><p style="font-size:13.5px;color:var(--text-muted);margin-top:2px;">Groups of 5+ from the same institution receive a discount. Contact us for details.</p></div></div>
    </div>
  </div>
</div></section>''')

pages["sdg.html"] = simple_page(
    "sdg.html", "SDG Impact — ICAES 2026", "ICAES 2026 aligns with UN Sustainable Development Goals.",
    "", "UN SDGs", "SDG", "Impact",
    "ICAES 2026 research contributes to multiple UN Sustainable Development Goals.",
    '''<section class="section section--white"><div class="container">
  <div style="text-align:center;margin-bottom:3rem;" class="reveal"><div class="section-tag" style="justify-content:center;">UN SDGs</div><h2 class="section-title">Research That <span class="grad">Moves the Needle</span></h2><p class="section-desc" style="margin:0 auto;text-align:center;">Every paper submitted to ICAES 2026 contributes to globally recognised sustainability targets. Here is how our 8 research tracks map to the UN SDGs.</p></div>
  <div class="sdg-grid stagger-children">
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#26BDE2;">6</div>Clean Water &amp; Sanitation</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#FCC30B;">7</div>Affordable Clean Energy</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#A21942;">11</div>Sustainable Cities</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#FD9D24;">12</div>Responsible Consumption</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#3F7E44;">13</div>Climate Action</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#0A97D9;">14</div>Life Below Water</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#56C02B;">15</div>Life on Land</div>
    <div class="sdg-pill"><div class="sdg-pill__num" style="background:#19486A;">17</div>Partnerships for Goals</div>
  </div>
  <div style="margin-top:4rem;text-align:center;" class="reveal"><a href="/submit-paper" class="btn-primary" style="font-size:15px;padding:14px 32px;">Submit SDG-Aligned Research &rarr;</a></div>
</div></section>''')

pages["contact.html"] = simple_page(
    "contact.html", "Contact — ICAES 2026", "Contact the ICAES 2026 organising team.",
    "", "Contact Us", "Get in", "Touch",
    "Questions about ICAES 2026? Our team is here to help.",
    '''<section class="section section--white"><div class="container" style="max-width:760px;">
  <div class="grid-2 reveal" style="gap:1.5rem;margin-bottom:3rem;">
    <div class="card"><div style="font-size:1.5rem;margin-bottom:.75rem;">📧</div><div class="card__title">General Enquiries</div><div class="card__body"><a href="mailto:conferences@scholarvault.in" style="color:var(--emerald);font-weight:600;">conferences@scholarvault.in</a></div></div>
    <div class="card"><div style="font-size:1.5rem;margin-bottom:.75rem;">📰</div><div class="card__title">Media Enquiries</div><div class="card__body"><a href="mailto:media@scholarvault.in" style="color:var(--emerald);font-weight:600;">media@scholarvault.in</a></div></div>
    <div class="card"><div style="font-size:1.5rem;margin-bottom:.75rem;">📝</div><div class="card__title">Paper Submissions</div><div class="card__body">Use the <a href="/submit-paper" style="color:var(--emerald);font-weight:600;">Submit Paper form</a> for all manuscript enquiries.</div></div>
    <div class="card"><div style="font-size:1.5rem;margin-bottom:.75rem;">🤝</div><div class="card__title">Partnerships</div><div class="card__body"><a href="mailto:partnerships@scholarvault.in" style="color:var(--emerald);font-weight:600;">partnerships@scholarvault.in</a></div></div>
  </div>
  <div style="text-align:center;" class="reveal"><p style="color:var(--text-muted);font-size:14px;">We aim to respond to all enquiries within 2 business days.</p></div>
</div></section>''')

pages["privacy.html"] = simple_page(
    "privacy.html", "Privacy Policy — ICAES 2026", "ICAES 2026 Privacy Policy.",
    "", "Legal", "Privacy", "Policy", "How ICAES 2026 and ScholarVault handle your data.",
    '''<section class="section section--white"><div class="container" style="max-width:760px;"><div class="reveal" style="font-size:15px;color:var(--text-mid);line-height:1.85;">
  <p style="margin-bottom:1.5rem;"><strong style="color:var(--text-dark);">Last updated: January 2026</strong></p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">1. Information We Collect</h3>
  <p style="margin-bottom:1rem;">We collect information you provide when registering interest, submitting papers, or contacting us — including name, email, institution, and phone number. We also collect standard analytics data through Google Analytics.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">2. How We Use Your Data</h3>
  <p style="margin-bottom:1rem;">Your data is used to communicate conference updates, process registrations, manage paper submissions, and send documents you request. We do not sell your data to third parties.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">3. Data Storage</h3>
  <p style="margin-bottom:1rem;">Data is stored securely on Supabase. We implement appropriate technical and organisational measures to protect your information.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">4. Your Rights</h3>
  <p style="margin-bottom:1rem;">You may request access, correction, or deletion of your data by emailing <a href="mailto:conferences@scholarvault.in" style="color:var(--emerald);">conferences@scholarvault.in</a>.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">5. Contact</h3>
  <p>For privacy concerns: <a href="mailto:conferences@scholarvault.in" style="color:var(--emerald);">conferences@scholarvault.in</a></p>
</div></div></section>''')

pages["refund.html"] = simple_page(
    "refund.html", "Refund Policy — ICAES 2026", "ICAES 2026 refund and cancellation policy.",
    "", "Legal", "Refund", "Policy", "Our refund and cancellation policy for ICAES 2026 registrations.",
    '''<section class="section section--white"><div class="container" style="max-width:760px;"><div class="reveal" style="font-size:15px;color:var(--text-mid);line-height:1.85;">
  <div style="padding:1.5rem;border-radius:var(--radius-lg);background:var(--page-alt);border:1px solid var(--card-border);margin-bottom:2rem;"><p style="font-size:14px;color:var(--text-muted);">Registration for ICAES 2026 has not yet opened. This policy applies once registration is live.</p></div>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">Refund Eligibility</h3>
  <p style="margin-bottom:1rem;">Full refunds are available if requested at least 30 days before the conference. 50% refunds apply 15&ndash;30 days before the conference. No refund is available within 14 days, except in exceptional circumstances.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">Paper Withdrawal</h3>
  <p style="margin-bottom:1rem;">If an accepted paper is withdrawn before the camera-ready deadline, a full registration fee refund will be processed. Post-deadline withdrawals are subject to a 25% processing fee.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">Conference Cancellation</h3>
  <p style="margin-bottom:1rem;">In the unlikely event ICAES 2026 is cancelled, all registrants will receive full refunds within 14 business days.</p>
  <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.2rem;color:var(--text-dark);margin:2rem 0 .75rem;">How to Request</h3>
  <p>Email <a href="mailto:conferences@scholarvault.in" style="color:var(--emerald);">conferences@scholarvault.in</a> with your registration confirmation.</p>
</div></div></section>''')

pages["blog.html"] = simple_page(
    "blog.html", "Blog — ICAES 2026", "ICAES 2026 blog — AI and environmental sustainability insights.",
    "blog", "Blog", "Latest", "Updates", "Conference news, research spotlights, and sustainability AI insights.",
    '''<section class="section section--white"><div class="container">
  <div style="text-align:center;margin-bottom:3rem;" class="reveal"><div class="section-tag" style="justify-content:center;">Blog</div><h2 class="section-title">Insights &amp; <span class="grad">Updates</span></h2></div>
  <div class="grid-3 stagger-children">
    <div class="card"><div style="height:160px;background:linear-gradient(135deg,var(--forest),var(--emerald));border-radius:var(--radius-md);margin-bottom:1.2rem;display:flex;align-items:center;justify-content:center;font-size:3rem;">🌍</div><div style="margin-bottom:.5rem;"><span class="tag tag--green">Announcement</span></div><div class="card__title">ICAES 2026 Announced — Expressions of Interest Now Open</div><div class="card__body">We are excited to announce ICAES 2026, the International Conference on AI for Environmental Sustainability. Expressions of interest are now open.</div></div>
    <div class="card"><div style="height:160px;background:linear-gradient(135deg,var(--forest-2),var(--lime));border-radius:var(--radius-md);margin-bottom:1.2rem;display:flex;align-items:center;justify-content:center;font-size:3rem;">🔬</div><div style="margin-bottom:.5rem;"><span class="tag tag--lime">Research</span></div><div class="card__title">Why AI is the Most Powerful Tool We Have Against Climate Change</div><div class="card__body">From satellite-based deforestation detection to neural climate models, a look at why AI is becoming the front line of environmental defence.</div></div>
    <div class="card"><div style="height:160px;background:linear-gradient(135deg,var(--emerald),#0ea5e9);border-radius:var(--radius-md);margin-bottom:1.2rem;display:flex;align-items:center;justify-content:center;font-size:3rem;">⚡</div><div style="margin-bottom:.5rem;"><span class="tag tag--blue">Track Spotlight</span></div><div class="card__title">Track 3 Deep Dive: How AI is Transforming Smart Energy Grids</div><div class="card__body">Reinforcement learning for grid management, renewable forecasting, and demand response — a closer look at what smart grids mean for net zero.</div></div>
  </div>
</div></section>''')

pages["media.html"] = simple_page(
    "media.html", "Media — ICAES 2026", "Press releases, media kit, and official resources for ICAES 2026.",
    "media", "Media", "Press &amp;", "Media Kit", "Official resources, press releases, and media kit for ICAES 2026.",
    '''<section class="section section--white"><div class="container">
  <div style="text-align:center;margin-bottom:3rem;" class="reveal"><div class="section-tag" style="justify-content:center;">Media Resources</div><h2 class="section-title">Press &amp; <span class="grad">Media Kit</span></h2><p class="section-desc" style="margin:0 auto;text-align:center;">For press enquiries, media partnerships, or to access official ICAES 2026 assets.</p></div>
  <div class="grid-3 stagger-children">
    <div class="card" style="text-align:center;"><div style="font-size:2.5rem;margin-bottom:1rem;">📰</div><div class="card__title">Press Release</div><div class="card__body">Official announcement press release for ICAES 2026. Available for reproduction with attribution.</div><button class="btn-outline" data-download="press" style="margin-top:1rem;border-color:rgba(0,168,120,0.25);color:var(--text-dark);font-size:13px;padding:8px 16px;">Download PDF</button></div>
    <div class="card" style="text-align:center;"><div style="font-size:2.5rem;margin-bottom:1rem;">🎨</div><div class="card__title">Logo &amp; Brand Assets</div><div class="card__body">High-resolution ICAES 2026 logos, banners, and brand guidelines for media use.</div><button class="btn-outline" data-download="branding" style="margin-top:1rem;border-color:rgba(0,168,120,0.25);color:var(--text-dark);font-size:13px;padding:8px 16px;">Download Assets</button></div>
    <div class="card" style="text-align:center;"><div style="font-size:2.5rem;margin-bottom:1rem;">📋</div><div class="card__title">Conference Factsheet</div><div class="card__body">Key facts, dates, scope, and contact information in a single-page factsheet format.</div><button class="btn-outline" data-download="brochure" style="margin-top:1rem;border-color:rgba(0,168,120,0.25);color:var(--text-dark);font-size:13px;padding:8px 16px;">Download PDF</button></div>
  </div>
  <div style="margin-top:3rem;padding:2rem;border-radius:var(--radius-lg);background:var(--page-alt);border:1px solid var(--card-border);text-align:center;" class="reveal">
    <h3 style="font-family:var(--font-head);font-weight:700;font-size:1.1rem;color:var(--text-dark);margin-bottom:.5rem;">Media Enquiries</h3>
    <p style="color:var(--text-muted);font-size:14px;">For interviews, press access, or media partnerships:<br><a href="mailto:media@scholarvault.in" style="color:var(--emerald);font-weight:600;">media@scholarvault.in</a></p>
  </div>
</div></section>
<div class="modal-overlay" id="downloadModal"><div class="modal"><button class="modal__close" onclick="closeModal('downloadModal')">&#x2715;</button><h3 style="font-family:var(--font-head);font-size:1.4rem;font-weight:800;margin-bottom:.4rem;color:var(--text-dark);">Download Resource</h3><p style="font-size:14px;color:var(--text-muted);margin-bottom:1.5rem;">We will send the file to your email.</p><form id="downloadForm"><div class="form-row" style="margin-bottom:.8rem;"><div class="form-group" style="margin-bottom:0;"><label>Name <span class="req">*</span></label><input type="text" name="name" required/></div><div class="form-group" style="margin-bottom:0;"><label>Email <span class="req">*</span></label><input type="email" name="email" required/></div></div><div class="form-group"><label>Institution</label><input type="text" name="institution"/></div><button type="submit" class="form-submit">Send to My Email</button></form></div></div>''')

pages["downloads.html"] = simple_page(
    "downloads.html", "Downloads — ICAES 2026", "Download ICAES 2026 brochures, call for papers, templates, and conference materials.",
    "", "Downloads", "Conference", "Downloads", "Brochures, templates, and official ICAES 2026 materials.",
    '''<section class="section section--white"><div class="container">
  <div style="text-align:center;margin-bottom:3rem;" class="reveal"><div class="section-tag" style="justify-content:center;">Downloads</div><h2 class="section-title">Official <span class="grad">Materials</span></h2></div>
  <div class="grid-4 stagger-children">
    <div class="card" style="text-align:center;"><div style="font-size:2rem;margin-bottom:.75rem;">📘</div><div class="card__title" style="font-size:.95rem;">Conference Brochure</div><div class="card__body" style="font-size:13px;">Overview of ICAES 2026 — tracks, dates, fees, and submission guidelines.</div><button class="btn-primary" data-download="brochure" style="margin-top:1rem;font-size:13px;padding:8px 18px;">Download</button></div>
    <div class="card" style="text-align:center;"><div style="font-size:2rem;margin-bottom:.75rem;">📄</div><div class="card__title" style="font-size:.95rem;">Call for Papers PDF</div><div class="card__body" style="font-size:13px;">Full CFP with all 8 tracks, deadlines, and author guidelines.</div><button class="btn-primary" data-download="cfp" style="margin-top:1rem;font-size:13px;padding:8px 18px;">Download</button></div>
    <div class="card" style="text-align:center;"><div style="font-size:2rem;margin-bottom:.75rem;">📝</div><div class="card__title" style="font-size:.95rem;">Paper Template</div><div class="card__body" style="font-size:13px;">IEEE/Springer-style paper template in Word and LaTeX formats.</div><button class="btn-primary" data-download="template" style="margin-top:1rem;font-size:13px;padding:8px 18px;">Download</button></div>
    <div class="card" style="text-align:center;"><div style="font-size:2rem;margin-bottom:.75rem;">🏅</div><div class="card__title" style="font-size:.95rem;">Verification Report</div><div class="card__body" style="font-size:13px;">ScholarVault Platinum trust audit summary for ICAES 2026.</div><a href="/badge" class="btn-primary" style="margin-top:1rem;font-size:13px;padding:8px 18px;display:inline-flex;">View Report</a></div>
  </div>
</div></section>
<div class="modal-overlay" id="downloadModal"><div class="modal"><button class="modal__close" onclick="closeModal('downloadModal')">&#x2715;</button><h3 style="font-family:var(--font-head);font-size:1.4rem;font-weight:800;margin-bottom:.4rem;color:var(--text-dark);">Download Document</h3><p style="font-size:14px;color:var(--text-muted);margin-bottom:1.5rem;">Enter your details and we will send the file to your email.</p><form id="downloadForm"><div class="form-row" style="margin-bottom:.8rem;"><div class="form-group" style="margin-bottom:0;"><label>Name <span class="req">*</span></label><input type="text" name="name" required/></div><div class="form-group" style="margin-bottom:0;"><label>Email <span class="req">*</span></label><input type="email" name="email" required/></div></div><div class="form-row" style="margin-bottom:.8rem;"><div class="form-group" style="margin-bottom:0;"><label>Phone</label><input type="tel" name="phone"/></div><div class="form-group" style="margin-bottom:0;"><label>Institution</label><input type="text" name="institution"/></div></div><button type="submit" class="form-submit">Send to My Email</button></form></div></div>''')

pages["scholarvault.html"] = simple_page(
    "scholarvault.html", "About ScholarVault — ICAES 2026", "Learn about ScholarVault, the organisation behind ICAES 2026.",
    "", "About", "About", "ScholarVault", "India's first automated academic conference verification platform.",
    '''<section class="section section--white"><div class="container" style="max-width:860px;"><div class="sv-section-grid" style="gap:4rem;align-items:center;">
  <div class="reveal-left">
    <div class="section-tag">ScholarVault</div>
    <h2 class="section-title">The Platform Behind <span class="grad">Conference Trust</span></h2>
    <p style="font-size:16px;color:var(--text-mid);line-height:1.85;margin-bottom:1.5rem;">ScholarVault is India's first automated academic conference verification platform. We exist to help researchers distinguish legitimate academic conferences from high-risk or predatory ones &mdash; protecting the integrity of academic publishing.</p>
    <p style="font-size:16px;color:var(--text-mid);line-height:1.85;margin-bottom:2rem;">Our platform runs 20+ automated and manual checks across organisational identity, committee credentials, payment legitimacy, domain history, content fingerprinting, and more &mdash; generating a transparent, public trust score for each conference.</p>
    <a href="https://scholarvault.in" target="_blank" class="btn-primary" style="background:linear-gradient(135deg,var(--emerald),var(--emerald-light));display:inline-flex;">Visit ScholarVault.in &rarr;</a>
  </div>
  <div class="reveal-right" style="display:flex;align-items:center;justify-content:center;">
    <div style="background:var(--forest);border-radius:var(--radius-xl);padding:2.5rem;max-width:300px;width:100%;text-align:center;border:1px solid rgba(0,168,120,0.3);box-shadow:0 20px 60px rgba(0,168,120,0.15);">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style="margin:0 auto 1rem;"><path d="M12 2L3 6.5V12C3 16.5 7 20.5 12 22C17 20.5 21 16.5 21 12V6.5L12 2Z" fill="#F4CE14" stroke="#F4CE14" stroke-width="0.5"/><path d="M9 12l2 2 4-4" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div style="font-size:1.1rem;font-weight:800;color:white;font-family:var(--font-head);margin-bottom:.25rem;">Scholar<span style="color:#F4CE14;">Vault</span></div>
      <div style="font-size:12px;color:rgba(255,255,255,0.35);margin-bottom:1rem;">UDYAM-TN-02-0457961</div>
      <div style="padding:6px 14px;border-radius:100px;background:rgba(0,168,120,0.15);border:1px solid rgba(0,168,120,0.3);font-size:11.5px;font-weight:700;color:var(--emerald-light);display:inline-block;">Startup India Recognised</div>
    </div>
  </div>
</div></div></section>''')

pages["badge.html"] = simple_page(
    "badge.html", "SV Premium Badge — ICAES 2026", "ICAES 2026 ScholarVault Platinum verification badge — trust score 9.4/10.",
    "", "Verification", "ScholarVault", "Premium Badge", "What our Platinum trust badge means and how it protects researchers.",
    '''<section class="section section--white"><div class="container"><div class="sv-section-grid" style="gap:4rem;">
  <div class="reveal-left">
    <div class="section-tag">About the Badge</div>
    <h2 class="section-title">What Does <span class="grad">Platinum Mean?</span></h2>
    <p style="font-size:16px;color:var(--text-mid);line-height:1.85;margin-bottom:1.5rem;">The ScholarVault Platinum badge means ICAES 2026 has scored 9.0+ out of 10 on our independent trust audit. This is our highest verification tier.</p>
    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:2rem;">
      <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-mid);"><span style="width:22px;height:22px;border-radius:50%;background:rgba(0,168,120,0.1);border:1px solid rgba(0,168,120,0.3);display:flex;align-items:center;justify-content:center;color:var(--emerald);font-size:11px;font-weight:700;flex-shrink:0;">&#10003;</span>20+ automated trust checks passed</div>
      <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-mid);"><span style="width:22px;height:22px;border-radius:50%;background:rgba(0,168,120,0.1);border:1px solid rgba(0,168,120,0.3);display:flex;align-items:center;justify-content:center;color:var(--emerald);font-size:11px;font-weight:700;flex-shrink:0;">&#10003;</span>Organisational identity verified</div>
      <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-mid);"><span style="width:22px;height:22px;border-radius:50%;background:rgba(0,168,120,0.1);border:1px solid rgba(0,168,120,0.3);display:flex;align-items:center;justify-content:center;color:var(--emerald);font-size:11px;font-weight:700;flex-shrink:0;">&#10003;</span>Committee credentials independently reviewed</div>
      <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-mid);"><span style="width:22px;height:22px;border-radius:50%;background:rgba(0,168,120,0.1);border:1px solid rgba(0,168,120,0.3);display:flex;align-items:center;justify-content:center;color:var(--emerald);font-size:11px;font-weight:700;flex-shrink:0;">&#10003;</span>Payment gateway legitimacy confirmed</div>
      <div style="display:flex;align-items:center;gap:10px;font-size:14px;color:var(--text-mid);"><span style="width:22px;height:22px;border-radius:50%;background:rgba(0,168,120,0.1);border:1px solid rgba(0,168,120,0.3);display:flex;align-items:center;justify-content:center;color:var(--emerald);font-size:11px;font-weight:700;flex-shrink:0;">&#10003;</span>Zero high-risk signals detected</div>
    </div>
    <a href="https://scholarvault.in" target="_blank" class="btn-primary" style="background:linear-gradient(135deg,var(--emerald),var(--emerald-light));display:inline-flex;">Verify on ScholarVault &rarr;</a>
  </div>
  <div class="reveal-right" style="display:flex;align-items:center;justify-content:center;">
    <div style="background:var(--forest);border-radius:var(--radius-xl);padding:2.5rem;max-width:300px;width:100%;text-align:center;border:1px solid rgba(0,168,120,0.3);box-shadow:0 20px 60px rgba(0,168,120,0.15);">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" style="margin:0 auto 1rem;"><path d="M12 2L3 6.5V12C3 16.5 7 20.5 12 22C17 20.5 21 16.5 21 12V6.5L12 2Z" fill="#F4CE14" stroke="#F4CE14" stroke-width="0.5"/><path d="M9 12l2 2 4-4" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:.12em;margin-bottom:.5rem;">ScholarVault</div>
      <div style="font-size:3.5rem;font-weight:900;color:#00D1FF;font-family:var(--font-head);line-height:1;">9.4</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.4);margin:.5rem 0 1rem;">Trust Score / 10</div>
      <div style="padding:6px 16px;border-radius:100px;background:rgba(0,209,255,0.1);border:1px solid rgba(0,209,255,0.3);font-size:12px;font-weight:700;color:#00D1FF;display:inline-block;">PLATINUM VERIFIED</div>
    </div>
  </div>
</div></div></section>''')

written = 0
for fname, content in pages.items():
    path = os.path.join(dest, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"OK {fname} ({len(content)} chars)")
    written += 1

print(f"\nTotal written: {written} files")

# Final check
all_files = [f for f in os.listdir(dest) if f.endswith('.html')]
print(f"Total HTML files in greentech: {len(all_files)}")
for f in sorted(all_files):
    print(f"  {f}")
