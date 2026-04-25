## 2024-04-25 - Missing Sitemap and Robots.txt in conf-hub
**Page/Component:** conf-hub/index.html (and root)
**Finding:** The `conf-hub` directory represents a separate sub-project/domain (`conf.scholarvault.in`) but lacks its own `sitemap.xml` and `robots.txt`, and the index page is missing a canonical URL.
**Impact:** Search engines will not efficiently discover or crawl the conference hub, and canonical indexing may be diluted.
**Remember:** Each new sub-domain directory requires its own `sitemap.xml`, `robots.txt`, and canonical tags.
