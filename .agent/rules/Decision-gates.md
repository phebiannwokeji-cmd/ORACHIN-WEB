---
trigger: always_on
---


# decision-gates.md
Job: the list of undecided items and how decisions are recorded. Other files cite gate IDs and do not restate gate conditions.

## Status tags
- [CONFIRMED]: build it, including any qualifier such as "provisional". Why: the qualifier is part of the decision.
- [PROPOSED] and inside Phase 1 scope: build it, but do not treat its details as final. [PROPOSED] and outside Phase 1: do not build it. Why: many launch features are still tagged proposed, and blocking them would stop the build.
- [BLOCKED: owner]: stop only the behaviour that depends on it. Keep building the rest. Never invent the value. Why: an invented value becomes a silent policy.
- [PENDING: legal review]: never describe it as legally approved or settled. Why: wrong legal claims create liability.
- [VERIFY]: before relying on it, read the current provider documentation. Record the URL, the date and the limit you relied on in docs/verifications.md. Why: provider limits change, and memory is unreliable.

## Recording decisions
- Record each new owner decision in docs/decisions.md with the date, the source, the decision and the requirement IDs it affects. It overrides AGENTS.md, these rules and the PRD on that point. Why: decisions must be traceable across sessions.
- If two documents conflict and no recorded decision covers it, use the stricter behaviour and ask. Why: the stricter choice can be undone, and the looser one may not.
- Only the owner clears a gate, through a recorded decision. The agent never clears one. Why: a gate exists because the agent cannot supply the missing fact.

## Enforcement
- Store each gate in config as "configured" or "cleared". Record who cleared it and when. Add a new row for each change and never update a row in place. Why: the owner can see the full history of every gate.
- Check gate state on the server inside the action. When a gate is closed, reject the action with a clear message and test it. Why: a hidden button is easy to bypass.
- Build the feature behind a closed gate in full. Why: the owner needs it ready the moment the decision arrives.

## Registry
Why: one registry means one place to update.

| ID | Blocks | Owner records to unlock | Still built meanwhile |
|---|---|---|---|
| G1 Quote issuance | Real quotes to customers | Deposit percent and validity confirmed or still provisional. Discount ceiling and its basis (line or quote total). Credit position. Invoice or tax document. Bulk threshold. G4 cleared for affected policies. | Draft quotes, calculations, versions, snapshots |
| G2 Live acceptance | Recording real acceptances | An approved evidence rule. Qualified input on who may accept for a company. | The acceptance mechanism and audit |
| G3 Live release | Production or dispatch release actions | Named approvers. Rules for production versus dispatch. Deposit conditions. | Approval capture, payment recording |
| G4 Policy publication | Real quotes and public release of affected policies | Full returns (Option A) wording. The damage window (provisionally 48 hours). The privacy notice. Applicable legal review. | Versioned draft and approved policy content, templates, previews |
| G5 Destructive retention | Deleting or anonymising production data | A definition of "last contact". Delete or anonymise. Financial and audit exceptions. Backup handling. Legal review of 24 months. | Inventory, metadata, dry runs, run records, alerts |
| G6 Uploads | Turning on customer uploads | The scanning-or-quarantine choice | The enquiry flow without attachments |
| G7 Phone recovery | Self-service link recovery by phone | An approved way to verify possession of the phone | A neutral support route, email recovery |
| G8 Delivery and timing claims | Delivery promises, same-day or next-day delivery claims | Courier, coverage, proof of delivery, failed-delivery rule, pickup. After-hours behaviour. Start event, working-day basis and cutoff for lead time. | Timing config and templates |
| G9 Catalogue publication | Publishing products and the Projects page | Owner-supplied approved products, coverage and colours. Genuine project content. | Schema, admin, fixtures in non-production only |
| G10 Production launch | Going live | Launch checks passed: approved content, acceptance tests, access-control checks, restore test, monitored notifications, confirmed support contacts. An approved retention operating plan. A named alert owner. The domain. Hosting budget checked against jobs needs. Email provider. Analytics choice. Staff roles. Owner authorisation. | Everything else |