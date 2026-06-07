# 🔭 Recon Intelligence Briefing — 2026-06-07

## Executive Summary
This run highlighted the increasing prevalence of exact indexing claims embedded directly in conference acronyms on platforms like WikiCFP. Additionally, the proliferation of generic, multidisciplinary events and specific organizer clustering (IRAJ) continues to dominate search results on other monitored aggregators like Academic Research Library and World Research Library.

---

## 🚩 High-Risk Conference Signals Found

### Title Prefixing with Indexing Claims
- **Source:** http://www.wikicfp.com/cfp/
- **Risk Signals Detected:**
  - Continued prominent use of exact database claims in titles, specifically "Ei/Scopus-AI2A 2026 2026" and "Ei/Scopus-ACEPE 2026", showing up as "Popular CFPs".
  - Bypassing typical metadata structures to directly target keyword searches.
- **Recommended Action:** Create detection rules for "Ei/Scopus" or similar variations attached as prefixes to conference acronyms.
- **Priority:** HIGH

### Ongoing Buzzword-Heavy Proceedings
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Proceedings using clustered multidisciplinary buzzwords (e.g., combining Health Innovation and Cultural Adaptation, or Energy, Healthcare, Literature, and Resilience) without any specific topic focus.
  - Dates clustered around January 2025/2026 without a named organizer or clear academic affiliation.
- **Recommended Action:** Review the Academic Research Library structure for potential extraction of detailed metadata to better flag entirely synthetic events.
- **Priority:** MEDIUM

### Persistent IRAJ / ISER Clustering
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Continuing pattern of massive parallel events organized by the same entity (IRAJ), including Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, and ISERD International Conferences.
  - Consistent use of `PROCE-IRAJ` in image URLs.
- **Recommended Action:** Monitor event density for IRAJ; consider implementing a penalty for excessive parallel events at the same location.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence / Machine Learning | High | Highest volume on WikiCFP, frequently combined with aggressive indexing claims. |
| Climate / Environmental Resilience | Medium | Heavily featured in generic multi-disciplinary proceeding titles on Academic Research Library and World Research Library. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Redirects via JavaScript `window.onload=function(){window.location.href="/lander"}`, effectively acting as a parked or redirected domain rather than serving conference data.
- **WikiCFP:** Embedded indexing claims in the "Popular CFPs" module explicitly targeted for visibility.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Indexing Claim Penalty Rules**
   - **Observed:** WikiCFP entries with titles formatted like `Ei/Scopus-[ACRONYM]`.
   - **Possible improvement:** Introduce logic in ScholarVault's engine to penalize titles/acronyms that begin with exact match indexing databases (Ei, Scopus, WoS).
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

2. **Generic Multidisciplinary Title Check**
   - **Observed:** Extremely broad, keyword-stuffed titles (e.g., "Sustainable Systems, Health Innovation, and Cultural Adaptation...").
   - **Possible improvement:** Add an entropy check for proceedings claiming to cover 3+ highly disparate fields simultaneously.
   - **Effort estimate:** Medium
   - **Impact estimate:** Low

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should ScholarVault proactively flag any conference that embeds `Scopus` or `Ei` directly in its acronym, or do legitimate conferences occasionally do this?
- Given the persistent volume, should we elevate the baseline risk score for any conference organized by the IRAJ network?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: Resolves with a JS redirect to a `/lander` page; no substantive conference data.
- Conference Alerts: Normal layout and functionality.
- Academic Research Library: Shows clusters of "International Conference 2025" and generically-named proceedings covering entirely unrelated topics. No clear organizer listed on the main feed.
- World Research Library: Normal layout, continuing to list a large volume of IRAJ-associated conferences (Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, ISERD) with `PROCE-IRAJ` image links.
- Conference Index: Normal layout.
- WikiCFP: The "Popular CFPs" block prominently features "Ei/Scopus-AI2A 2026 2026" and "Ei/Scopus-ACEPE 2026".

</details>
