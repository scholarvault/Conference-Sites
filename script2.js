const fs = require('fs');

function processFile(path) {
    let html = fs.readFileSync(path, 'utf8');
    
    // 1. Replace .form-group with .field
    html = html.replace(/class="([^"]*)\bform-group\b([^"]*)"/g, 'class=""');
    
    // 2. Remove .form-input, .form-select
    html = html.replace(/\bform-input\b/g, '');
    html = html.replace(/\bform-select\b/g, '');
    
    // 3. Replace .glass-form
    html = html.replace(/class="([^"]*)\bglass-form\b([^"]*)"/g, 'class=""');
    
    // 4. Update buttons
    html = html.replace(/class="([^"]*)\bpill-btn glowing-pill\b([^"]*)"/g, 'class="-primary form-submit"');
    html = html.replace(/class="([^"]*)\bpill-btn frosted-pill\b([^"]*)"/g, 'class="-outline"');
    html = html.replace(/class="([^"]*)\bpill-btn\b([^"]*)"/g, 'class="-outline"');
    
    // 5. Cleanup empty class=" "
    html = html.replace(/class="\s+"/g, 'class=""');
    html = html.replace(/\s+class=""/g, '');
    
    // 6. Fix colors to use ISIAI-SGS green --accent-primary
    // #38bdf8 -> var(--accent-primary)
    // rgba(56, 189, 248, ...) -> rgba(163, 230, 53, ...)
    html = html.replace(/#38bdf8/gi, 'var(--accent-primary)');
    html = html.replace(/rgba\(56,\s*189,\s*248,/gi, 'rgba(163, 230, 53,');
    
    // Also change #fbbf24 and #f59e0b (amber/yellow) which SVRIAS used for gold
    html = html.replace(/#fbbf24/gi, 'var(--accent-primary)'); 
    html = html.replace(/#f59e0b/gi, 'var(--accent-primary)'); 
    html = html.replace(/rgba\(245,\s*158,\s*11,/gi, 'rgba(163, 230, 53,');

    fs.writeFileSync(path, html, 'utf8');
}

processFile('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html');
processFile('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/submit-paper.html');
