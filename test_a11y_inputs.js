const fs = require('fs');

const findMissingInputAria = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  let missing = [];

  const regex = /<input[^>]*>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const input = match[0];
    if (input.includes('type="hidden"')) continue;
    if (!input.includes('aria-label') && !input.includes('id=')) {
        // Let's actually look for labels around it. This is naive but helpful
        const index = match.index;
        const surrounding = content.substring(Math.max(0, index - 200), Math.min(content.length, index + 200));
        if (!surrounding.includes('<label')) {
           missing.push(input);
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
            const res = findMissingInputAria(path);
            if (res.length > 0) {
               console.log(path + ' missing input label:', res.length, res[0]);
            }
        });
    }
});
