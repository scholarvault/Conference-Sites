import fs from 'fs';
import path from 'path';

const files = [
  {
    name: 'gold-executive-digest.html',
    path: 'c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/svrias-2026/src/components/emails/gold-executive-digest.html',
    requiredStrings: [
      'ssundar861@gmail.com',
      'Shyam Sundar R',
      'GOLD FOUNDING MEMBER',
      '180',
      '47',
      'Computer Science &amp; Engineering Focus',
      'SVRIAS 2026',
      'ICAHCR 2026',
      'IEEE INFOCOM',
      'ACM SIGKDD',
      'IEEE TPAMI'
    ]
  },
  {
    name: 'free-scholar-digest.html',
    path: 'c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/svrias-2026/src/components/emails/free-scholar-digest.html',
    requiredStrings: [
      'thescholarvault@gmail.com',
      'Scholar Vault',
      'FREE SCHOLAR TIER',
      'Life Sciences &amp; Medicine Focus',
      '2 Traps Avoided',
      'ICAHCR 2026',
      'ICBBSB 2026',
      'Translational Oncology',
      'Discovery Finder',
      'GOLD FOUNDING TIER UPGRADE'
    ]
  }
];

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    totalFailed++;
  }
}

async function validate() {
  console.log('=== SCHOLARVAULT EMAIL TEMPLATE VALIDATOR ===\n');

  for (const file of files) {
    console.log(`\nTesting Template: ${file.name}`);
    console.log(`Path: ${file.path}`);

    assert(fs.existsSync(file.path), `File exists on filesystem`);
    const content = fs.readFileSync(file.path, 'utf8');
    assert(content.length > 5000, `File has substantial content (${content.length} bytes)`);

    // 1. Structure assertions
    assert(content.includes('<!DOCTYPE html'), `Has valid DOCTYPE declaration`);
    assert(content.includes('<html'), `Has <html> tag`);
    assert(content.includes('<head>'), `Has <head> tag`);
    assert(content.includes('<body'), `Has <body> tag`);
    assert(content.includes('<!--[if mso]>'), `Has Outlook MSO conditional comments`);
    assert(content.includes('color-scheme') && content.includes('supported-color-schemes'), `Declares color-scheme for light and dark mode`);

    // 2. 600px Table layout assertions
    assert(content.includes('width="600"') || content.includes('max-width:600px'), `Enforces 600px desktop table layout width`);
    assert(content.includes('cellpadding="0" cellspacing="0" border="0"'), `Uses standard email table cell resets`);
    assert(content.includes('role="presentation"'), `Uses accessible presentation tables`);

    // 3. Preheader & Responsive CSS
    assert(content.includes('display:none;font-size:1px;') || content.includes('display:none;'), `Includes hidden preheader preview text`);
    assert(content.includes('@media only screen and (max-width: 620px)'), `Includes mobile responsive media queries`);
    assert(content.includes('.col-stack'), `Includes responsive column stacking classes`);

    // 4. Dark mode styling
    assert(content.includes('@media (prefers-color-scheme: dark)'), `Includes dark-mode media query`);
    assert(content.includes('.dark-text-white') || content.includes('.dark-text-light'), `Has dark mode contrast classes`);

    // 5. Persona & Content requirements
    console.log(`  Checking required persona & content requirements:`);
    for (const req of file.requiredStrings) {
      assert(content.includes(req), `Contains required phrase/data: "${req}"`);
    }

    // 6. Image tags & URLs
    const imgMatches = [...content.matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)];
    assert(imgMatches.length > 0, `Found ${imgMatches.length} image tags`);

    for (const match of imgMatches) {
      const fullTag = match[0];
      const src = match[1];
      assert(fullTag.includes('alt="'), `Image ${src.substring(0, 40)}... has alt attribute`);
      assert(fullTag.includes('width=') || fullTag.includes('height=') || fullTag.includes('style='), `Image has explicit size attributes`);
      
      try {
        const res = await fetch(src, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
        assert(res.status === 200, `Image URL is live (HTTP 200): ${src.substring(0, 60)}...`);
      } catch (err) {
        assert(false, `Image URL failed to load: ${src} - ${err.message}`);
      }
    }
  }

  console.log(`\n=============================================`);
  console.log(`FINAL RESULT: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log(`=============================================\n`);

  if (totalFailed > 0) {
    process.exit(1);
  }
}

validate().catch(err => {
  console.error('Validation crashed:', err);
  process.exit(1);
});
