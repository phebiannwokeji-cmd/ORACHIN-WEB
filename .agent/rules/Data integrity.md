---
trigger: always_on
---


# data-integrity.md
Job: keep stored data correct. The currency, minor unit and time zone values are in stack.md.

- Store money as whole numbers in the smallest currency unit. Never use floats. Put the unit in the field name. Why: float arithmetic loses small amounts.
- Use one shared percentage function with a written rounding mode. Test it at exact half-unit boundaries. Work out the second part of a split by subtraction, so the parts always add up to the whole. Compare thresholds in integer basis points. Record the rounding mode as an agent default. Why: ad hoc rounding makes totals disagree by a unit.
- Store timestamps in UTC. Convert only when displaying, using the configured zone. Why: local-time storage breaks on offsets and comparisons.
- Store every measured quantity with its unit. Set the decimal places per field and enforce them in the database type. Why: a bare 10 could mean litres, millilitres or square metres.
- Give every record a stable identifier that never changes and is never reused. Why: references, snapshots and audit events point to it.
- Run writes that must succeed together in one database transaction. Write the audit event for every audited change in that same transaction. Why: otherwise a crash leaves a change with no record.
- Make audit events append-only. No app role may update or delete them. Fix mistakes with new events. Why: an audit log that can be edited proves nothing.
- Copy changeable facts onto the record that depends on them at creation. Later edits to the source must not change the record. Why: a past record must keep meaning what it said.
- Archive, do not delete, any record that other records point to. Why: deleting it breaks history and foreign keys.
- Correct approved or financial records with a linked adjustment. Never edit or delete them. Why: history must stay reconstructable.
- Enforce foreign keys, unique constraints and not-null in the database. Make retry-safe operations use a unique idempotency key. Why: app code has bugs, and constraints do not.
- Change the schema only through migration files in version control. Never edit a migration that has been applied. Get owner approval before any migration that drops or renames a column holding data. Why: migrations are the only repeatable record of the schema.
- Required tests: rounding at boundaries. Parts add up to the whole. Every audited write has an audit row, and both roll back together. Audit update and delete are refused. Unique constraints reject duplicates. Why: these prove the rules above hold.