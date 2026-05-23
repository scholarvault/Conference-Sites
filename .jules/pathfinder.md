## 2024-04-25 - Missing Sitemap and Robots.txt in conf-hub
**Page/Component:** conf-hub/index.html (and root)
**Finding:** The `conf-hub` directory represents a separate sub-project/domain (`conf.scholarvault.in`) but lacks its own `sitemap.xml` and `robots.txt`, and the index page is missing a canonical URL.
**Impact:** Search engines will not efficiently discover or crawl the conference hub, and canonical indexing may be diluted.
**Remember:** Each new sub-domain directory requires its own `sitemap.xml`, `robots.txt`, and canonical tags.

## 2024-04-25 - Missing Report Structured Data on Static Badge Pages
**Page/Component:** Static sub-project /badge.html pages (e.g., aihealth and ICAES 2026)
**Finding:** For static sub-projects, the /badge.html page serves as the public verification report. It lacked the 'Report' schema.org structured data.
**Impact:** Search engines were unable to explicitly identify the badge page as an authentic ScholarVault verification report, diminishing its value as an indexable trust signal.
**Remember:** Always ensure that static badge/verification pages include the 'Report' structured data block (JSON-LD) to explicitly signal their function as trust verification reports.
