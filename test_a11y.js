const fs = require('fs');

const findMissingAriaLabels = (file) => {
  const content = fs.readFileSync(file, 'utf8');
  let missing = [];
  const regex = /<input[^>]*placeholder="[^"]*"[^>]*>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const input = match[0];
    if (!input.includes('aria-label') && !input.includes('id=')) {
        // Only if it doesn't have an id (meaning no associated <label>) or aria-label

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

const aihealth = findMissingAriaLabels('aihealth/index.html');
console.log('aihealth/index.html missing:', aihealth);
