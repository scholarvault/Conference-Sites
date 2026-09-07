/* ==========================================================================
   PEOPLE LOADER — Dynamic Live Renderer for Confirmed Speakers & Committee
   Syncs directly with ScholarVault Organizer Dashboard & Supabase
   Works for SVRIAS 2026 and future ScholarVault conferences
   ========================================================================== */

(function () {
  'use strict';

  var SUPABASE_URL = 'https://ldoirjupetkmldibhygk.supabase.co';
  var SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxkb2lyanVwZXRrbWxkaWJoeWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMzMyOTQsImV4cCI6MjA4NzYwOTI5NH0.i_ocMG3EVLDOycUHfe3Met2Bbg0UdqXzUBqrDY_LKd4';

  var DEFAULT_CONF_IDS = [
    'research-integrity-responsible-ai-summit-2026',
    'svrias-2026',
    'svrias',
  ];

  /* ── SVG Icons ── */
  var linkedinSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';

  /* ── Helper: Escape HTML ── */
  function esc(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Helper: Initials ── */
  function getInitials(name) {
    if (!name) return '?';
    return name
      .split(' ')
      .filter(Boolean)
      .map(function (w) {
        return w[0];
      })
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  /* ── Helper: Detect Conference IDs ── */
  function resolveConfIds(options) {
    if (options && options.confIds && options.confIds.length) {
      return options.confIds;
    }
    var metaEl = document.querySelector('meta[name="conference-id"]');
    if (metaEl && metaEl.content) {
      return [metaEl.content.trim()];
    }
    return DEFAULT_CONF_IDS;
  }

  /* ── Fetch from Supabase REST ── */
  function fetchFromSupabase(table, confIds) {
    var inParam = '(' + confIds.join(',') + ')';
    var url =
      SUPABASE_URL +
      '/rest/v1/' +
      table +
      '?select=*&status=eq.accepted&conf_id=in.' +
      encodeURIComponent(inParam) +
      '&order=sort_order.asc,created_at.asc';

    return fetch(url, {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
    }).then(function (res) {
      if (!res.ok) throw new Error('Network error: ' + res.status);
      return res.json();
    });
  }

  /* ── Render a Single Card matching the Futuristic Design System ── */
  function renderCard(item, type) {
    var isSpeaker = type === 'speaker';
    var name = esc(item.name || '');
    var designation = esc(item.designation || '');
    var institution = esc(item.institution || '');
    var topic = isSpeaker ? esc(item.topic || '') : '';
    var expertise = !isSpeaker ? esc(item.expertise || '') : '';
    var photoUrl = item.photo_url || '';
    var linkedin = item.linkedin || '';
    var talkType = isSpeaker ? esc(item.talk_type || 'Keynote Address') : 'Academic Committee';
    var initials = getInitials(item.name);

    var photoHTML = photoUrl
      ? '<img src="' +
        esc(photoUrl) +
        '" alt="' +
        name +
        '" style="width: 88px; height: 88px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px; border: 2px solid rgba(56, 189, 248, 0.4); display: block; background: rgba(255,255,255,0.05);" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
        '<div style="display:none; width: 88px; height: 88px; border-radius: 50%; margin: 0 auto 16px; border: 2px solid rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.12); color: var(--accent-cyan, #38bdf8); font-size: 24px; font-weight: 800; align-items: center; justify-content: center;">' +
        initials +
        '</div>'
      : '<div style="width: 88px; height: 88px; border-radius: 50%; margin: 0 auto 16px; border: 2px solid rgba(56, 189, 248, 0.4); background: rgba(56, 189, 248, 0.12); color: var(--accent-cyan, #38bdf8); font-size: 24px; font-weight: 800; display: flex; align-items: center; justify-content: center;">' +
        initials +
        '</div>';

    var linkedinHTML = '';
    if (linkedin) {
      linkedinHTML =
        '<a href="' +
        esc(linkedin) +
        '" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; margin-top: 14px; font-size: 12px; color: #0a66c2; text-decoration: none; font-weight: 600; padding: 4px 10px; border-radius: 999px; background: rgba(10, 102, 194, 0.1); border: 1px solid rgba(10, 102, 194, 0.25); transition: background 0.2s ease;" title="LinkedIn Profile">' +
        linkedinSVG +
        ' <span>LinkedIn</span></a>';
    }

    var topicBoxHTML = '';
    if (isSpeaker && topic) {
      topicBoxHTML =
        '<div style="margin-top: 14px; padding: 10px 14px; border-radius: 12px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; line-height: 1.5; color: #e4e4e7;">' +
        '<span style="color: var(--accent-cyan, #38bdf8); font-weight: 700; text-transform: uppercase; font-size: 10.5px; letter-spacing: 0.04em; display: block; margin-bottom: 2px;">Keynote Topic</span>' +
        '&ldquo;' +
        topic +
        '&rdquo;' +
        '</div>';
    }

    var roleBoxHTML = '';
    if (!isSpeaker && expertise) {
      roleBoxHTML =
        '<div style="margin-top: 12px; padding: 8px 12px; border-radius: 10px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); font-size: 12px; color: #e4e4e7;">' +
        '<span style="color: var(--accent-gold, #f59e0b); font-weight: 700; text-transform: uppercase; font-size: 10.5px; display: block; margin-bottom: 2px;">Role &amp; Expertise</span>' +
        expertise +
        '</div>';
    }

    return (
      '<div class="glass-card" style="text-align: center; display: flex; flex-direction: column; justify-content: space-between; padding: clamp(20px, 3vw, 28px);">' +
      '<div>' +
      photoHTML +
      '<div class="card-num" style="font-size: 11px; margin-bottom: 8px; color: var(--accent-cyan, #38bdf8);">' +
      talkType +
      '</div>' +
      '<h3 style="font-size: 18px; font-weight: 700; color: #ffffff; margin-bottom: 6px; line-height: 1.25;">' +
      name +
      '</h3>' +
      '<p style="font-size: 13px; color: var(--accent-cyan, #38bdf8); margin-bottom: 4px; font-weight: 500;">' +
      designation +
      '</p>' +
      (institution
        ? '<p style="font-size: 12px; color: #a1a1aa; line-height: 1.45; margin: 0;">' +
          institution +
          '</p>'
        : '') +
      topicBoxHTML +
      roleBoxHTML +
      '</div>' +
      '<div>' +
      linkedinHTML +
      '</div>' +
      '</div>'
    );
  }

  /* ── Fallback Placeholder Card ── */
  function renderPlaceholder(type) {
    var isSpeaker = type === 'speaker';
    return (
      '<div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; border: 1px dashed rgba(255, 255, 255, 0.2);">' +
      '<div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); display: grid; place-items: center; margin: 0 auto 16px; color: var(--accent-cyan, #38bdf8); font-size: 24px;">' +
      (isSpeaker ? '<i class="fa-solid fa-bullhorn"></i>' : '<i class="fa-solid fa-users-gear"></i>') +
      '</div>' +
      '<h3 style="font-size: 19px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">' +
      (isSpeaker ? 'Keynote Speaker Intake Active' : 'Academic Committee Appointments in Progress') +
      '</h3>' +
      '<p style="font-size: 13.5px; color: #a1a1aa; max-width: 540px; margin: 0 auto 20px; line-height: 1.6;">' +
      (isSpeaker
        ? 'Confirmed keynote and plenary appointments are published on rolling acceptance. Leading scholars and practitioners are invited to apply.'
        : 'Senior faculty, track chairs, and peer-review panelists are currently being confirmed under formal COI declarations.') +
      '</p>' +
      '<a href="' +
      (isSpeaker ? 'speaker-form.html' : 'committee-form.html') +
      '" class="pill-btn glowing-pill">' +
      (isSpeaker ? 'Apply as Keynote Speaker <i class="fa-solid fa-arrow-right"></i>' : 'Apply for Academic Committee <i class="fa-solid fa-arrow-right"></i>') +
      '</a>' +
      '</div>'
    );
  }

  /* ── Load Speakers ── */
  function loadSpeakers(containerId, options) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve();

    options = options || {};
    var confIds = resolveConfIds(options);

    return fetchFromSupabase('conf_speakers', confIds)
      .then(function (data) {
        if (!data || data.length === 0) {
          if (options.preserveInitialIfEmpty) {
            return;
          }
          container.innerHTML = renderPlaceholder('speaker');
          return;
        }

        var speakers = data;
        if (options.limit && speakers.length > options.limit) {
          speakers = speakers.slice(0, options.limit);
        }

        container.innerHTML = speakers
          .map(function (s) {
            return renderCard(s, 'speaker');
          })
          .join('');

        var suffix = document.getElementById('peopleTitleSuffix');
        if (suffix) suffix.textContent = 'Confirmed Keynotes';
        var viewAll = document.getElementById('peopleViewAllWrap');
        if (viewAll) viewAll.style.display = 'block';
      })
      .catch(function (err) {
        console.warn('Could not load speakers:', err);
        if (!options.preserveInitialIfEmpty) {
          container.innerHTML = renderPlaceholder('speaker');
        }
      });
  }

  /* ── Load Committee ── */
  function loadCommittee(containerId, options) {
    var container = document.getElementById(containerId);
    if (!container) return Promise.resolve();

    options = options || {};
    var confIds = resolveConfIds(options);

    return fetchFromSupabase('conf_committee', confIds)
      .then(function (data) {
        if (!data || data.length === 0) {
          container.innerHTML = renderPlaceholder('committee');
          return;
        }

        var members = data;
        if (options.limit && members.length > options.limit) {
          members = members.slice(0, options.limit);
        }

        container.innerHTML = members
          .map(function (m) {
            return renderCard(m, 'committee');
          })
          .join('');
      })
      .catch(function (err) {
        console.warn('Could not load committee:', err);
        container.innerHTML = renderPlaceholder('committee');
      });
  }

  /* ── Auto-mount on DOM Ready ── */
  function autoMount() {
    if (document.getElementById('speakerGrid')) {
      loadSpeakers('speakerGrid');
    }
    if (document.getElementById('keynoteGrid')) {
      loadSpeakers('keynoteGrid', { limit: 4, preserveInitialIfEmpty: true });
    }
    if (document.getElementById('committeeGrid')) {
      loadCommittee('committeeGrid');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }

  /* ── Expose Globally ── */
  window.PeopleLoader = {
    loadSpeakers: loadSpeakers,
    loadCommittee: loadCommittee,
    renderCard: renderCard,
  };
})();
