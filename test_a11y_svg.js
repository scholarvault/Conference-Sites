const fs = require('fs');

const findMissingSvgAria = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  let missing = [];

  // Look for SVGs inside a tags
  const aRegex = /<a[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = aRegex.exec(content)) !== null) {
    const aStr = match[0];
    if (aStr.includes('<svg') && aStr.trim().replace(/<[^>]+>/g, '').length === 0) {
      if (!aStr.includes('aria-label') && !aStr.includes('id=')) {
          missing.push(aStr);
      }
    }
  }
  return missing;
};

const dirs = ['ICAES 2026 AI for Environmental Sustainability', 'aihealth', 'conf-hub'];

dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
        files.forEach(f => {
            const path = dir + '/' + f;
            const res = findMissingSvgAria(path);
            if (res.length > 0) {
               console.log(path + ' missing icon button aria:', res.length);
            }
        });
    }
});
