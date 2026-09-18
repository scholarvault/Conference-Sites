with open('svrias-2026/register.html', 'r', encoding='utf-8') as f:
    content = f.read()
    start = content.find('<form id="registrationForm"')
    end = content.find('</form>', start) + 7
    reg_form = content[start:end]
    with open('svrias_reg_form.html', 'w', encoding='utf-8') as out:
        out.write(reg_form)

with open('svrias-2026/submit-paper.html', 'r', encoding='utf-8') as f:
    content = f.read()
    start = content.find('<form id="paperForm"')
    end = content.find('</form>', start) + 7
    submit_form = content[start:end]
    with open('svrias_submit_form.html', 'w', encoding='utf-8') as out:
        out.write(submit_form)
