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
  initSmartIntake();
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
  const urlParam = new URLSearchParams(window.location.search).get('app_origin');
  if (urlParam) return urlParam.replace(/\/+$/, '');
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

  const rawProfileUrl = values.profile_url || values.scholar_url || values.linkedin || values.orcid || '';
  const cleanProfileUrl = rawProfileUrl.trim();

  const payload = {
    application_type: applicationType,
    full_name: values.full_name || values.name || '',
    institutional_email: (values.institutional_email || values.email || '').toLowerCase().trim(),
    phone: (values.phone || '').trim(),
    institution: values.institution || values.affiliation || '',
    country: values.country || '',
    bio: values.bio || values.motivation || 'Academic profile submitted via conference portal.',
    expertise: values.expertise || values.areas_of_expertise || selectedTracks || values.role_preference || 'Responsible AI / Research Integrity',
    profile_url: cleanProfileUrl || '',
    proposed_contribution: values.proposed_contribution || values.contribution || [values.talk_title, values.abstract].filter(Boolean).join('\n\n') || values.proposed_topic || (applicationType === 'speaker' ? '' : 'Technical review and program committee participation'),
    profile_consent: form.querySelector('[name="profile_consent"]')?.checked ?? true,
    website: values.website || ''
  };

  // Pre-flight client validation to prevent silent rejection
  if (!payload.full_name || payload.full_name.length < 2) {
    throw new Error('Please enter your full name (at least 2 characters).');
  }
  if (!payload.institutional_email || !payload.institutional_email.includes('@')) {
    throw new Error('Please enter a valid institutional email address.');
  }
  if (!payload.phone || payload.phone.length < 5) {
    throw new Error('Please enter your phone / WhatsApp number with country code (e.g. +91 98765 43210).');
  }
  if (!payload.institution) {
    throw new Error('Please enter or select your affiliated institution / university.');
  }
  if (!payload.country) {
    throw new Error('Please enter your country.');
  }
  if (!payload.bio || payload.bio.length < 40) {
    throw new Error('Please provide a biography or motivation statement of at least 40 characters (currently ' + (payload.bio ? payload.bio.length : 0) + ' characters).');
  }
  if (!payload.expertise || payload.expertise.length < 10) {
    throw new Error('Please provide your areas of expertise or select at least one track (at least 10 characters).');
  }
  if (applicationType === 'speaker' && (!payload.proposed_contribution || payload.proposed_contribution.length < 20)) {
    throw new Error('Please provide your proposed talk title and synopsis outline (at least 20 characters).');
  }
  if (!payload.profile_consent) {
    throw new Error('Please check the consent declaration before submitting.');
  }

  let response;
  try {
    response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (netErr) {
    throw new Error('Could not connect to the conference submission server. Please check your network or try again.');
  }

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
 * 11b. Smart Intake & Auto-Fill Manager (speaker-form.html & committee-form.html)
 * - PDF CV parsing via PDF.js with automated extraction of Name, Email, Phone, Affiliation, Bio, Expertise & Talk suggestions
 * - 1-Click OrcID / Scholar Public Record API Auto-Fill
 * - Photo Headshot Dropzone with instant circular preview
 */
function initSmartIntake() {
  const cvDropZone = document.getElementById('cvDropZone');
  const cvFile = document.getElementById('cvFile');
  const cvDropPrompt = document.getElementById('cvDropPrompt');
  const cvDropHint = document.getElementById('cvDropHint');
  const successNotice = document.getElementById('autofillSuccessNotice');
  const successMsg = document.getElementById('autofillSuccessMsg');

  const activeForm = document.getElementById('speakerForm') || document.getElementById('committeeForm');

  // --- 1. CV PDF Uploader & Text Extraction ---
  if (cvDropZone && cvFile && activeForm) {
    const triggerFile = () => cvFile.click();
    cvDropZone.addEventListener('click', triggerFile);

    ['dragenter', 'dragover'].forEach(eventName => {
      cvDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        cvDropZone.style.borderColor = '#38bdf8';
        cvDropZone.style.background = 'rgba(56, 189, 248, 0.08)';
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      cvDropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        cvDropZone.style.borderColor = 'rgba(255, 255, 255, 0.18)';
        cvDropZone.style.background = 'rgba(255, 255, 255, 0.02)';
      });
    });

    const handleCVFile = async (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        showToast('Please upload a PDF document (.pdf)', 'warning');
        return;
      }

      if (cvDropPrompt) {
        cvDropPrompt.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reading CV & parsing profile...';
      }
      if (cvDropHint) cvDropHint.textContent = 'Extracting scholarly bio, expertise & contact details...';

      try {
        const arrayBuffer = await file.arrayBuffer();
        let extractedText = '';

        if (window.pdfjsLib) {
          try {
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const maxPages = Math.min(pdf.numPages, 4);
            const pageTexts = [];
            for (let i = 1; i <= maxPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageString = textContent.items.map(item => item.str).join(' ');
              pageTexts.push(pageString);
            }
            extractedText = pageTexts.join('\n\n');
          } catch (pdfErr) {
            console.warn('PDF.js parsing notice:', pdfErr);
          }
        }

        const parseResult = parseResumeText(extractedText, file.name);
        applyAutoFillData(activeForm, parseResult);

        if (cvDropPrompt) {
          cvDropPrompt.innerHTML = `<i class="fa-solid fa-file-circle-check" style="color: #34d399;"></i> ${file.name}`;
        }
        if (cvDropHint) {
          cvDropHint.innerHTML = '<span style="color: #34d399; font-weight: 600;">Data extracted & auto-filled ✓</span>';
        }
        if (successNotice) {
          successNotice.style.display = 'flex';
          if (successMsg) {
            successMsg.textContent = `Auto-filled from ${file.name}: Name, contact, affiliation, and academic summary!`;
          }
        }
        showToast('CV parsed successfully! Details populated.', 'success');
      } catch (err) {
        console.error('CV parse error:', err);
        if (cvDropPrompt) cvDropPrompt.textContent = 'Click or Drop CV / Resume (PDF)';
        if (cvDropHint) cvDropHint.textContent = 'Extracts Bio, research keywords & talk topics';
        showToast('Could not extract text from this PDF. You can still fill fields manually.', 'info');
      }
    };

    cvDropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) handleCVFile(files[0]);
    });

    cvFile.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length > 0) handleCVFile(files[0]);
    });
  }

  // --- 2. OrcID / Scholar 1-Click Quick Import ---
  const quickImportBtn = document.getElementById('quickImportBtn');
  const quickImportUrl = document.getElementById('quickImportUrl');
  if (quickImportBtn && quickImportUrl && activeForm) {
    quickImportBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const rawInput = quickImportUrl.value.trim();
      if (!rawInput) {
        showToast('Please enter an OrcID (e.g. 0000-0002-1825-0097) or profile URL', 'warning');
        return;
      }

      const orcidMatch = rawInput.match(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/);
      const originalHtml = quickImportBtn.innerHTML;
      quickImportBtn.disabled = true;
      quickImportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching...';

      if (orcidMatch) {
        const orcidId = orcidMatch[0];
        try {
          const res = await fetch(`https://pub.orcid.org/v3.0/${orcidId}/record`, {
            headers: { 'Accept': 'application/json' }
          });
          if (!res.ok) throw new Error(`OrcID responded with ${res.status}`);
          const data = await res.json();

          const person = data.person;
          const givenNames = person?.name?.['given-names']?.value || '';
          const familyName = person?.name?.['family-name']?.value || '';
          const fullName = [givenNames, familyName].filter(Boolean).join(' ');

          const bioContent = person?.biography?.content || '';
          const employments = data['activities-summary']?.employments?.['affiliation-group'];
          let institution = '';
          let designation = '';
          if (employments && employments.length > 0) {
            const firstEmp = employments[0]?.summaries?.[0]?.['employment-summary'];
            if (firstEmp) {
              institution = firstEmp.organization?.name || '';
              designation = firstEmp['role-title'] || '';
            }
          }

          const country = person?.addresses?.address?.[0]?.country?.value || '';
          const keywords = (person?.keywords?.keyword || []).map(k => k.content).join(', ');

          const works = data['activities-summary']?.works?.group;
          let latestWork = '';
          if (works && works.length > 0) {
            latestWork = works[0]?.['work-summary']?.[0]?.title?.title?.value || '';
          }

          const orcidUrl = `https://orcid.org/${orcidId}`;
          applyAutoFillData(activeForm, {
            name: fullName,
            institution,
            designation,
            country,
            bio: bioContent,
            expertise: keywords,
            talk_title: latestWork ? `Key Insights: ${latestWork}` : '',
            orcid: orcidUrl,
            scholar_url: orcidUrl
          });

          if (successNotice) {
            successNotice.style.display = 'flex';
            if (successMsg) {
              successMsg.textContent = `Auto-filled from OrcID (${orcidId}): Name, affiliation, and research profile!`;
            }
          }
          showToast('OrcID profile imported successfully!', 'success');
        } catch (err) {
          console.warn('OrcID fetch notice:', err);
          const orcidInput = activeForm.querySelector('[name="orcid"]') || activeForm.querySelector('[name="scholar_url"]');
          if (orcidInput) orcidInput.value = rawInput.startsWith('http') ? rawInput : `https://orcid.org/${orcidMatch[0]}`;
          showToast('Profile URL linked to form. You may enter remaining fields manually.', 'info');
        } finally {
          quickImportBtn.disabled = false;
          quickImportBtn.innerHTML = originalHtml;
        }
      } else {
        const profileInput = activeForm.querySelector('[name="scholar_url"]') || activeForm.querySelector('[name="orcid"]') || activeForm.querySelector('[name="linkedin"]');
        if (profileInput) profileInput.value = rawInput;
        quickImportBtn.disabled = false;
        quickImportBtn.innerHTML = originalHtml;
        showToast('Profile link added to application!', 'info');
      }
    });
  }

  // --- 3. Photo Headshot Drop Zone & Instant Preview ---
  ['speakerPhoto', 'committeePhoto'].forEach(prefix => {
    const dropZone = document.getElementById(`${prefix}DropZone`);
    const fileInput = document.getElementById(`${prefix}File`);
    const previewImg = document.getElementById(`${prefix}Preview`);
    const promptText = document.getElementById('photoPromptText');

    if (dropZone && fileInput) {
      dropZone.addEventListener('click', () => fileInput.click());

      ['dragenter', 'dragover'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.style.borderColor = '#38bdf8';
          dropZone.style.background = 'rgba(56, 189, 248, 0.08)';
        });
      });

      ['dragleave', 'drop'].forEach(evt => {
        dropZone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          dropZone.style.background = 'rgba(255, 255, 255, 0.02)';
        });
      });

      const handlePhoto = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          showToast('Headshot image must be under 5MB', 'warning');
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          if (previewImg && e.target?.result) {
            previewImg.src = e.target.result;
            previewImg.style.boxShadow = '0 0 15px rgba(56, 189, 248, 0.5)';
          }
          if (promptText) {
            promptText.innerHTML = `<span style="color: #34d399;">✓ Photo attached: ${file.name}</span>`;
          }
          showToast('Headshot attached successfully!', 'success');
        };
        reader.readAsDataURL(file);
      };

      dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        if (files && files.length > 0) handlePhoto(files[0]);
      });

      fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files && files.length > 0) handlePhoto(files[0]);
      });
    }
  });
}

/**
 * Heuristic extractor for CV text
 */
function parseResumeText(text, filename) {
  const result = {};
  if (!text) return result;

  const clean = text.replace(/\s+/g, ' ').trim();

  // 1. Email
  const emailMatch = clean.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0].toLowerCase();

  // 2. Phone
  const phoneMatch = clean.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,5}/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 7) {
    result.phone = phoneMatch[0].trim();
  }

  // 3. OrcID
  const orcidMatch = clean.match(/0000-000[1-9]-\d{4}-\d{3}[\dX]/);
  if (orcidMatch) {
    result.orcid = `https://orcid.org/${orcidMatch[0]}`;
  }

  // 4. LinkedIn
  const linkedInMatch = clean.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedInMatch) result.linkedin = linkedInMatch[0];

  // 5. Name extraction
  const titleNameMatch = text.match(/(?:Prof(?:essor)?\.?|Dr\.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
  if (titleNameMatch) {
    result.name = titleNameMatch[0].trim();
  } else {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 2 && l.length < 50);
    const candidate = lines.find(l => !l.includes('@') && !l.includes('http') && !/curriculum|vitae|resume|page|\d{4}/i.test(l));
    if (candidate) {
      result.name = candidate.replace(/[|,].*$/, '').trim();
    } else if (filename) {
      const nameFromFn = filename.replace(/[-_]?(cv|resume|vitae|profile)[-_]?/gi, '').replace(/\.pdf$/i, '').replace(/[_-]/g, ' ').trim();
      if (nameFromFn && nameFromFn.length > 3) {
        result.name = nameFromFn.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
  }

  // 6. Designation
  const desigMatch = clean.match(/\b(Full\s+Professor|Associate\s+Professor|Assistant\s+Professor|Senior\s+Lecturer|Principal\s+Scientist|Research\s+Director|Postdoctoral\s+Fellow|Dean|Chief\s+Scientist|Head\s+of\s+Department|Lecturer|Researcher|PhD\s+Candidate)\b/i);
  if (desigMatch) {
    result.designation = desigMatch[0];
  }

  // 7. Institution / University
  const instMatch = clean.match(/\b([A-Z][A-Za-z\s&]+(?:University|Institute\s+of\s+Technology|Institute|College|Academy|Hospital|National\s+Laboratory))\b/);
  if (instMatch && instMatch[0].length < 60) {
    result.institution = instMatch[0].trim();
  }

  // 8. Country
  const countries = ['India', 'United States', 'USA', 'United Kingdom', 'UK', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'China', 'Singapore', 'Switzerland', 'Netherlands', 'Sweden', 'Italy', 'Spain', 'Brazil', 'South Africa', 'Saudi Arabia', 'UAE', 'South Korea', 'Ireland', 'Belgium', 'Austria', 'Denmark', 'Norway', 'Finland', 'New Zealand', 'Poland', 'Portugal'];
  for (const c of countries) {
    const regex = new RegExp(`\\b${c}\\b`, 'i');
    if (regex.test(clean)) {
      result.country = c === 'USA' ? 'United States' : (c === 'UK' ? 'United Kingdom' : c);
      break;
    }
  }

  // 9. Bio / Summary
  const bioMatch = text.match(/(?:Summary|Biography|Profile|Professional Summary|About Me|Executive Summary)[\s:\-\n]+([^\n\r]+(?:\n[^\n\r]+){1,5})/i);
  if (bioMatch && bioMatch[1].trim().length >= 40) {
    result.bio = bioMatch[1].trim().slice(0, 800);
  } else {
    const subjectName = result.name || 'The candidate';
    const roleStr = result.designation ? `${result.designation}` : 'researcher and academician';
    const instStr = result.institution ? ` at ${result.institution}` : '';
    const ctryStr = result.country ? ` (${result.country})` : '';
    result.bio = `${subjectName} is a distinguished ${roleStr}${instStr}${ctryStr}. Their research addresses ethical methodologies, scientific rigor, algorithmic fairness, and data governance in modern computing. They actively contribute to scholarly peer review, academic integrity initiatives, and cross-disciplinary collaborations.`;
  }

  // 10. Expertise / Keywords
  const expMatch = text.match(/(?:Research Interests|Areas of Expertise|Keywords|Specializations|Skills)[\s:\-\n]+([^\n\r]+(?:\n[^\n\r]+){1,3})/i);
  if (expMatch && expMatch[1].trim().length >= 10) {
    result.expertise = expMatch[1].trim().replace(/\s*•\s*/g, ', ').replace(/[\n\r]+/g, ', ').slice(0, 300);
  } else {
    const matchedTopics = [];
    if (/ethics|governance/i.test(clean)) matchedTopics.push('AI Ethics & Governance');
    if (/integrity|reproducib/i.test(clean)) matchedTopics.push('Research Integrity');
    if (/responsible|trustworthy/i.test(clean)) matchedTopics.push('Responsible AI');
    if (/authorship|attribution/i.test(clean)) matchedTopics.push('Academic Authorship');
    if (/peer\s*review/i.test(clean)) matchedTopics.push('Scholarly Peer Review');
    if (/privacy|accountab/i.test(clean)) matchedTopics.push('Data Privacy & Accountability');
    result.expertise = matchedTopics.length > 0 ? matchedTopics.join(', ') : 'Responsible AI, Research Integrity, Publication Ethics, Algorithmic Governance';
  }

  // 11. Proposed Talk Title & Abstract (for speaker form)
  const primaryTopic = (result.expertise || 'Responsible AI').split(',')[0].trim();
  result.talk_title = `Operationalizing ${primaryTopic}: Frameworks for Academic Rigor and Trust`;
  result.abstract = `This presentation explores critical paradigms in ${primaryTopic}, focusing on real-world challenges, ethical guardrails, and actionable protocols for modern research institutions. Delegates will gain empirical insights into balancing rapid computational advances with rigorous verification standards.`;

  // 12. Motivation (for committee form)
  result.motivation = `With active research experience at ${result.institution || 'my home institution'}, I am committed to advancing scholarly standards for SVRIAS 2026. My background in ${result.expertise || 'scientific integrity and peer review'} equips me to deliver timely, constructive, and double-blind evaluations across the summit's technical tracks.`;

  return result;
}

/**
 * Apply auto-fill data to form fields
 */
function applyAutoFillData(form, data) {
  if (!form || !data) return;

  const setVal = (name, val) => {
    if (!val) return;
    const input = form.querySelector(`[name="${name}"]`);
    if (input) {
      input.value = val;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  setVal('name', data.name);
  setVal('full_name', data.name);
  setVal('email', data.email);
  setVal('institutional_email', data.email);
  setVal('phone', data.phone);
  setVal('institution', data.institution);
  setVal('affiliation', data.institution);
  setVal('designation', data.designation);
  setVal('country', data.country);
  setVal('bio', data.bio);
  setVal('motivation', data.motivation);
  setVal('expertise', data.expertise);
  setVal('areas_of_expertise', data.expertise);
  setVal('talk_title', data.talk_title);
  setVal('abstract', data.abstract);
  setVal('orcid', data.orcid);
  setVal('scholar_url', data.scholar_url || data.orcid);
  setVal('linkedin', data.linkedin);

  // For committee form, auto-check tracks based on expertise
  if (data.expertise) {
    const expLower = data.expertise.toLowerCase();
    const trackMap = [
      { name: 'track_1', keywords: ['ethic', 'governance', 'policy'] },
      { name: 'track_2', keywords: ['integrity', 'scientific', 'fraud', 'reproducib'] },
      { name: 'track_3', keywords: ['responsible', 'trust', 'safety', 'alignment'] },
      { name: 'track_4', keywords: ['authorship', 'attribution', 'plagiarism', 'content'] },
      { name: 'track_5', keywords: ['review', 'peer', 'editorial', 'referee'] },
      { name: 'track_6', keywords: ['privacy', 'accountab', 'security', 'gdpr'] }
    ];
    let anyChecked = false;
    trackMap.forEach(item => {
      const cb = form.querySelector(`input[name="${item.name}"]`);
      if (cb && item.keywords.some(kw => expLower.includes(kw))) {
        cb.checked = true;
        anyChecked = true;
      }
    });
    if (!anyChecked) {
      const t1 = form.querySelector('input[name="track_1"]');
      const t2 = form.querySelector('input[name="track_2"]');
      if (t1) t1.checked = true;
      if (t2) t2.checked = true;
    }
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
 * 12b. Registration Status & Interactive Checkout Controller
 */
function checkRegistrationUrlStatus() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const orderId = params.get('order_id') || params.get('orderId');
  const regNumber = params.get('reg') || params.get('registration_number');
  const txRef = params.get('tx') || params.get('transaction_id') || orderId;
  const errorMessage = params.get('error') || params.get('message');

  const successCard = document.getElementById('registrationSuccessCard');
  const intakeForm = document.getElementById('intakeForm');
  const pricingGrid = document.querySelector('.pricing-grid');
  const currToggle = document.querySelector('.currency-toggle-wrap');
  const goldBanner = document.getElementById('goldPrivilegeBanner');
  const sectionHead = document.querySelector('.section-head');

  if (status === 'success') {
    if (successCard) {
      successCard.style.display = 'block';
      const regEl = document.getElementById('successRegNumber');
      const txEl = document.getElementById('successTxRef');
      if (regEl) regEl.textContent = regNumber || orderId || 'SVRIAS26-CONFIRMED';
      if (txEl) txEl.textContent = txRef || 'Verified via Federal Bank';
      if (intakeForm) intakeForm.style.display = 'none';
      if (pricingGrid) pricingGrid.style.display = 'none';
      if (currToggle) currToggle.style.display = 'none';
      if (goldBanner) goldBanner.style.display = 'none';

      if (sectionHead) {
        const titleEl = sectionHead.querySelector('.section-title');
        const descEl = sectionHead.querySelector('.section-desc');
        const eyebrowEl = sectionHead.querySelector('.section-eyebrow');
        if (eyebrowEl) eyebrowEl.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> PASS CONFIRMED';
        if (titleEl) titleEl.innerHTML = 'REGISTRATION <span>SUCCESSFUL</span>';
        if (descEl) descEl.textContent = 'Your payment has been verified and your delegate pass is officially registered for SVRIAS 2026.';
      }

      setTimeout(() => {
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      showToast('Registration Confirmed! Invoice and credentials dispatched via email.', 'success');
    }
  } else if (status === 'cancelled') {
    showToast('Payment session was cancelled. You can complete your registration at any time.', 'info');
  } else if (status === 'processing') {
    showToast('Payment is being processed by the bank. Your registration will be confirmed shortly.', 'info');
  } else if (status === 'failed' || status === 'error') {
    showToast(errorMessage || 'Payment was not completed. Please try again or choose an alternative method.', 'error');
  }
}

const CATEGORY_PRICES = {
  student_scholar: { inr: 2500, inrGold: 2399, usd: 129, label: 'Student Presenter' },
  faculty_researcher: { inr: 4999, inrGold: 4898, usd: 199, label: 'Academic / Faculty' },
  co_author: { inr: 2200, inrGold: 2200, usd: 79, label: 'Co-Author Delegate' },
  industry_professional: { inr: 9999, inrGold: 9898, usd: 397, label: 'Industry Delegate' },
  listener: { inr: 1999, inrGold: 1898, usd: 99, label: 'Listener Pass' },
};

const CATEGORY_BENEFITS = {
  student_scholar: [
    'Official Virtual Presentation slot in scheduled track session',
    'Inclusion of accepted abstract in archived ISBN proceedings',
    'Digital Certificate of Presentation & Research Attribution',
    'Full access to all 6 tracks, plenary keynotes & virtual stages'
  ],
  faculty_researcher: [
    'Priority Virtual Presentation stage in designated track session',
    'Inclusion of accepted abstract in archived ISBN proceedings book',
    'Verifiable Digital Certificate of Presentation & Authorship',
    'Keynote Q&A access, co-author credentials & session recordings'
  ],
  co_author: [
    'Co-Author recognition & listing in conference proceedings',
    'Digital Certificate of Co-Authorship & Research Attribution',
    'Full audience access to presentation session & track Q&A',
    'Official conference program guide & proceedings digital copy'
  ],
  industry_professional: [
    'Industry Track Presentation pass & keynote spotlight session',
    'Executive networking breakout rooms & industry roundtables',
    'Full summit recorded video proceedings & archival access',
    'Digital Certificate of Professional Participation & CPD credit'
  ],
  listener: [
    'Complete virtual audience stage access to all 6 tracks',
    'Interactive live Q&A participation with keynote speakers',
    'Official Digital Certificate of Attendance',
    'Conference Brochure, Program Guide & Abstract Book download'
  ]
};

let appliedCouponCode = '';
let appliedCouponDiscount = 0;

function initRegistrationCheckoutInteractive() {
  const regCatSelect = document.getElementById('regCategorySelect');
  const goldOptInToggle = document.getElementById('goldOptInToggle');
  const goldOptInCard = document.getElementById('goldOptInCard');
  const goldSavingsBadge = document.getElementById('goldSavingsBadge');
  const couponInput = document.getElementById('couponCodeInput');
  const applyCouponBtn = document.getElementById('applyCouponBtn');
  const couponStatusMsg = document.getElementById('couponStatusMsg');
  const paymentRadios = document.querySelectorAll('input[name="payment_method"]');

  function calculate() {
    const categoryCode = regCatSelect?.value || 'faculty_researcher';
    const catInfo = CATEGORY_PRICES[categoryCode] || CATEGORY_PRICES.faculty_researcher;
    let selectedMethod = 'federal_omniware';
    paymentRadios.forEach((r) => { if (r.checked) selectedMethod = r.value; });

    const isUSD = selectedMethod === 'dodo';
    const isGold = Boolean(goldOptInToggle?.checked);
    const baseAmount = isUSD ? catInfo.usd : catInfo.inr;

    // Dynamic Gold Savings Badge update based on selected tier
    const goldSavings = Math.max(0, catInfo.inr - catInfo.inrGold);
    if (goldSavingsBadge) {
      if (goldSavings > 0) {
        goldSavingsBadge.style.display = 'inline-block';
        goldSavingsBadge.textContent = `Save ₹${goldSavings.toLocaleString('en-IN')} Instantly`;
      } else {
        goldSavingsBadge.style.display = 'none';
      }
    }

    // Dynamic Switch & Card State on Toggle
    const goldSwitchTrack = document.getElementById('goldSwitchTrack');
    const goldSwitchKnob = document.getElementById('goldSwitchKnob');
    const goldToggleLabel = document.getElementById('goldToggleLabel');

    if (isGold) {
      if (goldSwitchTrack) {
        goldSwitchTrack.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        goldSwitchTrack.style.borderColor = '#fbbf24';
        goldSwitchTrack.style.boxShadow = '0 0 14px rgba(245, 158, 11, 0.5)';
      }
      if (goldSwitchKnob) {
        goldSwitchKnob.style.transform = 'translateX(22px)';
      }
      if (goldToggleLabel) {
        goldToggleLabel.textContent = 'Active ✓';
        goldToggleLabel.style.color = '#34d399';
      }
      if (goldOptInCard) {
        goldOptInCard.style.borderColor = '#f59e0b';
        goldOptInCard.style.background = 'radial-gradient(ellipse at top left, rgba(245, 158, 11, 0.22) 0%, rgba(180, 83, 9, 0.12) 50%, rgba(12, 14, 20, 0.85) 100%)';
        goldOptInCard.style.boxShadow = '0 12px 36px -4px rgba(0, 0, 0, 0.6), 0 0 28px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(254, 240, 138, 0.35)';
      }
    } else {
      if (goldSwitchTrack) {
        goldSwitchTrack.style.background = 'rgba(255, 255, 255, 0.15)';
        goldSwitchTrack.style.borderColor = 'rgba(255, 255, 255, 0.25)';
        goldSwitchTrack.style.boxShadow = 'none';
      }
      if (goldSwitchKnob) {
        goldSwitchKnob.style.transform = 'translateX(0px)';
      }
      if (goldToggleLabel) {
        goldToggleLabel.textContent = 'Add Perk';
        goldToggleLabel.style.color = '#94a3b8';
      }
      if (goldOptInCard) {
        goldOptInCard.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        goldOptInCard.style.background = 'radial-gradient(ellipse at top left, rgba(245, 158, 11, 0.14) 0%, rgba(180, 83, 9, 0.06) 50%, rgba(12, 14, 20, 0.75) 100%)';
        goldOptInCard.style.boxShadow = '0 8px 30px -4px rgba(0, 0, 0, 0.5), 0 0 20px -2px rgba(245, 158, 11, 0.12), inset 0 1px 0 rgba(254, 240, 138, 0.2)';
      }
    }

    // 1. Dynamic Benefits List Update
    const benefitsList = document.getElementById('passBenefitsList');
    if (benefitsList) {
      const perks = CATEGORY_BENEFITS[categoryCode] || CATEGORY_BENEFITS.faculty_researcher;
      benefitsList.innerHTML = perks.map((p) => `
        <li style="display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-circle-check" style="color: #34d399; font-size: 13px;"></i>
          <span>${p}</span>
        </li>
      `).join('');
    }

    // 2. Pricing & Discount Calculation
    let finalAmount = baseAmount;
    let discountAmount = 0;
    let discountLabelText = 'Discount:';

    if (!isUSD && isGold) {
      finalAmount = catInfo.inrGold;
      if (appliedCouponDiscount > 0) {
        finalAmount = Math.max(0, Math.round(catInfo.inrGold * (1 - appliedCouponDiscount / 100)));
        discountLabelText = `👑 Gold + Promo (${appliedCouponCode} -${appliedCouponDiscount}%):`;
      } else {
        discountLabelText = '👑 ScholarVault Gold Discount:';
      }
      discountAmount = Math.max(0, baseAmount - finalAmount);
    } else if (appliedCouponDiscount > 0) {
      finalAmount = Math.max(0, Math.round(baseAmount * (1 - appliedCouponDiscount / 100)));
      discountAmount = Math.max(0, baseAmount - finalAmount);
      discountLabelText = `Discount (${appliedCouponCode} -${appliedCouponDiscount}%):`;
    }

    const summaryBadgeTier = document.getElementById('summaryBadgeTier');
    const baseFeeDisplay = document.getElementById('baseFeeDisplay');
    const discountLineItem = document.getElementById('discountLineItem');
    const discountLabel = document.getElementById('discountLabel');
    const discountAmountDisplay = document.getElementById('discountAmountDisplay');
    const finalPriceDisplay = document.getElementById('finalPriceDisplay');
    const btnSubmitText = document.getElementById('btnSubmitText');
    const currencyInput = document.getElementById('regCurrency');

    if (summaryBadgeTier) summaryBadgeTier.textContent = catInfo.label;

    if (isUSD) {
      if (currencyInput) currencyInput.value = 'USD';
      if (baseFeeDisplay) baseFeeDisplay.textContent = `$${catInfo.usd}`;
      if (finalPriceDisplay) finalPriceDisplay.textContent = `$${finalAmount}`;
      if (btnSubmitText) btnSubmitText.innerHTML = `Proceed to Card Checkout &bull; $${finalAmount}`;
      if (discountLineItem) {
        if (discountAmount > 0) {
          discountLineItem.style.display = 'flex';
          if (discountLabel) discountLabel.textContent = discountLabelText;
          if (discountAmountDisplay) discountAmountDisplay.textContent = `-$${discountAmount}`;
        } else {
          discountLineItem.style.display = 'none';
        }
      }
    } else {
      if (currencyInput) currencyInput.value = 'INR';
      if (baseFeeDisplay) baseFeeDisplay.textContent = `₹${catInfo.inr.toLocaleString('en-IN')}`;
      if (finalPriceDisplay) finalPriceDisplay.textContent = `₹${finalAmount.toLocaleString('en-IN')}`;
      if (discountLineItem) {
        if (discountAmount > 0) {
          discountLineItem.style.display = 'flex';
          if (discountLabel) discountLabel.textContent = discountLabelText;
          if (discountAmountDisplay) discountAmountDisplay.textContent = `-₹${discountAmount.toLocaleString('en-IN')}`;
        } else {
          discountLineItem.style.display = 'none';
        }
      }

      if (selectedMethod === 'bank_transfer') {
        if (btnSubmitText) btnSubmitText.innerHTML = `Submit Bank Transfer Reference &bull; ₹${finalAmount.toLocaleString('en-IN')}`;
      } else {
        if (btnSubmitText) btnSubmitText.innerHTML = `Proceed to Federal Bank Payment &bull; ₹${finalAmount.toLocaleString('en-IN')}`;
      }
    }

    // Toggle Bank Transfer Details
    const bankWrap = document.getElementById('bankTransferDetailsWrap');
    if (bankWrap) {
      bankWrap.style.display = selectedMethod === 'bank_transfer' ? 'block' : 'none';
      const utrInput = document.getElementById('regUtr');
      const senderBank = document.getElementById('regSenderBank');
      if (utrInput) utrInput.required = selectedMethod === 'bank_transfer';
      if (senderBank) senderBank.required = selectedMethod === 'bank_transfer';
    }

    // Border highlights
    const optFederal = document.getElementById('optFederalLabel');
    const optDodo = document.getElementById('optDodoLabel');
    const optBank = document.getElementById('optBankLabel');
    if (optFederal) optFederal.style.borderColor = selectedMethod === 'federal_omniware' ? '#38bdf8' : 'rgba(255,255,255,0.1)';
    if (optDodo) optDodo.style.borderColor = selectedMethod === 'dodo' ? '#38bdf8' : 'rgba(255,255,255,0.1)';
    if (optBank) optBank.style.borderColor = selectedMethod === 'bank_transfer' ? '#f59e0b' : 'rgba(255,255,255,0.1)';
  }

  if (regCatSelect) regCatSelect.addEventListener('change', calculate);
  if (goldOptInToggle) goldOptInToggle.addEventListener('change', calculate);
  if (goldOptInCard && goldOptInToggle) {
    goldOptInCard.addEventListener('click', (e) => {
      if (!e.target.closest('label') && !e.target.closest('input')) {
        goldOptInToggle.checked = !goldOptInToggle.checked;
        calculate();
      }
    });
  }
  paymentRadios.forEach((r) => r.addEventListener('change', calculate));

  function handleCouponSubmit() {
    const code = couponInput ? couponInput.value.trim().toUpperCase() : '';
    if (!code) {
      appliedCouponCode = '';
      appliedCouponDiscount = 0;
      if (couponStatusMsg) couponStatusMsg.style.display = 'none';
      calculate();
      return;
    }

    if (code === 'SVRIAS10' || code === 'WELCOME10') {
      appliedCouponCode = code;
      appliedCouponDiscount = 10;
      if (couponStatusMsg) {
        couponStatusMsg.style.display = 'block';
        couponStatusMsg.style.color = '#34d399';
        couponStatusMsg.innerHTML = '<i class="fa-solid fa-check"></i> 10% Summit Discount Applied!';
      }
    } else if (code === 'EARLYBIRD') {
      appliedCouponCode = code;
      appliedCouponDiscount = 15;
      if (couponStatusMsg) {
        couponStatusMsg.style.display = 'block';
        couponStatusMsg.style.color = '#34d399';
        couponStatusMsg.innerHTML = '<i class="fa-solid fa-check"></i> 15% Early Bird Discount Applied!';
      }
    } else if (code === 'GOLDMEMBER' || code === 'GOLD') {
      if (goldOptInToggle) goldOptInToggle.checked = true;
      if (couponStatusMsg) {
        couponStatusMsg.style.display = 'block';
        couponStatusMsg.style.color = '#fde68a';
        couponStatusMsg.innerHTML = '👑 <strong>ScholarVault Gold Member Opt-in Activated!</strong>';
      }
    } else {
      appliedCouponCode = '';
      appliedCouponDiscount = 0;
      if (couponStatusMsg) {
        couponStatusMsg.style.display = 'block';
        couponStatusMsg.style.color = '#f87171';
        couponStatusMsg.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Invalid or expired promo code.';
      }
    }
    calculate();
  }

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', handleCouponSubmit);
    couponInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCouponSubmit();
      }
    });
  }

  calculate();
}

/**
 * 13. Form Handlers (Registration, Abstract, Contact, Award, Committee, Speaker, Standalone Interest)
 */
function initForms() {
  // Delegate / Registration Form (register.html)
  const regForm = document.getElementById('delegateForm') || document.getElementById('registrationForm');
  if (regForm) {
    initRegistrationCheckoutInteractive();
    checkRegistrationUrlStatus();

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!regForm.checkValidity()) {
        regForm.reportValidity();
        return;
      }
      const btn = regForm.querySelector('button[type="submit"]');
      const originalText = btn ? btn.innerHTML : 'Proceed to Payment';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Securing Delegate Pass...';
      }

      try {
        const values = formValues(regForm);
        if (!values.category_code && values.category) values.category_code = values.category;

        const selectedMethodInput = regForm.querySelector('input[name="payment_method"]:checked');
        const paymentMethod = selectedMethodInput ? selectedMethodInput.value : (values.payment_method || 'federal_omniware');
        const isGold = Boolean(document.getElementById('goldOptInToggle')?.checked || document.getElementById('goldAddonCheck')?.checked);
        const coupon = document.getElementById('couponCodeInput')?.value?.trim() || '';

        const payload = {
          name: values.name,
          email: (values.email || '').toLowerCase().trim(),
          phone: values.phone,
          institution: values.institution,
          country: values.country || 'India',
          city: values.city || 'Bengaluru',
          zip_code: values.zip_code || '560001',
          category_code: values.category_code || values.category,
          category_id: values.category_id || null,
          paper_id: values.paper_id || null,
          payment_method: paymentMethod,
          gold_addon: isGold,
          coupon_code: coupon,
          utr_number: values.utr_number || '',
          bank_name: values.bank_name || '',
        };

        const response = await fetch(`${getScholarVaultAppOrigin()}/api/conferences/${SCHOLARVAULT_CONFERENCE_SLUG}/guest-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.error || 'Registration could not be initiated. Please try again.');
        }

        // 1. Federal Omniware Two-Step URL
        if (result.provider === 'federal_omniware' && result.payment_url) {
          window.location.href = result.payment_url;
          return;
        }

        // 2. Federal Omniware Form POST Fallback
        if (result.provider === 'federal_omniware_form' && result.form_action) {
          const autoForm = document.createElement('form');
          autoForm.method = 'POST';
          autoForm.action = result.form_action;
          for (const [k, v] of Object.entries(result.form_fields)) {
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = k;
            hiddenInput.value = v;
            autoForm.appendChild(hiddenInput);
          }
          document.body.appendChild(autoForm);
          autoForm.submit();
          return;
        }

        // 3. Direct Bank Transfer Submission
        if (result.provider === 'bank_transfer') {
          const intakeForm = document.getElementById('intakeForm');
          const btCard = document.getElementById('bankTransferPendingCard');
          if (intakeForm) intakeForm.style.display = 'none';
          if (btCard) {
            btCard.style.display = 'block';
            const regEl = document.getElementById('btRegNumber');
            const utrEl = document.getElementById('btUtrNumber');
            if (regEl) regEl.textContent = result.registration_number || result.order_id;
            if (utrEl) utrEl.textContent = payload.utr_number || 'Under Review';
            btCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          showToast('Bank transfer submitted for verification!', 'success');
          return;
        }

        // 4. Dodo Checkout
        if (result.provider === 'dodo') {
          if (result.checkout_url) {
            window.location.href = result.checkout_url;
          } else {
            showToast('International card checkout is ready. Directing to card portal...', 'info');
          }
          return;
        }

        showToast('Registration initiated. Please check your email.', 'info');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
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
  if (paperForm && !document.getElementById('paperDropZone')) {
    paperForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!paperForm.checkValidity()) {
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
          'Thank you for applying to the Technical Program & Advisory Committee of SVRIAS 2026. The governance board will evaluate your scholarly credentials and contact you within 5 working days. An official confirmation email has been dispatched to your institutional inbox.',
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
          'Your plenary / session talk proposal has been submitted to the Program Chairs. Our session curators will review the talk outline against this year’s conference themes. An official confirmation email has been dispatched to your institutional inbox.',
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
