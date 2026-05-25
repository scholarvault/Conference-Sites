# 🔭 Recon Intelligence Briefing — 2026-05-25

## Executive Summary
Initial scan of primary and secondary conference listing sources reveals an ongoing emphasis on generic structural components to capture high-level traffic. Notably, sites like Academic Research Library continue to promote proceedings across diverse fields under broad domain categories without showing specific verification badges on main landing pages, while WikiCFP exhibits significant activity around "artificial intelligence" and "computer science" events alongside numerous generic or broad topical events (e.g. "Post-digital Democracies 2026").

---

## 🚩 High-Risk Conference Signals Found

### Academic Research Library generic categorization
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Very broad categorization (Education, Health, Business, Environment, Medicine) without strict filtering or obvious vetting displayed upfront.
  - Vague promotional language ("meticulously maintain and update our library daily").
- **Recommended Action:** Investigate the domains and publishers listed within their specific sub-categories for potential overlap with existing blacklist entries.
- **Priority:** MEDIUM

### World Research Library mass-indexing claims
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Broad mission statement aimed at indexing "published international conference manuscripts" and serving as a global platform, yet showcasing events with very generic names (e.g. "Academics World International Conference", "GSRD International Conference").
  - Lack of clear editorial or affiliation details on the front page.
- **Recommended Action:** Cross-reference "Academics World" and "GSRD" against the ScholarVault blacklist to determine if these are known mass-conference organizers.
- **Priority:** HIGH

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Essential to monitor; AI tracks are common targets for low-quality or cloned conferences. |
| Computer Science | High | Continues to be a primary area for high-volume paper generation and calls for papers. |
| Edge Computing | Medium | Emerging sub-field that may begin seeing targeted high-risk events. |

---

## 🔍 Platform Changes Observed

- **WikiCFP:** Continues to display high user-tracking numbers (e.g., 10368 for artificial intelligence), indicating it remains a heavily utilized hub for Call For Papers, making it a critical secondary target for monitoring new high-risk event submissions.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Broadening Topic Verification**
   - **Observed:** High concentration of events under broad tags (AI, Computer Science, Marketing).
   - **Possible improvement:** Introduce specific sub-domain verification checks or stricter anomaly detection for events claiming multi-disciplinary but vaguely defined scopes.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should "Academics World" and "GSRD" from World Research Library be added to the blacklist candidate queue for deeper investigation?
- Are we tracking the specific organizers posting under the highly active "artificial intelligence" tag on WikiCFP?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: Appears to have a simple redirect or loading script on the root page (`window.location.href="/lander"`).
- Conference Alerts: Clean layout, focuses on "Human-vetted academic conferences". Promotes "Find trusted and curated events worldwide". No immediate high-risk anomalies on the front page, seems well-curated.
- Academic Research Library: Shows very generic broad topics (Education, Health, Business, Environment, Medicine). Missing clear indicators of verification criteria.
- World Research Library: Lists events like "Academics World International Conference", "GSRD International Conference", "Yanjiu International Conference", "SCIENCEFORA INTERNATIONAL CONFERENCE". These naming conventions (especially "Academics World") are often associated with high-volume, potentially high-risk conference networks.
- WikiCFP: High tracking counts for AI (10368) and Computer Science (9026). Recent additions include "Post-digital Democracies 2026", "Religious Movements Electoral Politics 2026", etc.

</details>
