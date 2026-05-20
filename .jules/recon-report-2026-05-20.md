# 🔭 Recon Intelligence Briefing — 2026-05-20

## Executive Summary
WikiCFP shows significant duplicated event listings for conferences like ICRMV 2027, ICECC 2027, and ICIGP 2027 under slightly different names (e.g., with and without "--EI" or "--ESCI" suffixes). World Research Library lists proceedings heavily dominated by the "IRAJ" organizer network, reusing the exact same image for many proceedings.

---

## 🚩 High-Risk Conference Signals Found

### IRAJ Organizer Network Proceedings
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Proceeding names are hyper-generic (e.g., "Academics World International Conference", "GSRD International Conference").
  - Identical thumbnail images are reused across multiple different proceedings (e.g., PROCE-IRAJ-1778738255.jpeg and PROCE-IRAJ-1778738209.jpeg).
  - No clear academic discipline or scope mentioned in the titles.
- **Recommended Action:** Investigate the "IRAJ" network and check if they are already in the DB.
- **Priority:** HIGH

### WikiCFP Duplicate Listing Spam
- **Source:** http://www.wikicfp.com/cfp/
- **Risk Signals Detected:**
  - Same event (e.g., "2027 11th International Conference on Robotics and Machine Vision (ICRMV 2027)") is submitted multiple times with slightly altered short names ("ICRMV--EI 2027" vs "ICRMV 2027").
  - Similar pattern observed for "ICECC 2027" and "ICIGP 2027".
  - This appears to be an SEO or visibility manipulation tactic.
- **Recommended Action:** Add duplicate detection logic based on event full title and dates, not just short names.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | 10343 CFPs on WikiCFP. Huge volume. |
| Computer Science | High | 9021 CFPs on WikiCFP. Core area. |
| Machine Learning | High | 6277 CFPs on WikiCFP. |
| NLP | High | 2528 CFPs on WikiCFP. High growth area. |

---

## 🔍 Platform Changes Observed

- **Conference Alerts:** The platform has been updated with a new UI, including a prominent search bar and a "Find events by topic" section. It heavily promotes their "Subscribe" and "Promote your events" features.
- **AllConferences.com:** Still appears to be parked or broken, returning a simple redirect script (`window.location.href="/lander"`).
- **Academic Research Library:** Features hyper-generic "International Conference 2025" listings clustered together without specifying topics.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Duplicate Listing Detection**
   - **Observed:** WikiCFP has multiple entries for the same exact conference (e.g., ICRMV 2027) with slightly different short names.
   - **Possible improvement:** Enhance ScholarVault's engine to flag when the same full conference name is submitted multiple times to listing sites, as it's a spammy tactic.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we add "IRAJ" and related entities (GSRD, SCIENCEFORA, Research World, ISERD) to the blacklist?
- How should the ScholarVault engine handle the parked domain status of AllConferences.com to prevent false positives?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- **AllConferences.com:** Checked. Still parked/redirecting (`<script>window.onload=function(){window.location.href="/lander"}</script>`).
- **Conference Alerts:** Modern UI, lots of topic tags (Cardiology, Climate Change, Oncology, AI in Education). Promotes subscriptions.
- **Academic Research Library:** "Browse by SDGs" section. Generic proceeding titles like "International Conference 2025 11th - 12th January 2025".
- **World Research Library:** "Academics World International Conference", "GSRD International Conference", "Yanjiu International Conference", "SCIENCEFORA INTERNATIONAL CONFERENCE", "Research World International Conference", "ISERD International Conference". Lots of "IRAJ".
- **WikiCFP:** Popular Categories: artificial intelligence (10343), computer science (9021), machine learning (6277), NLP (2528). Duplicate listings: ICRMV--EI 2027 / ICRMV 2027, ICECC--ESCI 2027 / ICECC 2027, ICIGP--EI 2027 / ICIGP 2027.

</details>
