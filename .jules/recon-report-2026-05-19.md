# 🔭 Recon Intelligence Briefing — 2026-05-19

## Executive Summary
This run confirms ongoing trends observed in previous scans: AllConferences.com remains parked and unavailable, while Academic Research Library and World Research Library exhibit sustained patterns of generic conference naming and clustering by known organizer networks (e.g., IRAJ).

---

## 🚩 High-Risk Conference Signals Found

### Academic Research Library: Overly Generic Clustering
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Multiple conferences are listed identically as "International Conference 2025 11th - 12th January 2025".
  - Titles lack any specific academic discipline, indicating potential bulk generation for generic submissions.
- **Recommended Action:** Update detection engine to flag identical vague titles occurring on the same date/location without a clear academic scope.
- **Priority:** HIGH

### World Research Library: Organizer-as-Title Proceedings
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Proceedings are titled purely using the organizer's name (e.g., "Academics World International Conference", "GSRD International Conference", "ISERD International Conference").
  - Identical generic branding used across multiple event listings, masking the actual subject matter.
- **Recommended Action:** Flag proceedings where the title matches the publisher/organizer string exactly with no subject scope.
- **Priority:** HIGH

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Dominant across Conference Alerts and WikiCFP; remains a high-risk area for spam submissions. |
| Business/Finance | Medium | High volume of generic proceedings on Academic Research Library. |
| Health/Medicine | Medium | Significant presence across Academic Research Library's vague titles. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Still resolving to a GoDaddy/Afternic parked domain page. The platform appears effectively defunct.
- **World Research Library:** Continues to display heavy cross-linking with known aggregator networks ("Conference Alerts", "All Conference Alerts", "Conference Inc").

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Parked Domain Detection**
   - **Observed:** AllConferences.com has been parked for multiple scanning cycles.
   - **Possible improvement:** Introduce an automatic flag or temporary suspension in the ScholarVault engine for known aggregator domains that start returning domain-parking keywords (e.g., "Afternic", "GoDaddy", "This domain is registered").
   - **Effort estimate:** Low
   - **Impact estimate:** Medium (reduces false positives and timeouts)

2. **Title-Organizer Matching Penalty**
   - **Observed:** Proceedings on World Research Library frequently use the organizer's name as the entire conference title.
   - **Possible improvement:** Add a heuristic to penalize conferences where the event title string has a >80% match with the organizer entity string and lacks academic subject keywords.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we officially remove AllConferences.com from our active primary monitoring list, or keep checking in case it gets bought and revived by a new high-risk network?
- How aggressively should we penalize "International Conference [Year]" titles that don't specify a topic?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: curl redirected to `/lander` indicating parked status.
- Conference Alerts: Normal operations. Topics heavily feature AI, Machine Learning.
- Academic Research Library: Found multiple instances of `<h5>International Conference 2025 11th - 12th January 2025</h5>` repeating under different generic categories (Health, Business).
- World Research Library: "Recent Proceedings" section dominated by "Academics World International Conference", "GSRD International Conference", "Yanjiu International Conference", "SCIENCEFORA INTERNATIONAL CONFERENCE", "Research World International Conference", "ISERD International Conference".
- WikiCFP: Normal operations. Mention of AI/ML in meta descriptions.

</details>
