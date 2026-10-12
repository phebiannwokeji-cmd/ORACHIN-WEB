---
name: apply-owner-decision
description: "Use when the owner states a decision, supplies approved wording or data, or confirms or changes an agent default, and that resolves an item in the decision-gates.md registry. Updates every dependent and tests the result."
---

# Apply an owner decision

Run this procedure once for each decision. Do not combine two decisions.

## Steps

1. Confirm the source.
   Check that the owner made the decision, in this conversation or in a document the owner supplied. If it came from anywhere else, stop and ask the owner to confirm.
   Check: you can point to the message or document where the owner said it.

2. Map the decision.
   Find its gate ID and requirement IDs in the registry in decision-gates.md. List every condition of that gate that is still open after this decision.
   Check: the gate ID, the requirement IDs and the list of open conditions are written down.

3. Record the decision.
   Add it as decision-gates.md requires. If the owner confirmed or changed an agent default, update that default's entry as well.
   Check: the entry holds the date, source, decision and requirement IDs.

4. Find the dependents.
   Search the whole repo by gate ID, by requirement ID, and by the terms the decision affects. Example terms: "returns summary" and "lead time". Cover config, server checks, templates, page copy, tests and migrations.
   Check: you hold a written list of every file found.

5. Update each dependent.
   Replace each placeholder or agent default with the recorded value. Leave alone anything the decision does not settle.
   Check: a repeat search finds no placeholder or old default for the settled value.

6. Set the gate state.
   Change a gate only if every condition is now met and the owner has said to clear it. Follow decision-gates.md for how. Otherwise leave the gate closed.
   Check: the gate state matches the open-conditions list from step 2.

7. Run the tests.
   Run the tests named for the gate and for the requirement IDs. Then run the closed-state tests for every condition that is still open.
   Check: both sets pass, and you hold the output.

8. Add to the task report.
   In the task report required by workflow.md, list the decision, each file from step 4 marked changed or unchanged, the tests run, and the conditions still open.
   Check: every file from step 4 appears in the report.