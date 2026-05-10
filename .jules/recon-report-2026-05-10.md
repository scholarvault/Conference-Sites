# 🔭 Recon Intelligence Briefing — 2026-05-10

## Executive Summary
This run confirmed that AllConferences.com appears to be parked, and heavy clustering of identical conferences by specific networks (IRAJ, ISER, SFE, NIER) continues to dominate World Research Library and Academic Research Library. Additionally, WikiCFP shows massive, sustained trending volume in Artificial Intelligence and Machine Learning.

---

## 🚩 High-Risk Conference Signals Found

### Academic Research Library Clusters
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Multiple identical international conferences scheduled for "11th - 12th January 2025"
  - Associated with organizers: "SFE", "NIER"
- **Recommended Action:** Investigate further and cross-reference organizers with existing blacklist.
- **Priority:** HIGH

### World Research Library Organizer Networks
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Continued heavy promotion of proceedings from known networks: IRAJ, ISER, Researchfora, Academics World.
  - Strong visual similarity in proceeding covers and event names.
- **Recommended Action:** Add to blacklist candidate review if not already present.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High (10,313 on WikiCFP) | Need to ensure detection engine can distinguish between legitimate AI conferences and low-quality generic ones. |
| Computer Science | High (9,006 on WikiCFP) | Core domain; high risk for generic catch-all conferences. |
| Machine Learning | High (6,264 on WikiCFP) | Similar to AI; high volume means higher risk of high-risk cloning. |

---

## 🔍 Platform Changes Observed

- **AllConferences.com:** The domain appears to be parked or redirecting to a generic landing page (`/lander`), indicating a potential sale or shutdown.
- **Conference Alerts:** Platform appears to have updated its branding/layout ("Conal Conference Alerts") with more modern bootstrap-based layouts.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **AI Conference Disambiguation**
   - **Observed:** Huge surge in AI/ML conferences across WikiCFP and other sites.
   - **Possible improvement:** Introduce specific scoring weights for AI conferences to better filter generic "International Conference on AI" listings.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

2. **Organizer Network Detection**
   - **Observed:** Sites like World Research Library and Academic Research Library group multiple conferences under parent networks like IRAJ, ISER, SFE, and NIER.
   - **Possible improvement:** Add network-level trust scores rather than just individual conference or domain scores.
   - **Effort estimate:** High
   - **Impact estimate:** High

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we consider the SFE/NIER networks on Academic Research Library for immediate blacklisting?
- With AllConferences.com potentially offline, should we rotate a new primary target into its place?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences: curl returns a script redirecting to /lander.
- Conference Alerts: Title "Conal Conference Alerts", updated bootstrap theme.
- Academic Research Library: Shows multiple proceedings with organizers ["SFE","NIER","NATIONAL CONFERENCE"] and identical dates (11th - 12th January 2025).
- World Research Library: Images and proceedings heavily branded with IRAJ, ISER, Researchfora, Academics World, ISETE.
- WikiCFP: High tag counts for artificial intelligence (10313), computer science (9006), machine learning (6264).

</details>
