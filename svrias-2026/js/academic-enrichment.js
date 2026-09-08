/**
 * SVRIAS 2026 - Academic Enrichment & Localization Engine
 * 1. ROR (Research Organization Registry) University / Institution Autocomplete
 * 2. Geo-Timezone & Dual Deadline Countdown Synchronization
 * 3. Dynamic Localized Currency Converter (INR -> Visitor Currency via live exchange rates)
 */

(function () {
  'use strict';

  // --- Configuration ---
  const ROR_API_URL = 'https://api.ror.org/v2/organizations';
  const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest/INR';
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

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // =========================================================================
  // 1. ROR (Research Organization Registry) Autocomplete Engine
  // =========================================================================

  const rorQueryCache = new Map();

  function initRorAutocomplete() {
    const selector = 'input[name="author_institution"], input[name="institution"], input[data-ror-autocomplete]';
    const inputs = document.querySelectorAll(selector);
    if (!inputs.length) return;

    inputs.forEach((input) => {
      if (input.dataset.rorInitialized) return;
      input.dataset.rorInitialized = 'true';

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
        wrapper.style.position = 'relative';
        wrapper.style.width = '100%';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
      }

      const dropdown = document.createElement('ul');
      dropdown.className = 'ror-autocomplete-dropdown';
      dropdown.setAttribute('role', 'listbox');
      dropdown.style.display = 'none';
      wrapper.appendChild(dropdown);

      let debounceTimer = null;
      let activeIndex = -1;
      let currentResults = [];

      const hideDropdown = () => {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        activeIndex = -1;
        currentResults = [];
      };

      const selectResult = (item) => {
        if (!item) return;
        const displayName = item.names?.find((n) => n.types?.includes('ror_display'))?.value || item.names?.[0]?.value || '';
        input.value = displayName;

        const countryName = item.locations?.[0]?.geonames_details?.country_name || '';
        if (countryName && form) {
          const countryInput = form.querySelector('input[name="author_country"], input[name="country"]');
          if (countryInput) {
            countryInput.value = countryName;
            countryInput.dispatchEvent(new Event('input', { bubbles: true }));
            countryInput.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }

        if (rorHidden && item.id) {
          rorHidden.value = item.id;
        }
        if (form) {
          form.dataset.rorId = item.id || '';
          form.dataset.rorName = displayName;
        }

        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));

        hideDropdown();
      };

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

          const displayName = item.names?.find((n) => n.types?.includes('ror_display'))?.value || item.names?.[0]?.value || 'Unknown Institution';
          const city = item.locations?.[0]?.geonames_details?.name || '';
          const state = item.locations?.[0]?.geonames_details?.country_subdivision_name || '';
          const country = item.locations?.[0]?.geonames_details?.country_name || '';
          const rorShortId = (item.id || '').replace(/^https?:\/\/ror\.org\//, 'ror.org/');

          const locationParts = [city, state, country].filter(Boolean);

          li.innerHTML = `
            <div class="ror-item-name">
              <i class="fa-solid fa-graduation-cap"></i>
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

        dropdown.innerHTML = '<li class="ror-loading-indicator"><i class="fa-solid fa-spinner fa-spin"></i> Searching verified universities...</li>';
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
        const query = e.target.value;
        if (!query || query.trim().length < 2) {
          hideDropdown();
          return;
        }
        debounceTimer = setTimeout(() => {
          fetchRor(query);
        }, 220);
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

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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
  // Initialization Bootstrap
  // =========================================================================

  ready(() => {
    initRorAutocomplete();
    initTimezoneLocalization();
    initCurrencyLocalization();
  });

  window.ScholarVaultAcademicEnrichment = {
    initRorAutocomplete,
    initTimezoneLocalization,
    initCurrencyLocalization,
    detectUserTimezone,
    detectTargetCurrency
  };
})();
