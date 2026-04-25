## 2025-02-28 - Missing Contact Email Template
**Element:** `aihealth/api/send-email.ts`
**Finding:** The `contact` template was not mapped in `emailMap` and the function `tplContact` did not exist, meaning contact form submissions failed to send confirmation emails.
**Constraint:** None
**Remember:** Whenever creating a new form that sends an email, always verify the template exists in the `api/send-email.ts` handler's `emailMap` and has a corresponding template function.
