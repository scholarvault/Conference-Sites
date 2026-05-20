1. **Add missing `areaServed: "IN"` to Organization schema in `aihealth/index.html`**
   - The memory clearly states: "For India-specific SEO across ScholarVault sub-projects, the `Organization` structured data (JSON-LD) block must explicitly include `"areaServed": "IN"`."
   - The `Organization Schema` script block in `aihealth/index.html` is currently missing `"areaServed": "IN"`. I will add it.
   - This fits the Pathfinder criteria of "India/academic keyword optimization in existing meta tags" and "One-Fix-Per-Run".

2. **Add a comment starting with `// PATHFINDER:` or HTML equivalent to document the fix.**
   - I will add `<!-- PATHFINDER: Added areaServed: "IN" for India-specific SEO optimization -->` to the HTML right before the JSON-LD schema or inside the existing HTML comment.
   - Actually, since this is JSON-LD, I should just modify the HTML comment directly above the script.

3. **Run testing step**
   - Syntax validation: Check the HTML syntax using Python's `html.parser` and check the JSON-LD using a node.js one-liner to extract and parse the JSON block.

4. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
   - Call `pre_commit_instructions`

5. **Submit the PR**
   - Create PR with title `🧭 Pathfinder: [SEO fix] — aihealth/index.html`
   - Create a description matching the template for Pathfinder.
