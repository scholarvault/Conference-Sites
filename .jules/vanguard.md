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

## 2025-05-27 - Standardized Form Loading and Success
**Element:** `aihealth/downloads.html`, `aihealth/call-for-papers.html`
**Finding:** Form submission handlers frequently omitted loading states when using modal forms like `downloadModal`, allowing users to submit multiple times.
**Constraint:** The original setup lacked finally blocks to revert the disabled state.
**Remember:** Whenever using form handlers on modal popups, always wrap them in a `try/catch/finally` block and call `setFormLoading(e.target, true)` / `setFormLoading(e.target, false)`.
## 2025-05-31 - Standardized Form Loading and Error Handling
**Element:** `aihealth/register.html`
**Finding:** Form submission handlers (`initiatePayment` and `submitBankTransfer`) frequently omitted loading states or failed to use `finally` blocks to revert the disabled state when encountering errors. This caused forms to become permanently disabled upon failure.
**Constraint:** `submitBankTransfer`'s submit button was outside the actual `<form>` tag, requiring moving it inside and using a standard `addEventListener('submit')` pattern to correctly trigger the `setFormLoading` helper.
**Remember:** Ensure that submit buttons are nested inside their respective `<form>` elements and always utilize a `try/finally` block when standardizing loading states across custom handlers to guarantee proper UI state reversion.
