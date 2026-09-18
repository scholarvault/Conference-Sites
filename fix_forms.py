import re

# 1. Update submit-paper.html
with open('svrids-2027/submit-paper.html', 'r', encoding='utf-8') as f:
    submit_content = f.read()
with open('svrias-2026/submit-paper.html', 'r', encoding='utf-8') as f:
    svrias_submit_content = f.read()

# Extract svrias form
form_start = svrias_submit_content.find('<form id="paperForm"')
form_end = svrias_submit_content.find('</form>', form_start) + 7
svrias_form = svrias_submit_content[form_start:form_end]

# Modify svrias form for svrids
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

# Replace in svrids submit-paper
svrids_form_start = submit_content.find('<form id="paperForm"')
svrids_form_end = submit_content.find('</form>', svrids_form_start) + 7
submit_content = submit_content[:svrids_form_start] + svrias_form + submit_content[svrids_form_end:]

# Just replace the whole javascript block at the bottom of submit-paper with the one from svrias
svrias_script_start = svrias_submit_content.rfind('<script>')
svrias_script_end = svrias_submit_content.rfind('</script>', svrias_script_start) + 9
svrias_script = svrias_submit_content[svrias_script_start:svrias_script_end]

svrids_script_start = submit_content.rfind('<script>')
svrids_script_end = submit_content.rfind('</script>', svrids_script_start) + 9

submit_content = submit_content[:svrids_script_start] + svrias_script + submit_content[svrids_script_end:]

# Update url in script
submit_content = submit_content.replace('research-integrity-responsible-ai-summit-2026', 'svrids-2027')

with open('svrids-2027/submit-paper.html', 'w', encoding='utf-8') as f:
    f.write(submit_content)


# 2. Update register.html
with open('svrids-2027/register.html', 'r', encoding='utf-8') as f:
    reg_content = f.read()

with open('svrias-2026/register.html', 'r', encoding='utf-8') as f:
    svrias_reg_content = f.read()

# Delete Gold Card
reg_content = re.sub(r'<div class="sv-gold-card reveal" id="svGoldCard">.*?</div>\s*</div>\s*</div>', '', reg_content, flags=re.DOTALL) 

# Replace registration form
svrias_form_start = svrias_reg_content.find('<form id="delegateForm"')
svrias_form_end = svrias_reg_content.find('</form>', svrias_form_start) + 7
svrias_reg = svrias_reg_content[svrias_form_start:svrias_form_end]

svrids_form_start = reg_content.find('<form id="registrationForm"')
svrids_form_end = reg_content.find('</form>', svrids_form_start) + 7
reg_content = reg_content[:svrids_form_start] + svrias_reg + reg_content[svrids_form_end:]

# Adapt the form to SVRIDS 2027
reg_content = reg_content.replace('SVRIAS 2026', 'SVRIDS 2027')
reg_content = reg_content.replace('id="delegateForm"', 'id="registrationForm"')

# Update category dropdown
category_options = '''<option value="">Select pass category...</option>
                <option value="virtual_student" data-name="Virtual Student Pass">Virtual Student Pass (?1,999 / )</option>
                <option value="virtual_faculty" data-name="Virtual Faculty/Academic Pass">Virtual Faculty/Academic Pass (?3,999 / )</option>
                <option value="in_person_student" data-name="In-Person Student Pass">In-Person Student Pass (?3,499 / )</option>
                <option value="in_person_faculty" data-name="In-Person Faculty/Academic Pass">In-Person Faculty/Academic Pass (?5,999 / )</option>
                <option value="startup_pitch" data-name="Startup Pitch Pass">Startup Pitch Pass (?4,999 / )</option>
                <option value="listener" data-name="Listener Pass">Listener Pass (?1,499 / )</option>
                <option value="co_author" data-name="Co-Author Pass">Co-Author Pass (?2,499 / )</option>'''
reg_content = re.sub(r'<select name="category".*?</select>', '<select name="category" id="regCategorySelect" class="form-select" required>\\n                ' + category_options + '\\n              </select>', reg_content, flags=re.DOTALL)

with open('svrids-2027/register.html', 'w', encoding='utf-8') as f:
    f.write(reg_content)

