---
trigger: model_decision
description: Use when building or changing personal-data retention, deletion or anonymisation, the data inventory, dry-run reports or retention run records.
---


# retention.md
Job: the personal-data retention process. It is separate from the three operational jobs in jobs.md.

- Build retention as its own process with a data inventory, lifecycle metadata, dry-run reports, accountable runs, failure alerts and recorded outcomes. Why: AGENTS.md requires it to be specified separately from the other jobs.
- List in the inventory every table and storage place that holds personal data. Why: deleting without an inventory misses data or destroys records that must be kept.
- Keep personal data out of dry-run reports. List counts per table and rule. For a real run, record who ran it, when, with what settings, the counts and the outcome. Why: the owner and any reviewer need proof of what was removed.
- Record the policy as 24 months from last contact, pending legal review. Do not define "last contact", choose delete or anonymise, set financial and audit exceptions or decide backup handling (G5). Why: each choice has legal and accounting effects.
- Make the server refuse destructive runs until G5 is cleared. Build and test everything else, including dry runs. Why: a flag that defaults to off can be switched on by accident.
- Require an approved, written retention plan before launch. A disabled deletion mode does not allow keeping data forever. Why: keeping personal data indefinitely is a compliance risk too.
- Required tests: a dry run reports and deletes nothing. A destructive run is refused while G5 is closed. A forced failure alerts the named owner. Why: these prove the rules above hold.