const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const site = {
  name: "ICAES 2026",
  fullName: "International Conference on AI for Environmental Sustainability",
  shortTag: "AI for Environmental Sustainability",
  domain: "https://greentech.scholarvault.in",
  year: "2026",
  dateLine: "Q4 2026 - dates announced soon",
  format: "100% virtual / online",
  trustScore: "9.4 / 10",
  badgeTier: "Platinum verified",
  brochureEmail: "conferences@scholarvault.in",
};

const nav = [
  ["index", "Home"],
  ["about", "About"],
  ["call-for-papers", "Call for Papers"],
  ["speakers", "Speakers"],
  ["committee", "Committee"],
  ["awards", "Awards"],
  ["blog", "Blog"],
  ["media", "Media"],
];

const tracks = [
  ["Track 1", "Climate AI & Modelling", "Neural networks for climate prediction, extreme weather forecasting, sea-level simulation, and atmospheric data analysis."],
  ["Track 2", "Precision Agriculture", "Crop monitoring, soil health analysis, drone inspection, irrigation optimisation, and food security."],
  ["Track 3", "Smart Energy Grids", "Reinforcement learning for grid management, renewable forecasting, demand response, EV integration, and microgrids."],
  ["Track 4", "Biodiversity Monitoring", "Computer vision for species identification, acoustic AI, satellite imagery, and ecosystem mapping."],
  ["Track 5", "Pollution Control & Sensing", "IoT and AI for air and water quality, industrial emissions monitoring, and remediation planning."],
  ["Track 6", "Ocean & Water Systems", "Marine biodiversity, autonomous water systems, coral reef monitoring, and water resource management."],
  ["Track 7", "Carbon Accounting & LCA", "Lifecycle assessment, emissions automation, carbon credit verification, and net-zero pathways."],
  ["Track 8", "Green Computing & AI Ethics", "Efficient AI architectures, sustainable data centres, federated conservation AI, and governance."],
];

const whyAttend = [
  ["Global Research Network", "Meet climate scientists, environmental engineers, AI researchers, and policy makers across a virtual global format."],
  ["ISBN Proceedings", "Accepted papers are published in ISBN-registered proceedings for a durable, citable record of your work."],
  ["Best Paper Awards", "Recognition for best paper, best presentation, and outstanding reviewer contributions across the programme."],
  ["High Visibility", "Selected content is amplified through ScholarVault's academic network for additional discovery and reach."],
  ["Expert Keynotes", "Hear from invited voices in climate AI, environmental policy, sustainability engineering, and green tech."],
  ["Verified & Trusted", "ICAES 2026 is ScholarVault Platinum verified for transparency, academic integrity, and legitimacy."],
];

const sdgs = [
  ["6", "Clean Water", "AI systems for water quality, monitoring, reuse, and equitable access."],
  ["7", "Clean Energy", "Smart grids, forecasting, storage optimisation, and renewable integration."],
  ["11", "Sustainable Cities", "Urban sensing, mobility, resilience, and climate-informed planning."],
  ["12", "Responsible Consumption", "Lifecycle intelligence, waste reduction, and supply-chain carbon tracking."],
  ["13", "Climate Action", "Climate modelling, disaster forecasting, adaptation, and mitigation analytics."],
  ["14", "Life Below Water", "Marine observation, reef monitoring, fisheries intelligence, and ocean health."],
  ["15", "Life on Land", "Biodiversity protection, habitat modelling, and restoration intelligence."],
  ["17", "Partnerships", "Cross-sector collaboration between research, policy, NGOs, and industry."],
];

const homeFaq = [
  ["When will the final dates be announced?", "ICAES 2026 is currently accepting expressions of interest while the final Q4 2026 programme dates are being confirmed. Subscribers and interested delegates will receive the date announcement first."],
  ["Is the conference fully virtual?", "Yes. ICAES 2026 is designed as a 100% virtual international conference with online keynotes, paper sessions, networking, and digital proceedings."],
  ["Will the proceedings have an ISBN?", "Yes. Accepted papers will be published in ISBN-registered proceedings, subject to peer review and final camera-ready compliance."],
  ["Who can participate?", "Researchers, postgraduate students, faculty members, sustainability practitioners, environmental engineers, policy professionals, NGOs, and innovation teams are welcome."],
  ["Are all eight tracks open for submission?", "Yes. The conference is built around eight specialist tracks spanning climate modelling, agriculture, energy, biodiversity, water systems, pollution, carbon accounting, and green computing."],
  ["What does ScholarVault Platinum verification mean?", "It signals that the conference has passed ScholarVault's legitimacy and transparency checks covering organisational identity, fee clarity, refund policy, and predatory risk indicators."],
];

const footerGroups = [
  {
    title: "Conference",
    links: [
      ["about", "About"],
      ["call-for-papers", "Call for Papers"],
      ["speakers", "Speakers"],
      ["committee", "Committee"],
      ["awards", "Awards"],
    ],
  },
  {
    title: "Participate",
    links: [
      ["interest-form", "Express Interest"],
      ["submit-paper", "Submit Paper"],
      ["speaker-form", "Become a Speaker"],
      ["committee-form", "Join Committee"],
      ["register", "Register"],
    ],
  },
  {
    title: "Information",
    links: [
      ["downloads", "Downloads"],
      ["media", "Media"],
      ["badge", "Verification"],
      ["privacy", "Privacy"],
      ["refund", "Refund"],
    ],
  },
];

function write(rel, content) {
  const target = path.join(root, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.replace(/\n {8}/g, "\n").trim() + "\n");
}

function localizePaths(html) {
  return html
    .replace(/href="\/"/g, 'href="index.html"')
    .replace(/href="\/([a-z-]+)"/g, (_, slug) => `href="${slug}.html"`)
    .replace(/href="\/css\/style\.css"/g, 'href="css/style.css"')
    .replace(/src="\/js\/main\.js"/g, 'src="js/main.js"')
    .replace(/src="\/assets\//g, 'src="assets/')
    .replace(/href="\/assets\//g, 'href="assets/');
}

function attr(value) {
  return String(value).replace(/"/g, "&quot;");
}

function navMarkup(active) {
  return nav.map(([href, label]) => `<a href="${href === "index" ? "/" : `/${href}`}" class="navbar__link${active === href ? " active" : ""}">${label}</a>`).join("");
}

function mobileNavMarkup(active) {
  return nav.map(([href, label]) => `<a href="${href === "index" ? "/" : `/${href}`}" class="${active === href ? "active" : ""}">${label}</a>`).join("");
}

function header(active, light = false) {
  return `
    <header class="navbar${light ? " navbar--light" : ""}" id="navbar">
      <div class="navbar__inner">
        <a class="navbar__logo" href="/">
          <img class="navbar__logo-mark" src="/assets/icaes-mark.svg" alt="${site.name}" />
          <div class="navbar__logo-text">
            <strong>${site.name}</strong>
            <span>${site.shortTag}</span>
          </div>
        </a>
        <nav class="navbar__links">${navMarkup(active)}</nav>
        <div class="navbar__cta">
          <a class="btn-outline" href="/interest-form">Express Interest</a>
          <a class="btn-primary" href="/register">Get Notified</a>
        </div>
        <button class="navbar__hamburger" id="hamburger" aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <nav class="navbar__mobile" id="mobileMenu">${mobileNavMarkup(active)}<a href="/interest-form">Express Interest</a><a href="/register">Register</a></nav>
  `;
}

function footer() {
  const groups = footerGroups.map((group) => `
    <div class="footer__col">
      <strong>${group.title}</strong>
      ${group.links.map(([href, label]) => `<a href="/${href}">${label}</a>`).join("")}
    </div>
  `).join("");
  return `
    <footer class="footer">
      <div class="footer__grid">
        <div class="footer__brand">
          <img src="/assets/icaes-logo.svg" alt="${site.name}" style="width:min(280px,100%);" />
          <p>${site.fullName}. A virtual global forum exploring how Artificial Intelligence is shaping climate resilience, biodiversity intelligence, green infrastructure, and sustainable systems.</p>
          <p>Organised by ScholarVault. ${site.badgeTier}. ${site.format}. Proceedings with ISBN.</p>
        </div>
        ${groups}
      </div>
      <div class="footer__bottom">
        <span>&copy; ${site.year} ICAES. Organised by ScholarVault. All rights reserved.</span>
        <span><a href="/privacy">Privacy Policy</a> - <a href="/refund">Refund Policy</a> - <a href="/contact">Contact</a></span>
      </div>
    </footer>
  `;
}

function downloadModal() {
  return `
    <div class="modal-overlay" id="downloadModal">
      <div class="modal-panel">
        <div>
          <div class="eyebrow eyebrow--light">Resource Delivery</div>
          <h3 style="margin:14px 0 6px;font-family:var(--font-display);font-size:1.8rem;">Get the latest ICAES file</h3>
          <p class="section-lead" style="margin:0;">Share your details and we will send the requested conference resource to your inbox.</p>
        </div>
        <form id="downloadForm" class="form-grid form-grid--single">
          <div class="field"><label>Name</label><input name="name" required placeholder="Your full name" /></div>
          <div class="field"><label>Email</label><input name="email" type="email" required placeholder="name@institution.edu" /></div>
          <div class="field"><label>Institution</label><input name="institution" placeholder="University / Organisation" /></div>
          <div class="field"><label>Phone</label><input name="phone" placeholder="Optional phone number" /></div>
          <button class="btn-primary form-submit" type="submit">Send the resource</button>
        </form>
      </div>
    </div>
  `;
}

function head(slug, title, description) {
  const url = slug === "index" ? site.domain : `${site.domain}/${slug}`;
  return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${attr(description)}" />
    <meta name="theme-color" content="#081210" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${attr(title)}" />
    <meta property="og:description" content="${attr(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${site.domain}/assets/og-image.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(title)}" />
    <meta name="twitter:description" content="${attr(description)}" />
    <meta name="twitter:image" content="${site.domain}/assets/og-image.svg" />
  `;
}

function shell({ slug, title, description, active = "", lightNav = false, extraHead = "", body = "", extraScripts = "", includeHls = false }) {
  return `
<!doctype html>
<html lang="en">
<head>
${head(slug, title, description)}
${extraHead}
</head>
<body>
${header(active, lightNav)}
${body}
${footer()}
${downloadModal()}
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://unpkg.com/lucide@latest"></script>
${includeHls ? '<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>' : ""}
<script src="/js/main.js"></script>
${extraScripts}
</body>
</html>
  `;
}

function pageHero(eyebrow, title, description) {
  return `
    <section class="page-hero">
      <div class="page-hero__lightcone"></div>
      <div class="page-hero__inner reveal">
        <div class="breadcrumbs"><span>ICAES 2026</span><span>/</span><span>${eyebrow}</span></div>
        <div class="eyebrow">${eyebrow}</div>
        <h1 class="page-hero__title">${title}</h1>
        <p class="page-hero__desc">${description}</p>
      </div>
    </section>
  `;
}

function cards(items, className = "card", icon = "sparkles") {
  return items.map(([title, body]) => `
    <article class="${className} reveal-up">
      <div class="icon-badge"><i data-lucide="${icon}"></i></div>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join("");
}

function trackCards() {
  return tracks.map(([num, title, body]) => `
    <article class="track-card reveal-up">
      <div class="track-card__num">${num.replace("Track ", "")}</div>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join("");
}

function sdgCards() {
  return sdgs.map(([num, title, body]) => `
    <article class="card reveal-up">
      <div class="card-tag">SDG ${num}</div>
      <h3>${title}</h3>
      <p>${body}</p>
    </article>
  `).join("");
}

function faqMarkup(items) {
  return items.map(([q, a]) => `
    <div class="faq-item reveal-up">
      <button type="button" aria-expanded="false">
        <span>${q}</span>
        <span class="faq-item__icon"><i data-lucide="plus"></i></span>
      </button>
      <div class="faq-item__body"><p>${a}</p></div>
    </div>
  `).join("");
}

const subscribeStrip = `
  <section class="newsletter-strip">
    <div class="newsletter-shell reveal">
      <div>
        <div class="eyebrow">Stay in the loop</div>
        <h2 class="section-title" style="max-width:13ch;margin-top:16px;">Dates, keynote names, and CFP milestones <span>first</span>.</h2>
        <p class="section-lead" style="color:var(--white-64);margin-top:12px;">Subscribe once and we'll send only the high-signal updates for ICAES 2026.</p>
      </div>
      <form class="newsletter-form" data-subscribe-form>
        <input name="name" placeholder="Your name" />
        <input name="email" type="email" required placeholder="Email address" />
        <button class="btn-primary" type="submit">Subscribe</button>
      </form>
    </div>
  </section>
`;

const resourceCards = [
  ["Conference brochure", "Overview of the summit vision, audience, tracks, and publication model.", "brochure"],
  ["Call for papers kit", "CFP summary and key submission directions for authors and co-authors.", "cfp"],
  ["Paper template", "Author template and formatting structure for camera-ready preparation.", "template"],
  ["Media kit", "Press-facing copy, conference description, and brand graphics summary.", "media"],
  ["Verification overview", "ScholarVault verification summary and trust-positioning notes.", "badge"],
];

const formScripts = {
  interest: `
    <script>
      const interestWrap = document.getElementById("interestWrap");
      const interestForm = document.getElementById("interestForm");
      if (interestForm) {
        interestForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(interestForm).entries());
          try {
            window.SVSite.setFormLoading(interestWrap, true);
            await window.SVSite.insertRecord("conf_interest", {
              name: data.name, email: data.email, role: data.role, country: data.country, interest: data.interest, notes: data.notes
            });
            await window.SVSite.sendEmail("interest", { name: data.name, email: data.email, role: data.role, country: data.country });
            if (data.subscribe_updates) {
              try {
                await window.SVSite.insertRecord("conf_subscribers", { email: data.email, name: data.name || "Subscriber" });
              } catch (error) {}
            }
            window.SVSite.showFormSuccess(interestWrap);
          } catch (error) {
            window.SVSite.showToast("Could not submit your interest. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(interestWrap, false);
          }
        });
      }
    </script>
  `,
  paper: `
    <script>
      const paperWrap = document.getElementById("paperWrap");
      const paperForm = document.getElementById("paperForm");
      if (paperForm) {
        paperForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(paperForm).entries());
          const file = document.getElementById("paperFile").files[0];
          try {
            window.SVSite.setFormLoading(paperWrap, true, "Uploading paper...");
            let paperUrl = "";
            if (file) {
              paperUrl = await window.SVSite.uploadFile("conf-papers", file, "greentech");
            }
            await window.SVSite.insertRecord("conf_paper_submissions", {
              name: data.name, email: data.email, institution: data.institution, country: data.country,
              title: data.title, track: data.track, keywords: data.keywords, abstract: data.abstract,
              paper_url: paperUrl, status: "submitted"
            });
            await window.SVSite.sendEmail("paper_submission", {
              name: data.name, email: data.email, institution: data.institution, title: data.title, track: data.track
            });
            window.SVSite.showFormSuccess(paperWrap);
          } catch (error) {
            window.SVSite.showToast("Paper submission failed. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(paperWrap, false);
          }
        });
      }
    </script>
  `,
  speaker: `
    <script>
      const speakerWrap = document.getElementById("speakerWrap");
      const speakerForm = document.getElementById("speakerForm");
      if (speakerForm) {
        speakerForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(speakerForm).entries());
          const photo = document.getElementById("speakerPhoto").files[0];
          try {
            window.SVSite.setFormLoading(speakerWrap, true, "Sending application...");
            let photoUrl = "";
            if (photo) {
              photoUrl = await window.SVSite.uploadFile("conf-speakers", photo, "greentech");
            }
            await window.SVSite.insertRecord("conf_speakers", {
              name: data.name, email: data.email, institution: data.institution, designation: data.designation,
              topic: data.topic, talk_type: data.talk_type, speaker_bio: data.speaker_bio, photo_url: photoUrl, status: "pending"
            });
            await window.SVSite.sendEmail("speaker_application", {
              name: data.name, email: data.email, institution: data.institution, designation: data.designation, topic: data.topic, talk_type: data.talk_type
            });
            window.SVSite.showFormSuccess(speakerWrap);
          } catch (error) {
            window.SVSite.showToast("Speaker application failed. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(speakerWrap, false);
          }
        });
      }
    </script>
  `,
  committee: `
    <script>
      const committeeWrap = document.getElementById("committeeWrap");
      const committeeForm = document.getElementById("committeeForm");
      if (committeeForm) {
        committeeForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(committeeForm).entries());
          try {
            window.SVSite.setFormLoading(committeeWrap, true);
            await window.SVSite.insertRecord("conf_committee", {
              name: data.name, email: data.email, designation: data.designation, institution: data.institution,
              country: data.country, expertise: data.expertise, statement: data.statement, status: "pending"
            });
            await window.SVSite.sendEmail("committee_application", {
              name: data.name, email: data.email, designation: data.designation, institution: data.institution, expertise: data.expertise
            });
            window.SVSite.showFormSuccess(committeeWrap);
          } catch (error) {
            window.SVSite.showToast("Committee application failed. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(committeeWrap, false);
          }
        });
      }
    </script>
  `,
  awards: `
    <script>
      const awardsWrap = document.getElementById("awardsWrap");
      const awardsForm = document.getElementById("awardsForm");
      if (awardsForm) {
        awardsForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(awardsForm).entries());
          try {
            window.SVSite.setFormLoading(awardsWrap, true);
            await window.SVSite.insertRecord("conf_awards", data);
            await window.SVSite.sendEmail("award_nomination", data);
            window.SVSite.showFormSuccess(awardsWrap);
          } catch (error) {
            window.SVSite.showToast("Nomination failed. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(awardsWrap, false);
          }
        });
      }
    </script>
  `,
  contact: `
    <script>
      const contactWrap = document.getElementById("contactWrap");
      const contactForm = document.getElementById("contactForm");
      if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(contactForm).entries());
          try {
            window.SVSite.setFormLoading(contactWrap, true);
            await window.SVSite.insertRecord("conf_contact", data);
            await window.SVSite.sendEmail("contact", data);
            if (data.subscribe_updates) {
              try {
                await window.SVSite.insertRecord("conf_subscribers", { email: data.email, name: data.name || "Subscriber" });
              } catch (error) {}
            }
            window.SVSite.showFormSuccess(contactWrap);
          } catch (error) {
            window.SVSite.showToast("Message could not be sent. Please try again.", "error");
          } finally {
            window.SVSite.setFormLoading(contactWrap, false);
          }
        });
      }
    </script>
  `,
  register: `
    <script>
      const registerForm = document.getElementById("registrationForm");
      const successState = document.getElementById("registerSuccess");
      const productMap = {
        INR: { student: "pdt_0Nd5kUGj8inKqSbyRdiVK", faculty: "pdt_0Nd5kYgKTGfwBr2VCG9Y9", listener: "pdt_0Nd5khVR6xzYWKMn2CiPn", coauthor: "pdt_0Nd5kme4fOVnzmFhWGdfD" },
        USD: { student: "pdt_0Nd5mroA8YckMQG8DFVpq", faculty: "pdt_0Nd5mvbsjDzSK9eeKrn95", listener: "pdt_0Nd5oPQ5Pg5BpH35V79ry", coauthor: "pdt_0Nd5oUQJh9bYUQYMFtlaL" }
      };
      const priceMap = {
        INR: { student: 1999, faculty: 2999, listener: 999, coauthor: 1999 },
        USD: { student: 49, faculty: 89, listener: 29, coauthor: 49 }
      };
      if (new URLSearchParams(location.search).get("payment") === "success" && successState) {
        successState.classList.add("show");
      }
      if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
          event.preventDefault();
          const data = Object.fromEntries(new FormData(registerForm).entries());
          const currency = window.SVSite.getCurrency();
          const tier = data.category;
          if (!tier) {
            window.SVSite.showToast("Please select a delegate category.", "error");
            return;
          }
          try {
            window.SVSite.setFormLoading(registerForm.parentElement, true, "Preparing checkout...");
            await window.SVSite.insertRecord("conf_registrations", {
              name: data.name, email: data.email, phone: data.phone, institution: data.institution,
              designation: data.designation, country: data.country, category: tier, tier: "standard",
              amount: priceMap[currency][tier], currency, status: "pending"
            });
            const product = productMap[currency][tier];
            const email = encodeURIComponent(data.email);
            const returnUrl = encodeURIComponent(window.SVSite.config.rootUrl + "/register?payment=success");
            location.href = "https://checkout.dodopayments.com/buy/" + product + "?customer_email=" + email + "&return_url=" + returnUrl;
          } catch (error) {
            window.SVSite.showToast("Could not start checkout. Please try again.", "error");
            window.SVSite.setFormLoading(registerForm.parentElement, false);
          }
        });
      }
    </script>
  `,
};

const pages = {
  index: shell({
    slug: "index",
    title: `${site.name} - ${site.fullName} | ScholarVault`,
    description: "Premium multi-page conference website for ICAES 2026, a virtual global summit on AI for Environmental Sustainability.",
    active: "index",
    includeHls: true,
    body: `
      <section class="hero">
        <div class="hero__media">
          <video class="hero__video" data-hero-video data-src="https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8" poster="/assets/hero-poster.svg" muted playsinline loop></video>
          <img class="hero__poster" src="/assets/hero-poster.svg" alt="${site.name} hero backdrop" />
          <div class="hero__overlay"></div>
          <div class="hero__lightcone"></div>
          <div class="hero__grid"></div>
          <div class="hero__noise"></div>
          <canvas class="hero__canvas" id="heroCanvas"></canvas>
          <div class="hero__spotlight"></div>
        </div>
        <div class="hero__content">
          <div class="hero__copy reveal">
            <div class="eyebrow">Accepting expressions of interest - Q4 2026</div>
            <div class="hero__kicker">International Conference on</div>
            <h1 class="hero__title">AI for <span>Environmental</span> Sustainability</h1>
            <p class="hero__desc">ICAES 2026 brings together climate scientists, AI researchers, environmental engineers, and policy makers to explore how Artificial Intelligence is transforming our response to the planetary crisis - from precision agriculture and smart energy grids to biodiversity monitoring and carbon accounting.</p>
            <div class="hero__meta" style="margin-top:22px;">
              <div class="hero__meta-item"><strong>Q4 2026</strong>Dates announced soon</div>
              <div class="hero__meta-item"><strong>Virtual</strong>100% online</div>
              <div class="hero__meta-item"><strong>Proceedings</strong>ISBN registered</div>
              <div class="hero__meta-item"><strong>Tracks</strong>8 specialist themes</div>
            </div>
            <div class="hero__actions">
              <a href="/interest-form" class="btn-primary" data-track="hero_interest">Express Interest</a>
              <a href="/call-for-papers" class="btn-outline" data-track="hero_cfp">Call for Papers</a>
              <button class="btn-outline" data-download="brochure" data-track="hero_brochure">Get Brochure</button>
            </div>
          </div>
          <div class="hero__proof">
            <div class="hero__panel reveal-right" data-parallax="0.06">
              <div class="trust-score">
                <div class="trust-score__top">
                  <div>
                    <div class="eyebrow">ScholarVault Verified</div>
                    <div class="trust-score__number">9.4</div>
                  </div>
                  <div class="trust-score__label">Platinum verification for legitimacy, transparency, and academic trust.</div>
                </div>
                <div class="trust-marks">
                  <span>8 SDGs aligned</span>
                  <span>Open to all countries</span>
                  <span>Peer reviewed</span>
                  <span>Virtual-first</span>
                </div>
              </div>
            </div>
            <div class="hero__floating">
              <div class="floating-card reveal-right" data-parallax="0.1">
                <small>What this summit covers</small>
                <strong>Climate AI, smart agriculture, grids, oceans, biodiversity, emissions, and green computing.</strong>
              </div>
              <div class="floating-card reveal-right" data-parallax="0.13">
                <small>Current status</small>
                <strong>Programme shaping now. CFP, speaker invitations, and committee onboarding are active.</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section section--mist">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">About the conference</div>
            <h2 class="section-title">Where <span>AI meets</span> the planet</h2>
            <p class="section-lead">ICAES 2026 is an international virtual conference dedicated to the intersection of Artificial Intelligence and Environmental Sustainability. As climate change accelerates, AI offers transformative tools - from satellite-based deforestation detection to neural-network-driven energy optimisation.</p>
          </div>
          <div class="kpi-row stagger">
            <div class="kpi-card"><strong>8</strong><span>Research tracks</span></div>
            <div class="kpi-card"><strong>Q4</strong><span>2026 event window</span></div>
            <div class="kpi-card"><strong>ISBN</strong><span>Proceedings published</span></div>
            <div class="kpi-card"><strong>8+</strong><span>UN SDGs aligned</span></div>
          </div>
        </div>
      </section>

      <section class="section section--light" id="tracks">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">Research tracks</div>
            <h2 class="section-title">8 specialised <span>research areas</span></h2>
            <p class="section-lead">ICAES 2026 covers the full spectrum of AI-driven environmental research - from climate modelling to green computing.</p>
          </div>
          <div class="track-grid stagger">${trackCards()}</div>
        </div>
      </section>

      <section class="section section--dark" id="why">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow">Why attend</div>
            <h2 class="section-title">Built for <span>impact-driven research</span></h2>
            <p class="section-lead">A virtual summit format with strong editorial framing, trusted verification, and a clear research identity.</p>
          </div>
          <div class="grid-3 stagger">${cards(whyAttend, "card", "leaf")}</div>
        </div>
      </section>

      <section class="section section--mist" id="dates">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">Key dates</div>
            <h2 class="section-title">Important dates and <span>deadlines</span></h2>
            <p class="section-lead">All deadlines are listed in IST. Final dates will be announced publicly once the programme calendar is locked.</p>
          </div>
          <div class="content-grid">
            <div class="timeline">
              <article class="timeline-card reveal-up"><div class="timeline-card__date">TBA<span>Q3 2026</span></div><div><h3>Abstract submission opens</h3><p>Author expressions of interest, abstract intake, and guidance resources begin.</p></div></article>
              <article class="timeline-card reveal-up"><div class="timeline-card__date">TBA<span>Q3 2026</span></div><div><h3>Full paper deadline</h3><p>Final paper intake window for all eight conference tracks.</p></div></article>
              <article class="timeline-card reveal-up"><div class="timeline-card__date">TBA<span>Q4 2026</span></div><div><h3>Acceptance notification</h3><p>Editorial decisions and camera-ready guidance issued to authors.</p></div></article>
              <article class="timeline-card reveal-up"><div class="timeline-card__date">Q4 2026<span>Virtual event</span></div><div><h3>Conference days</h3><p>Live and recorded keynote sessions, paper rooms, and networking experiences.</p></div></article>
            </div>
            <aside class="panel reveal-right">
              <div class="eyebrow eyebrow--light">Countdown placeholder</div>
              <h3 style="margin-top:14px;">We're building toward Q4 2026.</h3>
              <div id="countdown" class="kpi-row" style="margin-top:18px;">
                <div class="kpi-card"><strong id="cd-days">--</strong><span>Days</span></div>
                <div class="kpi-card"><strong id="cd-hours">--</strong><span>Hours</span></div>
                <div class="kpi-card"><strong id="cd-minutes">--</strong><span>Minutes</span></div>
                <div class="kpi-card"><strong id="cd-seconds">--</strong><span>Seconds</span></div>
              </div>
              <p style="margin-top:18px;">Want the actual date release the moment it goes live? Join the notification list and we will send the final calendar directly to your inbox.</p>
              <a class="btn-primary" href="/interest-form">Get notified</a>
            </aside>
          </div>
        </div>
      </section>

      <section class="section section--light" id="sdg">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">UN Sustainable Development Goals</div>
            <h2 class="section-title">Research that <span>moves the needle</span></h2>
            <p class="section-lead">Every paper submitted to ICAES 2026 connects to globally recognised sustainability outcomes.</p>
          </div>
          <div class="grid-4 stagger">${sdgCards()}</div>
        </div>
      </section>

      <section class="section section--dark" id="verification">
        <div class="site-shell">
          <div class="split-feature">
            <div class="rich-copy reveal-left">
              <div class="eyebrow">Verification & trust</div>
              <h2 class="section-title">ScholarVault <span>Platinum verified</span></h2>
              <p>ICAES 2026 has been independently verified by ScholarVault - India's academic conference verification platform. Platinum status reflects strong legitimacy, transparent fee policy, and zero predatory risk signals.</p>
              <ul>
                <li>Organisational identity verified</li>
                <li>Committee credentials independently reviewed</li>
                <li>Transparent fee and refund policy</li>
                <li>Public trust positioning backed by score visibility</li>
              </ul>
              <div class="hero__actions">
                <a class="btn-primary" href="/badge">View verification page</a>
                <a class="btn-outline" href="/scholarvault">About ScholarVault</a>
              </div>
            </div>
            <aside class="panel sticky-card reveal-right">
              <div class="eyebrow eyebrow--light">Trust score</div>
              <h3 style="font-size:3.4rem;margin:16px 0 4px;">9.4 / 10</h3>
              <p>Platinum tier, virtual-first delivery, ISBN proceedings, and strong transparency signals.</p>
              <div class="download-list" style="margin-top:16px;">
                <div class="card-tag">ScholarVault verified</div>
                <div class="card-tag">Peer reviewed</div>
                <div class="card-tag">Global participation</div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section class="section section--mist" id="speakers">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">Speakers</div>
            <h2 class="section-title">Keynote voices shaping <span>climate AI</span></h2>
            <p class="section-lead">Speaker nominations are currently open across climate science, environmental policy, and sustainable technology practice.</p>
          </div>
          <div class="grid-3 stagger">
            <article class="speaker-card">
              <div class="speaker-card__avatar"></div>
              <div class="speaker-card__role">Nominations open</div>
              <h3>Climate AI Researcher</h3>
              <p>For experts working on climate models, earth observation, adaptation analytics, and resilience intelligence.</p>
            </article>
            <article class="speaker-card">
              <div class="speaker-card__avatar"></div>
              <div class="speaker-card__role">Nominations open</div>
              <h3>Environmental Policy Expert</h3>
              <p>For thinkers connecting evidence, public systems, accountability, and implementation at scale.</p>
            </article>
            <article class="speaker-card">
              <div class="speaker-card__avatar"></div>
              <div class="speaker-card__role">Nominations open</div>
              <h3>Sustainability Technologist</h3>
              <p>For builders and operators applying AI to energy, agriculture, biodiversity, water, and industrial systems.</p>
            </article>
          </div>
          <div class="hero__actions" style="margin-top:28px;">
            <a class="btn-primary" href="/speaker-form">Nominate a speaker</a>
            <a class="btn-ghost" href="/speakers">View speakers page</a>
          </div>
        </div>
      </section>

      ${subscribeStrip}

      <section class="section section--light" id="faq">
        <div class="site-shell">
          <div class="section__top reveal">
            <div class="eyebrow eyebrow--light">FAQ</div>
            <h2 class="section-title">Frequently asked <span>questions</span></h2>
          </div>
          <div class="faq-list">${faqMarkup(homeFaq)}</div>
        </div>
      </section>

      <section class="section section--dark">
        <div class="site-shell">
          <div class="panel reveal" style="padding:34px;">
            <div class="split-feature">
              <div>
                <div class="eyebrow">Final CTA</div>
                <h2 class="section-title" style="max-width:12ch;margin-top:16px;">Join the researchers building <span>planet-scale intelligence</span>.</h2>
              </div>
              <div class="rich-copy">
                <p>Whether you're planning to submit research, nominate a speaker, or simply follow the programme, ICAES 2026 is designed to gather serious environmental and AI voices in one coherent virtual space.</p>
                <div class="hero__actions">
                  <a class="btn-primary" href="/interest-form">Express interest</a>
                  <a class="btn-outline" href="/submit-paper">Submit paper</a>
                  <a class="btn-outline" href="/register">Get notified</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  }),
  about: shell({
    slug: "about",
    title: `About ${site.name} - ${site.fullName}`,
    description: "About the ICAES 2026 virtual conference, its mission, positioning, and ScholarVault-backed trust framework.",
    active: "about",
    body: `
      ${pageHero("About", `About <span>${site.name}</span>`, `${site.fullName} is an international virtual conference focused on how Artificial Intelligence can strengthen environmental sustainability, climate resilience, and planetary stewardship.`)}
      <section class="section section--mist"><div class="site-shell"><div class="split-feature"><div class="rich-copy reveal-left"><div class="eyebrow eyebrow--light">Mission</div><h2 class="section-title">A summit designed for <span>planet-facing research</span></h2><p>ICAES 2026 exists to convene researchers, environmental practitioners, sustainability strategists, engineers, and policy makers around a clear question: how can AI help societies respond more intelligently to the environmental crisis?</p><p>The conference is built as a virtual-first, internationally accessible academic gathering with peer review, ISBN proceedings, and a strong emphasis on trustworthy conference operations.</p></div><aside class="panel sticky-card reveal-right"><div class="eyebrow eyebrow--light">Core signals</div><div class="download-list" style="margin-top:16px;"><div class="card-tag">8 research tracks</div><div class="card-tag">ScholarVault Platinum verified</div><div class="card-tag">Virtual global access</div><div class="card-tag">Proceedings with ISBN</div></div><p style="margin-top:16px;">The conference is open to authors, practitioners, speakers, committee members, and interested delegates from all countries.</p></aside></div></div></section>
      <section class="section section--light"><div class="site-shell"><div class="section__top reveal"><div class="eyebrow eyebrow--light">Who ICAES is for</div><h2 class="section-title">One conference, multiple <span>climate and AI communities</span></h2></div><div class="grid-3 stagger">${cards([["Researchers","Authors working across climate modelling, biodiversity, agriculture, water systems, emissions, and ethical AI."],["Applied sustainability teams","Industry, startups, NGOs, and public agencies experimenting with deployable environmental AI systems."],["Policy and governance professionals","Experts translating technical capability into accountability, regulation, and climate action frameworks."],["Students and early-career scholars","A virtual, lower-friction venue for postgraduate researchers entering interdisciplinary climate and AI work."],["Reviewers and committee members","Domain specialists who want to shape academic quality, reviewer culture, and editorial standards."],["Curious delegates","People exploring the field and looking for a credible, trusted conference with a clear sustainability identity."]], "card", "globe-2")}</div></div></section>
      <section class="section section--dark"><div class="site-shell"><div class="section__top reveal"><div class="eyebrow">Why now</div><h2 class="section-title">AI is becoming infrastructure for <span>environmental action</span></h2><p class="section-lead">From remote sensing and grid forecasting to carbon accounting and restoration intelligence, environmental AI has matured into a practical and policy-relevant research field.</p></div><div class="grid-3 stagger">${cards([["Observation","AI helps environmental teams interpret satellite, sensor, acoustic, and field data at scale."],["Decision support","Forecasting and optimisation systems increasingly shape mitigation, adaptation, and resilience planning."],["Verification","Automated systems are now central to measuring emissions, lifecycle impacts, and conservation outcomes."],["Operations","Agriculture, water, logistics, and energy are becoming more dynamic, data-rich, and responsive."],["Governance","Questions of equity, energy use, auditability, and public accountability are now unavoidable."],["Collaboration","The strongest work happens at the overlap of science, engineering, design, policy, and on-ground practice."]], "card", "radar")}</div></div></section>
    `,
  }),
  "call-for-papers": shell({
    slug: "call-for-papers",
    title: `Call for Papers - ${site.name}`,
    description: "Submit original research to ICAES 2026 across eight tracks spanning climate AI, agriculture, biodiversity, water systems, and green computing.",
    active: "call-for-papers",
    body: `
      ${pageHero("Call for Papers", `Call for <span>papers</span>`, "ICAES 2026 invites original research papers, review articles, case studies, short papers, and application-focused contributions at the intersection of AI and environmental sustainability.")}
      <section class="section section--mist"><div class="site-shell"><div class="section__top reveal"><div class="eyebrow eyebrow--light">Scope</div><h2 class="section-title">Eight tracks, one coherent <span>environmental AI agenda</span></h2><p class="section-lead">Authors may submit work that is theoretical, empirical, infrastructural, policy-facing, or strongly application-oriented, as long as the contribution is clearly positioned within environmental sustainability.</p></div><div class="track-grid stagger">${trackCards()}</div></div></section>
      <section class="section section--light"><div class="site-shell"><div class="content-grid"><div class="rich-copy reveal-left"><div class="eyebrow eyebrow--light">Submission guidance</div><h2 class="section-title">What authors should <span>prepare</span></h2><ul><li>Original work not under active review elsewhere.</li><li>A clear problem statement, environmental context, and method description.</li><li>Track-aligned abstract, keywords, and author metadata.</li><li>A paper formatted using the conference template.</li><li>Transparent discussion of data, limitations, or governance implications where relevant.</li></ul></div><div class="panel reveal-right"><div class="eyebrow eyebrow--light">Programme timing</div><div class="download-list" style="margin-top:18px;"><div class="card-tag">Abstract submission: TBA - Q3 2026</div><div class="card-tag">Full paper deadline: TBA - Q3 2026</div><div class="card-tag">Acceptance notification: TBA</div><div class="card-tag">Conference days: Q4 2026</div></div><p style="margin-top:18px;">All deadlines are listed in IST. The moment final dates are announced, the site and subscriber list will be updated together.</p><div class="hero__actions"><a class="btn-primary" href="/submit-paper">Submit your paper</a><button class="btn-ghost" data-download="template">Get paper template</button></div></div></div></div></section>
      <section class="section section--dark"><div class="site-shell"><div class="grid-3 stagger">${cards([["Review model","Submissions are reviewed for relevance, originality, clarity, and contribution to environmental sustainability."],["Publication","Accepted papers are included in ISBN-registered proceedings subject to editorial and formatting compliance."],["Integrity","ScholarVault verification supports transparent conference positioning and anti-predatory signalling for authors."],["Interdisciplinary work","Papers can combine AI methods with policy, ecology, engineering, remote sensing, or sustainability operations."],["Applied papers","Well-scoped real-world deployments, pilots, benchmarks, and operational case studies are welcome."],["Short communications","Early-stage but high-signal work can be considered when the contribution is clearly articulated."]], "card", "file-text")}</div></div></section>
    `,
  }),
  speakers: shell({
    slug: "speakers",
    title: `Speakers - ${site.name}`,
    description: "Speaker nominations and keynote curation for ICAES 2026 across climate AI, sustainability technology, and environmental policy.",
    active: "speakers",
    body: `
      ${pageHero("Speakers", `Keynote <span>speakers</span>`, "ICAES 2026 is currently inviting leading voices in climate AI, environmental science, sustainability technology, and policy design.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger"><article class="speaker-card"><div class="speaker-card__avatar"></div><div class="speaker-card__role">Nominations open</div><h3>Climate AI Researcher</h3><p>Work on forecasting, adaptation models, earth observation, or climate risk intelligence.</p></article><article class="speaker-card"><div class="speaker-card__avatar"></div><div class="speaker-card__role">Nominations open</div><h3>Environmental Policy Expert</h3><p>Bridge technical capability with governance, regulation, climate accountability, and public systems.</p></article><article class="speaker-card"><div class="speaker-card__avatar"></div><div class="speaker-card__role">Nominations open</div><h3>Sustainability Technologist</h3><p>Build deployable systems across energy, agriculture, biodiversity, carbon, or water infrastructure.</p></article></div></div></section>
      <section class="section section--light"><div class="site-shell"><div class="content-grid"><div class="panel reveal-left"><div class="eyebrow eyebrow--light">What we are curating</div><h3>Talk profiles</h3><p>We are especially interested in speakers who can connect real environmental outcomes with technical depth, cross-sector insight, or strong public relevance.</p><ul><li>Climate analytics and adaptation systems</li><li>Biodiversity monitoring and conservation AI</li><li>Energy, grids, and decarbonisation platforms</li><li>Policy, governance, and AI ethics for environment</li><li>Operational sustainability case studies</li></ul></div><div class="panel reveal-right"><div class="eyebrow eyebrow--light">Become a speaker</div><h3>Applications are open</h3><p>Propose a keynote, invited talk, panel contribution, or practitioner case study. The programme committee will review speaking applications on a rolling basis.</p><div class="hero__actions"><a class="btn-primary" href="/speaker-form">Apply to speak</a><a class="btn-ghost" href="/contact">Media / press contact</a></div></div></div></div></section>
    `,
  }),
  committee: shell({
    slug: "committee",
    title: `Committee - ${site.name}`,
    description: "Organising and programme committee information for ICAES 2026.",
    active: "committee",
    body: `
      ${pageHero("Committee", `Organising <span>committee</span>`, "ICAES 2026 is being assembled through an interdisciplinary committee spanning programme strategy, peer review, speaker curation, and conference operations.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger">${cards([["Programme Committee","Shapes track direction, review quality, and the editorial character of the conference."],["Track Leads","Coordinate specific subject areas such as climate modelling, biodiversity, agriculture, or energy."],["Reviewer Network","Supports peer review with domain expertise and constructive academic standards."],["Speaker & partnership desk","Handles keynote curation, outreach, and ecosystem-facing collaborations."],["Operations & experience","Supports virtual programme delivery, attendee communication, and documentation."],["Integrity & trust","Maintains transparent, legitimate, and publicly accountable conference positioning."]], "card", "users")}</div></div></section>
      <section class="section section--dark"><div class="site-shell"><div class="split-feature"><div class="rich-copy reveal-left"><div class="eyebrow">Roles and expectations</div><h2 class="section-title">What committee participation <span>looks like</span></h2><ul><li>Review support and editorial guidance</li><li>Programme design and track shaping</li><li>Speaker scouting or moderation assistance</li><li>Community outreach and institutional visibility</li><li>Academic integrity and transparency support</li></ul></div><aside class="panel sticky-card reveal-right"><div class="eyebrow eyebrow--light">Apply now</div><h3 style="margin-top:14px;">Join the organising team</h3><p>We welcome domain experts, experienced reviewers, and research organisers who want to help shape a trusted environmental AI conference.</p><a class="btn-primary" href="/committee-form">Join committee</a></aside></div></div></section>
    `,
  }),
  awards: shell({
    slug: "awards",
    title: `Awards - ${site.name}`,
    description: "Conference awards and nomination form for ICAES 2026.",
    active: "awards",
    body: `
      ${pageHero("Awards", `Conference <span>awards</span>`, "ICAES 2026 recognises standout contributions across research, presentation quality, reviewer effort, and interdisciplinary sustainability impact.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger">${cards([["Best Paper Award","For the strongest overall paper across originality, technical quality, and environmental significance."],["Best Presentation Award","For the most compelling and clearly delivered conference presentation."],["Outstanding Reviewer","For reviewers whose feedback materially improved author submissions and programme quality."],["Young Researcher Award","For exceptional early-career scholarship with clear future potential."],["Applied Impact Award","For work demonstrating a strong pathway from research to real sustainability outcomes."],["Partnerships Award","For cross-sector collaboration with strong research or implementation value."]], "card", "trophy")}</div></div></section>
      <section class="section section--light"><div class="site-shell"><div class="form-shell reveal" id="awardsWrap"><div><div class="eyebrow eyebrow--light">Nomination form</div><h2 class="section-title" style="font-size:2.4rem;max-width:none;margin-top:16px;">Submit an <span>award nomination</span></h2><p class="section-lead">You may nominate yourself, a collaborator, a reviewer, or another contributor whose work deserves recognition.</p></div><form id="awardsForm" class="form-grid form-grid--single"><div class="field"><label>Nominee name</label><input name="nominee_name" required placeholder="Nominee full name" /></div><div class="field"><label>Your email</label><input name="email" type="email" required placeholder="name@institution.edu" /></div><div class="field"><label>Institution</label><input name="institution" placeholder="Institution / organisation" /></div><div class="field"><label>Award category</label><select name="award_category" required><option value="">Select a category</option><option>Best Paper Award</option><option>Best Presentation Award</option><option>Outstanding Reviewer</option><option>Young Researcher Award</option><option>Applied Impact Award</option><option>Partnerships Award</option></select></div><div class="field"><label>Nomination type</label><select name="nomination_type"><option>Self-nomination</option><option>Nominating someone else</option></select></div><div class="field"><label>Research summary</label><textarea name="research_summary" required placeholder="Why is this work or contribution award-worthy?"></textarea></div><button class="btn-primary form-submit" type="submit">Submit nomination</button></form><div class="form-success"><div class="form-success__title">Nomination received</div><p class="form-success__text">Thank you. The awards committee will review this nomination and share updates by email.</p></div></div></div></section>
    `,
    extraScripts: formScripts.awards,
  }),
  blog: shell({
    slug: "blog",
    title: `Blog - ${site.name}`,
    description: "Editorial and conference updates from ICAES 2026 on environmental AI, sustainability systems, and climate technology.",
    active: "blog",
    body: `
      ${pageHero("Blog", `Conference <span>blog</span>`, "Research notes, field signals, programme updates, and practical commentary from the ICAES 2026 editorial desk.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger">${cards([["How climate AI is moving from research to public infrastructure","Forecasting systems, adaptation tooling, and earth-observation platforms are increasingly shaping real decision environments."],["Precision agriculture after the hype cycle","What robust, field-tested environmental AI in agriculture actually looks like."],["Biodiversity monitoring is becoming multimodal","From acoustic monitoring to remote sensing, conservation data is becoming richer and harder to manage without AI."],["Carbon accounting needs better systems thinking","Automation helps, but lifecycle and emissions intelligence still demand careful modelling choices."],["What makes a sustainability conference trustworthy?","Why conference legitimacy matters for authors, institutions, and funding bodies."],["Why green computing belongs in environmental research","The environmental cost of AI itself is now part of the sustainability conversation."]], "blog-card", "newspaper")}</div></div></section>
    `,
  }),
  media: shell({
    slug: "media",
    title: `Media - ${site.name}`,
    description: "Media and press resources for ICAES 2026.",
    active: "media",
    body: `
      ${pageHero("Media", `Media and <span>press</span>`, "A compact media hub for conference descriptions, partner copy, visual assets, and press contact routes.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger">${cards([["Press overview","Conference description, positioning notes, and short copy suitable for media mentions or partner listings."],["Brand assets","Logo, badge, event description, and lightweight social visuals for digital use."],["Announcements","Milestones such as date release, keynote announcements, and CFP launch will be mirrored here."],["Interview requests","We can coordinate responses from organisers and invited speakers where appropriate."],["Embargo handling","Press-sensitive updates can be coordinated with the organising team ahead of public release."],["ScholarVault context","Background on the verification layer and why it matters for academic conference trust."]], "media-card", "mic")}</div><div class="hero__actions" style="margin-top:28px;"><button class="btn-primary" data-download="media">Request media kit</button><a class="btn-ghost" href="/contact">Press contact</a></div></div></section>
    `,
  }),
  downloads: shell({
    slug: "downloads",
    title: `Downloads - ${site.name}`,
    description: "Conference brochure, paper template, CFP summary, and media resources for ICAES 2026.",
    active: "",
    body: `
      ${pageHero("Downloads", `Conference <span>downloads</span>`, "The core ICAES 2026 resources in one place - brochure, CFP materials, media resources, and supporting documents.")}
      <section class="section section--mist"><div class="site-shell"><div class="download-list">${resourceCards.map(([title, body, type]) => `<article class="download-card reveal-up"><div><h3>${title}</h3><p>${body}</p></div><button class="btn-primary" data-download="${type}">Request file</button></article>`).join("")}</div></div></section>
    `,
  }),
  contact: shell({
    slug: "contact",
    title: `Contact - ${site.name}`,
    description: "Contact the ICAES 2026 organising team for author, speaker, partner, and delegate enquiries.",
    active: "",
    body: `
      ${pageHero("Contact", `Contact <span>ICAES 2026</span>`, "Reach the organising team for programme questions, speaking enquiries, author support, partnerships, or conference operations.")}
      <section class="section section--mist"><div class="site-shell"><div class="content-grid"><div class="panel reveal-left"><div class="eyebrow eyebrow--light">Direct channels</div><h3>Conference desk</h3><p><strong>Email:</strong> ${site.brochureEmail}</p><p><strong>Format:</strong> ${site.format}</p><p><strong>Website:</strong> ${site.domain.replace("https://", "")}</p><p><strong>Organiser:</strong> ScholarVault Conference Series</p><div class="download-list" style="margin-top:18px;"><div class="card-tag">Registration queries</div><div class="card-tag">Paper submission support</div><div class="card-tag">Speaker nominations</div><div class="card-tag">Media and partnerships</div></div></div><div class="form-shell reveal-right" id="contactWrap"><div><div class="eyebrow eyebrow--light">Contact form</div><h2 class="section-title" style="font-size:2.4rem;max-width:none;margin-top:16px;">Send a <span>message</span></h2></div><form id="contactForm" class="form-grid form-grid--single"><div class="field"><label>Name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Query type</label><select name="query_type" required><option value="">Select topic</option><option>Registration</option><option>Paper Submission</option><option>Speaker / Committee</option><option>Partnership / Media</option><option>General Enquiry</option></select></div><div class="field"><label>Institution</label><input name="institution" /></div><div class="field"><label>Message</label><textarea name="message" required></textarea></div><label class="check-row"><input type="checkbox" name="subscribe_updates" value="yes" /><span>Also subscribe me to ICAES updates.</span></label><button class="btn-primary form-submit" type="submit">Send message</button></form><div class="form-success"><div class="form-success__title">Message sent</div><p class="form-success__text">Thanks for reaching out. We have received your enquiry and will respond by email.</p></div></div></div></div></section>
    `,
    extraScripts: formScripts.contact,
  }),
  badge: shell({
    slug: "badge",
    title: `Verification - ${site.name}`,
    description: "ScholarVault Platinum verification details and trust framing for ICAES 2026.",
    active: "",
    body: `
      ${pageHero("Verification", `ScholarVault <span>verification</span>`, "ICAES 2026 carries a ScholarVault Platinum verification badge, signalling strong legitimacy, transparent positioning, and low predatory risk indicators.")}
      <section class="section section--mist"><div class="site-shell"><div class="content-grid"><div class="panel reveal-left"><div class="eyebrow eyebrow--light">What Platinum means</div><h3>Public trust position</h3><p>The Platinum tier reflects a strong overall trust score, backed by organisational checks, transparent policy framing, and a clear anti-predatory posture.</p><ul><li>Organisational identity verified</li><li>Transparent conference positioning</li><li>Legible fee and refund policy</li><li>Low predatory signal profile</li></ul></div><div class="panel reveal-right"><div class="eyebrow eyebrow--light">Score</div><h3 style="font-size:3.6rem;margin:16px 0 4px;">9.4 / 10</h3><p>ScholarVault Platinum verified.</p><div class="download-list" style="margin-top:16px;"><div class="card-tag">Public-facing trust story</div><div class="card-tag">Verification notability</div><div class="card-tag">Clear conference identity</div></div></div></div></div></section>
    `,
  }),
  sdg: shell({
    slug: "sdg",
    title: `SDG Alignment - ${site.name}`,
    description: "UN Sustainable Development Goal alignment for ICAES 2026 and its research agenda.",
    active: "",
    body: `
      ${pageHero("SDG Alignment", `SDG <span>alignment</span>`, "ICAES 2026 is intentionally framed around environmental and sustainability outcomes that map directly to multiple UN Sustainable Development Goals.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-4 stagger">${sdgCards()}</div></div></section>
    `,
  }),
  "interest-form": shell({
    slug: "interest-form",
    title: `Express Interest - ${site.name}`,
    description: "Express interest in ICAES 2026 to receive date announcements, CFP milestones, and speaker updates.",
    active: "",
    body: `
      ${pageHero("Express Interest", `Stay in the <span>loop</span>`, "Join the ICAES 2026 notification list for date announcements, CFP alerts, keynote updates, and conference milestones.")}
      <section class="section section--mist"><div class="site-shell"><div class="form-shell reveal" id="interestWrap"><form id="interestForm" class="form-grid form-grid--single"><div class="field"><label>Name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Your role</label><select name="role" required><option value="">Select role</option><option>Author / Researcher</option><option>Student / Scholar</option><option>Speaker / Nominee</option><option>Industry / NGO Delegate</option><option>Policy / Government</option></select></div><div class="field"><label>Country</label><input name="country" /></div><div class="field"><label>Primary interest</label><select name="interest"><option>General updates</option><option>Call for papers</option><option>Speaking opportunities</option><option>Committee participation</option><option>Partnerships / sponsorship</option></select></div><div class="field"><label>Anything we should know?</label><textarea name="notes" placeholder="Research area, institutional context, or what you want to hear about first."></textarea></div><label class="check-row"><input type="checkbox" name="subscribe_updates" value="yes" checked /><span>Also subscribe me to email updates.</span></label><button class="btn-primary form-submit" type="submit">Submit interest</button></form><div class="form-success"><div class="form-success__title">Interest submitted</div><p class="form-success__text">Thanks. We have noted your interest and will keep you updated on ICAES 2026 milestones.</p></div></div></div></section>
    `,
    extraScripts: formScripts.interest,
  }),
  "submit-paper": shell({
    slug: "submit-paper",
    title: `Submit Paper - ${site.name}`,
    description: "Submit your research paper to ICAES 2026 across eight environmental AI tracks.",
    active: "",
    body: `
      ${pageHero("Submit Paper", `Submit your <span>research paper</span>`, "Upload your paper, abstract, and track details for ICAES 2026. The conference accepts interdisciplinary work across eight environmental AI tracks.")}
      <section class="section section--mist"><div class="site-shell"><div class="form-shell reveal" id="paperWrap"><form id="paperForm" class="form-grid form-grid--single"><div class="field"><label>Author name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Institution</label><input name="institution" required /></div><div class="field"><label>Country</label><input name="country" /></div><div class="field"><label>Paper title</label><input name="title" required /></div><div class="field"><label>Track</label><select name="track" required><option value="">Select track</option>${tracks.map(([, title]) => `<option>${title}</option>`).join("")}</select></div><div class="field"><label>Keywords</label><input name="keywords" required placeholder="Climate AI, biodiversity, forecasting..." /></div><div class="field"><label>Abstract</label><textarea name="abstract" required></textarea></div><div class="field"><label>Paper file</label><input id="paperFile" type="file" accept=".pdf,.doc,.docx" required /></div><button class="btn-primary form-submit" type="submit">Upload and submit</button></form><div class="form-success"><div class="form-success__title">Paper submitted</div><p class="form-success__text">Your paper has entered the ICAES 2026 review queue. A confirmation email is on the way.</p></div></div></div></section>
    `,
    extraScripts: formScripts.paper,
  }),
  "speaker-form": shell({
    slug: "speaker-form",
    title: `Speaker Application - ${site.name}`,
    description: "Apply to speak at ICAES 2026 as a keynote, invited speaker, or panel contributor.",
    active: "",
    body: `
      ${pageHero("Speaker Application", `Become a <span>speaker</span>`, "ICAES 2026 welcomes applications from climate AI researchers, environmental policy experts, sustainability operators, and cross-disciplinary builders.")}
      <section class="section section--mist"><div class="site-shell"><div class="form-shell reveal" id="speakerWrap"><form id="speakerForm" class="form-grid form-grid--single"><div class="field"><label>Name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Institution / Organisation</label><input name="institution" required /></div><div class="field"><label>Designation</label><input name="designation" /></div><div class="field"><label>Talk type</label><select name="talk_type" required><option value="">Select talk type</option><option>Keynote</option><option>Invited talk</option><option>Panel contribution</option><option>Applied case study</option></select></div><div class="field"><label>Topic</label><input name="topic" required /></div><div class="field"><label>Short bio</label><textarea name="speaker_bio" required></textarea></div><div class="field"><label>Photo (optional)</label><input id="speakerPhoto" type="file" accept=".jpg,.jpeg,.png,.webp" /></div><button class="btn-primary form-submit" type="submit">Submit application</button></form><div class="form-success"><div class="form-success__title">Application received</div><p class="form-success__text">Thank you. The programme team will review your speaker application and follow up by email.</p></div></div></div></section>
    `,
    extraScripts: formScripts.speaker,
  }),
  "committee-form": shell({
    slug: "committee-form",
    title: `Committee Application - ${site.name}`,
    description: "Apply to join the ICAES 2026 organising or programme committee.",
    active: "",
    body: `
      ${pageHero("Committee Application", `Join the <span>committee</span>`, "Help shape the ICAES 2026 programme, review quality, and virtual conference experience.")}
      <section class="section section--mist"><div class="site-shell"><div class="form-shell reveal" id="committeeWrap"><form id="committeeForm" class="form-grid form-grid--single"><div class="field"><label>Name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Designation</label><input name="designation" required /></div><div class="field"><label>Institution</label><input name="institution" required /></div><div class="field"><label>Country</label><input name="country" /></div><div class="field"><label>Role preference / expertise</label><input name="expertise" required placeholder="Reviewer, track coordination, outreach, operations..." /></div><div class="field"><label>Motivation</label><textarea name="statement" required></textarea></div><button class="btn-primary form-submit" type="submit">Apply for committee</button></form><div class="form-success"><div class="form-success__title">Application submitted</div><p class="form-success__text">Thanks for applying. The organising team will review your committee interest and follow up by email.</p></div></div></div></section>
    `,
    extraScripts: formScripts.committee,
  }),
  register: shell({
    slug: "register",
    title: `Register - ${site.name}`,
    description: "Register for ICAES 2026 with virtual delegate tiers for students, faculty, listeners, and co-authors.",
    active: "",
    body: `
      ${pageHero("Register", `Register for <span>ICAES 2026</span>`, "Choose a delegate category, complete your information, and proceed to secure checkout for the virtual conference.")}
      <section class="section section--mist"><div class="site-shell"><div class="section__top reveal"><div class="eyebrow eyebrow--light">Delegate categories</div><h2 class="section-title">Flexible virtual <span>registration tiers</span></h2></div><div class="pricing-toggle reveal"><button type="button" class="currency-btn active" data-currency="INR">INR</button><button type="button" class="currency-btn" data-currency="USD">USD</button></div><div class="price-grid stagger"><article class="price-card"><div class="card-tag">Student / PhD</div><h3>Student Delegate</h3><strong><span class="price-inr">INR 1,999</span><span class="price-usd">USD 49</span></strong><p>For students and doctoral scholars presenting or attending.</p></article><article class="price-card price-card--featured"><div class="card-tag">Faculty / Postdoc</div><h3>Research Delegate</h3><strong><span class="price-inr">INR 2,999</span><span class="price-usd">USD 89</span></strong><p>For faculty, postdocs, labs, and research professionals.</p></article><article class="price-card"><div class="card-tag">Listener</div><h3>Attendee Pass</h3><strong><span class="price-inr">INR 999</span><span class="price-usd">USD 29</span></strong><p>For participants joining sessions without a paper or formal speaking role.</p></article><article class="price-card"><div class="card-tag">Co-author</div><h3>Additional Presenter</h3><strong><span class="price-inr">INR 1,999</span><span class="price-usd">USD 49</span></strong><p>For additional named authors or presenters within accepted work.</p></article></div></div></section>
      <section class="section section--light"><div class="site-shell"><div class="form-shell reveal"><form id="registrationForm" class="form-grid form-grid--single"><div class="field"><label>Select category</label><select name="category" required><option value="">Choose category</option><option value="student">Student Delegate</option><option value="faculty">Research Delegate</option><option value="listener">Attendee Pass</option><option value="coauthor">Additional Presenter</option></select></div><div class="field"><label>Full name</label><input name="name" required /></div><div class="field"><label>Email</label><input name="email" type="email" required /></div><div class="field"><label>Phone</label><input name="phone" required /></div><div class="field"><label>Institution</label><input name="institution" required /></div><div class="field"><label>Designation</label><input name="designation" /></div><div class="field"><label>Country</label><input name="country" required /></div><button class="btn-primary form-submit" type="submit">Proceed to secure checkout</button><p class="form-note">You will be redirected to secure checkout after we record your registration intent.</p></form><div class="form-success" id="registerSuccess"><div class="form-success__title">Payment completed</div><p class="form-success__text">Your registration has been marked as completed. A confirmation email and next steps will follow from the conference team.</p></div></div></div></section>
    `,
    extraScripts: formScripts.register,
  }),
  privacy: shell({
    slug: "privacy",
    title: `Privacy Policy - ${site.name}`,
    description: "Privacy policy for ICAES 2026 and its registration, submission, and contact workflows.",
    active: "",
    body: `
      ${pageHero("Privacy Policy", `Privacy <span>policy</span>`, "How ICAES 2026 collects, stores, and uses information shared through conference forms and communications.")}
      <section class="section section--mist"><div class="site-shell"><div class="policy-card reveal rich-copy"><p>ICAES 2026 collects the personal information required to run conference workflows such as registration, paper submission, speaker applications, committee applications, subscriptions, and direct contact requests.</p><p>We use the information you provide to communicate about the conference, manage participation, deliver requested resources, and maintain a functioning conference database. We do not sell your personal data.</p><p>Submission and application information may be reviewed internally by authorised organisers, reviewers, or committee members where necessary for conference operations.</p><p>If you have questions about your data or want to request a correction, email ${site.brochureEmail}.</p></div></div></section>
    `,
  }),
  refund: shell({
    slug: "refund",
    title: `Refund Policy - ${site.name}`,
    description: "Refund and payment policy for ICAES 2026.",
    active: "",
    body: `
      ${pageHero("Refund Policy", `Refund <span>policy</span>`, "A concise and transparent overview of how ICAES 2026 handles refunds, conference changes, and payment-related support.")}
      <section class="section section--mist"><div class="site-shell"><div class="policy-card reveal rich-copy"><p>ICAES 2026 aims to maintain a transparent refund policy consistent with its ScholarVault verification positioning. Refund eligibility is determined by the payment status, timing of the request, and whether the conference or programme is materially changed by the organisers.</p><p>If the conference is cancelled by the organising team, paid delegates are eligible for a full refund. If the event dates or delivery model change materially, the organising team will communicate the available options directly to affected registrants.</p><p>Refund requests should be submitted in writing to ${site.brochureEmail} with the subject line "Refund Request" and the registered email address used at checkout.</p></div></div></section>
    `,
  }),
  scholarvault: shell({
    slug: "scholarvault",
    title: `About ScholarVault - ${site.name}`,
    description: "About ScholarVault, the verification platform and organising framework behind ICAES 2026.",
    active: "",
    body: `
      ${pageHero("ScholarVault", `About <span>ScholarVault</span>`, "ScholarVault is the academic conference verification platform and conference series framework behind ICAES 2026.")}
      <section class="section section--mist"><div class="site-shell"><div class="content-grid"><div class="rich-copy reveal-left"><div class="eyebrow eyebrow--light">Platform context</div><h2 class="section-title">A trust layer for <span>academic conferences</span></h2><p>ScholarVault focuses on improving conference trust, reducing predatory risk, and helping researchers interpret conference legitimacy more clearly.</p><p>Its role in ICAES 2026 is both operational and reputational: conference infrastructure, trust signalling, and public-facing verification logic are intentionally visible.</p></div><div class="panel reveal-right"><div class="eyebrow eyebrow--light">Why it matters</div><p>Conference trust affects where authors submit, how institutions evaluate outputs, and how researchers assess risk before paying registration or submission fees.</p><div class="download-list" style="margin-top:16px;"><div class="card-tag">Transparency</div><div class="card-tag">Legitimacy</div><div class="card-tag">Conference clarity</div></div></div></div></div></section>
    `,
  }),
  why: shell({
    slug: "why",
    title: `Why ${site.name}?`,
    description: "Why researchers and practitioners may choose ICAES 2026 as a virtual environmental AI conference.",
    active: "",
    body: `
      ${pageHero("Why ICAES", `Why <span>ICAES 2026</span>?`, "A concise case for why ICAES 2026 is designed to feel credible, focused, and useful for environmental AI research communities.")}
      <section class="section section--mist"><div class="site-shell"><div class="grid-3 stagger">${cards([["Clear thematic scope","The conference has a tight identity around AI for environmental sustainability rather than generic AI messaging."],["Virtual global access","The online format is built to welcome international contributors without the friction of travel."],["Proceedings with ISBN","Accepted work is prepared for a durable proceedings record rather than a disposable event footprint."],["Trust positioning","ScholarVault Platinum verification provides public-facing legitimacy and anti-predatory signalling."],["Interdisciplinary by design","The conference explicitly welcomes climate, ecology, energy, infrastructure, policy, and computing perspectives."],["Signal over noise","The programme is intended to feel editorially coherent rather than overloaded with generic conference sprawl."]], "card", "sparkles")}</div></div></section>
    `,
  }),
};

Object.entries(pages).forEach(([slug, html]) => {
  write(`${slug === "index" ? "index" : slug}.html`, localizePaths(html));
});
