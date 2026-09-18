import re

with open('svrids-2027/submit-paper.html', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('.glass-card', '.form-shell')
content = content.replace('pill-btn glowing-pill', 'btn-primary')

with open('svrids-2027/submit-paper.html', 'w', encoding='utf-8') as f:
    f.write(content)
