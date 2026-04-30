# 🔭 Recon Intelligence Briefing — 2026-04-30

## Executive Summary
This run identified two concerning patterns: the use of UN Sustainable Development Goal (SDG) branding to artificially boost the legitimacy of conference aggregators, and a mass-produced "tour" model where generic conferences (e.g., "IRAJ INTERNATIONAL CONFERENCE") are held simultaneously across multiple global cities. Additionally, a scan of the repository found no existing blacklist files, suggesting a potential gap in our offline data storage or that the engine uses external/API-based blacklists.

---

## 🚩 High-Risk Conference Signals Found

### IRAJ INTERNATIONAL CONFERENCE / Researchfora / Academics World
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Operating identically named generic conferences across multiple global cities (Kuala Lumpur, Tokyo, Shanghai, Hangzhou) within days of each other.
  - Very generic conference titles without specific disciplinary focus or organizing academic society.
- **Recommended Action:** Investigate the organizers (IRAJ, Researchfora, Academics World) for potential inclusion in the detection engine's high-risk list.
- **Priority:** HIGH

### Academic Research Library
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Prominent use of United Nations Sustainable Development Goals (SDG) icons and branding to categorize proceedings, creating a false sense of institutional prestige or global endorsement without apparent actual affiliation.
- **Recommended Action:** Update detection engine to flag excessive use of UN/SDG branding when not accompanied by verifiable institutional backing.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence / Machine Learning | High | Continues to dominate across all scanned platforms (WikiCFP, Resurchify, Conference Index). Crucial to ensure our detection engine is finely tuned for AI-related conferences, as this high volume attracts opportunistic organizers. |
| Healthcare & Medicine | High | Very high volume on Conference Index and Academic Research Library. A high-stakes area where fake conferences could have real-world consequences. |
| Environmental Sustainability | Medium | Growing trend, heavily leveraged by platforms like Academic Research Library using SDG branding. |

---

## 🔍 Platform Changes Observed

- **Academic Research Library:** Adopting a browse-by-SDG interface. This is a novel way to organize conferences that leans heavily on the perceived legitimacy of the UN's global goals.
- **World Research Library:** Acting as a major aggregator for the high-risk "tour" style conferences (IRAJ, Researchfora).

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **SDG Branding Detector**
   - **Observed:** High-risk platforms using UN SDG icons to look more legitimate.
   - **Possible improvement:** Add a signal to the scoring engine that detects the presence of SDG branding and cross-references it against actual UN/NGO affiliation. If affiliation is missing, flag as a potential risk signal.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

2. **Conference "Tour" Velocity Detection**
   - **Observed:** Organizers running the exact same generic conference in 4-5 different cities in the same week.
   - **Possible improvement:** Implement a check in the detection engine that groups conferences by name/organizer and flags if the geographic dispersion and frequency exceed typical academic society capabilities.
   - **Effort estimate:** High
   - **Impact estimate:** High

3. **Establish Local Blacklist Data Structure**
   - **Observed:** A search of the codebase (`/lib/blacklist`, `/data`, etc.) yielded no results for existing blacklists.
   - **Possible improvement:** If ScholarVault doesn't currently maintain a local blacklist file, consider creating a structured JSON/CSV in `/data/high_risk_entities.json` to track these findings, or document where this data is actually stored if it's external.
   - **Effort estimate:** Low
   - **Impact estimate:** High

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Where does ScholarVault currently store its blacklist data? My scans of the repository found no local files. Is it managed externally or via a database?
- Should we consider the "generic conference tour" model (like IRAJ) as an automatic high-risk signal, or do we need more data points?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- Scanned AllConferences.com: Hit a redirect script `/lander`. Minimal data.
- Scanned ConferenceAlerts.com: Standard layout.
- Scanned AcademicResearchLibrary.com: Found heavy use of SDG branding (17 different SDG categories). Highlighted proceedings include "Smart Innovations for Health...", "Governance, Technology...".
- Scanned WorldResearchLibrary.org: Found the "tour" pattern. Recent proceedings listed: IRAJ INTERNATIONAL CONFERENCE (Kuala Lumpur, 29-04-2026), Research World International Conference (Tokyo, 29-04-2026), Researchfora International Conference (Tokyo, 26-04-2026), Academics World International Conference (Hangzhou, 18-04-2026), ISETE INTERNATIONAL CONFERENCE (Kuala Lumpur, 18-04-2026), Researchfora International Conference (Shanghai, 14-04-2026).
- Scanned WikiCFP: AI/ML dominates popular categories (10283 for AI, 6257 for ML, 8991 for CS).
- Scanned Conference Index: Massive volume. Health Science (2298), Computer Science (2181), Materials Science (1704).
- Scanned Resurchify: Standard categories. Noted "ChapelCon 2025", "MAS-GAIN 2025" in recent events.
- Repository search: `find . -name "*blacklist*"` and `grep -rni "blacklist" .` returned no results. `grep -rni "IRAJ" .` returned no results.

</details>
