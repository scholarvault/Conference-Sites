/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SCHOLAR VAULT CONFERENCE â€” main.js
   Shared JS for all conference pages
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ EMAIL FUNCTION ENDPOINT â”€â”€ */
const EMAIL_FN = '/api/send-email';

/* â”€â”€ CONFIG â”€â”€ */
const SV_CONFIG = {
  supabaseUrl:  'https://ldoirjupetkmldibhygk.supabase.co',
  supabaseKey:  'sb_publishable__pTXUoNZpTtG73FwKktcSQ_13VNtkAt',
  confId:       'aihealth',
  confName:     'ICAHCR 2026',
  confFullName: 'International Conference on AI in Healthcare & Clinical Research',
  confDate:     new Date('2026-08-22T09:00:00'),
  earlyBirdDate:new Date('2026-07-15T23:59:59'),
  paperDeadline:new Date('2026-06-30T23:59:59'),
  adminEmail:   'conferences@scholarvault.in',
  gaId:         'G-XXXXXXXXXX',  // Replace with real GA4 ID
  clarityId:    'XXXXXXXXXX',    // Replace with real Clarity project ID
};

/* â”€â”€ SUPABASE CLIENT (CDN) â”€â”€ */
const { createClient } = supabase;
const db = createClient(SV_CONFIG.supabaseUrl, SV_CONFIG.supabaseKey);

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   NAVBAR
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navbar) return;

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }

  // Active link
  const links = document.querySelectorAll('.navbar__links a, .navbar__mobile a');
  const currentPath = location.pathname;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (href === '/' && (currentPath === '/' || currentPath === ''))) {
      link.classList.add('active');
    }
  });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   COUNTDOWN TIMER
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;

  function update() {
    const now = new Date();
    const diff = SV_CONFIG.confDate - now;
    if (diff <= 0) {
      el.innerHTML = '<span style="color:var(--cyan);font-weight:700;">Conference is Live!</span>';
      return;
    }
    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-days').textContent    = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent   = String(hours).padStart(2,'0');
    document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
}


/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PARTICLE BACKGROUND
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticleSet(); }, { passive: true });

  function initParticleSet() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.1,
      });
    }
  }
  initParticleSet();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.o})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        // Optimization: Avoid expensive Math.sqrt for particles that are far apart
        const distSq = dx*dx + dy*dy;
        if (distSq < 10000) { // 100 * 100
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,102,255,${0.12 * (1 - dist/100)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SCROLL REVEAL
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children').forEach(el => observer.observe(el));
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   TOAST NOTIFICATIONS
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  // SVG icons instead of emoji
  const icons = {
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00e676" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4757" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
  };
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span class="toast__icon">${icons[type] || icons.info}</span><span>${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.classList.add('show'); });
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   MODAL
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}
// Close on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   CURRENCY DETECTION
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
let currentCurrency = 'INR';
async function detectCurrency() {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    // Default to USD for non-India countries
    if (data.country_code && data.country_code !== 'IN') {
      currentCurrency = 'USD';
      updateCurrencyDisplay('USD');
    }
  } catch (_) {
    // Default stays INR
  }
}
function updateCurrencyDisplay(currency) {
  currentCurrency = currency;
  document.querySelectorAll('.price-inr').forEach(el => {
    el.style.display = currency === 'INR' ? 'block' : 'none';
  });
  document.querySelectorAll('.price-usd').forEach(el => {
    el.style.display = currency === 'USD' ? 'block' : 'none';
  });
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currency);
  });
}
function initCurrencyToggle() {
  document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', () => updateCurrencyDisplay(btn.dataset.currency));
  });
  detectCurrency();
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   FORM HELPERS
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function setFormLoading(form, loading) {
  const btn = form.querySelector('.form-submit');
  if (!btn) return;
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="spinner"></span> Submitting...'
    : btn.dataset.defaultText || 'Submit';
}

function showFormSuccess(form) {
  const formEl    = form.querySelector('form, .form-fields');
  const successEl = form.querySelector('.form-success');
  if (formEl) formEl.style.display = 'none';
  if (successEl) successEl.classList.add('show');
}

function trackEvent(eventName, params = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, { conference: SV_CONFIG.confId, ...params });
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   EMAIL HELPER
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function sendEmail(type, data) {
  try {
    await fetch(EMAIL_FN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    // Non-blocking â€” don't prevent form submission if email fails
    console.warn('Email send failed (non-blocking):', err.message);
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   DATABASE HELPERS
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function insertRecord(table, data) {
  const { error } = await db.from(table).insert({ conf_id: SV_CONFIG.confId, ...data });
  if (error) throw error;
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SUBSCRIBE FORM (popup + inline)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
async function handleSubscribe(email, name, sourceEl) {
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email.', 'error'); return;
  }
  try {
    await insertRecord('conf_subscribers', { email, name: name || 'Subscriber' });
    showToast('Subscribed! You will receive conference updates.', 'success');
    trackEvent('subscribe', { method: 'form' });
    // Send welcome email
    sendEmail('subscribe', { email, name: name || '' });
    if (sourceEl) sourceEl.reset();
  } catch (e) {
    if (e.code === '23505') {
      showToast('You are already subscribed!', 'info');
      // Still send welcome even if duplicate (idempotent)
      sendEmail('subscribe', { email, name: name || '' });
    } else {
      showToast('Could not subscribe. Please try again.', 'error');
    }
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   DOWNLOAD POPUP
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initDownloadButtons() {
  document.querySelectorAll('[data-download]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('downloadModal');
      document.getElementById('downloadModal').dataset.type = btn.dataset.download;
    });
  });

  const downloadForm = document.getElementById('downloadForm');
  if (!downloadForm) return;

  downloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(downloadForm);
    const data = {
      name: fd.get('name'), email: fd.get('email'),
      phone: fd.get('phone'), institution: fd.get('institution'),
      type: document.getElementById('downloadModal')?.dataset.type || 'brochure'
    };
    try {
      setFormLoading(document.getElementById('downloadModal'), true);
      await insertRecord('conf_downloads', data);
      // Send download email
      sendEmail('download', data);
      closeModal('downloadModal');
      showToast('âœ… Check your email! The document has been sent.', 'success');
      trackEvent('download', { type: data.type });
      downloadForm.reset();
    } catch (_) {
      showToast('Submission failed. Please try again.', 'error');
    } finally {
      setFormLoading(document.getElementById('downloadModal'), false);
    }
  });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   ANALYTICS & HEATMAP
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function loadAnalytics() {
  // Google Analytics 4
  if (SV_CONFIG.gaId && SV_CONFIG.gaId !== 'G-XXXXXXXXXX') {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${SV_CONFIG.gaId}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', SV_CONFIG.gaId);
  }

  // Microsoft Clarity (Heatmap â€” Free)
  if (SV_CONFIG.clarityId && SV_CONFIG.clarityId !== 'XXXXXXXXXX') {
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", SV_CONFIG.clarityId);
  }

  // Click tracking on all buttons and links
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button, [data-track]');
    if (!target) return;
    const label = target.dataset.track || target.textContent.trim().substring(0,50);
    trackEvent('click', { element: label, page: location.pathname });
  });
}


/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   PAPER DEADLINE URGENCY
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initDeadlines() {
  const el = document.getElementById('paperDeadlineUrgency');
  if (!el) return;
  const now = new Date();
  const diff = SV_CONFIG.paperDeadline - now;
  if (diff > 0) {
    const days = Math.floor(diff / 86400000);
    el.textContent = days <= 7
      ? `âš¡ Only ${days} day${days !== 1 ? 's' : ''} left to submit!`
      : `${days} days remaining`;
    if (days <= 7) el.style.color = 'var(--red)';
  } else {
    el.textContent = 'Submission closed';
    el.style.color = 'var(--white-40)';
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   INIT ALL
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCountdown();
  initParticles();
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

  // Store default button text
  document.querySelectorAll('.form-submit').forEach(btn => {
    btn.dataset.defaultText = btn.innerHTML;
  });
});

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   LUCIDE ICONS INIT
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SCROLL PROGRESS BAR
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initScrollProgress() {
  // Create bar
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (scrollTop / height * 100) + '%';
  }, { passive: true });
}

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   RIPPLE EFFECT
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

/* â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
   SUCCESS ICON INJECTION
   (Injects Lucide check icon into all form-success divs)
   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initSuccessIcons() {
  document.querySelectorAll('.form-success').forEach(el => {
    if (el.querySelector('.form-success__icon-wrap')) return; // already injected
    const wrap = document.createElement('div');
    wrap.className = 'form-success__icon-wrap';
    wrap.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    el.insertAdjacentElement('afterbegin', wrap);
  });
}


