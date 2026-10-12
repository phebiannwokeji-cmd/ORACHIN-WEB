---
trigger: always_on
---


# scope-and-phases.md
Job: what is built at launch, what is deferred and what is excluded. Whether a built feature is switched on is decided in decision-gates.md.

- Phase 1 is quotation-only. Build the catalogue, colours, static Help Me Choose guide, calculator, quote request cart, commercial enquiries, private uploads, manual WhatsApp handoff, notifications, versioned quotes, staff-recorded acceptance, offline payment records, admin and audit. Why: the owner chose it, and no sales data supports checkout yet.
- Do not bring back v1.0 checkout assumptions. Why: v1.1 removed checkout from launch on purpose.
- Show "Quote only" for price and "Available, made to order" for availability. Show no public prices, no stock numbers and no price filter. Why: prices and stock are unconfirmed, and showing them is a promise.
- If CHK01 exists, make it one config value fixed to off, with no code behind it. Build no Paystack, reservation, order or fulfilment code, tables or dependencies. Why: deferred schema is dead code that adds risk.
- Defer to Phase 2: Paystack, reservations, online quote acceptance, orders and fulfilment, a payment-exceptions queue, CSV export, delivery pricing and a zone table. Why: each one needs owner decisions that are not made yet.
- Defer to Phase 3: customer accounts, reordering, trade pricing, dealer applications, samples, the interactive selector and the compare view. Defer room visualisation and AI features to later experiments. Why: they should follow real demand.
- Exclude factory management, formulas, payroll, full accounting, native apps, crew scheduling and automatic credit approval. Why: they are outside this product.
- Offer painting application services as a separate service next to paint supply. Why: the owner confirmed it as a real offer.
- Do not require accounts. Guests can browse, enquire and request quotes. Why: accounts are Phase 3 and add friction.
- Add an extension point only when a launch requirement needs it now. Add no unused tables, columns, routes, env vars or abstractions. Why: guessed structure costs upkeep and hides the real design.
- If something is not in this file or the PRD, do not build it. Ask. Do not start Phase 2 work unprompted. Why: scope creep is the biggest risk when a PRD has deferred sections.
- Required tests: no checkout route exists and CHK01 is off. Public pages and responses carry no prices or stock numbers. No Phase 2 table exists in the migrations. Why: these prove the launch stayed quotation-only.