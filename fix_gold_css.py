import re

with open('svrids-2027/register.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the whole block
# Find /* ?? SV Gold Addon Card Styles ?? */
# It's better to just do a regex that catches everything from /* .*SV Gold.* */ to /* .*Gold Purchase Modal.* */
content = re.sub(r'/\*.*?SV Gold Addon Card Styles.*?\*/.*?/\*.*?Gold Purchase Modal.*?\*/', '/* Gold Purchase Modal */', content, flags=re.DOTALL)

with open('svrids-2027/register.html', 'w', encoding='utf-8') as f:
    f.write(content)
