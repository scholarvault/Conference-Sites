import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const config = JSON.parse(fs.readFileSync(path.join(root, "shared", "site-config.json"), "utf8"));

const navItems = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["call-for-papers.html", "Call for Papers"],
  ["speakers.html", "Speakers"],
  ["committee.html", "Committee"],
  ["register.html", "Register"],
  ["awards.html", "Awards"],
  ["blog.html", "Blog"],
  ["contact.html", "Contact"]
];

const activeParent = {
  "submit-paper.html": "call-for-papers.html",
  "speaker-form.html": "speakers.html",
  "committee-form.html": "committee.html",
  "interest-form.html": "index.html",
  "downloads.html": "index.html",
  "media.html": "index.html",
  "privacy.html": "index.html",
  "refund.html": "index.html",
  "badge.html": "index.html"
};

function isActive(page, target) {
  return (activeParent[page] || page) === target ? " active" : "";
}

function header(page) {
  const desktop = navItems.map(([href, label]) =>
    `        <a href="${href}" class="navbar__link${isActive(page, href)}">${label}</a>`
  ).join("\n");
  const mobile = navItems.map(([href, label]) =>
    `    <a href="${href}" class="${isActive(page, href).trim()}">${label}</a>`
  ).join("\n");
  return `<!-- GENERATED: edit shared/site-config.json or tools/build-shared-shell.mjs -->
  <div class="navbar__banner">
    <span>Virtual Summit &bull; ${config.eventDate} &bull; Call for Abstracts Open</span>
  </div>

  <header class="navbar" id="navbar">
    <div class="navbar__inner">
      <a class="navbar__logo" href="index.html" aria-label="${config.shortName} home">
        <img src="assets/icon-512.png" alt="ScholarVault" />
        <div class="navbar__logo-text">
          <strong>${config.brandLine1}</strong>
          <span>${config.brandLine2}</span>
        </div>
      </a>
      <nav class="navbar__links" aria-label="Primary navigation">
${desktop}
      </nav>
      <div class="navbar__cta">
        <button class="btn btn-outline btn-sm" type="button" onclick="openInterestModal()">Express Interest</button>
        <a class="btn btn-primary btn-sm" href="register.html" data-scholarvault-action="register">Register Now <i data-lucide="arrow-right"></i></a>
      </div>
      <button class="navbar__hamburger" id="hamburger" type="button" aria-label="Toggle navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </header>

  <nav class="navbar__mobile" id="mobileMenu" aria-label="Mobile navigation">
${mobile}
    <button type="button" onclick="openInterestModal()">Express Interest</button>
    <a href="register.html" class="btn btn-primary" data-scholarvault-action="register">Register Now</a>
  </nav>`;
}

function footer() {
  const social = [
    ["assets/Social/instagram.png", "Instagram", config.social.instagram, "IG"],
    ["assets/Social/facebook (1).png", "Facebook", config.social.facebook, "f"],
    ["assets/Social/linkedin.png", "LinkedIn", config.social.linkedin, "in"],
    ["assets/Social/icons8-reddit-24.png", "Reddit", config.social.reddit, "r/"],
    ["assets/Social/pinterest.svg", "Pinterest", config.social.pinterest, "P"],
    ["assets/Social/icons8-x-48.png", "X", config.social.x, "X"],
    ["assets/Social/social.png", "WhatsApp", config.social.whatsapp, "WA"],
    ["assets/Social/telegram.png", "Telegram", config.social.telegram, "TG"]
  ].map(([icon, label, href, fallback]) => {
    const mark = icon
      ? `<span class="social-icon" aria-hidden="true"><img src="${icon}" alt="" /></span>`
      : `<span aria-hidden="true">${fallback}</span>`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="ScholarVault on ${label}" title="${label}">${mark}<span class="sr-only">${label}</span></a>`;
  }).join("\n              ");
  return `<footer class="footer">
    <!-- GENERATED: edit shared/site-config.json or tools/build-shared-shell.mjs -->
    <div class="site-shell">
      <div class="footer__grid">
        <div class="footer__brand">
          <div class="navbar__logo-text"><strong style="font-size:1.3rem">${config.brandLine1}</strong><span>${config.brandLine2}</span></div>
          <p>ScholarVault Research Integrity &amp; Responsible AI Summit 2026 is an international virtual forum advancing ethical governance, algorithmic accountability, and reproducible science.</p>
          <div class="footer__organizer"><img class="organizer-mark" src="assets/icon-512.png" alt="ScholarVault" /><div><span>Organised by</span><strong>ScholarVault Conferences</strong></div></div>
          <a class="footer__assessment" href="badge.html"><i data-lucide="shield-check"></i><span><strong>SCVS assessment</strong><small>Assessment pending &middot; verification is never self-declared</small></span></a>
        </div>
        <div class="footer__col"><strong>Conference</strong><a href="about.html">About Summit</a><a href="call-for-papers.html">Call for Papers</a><a href="speakers.html">Speakers</a><a href="committee.html">Committee</a><a href="awards.html">Summit Awards</a><a href="blog.html">Insights &amp; Blog</a></div>
        <div class="footer__col"><strong>Participate</strong><button type="button" onclick="openInterestModal()">Express Interest</button><a href="submit-paper.html" data-scholarvault-action="submit">Submit Abstract</a><a href="speaker-form.html">Apply as Speaker</a><a href="committee-form.html">Join Committee</a><a href="register.html">Register Delegate</a></div>
        <div class="footer__col"><strong>Information</strong><a href="downloads.html">Brochure &amp; Downloads</a><a href="media.html">Media &amp; Press</a><a href="privacy.html">Privacy Policy</a><a href="refund.html">Refund Policy</a><a href="contact.html">Contact Us</a></div>
      </div>
      <div class="footer__social-block">
        <nav class="social-links" aria-label="ScholarVault social media">
              ${social}
        </nav>
      </div>
      <div class="footer__trust">
        <div class="footer__payment-methods"><img src="assets/Visa Inc._idDUM8TcN7_1.png" alt="Visa" /><img src="assets/Mastercard_Symbol_1.png" alt="Mastercard" /><img src="assets/idzRNcC9U5_logos.png" alt="BHIM UPI" /><img class="payment-logo payment-logo--gpay" src="assets/gpay-logo.png" alt="Google Pay" /></div>
        <div class="footer__protection"><img class="protection-logo protection-logo--website" src="assets/idITJgioup_logos.png" alt="Website Protection" /><img class="protection-logo protection-logo--msme" src="assets/idUAcNCLcQ_logos.png" alt="MSME registration" /><img src="assets/App QR.png" alt="ScholarVault QR code" /></div>
      </div>
      <div class="footer__bottom"><p>&copy; 2026 SVRIAS &bull; ScholarVault. All rights reserved.</p><div class="footer__bottom-links"><a href="privacy.html">Privacy Policy</a><a href="refund.html">Refund Policy</a><a href="contact.html">Contact Desk</a></div></div>
    </div>
  </footer>
  <button class="social-dock-toggle" id="socialDockToggle" type="button" aria-label="Open contact and support" aria-expanded="false" aria-controls="socialDock"><i data-lucide="message-circle-question" aria-hidden="true"></i><span>Support</span></button>
  <aside class="social-dock" id="socialDock" aria-label="Contact and support">
    <div class="social-dock__head"><strong>Contact &amp; Support</strong><button type="button" id="socialDockClose" aria-label="Close contact and support"><i data-lucide="x"></i></button></div>
    <a class="support-email" href="mailto:conferences@scholarvault.in" aria-label="Email the ScholarVault Conference Desk" title="Conference Desk email"><i data-lucide="mail" aria-hidden="true"></i><span>Conference Desk</span></a>
    <div class="social-links social-links--dock">${social}</div>
  </aside>`;
}

const htmlFiles = fs.readdirSync(root).filter((name) => name.endsWith(".html") && !["brochure.html", "poster.html"].includes(name));
for (const file of htmlFiles) {
  const target = path.join(root, file);
  let html = fs.readFileSync(target, "utf8");
  html = html.replaceAll("https://svrias2026.scholarvault.in", config.canonicalOrigin);
  html = html.replace(/<body(?:\s[^>]*)?>/i, `<body data-site-page="${file}">`);
  const shellPattern = html.includes("<!-- GENERATED: edit shared/site-config.json")
    ? /<!-- GENERATED:[\s\S]*?-->[\s\S]*?<nav class="navbar__mobile"[\s\S]*?<\/nav>/i
    : /<!-- Top Announcement Banner -->[\s\S]*?<!-- Mobile Menu Drawer -->[\s\S]*?<\/nav>/i;
  if (!shellPattern.test(html)) throw new Error(`Shared header boundary not found in ${file}`);
  html = html.replace(shellPattern, header(file));
  const footerPattern = /<footer class="footer">[\s\S]*?<\/footer>(?:\s*<button class="social-dock-toggle"[\s\S]*?<\/aside>)*/i;
  if (!footerPattern.test(html)) throw new Error(`Footer not found in ${file}`);
  html = html.replace(footerPattern, footer());
  html = html.replace(/\s*<script[^>]+conference-embed\.js[^>]*><\/script>/gi, "");
  html = html.replace(
    '<script src="js/main.js"></script>',
    `<script src="${config.appOrigin}/conference-embed.js" data-conference="${config.slug}" data-origin="${config.appOrigin}"></script>\n  <script src="js/main.js"></script>`
  );
  fs.writeFileSync(target, html, "utf8");
}

const stale = htmlFiles.flatMap((file) => {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const errors = [];
  if (html.includes("svrias2026.scholarvault.in")) errors.push("old domain");
  if (!html.includes("conference-embed.js")) errors.push("connector missing");
  if (!html.includes("GENERATED: edit shared/site-config.json")) errors.push("generated shell missing");
  return errors.map((error) => `${file}: ${error}`);
});
if (stale.length) throw new Error(stale.join("\n"));
console.log(`Generated shared shell for ${htmlFiles.length} SVRIAS pages.`);




