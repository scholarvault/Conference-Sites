const fs = require('fs');
const path = require('path');

const LANDING_DIR = path.resolve(__dirname, '..', '..', '..', 'Landing Page');
const STAGING_DIR = __dirname;

console.log('=== Deploying ScholarVault Landing Page Updates ===');
console.log(`Target Landing Directory: ${LANDING_DIR}`);
console.log(`Source Staging Directory: ${STAGING_DIR}\n`);

if (!fs.existsSync(LANDING_DIR)) {
  console.error(`ERROR: Landing Page directory not found at: ${LANDING_DIR}`);
  process.exit(1);
}

// 1. how-to-prepare-paper-presentation-conference.html
console.log('[1/10] Deploying how-to-prepare-paper-presentation-conference.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'article', 'how-to-prepare-paper-presentation-conference.html'),
  path.join(LANDING_DIR, 'article', 'how-to-prepare-paper-presentation-conference.html')
);

// 2. ugc-care-list-journals-2026.html
console.log('[2/10] Deploying ugc-care-list-journals-2026.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'article', 'ugc-care-list-journals-2026.html'),
  path.join(LANDING_DIR, 'article', 'ugc-care-list-journals-2026.html')
);

// 3. national-conference-2026-india.html
console.log('[3/10] Deploying national-conference-2026-india.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'article', 'national-conference-2026-india.html'),
  path.join(LANDING_DIR, 'article', 'national-conference-2026-india.html')
);

// 4. Predatory_Conferences_US_Malaysia.html
console.log('[4/10] Deploying Predatory_Conferences_US_Malaysia.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'article', 'Predatory_Conferences_US_Malaysia.html'),
  path.join(LANDING_DIR, 'article', 'Predatory_Conferences_US_Malaysia.html')
);

// 5. indian-research-article.html
console.log('[5/10] Updating indian-research-article.html...');
const indPath = path.join(LANDING_DIR, 'article', 'indian-research-article.html');
let indHtml = fs.readFileSync(indPath, 'utf8');

indHtml = indHtml.replace(
  /<title>The Ascent of Indian Research[^<]*<\/title>/i,
  '<title>The Ascent of Indian Research: Output, Impact & Global Ranking 2026 | ScholarVault</title>'
);
indHtml = indHtml.replace(
  /<meta\s+name=["']description["']\s+content=["'][^"']*growth of India['’]s research community[^"']*["']>/i,
  '<meta name="description" content="In-depth 2026 analysis of India\'s research boom: publication growth, citation metrics, R&D funding, ANRF impact, and global scholarly leadership.">'
);
indHtml = indHtml.replace(
  /<meta\s+property=["']og:title["']\s+content=["'][^"']*The Ascent of Indian Research[^"']*["']>/i,
  '<meta property="og:title" content="The Ascent of Indian Research: Output, Impact & Global Ranking 2026 | ScholarVault">'
);
indHtml = indHtml.replace(
  /<meta\s+property=["']og:description["']\s+content=["'][^"']*world['’]s third-largest research producer[^"']*["']>/i,
  '<meta property="og:description" content="In-depth 2026 analysis of India\'s research boom: publication growth, citation metrics, R&D funding, ANRF impact, and global scholarly leadership.">'
);
fs.writeFileSync(indPath, indHtml, 'utf8');
console.log('  -> Updated Indian Research Article metadata.');

// 6. what-is-scholarvault.html
console.log('[6/10] Deploying what-is-scholarvault.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'what-is-scholarvault.html'),
  path.join(LANDING_DIR, 'what-is-scholarvault.html')
);

// 7. index.html
console.log('[7/10] Updating index.html (Title/Meta, footer trailing slashes, static research guides)...');
const indexPath = path.join(LANDING_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Title & Meta
indexHtml = indexHtml.replace(
  /<title>ScholarVault\s*[—–-]\s*India['’]s Trusted Academic Ecosystem for Researchers<\/title>/i,
  '<title>ScholarVault — India\'s Trusted Academic Ecosystem & Conference Verification</title>'
);
indexHtml = indexHtml.replace(
  /content="ScholarVault is India['’]s trusted academic ecosystem\.\s*Discover opportunities, verify credibility, participate in conferences, and build a trusted academic career\."/i,
  'content="ScholarVault is India\'s trusted academic ecosystem. Verify conference legitimacy in 12 seconds, check Scopus proceedings, search UGC CARE journals, and protect your research career."'
);
indexHtml = indexHtml.replace(
  /content="Discover opportunities, verify credibility, participate in conferences, and build a trusted academic career\."/g,
  'content="ScholarVault is India\'s trusted academic ecosystem. Verify conference legitimacy in 12 seconds, check Scopus proceedings, search UGC CARE journals, and protect your research career."'
);
indexHtml = indexHtml.replace(
  /<meta\s+property=["']og:title["']\s+content=["']ScholarVault\s*[—–-]\s*India['’]s Trusted Academic Ecosystem for Researchers["']>/i,
  '<meta property="og:title" content="ScholarVault — India\'s Trusted Academic Ecosystem & Conference Verification">'
);
indexHtml = indexHtml.replace(
  /<meta\s+name=["']twitter:title["']\s+content=["']ScholarVault\s*[—–-]\s*India['’]s Trusted Academic Ecosystem for Researchers["']>/i,
  '<meta name="twitter:title" content="ScholarVault — India\'s Trusted Academic Ecosystem & Conference Verification">'
);

// Footer trailing slashes
const slashReplacements = [
  ['href="/products/"', 'href="/products"'],
  ['href="/badge/"', 'href="/badge"'],
  ['href="/about/"', 'href="/about"'],
  ['href="/careers/"', 'href="/careers"'],
  ['href="/privacy-policy/"', 'href="/privacy-policy"'],
  ['href="/terms-and-conditions/"', 'href="/terms-and-conditions"'],
  ['href="/pricing-refund-policy/"', 'href="/pricing-refund-policy"'],
  ['href="/data-policy/"', 'href="/data-policy"'],
  ['href="/disclaimer/"', 'href="/disclaimer"']
];
for (const [from, to] of slashReplacements) {
  indexHtml = indexHtml.split(from).join(to);
}

// Research Guides Section
const guidesSnippet = `  <!-- RESEARCH GUIDES & FIELD MANUALS (SEO & CRAWLER ACCESSIBLE) -->
  <section class="research-guides-section" id="research-guides" style="padding: 5rem 0; border-top: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02);">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
      <div style="text-align: center; margin-bottom: 3rem;">
        <span style="font-family: monospace; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; color: var(--gold); font-weight: 700;">ScholarVault Insights &amp; Guides</span>
        <h2 style="font-size: clamp(2rem, 4vw, 2.8rem); color: var(--white); margin: 0.8rem 0 1rem; font-weight: 800; letter-spacing: -0.02em;">Essential Field Manuals for Serious Researchers</h2>
        <p style="color: var(--grey); max-width: 680px; margin: 0 auto; font-size: 1.05rem; line-height: 1.6;">Peer-reviewed frameworks, verification protocols, and presentation templates designed to protect your scholarly work and accelerate your research career.</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
        <a href="/article/how-to-prepare-paper-presentation-conference" style="display: flex; flex-direction: column; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.25); border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Presentation Deck Template</span>
          <h3 style="color: var(--white); font-size: 1.2rem; margin-bottom: 0.8rem; line-height: 1.3;">10-Minute Conference Paper Presentation Guide</h3>
          <p style="color: var(--grey); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1;">Official slide-by-slide timing breakdown (10 slides), deck architecture, visual wireframe cards, and Q&amp;A primer for academic presenters.</p>
          <span style="color: var(--gold); font-weight: 700; font-size: 0.88rem;">Read Blueprint &rarr;</span>
        </a>

        <a href="/article/ugc-care-list-journals-2026" style="display: flex; flex-direction: column; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Journal Verification</span>
          <h3 style="color: var(--white); font-size: 1.2rem; margin-bottom: 0.8rem; line-height: 1.3;">UGC Approved Journal List 2026 [Search &amp; Verify]</h3>
          <p style="color: var(--grey); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1;">Navigate UGC CARE Group 1 &amp; 2 journals safely, spot cloned journal scams, and protect your Academic Performance Index (API) points.</p>
          <span style="color: var(--gold); font-weight: 700; font-size: 0.88rem;">Search &amp; Verify &rarr;</span>
        </a>

        <a href="/article/national-conference-2026-india" style="display: flex; flex-direction: column; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Conference Directory</span>
          <h3 style="color: var(--white); font-size: 1.2rem; margin-bottom: 0.8rem; line-height: 1.3;">National Conference 2026 in India Directory</h3>
          <p style="color: var(--grey); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1;">Curated schedule of verified national conferences across Delhi, Chennai, and Bangalore with Scopus and IEEE Xplore proceedings.</p>
          <span style="color: var(--gold); font-weight: 700; font-size: 0.88rem;">Explore Directory &rarr;</span>
        </a>

        <a href="/article/predatory-conferences-us-malaysia" style="display: flex; flex-direction: column; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; text-decoration: none; transition: transform 0.2s, border-color 0.2s;">
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Forensic Investigation</span>
          <h3 style="color: var(--white); font-size: 1.2rem; margin-bottom: 0.8rem; line-height: 1.3;">Predatory Conferences: US &amp; Malaysia Study</h3>
          <p style="color: var(--grey); font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.2rem; flex-grow: 1;">Cross-national systematic analysis of researcher exposure, financial damage, and verification deficits in North America and Southeast Asia.</p>
          <span style="color: var(--gold); font-weight: 700; font-size: 0.88rem;">Read Investigation &rarr;</span>
        </a>
      </div>
      <div style="text-align: center; margin-top: 2.5rem;">
        <a href="/insights" style="display: inline-flex; align-items: center; gap: 8px; color: var(--gold); font-weight: 700; text-decoration: none; border: 1px solid rgba(212,175,55,0.4); padding: 10px 24px; border-radius: 8px;">
          View All 18 Field Guides &amp; Insights &rarr;
        </a>
      </div>
    </div>
  </section>`;

if (!indexHtml.includes('id="research-guides"')) {
  indexHtml = indexHtml.replace('</main>', `${guidesSnippet}\n    </main>`);
}
fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('  -> Updated index.html successfully.');

// 8. insights.html
console.log('[8/10] Deploying insights.html...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'insights.html'),
  path.join(LANDING_DIR, 'insights.html')
);

// 9. vercel.json
console.log('[9/10] Deploying vercel.json...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'vercel.json'),
  path.join(LANDING_DIR, 'vercel.json')
);

// 10. sitemap.xml
console.log('[10/10] Deploying sitemap.xml...');
fs.copyFileSync(
  path.join(STAGING_DIR, 'sitemap.xml'),
  path.join(LANDING_DIR, 'sitemap.xml')
);

console.log('\n=== All 10 Landing Page Deliverables Successfully Deployed! ===');
