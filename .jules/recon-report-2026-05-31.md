# 🔭 Recon Intelligence Briefing — 2026-05-31

## Executive Summary
This run found explicit "Ei/Scopus" indexing claims appearing directly as prefixes in conference titles on WikiCFP, as well as Academic Research Library continuing to push "Sustainable" and "Healthcare" buzzword-heavy proceedings without a named organizer. World Research Library continues to be a hub for IRAJ-managed clustering.

---

## 🚩 High-Risk Conference Signals Found

### Title Prefixing with Indexing Claims (e.g., Ei/Scopus-AI2A 2026)
- **Source:** http://www.wikicfp.com/cfp/
- **Risk Signals Detected:**
  - Popular CFPs are listing their acronyms with explicit indexing database claims prepended to the title (e.g., `Ei/Scopus-AI2A 2026 2026` and `Ei/Scopus-ACEPE 2026`).
  - This suggests an attempt to bypass normal search patterns and guarantee visibility for researchers seeking index-verified events.
- **Recommended Action:** Investigate creating a detection rule that flags conference acronyms beginning with database names (Ei, Scopus, Web of Science).
- **Priority:** HIGH

### Ongoing Buzzword-Heavy Proceeding Titles without Organizers
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Proceedings using long, generic titles (e.g., "Sustainable Systems, Health Innovation, and Cultural Adaptation in a Data-Driven Society" or "Innovative Approaches to Energy, Healthcare, Literature, and Environmental Resilience").
  - Rapid succession of these proceedings grouped closely together by date (May 21-28, 2026).
  - No clear organizing institution or affiliation is visible for these proceedings.
- **Recommended Action:** Review the Academic Research Library source to see if we can extract organizer metadata or if it is entirely synthetic.
- **Priority:** MEDIUM

### Persistent IRAJ / ISER Date Clustering
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Massive parallel event clusters run by the same organizing entity (e.g., Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, and ISERD) all occurring in mid-May 2026.
  - Image URLs heavily feature `PROCE-IRAJ`.
- **Recommended Action:** Continue monitoring IRAJ event density; consider penalizing locations hosting 5+ simultaneous IRAJ events.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Continues to be the most popular category on WikiCFP (over 10,000 CFPs). |
| Sustainable Development | High | Heavily featured in generic proceeding titles on Academic Research Library. |
| Biomedical Engineering / Precision Healthcare | High | Showing up frequently in multi-disciplinary generic proceedings. |

---

## 🔍 Platform Changes Observed

- **WikiCFP:** Prominently displaying `Ei/Scopus` claims directly in the "Popular CFPs" list.
- **AllConferences.com:** Site failed to resolve or is not providing valid conference data (previously noted as parked).

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Title-Level Indexing Claim Penalty**
   - **Observed:** WikiCFP showing CFPs titled `Ei/Scopus-[ACRONYM]`.
   - **Possible improvement:** Enhance ScholarVault's engine to explicitly detect and flag when an indexing claim (Scopus, WoS, EI) is used as part of the official conference acronym or title.
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

2. **Cross-Disciplinary Entropy Check**
   - **Observed:** Academic Research Library using heavily stuffed titles combining Energy, Healthcare, Literature, and Environment in single proceedings.
   - **Possible improvement:** Introduce a scoring penalty for proceedings that attempt to cover more than 3 vastly unrelated high-level disciplines in a single title.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Is it common for legitimate conferences to prepend `Ei/Scopus-` directly to their acronym on WikiCFP, or is this exclusively a high-risk behavior?
- Should we add IRAJ to a more severe blacklist tier given the sheer volume of simultaneous conferences they are generating?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: Failed to load meaningful conference data or is parked.
- Conference Alerts: Normal layout. Advanced search and topic browsing active.
- Academic Research Library: Noticed a pattern of extremely long, generic proceeding titles clustered in late May 2026 (e.g., "Sustainable Systems, Health Innovation, and Cultural Adaptation in a Data-Driven Society" and "Innovative Approaches to Energy, Healthcare, Literature, and Environmental Resilience").
- World Research Library: Normal layout, continues to feature Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, and ISERD International Conferences all occurring in mid-May 2026 with `PROCE-IRAJ` image sources.
- WikiCFP: Popular CFPs explicitly advertising "Ei/Scopus-AI2A 2026 2026" and "Ei/Scopus-ACEPE 2026" directly in the event name.

</details>