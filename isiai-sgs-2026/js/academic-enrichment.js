/**
 * ISIAI-SGS 2026 - Academic Enrichment & Localization Engine
 * 1. ROR (Research Organization Registry) University / Institution Autocomplete
 * 2. Geo-Timezone & Dual Deadline Countdown Synchronization
 * 3. Dynamic Localized Currency Converter (INR -> Visitor Currency via live exchange rates)
 * 4. Academic Email Integrity & Anti-Burner Gate (Kickbox Open API + Whitelist)
 * 5. 1-Click "Add to Calendar" (.ICS & Google Calendar Event Engine)
 */

(function () {
  'use strict';

  // --- Configuration ---
  const ROR_API_URL = 'https://api.ror.org/v2/organizations';
  const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/INR';
  const KICKBOX_DISPOSABLE_API = 'https://open.kickbox.com/v1/disposable';
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
  const SUMMIT_TIMEZONE = 'Asia/Kolkata';

  // Fallback exchange rates against 1 INR
  const FALLBACK_RATES = {
    USD: 0.0106,
    EUR: 0.0091,
    GBP: 0.0078,
    AUD: 0.0147,
    CAD: 0.0152,
    SGD: 0.0148,
    AED: 0.0389,
    JPY: 1.62,
    INR: 1.0
  };

  const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    AED: 'AED ',
    JPY: '¥',
    INR: '₹'
  };

  // Reputable domain whitelist (never flagged as burner)
  const TRUSTED_EMAIL_DOMAINS = new Set([
    'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
    'proton.me', 'protonmail.com', 'live.com', 'aol.com', 'zoho.com',
    'scholarvault.in', 'cam.ac.uk', 'ox.ac.uk', 'stanford.edu', 'mit.edu',
    'harvard.edu', 'berkeley.edu', 'iitm.ac.in', 'iitb.ac.in', 'iitd.ac.in',
    'srmist.edu.in', 'vit.ac.in', 'up.edu.ph', 'dlsu.edu.ph'
  ]);

  // Known notorious disposable burner domains
  const KNOWN_BURNER_DOMAINS = new Set([
    'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com',
    'yopmail.com', 'trashmail.com', 'getairmail.com', 'sharklasers.com',
    'dispostable.com', 'burnermail.io', 'generator.email', 'tempail.com',
    'throwawaymail.com', 'fakeinbox.com', 'temp-mail.org', 'nada.ltd',
    'mohmal.com', 'mytemp.email', 'crazymailing.com', 'dropmail.me'
  ]);

  // Conference Events for Calendar
  const SUMMIT_EVENT = {
    title: 'International Conference on Interdisciplinary AI and Sustainable Global Systems 2026 (ISIAI-SGS 2026)',
    startUtc: '20261218T033000Z',
    endUtc: '20261219T123000Z',
    startIso: '2026-12-18T03:30:00Z',
    endIso: '2026-12-19T12:30:00Z',
    location: 'Virtual Conference • ScholarVault Conferences',
    details: 'International Conference on Interdisciplinary AI and Sustainable Global Systems 2026 (ISIAI-SGS 2026).\n\nKeynote lectures, track presentation stages, and peer-review benchmarks.\nVirtual Platform: Zoom (Link issued by ScholarVault)\nOfficial Site: https://isiaisgs2026.scholarvault.in'
  };

  const DEADLINE_EVENT = {
    title: 'ISIAI-SGS 2026 - Abstract Submission Deadline',
    startUtc: '20261110T182959Z',
    endUtc: '20261110T182959Z',
    startIso: '2026-11-10T18:29:59Z',
    endIso: '2026-11-10T18:29:59Z',
    location: 'https://isiaisgs2026.scholarvault.in/submit-paper.html',
    details: 'Final deadline to submit abstracts to ISIAI-SGS 2026 across 8 thematic tracks.\nSubmit online: https://isiaisgs2026.scholarvault.in/submit-paper.html'
  };

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 1. ROR (Research Organization Registry) Autocomplete Engine
  // =========================================================================

  const rorQueryCache = new Map();

  function injectRorStyles() {
    if (document.getElementById('ror-injected-styles')) return;
    const style = document.createElement('style');
    style.id = 'ror-injected-styles';
    style.textContent = `
      .ror-autocomplete-wrapper {
        position: relative !important;
        width: 100% !important;
        display: block !important;
      }
      .ror-autocomplete-dropdown {
        position: absolute !important;
        top: calc(100% + 4px) !important;
        left: 0 !important;
        right: 0 !important;
        max-height: 290px !important;
        overflow-y: auto !important;
        z-index: 9999999 !important;
        margin: 0 !important;
        padding: 6px !important;
        list-style: none !important;
        border-radius: 12px !important;
        font-family: inherit !important;
        font-size: 14px !important;
        line-height: 1.4 !important;
        box-sizing: border-box !important;
        box-shadow: 0 16px 36px rgba(0,0,0,0.2) !important;
      }
      /* Custom scrollbar */
      .ror-autocomplete-dropdown::-webkit-scrollbar { width: 6px; }
      .ror-autocomplete-dropdown::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.4);
        border-radius: 999px;
      }
      /* Light theme */
      .ror-autocomplete-dropdown.ror-theme-light,
      .section--light .ror-autocomplete-dropdown,
      .section--mist .ror-autocomplete-dropdown {
        background: #ffffff !important;
        border: 1.5px solid #86efac !important;
        box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(22, 163, 74, 0.08) !important;
        color: #0f172a !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-dropdown-item,
      .section--light .ror-dropdown-item,
      .section--mist .ror-dropdown-item {
        display: flex !important;
        flex-direction: column !important;
        gap: 3px !important;
        padding: 9px 12px !important;
        margin-bottom: 2px !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        color: #1e293b !important;
        border-left: 3px solid transparent !important;
        transition: background 0.15s ease, border-color 0.15s ease !important;
        text-align: left !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-dropdown-item:hover,
      .ror-autocomplete-dropdown.ror-theme-light .ror-dropdown-item.selected,
      .section--light .ror-dropdown-item:hover,
      .section--light .ror-dropdown-item.selected,
      .section--mist .ror-dropdown-item:hover,
      .section--mist .ror-dropdown-item.selected {
        background: #f0fdf4 !important;
        border-left-color: #16a34a !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-item-name,
      .section--light .ror-item-name,
      .section--mist .ror-item-name {
        font-size: 13.5px !important;
        font-weight: 700 !important;
        color: #081210 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-cap-icon,
      .section--light .ror-cap-icon,
      .section--mist .ror-cap-icon {
        color: #16a34a !important;
        flex-shrink: 0 !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-item-meta,
      .section--light .ror-item-meta,
      .section--mist .ror-item-meta {
        font-size: 11.5px !important;
        color: #64748b !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-item-id,
      .section--light .ror-item-id,
      .section--mist .ror-item-id {
        display: inline-flex !important;
        align-items: center !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 10.5px !important;
        color: #15803d !important;
        background: #dcfce7 !important;
        border: 1px solid #86efac !important;
        padding: 1px 6px !important;
        border-radius: 4px !important;
      }
      .ror-autocomplete-dropdown.ror-theme-light .ror-loading-indicator,
      .ror-autocomplete-dropdown.ror-theme-light .ror-no-results,
      .section--light .ror-loading-indicator,
      .section--light .ror-no-results,
      .section--mist .ror-loading-indicator,
      .section--mist .ror-no-results {
        padding: 12px 14px !important;
        font-size: 13px !important;
        color: #64748b !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        text-align: left !important;
      }

      /* Dark theme */
      .ror-autocomplete-dropdown.ror-theme-dark {
        background: #0f172a !important;
        border: 1.5px solid rgba(56, 189, 248, 0.35) !important;
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.15) !important;
        color: #f8fafc !important;
        backdrop-filter: blur(16px) !important;
        -webkit-backdrop-filter: blur(16px) !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-dropdown-item {
        display: flex !important;
        flex-direction: column !important;
        gap: 3px !important;
        padding: 9px 12px !important;
        margin-bottom: 2px !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        color: #e2e8f0 !important;
        border-left: 3px solid transparent !important;
        transition: background 0.15s ease, border-color 0.15s ease !important;
        text-align: left !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-dropdown-item:hover,
      .ror-autocomplete-dropdown.ror-theme-dark .ror-dropdown-item.selected {
        background: rgba(56, 189, 248, 0.14) !important;
        border-left-color: #38bdf8 !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-item-name {
        font-size: 13.5px !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-cap-icon {
        color: #38bdf8 !important;
        flex-shrink: 0 !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-item-meta {
        font-size: 11.5px !important;
        color: #94a3b8 !important;
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        flex-wrap: wrap !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-item-id {
        display: inline-flex !important;
        align-items: center !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace !important;
        font-size: 10.5px !important;
        color: #38bdf8 !important;
        background: rgba(56, 189, 248, 0.12) !important;
        border: 1px solid rgba(56, 189, 248, 0.25) !important;
        padding: 1px 6px !important;
        border-radius: 4px !important;
      }
      .ror-autocomplete-dropdown.ror-theme-dark .ror-loading-indicator,
      .ror-autocomplete-dropdown.ror-theme-dark .ror-no-results {
        padding: 12px 14px !important;
        font-size: 13px !important;
        color: #94a3b8 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        text-align: left !important;
      }
      @keyframes rorSpin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  function getThemeForInput(input) {
    if (input.closest('.section--light, .section--mist, .light-theme, [data-theme="light"], .theme--light')) {
      return 'light';
    }
    try {
      const bg = window.getComputedStyle(input.closest('.form-shell') || input || document.body).backgroundColor;
      if (bg && bg !== 'transparent') {
        const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          const r = parseInt(match[1], 10);
          const g = parseInt(match[2], 10);
          const b = parseInt(match[3], 10);
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
          if (luminance > 140) return 'light';
        }
      }
    } catch (e) {}

    if (document.title.includes('ISIAI') || window.location.pathname.includes('isiai')) {
      return 'light';
    }
    return 'dark';
  }

  function initRorAutocomplete() {
    injectRorStyles();
    const selector = 'input[name="author_institution"], input[name="institution"], input[name="organization"], input[name="affiliation"], input[data-ror-autocomplete]';
    const inputs = document.querySelectorAll(selector);
    if (!inputs.length) return;

    inputs.forEach((input) => {
      if (input.dataset.rorInitialized) return;
      input.dataset.rorInitialized = 'true';
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('spellcheck', 'false');

      const form = input.closest('form');
      let rorHidden = form ? form.querySelector('input[name="ror_id"]') : null;
      if (form && !rorHidden) {
        rorHidden = document.createElement('input');
        rorHidden.type = 'hidden';
        rorHidden.name = 'ror_id';
        form.appendChild(rorHidden);
      }

      let wrapper = input.parentElement;
      if (!wrapper.classList.contains('ror-autocomplete-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'ror-autocomplete-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }

      const theme = getThemeForInput(input);
      const dropdown = document.createElement('ul');
      dropdown.className = `ror-autocomplete-dropdown ror-theme-${theme}`;
      dropdown.setAttribute('role', 'listbox');
      dropdown.setAttribute('data-theme', theme);
      dropdown.style.display = 'none';
      wrapper.appendChild(dropdown);

      let debounceTimer = null;
      let activeIndex = -1;
      let currentResults = [];
      let isSelecting = false;
      let lastSelectedValue = '';

      const hideDropdown = () => {
        clearTimeout(debounceTimer);
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        activeIndex = -1;
        currentResults = [];
      };

      const selectResult = (item) => {
        if (!item) return;
        isSelecting = true;
        clearTimeout(debounceTimer);

        const displayName = item.names?.find((n) => n.types?.includes('ror_display'))?.value || item.name || item.names?.[0]?.value || '';
        input.value = displayName;
        lastSelectedValue = displayName;

        const countryName = item.locations?.[0]?.geonames_details?.country_name || item.country?.country_name || '';
        if (countryName && form) {
          const countryInput = form.querySelector('input[name="author_country"], input[name="country"]');
          if (countryInput) {
            countryInput.value = countryName;
            countryInput.dispatchEvent(new Event('input', { bubbles: true }));
            countryInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        const city = item.locations?.[0]?.geonames_details?.name || item.addresses?.[0]?.city || '';
        if (city && form) {
          const cityInput = form.querySelector('input[name="city"]');
          if (cityInput && !cityInput.value.trim()) {
            cityInput.value = city;
            cityInput.dispatchEvent(new Event('input', { bubbles: true }));
            cityInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        if (rorHidden && item.id) {
          rorHidden.value = item.id;
        }
        if (form) {
          form.dataset.rorId = item.id || '';
          form.dataset.rorName = displayName;
        }

        hideDropdown();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
          isSelecting = false;
        }, 300);
      };

      const capSvg = `<svg class="ror-cap-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0;"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>`;
      const spinSvg = `<svg class="ror-spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: rorSpin 0.8s linear infinite; flex-shrink:0;"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"></path></svg>`;

      const renderResults = (items) => {
        dropdown.innerHTML = '';
        currentResults = items;
        activeIndex = -1;

        if (!items || !items.length) {
          dropdown.innerHTML = '<li class="ror-no-results">No verified institutions found. You can still enter yours manually.</li>';
          dropdown.style.display = 'block';
          return;
        }

        items.forEach((item, idx) => {
          const li = document.createElement('li');
          li.className = 'ror-dropdown-item';
          li.setAttribute('role', 'option');
          li.dataset.index = String(idx);

          const displayName = item.names?.find((n) => n.types?.includes('ror_display'))?.value || item.name || item.names?.[0]?.value || 'Unknown Institution';
          const city = item.locations?.[0]?.geonames_details?.name || item.addresses?.[0]?.city || '';
          const state = item.locations?.[0]?.geonames_details?.country_subdivision_name || item.addresses?.[0]?.state || '';
          const country = item.locations?.[0]?.geonames_details?.country_name || item.country?.country_name || '';
          const rorShortId = (item.id || '').replace(/^https?:\/\/ror\.org\//, 'ror.org/');

          const locationParts = [city, state, country].filter(Boolean);

          li.innerHTML = `
            <div class="ror-item-name">
              ${capSvg}
              <span>${escapeHtml(displayName)}</span>
            </div>
            <div class="ror-item-meta">
              <span>${escapeHtml(locationParts.join(', ') || 'Global')}</span>
              ${rorShortId ? `<span class="meta-dot">&bull;</span><span class="ror-item-id">${escapeHtml(rorShortId)}</span>` : ''}
            </div>
          `;

          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectResult(item);
          });

          dropdown.appendChild(li);
        });

        dropdown.style.display = 'block';
      };

      const fetchRor = async (query) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
          hideDropdown();
          return;
        }

        dropdown.innerHTML = `<li class="ror-loading-indicator">${spinSvg} <span>Searching verified universities...</span></li>`;
        dropdown.style.display = 'block';

        if (rorQueryCache.has(trimmed.toLowerCase())) {
          renderResults(rorQueryCache.get(trimmed.toLowerCase()));
          return;
        }

        try {
          const res = await fetch(`${ROR_API_URL}?query=${encodeURIComponent(trimmed)}`);
          if (!res.ok) throw new Error('ROR query failed');
          const data = await res.json();
          const items = (data.items || []).slice(0, 5);
          rorQueryCache.set(trimmed.toLowerCase(), items);
          renderResults(items);
        } catch {
          dropdown.innerHTML = '<li class="ror-no-results">Verified institution search unavailable. You may type manually.</li>';
        }
      };

      input.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        if (isSelecting) return;
        const query = e.target.value;
        if (!query || query.trim().length < 2 || query === lastSelectedValue) {
          hideDropdown();
          return;
        }
        debounceTimer = setTimeout(() => {
          fetchRor(query);
        }, 200);
      });

      input.addEventListener('keydown', (e) => {
        if (dropdown.style.display === 'none' || !currentResults.length) return;

        const items = dropdown.querySelectorAll('.ror-dropdown-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = (activeIndex + 1) % items.length;
          updateActiveItem(items, activeIndex);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = (activeIndex - 1 + items.length) % items.length;
          updateActiveItem(items, activeIndex);
        } else if (e.key === 'Enter') {
          if (activeIndex >= 0 && activeIndex < currentResults.length) {
            e.preventDefault();
            selectResult(currentResults[activeIndex]);
          }
        } else if (e.key === 'Escape') {
          hideDropdown();
        }
      });

      input.addEventListener('blur', () => {
        setTimeout(hideDropdown, 200);
      });

      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          hideDropdown();
        }
      });
    });
  }

  // Observer to auto-attach to dynamic modals/forms
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      initRorAutocomplete();
    });
    ready(() => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function updateActiveItem(items, activeIndex) {
    items.forEach((item, idx) => {
      if (idx === activeIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  // =========================================================================
  // 2. Visitor Timezone & Dual Deadline Synchronization
  // =========================================================================

  function detectUserTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch {
      return 'UTC';
    }
  }

  function initTimezoneLocalization() {
    const userTz = detectUserTimezone();
    const isIndia = userTz === SUMMIT_TIMEZONE;

    // Abstract Deadline: 15 October 2026 23:59:59 UTC
    const abstractDeadlineUTC = new Date(Date.UTC(2026, 9, 15, 23, 59, 59));
    // Summit Day: 14 November 2026 09:00:00 UTC
    const summitDayUTC = new Date(Date.UTC(2026, 10, 14, 9, 0, 0));

    const formatLocal = (date) => {
      try {
        return new Intl.DateTimeFormat('en-US', {
          timeZone: userTz,
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZoneName: 'short'
        }).format(date);
      } catch {
        return date.toUTCString();
      }
    };

    const localAbstractStr = formatLocal(abstractDeadlineUTC);
    const localSummitStr = formatLocal(summitDayUTC);

    const abstractCountdownCard = document.querySelector('[data-countdown-target="abstract"]');
    if (abstractCountdownCard) {
      let tzNotice = abstractCountdownCard.querySelector('.tz-sync-notice');
      if (!tzNotice) {
        tzNotice = document.createElement('div');
        tzNotice.className = 'dual-tz-badge tz-sync-notice';
        tzNotice.style.margin = '14px auto 0';
        tzNotice.style.display = 'inline-flex';
        tzNotice.innerHTML = `
          <i class="fa-solid fa-clock" style="color: var(--accent-cyan);"></i>
          <span>Synced: <strong>${localAbstractStr}</strong> in your timezone (${escapeHtml(userTz)})</span>
        `;
        const ctaBtn = abstractCountdownCard.querySelector('a.pill-btn');
        if (ctaBtn) {
          abstractCountdownCard.insertBefore(tzNotice, ctaBtn.nextSibling);
        } else {
          abstractCountdownCard.appendChild(tzNotice);
        }
      }
    }

    if (!isIndia) {
      const dateRows = document.querySelectorAll('.date-row');
      dateRows.forEach((row) => {
        const title = row.querySelector('h3')?.textContent || '';
        if (title.includes('Abstract Submission Deadline') && !row.querySelector('.dual-tz-badge')) {
          const badge = document.createElement('div');
          badge.className = 'dual-tz-badge';
          badge.innerHTML = `<i class="fa-solid fa-globe"></i> <span>Your local time: <strong>${localAbstractStr}</strong></span>`;
          row.querySelector('.date-content-box')?.appendChild(badge);
        } else if (title.includes('Summit Day') && !row.querySelector('.dual-tz-badge')) {
          const badge = document.createElement('div');
          badge.className = 'dual-tz-badge';
          badge.innerHTML = `<i class="fa-solid fa-globe"></i> <span>Your local time: <strong>${localSummitStr}</strong></span>`;
          row.querySelector('.date-content-box')?.appendChild(badge);
        }
      });
    }
  }

  // =========================================================================
  // 3. Dynamic Localized Currency Converter (INR -> Visitor Currency)
  // =========================================================================

  function detectTargetCurrency(userTz) {
    if (!userTz) return 'USD';
    if (userTz === 'Asia/Kolkata') return 'INR';
    if (userTz.startsWith('Europe/London')) return 'GBP';
    if (userTz.startsWith('Europe/')) return 'EUR';
    if (userTz.startsWith('Australia/')) return 'AUD';
    if (userTz.startsWith('America/Toronto') || userTz.startsWith('America/Vancouver') || userTz.startsWith('Canada/')) return 'CAD';
    if (userTz.startsWith('Asia/Singapore')) return 'SGD';
    if (userTz.startsWith('Asia/Dubai')) return 'AED';
    if (userTz.startsWith('Asia/Tokyo')) return 'JPY';
    return 'USD';
  }

  async function getExchangeRates() {
    try {
      const cached = sessionStorage.getItem('sv_exchange_rates_inr');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.rates) {
          return parsed.rates;
        }
      }

      const res = await fetch(EXCHANGE_API_URL);
      if (!res.ok) throw new Error('Exchange rate fetch failed');
      const data = await res.json();
      if (data && data.rates) {
        sessionStorage.setItem(
          'sv_exchange_rates_inr',
          JSON.stringify({ timestamp: Date.now(), rates: data.rates })
        );
        return data.rates;
      }
    } catch {
      // Fallback
    }
    return FALLBACK_RATES;
  }

  async function initCurrencyLocalization() {
    const userTz = detectUserTimezone();
    const targetCurrency = detectTargetCurrency(userTz);

    if (targetCurrency === 'INR') return;

    const rates = await getExchangeRates();
    const rate = rates[targetCurrency] || FALLBACK_RATES[targetCurrency] || 0.0106;
    const symbol = CURRENCY_SYMBOLS[targetCurrency] || `${targetCurrency} `;

    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card) => {
      const inrEl = card.querySelector('.price-inr');
      if (!inrEl) return;

      const rawInr = inrEl.textContent.replace(/[^0-9]/g, '');
      const inrAmount = parseInt(rawInr, 10);
      if (isNaN(inrAmount) || inrAmount <= 0) return;

      const converted = Math.round(inrAmount * rate);
      const formatted = converted.toLocaleString();

      let badge = card.querySelector('.local-currency-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'local-currency-badge';
        const pricingAmount = card.querySelector('.pricing-amount');
        if (pricingAmount) {
          pricingAmount.parentNode.insertBefore(badge, pricingAmount.nextSibling);
        } else {
          inrEl.parentNode.appendChild(badge);
        }
      }

      badge.innerHTML = `
        <i class="fa-solid fa-coins"></i>
        <span>Est. ~${symbol}${formatted} ${targetCurrency}</span>
      `;
      badge.title = `Approximate conversion at live market rates for ${userTz}`;
    });

    const categorySelect = document.getElementById('regCategorySelect');
    if (categorySelect) {
      Array.from(categorySelect.options).forEach((opt) => {
        const text = opt.textContent;
        const match = text.match(/₹([0-9,]+)/);
        if (match && match[1] && !text.includes(`~${symbol}`)) {
          const inrVal = parseInt(match[1].replace(/,/g, ''), 10);
          if (!isNaN(inrVal)) {
            const converted = Math.round(inrVal * rate);
            opt.textContent = `${text} [~${symbol}${converted} ${targetCurrency}]`;
          }
        }
      });
    }
  }

  // =========================================================================
  // 4. Academic Email Integrity & Anti-Burner Gate
  // =========================================================================

  const domainIntegrityCache = new Map();

  async function checkEmailDomainDisposable(domain) {
    if (!domain) return false;
    const cleanDomain = domain.toLowerCase().trim();

    // Whitelist trusted consumer and university domains
    if (TRUSTED_EMAIL_DOMAINS.has(cleanDomain)) return false;
    if (/\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2}|res\.in|gov)$/i.test(cleanDomain)) return false;

    // Instant check against known burners
    if (KNOWN_BURNER_DOMAINS.has(cleanDomain)) return true;

    // Check cache
    if (domainIntegrityCache.has(cleanDomain)) {
      return domainIntegrityCache.get(cleanDomain);
    }

    // Query Kickbox Open API with 2.5s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${KICKBOX_DISPOSABLE_API}/${encodeURIComponent(cleanDomain)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const isDisposable = Boolean(data.disposable);
        domainIntegrityCache.set(cleanDomain, isDisposable);
        return isDisposable;
      }
    } catch {
      // Fail open so legitimate users are never blocked
    }

    return false;
  }

  function initEmailIntegrity() {
    const emailInputs = document.querySelectorAll('input[type="email"], input[name="author_email"], input[name="email"]');
    if (!emailInputs.length) return;

    emailInputs.forEach((input) => {
      if (input.dataset.emailIntegrityInitialized) return;
      input.dataset.emailIntegrityInitialized = 'true';

      const form = input.closest('form');

      const validateInput = async () => {
        const val = input.value.trim();
        const parts = val.split('@');

        let warning = input.parentElement.querySelector('.email-integrity-warning');

        if (parts.length !== 2 || !parts[1].includes('.')) {
          if (warning) warning.remove();
          input.classList.remove('input-warning-border');
          input.dataset.isDisposable = 'false';
          return true;
        }

        const domain = parts[1];
        const isDisposable = await checkEmailDomainDisposable(domain);

        if (isDisposable) {
          input.dataset.isDisposable = 'true';
          input.classList.add('input-warning-border');

          if (!warning) {
            warning = document.createElement('div');
            warning.className = 'email-integrity-warning';
            warning.innerHTML = `
              <i class="fa-solid fa-triangle-exclamation"></i>
              <span>Disposable email domain detected. Please provide a permanent university or personal address to receive review decisions and conference credentials.</span>
            `;
            input.parentElement.appendChild(warning);
          }
          return false;
        } else {
          input.dataset.isDisposable = 'false';
          input.classList.remove('input-warning-border');
          if (warning) warning.remove();
          return true;
        }
      };

      input.addEventListener('blur', validateInput);
      input.addEventListener('change', validateInput);

      // Block form submission if disposable
      if (form) {
        form.addEventListener('submit', async (e) => {
          if (input.dataset.isDisposable === 'true') {
            e.preventDefault();
            e.stopImmediatePropagation();
            input.focus();
            if (window.showToast) {
              window.showToast('Please enter a permanent institutional or personal email address before proceeding.', 'error');
            } else {
              alert('Please enter a permanent institutional or personal email address before proceeding.');
            }
            return false;
          }
        }, true);
      }
    });
  }

  // =========================================================================
  // 5. 1-Click "Add to Calendar" (.ICS & Google Calendar Engine)
  // =========================================================================

  function getGoogleCalendarUrl(event) {
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.startUtc}/${event.endUtc}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
  }

  function getOutlookLiveUrl(event) {
    return `https://outlook.live.com/calendar/0/action/compose?allday=false&subject=${encodeURIComponent(event.title)}&startdt=${encodeURIComponent(event.startIso)}&enddt=${encodeURIComponent(event.endIso)}&body=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
  }

  function downloadIcsFile(event, filename = 'SVRIAS-2026-Event.ics') {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ScholarVault Conferences//SVRIAS 2026//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:svrias-2026-${Date.now()}@scholarvault.in`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${event.startUtc}`,
      `DTEND:${event.endUtc}`,
      `SUMMARY:${event.title.replace(/\n/g, ' ')}`,
      `DESCRIPTION:${event.details.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location.replace(/\n/g, ' ')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  function createCalendarDropdownWidget() {
    const wrap = document.createElement('div');
    wrap.className = 'calendar-dropdown-wrap';

    wrap.innerHTML = `
      <button class="pill-btn frosted-pill calendar-toggle-btn" type="button" aria-expanded="false">
        <i class="fa-regular fa-calendar-plus" style="color: var(--accent-cyan);"></i>
        <span>Add to Calendar</span>
        <i class="fa-solid fa-chevron-down" style="font-size: 9px; margin-left: 4px;"></i>
      </button>
      <div class="calendar-dropdown-menu" role="menu">
        <div class="calendar-menu-header">18–19 Dec 2026 • Conference Days</div>
        <a href="${getGoogleCalendarUrl(SUMMIT_EVENT)}" target="_blank" rel="noopener noreferrer" class="calendar-menu-item">
          <i class="fa-brands fa-google" style="color: #4285F4;"></i>
          <span>Google Calendar (Summit)</span>
        </a>
        <button type="button" class="calendar-menu-item" data-cal-action="ics-summit">
          <i class="fa-brands fa-apple" style="color: #ffffff;"></i>
          <span>Apple / Outlook (.ICS)</span>
        </button>
        <a href="${getOutlookLiveUrl(SUMMIT_EVENT)}" target="_blank" rel="noopener noreferrer" class="calendar-menu-item">
          <i class="fa-brands fa-microsoft" style="color: #0078D4;"></i>
          <span>Outlook / Office 365</span>
        </a>

        <div class="calendar-menu-header" style="margin-top: 6px;">10 Nov 2026 • Abstract Deadline</div>
        <a href="${getGoogleCalendarUrl(DEADLINE_EVENT)}" target="_blank" rel="noopener noreferrer" class="calendar-menu-item">
          <i class="fa-solid fa-hourglass-half" style="color: var(--accent-gold);"></i>
          <span>Add Deadline to Google</span>
        </a>
        <button type="button" class="calendar-menu-item" data-cal-action="ics-deadline">
          <i class="fa-solid fa-file-arrow-down" style="color: var(--accent-gold);"></i>
          <span>Deadline (.ICS File)</span>
        </button>
      </div>
    `;

    const toggleBtn = wrap.querySelector('.calendar-toggle-btn');
    const menu = wrap.querySelector('.calendar-dropdown-menu');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      document.querySelectorAll('.calendar-dropdown-menu.open').forEach((m) => m.classList.remove('open'));
      if (!isOpen) {
        menu.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        menu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    wrap.querySelectorAll('[data-cal-action]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.getAttribute('data-cal-action');
        if (action === 'ics-summit') {
          downloadIcsFile(SUMMIT_EVENT, 'SVRIAS-2026-Virtual-Summit.ics');
        } else if (action === 'ics-deadline') {
          downloadIcsFile(DEADLINE_EVENT, 'SVRIAS-2026-Abstract-Deadline.ics');
        }
        menu.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        menu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    return wrap;
  }

  function initCalendarSync() {
    // 1. In index.html countdown card
    const countdownCard = document.querySelector('[data-countdown-target="abstract"]');
    if (countdownCard && !countdownCard.querySelector('.calendar-dropdown-wrap')) {
      const widget = createCalendarDropdownWidget();
      widget.style.marginTop = '14px';
      widget.style.display = 'inline-block';
      countdownCard.appendChild(widget);
    }

    // 2. In register.html hero / action strip
    const registerCard = document.querySelector('#intakeForm');
    if (registerCard && !registerCard.querySelector('.calendar-dropdown-wrap')) {
      const header = registerCard.querySelector('h2');
      if (header) {
        const wrapRow = document.createElement('div');
        wrapRow.style.display = 'flex';
        wrapRow.style.justifyContent = 'space-between';
        wrapRow.style.alignItems = 'center';
        wrapRow.style.flexWrap = 'wrap';
        wrapRow.style.gap = '10px';
        wrapRow.style.marginBottom = '12px';

        const titleSpan = document.createElement('span');
        titleSpan.style.fontSize = '13px';
        titleSpan.style.color = '#94a3b8';
        titleSpan.innerHTML = '<i class="fa-regular fa-bell" style="color: var(--accent-gold);"></i> Save Summit Day to your calendar:';

        const widget = createCalendarDropdownWidget();

        wrapRow.appendChild(titleSpan);
        wrapRow.appendChild(widget);
        header.parentNode.insertBefore(wrapRow, header.nextSibling);
      }
    }

    // 3. In submit-paper.html template download bar
    const submitTemplatesBar = document.querySelector('.conf-section > div[style*="justify-content: center"]');
    if (submitTemplatesBar && !submitTemplatesBar.querySelector('.calendar-dropdown-wrap')) {
      const widget = createCalendarDropdownWidget();
      submitTemplatesBar.appendChild(widget);
    }
  }

  // =========================================================================
  // Initialization Bootstrap
  // =========================================================================

  ready(() => {
    initRorAutocomplete();
    initTimezoneLocalization();
    initCurrencyLocalization();
    initEmailIntegrity();
    initCalendarSync();
  });

  window.ScholarVaultAcademicEnrichment = {
    initRorAutocomplete,
    initTimezoneLocalization,
    initCurrencyLocalization,
    initEmailIntegrity,
    initCalendarSync,
    detectUserTimezone,
    detectTargetCurrency,
    checkEmailDomainDisposable,
    downloadIcsFile,
    SUMMIT_EVENT,
    DEADLINE_EVENT
  };
})();
