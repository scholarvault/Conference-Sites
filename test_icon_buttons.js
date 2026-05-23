const fs = require('fs');

const findMissingAriaAttributes = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  let missing = [];

  const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/gi;
  let match;
  while ((match = buttonRegex.exec(content)) !== null) {
    const buttonStr = match[0];
    if (buttonStr.includes('<svg') || buttonStr.includes('<i')) {
      if (!buttonStr.includes('aria-label') && !buttonStr.includes('id=')) {
         const hasText = match[1].replace(/<[^>]*>/g, '').trim().length > 0;
         if (!hasText) {
             missing.push(buttonStr);
         }
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
               console.log(path + ' missing icon button aria:', res.length, res[0]);
            }
        });
    }
});
