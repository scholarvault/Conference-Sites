# 🔭 Recon Intelligence Briefing — 2026-05-02

## Executive Summary
I have scanned the four primary target websites: AllConferences.com, Conference Alerts, Academic Research Library, and World Research Library. During this scan, I observed several potential high-risk signals across multiple platforms. In particular, some listing sites seem to be frequently promoting conferences with very generic topics and identical dates/locations but run under different organizing names.

---

## 🚩 High-Risk Conference Signals Found

### World Research Library (WRL) - IRAJ and Similar Proceeding Series
- **Source:** https://www.worldresearchlibrary.org/
- **Risk Signals Detected:**
  - Multiple distinct conference names (ISER, IRAJ, Research World, Researchfora, Academics World, ISETE) are all hosted on identical dates at the same locations (e.g., April 29th in Kuala Lumpur or Tokyo; April 18th in Kuala Lumpur or China).
  - The rapid frequency and overlap of these events under seemingly different organizing entities is a classic signal of a "mega-conference" or mass-generated conference pattern.
  - The URL paths to the proceedings all share similar generic prefixes like `PROCE-IRAJ-...`
- **Recommended Action:** Check our blacklist database to see if "IRAJ", "ISER", "Research World", "Researchfora", "Academics World", or "ISETE" are already tracked. If not, investigate further for mass-generation patterns.
- **Priority:** HIGH

### Academic Research Library - Proceeding Series
- **Source:** https://academicresearchlibrary.com/
- **Risk Signals Detected:**
  - Almost all the recent proceedings listed on their homepage have extremely long, buzzword-heavy titles (e.g., "Human Wellbeing, Sustainable Development, and Intelligent Innovation in a Changing World") and occur within days of each other (April 19, April 21, April 22, April 24, April 27).
  - The topics are highly generic, covering too many unrelated disciplines simultaneously (Health, Science, Technology, Society, Education, Policy, etc.).
- **Recommended Action:** Investigate the organizing entity behind the "Academic Research Library" to see if it acts as a publisher for high-risk conferences.
- **Priority:** MEDIUM

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Intelligent Innovation/AI | High | AI continues to dominate recent proceedings across all sites, often paired loosely with other fields (Environment, Health). |
| Sustainable Development/SDGs | High | There is a visible push to align conference titles explicitly with UN SDGs (e.g., on Academic Research Library). We should ensure our engine can differentiate legitimate SDG-focused events from those just using the keywords. |

---

## 🔍 Platform Changes Observed

- **World Research Library:** The site heavily promotes its "Associates", including "Conference Alerts", "All Conference Alerts", and "Conference Inc". The interconnectedness of these aggregator platforms and proceeding libraries is a notable structural pattern.
- **Conference Alerts:** The platform has a prominent "Promote your event" section. It's unclear if promoted events undergo any vetting.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Mass-Generation Detection Heuristic**
   - **Observed:** World Research Library listing 5+ distinct conferences occurring on the exact same date and city but under different brand names.
   - **Possible improvement:** Add a heuristic to the detection engine that flags events if an organizer (or network of organizers) is hosting multiple uniquely named conferences at the same venue/city on the exact same dates.
   - **Effort estimate:** Medium
   - **Impact estimate:** High

2. **SDG Keyword Overload Check**
   - **Observed:** Some high-risk sites are aggressively using SDG-related buzzwords in conference titles.
   - **Possible improvement:** Tune the engine to lightly flag titles that contain an excessive combination of unrelated broad topics (e.g., "AI, Health, Nutrition, and Workforce Development").
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Do we already track the "IRAJ" / "ISER" network in our blacklist?
- Should we consider cross-referencing venues? If 10 conferences are at the same hotel on the same day, that's a strong signal. Do we have the data pipeline to support venue clustering?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- Scan of www.allconferences.com: Blank page returned. Check if the site is blocking automated requests or is temporarily down.
- Scan of conferencealerts.com: Normal layout. Heavy emphasis on event promotion. "Top 50 cities" and extensive topic listings. The "Associates" link on World Research Library points to a variation of this or a similarly named site.
- Scan of academicresearchlibrary.com: Home page lists recent proceedings. Dates are tightly clustered in late April 2026. Titles are word salads of trending topics. "Browse by SDGs" is a prominent feature.
- Scan of worldresearchlibrary.org: Recent proceedings feature ISER, IRAJ, Research World, Researchfora, Academics World, and ISETE. All are happening in late April/early May 2026. Many share dates and cities (e.g., Kuala Lumpur, Tokyo). The "Associates" section lists several alert sites, showing a network of cross-promotion.

</details>
