/**
 * ============================================================================
 * SVRIAS 2026 — Master Client Logic
 * ScholarVault Research Integrity & Responsible AI Summit 2026
 * ============================================================================
 */

const SV_CONFIG = {
  confId: "svrias2026",
  confName: "SVRIAS 2026",
  confFullName: "ScholarVault Research Integrity & Responsible AI Summit 2026",
  confDate: new Date("2026-11-14T09:00:00"),
  paperDeadline: new Date("2026-10-15T23:59:59"),
  earlyBirdDate: new Date("2026-10-25T23:59:59"),
  adminEmail: "conferences@scholarvault.in",
  rootUrl: "https://researchintegrity2026.scholarvault.in"
};

let currentCurrency = "INR";

/**
 * Shared static-site chrome.
 * Header, mobile menu, and footer are rendered from this one source on every
 * conference page, so a change here is reflected across the whole website.
 */
function renderSharedChromeDeprecated() {
  const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  const isActive = (file) => currentPage === file ? " active" : "";

  const banner = document.querySelector(".navbar__banner");
  if (banner) {
    banner.outerHTML = '<div class="navbar__banner"><span>Virtual Summit &bull; 14 November 2026 &bull; Call for Abstracts Open</span></div>';
  }

  const header = document.querySelector("header.navbar");
  if (header) {
    header.outerHTML = `
      <header class="navbar" id="navbar">
        <div class="navbar__inner">
          <a class="navbar__logo" href="index.html" aria-label="Responsible AI and Integrity Summit 2026 home">
            <img src="assets/icon-512.png" alt="ScholarVault" />
            <div class="navbar__logo-text">
              <strong>Responsible AI &amp; Integrity</strong>
              <span>AI Summit 2026</span>
            </div>
          </a>
          <nav class="navbar__links" aria-label="Primary navigation">
            <a href="index.html" class="navbar__link${isActive("index.html")}">Home</a>
            <a href="about.html" class="navbar__link${isActive("about.html")}">About</a>
            <a href="call-for-papers.html" class="navbar__link${isActive("call-for-papers.html")}">Call for Papers</a>
            <a href="speakers.html" class="navbar__link${isActive("speakers.html")}">Speakers</a>
            <a href="committee.html" class="navbar__link${isActive("committee.html")}">Committee</a>
            <a href="register.html" class="navbar__link${isActive("register.html")}">Register</a>
            <a href="awards.html" class="navbar__link${isActive("awards.html")}">Awards</a>
            <a href="blog.html" class="navbar__link${isActive("blog.html")}">Blog</a>
            <a href="contact.html" class="navbar__link${isActive("contact.html")}">Contact</a>
          </nav>
          <div class="navbar__cta">
            <a class="btn btn-outline btn-sm" href="javascript:void(0)" onclick="openInterestModal()">Express Interest</a>
            <a class="btn btn-primary btn-sm" href="register.html">Register Now <i data-lucide="arrow-right"></i></a>
          </div>
          <button class="navbar__hamburger" id="hamburger" aria-label="Toggle navigation menu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </header>`;
  }

  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenu) {
    mobileMenu.outerHTML = `
      <nav class="navbar__mobile" id="mobileMenu" aria-label="Mobile navigation">
        <a href="index.html" class="${isActive("index.html").trim()}">Home</a>
        <a href="about.html" class="${isActive("about.html").trim()}">About Summit</a>
        <a href="call-for-papers.html" class="${isActive("call-for-papers.html").trim()}">Call for Papers</a>
        <a href="speakers.html" class="${isActive("speakers.html").trim()}">Speakers</a>
        <a href="committee.html" class="${isActive("committee.html").trim()}">Committee</a>
        <a href="register.html" class="${isActive("register.html").trim()}">Register</a>
        <a href="javascript:void(0)" onclick="openInterestModal()">Express Interest</a>
      </nav>`;
  }

  const footer = document.querySelector("footer.footer");
  if (footer) {
    footer.outerHTML = `
      <footer class="footer">
        <div class="site-shell">
          <div class="footer__grid">
            <div class="footer__brand">
              <div class="navbar__logo-text"><strong style="font-size:1.3rem">Responsible AI &amp; Integrity</strong><span>AI Summit 2026</span></div>
              <p>ScholarVault Research Integrity &amp; Responsible AI Summit 2026 is an international virtual forum advancing ethical governance, algorithmic accountability, and reproducible science.</p>
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                <img class="organizer-mark" src="assets/icon-512.png" alt="ScholarVault" style="width:38px;height:38px;border-radius:9px" />
                <div style="display:flex;flex-direction:column;line-height:1.2"><span style="font-size:.78rem;color:var(--text-inverse-muted)">Organised by</span><strong style="font-size:.95rem;color:#fff">ScholarVault Conferences</strong></div>
              </div>
            </div>
            <div class="footer__col"><strong>Conference</strong><a href="about.html">About Summit</a><a href="call-for-papers.html">Call for Papers</a><a href="speakers.html">Speakers</a><a href="committee.html">Committee</a><a href="awards.html">Summit Awards</a><a href="blog.html">Insights &amp; Blog</a></div>
            <div class="footer__col"><strong>Participate</strong><a href="javascript:void(0)" onclick="openInterestModal()">Express Interest</a><a href="submit-paper.html">Submit Abstract</a><a href="speaker-form.html">Apply as Speaker</a><a href="committee-form.html">Join Committee</a><a href="register.html">Register Delegate</a></div>
            <div class="footer__col"><strong>Information</strong><a href="downloads.html">Brochure &amp; Downloads</a><a href="media.html">Media &amp; Press</a><a href="privacy.html">Privacy Policy</a><a href="refund.html">Refund Policy</a><a href="contact.html">Contact Us</a></div>
          </div>
          <div class="footer__trust">
            <div class="footer__payment-methods"><img src="assets/Visa Inc._idDUM8TcN7_1.png" alt="Visa" /><img src="assets/Mastercard_Symbol_1.png" alt="Mastercard" /><img src="assets/idzRNcC9U5_logos.png" alt="BHIM UPI" /><img class="payment-logo payment-logo--gpay" src="assets/gpay-logo.png" alt="Google Pay" /></div>
            <div class="footer__protection"><img class="protection-logo protection-logo--website" src="assets/idITJgioup_logos.png" alt="Website Protection" /><img class="protection-logo protection-logo--msme" src="assets/idUAcNCLcQ_logos.png" alt="MSME Verified" /><img src="assets/App QR.png" alt="ScholarVault QR code" style="height:28px;border-radius:4px" /></div>
          </div>
          <div class="footer__bottom"><p>&copy; 2026 SVRIAS &bull; ScholarVault. All rights reserved.</p><div class="footer__bottom-links"><a href="privacy.html">Privacy Policy</a><a href="refund.html">Refund Policy</a><a href="contact.html">Contact Desk</a></div></div>
        </div>
      </footer>`;
  }
}
/**
 * Express Interest Modal
 * Lightweight popup with Name, Email, WhatsApp — injected on every page.
 */
function injectInterestModal() {
  if (document.getElementById("interestModalOverlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "interestModalOverlay";
  overlay.className = "interest-modal-overlay";
  overlay.innerHTML = `
    <div class="interest-modal" id="interestModal">
      <button type="button" class="interest-modal__close" onclick="closeInterestModal()" aria-label="Close">&times;</button>
      <div class="interest-modal__header">
        <h3>Express Interest</h3>
        <p>Stay connected with SVRIAS 2026 updates, deadlines, and early bird offers.</p>
      </div>
      <form id="interestModalForm">
        <div class="field">
          <label for="imName">Full Name <span class="req">*</span></label>
          <input id="imName" name="name" required placeholder="Dr. Jane Smith" />
        </div>
        <div class="field">
          <label for="imEmail">Email Address <span class="req">*</span></label>
          <input id="imEmail" name="email" type="email" required placeholder="jane.smith@institution.edu" />
        </div>
        <div class="field">
          <label for="imWhatsapp">WhatsApp Number <span class="req">*</span></label>
          <input id="imWhatsapp" name="whatsapp" type="tel" required placeholder="+91 98765 43210" pattern="[+]?[0-9\\s\\-]{10,15}" title="Enter a valid phone number (10-15 digits)" />
        </div>
        <button class="btn btn-primary btn-lg interest-modal__submit form-submit" type="submit">
          Submit <i data-lucide="arrow-right"></i>
        </button>
      </form>
      <div class="form-success">
        <div class="form-success__icon"><i data-lucide="check-circle-2"></i></div>
        <div class="form-success__title">Interest Logged!</div>
        <p class="form-success__text">Thank you for connecting with SVRIAS 2026. We'll keep you updated on deadlines, speakers, and early bird offers.</p>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeInterestModal();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeInterestModal();
  });
  if (window.lucide) lucide.createIcons();
  setupInboundLeadForm("interestModalForm", "interestModal", "interest", "Thank you for expressing interest!");
}

function openInterestModal() {
  injectInterestModal();
  const overlay = document.getElementById("interestModalOverlay");
  if (overlay) {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.getElementById("hamburger");
    if (mobileMenu && mobileMenu.classList.contains("open")) {
      mobileMenu.classList.remove("open");
      if (hamburger) hamburger.classList.remove("open");
      document.body.style.overflow = "";
    }
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    if (window.lucide) lucide.createIcons();
  }
}

function closeInterestModal() {
  const overlay = document.getElementById("interestModalOverlay");
  if (overlay) {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

/**
 * Navbar & Mobile Drawer Controller
 */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!navbar) return;

  const onScroll = () => {
    const isScrolled = window.scrollY > 20;
    navbar.classList.toggle("scrolled", isScrolled);
  };
  onScroll();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    onScroll();
  }, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!navbar.contains(target) && !mobileMenu.contains(target)) {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/**
 * Scroll Progress Bar Top Indicator
 */
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const update = () => {
    const doc = document.documentElement;
    const height = doc.scrollHeight - doc.clientHeight;
    const width = height > 0 ? (doc.scrollTop / height) * 100 : 0;
    bar.style.width = `${width}%`;
  };
  update();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Scroll to Top Floating Button
 */
function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>';
  document.body.appendChild(btn);

  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
  onScroll();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * IntersectionObserver Reveal Animations
 */
function initReveal() {
  const nodes = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger");
  if (!nodes.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  nodes.forEach((node) => observer.observe(node));
}

/**
 * FAQ Accordion Controller
 */
function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector("button");
    const body = item.querySelector(".faq-item__body");
    if (!btn || !body) return;

    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : "0px";
    });
  });
}

/**
 * Currency Switcher (INR / USD)
 */
function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  const registrationCurrency = document.querySelector('#registrationForm [name="currency"]');
  if (registrationCurrency) registrationCurrency.value = currency;
  document.querySelectorAll(".price-inr").forEach((node) => {
    node.style.display = currency === "INR" ? "inline" : "none";
  });
  document.querySelectorAll(".price-usd").forEach((node) => {
    node.style.display = currency === "USD" ? "inline" : "none";
  });
  document.querySelectorAll(".currency-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.currency === currency);
  });
  const selectedCategory = document.querySelector("[data-registration-category].is-selected");
  const summaryPrice = document.getElementById("registrationSummaryPrice");
  if (selectedCategory && summaryPrice) summaryPrice.textContent = selectedCategory.dataset[`price${currency}`] || "Price confirmed securely";
}

async function detectCurrency() {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(2500) });
    const data = await res.json();
    currentCurrency = data.country_code === "IN" ? "INR" : "USD";
  } catch (_) {
    currentCurrency = "INR";
  }
  updateCurrencyDisplay(currentCurrency);
}

function initCurrencyToggle() {
  const buttons = document.querySelectorAll(".currency-btn");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.currency || "INR";
      updateCurrencyDisplay(selected);
    });
  });

  detectCurrency();
}

/**
 * Toast Notification System
 */
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 300);
  }, 3600);
}

/**
 * Form Handling & UI Feedback Helper
 */
function setupForm(formId, wrapId, successToastMsg) {
  const form = document.getElementById(formId);
  const wrap = document.getElementById(wrapId);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector(".form-submit");
    const originalText = submitBtn ? submitBtn.innerHTML : "Submit";

    try {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
      }

      // Smooth client-side processing delay
      await new Promise((r) => setTimeout(r, 600));

      form.style.display = "none";
      if (wrap) {
        const successEl = wrap.querySelector(".form-success");
        if (successEl) successEl.classList.add("show");
      }

      showToast(successToastMsg || "Submission received successfully!", "success");
    } catch (err) {
      showToast("Submission failed. Please try again.", "error");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

function setupInboundLeadForm(formId, wrapId, source, successToastMsg) {
  const form = document.getElementById(formId);
  const wrap = document.getElementById(wrapId);
  if (!form) return;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const submitBtn = form.querySelector(".form-submit");
    const originalText = submitBtn ? submitBtn.innerHTML : "Submit";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="spinner"></span> Sending...'; }
    const fields = {};
    new FormData(form).forEach((value, key) => { if (typeof value === "string" && key !== "website") fields[key] = value; });
    const fullName = fields.name || [fields.first_name, fields.last_name].filter(Boolean).join(" ");
    try {
      const leadSource = form.dataset.leadSource || source;
      const response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/research-integrity-responsible-ai-summit-2026/leads`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: leadSource, name: fullName, email: fields.email, institution: fields.institution || fields.organization || fields.affiliation, message: fields.message || fields.notes || null, fields: { ...fields, page_url: window.location.href, cta_source: form.dataset.ctaSource || "brochure", resource_url: form.dataset.resourceUrl || null, resource_label: form.dataset.resourceLabel || null } }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "We could not save your enquiry.");
      form.style.display = "none";
      if (source === "brochure_download") {
        const successText = wrap && wrap.querySelector(".form-success__text");
        const resourceUrl = form.dataset.resourceUrl || "brochure.html";
        const resourceLabel = form.dataset.resourceLabel || "conference brochure";
        if (successText) successText.innerHTML = "Thank you. Your " + resourceLabel + " is ready. <a href=\"" + resourceUrl + "\" target=\"_blank\" rel=\"noopener\" class=\"form-success__link\">Open resource</a>. <a href=\"index.html\" class=\"form-success__link\">Return to homepage</a>.";
      }
      const successEl = wrap && wrap.querySelector(".form-success");
      if (successEl) successEl.classList.add("show");
      showToast(successToastMsg, "success");
    } catch (error) {
      showToast(error.message || "Submission failed. Please try again.", "error");
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalText; }
    }
  });
}

/**
 * Send operational conference actions to ScholarVault V2.
 * The static website remains the public experience; authenticated records are
 * created and tracked inside the conference operating platform.
 */
function getScholarVaultAppOrigin() {
  if (window.SCHOLARVAULT_APP_ORIGIN) return window.SCHOLARVAULT_APP_ORIGIN;

  // The standalone conference website stays independent. For local testing it
  // hands off to the local V2 app; production uses the ScholarVault app domain.
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }
  return "https://app.scholarvault.in";
}

function formValues(form) {
  const values = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === "string") values[key] = value.trim();
  });
  return values;
}

async function submitRoleApplication(form, applicationType) {
  const values = formValues(form);
  const selectedTracks = Object.entries(values)
    .filter(([key, value]) => key.startsWith("track_") && value === "yes")
    .map(([key]) => key.replace("track_", "Track "))
    .join(", ");
  const payload = {
    application_type: applicationType,
    full_name: values.full_name || values.name,
    institutional_email: values.institutional_email || values.email,
    institution: values.institution || values.affiliation,
    country: values.country,
    bio: values.bio || values.motivation,
    expertise: values.expertise || values.areas_of_expertise || selectedTracks || values.role_preference,
    profile_url: values.profile_url || values.linkedin || values.orcid || values.scholar_url,
    proposed_contribution: values.proposed_contribution || values.proposed_topic || values.contribution || values.abstract || values.talk_title,
    profile_consent: form.querySelector('[name="profile_consent"]')?.checked || false,
    website: values.website || ""
  };
  const response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/research-integrity-responsible-ai-summit-2026/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Application could not be saved.");
  return result;
}

function setupPlatformForm(formId, destination, options = {}) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitButton = form.querySelector(".form-submit");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner"></span> Connecting to ScholarVault...';
    }
    try {
      const values = formValues(form);
      if (options.leadSource === "registration_intent") {
        const attemptKey = "sv:public-attempt:research-integrity-responsible-ai-summit-2026:registration";
        let attemptId = window.sessionStorage.getItem(attemptKey);
        if (!attemptId) {
          attemptId = crypto.randomUUID();
          window.sessionStorage.setItem(attemptKey, attemptId);
        }
        const leadResponse = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/research-integrity-responsible-ai-summit-2026/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "registration_intent",
            name: values.name,
            email: values.email,
            institution: values.institution,
            message: values.message || null,
            fields: {
              attempt_id: attemptId,
              phone: values.phone || null,
              country: values.country || null,
              category_id: values.category_id || null,
              category_code: values.category_code || null,
              query_type: values.query_type || null,
              currency: values.currency || null,
              page_url: window.location.href,
              cta_source: "registration_starter"
            }
          })
        });
        const leadResult = await leadResponse.json().catch(() => ({}));
        if (!leadResponse.ok) throw new Error(leadResult.error || "We could not save your registration details.");
        values.attempt_id = attemptId;
      }
      if (options.action && window.ScholarVaultConferences) {
        window.ScholarVaultConferences.open(options.action, values);
        if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = options.buttonLabel || "Continue securely"; }
        return;
      }
      if (options.applicationType) {
        await submitRoleApplication(form, options.applicationType);
        form.reset();
        showToast("Application received. Check your email for confirmation.", "success");
        if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = options.buttonLabel || "Submit application"; }
        return;
      }
      window.location.assign(`${getScholarVaultAppOrigin()}${destination}`);
    } catch (error) {
      showToast(error.message || "We could not connect this form. Please try again.", "error");
      if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = options.buttonLabel || "Try again"; }
    }
  });
}

function initRegistrationStarter() {
  const form = document.getElementById("registrationForm");
  if (!form) return;
  const cards = Array.from(document.querySelectorAll("[data-registration-category]"));
  const categoryInput = form.querySelector('[name="query_type"]');
  const categoryIdInput = form.querySelector('[name="category_id"]');
  const categoryCodeInput = form.querySelector('[name="category_code"]');
  const currencyInput = form.querySelector('[name="currency"]');
  const summaryName = document.getElementById("registrationSummaryName");
  const summaryPrice = document.getElementById("registrationSummaryPrice");
  const continueButton = document.getElementById("registrationContinue");
  const selectCard = (card) => {
    cards.forEach((item) => {
      const selected = item === card;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-checked", String(selected));
    });
    categoryInput.value = card.dataset.categoryName || "";
    categoryIdInput.value = card.dataset.categoryId || "";
    categoryCodeInput.value = card.dataset.categoryCode || "";
    const currency = currencyInput.value || "INR";
    summaryName.textContent = card.dataset.categoryName || "Select a category";
    summaryPrice.textContent = card.dataset[`price${currency}`] || "Price confirmed securely";
    continueButton.disabled = false;
  };
  cards.forEach((card) => {
    card.addEventListener("click", () => selectCard(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectCard(card); }
    });
  });
  document.querySelectorAll(".currency-btn").forEach((button) => {
    button.addEventListener("click", () => {
      currencyInput.value = button.dataset.currency || "INR";
      const selected = cards.find((card) => card.classList.contains("is-selected"));
      if (selected) selectCard(selected);
    });
  });
  fetch(`${getScholarVaultAppOrigin()}/api/conferences/research-integrity-responsible-ai-summit-2026/public-registration-options`)
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then((result) => {
      cards.forEach((card) => {
        const options = (result.categories || []).filter((item) => String(item.code || "").toLowerCase() === String(card.dataset.categoryCode || "").toLowerCase());
        for (const option of options) {
          card.dataset.categoryId = option.id;
          card.dataset[`price${option.currency}`] = `${option.currency === "INR" ? "₹" : "$"}${Number(option.amount).toLocaleString("en-IN")}`;
        }
      });
    })
    .catch(() => undefined);
}

function initSocialDock() {
  const dock = document.getElementById("socialDock");
  const toggle = document.getElementById("socialDockToggle");
  const close = document.getElementById("socialDockClose");
  if (!dock || !toggle) return;
  const setOpen = (open) => {
    dock.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (open) dock.querySelector("a,button")?.focus();
    else if (document.activeElement && dock.contains(document.activeElement)) toggle.focus();
  };
  toggle.addEventListener("click", () => setOpen(!dock.classList.contains("open")));
  if (close) close.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dock.classList.contains("open")) setOpen(false);
  });
  document.addEventListener("pointerdown", (event) => {
    if (dock.classList.contains("open") && !dock.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
  });
}

function initCountryFields() {
  const fields = Array.from(document.querySelectorAll('input[name*="country" i]'));
  if (!fields.length || document.getElementById("sv-country-options")) return;
  const codes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW".split(" ");
  const names = new Intl.DisplayNames([document.documentElement.lang || "en"], { type: "region" });
  const list = document.createElement("datalist");
  list.id = "sv-country-options";
  codes.map((code) => names.of(code)).filter(Boolean).sort().forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    list.appendChild(option);
  });
  document.body.appendChild(list);
  fields.forEach((field) => {
    field.setAttribute("list", list.id);
    field.setAttribute("autocomplete", "country-name");
    if (!field.placeholder || field.placeholder.toLowerCase().includes("e.g.")) field.placeholder = "Start typing a country";
  });
}

/**
 * Universal Download Modal
 */
function initDownloadModal() {
  const modal = document.getElementById("downloadModal");
  if (!modal) return;

  const closeBtn = modal.querySelector(".modal-close");
  const downloadBtns = document.querySelectorAll("[data-download]");

  downloadBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const form = modal.querySelector("#downloadForm");
      const success = modal.querySelector(".form-success");
      if (form) {
        form.dataset.resourceUrl = btn.dataset.resourceUrl || "brochure.html";
        form.dataset.resourceLabel = btn.dataset.resourceLabel || "conference brochure";
        form.dataset.ctaSource = btn.dataset.ctaSource || "downloads_page";
        form.style.display = "";
        form.reset();
      }
      if (success) success.classList.remove("show");
      modal.classList.add("open");
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("open");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      modal.classList.remove("open");
    }
  });

  setupInboundLeadForm("downloadForm", "downloadModal", "brochure_download", "Thank you. Your requested resource is ready.");
}

/**
 * File Dropzone Display Helper
 */
function initFileDropZone() {
  const fileInput = document.getElementById("paperFile");
  const nameDisplay = document.getElementById("fileNameDisplay");
  if (!fileInput || !nameDisplay) return;

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      nameDisplay.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
    } else {
      nameDisplay.textContent = "";
    }
  });
}

/**
 * Countdown Timer
 */
function initCountdown() {
  const timer = document.getElementById("countdown");
  if (!timer) return;

  const target = SV_CONFIG.paperDeadline.getTime();

  const update = () => {
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      timer.innerHTML = "<span>Submissions Closed</span>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById("cdDays");
    const hEl = document.getElementById("cdHours");
    const mEl = document.getElementById("cdMins");
    const sEl = document.getElementById("cdSecs");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  };

  update();
  setInterval(update, 1000);
}

// Global Site Object Export
window.SVSite = {
  config: SV_CONFIG,
  showToast: showToast,
  updateCurrency: updateCurrencyDisplay
};

// Initialize Everything on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollProgress();
  initScrollTop();
  initReveal();
  initFaq();
  initCurrencyToggle();
  initDownloadModal();
  initFileDropZone();
  initCountdown();
  initSocialDock();
  initCountryFields();

  // Setup all standard forms
  setupInboundLeadForm("contactForm", "contactWrap", "contact", "Message sent! We'll reply within 24-48 hours.");
  setupPlatformForm("speakerForm", "/conferences/research-integrity-responsible-ai-summit-2026/apply/speaker", { applicationType: "speaker", buttonLabel: "Submit speaker application" });
  setupPlatformForm("committeeForm", "/conferences/research-integrity-responsible-ai-summit-2026/apply/committee", { applicationType: "committee", buttonLabel: "Submit committee application" });
  setupInboundLeadForm("interestForm", "interestWrap", "interest", "Thank you for expressing interest!");
  setupPlatformForm("paperForm", "/dashboard/conferences/research-integrity-responsible-ai-summit-2026/submit", { action: "submit", buttonLabel: "Continue to secure submission" });
  setupPlatformForm("registrationForm", "/dashboard/conferences/research-integrity-responsible-ai-summit-2026/register", { action: "register", leadSource: "registration_intent", buttonLabel: "Continue to registration" });
  setupInboundLeadForm("awardForm", "awardWrap", "award_nomination", "Award nomination submitted!");
  setupInboundLeadForm("newsletterForm", "newsletterWrap", "newsletter", "Subscribed to conference updates!");
  initRegistrationStarter();

  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
});
