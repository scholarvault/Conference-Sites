/**
 * ICBBSB 2026 — Master Client Script
 * International Conference on Bio-AI, Bioeconomy & Sustainable Biomanufacturing
 */

const SV_CONFIG = {
  confId: "icbbsb2026",
  confName: "ICBBSB 2026",
  confFullName: "International Conference on Bio-AI, Bioeconomy & Sustainable Biomanufacturing",
  confDate: new Date("2026-12-18T09:00:00"),
  paperDeadline: new Date("2026-11-15T23:59:59"),
  earlyBirdDate: new Date("2026-11-30T23:59:59"),
  adminEmail: "conferences@scholarvault.in",
  rootUrl: "https://icbbsb2026.scholarvault.in"
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentCurrency = "INR";

/**
 * Navbar Scroll & Mobile Menu Controller
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

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      const isExpanded = hamburger.classList.contains("open");
      hamburger.setAttribute("aria-expanded", String(isExpanded));
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

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileMenu.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/**
 * Scroll Progress Bar
 */
function initScrollProgress() {
  let bar = document.querySelector(".scroll-progress");
  if (!bar) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
  }

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
 * Scroll To Top Floating Button
 */
function initScrollTop() {
  let btn = document.querySelector(".scroll-top");
  if (!btn) {
    btn = document.createElement("button");
    btn.className = "scroll-top";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>';
    document.body.appendChild(btn);
  }

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
 * Scroll Reveal Animations (IntersectionObserver)
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
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

  nodes.forEach((node) => observer.observe(node));
}

/**
 * Interactive FAQ Accordions
 */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector("button");
    const body = item.querySelector(".faq-item__body");
    if (!button || !body) return;

    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : "0px";
      
      const icon = button.querySelector("[data-lucide]");
      if (icon) {
        icon.setAttribute("data-lucide", isOpen ? "minus" : "plus");
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
    });
  });
}

/**
 * Countdown Timer
 */
function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const map = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds")
  };

  const update = () => {
    const diff = SV_CONFIG.confDate - new Date();
    if (diff <= 0) return;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    if (map.days) map.days.textContent = String(days).padStart(2, "0");
    if (map.hours) map.hours.textContent = String(hours).padStart(2, "0");
    if (map.minutes) map.minutes.textContent = String(minutes).padStart(2, "0");
    if (map.seconds) map.seconds.textContent = String(seconds).padStart(2, "0");
  };

  update();
  window.setInterval(update, 1000);
}

/**
 * Currency Switcher (INR / USD)
 */
async function detectCurrency() {
  try {
    const response = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(2000) });
    const data = await response.json();
    currentCurrency = data.country_code === "IN" ? "INR" : "USD";
  } catch (_) {
    currentCurrency = "INR";
  }
  updateCurrencyDisplay(currentCurrency);
}

function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  document.querySelectorAll(".price-inr").forEach((node) => {
    node.style.display = currency === "INR" ? "inline" : "none";
  });
  document.querySelectorAll(".price-usd").forEach((node) => {
    node.style.display = currency === "USD" ? "inline" : "none";
  });
  document.querySelectorAll(".currency-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.currency === currency);
  });
}

function initCurrencyToggle() {
  const buttons = document.querySelectorAll(".currency-btn");
  if (!buttons.length) return;
  buttons.forEach((button) => {
    button.addEventListener("click", () => updateCurrencyDisplay(button.dataset.currency || "INR"));
  });
  detectCurrency();
}

/**
 * Toast Notification System
 */
function showToast(message, type = "info", duration = 3800) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#22c55e" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fb7185" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#4ade80" stroke-width="2.5"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v5m0-8h.01"/></svg>'
  };

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast__icon">${icons[type] || icons.info}</span><span class="toast__msg">${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 260);
  }, duration);
}

/**
 * Modal Handling
 */
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

function initModals() {
  document.querySelectorAll("[data-open-modal]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = button.dataset.openModal;
      openModal(modalId);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = button.closest(".modal-overlay");
      if (modal) closeModal(modal.id);
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("modal-overlay")) {
      target.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.open").forEach((m) => {
        m.classList.remove("open");
      });
      document.body.style.overflow = "";
    }
  });
}

/**
 * Universal Form Submissions with Visual Feedback
 */
function setFormLoading(formRoot, loading, text = "Submitting...") {
  const button = formRoot?.querySelector(".form-submit");
  if (!(button instanceof HTMLButtonElement)) return;
  if (!button.dataset.defaultText) button.dataset.defaultText = button.innerHTML;
  button.disabled = loading;
  button.innerHTML = loading ? `<span class="spinner"></span>${text}` : button.dataset.defaultText;
}

function showFormSuccess(formRoot) {
  const form = formRoot?.querySelector("form");
  const success = formRoot?.querySelector(".form-success");
  if (form) form.style.display = "none";
  if (success) success.classList.add("show");
}

function initForms() {
  // Download Form
  const downloadForm = document.getElementById("downloadForm");
  const downloadModal = document.getElementById("downloadModal");
  if (downloadForm && downloadModal) {
    downloadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      setFormLoading(downloadModal, true, "Sending...");
      await new Promise((r) => setTimeout(r, 600));
      downloadForm.reset();
      closeModal("downloadModal");
      setFormLoading(downloadModal, false);
      showToast("Conference Resource Package sent to your email!", "success");
    });
  }

  // Generic forms: contact, speaker, committee, interest, awards
  const formConfigs = [
    { formId: "contactForm", wrapId: "contactWrap", successMsg: "Your message has been received. Our team will reply shortly." },
    { formId: "speakerForm", wrapId: "speakerWrap", successMsg: "Speaker application submitted successfully! Our committee will review it." },
    { formId: "committeeForm", wrapId: "committeeWrap", successMsg: "Thank you for volunteering! Reviewer credentials received." },
    { formId: "interestForm", wrapId: "interestWrap", successMsg: "Thank you! You will receive priority conference updates." },
    { formId: "awardForm", wrapId: "awardsWrap", successMsg: "Award nomination submitted for jury evaluation." },
    { formId: "registrationForm", wrapId: "registrationWrap", successMsg: "Registration received! Confirmation details dispatched." }
  ];

  formConfigs.forEach(({ formId, wrapId, successMsg }) => {
    const form = document.getElementById(formId);
    const wrap = document.getElementById(wrapId);
    if (!form || !wrap) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      setFormLoading(wrap, true);
      await new Promise((r) => setTimeout(r, 650));
      setFormLoading(wrap, false);
      showFormSuccess(wrap);
      showToast(successMsg, "success");
    });
  });

  // Newsletter Subscriptions
  document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      const btn = form.querySelector("button[type='submit']");
      if (!input || !input.value.includes("@")) {
        showToast("Please enter a valid email address.", "error");
        return;
      }
      const origText = btn ? btn.innerHTML : "";
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner"></span>';
      }
      await new Promise((r) => setTimeout(r, 500));
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
      form.reset();
      showToast("Thank you for subscribing to ICBBSB 2026 announcements!", "success");
    });
  });
}

/**
 * File Dropzone Handling
 */
function initDropZone() {
  const dropZone = document.getElementById("paperDropZone");
  const fileInput = document.getElementById("paperFile");
  const nameDisplay = document.getElementById("fileNameDisplay");
  if (!dropZone || !fileInput) return;

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      if (nameDisplay) {
        nameDisplay.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / (1024 * 1024)).toFixed(2)} MB)`;
      }
    }
  });

  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "var(--accent-primary)";
      dropZone.style.backgroundColor = "rgba(34, 197, 94, 0.12)";
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.style.borderColor = "";
      dropZone.style.backgroundColor = "";
    });
  });

  dropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      fileInput.files = dt.files;
      if (nameDisplay) {
        nameDisplay.textContent = `Selected: ${dt.files[0].name} (${(dt.files[0].size / (1024 * 1024)).toFixed(2)} MB)`;
      }
    }
  });
}

/**
 * Resource Download Buttons
 */
function initDownloadButtons() {
  document.querySelectorAll("[data-download]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("downloadModal");
    });
  });
}

// Global Site Object for inline scripts and tests
window.SVSite = {
  config: SV_CONFIG,
  openModal,
  closeModal,
  setFormLoading,
  showFormSuccess,
  showToast,
  getCurrency: () => currentCurrency
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollProgress();
  initScrollTop();
  initReveal();
  initFaq();
  initCountdown();
  initCurrencyToggle();
  initModals();
  initForms();
  initDropZone();
  initDownloadButtons();
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
  }
});
