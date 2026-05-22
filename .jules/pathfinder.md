## 2024-04-25 - Missing Sitemap and Robots.txt in conf-hub
**Page/Component:** conf-hub/index.html (and root)
**Finding:** The `conf-hub` directory represents a separate sub-project/domain (`conf.scholarvault.in`) but lacks its own `sitemap.xml` and `robots.txt`, and the index page is missing a canonical URL.
**Impact:** Search engines will not efficiently discover or crawl the conference hub, and canonical indexing may be diluted.
**Remember:** Each new sub-domain directory requires its own `sitemap.xml`, `robots.txt`, and canonical tags.
## 2024-05-22 - Missing Report Structured Data on verify pages
**Page/Component:** /badge.html (aihealth and ICAES 2026)
**Finding:** Verification report pages lacked `Report` structured data which limits indexability as trust signals for search engines.
**Impact:** Prevents search engines from explicitly understanding the page as a structured report from ScholarVault, reducing visibility in "is [conference name] fake" queries.
**Remember:** Whenever creating or updating public-facing verification reports, ensure `Report` JSON-LD is included alongside standard Open Graph tags.
