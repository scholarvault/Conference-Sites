import re

with open('svrids-2027/submit-paper.html', 'r', encoding='utf-8') as f:
    submit_content = f.read()
with open('svrias-2026/submit-paper.html', 'r', encoding='utf-8') as f:
    svrias_submit_content = f.read()

# Extract svrias form
form_start = svrias_submit_content.find('<form id="paperForm"')
form_end = svrias_submit_content.find('</form>', form_start) + 7
svrias_form = svrias_submit_content[form_start:form_end]

# Modify svrias form for svrids CSS and tracks
svrias_form = svrias_form.replace('SVRIAS 2026', 'SVRIDS 2027')

# Replace tracks in svrias_form
track_options = '''<option value="">Select track...</option>
                <option value="Lab-to-Market Spinouts & DeepTech Commercialization">Track 1: Lab-to-Market Spinouts &amp; DeepTech Commercialization</option>
                <option value="Frontier AI, Autonomous Systems & Robotics">Track 2: Frontier AI, Autonomous Systems &amp; Robotics</option>
                <option value="Quantum Computing & Advanced Silicon Architectures">Track 3: Quantum Computing &amp; Advanced Silicon Architectures</option>
                <option value="BioTech, Synthetic Biology & Longevity Science">Track 4: BioTech, Synthetic Biology &amp; Longevity Science</option>
                <option value="CleanTech, Nuclear Fusion & Sustainable Energy">Track 5: CleanTech, Nuclear Fusion &amp; Sustainable Energy</option>
                <option value="Spatial Computing, Aerospace & Extreme Engineering">Track 6: Spatial Computing, Aerospace &amp; Extreme Engineering</option>'''
svrias_form = re.sub(r'<option value="">Select track\.\.\.</option>.*?</select>', track_options + '\n              </select>', svrias_form, flags=re.DOTALL)

# Fix CSS
svrias_form = svrias_form.replace('class="glass-form"', 'class="form-grid"')
svrias_form = svrias_form.replace('class="form-group full"', 'class="field full"')
svrias_form = svrias_form.replace('class="form-group"', 'class="field"')
svrias_form = svrias_form.replace('class="form-input"', '')
svrias_form = svrias_form.replace('class="form-select"', '')
svrias_form = svrias_form.replace('class="pill-btn frosted-pill"', 'class="btn-outline"')
svrias_form = svrias_form.replace('class="pill-btn glowing-pill"', 'class="btn-primary"')
svrias_form = svrias_form.replace('class="form-grid" style="padding: 0; background: transparent; border: none;"', 'class="form-grid"')
# The SVRIAS form had an inner <div class="form-grid">, let's change it to display:contents
svrias_form = svrias_form.replace('<div class="form-grid">', '<div style="display: contents;">')
svrias_form = svrias_form.replace('id="paperForm"', 'id="submitPaperForm"')

# Now replace the old SVRIDS form with the new svrias_form
svrids_form_start = submit_content.find('<form id="submitPaperForm"')
svrids_form_end = submit_content.find('</form>', svrids_form_start) + 7
if svrids_form_start != -1:
    submit_content = submit_content[:svrids_form_start] + svrias_form + submit_content[svrids_form_end:]

# Now replace the Javascript block at the bottom
# First, let's extract the JS from SVRIAS
svrias_script_start = svrias_submit_content.rfind('<script>')
svrias_script_end = svrias_submit_content.rfind('</script>', svrias_script_start) + 9
svrias_script = svrias_submit_content[svrias_script_start:svrias_script_end]
svrias_script = svrias_script.replace('research-integrity-responsible-ai-summit-2026', 'svrids-2027')
svrias_script = svrias_script.replace('paperForm', 'submitPaperForm')

# Replace it in SVRIDS
# SVRIDS has a script block for form handling
# Let's find the script containing 'submitPaperForm'
svrids_script_start = submit_content.find('<script>\n    const paperForm = document.getElementById(\'submitPaperForm\');')
if svrids_script_start == -1:
    svrids_script_start = submit_content.find('<script>\n    const paperForm = document.getElementById(') # Try generic
if svrids_script_start == -1:
    # Just look for the script that has addEventListener for form
    pattern = re.compile(r'<script>[^<]*getElementById\([\'"]submitPaperForm[\'"]\)[^<]*</script>', re.DOTALL)
    submit_content = pattern.sub(svrias_script, submit_content)
else:
    svrids_script_end = submit_content.find('</script>', svrids_script_start) + 9
    submit_content = submit_content[:svrids_script_start] + svrias_script + submit_content[svrids_script_end:]

with open('svrids-2027/submit-paper.html', 'w', encoding='utf-8') as f:
    f.write(submit_content)
