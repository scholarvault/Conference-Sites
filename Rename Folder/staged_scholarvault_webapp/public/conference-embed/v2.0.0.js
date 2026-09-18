/**
 * ScholarVault Conference Web Kit SDK v2.0.0
 * Zero-dependency, declarative integration library for ScholarVault conference sites.
 * (C) ScholarVault Research Solutions. All rights reserved.
 */
(function () {
  "use strict";

  if (window.__SV_WEBKIT_V2_LOADED__) return;
  window.__SV_WEBKIT_V2_LOADED__ = true;

  var script =
    document.currentScript ||
    document.querySelector('script[data-conference][src*="conference-embed"]');
  var conferenceSlug = script ? script.getAttribute("data-conference") : null;
  var portalOrigin = (
    (script ? script.getAttribute("data-origin") : "") ||
    "https://app.scholarvault.in"
  ).replace(/\/$/, "");

  // Stylesheet injection
  function injectStyles() {
    if (document.getElementById("sv-webkit-styles-v2")) return;
    var style = document.createElement("style");
    style.id = "sv-webkit-styles-v2";
    style.innerHTML = `
      .sv-drawer-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px); z-index: 9999999; display: flex; align-items: center;
        justify-content: center; opacity: 0; transition: opacity 0.25s ease;
      }
      .sv-drawer-overlay.sv-open { opacity: 1; }
      .sv-drawer-box {
        background: #ffffff; color: #18181b; border-radius: 24px; padding: 32px; max-width: 480px;
        width: 92%; box-sizing: border-box; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        position: relative; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        transform: scale(0.95) translateY(10px); transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .sv-drawer-overlay.sv-open .sv-drawer-box { transform: scale(1) translateY(0); }
      .sv-drawer-close {
        position: absolute; top: 18px; right: 18px; background: none; border: none; font-size: 22px;
        color: #71717a; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; display: grid;
        place-items: center; transition: background 0.15s, color 0.15s;
      }
      .sv-drawer-close:hover { background: #f4f4f5; color: #18181b; }
      .sv-badge {
        display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px;
        font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
        background: #ecfdf5; color: #047857; margin-bottom: 12px;
      }
      .sv-title { font-size: 22px; font-weight: 800; margin: 0 0 8px; color: #18181b; }
      .sv-sub { font-size: 14px; line-height: 1.5; color: #52525b; margin: 0 0 20px; }
      .sv-input-group { margin-bottom: 16px; text-align: left; }
      .sv-label { display: block; font-size: 12px; font-weight: 700; color: #27272a; margin-bottom: 6px; }
      .sv-input {
        width: 100%; padding: 12px 14px; border-radius: 12px; border: 1px solid #d4d4d8;
        font-size: 14px; box-sizing: border-box; outline: none; transition: border-color 0.15s;
      }
      .sv-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.15); }
      .sv-otp-box { display: flex; gap: 8px; justify-content: center; margin: 20px 0; }
      .sv-otp-digit {
        width: 48px; height: 56px; border-radius: 12px; border: 1.5px solid #d4d4d8; text-align: center;
        font-size: 24px; font-weight: 800; font-family: monospace; outline: none; transition: all 0.15s;
      }
      .sv-otp-digit:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5,150,105,0.15); }
      .sv-btn-primary {
        width: 100%; padding: 14px; border-radius: 12px; background: #18181b; color: #ffffff;
        font-size: 15px; font-weight: 700; border: none; cursor: pointer; transition: background 0.15s;
      }
      .sv-btn-primary:hover { background: #27272a; }
      .sv-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .sv-error { color: #dc2626; font-size: 12px; font-weight: 600; margin-top: 8px; }
      .sv-card-verified {
        background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 14px;
        margin: 14px 0; display: flex; align-items: center; gap: 12px; text-align: left;
      }
      .sv-people-grid {
        display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;
      }
      .sv-person-card {
        border-radius: 16px; border: 1px solid #e4e4e7; background: #ffffff; padding: 20px;
        text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      }
      .sv-person-avatar {
        width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 12px;
        border: 2px solid #059669;
      }
      .sv-person-name { font-size: 16px; font-weight: 800; margin: 0 0 4px; color: #18181b; }
      .sv-person-role { font-size: 12px; font-weight: 700; color: #059669; text-transform: uppercase; margin: 0 0 6px; }
      .sv-person-inst { font-size: 12px; color: #71717a; margin: 0; }
    `;
    document.head.appendChild(style);
  }

  // Author OTP Verification Drawer
  function openAuthorVerificationDrawer(options) {
    options = options || {};
    injectStyles();

    var slug = options.slug || conferenceSlug;
    if (!slug) {
      alert("Conference identifier not configured.");
      return;
    }

    var overlay = document.createElement("div");
    overlay.className = "sv-drawer-overlay";

    var content = `
      <div class="sv-drawer-box" id="svAuthorBox">
        <button class="sv-drawer-close" id="svCloseDrawer" aria-label="Close">&times;</button>
        <div class="sv-badge">Author Verification</div>
        <h3 class="sv-title">Verify Paper Authorship</h3>
        <p class="sv-sub">Enter the corresponding author email used during abstract submission to receive a 6-digit verification code.</p>
        
        <div id="svStepEmail">
          <div class="sv-input-group">
            <label class="sv-label">Corresponding Author Email</label>
            <input type="email" id="svAuthorEmail" class="sv-input" placeholder="author@institution.edu" required />
          </div>
          <div class="sv-input-group">
            <label class="sv-label">Paper / Abstract Reference (Optional)</label>
            <input type="text" id="svAuthorPaperId" class="sv-input" placeholder="e.g. SVRIAS26-AB-1234" />
          </div>
          <div id="svEmailError" class="sv-error" style="display:none;"></div>
          <button type="button" id="svSendOtpBtn" class="sv-btn-primary" style="margin-top:10px;">Send 6-Digit Code &rarr;</button>
        </div>

        <div id="svStepOtp" style="display:none;">
          <p class="sv-sub" style="margin-bottom:10px;">We sent a 6-digit code to <strong id="svTargetEmailDisplay"></strong>.</p>
          <div class="sv-otp-box">
            <input type="text" maxlength="1" class="sv-otp-digit" />
            <input type="text" maxlength="1" class="sv-otp-digit" />
            <input type="text" maxlength="1" class="sv-otp-digit" />
            <input type="text" maxlength="1" class="sv-otp-digit" />
            <input type="text" maxlength="1" class="sv-otp-digit" />
            <input type="text" maxlength="1" class="sv-otp-digit" />
          </div>
          <div id="svOtpError" class="sv-error" style="display:none; text-align:center; margin-bottom:12px;"></div>
          <button type="button" id="svVerifyOtpBtn" class="sv-btn-primary">Verify &amp; Unlock Author Pass</button>
          <button type="button" id="svResendOtpBtn" style="background:none; border:none; color:#059669; font-size:13px; font-weight:700; cursor:pointer; width:100%; margin-top:12px;">Resend code</button>
        </div>

        <div id="svStepSuccess" style="display:none; text-align:center;">
          <div class="sv-card-verified">
            <div style="font-size:24px; color:#059669;">✓</div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#065f46;">Authorship Verified!</div>
              <div id="svVerifiedPaperTitle" style="font-size:12px; color:#047857;"></div>
            </div>
          </div>
          <p class="sv-sub">Your Author Pass tier has been unlocked. Proceed with your registration below.</p>
          <button type="button" id="svDoneBtn" class="sv-btn-primary">Continue Registration</button>
        </div>
      </div>
    `;

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    requestAnimationFrame(function () {
      overlay.classList.add("sv-open");
    });

    function close() {
      overlay.classList.remove("sv-open");
      setTimeout(function () {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 250);
    }

    overlay.querySelector("#svCloseDrawer").addEventListener("click", close);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });

    var emailInput = overlay.querySelector("#svAuthorEmail");
    var paperInput = overlay.querySelector("#svAuthorPaperId");
    var emailError = overlay.querySelector("#svEmailError");
    var sendBtn = overlay.querySelector("#svSendOtpBtn");

    var stepEmail = overlay.querySelector("#svStepEmail");
    var stepOtp = overlay.querySelector("#svStepOtp");
    var stepSuccess = overlay.querySelector("#svStepSuccess");

    var otpDigits = overlay.querySelectorAll(".sv-otp-digit");
    var otpError = overlay.querySelector("#svOtpError");
    var verifyBtn = overlay.querySelector("#svVerifyOtpBtn");
    var targetEmailDisplay = overlay.querySelector("#svTargetEmailDisplay");

    // Auto-advance OTP inputs
    otpDigits.forEach(function (digit, idx) {
      digit.addEventListener("input", function () {
        if (digit.value && idx < otpDigits.length - 1) {
          otpDigits[idx + 1].focus();
        }
      });
      digit.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !digit.value && idx > 0) {
          otpDigits[idx - 1].focus();
        }
      });
    });

    // Step 1: Send OTP
    sendBtn.addEventListener("click", async function () {
      var email = emailInput.value.trim();
      if (!email || !email.includes("@")) {
        emailError.textContent = "Please provide a valid email address.";
        emailError.style.display = "block";
        return;
      }
      emailError.style.display = "none";
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending code...";

      try {
        var res = await fetch(`${portalOrigin}/api/conferences/${slug}/authors/challenge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, submission_id: paperInput.value.trim() || undefined }),
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to dispatch verification code.");

        targetEmailDisplay.textContent = email;
        stepEmail.style.display = "none";
        stepOtp.style.display = "block";
        otpDigits[0].focus();
      } catch (err) {
        emailError.textContent = err.message;
        emailError.style.display = "block";
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = "Send 6-Digit Code →";
      }
    });

    // Step 2: Verify OTP
    verifyBtn.addEventListener("click", async function () {
      var code = Array.from(otpDigits)
        .map((d) => d.value.trim())
        .join("");
      if (code.length < 6) {
        otpError.textContent = "Please enter all 6 digits.";
        otpError.style.display = "block";
        return;
      }
      otpError.style.display = "none";
      verifyBtn.disabled = true;
      verifyBtn.textContent = "Verifying...";

      try {
        var res = await fetch(`${portalOrigin}/api/conferences/${slug}/authors/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput.value.trim(), code: code }),
        });
        var data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed. Incorrect code.");

        // Attach token to any form on page
        var formTokenInput = document.querySelector('input[name="author_token"]');
        if (!formTokenInput) {
          formTokenInput = document.createElement("input");
          formTokenInput.type = "hidden";
          formTokenInput.name = "author_token";
          var targetForm = document.querySelector("form") || document.body;
          targetForm.appendChild(formTokenInput);
        }
        formTokenInput.value = data.token;

        // Populate verified paper info
        var titleEl = overlay.querySelector("#svVerifiedPaperTitle");
        if (titleEl && data.submission) {
          titleEl.textContent = `${data.submission.submission_number}: ${data.submission.title}`;
        }

        stepOtp.style.display = "none";
        stepSuccess.style.display = "block";

        if (typeof options.onVerified === "function") {
          options.onVerified(data);
        }
      } catch (err) {
        otpError.textContent = err.message;
        otpError.style.display = "block";
      } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify & Unlock Author Pass";
      }
    });

    overlay.querySelector("#svDoneBtn").addEventListener("click", close);
  }

  // Render Speakers & Committee dynamically into containers
  async function hydratePeopleContainers() {
    var containers = document.querySelectorAll("[data-sv-people]");
    if (!containers.length || !conferenceSlug) return;

    try {
      var res = await fetch(`${portalOrigin}/api/conferences/${conferenceSlug}/people`);
      if (!res.ok) return;
      var data = await res.json();
      var people = data.people || [];

      containers.forEach(function (container) {
        var roleFilter = container.getAttribute("data-sv-role");
        var filtered = roleFilter
          ? people.filter((p) => p.role === roleFilter)
          : people;

        if (!filtered.length) return;

        injectStyles();
        var html = '<div class="sv-people-grid">';
        filtered.forEach(function (person) {
          var avatar = person.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop";
          html += `
            <div class="sv-person-card">
              <img src="${avatar}" alt="${person.display_name}" class="sv-person-avatar" />
              <h4 class="sv-person-name">${person.display_name}</h4>
              <p class="sv-person-role">${person.role || "Speaker"}</p>
              <p class="sv-person-inst">${person.institution || ""}</p>
            </div>
          `;
        });
        html += "</div>";
        container.innerHTML = html;
      });
    } catch (e) {
      console.warn("ScholarVault: Could not hydrate people components.", e);
    }
  }

  // Click listeners for declarative hooks
  document.addEventListener("click", function (event) {
    var target = event.target && event.target.closest ? event.target.closest("[data-sv-action]") : null;
    if (!target) return;

    var action = target.getAttribute("data-sv-action");
    if (action === "author-verify") {
      event.preventDefault();
      openAuthorVerificationDrawer();
    }
  });

  // Hydrate on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydratePeopleContainers);
  } else {
    hydratePeopleContainers();
  }

  // Public SDK Surface
  window.ScholarVaultConferences = {
    version: "2.0.0",
    verifyAuthor: openAuthorVerificationDrawer,
    refreshPeople: hydratePeopleContainers,
    open: function (action) {
      if (action === "author-verify") {
        openAuthorVerificationDrawer();
      } else {
        var next = "/dashboard/conferences/" + encodeURIComponent(conferenceSlug) + "/" + action;
        window.location.href = portalOrigin + "/login?next=" + encodeURIComponent(next);
      }
    },
  };
})();
