const fs = require('fs');
let svriasHTML = fs.readFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/svrias-2026/register.html', 'utf8');
let isiaiHTML = fs.readFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html', 'utf8');

const formStart = svriasHTML.indexOf('<form id="delegateForm"');
const formEnd = svriasHTML.indexOf('</form>', formStart) + '</form>'.length;
let newForm = svriasHTML.substring(formStart, formEnd);
newForm = newForm.replace('id="delegateForm"', 'id="registrationForm"');

const selectRegex = /<select name="category" id="regCategorySelect"[^>]*>[\s\S]*?<\/select>/;
const newSelect = '<select name="category" id="regCategorySelect" class="form-select" required>\n  <option value="">Select pass category...</option>\n  <option value="student_presenter">Student Presenter [?2,496 / ]</option>\n  <option value="research_delegate">Research Delegate / Faculty [?4,999 / ]</option>\n  <option value="attendee">Attendee Pass [?1,999 / ]</option>\n  <option value="coauthor">Additional Presenter / Co-Author [?2,499 / ]</option>\n  <option value="industry">Industry Professional [?9,999 / ]</option>\n</select>';
newForm = newForm.replace(selectRegex, newSelect);

const goldStart = isiaiHTML.indexOf('<div class="sv-gold-card"');
const oldFormEnd = isiaiHTML.indexOf('</form>', isiaiHTML.indexOf('<form id="registrationForm"')) + '</form>'.length;

let isiaiReplaced = isiaiHTML.substring(0, goldStart) + newForm + isiaiHTML.substring(oldFormEnd);

fs.writeFileSync('c:/Users/Shyam/Scholar Vault 2/Conference-Sites-main/isiai-sgs-2026/register.html', isiaiReplaced, 'utf8');
