const fs = require('fs');
let html = fs.readFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/submit-paper.html', 'utf8');

// I will just add class="field" to divs directly inside form-grid
html = html.replace(/<div>\s*<label>/g, '<div class="field">\n                <label>');
html = html.replace(/<div class="">/g, '<div class="field">');

// Full width fields
html = html.replace(/<div class="full">/g, '<div class="field full">');
// Revert any mess
html = html.replace(/<div class="field field">/g, '<div class="field">');
html = html.replace(/<div class="field full field">/g, '<div class="field full">');

fs.writeFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/submit-paper.html', html, 'utf8');

let html2 = fs.readFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html', 'utf8');
html2 = html2.replace(/<div>\s*<label>/g, '<div class="field">\n                <label>');
html2 = html2.replace(/<div class="">/g, '<div class="field">');
html2 = html2.replace(/<div class="full">/g, '<div class="field full">');
html2 = html2.replace(/<div class="field field">/g, '<div class="field">');
html2 = html2.replace(/<div class="field full field">/g, '<div class="field full">');
fs.writeFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html', html2, 'utf8');
