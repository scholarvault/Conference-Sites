/* ==========================================================================
   PEOPLE LOADER — Shared renderer for Speakers & Committee
   Used by: index.html, speakers.html, committee.html, admin.html
   ========================================================================== */

(function () {
  'use strict';

  /* ── LinkedIn SVG icon ── */
  var linkedinSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
  var shareSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';

  /* ── Escape HTML helper (uses main.js if available, else own) ── */
  function esc(str) {
    if (typeof str !== 'string') return '';
    if (typeof escapeHtml === 'function') return escapeHtml(str);
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ── Get initials ── */
  function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').substring(0, 2).toUpperCase();
  }

  /* ── Native Share ── */
  function shareSpeaker(name, talkType, topic) {
    var cleanType = talkType.replace(/\s*\(.*?\)\s*/g, '').trim();
    if (cleanType.toLowerCase().indexOf('keynote') !== -1) cleanType = 'Keynote Speaker';
    else if (cleanType.toLowerCase().indexOf('invited') !== -1) cleanType = 'Invited Speaker';
    else if (cleanType.toLowerCase().indexOf('panel') !== -1) cleanType = 'Panelist';
    else if (cleanType.toLowerCase().indexOf('workshop') !== -1) cleanType = 'Workshop Speaker';
    else cleanType = 'Speaker';

    var text = '🎤 Excited to announce that ' + name + ' is joining ICAHCR 2026 — AI in Healthcare Conference as a ' + cleanType + '!';
    if (topic) text += '\n\n📌 Topic: "' + topic + '"';
    text += '\n\n📅 August 2026 | 🌐 Virtual + In-person';
    text += '\n🔗 Register now → https://aihealth.scholarvault.in';
    text += '\n\n#ICAHCR2026 #AIinHealthcare #ScholarVault';

    if (navigator.share) {
      navigator.share({ title: 'ICAHCR 2026 — ' + name, text: text, url: 'https://aihealth.scholarvault.in/speakers' });
    } else {
      navigator.clipboard.writeText(text).then(function () {
        if (typeof showToast === 'function') showToast('Copied to clipboard!', 'success');
        else alert('Copied to clipboard!');
      });
    }
  }
  window.shareSpeaker = shareSpeaker;

  /* ── Render a single person card ── */
  function renderCard(person, type) {
    var name = esc(person.name || '');
    var designation = esc(type === 'speaker' ? (person.designation || '') : (person.expertise || person.designation || ''));
    var institution = esc(person.institution || '');
    var topic = esc(person.topic || '');
    var photoUrl = person.photo_url || '';
    var linkedin = person.linkedin || person.profile_url || '';
    var talkType = esc(person.talk_type || '');
    var initials = getInitials(person.name);

    var photoHTML = photoUrl
      ? '<img class="person-card__photo" src="' + esc(photoUrl) + '" alt="' + name + '" loading="lazy" />'
      : '<div class="person-card__initials">' + initials + '</div>';

    var badgeHTML = '';
    var cleanLabel = '';
    if (type === 'speaker' && talkType) {
      var isKeynote = talkType.toLowerCase().indexOf('keynote') !== -1;
      cleanLabel = talkType.replace(/\s*\(.*?\)\s*/g, '').trim();
      if (isKeynote) cleanLabel = 'Keynote';
      else if (cleanLabel.toLowerCase().indexOf('invited') !== -1) cleanLabel = 'Invited Talk';
      else if (cleanLabel.toLowerCase().indexOf('panel') !== -1) cleanLabel = 'Panelist';
      else if (cleanLabel.toLowerCase().indexOf('workshop') !== -1) cleanLabel = 'Workshop';
      badgeHTML = '<div class="person-card__badge' + (isKeynote ? ' person-card__badge--keynote' : '') + '">' + cleanLabel + '</div>';
    }

    var linkedinHTML = '';
    if (linkedin) {
      linkedinHTML = '<a href="' + esc(linkedin) + '" target="_blank" rel="noopener" class="person-card__linkedin" title="LinkedIn Profile">' + linkedinSVG + '</a>';
    }

    /* Share button for speakers */
    var shareHTML = '';
    if (type === 'speaker') {
      var rawName = (person.name || '').replace(/'/g, "\\'");
      var rawType = (person.talk_type || '').replace(/'/g, "\\'");
      var rawTopic = (person.topic || '').replace(/'/g, "\\'");
      shareHTML = '<button class="person-card__share" onclick="shareSpeaker(\'' + rawName + '\',\'' + rawType + '\',\'' + rawTopic + '\')" title="Share">' + shareSVG + '</button>';
    }

    var actionsHTML = '';
    if (linkedinHTML || shareHTML) {
      actionsHTML = '<div class="person-card__actions">' + linkedinHTML + shareHTML + '</div>';
    }

    return '<div class="person-card">'
      + '<div class="person-card__left">' + photoHTML + '</div>'
      + '<div class="person-card__right">'
        + '<div class="person-card__header">'
          + '<div class="person-card__name">' + name + '</div>'
          + badgeHTML
        + '</div>'
        + '<div class="person-card__designation">' + designation + '</div>'
        + (institution ? '<div class="person-card__institution">' + institution + '</div>' : '')
        + (topic ? '<div class="person-card__title">"' + topic + '"</div>' : '')
        + actionsHTML
      + '</div>'
      + '</div>';
  }

  /* ── Load speakers from Supabase ── */
  function loadSpeakers(containerId, options) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var _db = window.db || (window.SVSite && window.SVSite.db);
    if (!_db) {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--white-40);grid-column:1/-1;">Database not available</div>';
      return;
    }

    options = options || {};
    var query = _db.from('conf_speakers')
      .select('*')
      .eq('status', 'accepted')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    query.then(function (result) {
      var data = result.data;
      if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--white-40);font-size:14px;grid-column:1/-1;">'
          + 'Speaker profiles will appear here as applications are accepted. '
          + '<a href="/speaker-form" style="color:var(--cyan);">Apply to speak →</a></div>';
        return;
      }

      var speakers = data;
      if (options.keynoteOnly) {
        speakers = data.filter(function (s) {
          return s.talk_type && s.talk_type.toLowerCase().indexOf('keynote') !== -1;
        });
      }

      if (options.limit && speakers.length > options.limit) {
        speakers = speakers.slice(0, options.limit);
      }

      if (speakers.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--white-40);font-size:14px;grid-column:1/-1;">'
          + 'Speaker announcements coming soon.</div>';
        return;
      }

      container.innerHTML = speakers.map(function (s) { return renderCard(s, 'speaker'); }).join('');
    }).catch(function () {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--white-40);grid-column:1/-1;">Could not load speakers.</div>';
    });
  }

  /* ── Load committee from Supabase ── */
  function loadCommittee(containerId, options) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var _db = window.db || (window.SVSite && window.SVSite.db);
    if (!_db) {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--white-40);grid-column:1/-1;">Database not available</div>';
      return;
    }

    options = options || {};
    var query = _db.from('conf_committee')
      .select('*')
      .eq('status', 'accepted')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    query.then(function (result) {
      var data = result.data;
      if (!data || data.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--white-40);font-size:14px;grid-column:1/-1;">'
          + 'Committee members will appear here. '
          + '<a href="/committee-form" style="color:var(--cyan);">Apply to join →</a></div>';
        return;
      }

      var members = data;
      if (options.limit && members.length > options.limit) {
        members = members.slice(0, options.limit);
      }

      container.innerHTML = members.map(function (m) { return renderCard(m, 'committee'); }).join('');
    }).catch(function () {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--white-40);grid-column:1/-1;">Could not load committee.</div>';
    });
  }

  /* ── Expose globally ── */
  window.PeopleLoader = {
    loadSpeakers: loadSpeakers,
    loadCommittee: loadCommittee,
    renderCard: renderCard
  };

})();
