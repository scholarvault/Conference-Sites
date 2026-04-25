/* ==========================================================================
   SCHOLAR VAULT CONFERENCE — main.js (Unified)
   Shared JS for all conference pages
   ========================================================================== */

const EMAIL_FN = "/api/send-email";
const SV_CONFIG = {
  supabaseUrl: "https://ldoirjupetkmldibhygk.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2lyanVwZXRrbWxkaWJoeWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMyOTQsImV4cCI6MjA4NzYwOTI5NH0.i_ocMG3EVLDOycUHfe3Met2Bbg0UdqXzUBqrDY_LKd4",
  confId: "aihealth",
  confName: "ICAHCR 2026",
  confFullName: "International Conference on AI in Healthcare & Clinical Research",
  confDate: new Date("2026-08-22T09:00:00"),
  paperDeadline: new Date("2026-06-30T23:59:59"),
  earlyBirdDate: new Date("2026-07-15T23:59:59"),
  adminEmail: "conferences@scholarvault.in",
  gaId: "",
  clarityId: "",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const { createClient } = supabase;
const db = createClient(SV_CONFIG.supabaseUrl, SV_CONFIG.supabaseKey);
let currentCurrency = "INR";

/* —————————————————————————————————————
   NAVBAR
   ————————————————————————————————————— */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!navbar) return;

  // Scroll effect (throttled with rAF for performance)
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const isScrolled = window.scrollY > 20;
        navbar.classList.toggle("scrolled", isScrolled);
        // Dynamic top spacing
        if (isScrolled) {
          navbar.style.top = "0";
        } else {
          navbar.style.top = "35px";
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
    });

    document.addEventListener("click", (event) => {
      if (!navbar.contains(event.target)) {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Active link highlight
  const links = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
  const currentPath = location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath === '')))) {
      link.classList.add('active');
    }
  });
}

/* —————————————————————————————————————
   PREMIUM FEEDBACK UI (Toasts & Success)
   ————————————————————————————————————— */
function showToast(message, type = "info", duration = 4000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v5m0-8h.01"/></svg>',
  };

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  
  // Trigger animation
  requestAnimationFrame(() => toast.classList.add("show"));
  
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 400);
  }, duration);
}

function setFormLoading(formRoot, loading, text = "Submitting...") {
  const button = formRoot?.querySelector(".form-submit");
  if (!button) return;
  if (!button.dataset.defaultText) button.dataset.defaultText = button.innerHTML;
  button.disabled = loading;
  button.innerHTML = loading ? `<span class="spinner"></span>${text}` : button.dataset.defaultText;
}

function showFormSuccess(formRoot) {
  const form = formRoot?.querySelector("form");
  const success = formRoot?.querySelector(".form-success");
  if (form) form.style.display = "none";
  if (success) success.classList.add("show");
  
  // Re-init icons to catch the newly visible checkmark if any
  if (typeof lucide !== "undefined") lucide.createIcons();
}

/* —————————————————————————————————————
   DATABASE & STORAGE
   ————————————————————————————————————— */
async function insertRecord(table, data) {
  // Automatically inject conf_id for partitioning
  const record = { conf_id: SV_CONFIG.confId, ...data };
  const { error } = await db.from(table).insert([record]);
  if (error) throw error;
}

async function uploadFile(bucket, file, folder = SV_CONFIG.confId) {
  const extension = file.name.split(".").pop();
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const { data, error } = await db.storage.from(bucket).upload(safeName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data: publicUrl } = db.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl.publicUrl;
}

async function sendEmail(type, data) {
  try {
    await fetch(EMAIL_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data, confId: SV_CONFIG.confId }),
    });
  } catch (error) {
    console.warn("Email endpoint error:", error);
  }
}

/* —————————————————————————————————————
   UTILITIES
   ————————————————————————————————————— */
function trackEvent(eventName, params = {}) {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, { conference: SV_CONFIG.confId, ...params });
  }
}

async function detectCurrency() {
  try {
    const response = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(2500) });
    const data = await response.json();
    currentCurrency = data.country_code === "IN" ? "INR" : "USD";
  } catch {
    currentCurrency = "INR";
  }
  updateCurrencyDisplay(currentCurrency);
}

function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  document.querySelectorAll(".price-inr").forEach(node => node.style.display = currency === "INR" ? "inline" : "none");
  document.querySelectorAll(".price-usd").forEach(node => node.style.display = currency === "USD" ? "inline" : "none");
  document.querySelectorAll(".currency-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.currency === currency));
}

function initCurrencyToggle() {
  document.querySelectorAll(".currency-btn").forEach(btn => {
    btn.addEventListener("click", () => updateCurrencyDisplay(btn.dataset.currency || "INR"));
  });
  detectCurrency();
}

function initDownloadButtons() {
  document.querySelectorAll("[data-download]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById("downloadModal");
      if (modal) modal.dataset.type = btn.dataset.download || "brochure";
      openModal("downloadModal");
    });
  });

  const form = document.getElementById("downloadForm");
  const wrap = document.getElementById("downloadModal");
  if (!form || !wrap) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      setFormLoading(wrap, true);
      await insertRecord("conf_downloads", {
        name: data.name,
        email: data.email,
        phone: data.phone,
        institution: data.institution,
        type: wrap.dataset.type || "brochure",
      });
      await sendEmail("download", { ...data, type: wrap.dataset.type || "brochure" });
      form.reset();
      closeModal("downloadModal");
      showToast("Check your email! The document has been sent.", "success");
    } catch {
      showToast("Submission failed. Please try again.", "error");
    } finally {
      setFormLoading(wrap, false);
    }
  });
}

function handleSubscribe(email, name = "", form = null) {
  if (!email || !email.includes("@")) {
    showToast("Please enter a valid email.", "error");
    return;
  }
  insertRecord("conf_subscribers", { email, name: name || "Subscriber" })
    .then(() => {
      showToast("Subscribed successfully!", "success");
      sendEmail("subscribe", { email, name });
      if (form) form.reset();
    })
    .catch(err => {
      if (err.code === "23505") showToast("Already subscribed!", "info");
      else showToast("Subscription failed.", "error");
    });
}

function initSubscribeForms() {
  document.querySelectorAll("[data-subscribe-form]").forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      handleSubscribe(data.email, data.name, form);
    });
  });
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add("open"); document.body.style.overflow = "hidden"; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove("open"); document.body.style.overflow = ""; }
}

function loadAnalytics() {
  if (SV_CONFIG.gaId) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${SV_CONFIG.gaId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", SV_CONFIG.gaId);
  }
  if (SV_CONFIG.clarityId) {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script",SV_CONFIG.clarityId);
  }
}

/* —————————————————————————————————————
   GLOBAL EXPOSURE
   ————————————————————————————————————— */
window.SVSite = {
  config: SV_CONFIG,
  db,
  showToast,
  setFormLoading,
  showFormSuccess,
  insertRecord,
  uploadFile,
  sendEmail,
  trackEvent,
  openModal,
  closeModal,
  handleSubscribe
};

// Also expose common helpers globally for local scripts
window.showToast = showToast;
window.insertRecord = insertRecord;
window.uploadFile = uploadFile;
window.sendEmail = sendEmail;

/* —————————————————————————————————————
   INIT
   ————————————————————————————————————— */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initCurrencyToggle();
  initDownloadButtons();
  initSubscribeForms();
  loadAnalytics();
  initIcons();
  initScrollProgress();
  initRipple();
  initPageEnter();
  initSuccessIcons();

  // Store default button text
  document.querySelectorAll('.form-submit').forEach(btn => {
    btn.dataset.defaultText = btn.innerHTML;
  });
});

/* ──────────────────────────────────────────────────────────────────────────
   LUCIDE ICONS INIT
   ────────────────────────────────────────────────────────────────────────── */
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   SCROLL PROGRESS BAR
   ────────────────────────────────────────────────────────────────────────── */
function initScrollProgress() {
  // Create bar
  if (document.querySelector('.scroll-progress')) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  // Throttle scroll events with rAF to prevent layout thrashing
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        bar.style.width = (scrollTop / height * 100) + '%';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ──────────────────────────────────────────────────────────────────────────
   RIPPLE EFFECT
   ────────────────────────────────────────────────────────────────────────── */
function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary, .btn-register, .form-submit, .btn-outline');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   PAGE ENTRANCE
   ────────────────────────────────────────────────────────────────────────── */
function initPageEnter() {
  // Always guarantee body is visible — set a hard fallback first
  document.body.style.opacity = '1';

  // Fix bfcache: restore visibility when page is loaded from back/forward cache
  window.addEventListener('pageshow', (e) => {
    document.body.style.opacity = '1';
  });

  // Page transition on internal links only
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.startsWith('tel') || link.target === '_blank') return;
    e.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 300);
  });
}

/* ──────────────────────────────────────────────────────────────────────────
   SUCCESS ICON INJECTION
   (Injects check icon into all form-success divs)
   ────────────────────────────────────────────────────────────────────────── */
function initSuccessIcons() {
  document.querySelectorAll('.form-success').forEach(el => {
    if (!el.querySelector('.form-success__icon-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'form-success__icon-wrap';
      wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      el.insertAdjacentElement('afterbegin', wrap);
    }
  });

  if (typeof lucide !== "undefined") lucide.createIcons();
}
