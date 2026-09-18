import re

with open('svrids-2027/submit-paper.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS Class replacements
content = content.replace('class="glass-card"', 'class="form-shell"')
content = content.replace('class="glass-form"', 'class="form-grid"')
content = content.replace('class="form-group full"', 'class="field full"')
content = content.replace('class="form-group"', 'class="field"')
content = content.replace('class="form-input"', '')
content = content.replace('class="form-select"', '')
content = content.replace('class="pill-btn frosted-pill"', 'class="btn-outline"')
content = content.replace('class="pill-btn glowing-pill"', 'class="btn-primary"')
content = content.replace('class="form-grid" style="padding: 0; background: transparent; border: none;"', 'class="form-grid"')
content = content.replace('<div class="form-grid">', '<div style="display: contents;">') # fixes the nested form-grid

with open('svrids-2027/submit-paper.html', 'w', encoding='utf-8') as f:
    f.write(content)

with open('svrids-2027/register.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('<div class="form-grid">', '<div style="display: contents;">') # fixes nested form-grid in register too
with open('svrids-2027/register.html', 'w', encoding='utf-8') as f:
    f.write(content)
