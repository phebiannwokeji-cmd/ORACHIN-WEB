---
trigger: model_decision
description: Use when building or changing offline payment records, refunds, release approval, staff roles or the role permission table.
---


# payments-and-release.md
Job: record offline payments against accepted quotes and control release approval. Quote rules are in quotes.md.

- Link each payment to an accepted quote version, not to an order. Why: orders belong to Phase 2.
- Require amount, method, reference, date, confirmer, reason and approver on every entry. Label it "staff-recorded", never "provider-verified", and make it look different. Why: no payment provider has checked it.
- Work out each deposit from the percentage snapshotted on the accepted version, using the shared percentage function. Why: the accepted terms, not today's defaults, decide the amount.
- Work out payment status (pending, paid, partially paid, refunded) from the entries and the accepted total. Let no role set it by hand. Why: hand-set status drifts from the money.
- Allow only Owner or admin to record payments until the owner names other roles. Why: the PRD says "appropriate role" without naming one.
- Require owner approval for refunds. The PRD names no deputy, so do not create one. Reject any approval role that is not configured. If no approver is available, the action fails. Why: an invented deputy is an invented authority.
- Never let a payment release production or dispatch. Record release approval as its own entry with the quote version, approver, time, purpose (production or dispatch) and supporting payment references. Why: being paid and being cleared to start work are different decisions.
- Keep live release actions off until G3 is cleared. Keep the earlier before-production control. Do not quietly replace it with a dispatch-only check. Keep recording quotes and payments in the meantime. Why: the PRD names both points, and only the owner can pick one.
- Give Owner or admin the rights for staff access, configuration, publishing, pricing, the approvals that quotes.md requires, refunds and adjustments. Give Sales enquiries, quotes within the pricing rules and follow-up. Enforce a role-by-action table on the server. Sales cannot approve refunds or set payment status. Why: the fewer rights an account has, the less harm a misused account can do.
- Required tests: unauthorised payments, refunds and release attempts are rejected. Release fails while G3 is closed. Status is correct after a partial payment. A payment and its audit row roll back together. Why: these prove the rules above hold.