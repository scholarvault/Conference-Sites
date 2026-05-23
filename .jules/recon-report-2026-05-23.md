# 🔭 Recon Intelligence Briefing — 2026-05-23

## Executive Summary
This run focused on identifying how top conference directories organize and promote technical topics (AI, Blockchain, LLM) and discovering any structural changes to indexing sites. The scan revealed that 'AI in education' is a highlighted global search suggestion on Conference Alerts, while Conference Index heavily features generic AI content.

---

## 🚩 High-Risk Conference Signals Found

*No specific high-risk publishers or domains were identified in the primary navigation or immediate landing pages during this run. The sites appeared to feature generic categorical structures without overtly promoting newly minted, generic scope conferences on their homepages.*

---

## 📊 Trending Topics This Run

| Topic | Volume Signal | Relevance to ScholarVault |
|-------|---------------|--------------------------|
| Artificial Intelligence | High | Conference Alerts suggests "AI in education" in its primary search bar placeholder. Conference Index features it as a major top-level category with SEO-optimized Q&A content. ScholarVault should ensure its AI sub-discipline categorization is highly granular. |
| Climate Change | Medium | Suggested in Conference Alerts primary search placeholder. |
| Oncology | Medium | Suggested in Conference Alerts primary search placeholder. |

---

## 🔍 Platform Changes Observed

- **Conference Alerts:** Features a highly optimized landing page with a primary search bar that suggests specific long-tail queries ("climate change, oncology, AI in education"). The platform has implemented a new JS-driven filterable section for topics, countries, and cities, likely to improve user experience without reloading.
- **Conference Index:** Employs aggressive SEO tactics on category pages, embedding accordion-style Q&A sections (e.g., "What is the purpose of Artificial Intelligence conferences?") directly on the homepage beneath discipline links to capture long-tail search traffic.

---

## 💡 Feature / Improvement Suggestions

These are observations only — the team decides whether to act:

1. **Suggest Long-Tail Queries in Search**
   - **Observed:** Conference Alerts uses the search placeholder to suggest very specific, currently trending topics ("Try: climate change, oncology, AI in education").
   - **Possible improvement:** ScholarVault could dynamically update its search placeholders to reflect currently trending high-quality topics to guide researchers.
   - **Effort estimate:** Low
   - **Impact estimate:** Medium

2. **SEO Q&A Blocks for Topic Pages**
   - **Observed:** Conference Index includes hidden (accordion) Q&A blocks about "Why attend X conferences?" to capture search intent.
   - **Possible improvement:** ScholarVault could add similar educational content to its legitimate conference category pages to improve organic discovery.
   - **Effort estimate:** Medium
   - **Impact estimate:** Medium

---

## 📌 Items for Team Discussion

Questions Recon cannot answer alone:
- Should we consider implementing dynamic search placeholder text based on real-time search volume?
- Does our verification engine currently score conferences differently if they use exact-match generic SEO titles (like those targeted by Conference Index)?

---

## 🗂️ Raw Intelligence Log

<details>
<summary>Click to expand raw scan notes</summary>

- AllConferences.com: Redirects immediately via JS `window.location.href="/lander"`.
- Conference Alerts: Clean UI, uses `datalist-input` for global search.
- Academic Research Library: Basic UI, standard topic search.
- World Research Library: Basic UI, standard topic search.
- Conference Index: Heavy use of SEO text blocks hidden in accordions on the homepage. Topics covered include Education, Psychology, Agriculture, Psychiatry, Nursing, Computer Science, Artificial Intelligence, Medical.

</details>
