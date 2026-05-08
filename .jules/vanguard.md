## 2025-02-28 - Missing Contact Email Template
**Element:** `aihealth/api/send-email.ts`
**Finding:** The `contact` template was not mapped in `emailMap` and the function `tplContact` did not exist, meaning contact form submissions failed to send confirmation emails.
**Constraint:** None
**Remember:** Whenever creating a new form that sends an email, always verify the template exists in the `api/send-email.ts` handler's `emailMap` and has a corresponding template function.

## 2025-04-25 - Standardized Form Loading and Success
**Element:** `aihealth/contact.html`
**Finding:** Form submission handlers frequently hardcoded loading states (`btn.disabled = true; btn.textContent = '...'`) and success states (`form.style.display = 'none'; success.classList.add('show')`) instead of using the helper functions `setFormLoading` and `showFormSuccess` available in `js/main.js`.
**Constraint:** There's a pattern of duplicated form handlers across the multiple static HTML pages.
**Remember:** Look out for other `.html` files in `aihealth` and `ICAES...` directories that should be updated to use the standard helpers for a consistent UI state.

## 2026-05-08 - Standardized Form Loading and Success
**Element:** `aihealth/interest-form.html`
**Finding:** The `interestForm` submit handler hardcoded DOM manipulation (`btn.disabled = true; btn.textContent = '...';`, `e.target.style.display = 'none';`) instead of utilizing the `js/main.js` helper functions (`setFormLoading`, `showFormSuccess`), causing inconsistent UI feedback loops.
**Constraint:** None; easily refactored.
**Remember:** Other forms in older sub-directories like `aihealth/admin.html` (which has `btn.disabled = true`) and `aihealth/register.html` might also need similar refactoring in future runs to standardise QA flows across the platform.
