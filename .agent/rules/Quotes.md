---
trigger: model_decision
description: Use when building or changing quote records, quote versions, line items, discounts, deposit terms, validity, expiry or staff-recorded acceptance.
---


# quotes.md
Job: the quote lifecycle, from draft lines to accepted version. Payments and release are in payments-and-release.md.

- Use the quote states draft, issued, accepted, expired and cancelled. Keep enquiry, quote, payment and release states in separate fields. Why: one overloaded status hides what is true.
- Give each quote a number and numbered versions. A version holds line items, delivery, lead time, validity, payment terms, any discount with its approver, and the quote approver. Why: disputes need an exact record of what was offered.
- A product line needs its product, finish, colour name and code, and pack settled before issue. A service line needs a defined scope and has no paint options. Why: a quote must be clear and repeatable even if the catalogue changes.
- Quote delivery per job. If there is no courier rate, show "delivery to be quoted". Never show zero or free. Why: a missing number must not read as a promise.
- Make lead time a field staff confirm on each version. Why: the owner confirmed 1 to 3 days only as a production time that needs confirming.
- Offer payment as full payment, or as a deposit with the balance due on delivery or completion. Set the deposit at 60 percent, as a provisional config value. Why: these are the confirmed terms, and the owner said the percentage may change.
- Always allow drafts and calculations. Block issuing a real quote until G1 is cleared, and G4 for affected policies. Why: the commercial terms are still provisional.
- When issuing, snapshot the cleared deposit percent, validity, discount ceiling, terms and policy versions onto the version. Why: later default changes must not rewrite what a customer was shown.
- Allow a discount of 3 percent (300 basis points) or less without owner approval. Require approval above that. Hold the discount basis in config. The PRD does not say whether it is per line or per quote total, so ask the owner and do not guess. Why: "3 percent" needs a base, and the exact boundary must be written down.
- Set validity to 14 days from issue, as a provisional config value. Check expiry at the moment of acceptance, not only in the expiry job. Why: a scheduled job can run late.
- When staff revalidate or revise an unaccepted quote, create a new version. Keep the old one. Require fresh acceptance. Never edit an accepted version. Why: the accepted terms are the contract.
- Let staff record acceptance only after G2 is cleared. Record it against the exact current, unexpired version. Attach the written evidence. Record the customer's identity and capacity, who recorded it and when. Never treat a link click as acceptance. Why: evidence supports a claim, and clicks do not.
- Prevent races. Accept and revise must both check the current version in one transaction. Allow only one acceptance per quote. Why: a simultaneous accept and revise must not both succeed.
- Recompute totals and discounts on the server from stored data. Ignore figures sent by the client. Why: client figures can be edited.
- Required tests: a discount at 300 basis points passes, and just above needs approval. Acceptance after expiry fails at action time. Simultaneous accept and revise allows one. An accepted version cannot change. A changed default does not alter an issued version. A product edit does not change quote lines. Issuing fails while G1 is closed. A missing delivery rate never shows as free. Why: these prove the rules above hold.