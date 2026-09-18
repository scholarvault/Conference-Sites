import re

with open('svrids-2027/register.html', 'r', encoding='utf-8') as f:
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

# 2. Delete OLD standalone Gold card
# Search for <!-- ScholarVault Gold Membership Addon --> up to <!-- Registration Intent Form -->
content = re.sub(r'<!-- ScholarVault Gold Membership Addon -->.*?<!-- Registration Intent Form -->', '<!-- Registration Intent Form -->', content, flags=re.DOTALL)

# 3. Delete old Gold CSS in <style>
style_pattern = r'\.sv-gold-[a-zA-Z0-9-]+\s*(?::[a-z]+)?\s*\{[^}]*\}'
for _ in range(5):
    content = re.sub(style_pattern, '', content)

# 4. Refactor Gold inline toggle section colors
# Replace hardcoded colors with variables
content = content.replace('rgba(245, 158, 11, 0.16)', 'var(--bg-surface)')
content = content.replace('rgba(180, 83, 9, 0.08)', 'var(--bg-surface)')
content = content.replace('rgba(12, 14, 20, 0.75)', 'var(--bg-surface)')
content = content.replace('rgba(245, 158, 11, 0.4)', 'var(--border-subtle)')
content = content.replace('#f59e0b', 'var(--accent-amber)')
content = content.replace('#fef08a', 'var(--accent-amber)')
content = content.replace('#d97706', 'var(--accent-amber)')
content = content.replace('#78350f', 'var(--bg-surface)')
content = content.replace('rgba(254, 240, 138, 0.5)', 'var(--border-subtle)')
content = content.replace('rgba(245, 158, 11, 0.2)', 'var(--border-subtle)')
content = content.replace('#fbbf24', 'var(--accent-amber)')

with open('svrids-2027/register.html', 'w', encoding='utf-8') as f:
    f.write(content)
