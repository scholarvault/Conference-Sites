const fs = require('fs');

function processFile(path) {
    let html = fs.readFileSync(path, 'utf8');
    
    html = html.replace(/\bform-group\b/g, 'field');
    html = html.replace(/\bform-input\b/g, '');
    html = html.replace(/\bform-select\b/g, '');
    html = html.replace(/\bglass-form\b/g, '');
    html = html.replace(/\bglass-card\b/g, '');
    html = html.replace(/\bpremium-shell\b/g, 'form-shell');
    html = html.replace(/\bpill-btn glowing-pill\b/g, 'btn-primary form-submit');
    html = html.replace(/\bpill-btn frosted-pill\b/g, 'btn-outline');
    html = html.replace(/\bpill-btn\b/g, 'btn-outline');
    html = html.replace(/class="\s+"/g, 'class=""');
    html = html.replace(/\s+class=""/g, '');
    
    html = html.replace(/#38bdf8/gi, 'var(--accent-primary)');
    html = html.replace(/rgba\(56,\s*189,\s*248,/gi, 'rgba(163, 230, 53,');
    
    html = html.replace(/#fbbf24/gi, 'var(--accent-primary)'); 
    html = html.replace(/#f59e0b/gi, 'var(--accent-primary)'); 
    html = html.replace(/rgba\(245,\s*158,\s*11,/gi, 'rgba(163, 230, 53,');

    fs.writeFileSync(path, html, 'utf8');
}

processFile('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html');
processFile('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/submit-paper.html');
