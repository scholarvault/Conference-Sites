const fs = require('fs');

const findMissingAriaAttributes = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  let missing = [];

  // Look for faq-item buttons
  const faqRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = faqRegex.exec(content)) !== null) {
    const buttonStr = match[0];
    if (buttonStr.includes('faq-item')) {
      if (!buttonStr.includes('aria-expanded') || !buttonStr.includes('aria-controls')) {
          missing.push(buttonStr);
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
            const res = findMissingAriaAttributes(path);
            if (res.length > 0) {
               console.log(path + ' missing FAQ aria:', res.length);
            }
        });
    }
});
