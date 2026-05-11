# 🔭 Recon Intelligence Briefing — 2026-05-11

## Executive Summary
Multiple high-risk patterns observed across conference listing platforms, including AllConferences.com appearing as a parked/for-sale domain and World Research Library hosting clustered events by known organizers like IRAJ and ISER on identical dates and locations. Trending topics continue to be dominated by artificial intelligence, computer science, and machine learning.

---

## 🚩 High-Risk Conference Signals Found

### AllConferences.com Parked Domain
- **Source:** https://www.allconferences.com/
- **Risk Signals Detected:**
  - Domain appears parked or for sale. The homepage displays "This domain is registered, but may still be available."
- **Recommended Action:** Investigate further. If permanently offline, remove from primary target list and adjust ScholarVault engine to handle dead links gracefully.
- **Priority:** HIGH

### IRAJ/ISER Organizer Clustering
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Multiple conferences (e.g., "ISER International Conference", "IRAJ INTERNATIONAL CONFERENCE", "Research World International Conference", "WRFER International Conference") scheduled for identical dates (e.g., 2026-04-29, 2026-05-01) in identical locations (e.g., Kuala Lumpur, Malaysia).
  - High volume of events run by the same network.
- **Recommended Action:** Ensure IRAJ and ISER patterns are captured in the blacklist engine.
- **Priority:** HIGH

### Vague Conference Titles
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Multiple entries with non-specific, generic titles like "International Conference 2025 11th - 12th January 2025".
  - Missing specific discipline or thematic focus.
- **Recommended Action:** Add generic title detection to the risk scoring logic.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Essential to monitor for fake "AI" conferences capitalizing on hype. |
| Computer Science | High | Core discipline for technical conferences. |
| Machine Learning | High | Very popular topic, highly susceptible to fast-turnaround paper mills. |

*(Source: WikiCFP category volume)*

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Now redirecting to a GoDaddy/Afternic parked page.
- **World Research Library:** Continuing to list extensive proceedings from IRAJ/ISER networks.
- **Academic Research Library:** Featuring "International Conference 2025" clusters with identical dates.
- **Conference Alerts:** Layout refinements with "Conal Conference Alerts" branding.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Dead Link Handling for Sources**
   - **Observed:** AllConferences.com is currently parked.
   - **Possible improvement:** ScholarVault should gracefully handle verification checks against parked/dead domains to prevent timeouts or false positives.
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

2. **Generic Title Detection**
   - **Observed:** Academic Research Library uses titles like "International Conference [Year]".
   - **Possible improvement:** Penalize or flag conferences that lack a specific subject matter in their title.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we temporarily or permanently remove AllConferences.com from our primary scan list?
- Does the engine currently penalize conferences with overly generic titles (e.g., just "International Conference")?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences: curl redirected to /lander. Page shows "This domain is registered, but may still be available." and "Powered By Afternic".
- Conference Alerts: Normal layout. Found `<title>Conal Conference Alerts — Find quality academic events worldwide</title>`.
- Academic Research Library: Found multiple instances of `<h5>International Conference 2025 11th - 12th January 2025</h5>`.
- World Research Library: Found images/links for "ISER International Conference", "IRAJ INTERNATIONAL CONFERENCE", "Research World International Conference", "WRFER International Conference", all in Kuala Lumpur or similar cities on identical dates.
- WikiCFP: High counts for artificial intelligence (10314), computer science (9006), machine learning (6264).

</details>
