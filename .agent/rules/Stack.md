---
trigger: always_on
---


# stack.md
Job: the platform the app runs on: stack, project values, tooling, environments, monitoring, analytics and provider checks. The rules for using money and time values are in data-integrity.md.

## Project values
- Currency is NGN, stored in kobo. Timestamps are stored in UTC and shown in Africa/Lagos. Why: these are the values the generic data rules need.
- Keep business contacts, hours, names of responders, commercial settings and approved content in one config module. Hard-code none of them elsewhere. Why: confirmed values change, and copies go stale.

## Stack and tooling
- Next.js, TypeScript, Tailwind CSS, Supabase (Postgres, Auth, Storage) and Vercel are [PROPOSED]. Do not replace any of them until adoption is recorded in docs/decisions.md. Add no separate backend service. Why: a casual swap breaks every verified assumption.
- Use the repo's verified commands. If none exist, create tooling only when the owner's task is to set up the project. Why: invented scripts fail on the owner's machine.
- Use supported stable versions and commit the lockfile. Justify each new dependency in your report. Write it yourself if it takes under about 20 lines. Why: every dependency is extra attack surface.
- Make the build fail if client code imports a server-only module. Why: a client import would silently expose server secrets.
- Do not pick the email provider, analytics provider or hosting plan yourself (G10). Put email and analytics each behind one module. Why: a later swap should not touch business logic.

## Environments and monitoring
- Keep test and production data and keys separate. Run tests only against the test environment. Use preview deployments. Why: a test run must never change customer records.
- Write the rollback and backup recovery steps in docs/operations.md. Run a backup restore test before launch (G10). Why: a backup that has never been restored is not proven.
- Monitor application errors and alert the named owner. Why: failures that nobody sees are never fixed.
- Before launch, list for the owner every use of the privileged key, every storage and access policy and the full migration set. Why: the PRD requires human review of these, and code that runs is not code that is verified.

## Analytics
- Record product views, guide completion, calculator use, quote submissions and WhatsApp clicks. Exclude staff and test activity. Send no personal data. Report contact clicks apart from sales. Why: the success measures need these events, and a click is not a sale.

## Provider checks ([VERIFY], recorded as in decision-gates.md)
- Supabase: anonymous-role access behaviour, MFA enforcement, signed-URL limits, backup retention and point-in-time recovery.
- Vercel: function duration and body-size limits, scheduled-job support.
- Why: the security and jobs designs depend on these limits.