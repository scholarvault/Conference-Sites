# 🔭 Recon Intelligence Briefing — 2026-06-08

## Executive Summary
This run confirmed that AllConferences.com is still parked. Additionally, Resurchify has listed hundreds of seemingly automated duplicate events for the same locations and dates, often appending "--EI" to conference acronyms.

---

## 🚩 High-Risk Conference Signals Found

### Academic Research Library SDG-Themed Submissions
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Highly generic conference proceedings titled like "Inclusive Growth, AI-Driven Education, and Sustainable Economic Development".
  - Titles that stuff buzzwords across multiple disciplines.
  - Very quick succession of identical themes (e.g., May 26, May 28, May 30).
- **Recommended Action:** Add these specific buzzword clusters to the heuristic engine for manual review.
- **Priority:** MEDIUM

### Resurchify Bulk Duplicate Listings
- **Source:** https://www.resurchify.com/
- **Risk Signals Detected:**
  - Duplicate events hosted in identical cities on identical dates.
  - Examples: ICCAR 2026 vs. ICCAR--EI 2026; ICMAA 2026 vs. ICMAA--EI 2026; ICMIP 2026 vs. ICMIP--EI 2026.
  - Same pattern extends across numerous acronyms for conferences in Japan and France.
- **Recommended Action:** Flag listings from Resurchify that contain "--EI" as potentially manipulative indexing claims.
- **Priority:** HIGH

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Sport Economics | High | Potential niche expansion area, frequently appearing on Conference Index. |
| Osteoporosis | High | Frequently tracked on Conference Index, high volume in USA/Canada/Australia. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Site remains offline/parked since previous scans.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Improve heuristic detection for "--EI" and similar database suffixes**
   - **Observed:** Resurchify is flooded with duplicate listings where one entry appends "--EI" (presumably standing for Engineering Index) to the conference acronym.
   - **Possible improvement:** Add an explicit penalty/flag for conference names that append "--EI", "-Scopus", "-WoS", etc., to their acronyms.
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we consider AllConferences.com completely dead and remove it from our primary scan list?
- Is there an automated way we can de-duplicate Resurchify listings in our ingest pipeline before running the risk scoring?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- Conference Alerts: Normal operations, topics cover the usual wide spread.
- Academic Research Library: Proceeding names are very long and generic: "Inclusive Growth, AI-Driven Education, and Sustainable Economic Development" (3rd Jun), "Intelligent Innovation and Sustainable Solutions for Future Societies" (1st Jun), etc.
- World Research Library: Normal operations. Continuing to see IRAJ and similar networks.
- WikiCFP: Normal operations.
- Conference Index: Heavy volume of generic medical/economics conferences (Osteoporosis, Sport Economics).
- Resurchify: Massive amount of duplicated listings in "Events Recently Added". Examples:
  - ICCAR 2026 (Apr 8-10, Nagoya) and ICCAR--EI 2026 (Apr 8-10, Nagoya)
  - ICMAA 2026 (Apr 1-3, Tokyo) and ICMAA--EI 2026 (Apr 1-3, Tokyo)
  - ICMIP 2026 (Apr 25-27, Sapporo) and ICMIP--EI 2026 (Apr 25-27, Sapporo)
  - CSP 2026 and CSP--EI 2026
  - ICSIE 2026 and ICSIE--EI 2026
  - EESP 2026 and EESP--EI 2026
  - ICNT 2026 and ICNT--EI 2026
  - ICAIBD 2026 and IEEE ICAIBD 2026 (Chengdu)
  - BDEE 2026 and BDEE--EI 2026
  - ICoSSE 2026 and ICoSSE--EI 2026
  - ICGDA 2026 and ICGDA--EI 2026
  - ICMFM 2026 and ICMFM--EI 2026

</details>