/* ═══════════════════════════════════════════════════════════
   SCHOLAR VAULT CONFERENCE — main.js
   Conference: ICAES 2026 (greentech.scholarvault.in)
   ═══════════════════════════════════════════════════════════ */

const EMAIL_FN = '/api/send-email';

const SV_CONFIG = {
  supabaseUrl:  'https://ldoirjupetkmldibhygk.supabase.co',
  supabaseKey:  'sb_publishable__pTXUoNZpTtG73FwKktcSQ_13VNtkAt',
  confId:       'greentech',
  confName:     'ICAES 2026',
  confFullName: 'International Conference on AI for Environmental Sustainability',
  confDate:     new Date('2026-11-01T09:00:00'), // TBD — Q4 2026 placeholder
  earlyBirdDate:new Date('2026-09-30T23:59:59'),
  paperDeadline:new Date('2026-09-15T23:59:59'),
  adminEmail:   'conferences@scholarvault.in',
  gaId:         'G-XXXXXXXXXX',
  clarityId:    'XXXXXXXXXX',
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const { createClient } = supabase;
const db = createClient(SV_CONFIG.supabaseUrl, SV_CONFIG.supabaseKey);

/* ── NAVBAR ── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!navbar) return;
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 20); }, { passive:true });
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => { mobileMenu.classList.toggle('open'); hamburger.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!navbar.contains(e.target)) { mobileMenu.classList.remove('open'); hamburger.classList.remove('open'); } });
  }
  const links = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
  const currentPath = location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === '/' && (currentPath === '/' || currentPath === ''))) link.classList.add('active');
  });
}

/* ── COUNTDOWN ── */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  function update() {
    const diff = SV_CONFIG.confDate - new Date();
    if (diff <= 0) { el.innerHTML = '<span style="color:var(--emerald);font-weight:700;">Conference is Live!</span>'; return; }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent    = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2,'0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
  }
  update(); setInterval(update, 1000);
}

/* ── HERO MEDIA ── */
function initHeroSpotlight() {
  if (reduceMotion) return;
  const hero = document.querySelector(".hero");
  const spotlight = document.querySelector(".hero__spotlight");
  if (!hero || !spotlight) return;
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = event.clientX - rect.left - spotlight.clientWidth / 2;
    const y = event.clientY - rect.top - spotlight.clientHeight / 2;
    spotlight.style.transform = `translate3d(${x}px, ${y}px, 0)`;
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
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
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

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("pagehide", () => window.cancelAnimationFrame(raf), { once: true });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.stagger-children').forEach(el => observer.observe(el));
}

/* ── TOAST ── */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; container.className = 'toast-container'; document.body.appendChild(container); }
  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A878" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icons[type]||icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, duration);
}

/* ── MODAL ── */
function openModal(id) { const o = document.getElementById(id); if(o) o.classList.add('open'); document.body.style.overflow='hidden'; }
function closeModal(id) { const o = document.getElementById(id); if(o) o.classList.remove('open'); document.body.style.overflow=''; }
document.addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); document.body.style.overflow=''; } });

/* ── CURRENCY ── */
let currentCurrency = 'INR';
async function detectCurrency() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    if (data.country_code && data.country_code !== 'IN') { currentCurrency = 'USD'; updateCurrencyDisplay('USD'); }
  } catch (_) {}
}
function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  document.querySelectorAll('.price-inr').forEach(el => { el.style.display = currency==='INR' ? 'block' : 'none'; });
  document.querySelectorAll('.price-usd').forEach(el => { el.style.display = currency==='USD' ? 'block' : 'none'; });
  document.querySelectorAll('.currency-btn').forEach(btn => { btn.classList.toggle('active', btn.dataset.currency === currency); });
}
function initCurrencyToggle() {
  document.querySelectorAll('.currency-btn').forEach(btn => { btn.addEventListener('click', () => updateCurrencyDisplay(btn.dataset.currency)); });
  detectCurrency();
}

/* ── FORM HELPERS ── */
function setFormLoading(form, loading) {
  const btn = form.querySelector('.form-submit'); if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading ? '<span class="spinner"></span> Submitting...' : (btn.dataset.defaultText || 'Submit');
}
function showFormSuccess(form) {
  const formEl = form.querySelector('form, .form-fields');
  const successEl = form.querySelector('.form-success');
  if (formEl) formEl.style.display = 'none';
  if (successEl) successEl.classList.add('show');
}
function trackEvent(eventName, params = {}) { if (typeof gtag !== 'undefined') gtag('event', eventName, { conference: SV_CONFIG.confId, ...params }); }
async function sendEmail(type, data) { try { await fetch(EMAIL_FN, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type,data}) }); } catch(err) { console.warn('Email send failed:',err.message); } }
async function insertRecord(table, data) { const {error} = await db.from(table).insert({ conf_id: SV_CONFIG.confId, ...data }); if (error) throw error; }

/* ── SUBSCRIBE ── */
async function handleSubscribe(email, name, sourceEl) {
  if (!email || !email.includes('@')) { showToast('Please enter a valid email.','error'); return; }
  try {
    await insertRecord('conf_subscribers', { email, name: name||'Subscriber' });
    showToast('Subscribed! You will receive conference updates.','success');
    trackEvent('subscribe',{method:'form'});
    sendEmail('subscribe',{email,name:name||''});
    if (sourceEl) sourceEl.reset();
  } catch(e) {
    if (e.code === '23505') { showToast('You are already subscribed!','info'); sendEmail('subscribe',{email,name:name||''}); }
    else showToast('Could not subscribe. Please try again.','error');
  }
}

/* ── DOWNLOAD POPUP ── */
function initDownloadButtons() {
  document.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal('downloadModal'); document.getElementById('downloadModal').dataset.type = btn.dataset.download; });
  });
  const downloadForm = document.getElementById('downloadForm');
  if (!downloadForm) return;
  downloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(downloadForm);
    const data = { name:fd.get('name'), email:fd.get('email'), phone:fd.get('phone'), institution:fd.get('institution'), type:document.getElementById('downloadModal')?.dataset.type||'brochure' };
    try {
      setFormLoading(document.getElementById('downloadModal'), true);
      await insertRecord('conf_downloads', data);
      sendEmail('download', data);
      closeModal('downloadModal');
      showToast('✅ Check your email! The document has been sent.','success');
      trackEvent('download',{type:data.type});
      downloadForm.reset();
    } catch(_) { showToast('Submission failed. Please try again.','error'); }
    finally { setFormLoading(document.getElementById('downloadModal'), false); }
  });
}

/* ── ANALYTICS ── */
function loadAnalytics() {
  if (SV_CONFIG.gaId && SV_CONFIG.gaId !== 'G-XXXXXXXXXX') {
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${SV_CONFIG.gaId}`; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || []; window.gtag = function(){ window.dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', SV_CONFIG.gaId);
  }
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a,button,[data-track]'); if (!target) return;
    const label = target.dataset.track || target.textContent.trim().substring(0,50);
    trackEvent('click',{element:label,page:location.pathname});
  });
}

/* ── DEADLINES ── */
function initDeadlines() {
  const el = document.getElementById('paperDeadlineUrgency'); if (!el) return;
  const diff = SV_CONFIG.paperDeadline - new Date();
  if (diff > 0) {
    const days = Math.floor(diff / 86400000);
    el.textContent = days <= 7 ? `⚡ Only ${days} day${days!==1?'s':''} left!` : `${days} days remaining`;
    if (days <= 7) el.style.color = '#EF4444';
  } else { el.textContent = 'Submission closed'; el.style.color = 'var(--text-muted)'; }
}

/* ── ICONS ── */
function initIcons() { if (typeof lucide !== 'undefined') lucide.createIcons(); }

/* ── SCROLL PROGRESS ── */
function initScrollProgress() {
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrollTop / height * 100) + '%';
  }, { passive:true });
}

/* ── RIPPLE ── */
function initRipple() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-primary,.btn-register,.form-submit,.btn-outline'); if (!btn) return;
    const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span'); ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
    btn.appendChild(ripple); setTimeout(() => ripple.remove(), 700);
  });
}

/* ── PAGE ENTER ── */
function initPageEnter() {
  document.body.style.opacity = '1';
  window.addEventListener('pageshow', () => { document.body.style.opacity = '1'; });
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]'); if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.startsWith('tel') || link.target === '_blank') return;
    e.preventDefault(); document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 280);
  });
}

/* ── SUCCESS ICONS ── */
function initSuccessIcons() {
  document.querySelectorAll('.form-success').forEach(el => {
    if (el.querySelector('.form-success__icon-wrap')) return;
    const wrap = document.createElement('div'); wrap.className = 'form-success__icon-wrap';
    wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    el.insertAdjacentElement('afterbegin', wrap);
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initHeroVideo();
  initHeroSpotlight();
  initHeroParticles();
  initReveal();
  initCurrencyToggle();
  initDownloadButtons();
  initDeadlines();
  loadAnalytics();
  initIcons();
  initScrollProgress();
  initRipple();
  initPageEnter();
  initSuccessIcons();
  document.querySelectorAll('.form-submit').forEach(btn => { btn.dataset.defaultText = btn.innerHTML; });
});
