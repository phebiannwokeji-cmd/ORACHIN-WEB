# ORACHIN Paints — Decision Register

This document tracks all owner decisions, their sources, dates, affected requirements, and agent defaults as mandated by `AGENTS.md` and `.agent/rules/Decision-gates.md`.

---

## Owner Decisions

### D-2026-10-12-01: Admin Case-Study Content Type in Phase 1
- **Date:** 2026-10-12
- **Source:** Direct owner instruction in chat session.
- **Decision:** Add a simple case-study content type in the admin interface as part of Phase 1. This includes database schema, types, server validation, audit logging, and staff admin management (list, view, create, edit, draft/publish controls) for genuine project case studies.
- **Affected Requirements:** ADM01 (§6 Admin dashboard), G9 (Catalogue and Projects publication gate), Site-Structure (§2, §6 Content and communications).
- **Qualifications / Enforcement:**
  - G9 remains active: Public display of the Projects/Case Studies page remains blocked until owner supplies genuine, approved project content and imagery.
  - No synthetic or placeholder case studies will be published to public routes or production builds.
  - All admin writes are audited in the append-only audit log in the same transaction.
  - Case studies are stored with UTC timestamps and rendered in Africa/Lagos display time.

### D-2026-10-12-02: Stack Confirmation and Scaffold Tooling Authorization
- **Date:** 2026-10-12
- **Source:** Owner approval in chat session following Stage 1 proposal.
- **Decision:** Adopt Next.js (App Router), TypeScript, and Tailwind CSS for the frontend application scaffold. Database (Supabase) and hosting deployments remain deferred. Establish verified commands for lint/type-check (`npm run type-check`), build (`npm run build`), token verification (`npm run tokens:check`), and tests (`npm test`).
- **Affected Requirements:** Stack (§6, stack.md), Workflow (workflow.md).

---

## Agent Defaults

### AD-2026-10-12-01: Case-Study Initial Status
- **Default:** New case studies default to `status = 'draft'` upon creation.
- **Rationale:** Prevents accidental early publication before genuine photography and specifications are cleared.

### AD-2026-10-12-02: Calculator Pack Combination Selection Algorithm
- **Default:** When selecting pack sizes for estimated litres, choose the pack combination with the fewest supplied litres at or above the need, and fewer packs on a tie. If still tied, prefer larger standard packs.
- **Rationale:** Mandated by `calculator.md` as an agent default because the PRD does not specify a commercial pack selection algorithm. Minimizes customer over-purchase while minimizing container handling.

### AD-2026-10-12-03: Calculator Waste & Application Allowance Default
- **Default:** Application allowance defaults to 0% in `BUSINESS_CONFIG.commercial.calculatorAllowancePercent`.
- **Rationale:** Mandated by `calculator.md`. No approved allowance figure exists; defaulting to 0% avoids promising unverified allowances. Flagged for owner confirmation.
