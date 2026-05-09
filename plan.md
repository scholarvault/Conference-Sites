1. **Analyze Vulnerability**
   - In `aihealth/js/people-loader.js`, user-provided database content (`person.name`, `person.talk_type`, `person.topic`) is directly inserted into `onclick` attribute handlers via string concatenation.
   - The current code only replaces `'` with `\'`:
     ```javascript
     var rawName = (person.name || '').replace(/'/g, "\\'");
     ```
   - This allows an attacker to escape the `onclick` attribute context by injecting `"` or a literal `\` (e.g., escaping the slash or injecting `"); alert(1); //`).
   - This is a High/Critical Stored DOM XSS Vulnerability since user input comes from `conf_speakers` database.

2. **Fix Vulnerability**
   - Add a `safeJsString` function in `aihealth/js/people-loader.js` that correctly escapes backslashes and single quotes, AND then uses the existing `esc` (HTML escape) function.
   - Update `rawName`, `rawType`, and `rawTopic` to use `safeJsString`.
   - Before: `var rawName = (person.name || '').replace(/'/g, "\\'");`
   - After: `var rawName = esc((person.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'"));`
   - Wait, `esc` will replace `&`, `<`, `>`, `"`, `'`. The original replace only handles `'` for JS string.
   - Wait, `esc` will replace `'` with `&#039;`.
   - Actually, a simpler and more robust way is to just use `esc` for the string representation:
     ```javascript
     var rawName = esc((person.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
     ```
   - Let's double check if `esc` handles `\n`. It doesn't, we should add `.replace(/\n/g, "\\n").replace(/\r/g, "\\r")` to be safe since it's inside a single quoted JS string.
   - `var rawName = esc((person.name || '').replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r"));`

3. **Verify**
   - Check the fix by reading `aihealth/js/people-loader.js`.
   - Run tests `bun test` if any exist.

4. **Add Sentinel Journal Entry**
   - Update `.jules/sentinel.md` with the new learning about DOM XSS via JS string literals in HTML event attributes.

5. **Pre-commit Steps**
   - Run `pre_commit_instructions` and follow them.

6. **Submit PR**
   - Title: `🛡️ Sentinel: [HIGH] Fix XSS in speaker share button onclick handler`
