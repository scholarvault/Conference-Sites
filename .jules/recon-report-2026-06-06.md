# 🔭 Recon Intelligence Briefing — 2026-06-06

## Executive Summary
Observed duplicate conference listings on Resurchify gamed via '--EI' appending and a domain parked state for AllConferences.com. WikiCFP displays title prefixing with explicit indexing claims, while Academic Research Library continues to feature generic buzzword-heavy titles.

---

## 🚩 High-Risk Conference Signals Found

### Academic Research Library Clusters
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Proceeding titles heavily stuffed with generic sustainability and health buzzwords (e.g., 'Intelligent Innovation and Sustainable Solutions for Future Societies', 'Transformative Learning, Digital Innovation, and Human Resilience in a Connected World').
  - "International Conference 2025" clusters showing up on specific dates without specifying a topic or discipline.
- **Recommended Action:** Investigate further and potentially penalize extremely long, generic, buzzword-heavy proceeding titles.
- **Priority:** MEDIUM

### Resurchify Duplicate Listings
- **Source:** https://www.resurchify.com/
- **Risk Signals Detected:**
  - Duplicate conference listings where one entry appends '--EI' (e.g., ICCAR--EI 2026 and ICCAR 2026, ICMAA--EI 2026 and ICMAA 2026 for the same location and dates).
- **Recommended Action:** Add to blacklist candidate for gaming metrics.
- **Priority:** HIGH

### WikiCFP Title Prefixing
- **Source:** http://www.wikicfp.com/cfp/
- **Risk Signals Detected:**
  - Popular CFPs are listing their acronyms with explicit indexing database claims prepended to the title (e.g., `Ei/Scopus-AI2A 2026 2026`).
- **Recommended Action:** Flag conference acronyms beginning with database names.
- **Priority:** HIGH

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Sustainability & Resilience | High | Frequent use of buzzwords in proceeding titles suggests a trend in targeting broad topics to attract submissions. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Domain is parked/for sale, showing a landing page instead of the expected site structure.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Flag Duplicate Indexing Claims**
   - **Observed:** Resurchify contains duplicate conference listings where one entry appends '--EI'.
   - **Possible improvement:** Enhance ScholarVault engine to detect and flag duplicate listings used to game indexing metrics.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

2. **Detect Title Prefixing with Indexing Claims**
   - **Observed:** WikiCFP CFPs list their acronyms with explicit indexing database claims prepended to the title.
   - **Possible improvement:** Implement a check for conference acronyms beginning with database names (Ei, Scopus, Web of Science).
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we automatically penalize overly generic conference titles that lack subject matter, or flag them for manual review?
- How should the ScholarVault engine handle dead links causing timeouts for parked domains like AllConferences.com?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com is parked.
- Conference Alerts (Conal) seems to be operating normally.
- Academic Research Library shows many generic proceeding titles (e.g., "Sustainable Systems, Health Innovation, and Cultural Adaptation in a Data-Driven Society").
- World Research Library features identical date/location clustering by specific organizers.
- WikiCFP shows explicit indexing claims in titles (e.g., "Ei/Scopus-AI2A 2026").
- Conference Index seems to be a directory with large volume per country/city.
- Resurchify shows duplicate conferences with --EI appended to acronyms (e.g., ICCAR--EI 2026 and ICCAR 2026).
- NIER.in shows conferences across India with identical branding.
</details>
