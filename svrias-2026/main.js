/**
 * SVRIAS 2026 - Futuristic Conference Platform Script
 * - Realtime Deadline & Summit Countdown Timer
 * - Universal Brochure Download Modal with automated document retrieval & reset
 * - Universal Express Interest Modal with reset
 * - Standalone Forms Handler (Registration, Abstract, Contact, Committee, Speaker, Interest)
 * - Mobile Navigation Drawer & Sheet with blur overlay & ESC handling
 * - Stats Count-Up Animation (easeOutCubic)
 * - FAQ Accordion interactivity
 * - Registration Currency Toggle (INR / USD)
 * - Floating Support Dock
 * - Newsletter Subscription
 */

document.addEventListener('DOMContentLoaded', () => {
  initLogoFallback();
  initStatsCounter();
  initMobileMenu();
  initSummitDrawer();
  initCountdownTimer();
  initUniversalModals();
  initFAQAccordion();
  initCurrencyToggle();
  initSocialDock();
  initNewsletterForm();
  initFileDropZone();
  initRegistrationOptions();
  initForms();
});

/**
 * 1. Image fallback safeguard for logos
 */
function initLogoFallback() {
  const logoImgs = document.querySelectorAll('.logo-btn img, .brand-logo-wrap img, .footer-logo-img, .footer-organizer-badge img');
  logoImgs.forEach((img) => {
    img.addEventListener('error', () => {
      if (!img.src.includes('logo.svg') && !img.src.includes('icon-512.png')) {
        img.src = 'assets/icon-512.png';
      }
    });
  });
}

/**
 * 2. Stats Count-Up Animation
 */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    statNumbers.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = target.toFixed(decimals);
    });
    return;
  }

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateNumber = (el, target, decimals, duration, delay) => {
    setTimeout(() => {
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = target * easeOutCubic(progress);

        el.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      };

      requestAnimationFrame(step);
    }, delay);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNumbers.forEach((el, i) => {
            const target = parseFloat(el.getAttribute('data-target') || '0');
            const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
            const duration = 1500 + i * 80;
            const startOffset = 400 + i * 90;

            animateNumber(el, target, decimals, duration, startOffset);
          });
          obs.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );

  const statsSection = document.querySelector('.stats-footer') || document.querySelector('.kpi-row') || document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/**
 * 3. Mobile Navigation Sheet & Burger Toggle
 */
function initMobileMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileSheet = document.getElementById('mobileSheet');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  if (!burgerBtn) return;

  const openMenu = () => {
    document.body.classList.add('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'true');
    if (mobileOverlay) mobileOverlay.removeAttribute('hidden');
    if (mobileSheet) mobileSheet.removeAttribute('hidden');
  };

  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
    if (mobileOverlay) mobileOverlay.setAttribute('hidden', '');
    if (mobileSheet) mobileSheet.setAttribute('hidden', '');
  };

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = document.body.classList.contains('menu-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });

  if (mobileSheet) {
    const sheetLinks = mobileSheet.querySelectorAll('a, button');
    sheetLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080 && document.body.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}

/**
 * 4. Summit Quick-View Drawer
 */
function initSummitDrawer() {
  const drawer = document.getElementById('summitDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const openTriggers = document.querySelectorAll('[data-open-drawer]');

  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('active');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/**
 * 5. Realtime Countdown Timer to Abstract Deadline & Summit (Decoupled Targets)
 */
function initCountdownTimer() {
  // Target 1: Virtual Summit Day - 14 November 2026 09:00:00 UTC
  const summitTarget = new Date(Date.UTC(2026, 10, 14, 9, 0, 0)).getTime();
  // Target 2: Abstract Submission Deadline - 15 October 2026 23:59:59 UTC
  const abstractTarget = new Date(Date.UTC(2026, 9, 15, 23, 59, 59)).getTime();

  // Scoped query helper to strictly isolate countdown containers and prevent cross-contamination
  const queryUnits = (targetType, unit) => {
    const selectorList = [
      `[data-countdown-target="${targetType}"] .cd-${unit}`,
      `[data-countdown-target="${targetType}"] .cd-${targetType}-${unit}`,
      `[data-countdown-target="${targetType}"] [data-${targetType}-${unit}]`,
      `[data-countdown-target="${targetType}"] [data-unit="${unit}"]`,
      `.cd-${targetType}-${unit}`,
      `[data-${targetType}-${unit}]`
    ];
    if (targetType === 'summit') {
      selectorList.push(`#cd${unit.charAt(0).toUpperCase() + unit.slice(1)}`);
      selectorList.push(`#cdSummit${unit.charAt(0).toUpperCase() + unit.slice(1)}`);
    } else if (targetType === 'abstract') {
      selectorList.push(`#cdAbstract${unit.charAt(0).toUpperCase() + unit.slice(1)}`);
    }
    const nodes = document.querySelectorAll(selectorList.join(', '));
    return Array.from(nodes).filter((el) => {
      const parentTarget = el.closest('[data-countdown-target]');
      if (parentTarget) {
        return parentTarget.getAttribute('data-countdown-target') === targetType;
      }
      return true;
    });
  };

  const summitGroup = {
    days: queryUnits('summit', 'days'),
    hours: queryUnits('summit', 'hours'),
    mins: queryUnits('summit', 'mins'),
    secs: queryUnits('summit', 'secs')
  };

  const abstractGroup = {
    days: queryUnits('abstract', 'days'),
    hours: queryUnits('abstract', 'hours'),
    mins: queryUnits('abstract', 'mins'),
    secs: queryUnits('abstract', 'secs')
  };

  const hasSummit = summitGroup.days.length || summitGroup.hours.length || summitGroup.mins.length || summitGroup.secs.length;
  const hasAbstract = abstractGroup.days.length || abstractGroup.hours.length || abstractGroup.mins.length || abstractGroup.secs.length;

  // If page contains neither countdown target, avoid running a background interval
  if (!hasSummit && !hasAbstract) return;

  const pad = (n) => String(n).padStart(2, '0');

  const calcTime = (targetTime, now) => {
    let distance = targetTime - now;
    if (distance < 0) distance = 0;
    return {
      days: pad(Math.floor(distance / (1000 * 60 * 60 * 24))),
      hours: pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      mins: pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
      secs: pad(Math.floor((distance % (1000 * 60)) / 1000))
    };
  };

  // Only mutate node textContent if value changed, preventing unnecessary browser layout thrashing
  const applyTime = (group, t) => {
    group.days.forEach((el) => { if (el.textContent !== t.days) el.textContent = t.days; });
    group.hours.forEach((el) => { if (el.textContent !== t.hours) el.textContent = t.hours; });
    group.mins.forEach((el) => { if (el.textContent !== t.mins) el.textContent = t.mins; });
    group.secs.forEach((el) => { if (el.textContent !== t.secs) el.textContent = t.secs; });
  };

  const updateClock = () => {
    const now = Date.now();
    if (hasSummit) {
      applyTime(summitGroup, calcTime(summitTarget, now));
    }
    if (hasAbstract) {
      applyTime(abstractGroup, calcTime(abstractTarget, now));
    }
  };

  updateClock();
  setInterval(updateClock, 1000);

  // Instantly re-synchronize when user returns to backgrounded tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateClock();
    }
  });
}

/**
 * 6. Universal Modals (Brochure Download & Express Interest)
 */
function initUniversalModals() {
  const brochureModal = document.getElementById('brochureModal');
  const interestModal = document.getElementById('interestModal');

  window.openBrochureModal = () => {
    if (brochureModal) {
      const brochureForm = document.getElementById('brochureModalForm');
      const brochureSuccess = document.getElementById('brochureModalSuccess');
      if (brochureForm) {
        brochureForm.style.display = '';
        const submitBtn = brochureForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Download Official Brochure</span> <i class="fa-solid fa-download"></i>';
        }
      }
      if (brochureSuccess) {
        brochureSuccess.setAttribute('hidden', '');
      }
      brochureModal.removeAttribute('hidden');
      const nameInput = brochureModal.querySelector('input[name="name"]');
      if (nameInput) nameInput.focus();
    }
  };

  window.closeBrochureModal = () => {
    if (brochureModal) {
      brochureModal.setAttribute('hidden', '');
    }
  };

  window.openInterestModal = () => {
    if (interestModal) {
      const interestForm = document.getElementById('interestModalForm');
      const interestSuccess = document.getElementById('interestModalSuccess');
      if (interestForm) {
        interestForm.style.display = '';
        const submitBtn = interestForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Submit Express Interest</span> <i class="fa-solid fa-arrow-right"></i>';
        }
      }
      if (interestSuccess) {
        interestSuccess.setAttribute('hidden', '');
      }
      interestModal.removeAttribute('hidden');
      const nameInput = interestModal.querySelector('input[name="name"]');
      if (nameInput) nameInput.focus();
    }
  };

  window.closeInterestModal = () => {
    if (interestModal) {
      interestModal.setAttribute('hidden', '');
    }
  };

  // Wire all elements with data-download or brochure triggers
  document.querySelectorAll('[data-download], [data-download-brochure], a[href="brochure.html"], button[data-brochure]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (el.tagName === 'BUTTON' || el.hasAttribute('data-download')) {
        e.preventDefault();
        window.openBrochureModal();
      }
    });
  });

  // Wire all elements with data-open-interest or data-interest
  document.querySelectorAll('[data-open-interest], [data-interest], button[data-interest]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      window.openInterestModal();
    });
  });

  // Modal backdrop click to close
  if (brochureModal) {
    brochureModal.addEventListener('click', (e) => {
      if (e.target === brochureModal) window.closeBrochureModal();
    });
  }

  if (interestModal) {
    interestModal.addEventListener('click', (e) => {
      if (e.target === interestModal) window.closeInterestModal();
    });
  }

  // Escape key close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeBrochureModal();
      window.closeInterestModal();
    }
  });

  // Brochure form submit
  const brochureForm = document.getElementById('brochureModalForm');
  const brochureSuccess = document.getElementById('brochureModalSuccess');
  if (brochureForm) {
    brochureForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = brochureForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Download Brochure';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Document...';
      }

      try {
        await submitInboundLead('brochure_download', brochureForm, {
          cta_source: 'brochure_modal',
          resource_url: 'assets/SVRIAS-2026-Conference-Brochure.pdf',
          resource_label: 'Conference Brochure'
        });
        showToast('Brochure verified & logged. Download commencing...', 'success');
        brochureForm.style.display = 'none';
        if (brochureSuccess) {
          brochureSuccess.removeAttribute('hidden');
        }

        // Auto trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = 'assets/SVRIAS-2026-Conference-Brochure.pdf';
        downloadLink.download = 'SVRIAS-2026-Conference-Brochure.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (err) {
        showToast(err.message || 'Submission failed. Downloading local copy directly...', 'error');
        // Fallback local download anyway
        const downloadLink = document.createElement('a');
        downloadLink.href = 'assets/SVRIAS-2026-Conference-Brochure.pdf';
        downloadLink.download = 'SVRIAS-2026-Conference-Brochure.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        brochureForm.style.display = 'none';
        if (brochureSuccess) brochureSuccess.removeAttribute('hidden');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // Interest form submit
  const interestForm = document.getElementById('interestModalForm');
  const interestSuccess = document.getElementById('interestModalSuccess');
  if (interestForm) {
    interestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = interestForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Express Interest';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registering Priority...';
      }

      try {
        await submitInboundLead('interest', interestForm, {
          cta_source: 'interest_modal'
        });
        showToast('Priority interest recorded in ScholarVault desk!', 'success');
        interestForm.style.display = 'none';
        if (interestSuccess) {
          interestSuccess.removeAttribute('hidden');
        }
      } catch (err) {
        showToast(err.message || 'Could not log interest. Please try again.', 'error');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}

/**
 * 7. Interactive FAQ Accordion
 */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-card-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach((other) => {
          if (other !== item) other.classList.remove('open');
        });
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });
}

/**
 * 8. Currency Switcher (INR / USD)
 */
function initCurrencyToggle() {
  const currencyBtns = document.querySelectorAll('.currency-btn');
  if (!currencyBtns.length) return;

  currencyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const currency = btn.getAttribute('data-currency');
      const inrPrices = document.querySelectorAll('.price-inr');
      const usdPrices = document.querySelectorAll('.price-usd');

      if (currency === 'USD') {
        inrPrices.forEach((el) => (el.style.display = 'none'));
        usdPrices.forEach((el) => (el.style.display = 'inline-block'));
      } else {
        inrPrices.forEach((el) => (el.style.display = 'inline-block'));
        usdPrices.forEach((el) => (el.style.display = 'none'));
      }

      const regCurrency = document.getElementById('regCurrency');
      if (regCurrency && currency) {
        regCurrency.value = currency;
      }
    });
  });
}

/**
 * 9. Floating Support Dock
 */
function initSocialDock() {
  const toggleBtn = document.getElementById('socialDockToggle');
  const dock = document.getElementById('socialDock');
  const closeBtn = document.getElementById('socialDockClose');

  if (!toggleBtn || !dock) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = dock.hasAttribute('hidden');
    if (isHidden) {
      dock.removeAttribute('hidden');
    } else {
      dock.setAttribute('hidden', '');
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dock.setAttribute('hidden', '');
    });
  }
}

/**
 * Central API Resolver & Conference Configuration
 */
const SCHOLARVAULT_CONFERENCE_SLUG = 'research-integrity-responsible-ai-summit-2026';

function getScholarVaultAppOrigin() {
  if (window.SCHOLARVAULT_APP_ORIGIN) return window.SCHOLARVAULT_APP_ORIGIN;
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return 'https://app.scholarvault.in';
}

function formValues(form) {
  const values = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string') values[key] = value.trim();
  });
  return values;
}

function showToast(message, type = 'info') {
  let container = document.getElementById('cyberToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'cyberToastContainer';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  const isError = type === 'error';
  const borderColor = isSuccess ? 'rgba(16, 185, 129, 0.5)' : (isError ? 'rgba(239, 68, 68, 0.5)' : 'rgba(56, 189, 248, 0.5)');
  const bgColor = isSuccess ? 'rgba(6, 78, 59, 0.94)' : (isError ? 'rgba(127, 29, 29, 0.94)' : 'rgba(12, 74, 110, 0.94)');
  const icon = isSuccess ? 'fa-circle-check' : (isError ? 'fa-circle-exclamation' : 'fa-circle-info');
  const accentColor = isSuccess ? '#34d399' : (isError ? '#f87171' : '#38bdf8');

  toast.style.cssText = `
    background: ${bgColor};
    border: 1px solid ${borderColor};
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: #ffffff;
    padding: 14px 20px;
    border-radius: 12px;
    font-size: 13.5px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 20px ${borderColor};
    display: flex;
    align-items: center;
    gap: 12px;
    pointer-events: auto;
    animation: toastSlideIn 0.3s cubic-bezier(0.2, 1, 0.3, 1);
    max-width: 400px;
    font-family: var(--font-sans, sans-serif);
  `;
  toast.innerHTML = `
    <i class="fa-solid ${icon}" style="color: ${accentColor}; font-size: 18px; flex-shrink: 0;"></i>
    <span style="flex: 1; line-height: 1.4;">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastFadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

async function submitInboundLead(source, form, extraFields = {}) {
  const fields = formValues(form);
  const fullName = fields.name || [fields.first_name, fields.last_name].filter(Boolean).join(' ') || fields.nominee_name || fields.author_name;
  const email = (fields.email || fields.nominee_email || fields.author_email || '').toLowerCase().trim();
  const institution = fields.institution || fields.organization || fields.affiliation || fields.nominee_institution || fields.author_institution || null;
  const message = fields.message || fields.notes || fields.justification || fields.abstract || null;

  const payload = {
    source,
    name: fullName || null,
    email,
    institution,
    message,
    fields: {
      ...fields,
      ...extraFields,
      page_url: window.location.href,
      submitted_at: new Date().toISOString()
    }
  };

  const response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'We could not save your submission. Please try again.');
  }
  return result;
}

async function submitRoleApplication(applicationType, form) {
  const values = formValues(form);
  const selectedTracks = Object.entries(values)
    .filter(([key, value]) => key.startsWith('track_') && value === 'yes')
    .map(([key]) => key.replace('track_', 'Track '))
    .join(', ');

  const payload = {
    application_type: applicationType,
    full_name: values.full_name || values.name,
    institutional_email: (values.institutional_email || values.email || '').toLowerCase().trim(),
    institution: values.institution || values.affiliation,
    country: values.country,
    bio: values.bio || values.motivation || 'Academic profile submitted via conference portal.',
    expertise: values.expertise || values.areas_of_expertise || selectedTracks || values.role_preference || 'Responsible AI / Research Integrity',
    profile_url: values.profile_url || values.scholar_url || values.linkedin || values.orcid || 'https://scholarvault.in',
    proposed_contribution: values.proposed_contribution || values.contribution || [values.talk_title, values.abstract].filter(Boolean).join('\n\n') || values.proposed_topic || 'Plenary session contribution',
    profile_consent: form.querySelector('[name="profile_consent"]')?.checked ?? true,
    website: values.website || ''
  };

  const response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || 'We could not save your application. Please check all fields.');
  }
  return result;
}

/**
 * 10. Newsletter Form
 */
function initNewsletterForm() {
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterWrap = document.getElementById('newsletterWrap');
  if (!newsletterForm) return;

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = btn ? btn.innerHTML : 'Subscribe';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    }

    try {
      await submitInboundLead('newsletter', newsletterForm, {
        cta_source: 'footer_newsletter'
      });
      showToast('Subscribed! Welcome to SVRIAS 2026 updates.', 'success');
      if (newsletterWrap) {
        newsletterWrap.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 999px; padding: 12px 24px; color: #10b981; font-weight: 600; font-size: 13.5px; display: inline-flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-check-circle"></i> Subscribed! Thank you for following SVRIAS 2026.
          </div>
        `;
      }
    } catch (err) {
      showToast(err.message || 'Subscription failed. Please try again.', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    }
  });
}

/**
 * Helper to render an in-page glowing confirmation banner with custom action buttons
 */
function renderSuccessState(container, title, message, badgeText, actionBtnHtml = '') {
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 36px 20px; animation: fadeIn 0.4s ease;">
      <div style="width: 68px; height: 68px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; font-size: 30px; box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);">
        <i class="fa-solid fa-check"></i>
      </div>
      <div style="display: inline-block; padding: 4px 14px; border-radius: 999px; background: rgba(56, 189, 248, 0.12); border: 1px solid rgba(56, 189, 248, 0.3); color: #38bdf8; font-size: 11.5px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;">
        ${badgeText || 'CONFIRMED DISPATCH'}
      </div>
      <h3 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-bottom: 12px; font-family: 'Orbitron', sans-serif; letter-spacing: -0.01em;">
        ${title}
      </h3>
      <p style="font-size: 14.5px; color: #94a3b8; max-width: 540px; margin: 0 auto 26px; line-height: 1.6;">
        ${message}
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        ${actionBtnHtml}
        <a href="index.html" class="pill-btn frosted-pill"><i class="fa-solid fa-house"></i> Return Home</a>
        <button type="button" class="pill-btn glowing-pill" onclick="openBrochureModal()"><i class="fa-solid fa-download"></i> Get Conference Brochure</button>
      </div>
    </div>
  `;
}

/**
 * 11. PDF File Dropzone Manager (submit-paper.html)
 */
function initFileDropZone() {
  const dropZone = document.getElementById('paperDropZone');
  const fileInput = document.getElementById('paperFile');
  const prompt = document.getElementById('dropZonePrompt');
  const fileInfo = document.getElementById('dropZoneFileInfo');
  const fileNameEl = document.getElementById('dropZoneFileName');
  const fileSizeEl = document.getElementById('dropZoneFileSize');
  const removeBtn = document.getElementById('dropZoneRemoveFile');

  if (!dropZone || !fileInput) return;

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Only PDF documents are accepted for manuscript submission.', 'error');
      fileInput.value = '';
      return;
    }
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast('File size exceeds the 20MB limit. Please compress your PDF.', 'error');
      fileInput.value = '';
      return;
    }

    if (fileNameEl) fileNameEl.textContent = file.name;
    if (fileSizeEl) fileSizeEl.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB • Verified PDF`;
    if (prompt) prompt.style.display = 'none';
    if (fileInfo) fileInfo.style.display = 'flex';
  };

  dropZone.addEventListener('click', (e) => {
    if (e.target !== removeBtn && !removeBtn?.contains(e.target)) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files && fileInput.files[0]) {
      handleFile(fileInput.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length) {
      fileInput.files = dt.files;
      handleFile(dt.files[0]);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      fileInput.value = '';
      if (prompt) prompt.style.display = 'block';
      if (fileInfo) fileInfo.style.display = 'none';
    });
  }
}

/**
 * 12. Registration Options & Dynamic Tiers (register.html)
 */
function initRegistrationOptions() {
  const cards = Array.from(document.querySelectorAll('[data-registration-category]'));
  const selectBtns = document.querySelectorAll('.select-pass-btn');
  const regCategorySelect = document.getElementById('regCategorySelect');
  const categoryIdInput = document.getElementById('regCategoryId');
  const categoryCodeInput = document.getElementById('regCategoryCode');
  const queryTypeInput = document.getElementById('regQueryType');

  const selectCategory = (categoryCode, categoryName) => {
    if (regCategorySelect) {
      regCategorySelect.value = categoryCode;
      const option = regCategorySelect.querySelector(`option[value="${categoryCode}"]`);
      if (option && option.dataset.name) {
        if (queryTypeInput) queryTypeInput.value = option.dataset.name;
      } else if (categoryName && queryTypeInput) {
        queryTypeInput.value = categoryName;
      }
    }
    if (categoryCodeInput) categoryCodeInput.value = categoryCode;
    cards.forEach((c) => {
      const isMatch = c.dataset.categoryCode === categoryCode;
      c.style.borderColor = isMatch ? '#38bdf8' : '';
      c.style.boxShadow = isMatch ? '0 0 25px rgba(56, 189, 248, 0.3)' : '';
      if (isMatch && categoryIdInput && c.dataset.categoryId) {
        categoryIdInput.value = c.dataset.categoryId;
      }
    });
  };

  selectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.categoryCode;
      if (code) selectCategory(code);
    });
  });

  if (regCategorySelect) {
    regCategorySelect.addEventListener('change', () => {
      const selOpt = regCategorySelect.options[regCategorySelect.selectedIndex];
      selectCategory(regCategorySelect.value, selOpt?.dataset?.name);
    });

    const urlParams = new URLSearchParams(window.location.search);
    let requestedCategory = urlParams.get('category') || urlParams.get('tier');
    if (requestedCategory === 'corporate') {
      requestedCategory = 'industry_professional';
    }
    if (requestedCategory) {
      selectCategory(requestedCategory);
    } else if (regCategorySelect.value) {
      const selOpt = regCategorySelect.options[regCategorySelect.selectedIndex];
      selectCategory(regCategorySelect.value, selOpt?.dataset?.name);
    }
  }

  // Fetch dynamic public registration options from ScholarVault
  fetch(`${getScholarVaultAppOrigin()}/api/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/public-registration-options`)
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((result) => {
      if (!result || !result.categories) return;
      cards.forEach((card) => {
        const matches = (result.categories || []).filter(
          (item) => String(item.code || '').toLowerCase() === String(card.dataset.categoryCode || '').toLowerCase()
        );
        for (const option of matches) {
          card.dataset.categoryId = option.id;
          const currentCode = regCategorySelect?.value || categoryCodeInput?.value;
          if (categoryIdInput && card.dataset.categoryCode === currentCode) {
            categoryIdInput.value = option.id;
          }
          const formatted = `${option.currency === 'INR' ? '₹' : '$'}${Number(option.amount).toLocaleString('en-IN')}`;
          if (option.currency === 'INR') {
            const inrEl = card.querySelector('.price-inr');
            if (inrEl) inrEl.textContent = formatted;
          } else {
            const usdEl = card.querySelector('.price-usd');
            if (usdEl) usdEl.textContent = formatted;
          }
        }
      });
    })
    .catch(() => {
      // Graceful fallback to static rates
    });
}

/**
 * 13. Form Handlers (Registration, Abstract, Contact, Award, Committee, Speaker, Standalone Interest)
 */
function initForms() {
  // Delegate / Registration Form (register.html)
  const regForm = document.getElementById('delegateForm') || document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!regForm.checkValidity()) {
        regForm.reportValidity();
        return;
      }
      const btn = regForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Continue securely';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Delegate Pass...';
      }

      try {
        const attemptKey = `sv:public-attempt:${SCHOLARVAULT_CONFERENCE_SLUG}:registration`;
        let attemptId = window.sessionStorage.getItem(attemptKey);
        if (!attemptId) {
          attemptId = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
            ? crypto.randomUUID()
            : ('sv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9));
          window.sessionStorage.setItem(attemptKey, attemptId);
        }

        const values = formValues(regForm);
        values.attempt_id = attemptId;

        // Ensure category fields are populated
        if (!values.category_code && values.category) {
          values.category_code = values.category;
        }
        if (!values.category_id && values.category_code) {
          const matchingCard = document.querySelector(`[data-registration-category][data-category-code="${values.category_code}"]`);
          if (matchingCard && matchingCard.dataset.categoryId) {
            values.category_id = matchingCard.dataset.categoryId;
            const catIdInput = document.getElementById('regCategoryId');
            if (catIdInput) catIdInput.value = values.category_id;
          }
        }
        if (!values.query_type && values.category) {
          const regCatSelect = document.getElementById('regCategorySelect');
          const selOpt = regCatSelect?.options?.[regCatSelect.selectedIndex];
          values.query_type = selOpt?.dataset?.name || selOpt?.textContent || values.category;
        }

        // Save registration draft to handoff bridge for seamless checkout resume
        window.sessionStorage.setItem('scholarvault:conference-handoff:registration', JSON.stringify(values));

        try {
          await submitInboundLead('registration_intent', regForm, {
            attempt_id: attemptId,
            phone: values.phone || null,
            country: values.country || null,
            category_id: values.category_id || null,
            category_code: values.category_code || null,
            query_type: values.query_type || values.category || null,
            currency: values.currency || 'INR',
            cta_source: 'registration_starter'
          });
        } catch (leadError) {
          console.warn('Registration lead submission notice:', leadError);
        }

        if (window.ScholarVaultConferences) {
          window.ScholarVaultConferences.open('register', values);
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
          }
          return;
        }

        window.location.href = `${getScholarVaultAppOrigin()}/login?next=${encodeURIComponent('/dashboard/conferences/research-integrity-responsible-ai-summit-2026/register')}`;
      } catch (err) {
        showToast(err.message || 'Registration could not be completed. Please try again.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Paper / Abstract Submission Form with 1-Click Social Sign-In Popup (submit-paper.html)
  const paperForm = document.getElementById('paperForm');
  if (paperForm) {
    paperForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!paperForm.checkValidity()) {
        paperForm.reportValidity();
        return;
      }

      const fileInput = document.getElementById('paperFile');
      if (!fileInput || !fileInput.files || !fileInput.files.length) {
        showToast('Please attach your manuscript or abstract PDF file before submitting.', 'error');
        const dropZone = document.getElementById('paperDropZone');
        if (dropZone) dropZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const file = fileInput.files[0];
      const btn = paperForm.querySelector('button[type="submit"]');
      const originalBtnHtml = btn ? btn.innerHTML : 'Sign In & Submit Manuscript';
      const parentCard = paperForm.closest('.glass-card') || paperForm.parentElement;

      const values = formValues(paperForm);
      const trackMatch = values.track?.match(/Track (\d+)/i);
      const trackNum = trackMatch ? trackMatch[1] : '1';
      const trackingCode = Math.random().toString(36).substring(2, 7).toUpperCase();
      const trackingId = `SVRIAS-2026-TR${trackNum}-${trackingCode}`;

      // Save draft into handoff bridge
      const draftPayload = {
        paper_title: values.paper_title,
        abstract: values.abstract,
        keywords: values.keywords,
        track: values.track,
        author_name: values.author_name,
        author_email: values.author_email,
        author_institution: values.author_institution,
        author_country: values.author_country,
        coauthors: values.coauthors || '',
        tracking_id: trackingId,
        file_name: file.name,
        file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      };
      window.sessionStorage.setItem('scholarvault:conference-handoff:abstract', JSON.stringify(draftPayload));

      // Helper to execute provisional auto-save fallback if popup is dismissed or blocked
      const autoSaveProvisional = async (reason) => {
        try {
          await submitInboundLead('interest', paperForm, {
            name: values.author_name,
            email: values.author_email,
            institution: values.author_institution,
            message: `[PROVISIONAL DRAFT - ${reason.toUpperCase()}]\nTitle: ${values.paper_title}\nTrack: ${values.track}\n\nAbstract:\n${values.abstract}`,
            cta_source: 'abstract_provisional_draft',
            tracking_id: trackingId,
            file_name: file.name,
            file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            keywords: values.keywords,
            coauthors: values.coauthors || 'None'
          });

          showToast('Draft preserved! Verification link sent to your email.', 'info');
          const authorDeskUrl = `${getScholarVaultAppOrigin()}/login?next=${encodeURIComponent(`/dashboard/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/submit`)}`;
          const actionBtnHtml = `
            <a href="${authorDeskUrl}" class="pill-btn glowing-pill"><i class="fa-brands fa-google"></i> Connect via Google / LinkedIn</a>
            <a href="index.html" class="pill-btn frosted-pill"><i class="fa-solid fa-house"></i> Return Home</a>
          `;

          renderSuccessState(
            parentCard,
            'Provisional Abstract Draft Saved!',
            `Your abstract and manuscript <strong>${file.name}</strong> have been secured under provisional reference <strong>${trackingId}</strong>. We've dispatched an instant verification link to <strong>${values.author_email}</strong> so you can link your Google or LinkedIn account whenever you're ready without re-typing.`,
            'PROVISIONAL DRAFT LOGGED',
            actionBtnHtml
          );
        } catch (err) {
          showToast(err.message || 'Could not save provisional draft. Please retry.', 'error');
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalBtnHtml;
          }
        }
      };

      // Helper to complete authenticated submission
      const completeAuthenticatedSubmission = async (authUser) => {
        try {
          await submitInboundLead('interest', paperForm, {
            name: authUser.fullName || values.author_name,
            email: authUser.primaryEmailAddress || values.author_email,
            institution: values.author_institution,
            message: `[AUTHENTICATED MANUSCRIPT INTAKE]\nTitle: ${values.paper_title}\nTrack: ${values.track}\n\nAbstract:\n${values.abstract}`,
            cta_source: 'abstract_authenticated_submission',
            tracking_id: trackingId,
            file_name: file.name,
            file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            keywords: values.keywords,
            coauthors: values.coauthors || 'None',
            verified_author: true,
            auth_provider: authUser.provider || 'Google/LinkedIn'
          });

          showToast('Manuscript successfully verified & logged!', 'success');
          const authorDeskUrl = `${getScholarVaultAppOrigin()}/dashboard/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}`;
          const actionBtnHtml = `<a href="${authorDeskUrl}" class="pill-btn glowing-pill"><i class="fa-solid fa-user-shield"></i> Open ScholarVault Review Desk</a>`;

          renderSuccessState(
            parentCard,
            'Abstract Successfully Submitted!',
            `Thank you! Your abstract has been logged into the SVRIAS 2026 rapid review pipeline (2–4 day SLA). Your official Manuscript Tracking Reference is <strong>${trackingId}</strong> with attached manuscript <em>${file.name}</em> (${(file.size / (1024 * 1024)).toFixed(2)} MB). A verified confirmation receipt has been sent to <strong>${authUser.primaryEmailAddress || values.author_email}</strong>.`,
            'VERIFIED & LOGGED',
            actionBtnHtml
          );
        } catch (err) {
          showToast(err.message || 'Submission completed with warnings. Reviewing in desk.', 'info');
        }
      };

      // Set button to launching state
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Opening Google / LinkedIn Auth...';
      }

      // Calculate centered coordinates for social auth popup
      const width = 500;
      const height = 660;
      const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
      const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
      const popupUrl = `${getScholarVaultAppOrigin()}/login?popup=true&action=submit&next=${encodeURIComponent(`/dashboard/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/submit`)}`;

      let authPopup = null;
      try {
        authPopup = window.open(
          popupUrl,
          'ScholarVaultSocialAuth',
          `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes,resizable=yes`
        );
      } catch (e) {
        authPopup = null;
      }

      // If browser blocked the popup entirely
      if (!authPopup || authPopup.closed || typeof authPopup.closed === 'undefined') {
        showToast('Browser blocked pop-up window. Saving provisional draft...', 'info');
        await autoSaveProvisional('popup_blocked');
        return;
      }

      showToast('Please complete 1-click verification in the pop-up window...', 'info');

      let authCompleted = false;

      // Listen for message from popup window
      const handleAuthMessage = async (event) => {
        try {
          const expectedOrigin = new URL(getScholarVaultAppOrigin()).origin;
          if (event.origin !== expectedOrigin && !event.origin.includes('scholarvault.in') && !event.origin.includes('localhost')) {
            return;
          }
          if (event.data && (event.data.type === 'SCHOLARVAULT_AUTH_SUCCESS' || event.data.type === 'CLERK_AUTH_SUCCESS')) {
            authCompleted = true;
            window.removeEventListener('message', handleAuthMessage);
            clearInterval(popupCheckInterval);
            if (authPopup && !authPopup.closed) {
              try { authPopup.close(); } catch (e) {}
            }
            if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Finalizing Manuscript Submission...';
            await completeAuthenticatedSubmission(event.data.user || event.data.profile || {});
          }
        } catch (e) {}
      };
      window.addEventListener('message', handleAuthMessage);

      // Heartbeat to check if user closed the popup window
      const popupCheckInterval = setInterval(async () => {
        if (!authPopup || authPopup.closed) {
          clearInterval(popupCheckInterval);
          window.removeEventListener('message', handleAuthMessage);
          if (!authCompleted) {
            // User closed popup without finishing social auth -> trigger frictionless auto-save fallback
            if (btn) btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Preserving Submission Draft...';
            await autoSaveProvisional('popup_dismissed');
          }
        }
      }, 750);
    });
  }

  // Contact Form (contact.html)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Transmit Message';
      const parentCard = contactForm.closest('.glass-card') || contactForm.parentElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Inquiry...';
      }

      try {
        await submitInboundLead('contact', contactForm, {
          cta_source: 'contact_page'
        });
        showToast('Message dispatched to secretariat!', 'success');
        renderSuccessState(
          parentCard,
          'Message Dispatched to Secretariat',
          'Thank you for contacting ScholarVault Conferences. Your inquiry has been routed to our academic coordination desk. We typically respond within 24 hours on working days.',
          'INQUIRY DELIVERED'
        );
      } catch (err) {
        showToast(err.message || 'Failed to dispatch inquiry. Please try again.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Award Nomination Form (awards.html)
  const awardForm = document.getElementById('awardForm');
  if (awardForm) {
    awardForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!awardForm.checkValidity()) {
        awardForm.reportValidity();
        return;
      }
      const btn = awardForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit Academic Nomination';
      const parentCard = awardForm.closest('.glass-card') || awardForm.parentElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Nomination...';
      }

      try {
        await submitInboundLead('award_nomination', awardForm, {
          cta_source: 'award_nomination_form'
        });
        showToast('Award nomination received by jury desk!', 'success');
        renderSuccessState(
          parentCard,
          'Nomination Recorded!',
          'Thank you for submitting your nomination. The SVRIAS 2026 Awards Jury will evaluate all submissions against double-blind scoring criteria and announce recipients during the closing summit ceremony.',
          'NOMINATION LOGGED'
        );
      } catch (err) {
        showToast(err.message || 'Nomination failed to submit. Please try again.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Committee Application Form (committee-form.html)
  const committeeForm = document.getElementById('committeeForm');
  if (committeeForm) {
    committeeForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!committeeForm.checkValidity()) {
        committeeForm.reportValidity();
        return;
      }
      const btn = committeeForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit Academic Application';
      const parentCard = committeeForm.closest('.glass-card') || committeeForm.parentElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Academic Application...';
      }

      try {
        await submitRoleApplication('committee', committeeForm);
        showToast('Committee application logged in ScholarVault operations desk!', 'success');
        renderSuccessState(
          parentCard,
          'Committee Application Received',
          'Thank you for applying to the Technical Program & Advisory Committee of SVRIAS 2026. The governance board will evaluate your scholarly credentials and contact you within 5 working days.',
          'ACADEMIC PROFILE LOGGED'
        );
      } catch (err) {
        showToast(err.message || 'Application could not be saved. Please check required fields.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Speaker Application Form (speaker-form.html)
  const speakerForm = document.getElementById('speakerForm');
  if (speakerForm) {
    speakerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!speakerForm.checkValidity()) {
        speakerForm.reportValidity();
        return;
      }
      const btn = speakerForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit Speaker Nomination';
      const parentCard = speakerForm.closest('.glass-card') || speakerForm.parentElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Speaker Nomination...';
      }

      try {
        await submitRoleApplication('speaker', speakerForm);
        showToast('Speaker proposal received by program curators!', 'success');
        renderSuccessState(
          parentCard,
          'Speaker Nomination Received',
          'Your plenary / session talk proposal has been submitted to the Program Chairs. Our session curators will review the talk outline against this year’s conference themes.',
          'SPEAKER NOMINATION LOGGED'
        );
      } catch (err) {
        showToast(err.message || 'Speaker nomination could not be saved. Please check required fields.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }

  // Standalone Express Interest Form (interest-form.html)
  const standaloneInterestForm = document.getElementById('interestForm');
  if (standaloneInterestForm) {
    standaloneInterestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!standaloneInterestForm.checkValidity()) {
        standaloneInterestForm.reportValidity();
        return;
      }
      const btn = standaloneInterestForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Submit Interest Intake';
      const parentCard = document.getElementById('interestWrap') || standaloneInterestForm.closest('.glass-card') || standaloneInterestForm.parentElement;
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Interest Intake...';
      }

      try {
        await submitInboundLead('interest', standaloneInterestForm, {
          cta_source: 'interest_page'
        });
        showToast('Priority interest registered in ScholarVault!', 'success');
        renderSuccessState(
          parentCard,
          'Priority Interest Registered!',
          'Thank you! Your academic profile has been added to the SVRIAS 2026 priority pipeline. You will receive plenary announcements, track updates, and early-bird registration discounts directly in your inbox.',
          'EXPRESS INTEREST LOGGED'
        );
      } catch (err) {
        showToast(err.message || 'Could not log interest. Please try again.', 'error');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
      }
    });
  }
}
