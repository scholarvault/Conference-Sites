[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

$LandingDir = "C:\Users\Shyam\Scholar Vault 2\Landing Page"
$StagingDir = "C:\Users\Shyam\Scholar Vault 2\Conference-Sites-main\svrias-2026\staged_landing_page_updates"

Write-Host "=== Deploying ScholarVault Landing Page Updates ===" -ForegroundColor Cyan
Write-Host "Target Landing Directory: $LandingDir"
Write-Host "Source Staging Directory: $StagingDir`n"

if (-not (Test-Path $LandingDir)) {
    Write-Error "ERROR: Landing Page directory not found at $LandingDir"
    exit 1
}

# 1. how-to-prepare-paper-presentation-conference.html
Write-Host "[1/10] Deploying how-to-prepare-paper-presentation-conference.html..."
Copy-Item "$StagingDir\article\how-to-prepare-paper-presentation-conference.html" "$LandingDir\article\how-to-prepare-paper-presentation-conference.html" -Force

# 2. ugc-care-list-journals-2026.html
Write-Host "[2/10] Deploying ugc-care-list-journals-2026.html..."
Copy-Item "$StagingDir\article\ugc-care-list-journals-2026.html" "$LandingDir\article\ugc-care-list-journals-2026.html" -Force

# 3. national-conference-2026-india.html
Write-Host "[3/10] Deploying national-conference-2026-india.html..."
Copy-Item "$StagingDir\article\national-conference-2026-india.html" "$LandingDir\article\national-conference-2026-india.html" -Force

# 4. Predatory_Conferences_US_Malaysia.html
Write-Host "[4/10] Deploying Predatory_Conferences_US_Malaysia.html..."
Copy-Item "$StagingDir\article\Predatory_Conferences_US_Malaysia.html" "$LandingDir\article\Predatory_Conferences_US_Malaysia.html" -Force

# 5. indian-research-article.html
Write-Host "[5/10] Updating indian-research-article.html..."
$indFile = "$LandingDir\article\indian-research-article.html"
$indContent = [System.IO.File]::ReadAllText($indFile, [System.Text.Encoding]::UTF8)
$indContent = [System.Text.RegularExpressions.Regex]::Replace($indContent, '<title>The Ascent of Indian Research[^<]*</title>', '<title>The Ascent of Indian Research: Output, Impact & Global Ranking 2026 | ScholarVault</title>')
$indContent = [System.Text.RegularExpressions.Regex]::Replace($indContent, '<meta\s+name=["'']description["'']\s+content=["''][^"'']*growth of India[''’]s research community[^"'']*["'']>', '<meta name="description" content="In-depth 2026 analysis of India''s research boom: publication growth, citation metrics, R&D funding, ANRF impact, and global scholarly leadership.">')
$indContent = [System.Text.RegularExpressions.Regex]::Replace($indContent, '<meta\s+property=["'']og:title["'']\s+content=["''][^"'']*The Ascent of Indian Research[^"'']*["'']>', '<meta property="og:title" content="The Ascent of Indian Research: Output, Impact & Global Ranking 2026 | ScholarVault">')
$indContent = [System.Text.RegularExpressions.Regex]::Replace($indContent, '<meta\s+property=["'']og:description["'']\s+content=["''][^"'']*world[''’]s third-largest research producer[^"'']*["'']>', '<meta property="og:description" content="In-depth 2026 analysis of India''s research boom: publication growth, citation metrics, R&D funding, ANRF impact, and global scholarly leadership.">')
[System.IO.File]::WriteAllText($indFile, $indContent, [System.Text.Encoding]::UTF8)
Write-Host "  -> Updated Indian Research Article meta tags." -ForegroundColor Green

# 6. what-is-scholarvault.html
Write-Host "[6/10] Deploying what-is-scholarvault.html..."
Copy-Item "$StagingDir\what-is-scholarvault.html" "$LandingDir\what-is-scholarvault.html" -Force

# 7. index.html
Write-Host "[7/10] Updating index.html (Title/Meta, footer trailing slashes, static research guides)..."
$indexFile = "$LandingDir\index.html"
$indexContent = [System.IO.File]::ReadAllText($indexFile, [System.Text.Encoding]::UTF8)

# Robust Title and Meta regex
$indexContent = [System.Text.RegularExpressions.Regex]::Replace($indexContent, '<title>ScholarVault\s*[\u2014\u2013\-]\s*India[\u2019'']s Trusted Academic Ecosystem for Researchers</title>', '<title>ScholarVault — India''s Trusted Academic Ecosystem & Conference Verification</title>')
$indexContent = [System.Text.RegularExpressions.Regex]::Replace($indexContent, 'content="ScholarVault is India[\u2019'']s trusted academic ecosystem\.\s*Discover opportunities, verify credibility, participate in conferences, and build a trusted academic career\."', 'content="ScholarVault is India''s trusted academic ecosystem. Verify conference legitimacy in 12 seconds, check Scopus proceedings, search UGC CARE journals, and protect your research career."')
$indexContent = [System.Text.RegularExpressions.Regex]::Replace($indexContent, 'content="Discover opportunities, verify credibility, participate in conferences, and build a trusted academic career\."', 'content="ScholarVault is India''s trusted academic ecosystem. Verify conference legitimacy in 12 seconds, check Scopus proceedings, search UGC CARE journals, and protect your research career."')
$indexContent = [System.Text.RegularExpressions.Regex]::Replace($indexContent, '<meta\s+property=["'']og:title["'']\s+content=["'']ScholarVault\s*[\u2014\u2013\-]\s*India[\u2019'']s Trusted Academic Ecosystem for Researchers["'']>', '<meta property="og:title" content="ScholarVault — India''s Trusted Academic Ecosystem & Conference Verification">')
$indexContent = [System.Text.RegularExpressions.Regex]::Replace($indexContent, '<meta\s+name=["'']twitter:title["'']\s+content=["'']ScholarVault\s*[\u2014\u2013\-]\s*India[\u2019'']s Trusted Academic Ecosystem for Researchers["'']>', '<meta name="twitter:title" content="ScholarVault — India''s Trusted Academic Ecosystem & Conference Verification">')

# Footer trailing slashes
$indexContent = $indexContent.Replace('href="/products/"', 'href="/products"')
$indexContent = $indexContent.Replace('href="/badge/"', 'href="/badge"')
$indexContent = $indexContent.Replace('href="/about/"', 'href="/about"')
$indexContent = $indexContent.Replace('href="/careers/"', 'href="/careers"')
$indexContent = $indexContent.Replace('href="/privacy-policy/"', 'href="/privacy-policy"')
$indexContent = $indexContent.Replace('href="/terms-and-conditions/"', 'href="/terms-and-conditions"')
$indexContent = $indexContent.Replace('href="/pricing-refund-policy/"', 'href="/pricing-refund-policy"')
$indexContent = $indexContent.Replace('href="/data-policy/"', 'href="/data-policy"')
$indexContent = $indexContent.Replace('href="/disclaimer/"', 'href="/disclaimer"')

# Static Research Guides Section
$guidesSnippet = @'
  <!-- RESEARCH GUIDES & FIELD MANUALS (SEO & CRAWLER ACCESSIBLE) -->
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
  </section>
'@

if (-not $indexContent.Contains('id="research-guides"')) {
    $indexContent = $indexContent.Replace('</main>', $guidesSnippet + "`r`n    </main>")
}
[System.IO.File]::WriteAllText($indexFile, $indexContent, [System.Text.Encoding]::UTF8)
Write-Host "  -> Updated index.html successfully." -ForegroundColor Green

# 8. insights.html
Write-Host "[8/10] Deploying insights.html..."
Copy-Item "$StagingDir\insights.html" "$LandingDir\insights.html" -Force

# 9. vercel.json
Write-Host "[9/10] Deploying vercel.json..."
Copy-Item "$StagingDir\vercel.json" "$LandingDir\vercel.json" -Force

# 10. sitemap.xml
Write-Host "[10/10] Deploying sitemap.xml..."
Copy-Item "$StagingDir\sitemap.xml" "$LandingDir\sitemap.xml" -Force

Write-Host "`n=== All 10 Landing Page Deliverables Successfully Deployed! ===" -ForegroundColor Green
