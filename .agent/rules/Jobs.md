---
trigger: model_decision
description: Use when building or changing scheduled jobs: notification retry, orphan-file cleanup, quote expiry, the job runner, job endpoints or job failure alerts.
---


# jobs.md
Job: the three scheduled jobs and how they run. Retention is in retention.md.

- Build three jobs: notification retry, orphan-file cleanup and quote expiry. Make each safe to run twice, logged, and able to alert a named owner on failure. Why: silent failure leaves customers unnotified and old data piling up.
- Protect every job endpoint with a secret check so the public cannot trigger it. Why: a public job address lets anyone force runs.
- Require a named alert recipient in config (G10). Do not claim the jobs are monitored without one. Why: an alert sent to nobody is not an alert.
- Pick the job runner only after checking that the chosen hosting and database plans support the needed frequency and run time. Record the check in docs/verifications.md. Why: many plans limit how often or how long jobs can run.
- Limit notification retries with a maximum number of attempts and a growing delay. Show failures in the admin failed-notifications list. Treat attempt counts and delays as agent defaults. Why: endless retries spam customers and overload providers.
- Delete files that belong to no valid enquiry after a configured period, and log each deletion. Treat the period as an agent default. Why: abandoned uploads are personal data nobody owns.
- Let the expiry job only update status. Why: the acceptance check in quotes.md is the authority, so a late job cannot cause a wrong acceptance.
- Required tests: each job gives the same result when run twice. A forced failure alerts the named recipient. A public call to a job endpoint is refused. Why: these prove the rules above hold.