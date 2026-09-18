/**
 * ScholarVault Conference Embed & SDK Dispatcher
 * Provides backward-compatible action triggers with automatic v2 upgrade support.
 */
(function () {
  "use strict";
  var script = document.currentScript;
  if (!script) return;
  var conference = script.getAttribute("data-conference");
  var portalOrigin = (script.getAttribute("data-origin") || "https://app.scholarvault.in").replace(/\/$/, "");
  var version = script.getAttribute("data-version") || "1.0.0";

  if (!conference) return;

  // If v2 is explicitly requested or if browser supports modern modules, load v2.0.0.js
  if (version.startsWith("2") || script.getAttribute("data-sv-v2") === "true") {
    var v2Script = document.createElement("script");
    v2Script.src = portalOrigin + "/conference-embed/v2.0.0.js";
    v2Script.setAttribute("data-conference", conference);
    v2Script.setAttribute("data-origin", portalOrigin);
    document.head.appendChild(v2Script);
    return;
  }

  function destination(action) {
    if (action !== "submit" && action !== "register") return null;
    var next = "/dashboard/conferences/" + encodeURIComponent(conference) + "/" + action;
    return portalOrigin + "/login?next=" + encodeURIComponent(next);
  }

  function injectStyles() {
    if (document.getElementById("sv-embed-styles")) return;
    var style = document.createElement("style");
    style.id = "sv-embed-styles";
    style.innerHTML = `
      .sv-modal-overlay {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        z-index: 999999; display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: opacity 0.2s ease;
      }
      .sv-modal-overlay.sv-open { opacity: 1; }
      .sv-modal-box {
        background: #ffffff; border-radius: 24px; padding: 32px; max-width: 420px; width: 90%;
        box-sizing: border-box; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;
        font-family: system-ui, -apple-system, sans-serif; text-align: center;
        transform: translateY(20px); transition: transform 0.2s ease;
      }
      .sv-modal-overlay.sv-open .sv-modal-box { transform: translateY(0); }
      .sv-modal-close {
        position: absolute; top: 16px; right: 16px; background: none; border: none;
        font-size: 24px; cursor: pointer; color: #666; line-height: 1; padding: 4px 8px; border-radius: 50%;
      }
      .sv-modal-close:hover { background: #f0f0f0; }
      .sv-modal-icon {
        width: 56px; height: 56px; background: #E6FAF5; color: #00A388; border-radius: 16px;
        display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
      }
      .sv-modal-title { margin: 0 0 12px; font-size: 22px; font-weight: 800; color: #111; }
      .sv-modal-text { margin: 0 0 20px; font-size: 15px; line-height: 1.5; color: #555; }
      
      .sv-modal-steps-box {
        margin: 0 0 24px; padding: 16px; background: rgba(0, 163, 136, 0.08); border-radius: 16px;
        display: flex; flex-direction: column; gap: 12px; text-align: left; border: 1px solid rgba(0, 163, 136, 0.15);
      }
      .sv-modal-step {
        display: flex; align-items: center; gap: 12px; font-size: 14px; color: #111; font-weight: 600;
      }
      .sv-modal-step svg {
        color: #00A388; flex-shrink: 0;
      }

      .sv-modal-btn {
        display: inline-flex; align-items: center; justify-content: center; width: 100%; box-sizing: border-box;
        background: #111; color: #fff; text-decoration: none; padding: 14px 24px;
        border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; border: none; transition: background 0.2s;
      }
      .sv-modal-btn:hover { background: #222; }
      @media (prefers-color-scheme: dark) {
        .sv-modal-box { background: #1c1c1c; color: #fff; border: 1px solid #333; }
        .sv-modal-title { color: #fff; }
        .sv-modal-text { color: #aaa; }
        .sv-modal-close { color: #aaa; }
        .sv-modal-close:hover { background: #333; }
        .sv-modal-step { color: #eee; }
        .sv-modal-btn { background: #fff; color: #111; }
        .sv-modal-btn:hover { background: #eee; }
        .sv-modal-icon { background: rgba(0, 163, 136, 0.15); }
      }
    `;
    document.head.appendChild(style);
  }

  function showModal(url, action) {
    injectStyles();
    var overlay = document.createElement("div");
    overlay.className = "sv-modal-overlay";
    
    var isReg = action === "register";
    var titleText = isReg ? "Secure your registration" : "Secure abstract submission";
    var bodyText = isReg 
      ? "To securely save your delegate pass, verify your academic identity, and complete your payment, please sign in or create a free ScholarVault account."
      : "To securely upload your abstract and track its evaluation status, please sign in or create a free ScholarVault account.";

    var stepsHtml = isReg ? 
      '<div class="sv-modal-steps-box">' +
        '<div class="sv-modal-step">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' +
          '<span>1. Sign in or create account</span>' +
        '</div>' +
        '<div class="sv-modal-step">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
          '<span>2. Select category & register</span>' +
        '</div>' +
        '<div class="sv-modal-step">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>' +
          '<span>3. Receive invoice & confirmation</span>' +
        '</div>' +
      '</div>' : '';

    var iconSvg = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>';

    overlay.innerHTML = 
      '<div class="sv-modal-box">' +
        '<button class="sv-modal-close" aria-label="Close">&times;</button>' +
        '<div class="sv-modal-icon">' + iconSvg + '</div>' +
        '<h2 class="sv-modal-title">' + titleText + '</h2>' +
        '<p class="sv-modal-text">' + bodyText + '</p>' +
        stepsHtml + 
        '<a href="' + url + '" class="sv-modal-btn">Sign in to continue &rarr;</a>' +
      '</div>';

    document.body.appendChild(overlay);

    overlay.getBoundingClientRect();
    overlay.classList.add("sv-open");

    function close() {
      overlay.classList.remove("sv-open");
      setTimeout(function() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 200);
    }

    overlay.querySelector(".sv-modal-close").addEventListener("click", close);
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) close();
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-scholarvault-action],[data-sv-action]") : null;
    if (!target) return;
    var action = target.getAttribute("data-scholarvault-action") || target.getAttribute("data-sv-action");
    if (action === "author-verify") {
      // Lazy load v2 script to handle verification
      var v2Script = document.createElement("script");
      v2Script.src = portalOrigin + "/conference-embed/v2.0.0.js";
      v2Script.setAttribute("data-conference", conference);
      v2Script.setAttribute("data-origin", portalOrigin);
      v2Script.onload = function() {
        if (window.ScholarVaultConferences && window.ScholarVaultConferences.verifyAuthor) {
          window.ScholarVaultConferences.verifyAuthor();
        }
      };
      document.head.appendChild(v2Script);
      event.preventDefault();
      return;
    }
    var url = destination(action);
    if (!url) return;
    event.preventDefault();
    showModal(url, action);
  });

  window.ScholarVaultConferences = { 
    version: "1.2.0",
    open: function(action) {
      var url = destination(action);
      if (url) showModal(url, action);
    } 
  };
})();
