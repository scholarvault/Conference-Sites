## 2024-04-25 - Missing Sitemap and Robots.txt in conf-hub
**Page/Component:** conf-hub/index.html (and root)
**Finding:** The `conf-hub` directory represents a separate sub-project/domain (`conf.scholarvault.in`) but lacks its own `sitemap.xml` and `robots.txt`, and the index page is missing a canonical URL.
**Impact:** Search engines will not efficiently discover or crawl the conference hub, and canonical indexing may be diluted.
**Remember:** Each new sub-domain directory requires its own `sitemap.xml`, `robots.txt`, and canonical tags.

## 2024-05-18 - Missing areaServed in Organization Schema
**Page/Component:** aihealth/index.html & ICAES 2026 AI for Environmental Sustainability/index.html
**Finding:** ScholarVault Organization schema entries in sub-projects were missing the `"areaServed": "IN"` attribute.
**Impact:** ScholarVault's differentiator is being India's first automated academic conference verification platform. Missing this attribute dilutes Local & India-Specific SEO.
**Remember:** Always ensure `"areaServed": "IN"` is included in the Organization structured data block for ScholarVault across all sub-projects.
