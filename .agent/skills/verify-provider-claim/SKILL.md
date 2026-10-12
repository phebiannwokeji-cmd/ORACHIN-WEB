---
name: verify-provider-claim
description: "Use when a design depends on a provider limit or capability tagged [VERIFY] and no recorded check exists for it. Produces one verified, recorded entry for that claim."
---

# Verify a provider claim

Run this procedure once for each claim. Do not batch claims.

## Steps

1. State the claim.
   Write one sentence with the number and unit the design needs. Example: how often a job must run, and for how long. Name the gate or rules file that depends on it.
   Check: the sentence has a number, a unit and a named dependent.

2. Name the plan tier.
   Use the tier the project runs on. If the hosting plan is not chosen, list each candidate tier and work through them one at a time.
   Check: every tier you will test is written down.

3. Find the provider's documentation.
   Open the provider's own page for the exact claim. Use only the provider's official domain. If only other sources exist, mark the claim unverified and go to step 6.
   Check: you hold a URL on the provider's official domain, or the claim is marked unverified.

4. Copy the figure.
   Write the figure exactly as documented. Include its unit, its tier, and the page date or version if shown. Do not round or convert it.
   Check: figure, unit and tier appear together in your notes.

5. Test the claim when you can.
   If the project exists, run a real test of the claim and save the output. Examples: call a table as the anonymous role, or trigger a scheduled job at the needed frequency. If the project does not exist yet, label the entry "documentation only".
   Check: the entry holds saved test output or the label.

6. Compare the figure with the need.
   Put the figure from step 4 next to the number from step 1. If the figure falls short, is unclear, or is unverified, stop the dependent work. Ask the owner one question, following workflow.md.
   Check: the figure meets the need, or one question has been asked and the dependent work is stopped.

7. Record the entry.
   Give the entry a short identifier made of the provider name and the claim. Write the entry in the form decision-gates.md requires for [VERIFY]. Add the identifier as a comment beside each config value or code line that relies on the figure.
   Check: a search for the identifier finds the entry and every dependent line.

8. Re-check when something changes.
   Before you rely on an existing entry in a later task, compare its tier and claim with the current design. If either differs, repeat from step 3 for that entry.
   Check: the entry matches the current tier and claim, or it carries a newer date.