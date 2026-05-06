const EMAIL_FN = "/api/send-email";
const SV_CONFIG = {
  supabaseUrl: "https://ldoirjupetkmldibhygk.supabase.co",
  supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2lyanVwZXRrbWxkaWJoeWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMyOTQsImV4cCI6MjA4NzYwOTI5NH0.i_ocMG3EVLDOycUHfe3Met2Bbg0UdqXzUBqrDY_LKd4",
  confId: "icaes2026",
  confName: "ISIAI-SGS 2026",
  confFullName: "International Conference on Interdisciplinary AI and Sustainable Global Systems",
  confDate: new Date("2026-10-15T09:00:00"),
  paperDeadline: new Date("2026-08-30T23:59:59"),
  earlyBirdDate: new Date("2026-09-15T23:59:59"),
  adminEmail: "conferences@scholarvault.in",
  rootUrl: "https://isiaisgs2026.scholarvault.in",
  gaId: "G-NBGSGZV5D1",
  clarityId: "wh5ekajcop",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const { createClient } = supabase;
const db = createClient(SV_CONFIG.supabaseUrl, SV_CONFIG.supabaseKey);
let currentCurrency = "INR";

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!navbar) return;

  const onScroll = () => {
    const isScrolled = window.scrollY > 20;
    navbar.classList.toggle("scrolled", isScrolled);
    if (isScrolled) {
      navbar.style.top = "0";
    } else {
      navbar.style.top = window.innerWidth > 760 ? "35px" : "35px";
    }
  };
  onScroll();

  // ⚡ BOLT: Throttle scroll and resize events using rAF to prevent layout thrashing and high CPU usage.
  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", !isExpanded);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!navbar.contains(target)) {
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

  // ⚡ BOLT: Throttle scroll events using rAF to ensure smooth main thread performance.
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

function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>';
  document.body.appendChild(btn);

  const onScroll = () => btn.classList.toggle("visible", window.scrollY > 400);
  onScroll();

  // ⚡ BOLT: Prevent continuous scroll events from blocking the main thread during fast scrolling.
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
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  nodes.forEach((node) => observer.observe(node));
}

function initParallax() {
  if (reduceMotion) return;
  const items = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!items.length) return;
  const update = () => {
    const vh = window.innerHeight;
    items.forEach((item) => {
      const speed = Number(item.getAttribute("data-parallax")) || 0.08;
      const rect = item.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
      item.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  };
  update();

  // ⚡ BOLT: Throttle scroll and resize events to prevent parallax calculations from degrading scroll frame rate.
  let ticking = false;
  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });
}

function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const button = item.querySelector("button");
    const body = item.querySelector(".faq-item__body");
    if (!button || !body) return;
    button.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      body.style.maxHeight = open ? `${body.scrollHeight}px` : "0px";
      // PALETTE: Add aria-expanded for accessibility state tracking
      button.setAttribute("aria-expanded", open.toString());
    });
  });
}

function initHeroSpotlight() {
  if (reduceMotion) return;
  const hero = document.querySelector(".hero");
  const spotlight = document.querySelector(".hero__spotlight");
  if (!hero || !spotlight) return;

  // ⚡ BOLT: Throttle pointermove with requestAnimationFrame to prevent high CPU usage
  let ticking = false;
  let lastX = 0;
  let lastY = 0;

  hero.addEventListener("pointermove", (event) => {
    lastX = event.clientX;
    lastY = event.clientY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = lastX - rect.left - spotlight.clientWidth / 2;
        const y = lastY - rect.top - spotlight.clientHeight / 2;
        spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initHeroVideo() {
  const hero = document.querySelector(".hero");
  const video = document.querySelector("[data-hero-video]");
  if (!hero || !(video instanceof HTMLVideoElement)) return;
  const source = video.dataset.src;
  if (!source || reduceMotion) {
    hero.classList.add("video-fallback");
    return;
  }

  const ready = () => hero.classList.add("video-ready");
  const fallback = () => hero.classList.add("video-fallback");
  video.addEventListener("playing", ready, { once: true });
  video.addEventListener("error", fallback, { once: true });

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
  } else if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      autoStartLoad: true,
      enableWorker: true,
      lowLatencyMode: true,
      capLevelToPlayerSize: true,
    });
    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch(() => null);
    });
    hls.on(window.Hls.Events.ERROR, (_, data) => {
      if (data?.fatal) fallback();
    });
  } else {
    fallback();
  }

  video.play().catch(() => null);
}

function initHeroParticles() {
  if (reduceMotion) return;
  const canvas = document.getElementById("heroCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  let particles = [];
  let raf = 0;
  let isVisible = false;

  function resize() {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    const count = Math.min(90, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 17000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2.2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.3 + 0.08,
    }));
  }

  function draw() {
    if (!isVisible) return;
    context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < 0) particle.x = canvas.offsetWidth;
      if (particle.x > canvas.offsetWidth) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.offsetHeight;
      if (particle.y > canvas.offsetHeight) particle.y = 0;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(152,235,108,${particle.alpha})`;
      context.fill();
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        // BOLT: Optimize O(n^2) loop by avoiding expensive Math.sqrt for particles that are far apart
        const distSq = dx * dx + dy * dy;
        if (distSq < 12100) { // 110 * 110
          const dist = Math.sqrt(distSq);
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(121,245,210,${0.14 * (1 - dist / 110)})`;
          context.lineWidth = 0.8;
          context.stroke();
        }
      }
    }

    raf = window.requestAnimationFrame(draw);
  }

  // BOLT: Use IntersectionObserver to pause off-screen animations and save battery/CPU
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      if (!isVisible) {
        isVisible = true;
        draw();
      }
    } else {
      isVisible = false;
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    }
  }, { threshold: 0 });
  observer.observe(canvas);

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(raf), { once: true });
}

function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;
  const map = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
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

function showToast(message, type = "info", duration = 3600) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#7fe04b" stroke-width="2.3"><path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7"/></svg>',
    error: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fb7185" stroke-width="2.3"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.72 3h16.92a2 2 0 0 0 1.72-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>',
    info: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#7dd3fc" stroke-width="2.3"><circle cx="12" cy="12" r="9"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v5m0-8h.01"/></svg>',
  };
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast__icon">${icons[type] || icons.info}</span><span class="toast__msg"></span>`;
  toast.querySelector('.toast__msg').textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  window.setTimeout(() => {
    toast.classList.remove("show");
    window.setTimeout(() => toast.remove(), 220);
  }, duration);
}

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

async function sendEmail(type, data) {
  try {
    await fetch(EMAIL_FN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, data: { conf_id: SV_CONFIG.confId, confName: SV_CONFIG.confName, ...data } }),
    });
  } catch (error) {
    console.warn("Email failed:", error);
  }
}

async function insertRecord(table, data) {
  const { error } = await db.from(table).insert({ conf_id: SV_CONFIG.confId, ...data });
  if (error) throw error;
}

async function uploadFile(bucket, file, folder = SV_CONFIG.confId) {
  const extension = file.name.split(".").pop();
  const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const { data, error } = await db.storage.from(bucket).upload(safeName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data: publicUrl } = db.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl.publicUrl;
}

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

function initDownloadButtons() {
  document.querySelectorAll("[data-download]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const modal = document.getElementById("downloadModal");
      if (modal) modal.dataset.type = button.dataset.download || "brochure";
      openModal("downloadModal");
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("modal-overlay")) {
      target.classList.remove("open");
      document.body.style.overflow = "";
    }
  });

  const form = document.getElementById("downloadForm");
  const wrap = document.getElementById("downloadModal");
  if (!(form instanceof HTMLFormElement) || !wrap) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
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
      await sendEmail("download", {
        name: data.name,
        email: data.email,
        type: wrap.dataset.type || "brochure",
      });
      form.reset();
      closeModal("downloadModal");
      showToast("The requested resource is on its way to your email.", "success");
      
      if ((wrap.dataset.type || "brochure") === "brochure") {
        window.open('brochure.html?print=true', '_blank');
      }
    } catch {
      showToast("We could not process that request. Please try again.", "error");
    } finally {
      setFormLoading(wrap, false);
    }
  });
}

async function handleSubscribe(email, name = "", sourceForm = null) {
  if (!email || !String(email).includes("@")) {
    showToast("Please enter a valid email address.", "error");
    return;
  }
  try {
    await insertRecord("conf_subscribers", {
      email: String(email).trim(),
      name: String(name || "Subscriber").trim(),
    });
    await sendEmail("subscribe", { email: String(email).trim(), name: String(name).trim() });
    showToast("You're subscribed for ISIAI-SGS updates.", "success");
    if (sourceForm instanceof HTMLFormElement) sourceForm.reset();
  } catch (error) {
    if (error?.code === "23505") {
      showToast("This email is already subscribed.", "info");
      return;
    }
    showToast("Subscription failed. Please try again.", "error");
  }
}

function initSubscribeForms() {
  document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      handleSubscribe(data.email, data.name || "", form);
    });
  });
}

function initPageTransitions() {
  window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-fade-out");
  });
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!(link instanceof HTMLAnchorElement)) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#") || href.startsWith("tel")) return;
    event.preventDefault();
    document.body.classList.add("page-fade-out");
    window.setTimeout(() => {
      window.location.href = href;
    }, reduceMotion ? 0 : 180);
  });
}

function loadAnalytics() {
  if (SV_CONFIG.gaId && SV_CONFIG.gaId !== "G-XXXXXXXXXX") {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${SV_CONFIG.gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", SV_CONFIG.gaId);
  }

  if (SV_CONFIG.clarityId && SV_CONFIG.clarityId !== "XXXXXXXXXX") {
    (function clarity(c, l, a, r, i, t, y) {
      c[a] = c[a] || function q() { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      } else {
        l.head.appendChild(t);
      }
    }(window, document, "clarity", "script", SV_CONFIG.clarityId));
  }
}

window.SVSite = {
  config: SV_CONFIG,
  db,
  openModal,
  closeModal,
  insertRecord,
  sendEmail,
  setFormLoading,
  showFormSuccess,
  showToast,
  trackEvent,
  uploadFile,
  handleSubscribe,
  getCurrency: () => currentCurrency,
};

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initScrollProgress();
  initScrollTop();
  initReveal();
  initParallax();
  initFaq();
  initHeroSpotlight();
  initHeroVideo();
  initHeroParticles();
  initCountdown();
  initCurrencyToggle();
  initDownloadButtons();
  initSubscribeForms();
  initPageTransitions();
  loadAnalytics();
  if (typeof lucide !== "undefined") lucide.createIcons();
});
