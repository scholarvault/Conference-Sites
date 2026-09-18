const SV_CONFIG = {
  confId: "svrids2027",
  confName: "SVRIDS 2027",
  confFullName: "ScholarVault Research-to-Impact, DeepTech & Startup Summit 2027",
  confDate: new Date("2027-01-15T09:00:00"),
  paperDeadline: new Date("2026-12-10T23:59:59"),
  earlyBirdDate: new Date("2026-12-20T23:59:59"),
  adminEmail: "conferences@scholarvault.in",
  rootUrl: "https://svrids2027.scholarvault.in"
};

let currentCurrency = "INR";
let currentAttendanceMode = "virtual"; // 'virtual' or 'in-person'

window.SVSite = {
  showToast: function (message, type = "info") {
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
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 300ms ease";
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }
};

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
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
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
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );
}

function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>`;
  document.body.appendChild(btn);

  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
  onScroll();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initReveal() {
  const nodes = document.querySelectorAll(
    ".reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger"
  );
  if (!nodes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector("button");
    const body = item.querySelector(".faq-item__body");
    if (!button || !body) return;

    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
      body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : "0px";
    });
  });
}

function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  document.querySelectorAll(".price-inr").forEach((node) => {
    node.style.display = currency === "INR" ? "inline" : "none";
  });
  document.querySelectorAll(".price-usd").forEach((node) => {
    node.style.display = currency === "USD" ? "inline" : "none";
  });
  document.querySelectorAll(".currency-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.currency === currency);
  });
}

function initCurrencyToggle() {
  const buttons = document.querySelectorAll(".currency-btn");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => updateCurrencyDisplay(btn.dataset.currency || "INR"));
  });
  updateCurrencyDisplay(currentCurrency);
}

function updateAttendanceMode(mode) {
  currentAttendanceMode = mode;
  document.querySelectorAll(".tab-btn[data-mode]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  document.querySelectorAll(".tier-virtual").forEach((el) => {
    el.style.display = mode === "virtual" ? "flex" : "none";
  });
  document.querySelectorAll(".tier-in-person").forEach((el) => {
    el.style.display = mode === "in-person" ? "flex" : "none";
  });
}

function initAttendanceToggle() {
  const buttons = document.querySelectorAll(".tab-btn[data-mode]");
  if (!buttons.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => updateAttendanceMode(btn.dataset.mode || "virtual"));
  });
  updateAttendanceMode(currentAttendanceMode);
}

function initCountdown() {
  const container = document.getElementById("countdown");
  if (!container) return;

  const targetDate = SV_CONFIG.confDate.getTime();

  function tick() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      container.innerHTML = "<span>Event in progress / Concluded</span>";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dEl = document.getElementById("countdownDays");
    const hEl = document.getElementById("countdownHours");
    const mEl = document.getElementById("countdownMins");
    const sEl = document.getElementById("countdownSecs");

    if (dEl && hEl && mEl && sEl) {
      dEl.textContent = String(days).padStart(2, "0");
      hEl.textContent = String(hours).padStart(2, "0");
      mEl.textContent = String(mins).padStart(2, "0");
      sEl.textContent = String(secs).padStart(2, "0");
    }
  }

  tick();
  setInterval(tick, 1000);
}

function initModals() {
  const downloadModal = document.getElementById("downloadModal");
  if (!downloadModal) return;

  document.querySelectorAll("[data-download]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadModal.classList.add("open");
    });
  });

  const closeBtn = downloadModal.querySelector(".modal-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      downloadModal.classList.remove("open");
    });
  }

  downloadModal.addEventListener("click", (e) => {
    if (e.target === downloadModal) {
      downloadModal.classList.remove("open");
    }
  });

  const downloadForm = document.getElementById("downloadForm");
  if (downloadForm) {
    downloadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = downloadForm.querySelector("button[type='submit']");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }
      setTimeout(() => {
        downloadModal.classList.remove("open");
        window.SVSite.showToast("Brochure package dispatched to your email!", "success");
        downloadForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Send Resource";
        }
      }, 700);
    });
  }
}

function setupForm(formId, wrapId, successMsg) {
  const form = document.getElementById(formId);
  const wrap = document.getElementById(wrapId);
  if (!form || !wrap) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector(".form-submit") || form.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerHTML : "Submit";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Processing...</span>`;
    }

    setTimeout(() => {
      form.style.display = "none";
      const successEl = wrap.querySelector(".form-success");
      if (successEl) successEl.classList.add("show");
      window.SVSite.showToast(successMsg || "Submitted successfully!", "success");
    }, 600);
  });
}

function initFileDropZone() {
  const dropZone = document.getElementById("paperDropZone");
  const fileInput = document.getElementById("paperFile");
  const nameDisplay = document.getElementById("fileNameDisplay");
  if (!dropZone || !fileInput) return;

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files.length > 0) {
      if (nameDisplay) {
        nameDisplay.textContent = `Selected: ${fileInput.files[0].name} (${(fileInput.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
        nameDisplay.style.display = "block";
      }
    }
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--accent-primary)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "rgba(59, 130, 246, 0.35)";
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(59, 130, 246, 0.35)";
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      if (nameDisplay) {
        nameDisplay.textContent = `Selected: ${e.dataTransfer.files[0].name} (${(e.dataTransfer.files[0].size / 1024 / 1024).toFixed(2)} MB)`;
        nameDisplay.style.display = "block";
      }
    }
  });
}

function initSubscribeForms() {
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector("input[type='email']");
      if (input && input.value) {
        window.SVSite.showToast("Subscribed to SVRIDS 2027 milestone updates!", "success");
        form.reset();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollProgress();
  initScrollTop();
  initReveal();
  initFaq();
  initCurrencyToggle();
  initAttendanceToggle();
  initCountdown();
  initModals();
  initFileDropZone();
  initSubscribeForms();

  setupForm("speakerForm", "speakerWrap", "Speaker nomination received! Our track chairs will contact you.");
  setupForm("committeeForm", "committeeWrap", "Application received! Thank you for joining our peer review panel.");
  setupForm("contactForm", "contactWrap", "Message sent! Our secretariat will reply within 24 hours.");
  setupForm("interestForm", "interestWrap", "Thank you for expressing interest in SVRIDS 2027!");
  setupForm("awardsForm", "awardsWrap", "Award nomination submitted successfully!");
  setupForm("registrationForm", "registerWrap", "Registration interest noted. Check your inbox for booking links.");

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
});
