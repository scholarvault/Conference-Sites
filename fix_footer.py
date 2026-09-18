import os
import re

dir_path = 'svrids-2027'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

for html_file in html_files:
    file_path = os.path.join(dir_path, html_file)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove footer__protection div properly
    pattern = re.compile(r'<div\s+class=\"footer__protection\">.*?</div>', re.DOTALL)
    content = pattern.sub('', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
