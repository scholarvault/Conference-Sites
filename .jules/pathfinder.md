## 2024-04-25 - Missing Sitemap and Robots.txt in conf-hub
**Page/Component:** conf-hub/index.html (and root)
**Finding:** The `conf-hub` directory represents a separate sub-project/domain (`conf.scholarvault.in`) but lacks its own `sitemap.xml` and `robots.txt`, and the index page is missing a canonical URL.
**Impact:** Search engines will not efficiently discover or crawl the conference hub, and canonical indexing may be diluted.
**Remember:** Each new sub-domain directory requires its own `sitemap.xml`, `robots.txt`, and canonical tags.

## 2024-05-05 - Missing Report Structured Data on badge.html
**Page/Component:** aihealth/badge.html
**Finding:** The public verification report pages (like `badge.html`) are missing the `Report` structured data required by ScholarVault SEO standards. This schema is critical for these pages to act as trust signals in search.
**Impact:** Without `Report` schema, search engines may not correctly interpret the page as a formal verification report, missing an opportunity to surface the trust score effectively.
**Remember:** Each new sub-domain directory's `badge.html` requires `Report` schema with dynamically set `dateCreated` and correctly formatted `name`.
