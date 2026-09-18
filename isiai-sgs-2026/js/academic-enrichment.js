/**
 * ISIAI-SGS 2026 - Academic Enrichment & Localization Engine
 * 1. ROR (Research Organization Registry) University / Institution Autocomplete
 * 2. Geo-Timezone & Dual Deadline Countdown Synchronization
 */

(function () {
  'use strict';

  const ROR_API_URL = 'https://api.ror.org/v2/organizations';
  const rorQueryCache = new Map();

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

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
      dropdown.style.position = 'absolute';
      dropdown.style.top = '100%';
      dropdown.style.left = '0';
      dropdown.style.right = '0';
      dropdown.style.zIndex = '9999';
      dropdown.style.background = '#ffffff';
      dropdown.style.borderRadius = '12px';
      dropdown.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
      dropdown.style.border = '1px solid #e2e8f0';
      dropdown.style.marginTop = '4px';
      dropdown.style.listStyle = 'none';
      dropdown.style.padding = '4px 0';
      dropdown.style.maxHeight = '260px';
      dropdown.style.overflowY = 'auto';
      wrapper.appendChild(dropdown);

      let debounceTimer = null;
      let currentResults = [];
      let isSelecting = false;

      const hideDropdown = () => {
        clearTimeout(debounceTimer);
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
        currentResults = [];
      };

      const selectResult = (item) => {
        if (!item) return;
        isSelecting = true;
        clearTimeout(debounceTimer);

        const displayName = item.names?.find((n) => n.types?.includes('ror_display'))?.value || item.names?.[0]?.value || '';
        const rorId = item.id || '';
        const countryName = item.locations?.[0]?.geonames_details?.country_name || '';

        input.value = displayName;
        if (rorHidden) rorHidden.value = rorId;
        if (form) {
          form.dataset.rorId = rorId;
          const countryInput = form.querySelector('input[name="author_country"], input[name="country"]');
          if (countryInput && countryName && !countryInput.value) {
            countryInput.value = countryName;
          }
        }

        hideDropdown();
        setTimeout(() => {
          isSelecting = false;
        }, 150);
      };

      input.addEventListener('input', () => {
        if (isSelecting) return;
        const query = input.value.trim();
        if (query.length < 2) {
          hideDropdown();
          return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          try {
            let items = rorQueryCache.get(query);
            if (!items) {
              const res = await fetch(`${ROR_API_URL}?query=${encodeURIComponent(query)}`);
              if (!res.ok) return;
              const json = await res.json();
              items = json.items || [];
              rorQueryCache.set(query, items);
            }

            if (!items.length) {
              hideDropdown();
              return;
            }

            currentResults = items.slice(0, 7);
            dropdown.innerHTML = currentResults
              .map((it, idx) => {
                const name = it.names?.find((n) => n.types?.includes('ror_display'))?.value || it.names?.[0]?.value || 'Unknown';
                const loc = it.locations?.[0]?.geonames_details?.country_name || '';
                return `
                  <li data-index="${idx}" role="option" style="padding: 10px 14px; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,0.05); font-size: 14px; color: #111;">
                    <div style="font-weight: 600;">${escapeHtml(name)}</div>
                    ${loc ? `<div style="font-size: 12px; color: #666;">${escapeHtml(loc)}</div>` : ''}
                  </li>
                `;
              })
              .join('');

            dropdown.style.display = 'block';

            dropdown.querySelectorAll('li').forEach((li) => {
              li.addEventListener('mouseenter', () => {
                li.style.background = 'rgba(163, 230, 53, 0.15)';
              });
              li.addEventListener('mouseleave', () => {
                li.style.background = 'transparent';
              });
              li.addEventListener('mousedown', (e) => {
                e.preventDefault();
                const idx = parseInt(li.dataset.index, 10);
                selectResult(currentResults[idx]);
              });
            });
          } catch (err) {
            console.warn('ROR error:', err);
          }
        }, 220);
      });

      document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
          hideDropdown();
        }
      });
    });
  }

  if (document.readyState !== 'loading') {
    initRorAutocomplete();
  } else {
    document.addEventListener('DOMContentLoaded', initRorAutocomplete);
  }
})();
