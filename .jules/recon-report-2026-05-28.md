# 🔭 Recon Intelligence Briefing — 2026-05-28

## Executive Summary
This run highlighted duplicate conference indexing claims on Resurchify and proceeding title stuffing with generic sustainability/health keywords on Academic Research Library. Both signals suggest attempts to inflate credibility or search rankings using automated or templatized content.

---

## 🚩 High-Risk Conference Signals Found

### Duplicate Indexing Identifiers (e.g., ICCAR--EI 2026 vs ICCAR 2026)
- **Source:** https://www.resurchify.com/
- **Risk Signals Detected:**
  - Duplicate conference listings for identical dates and locations.
  - One listing uses a suffix (e.g., `--EI`) likely meant to imply "Engineering Index" or similar database indexing claims, despite referencing the same event.
- **Recommended Action:** Investigate further to determine if ScholarVault should penalize listings that duplicate events solely to add indexing acronyms to the title.
- **Priority:** HIGH

### Proceeding Title Keyword Stuffing
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Proceedings using overly long, generic titles stuffed with buzzwords (e.g., "Sustainable Systems, Health Innovation, and Cultural Adaptation in a Data-Driven Society").
  - Rapid succession of these proceedings grouped closely together by date (May 19-23, 2026).
- **Recommended Action:** Add to blacklist candidate or create a detection rule for extremely long, buzzword-heavy titles.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence & Big Data | High | Consistently the top category on listing sites like Resurchify and WikiCFP; high target for fake conferences. |
| Sustainability & Health Innovation | High | Stuffed into generic proceeding titles on Academic Research Library. |

---

## 🔍 Platform Changes Observed

- **Resurchify:** Added "Events Recently Added" section that reveals duplicate event creation strategies (e.g., appending `--EI` to conference acronyms).

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Duplicate Listing Penalty Rule**
   - **Observed:** Resurchify showing duplicate events with `--EI` appended to the acronym.
   - **Possible improvement:** Enhance ScholarVault's detection engine to identify and flag duplicate events on the same dates/locations from the same organizer, especially when acronyms are modified to include indexing claims.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

2. **Proceeding Title Entropy Check**
   - **Observed:** Academic Research Library using heavily stuffed, generic titles for proceedings.
   - **Possible improvement:** Introduce a scoring penalty for proceeding titles that exceed a certain length and contain too many generic buzzwords (e.g., "Sustainable", "Innovation", "Data-Driven").
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should ScholarVault proactively flag any conference acronym appended with `--EI` (or similar indexing claims) as a potential risk signal?
- How heavily should we penalize proceeding titles that appear to be randomly generated from a list of buzzwords?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: Still parked on GoDaddy/Afternic lander page.
- Conference Alerts: Normal layout. Spotlight events include EI/Scopus claims (e.g., WIPE-OUT 2026).
- Academic Research Library: Noticed a pattern of extremely long, generic proceeding titles clustered in late May 2026 (e.g., "Sustainable Finance, Health Promotion, Cultural Innovation, and Community Development").
- World Research Library: Normal layout, continues to feature Academics World, GSRD, Yanjiu, etc.
- WikiCFP: Popular CFPs explicitly advertising "Ei/Scopus-AI2A 2026 2026".
- Resurchify: Recently added events list shows pairs of conferences for the same dates/locations (e.g., ICCAR 2026 and ICCAR--EI 2026; ICMAA 2026 and ICMAA--EI 2026; ICMIP 2026 and ICMIP--EI 2026).

</details>