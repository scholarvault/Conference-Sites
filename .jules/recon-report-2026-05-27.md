# 🔭 Recon Intelligence Briefing — 2026-05-27

## Executive Summary
Multiple high-risk organizer networks (IRAJ, ISER) are continuing to aggressively promote clustered, generic conferences on World Research Library and Academic Research Library. Additionally, AllConferences.com remains parked/down.

---

## 🚩 High-Risk Conference Signals Found

### IRAJ Network Event Clusters
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Same organizing entity (IRAJ) running numerous simultaneous conferences under different names (Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, ISERD).
  - High volume of conferences occurring in a very short window (May 10-23, 2026) across disparate global locations (Barcelona, Seoul, Hue, Yogyakarta, Cairo, Madrid).
  - Proceeding cover images all contain "PROCE-IRAJ" in their filenames.
- **Recommended Action:** Ensure the IRAJ network and its sub-brands (Academics World, GSRD, Yanjiu, SCIENCEFORA, Research World, ISERD) are fully captured in the blacklist engine and penalize massive parallel event clustering.
- **Priority:** HIGH

### Generic "Sustainable/Health/Innovation" Conferences
- **Source:** https://academicresearchlibrary.org/conference-proceedings
- **Risk Signals Detected:**
  - Generic scopes covering too many unrelated disciplines (e.g., "Sustainable Finance, Health Promotion, Cultural Innovation, and Community Development").
  - Clustered dates (May 19-25, 2026) with identical, stock-photo-style proceeding covers.
  - No clear organizing institution visible on the immediate listing.
- **Recommended Action:** Investigate the organizers behind these clustered proceedings (IDs 829-865) for potential inclusion in the blacklist candidate list.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Dominant category on WikiCFP (10373 CFPs). Needs robust whitelist to separate high-risk AI events from legitimate ones. |
| Computer Science | High | Consistently the highest volume category across all platforms. |
| Machine Learning / NLP | High | Fast-growing sub-fields on WikiCFP, often targeted by high-risk organizers. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** Site appears to be parked or offline. No longer resolving to a conference directory.
- **Conference Alerts:** Platform functioning normally. No major structural changes observed.
- **Conference Index:** Functioning as an aggregator with heavy categorization by tags and countries. Massive database (11,000+ US events).

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Dead Link Detection in Verification Engine**
   - **Observed:** AllConferences.com is down/parked.
   - **Possible improvement:** Ensure the ScholarVault verification engine doesn't penalize a legitimate conference solely because a directory listing link it provided is now dead.
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

2. **Parallel Event Clustering Penalty**
   - **Observed:** IRAJ running 6+ international conferences in a 2-week span across different continents.
   - **Possible improvement:** Introduce a specific risk penalty in the scoring engine for organizers hosting an implausible number of geographically dispersed events simultaneously.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Are the specific IRAJ sub-brands (GSRD, SCIENCEFORA, Yanjiu, Academics World, Research World, ISERD) explicitly defined in our blacklist, or just the parent IRAJ name?
- How should we handle parked domains like AllConferences.com if they are currently factored into our trust scoring?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- Scanned AllConferences.com: Site did not return expected content (parked).
- Scanned Conference Alerts (conal): Standard interface. Spotlights on main page. No obvious new high-risk signals.
- Scanned Academic Research Library: Found a cluster of proceedings scheduled for mid-May 2026. Titles are very long and generic, combining sustainability, health, innovation, and culture. Covers look mass-produced.
- Scanned World Research Library: "Recent Proceedings" heavily dominated by IRAJ-affiliated conferences (May 10-23, 2026) in Spain, South Korea, Vietnam, Indonesia, and Egypt.
- Scanned WikiCFP: AI and Machine Learning dominate popular categories.
- Scanned Conference Index: Massive volume of conferences listed. Very granular tagging.
- Scanned Resurchify: Standard interface. Showing events out to 2026.

</details>
