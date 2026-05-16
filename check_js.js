const fs = require('fs');

const content = fs.readFileSync('aihealth/index.html', 'utf8');
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(content)) !== null) {
  const scriptTag = match[0];
  const scriptContent = match[1];

  if (scriptTag.includes('type="application/ld+json"')) {
    continue;
  }

  if (scriptContent.trim() === '') {
    continue;
  }

  try {
    new Function(scriptContent);
    count++;
  } catch (e) {
    console.error(`Syntax error in script block:`, e);
    console.error(scriptContent.substring(0, 100) + '...');
    process.exit(1);
  }
}
console.log(`Successfully parsed ${count} inline scripts.`);
