import re

with open('svrids-2027/css/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'(\.navbar__links\s*{[^}]*gap:\s*)4px', r'\g<1>2px', content)
content = re.sub(r'(\.navbar__link\s*{[^}]*padding:\s*)0 12px', r'\g<1>0 8px', content)
content = re.sub(r'(\.navbar__link\s*{[^}]*font-size:\s*)0\.85rem', r'\g<1>0.78rem', content)

with open('svrids-2027/css/style.css', 'w', encoding='utf-8') as f:
    f.write(content)
