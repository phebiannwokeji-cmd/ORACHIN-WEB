# ORACHIN Paints — Product Requirements Document v1.1

**Status: PROPOSED.** This revision incorporates owner-confirmed decisions from the review cycle. Items marked `[CONFIRMED]` were stated by the business owner. Items marked `[PROPOSED]` are recommended and not yet approved. Items marked `[BLOCKED: owner]` cannot be built or enabled until the named decision is recorded. Items marked `[PENDING: legal review]` require qualified legal input.

**What changed from v1.0.** Checkout is removed from launch and deferred to Phase 2. The launch is quotation-only. WhatsApp becomes a first-class handoff channel. Stock is production-on-request with no quantity displayed. Delivery is quoted per job via third-party courier. Payment is offline, recorded in admin. Returns, colour confirmation, privacy retention, deposit, discount ceiling, and quote validity are now specified.

**What did not change.** Section numbering and requirement IDs are preserved from v1.0. The sound decisions identified across the reviews remain: server-side authority, refusal to fabricate specifications, integer money, UTC timestamps, immutable order snapshots, separated statuses, single deployable application.

---

## Status legend

Each requirement carries one tag:

- **[CONFIRMED]** — stated by the business owner.
- **[PROPOSED]** — recommended, not yet approved.
- **[BLOCKED: owner]** — cannot be built or enabled until the named decision is recorded.
- **[PENDING: legal review]** — requires qualified legal input.

Every unconfirmed commercial value lives in configuration and defaults to the safer behaviour: quote-only, no price shown, no free delivery, made-to-order treated as quote-only.

---

## §1 Product direction

**[CONFIRMED]** Build a mobile-friendly website and enquiry platform for ORACHIN Paints, a paint manufacturer serving residential and commercial customers in Lagos and across Nigeria. Help customers choose suitable products, estimate quantities, and request a project quotation. Give staff one place to manage product information, enquiries, quotes, and customer records.

**[CONFIRMED]** The business manufactures several paint types and serves residential and commercial customers. ORACHIN Paints operates from 110b Old Ewu Road, Aviation Estate, Mafoluku, Lagos. Painting application services are offered.

### Recommended commercial model

**[CONFIRMED]** Launch is quotation-only. Direct checkout is deferred to Phase 2 and controlled by switch CHK01, which is off by default. Custom colours, bulk requests, and all orders route to a quotation.

**[PROPOSED]** Direct checkout may be enabled per variant and per delivery zone only after every condition in the §8 "Checkout enablement gate" is recorded.

**[BLOCKED: owner]** Ordering policy for Phase 2: which variants become checkout-eligible, and when.

### Outcomes

- Help homeowners identify the right paint without needing to understand every technical term.
- Convert product interest into sufficiently detailed quotation requests.
- Help contractors and commercial customers communicate project quantities and delivery needs.
- Reduce staff time spent repeating product details and recording enquiries.
- **[CONFIRMED]** At launch, record the exact product, colour name and code, finish, and pack size on every enquiry and quote, and repeat them on the quotation, so customers and staff can repeat a purchase by reference. Customer accounts and self-service reordering belong to Phase 3.
- **[CONFIRMED]** Offer painting application services as a distinct service alongside paint supply.

### Release boundaries

**[CONFIRMED] Launch essentials:** product catalogue; product and colour pages; quantity calculator (only for products with approved coverage); static "Help Me Choose" guide; quote request cart; commercial enquiry form with private uploads; minimal versioned quote record with staff-recorded acceptance; WhatsApp handoff; transactional notifications; admin for products, enquiries, quotes, and audit.

**[PROPOSED] Phase 2 (when the owner enables it):** conditional checkout, delivery pricing, stock reservations, Paystack payment, online quote acceptance, payment-exceptions queue, CSV export.

**[PROPOSED] Phase 3:** customer accounts and reordering; trade pricing; dealer applications; samples ordering; richer commercial quotation tools; interactive selector; compare view.

**[PROPOSED] Later experiments:** room colour visualisation; AI enquiry summaries; approved-content product assistance. Evaluate against actual customer demand.

**Outside scope:** manufacturing formulas; factory planning; payroll; full accounting; native mobile apps; autonomous credit approval; painting-crew scheduling.

---

## §2 Customers and website structure

### Customer journeys

**[PROPOSED] Residential buyer:** arrive from search, referral, or social media; choose a surface and finish; review a product; estimate quantity; select colour and pack size; add to quote request; enter delivery area; submit; receive an enquiry reference; continue the conversation on WhatsApp if preferred.

**[PROPOSED] Commercial buyer:** open the commercial page; describe the project; add products and quantities where known; upload a bill of quantities or specification; receive an acknowledgement with a first-response window; discuss requirements with staff; receive a versioned quotation; accept; pay according to agreed terms.

**[PROPOSED] Sales staff:** open an enquiry; assign responsibility; clarify missing information; prepare prices and delivery; issue a quotation; track acceptance and payment; hand the confirmed order to production.

**[CONFIRMED] First responder:** Phebian Nwokeji. **Deputy:** Juliet Nwabueze.

### Proposed navigation

**[CONFIRMED]** Primary: **Shop Paints**; **Colours**; **Help Me Choose** (guide and calculator); **Commercial and Bulk**; **Contact and Delivery**.

**[CONFIRMED]** Persistent on mobile: quote request, WhatsApp (08035855944 and 08108196504), call.

**[CONFIRMED]** Footer: About; Projects (published only when genuine case studies exist); Privacy; Sales Terms; Returns and Damaged Goods.

**Separate from public navigation:** admin area.

Show only genuine projects, reviews, addresses, credentials, and product claims. Publish service-area content only for areas the business actually serves.

### Homepage requirements

**[PROPOSED]** Use real packaging and project photography, a clear explanation of what ORACHIN Paints manufactures, featured product categories, and two main actions: **Shop Paints** and **Request a Quote**. Show delivery information without making an unconfirmed nationwide delivery promise. Keep phone and WhatsApp contact easy to find on mobile.

**[CONFIRMED]** State that painting application services are offered.

### Interaction requirements

**[CONFIRMED]** Allow browsing and quote requests without account creation. Use visible labels, understandable errors, large touch targets, and a clear next step on every form. Preserve entered details when validation fails. Show meaningful empty and out-of-stock states rather than dead ends.

**[CONFIRMED] WhatsApp handoff.** WhatsApp links appear on:

1. **Product pages**, carrying product name, colour name and code, and pack size where selected.
2. **Quote request confirmation**, carrying the enquiry reference and the requested items.
3. **Commercial enquiry acknowledgement**, carrying the enquiry reference and the uploaded attachment filename (not the file itself).

**[CONFIRMED]** A WhatsApp click is a contact event, not a confirmed order. Keep personal information out of prefilled URLs.

**[PROPOSED]** WhatsApp is a contact and conversation channel, not a record-keeping channel. The saved enquiry is the record. If a price or lead time is agreed in WhatsApp, it must be written back into the quote record or it has no effect.

**[CONFIRMED] Contact hours:** Monday–Saturday, 9am–5pm. **[PROPOSED]** State these beside every WhatsApp and contact action.

**[BLOCKED: owner]** What happens outside contact hours: auto-reply, next-working-day response, or an urgent phone number.

---

## §3 Catalogue and product guidance

### CAT01 Product catalogue

**[PROPOSED]** Staff can create, edit, preview, publish, and archive products. Customers can search by name and filter by approved categories, surface, interior or exterior use, finish, and price where public pricing exists. Draft products must not appear publicly.

Each product record needs a name, unique slug, description, category, supported surfaces, intended use, preparation instructions, recommended coats, coverage and its measurement basis, drying and recoating guidance, images, and applicable technical or safety documents. Publish only business-approved specifications; missing information must not be generated by AI.

**[CONFIRMED]** Approved product specifications, coverage data, and colour names and codes exist and will be supplied by the owner for catalogue seeding.

**[CONFIRMED] Painting services.** A distinct service is offered alongside paint supply. **[PROPOSED]** Describe it on the homepage and a service page without inventing credentials.

### CAT02 Sellable variants

**[PROPOSED]** Represent each sellable combination of product, finish where applicable, colour or tint option, and pack size with a unique SKU. Record price state, availability, minimum quantity if applicable, and lead time.

**[CONFIRMED] Price state.** All variants show **Quote only** at launch. No public prices.

**[CONFIRMED] Availability.** All variants show **Available, made to order**. No quantity is displayed.

**[CONFIRMED] Lead time.** 1–3 days. **[PROPOSED]** State on every product page and confirm in every quote.

**[CONFIRMED] Offline payment recording.** Recorded in admin, not spreadsheet.

**Acceptance:** selecting a variant updates its price state, size, availability, and lead time. Invalid combinations cannot be ordered. Changing a product later does not alter the details saved on an existing quote.

**[PROPOSED]** Variants are generated from approved option lists (finish, colour, pack) and are not entered individually by hand.

### COL01 Colour library

**[PROPOSED]** Display approved colour names, codes, and digital swatches linked to compatible products. Explain that screens and lighting affect appearance. Do not suggest that a digital preview guarantees the supplied colour.

**[CONFIRMED] Colour confirmation route: none.** The business does not offer a formal colour confirmation service. The revised COL01 replaces v1.0's "advise physical sample confirmation" with this disclosure, shown on every colour page and every product page with a colour selection:

> Colours shown on screen may look different from the paint you receive, because screens and lighting vary. We do not offer a formal colour confirmation service. Once you confirm your colour and pay, the colour cannot be changed and cannot be refunded. If you are unsure, please contact us before ordering.

**[PENDING: legal review]** Whether this disclosure is sufficient to enforce the no-refund-on-colour rule.

### GUIDE01 Product selector

**[PROPOSED] GUIDE01a, launch:** a static "which paint for which surface" guide generated from the same approved fields as CAT01, linking to products, with a contact prompt when no supported product fits.

**[PROPOSED] GUIDE01b, deferred:** interactive rules-based selector. **Trigger:** staff report, from the enquiry log or later records, that a large share of enquiries are "which product" questions. **[BLOCKED: owner]** Confirm catalogue size, because with a very small catalogue GUIDE01a may suffice permanently.

### CALC01 Quantity calculator

**[PROPOSED]** Accept direct paintable area or wall dimensions, optional opening deductions, and coat count. State that wall area differs from floor area. Calculate litres as paintable area multiplied by coats, divided by product coverage per litre per coat, with a disclosed configurable allowance. If a product states coverage for a complete system, use that basis instead of multiplying coats again.

Recommend whole packs whose total capacity meets the calculated need; show both estimated litres and supplied litres. Label results as estimates affected by texture, preparation, and application. Missing coverage data must produce a contact prompt, not a fabricated result.

**[PROPOSED]** The calculator runs on the product page and as a step after the guide, and uses the selected product. Coats default to the product's approved recommendation and are editable. Units are stated on the input. The result reads "about X litres, so Y pack(s)" with estimated and supplied litres, applies the suggested pack to the selector, and displays the product's approved preparation and coats. If coverage data is missing, the inputs carry into the quote request or WhatsApp prefill.

**[CONFIRMED]** Approved coverage data will be supplied by the owner. Calculator runs only for products with approved coverage.

**Acceptance example:** with 100 square metres, 2 coats, coverage of 10 square metres per litre per coat, and zero allowance, the estimate is 20 litres. These are test values, not specifications for ORACHIN Paints.

---

## §4 Retail orders, payments, and delivery

### ORD01 Cart and routing

**[CONFIRMED]** Checkout is removed from launch. The cart is a **quote request cart** only.

**[PROPOSED]** The server validates current variants, quantities, and delivery eligibility. Show item list and requested quantities. No prices, no payment, no delivery charge at this stage.

**[PROPOSED]** If any line requires custom pricing, made-to-order lead time confirmation, or delivery beyond a confirmed area, the whole cart routes to quotation and explains why. Preserve the requested items and destination in the enquiry.

**[CONFIRMED] Email requirement.** Quote requests require a phone number or an email address. Orders (Phase 2) will require email.

### DEL01 Delivery rules

**[CONFIRMED] Third-party courier.** Delivery is quoted per job, not calculated at checkout. No zone table is needed on the website for launch.

**[PROPOSED]** The enquiry form collects the delivery address or at least the area. Staff quote delivery as part of the quotation, using the third-party courier's rate. The quote states the delivery charge and the estimated window.

**[CONFIRMED]** Never interpret a missing rate as free delivery.

**[BLOCKED: owner]** Before any delivery promise is published: which courier; Lagos coverage; other-state coverage; how proof of delivery is obtained; failed-delivery and redelivery rule; whether pickup from 110b Old Ewu Road is offered.

### PAY01 Payment and stock integrity

**[CONFIRMED] Deferred to Phase 2.** Not in launch scope.

**[PROPOSED] Phase 2 requirements when checkout is enabled:** reserve stock only for quantity-mode items; reserve at payment initiation, never at add-to-cart; check-and-decrement as one conditional update inside a database transaction; evaluate expiry at read time and in a scheduled sweep; cap reserved quantity per session and per IP; `needs_resolution` state with owner when payment succeeds after expiry.

**[CONFIRMED] Phase 2 provider.** Paystack hosted checkout. **[VERIFY]** signature scheme, session length, email requirement, refund API, return behaviour.

### ORD02 Confirmation and fulfilment

**[CONFIRMED]** The confirmation is an **enquiry or quote reference**, not an order. Show on screen and send transactional email to orachinpaints@gmail.com and the customer.

**[PROPOSED]** The confirmation page and email show reference, requested items, colour name and code where selected, finish, pack, delivery area, the returns summary, and the problem route.

**[PROPOSED] Quote states:** draft, issued, accepted, expired, cancelled. **[PROPOSED] Payment records** (offline): pending, paid, partially paid, refunded. **[PROPOSED] Fulfilment states:** deferred to Phase 2.

**[CONFIRMED] Offline payment record.** Staff with the appropriate role may record a deposit or full payment against an accepted quote: amount, method, reference, date, who confirmed, and a reason. Offline entries are visually distinct from provider-verified payments, written to the audit log in the same transaction, and require an approver. The order carries a "release approved by" field, which production must see before work begins.

**[BLOCKED: owner]** Whether any credit terms are offered, and what invoice or tax document is issued.

---

## §5 Commercial sales and staff operations

### B2B01 Commercial enquiry

**[CONFIRMED]** Collect contact and company details, project location, preferred products, estimated quantities, required dates, and staged-delivery needs. Permit a request without exact quantities. Accept limited PDF, spreadsheet, and image attachments with published size limits. Keep uploads private, validate file types, and reject executable or unsafe content.

**[PROPOSED] Required fields:** name; phone or email; project location; short description. **Optional:** company, preferred products, estimated quantities, required dates, staged-delivery needs, site contact name and phone, preferred delivery windows. The form has two steps, and the enquiry is saved after step one, so the customer holds a reference even if an attachment fails. Attachment failure never blocks submission and offers WhatsApp or email as a fallback. Size limits are shown before file selection, with a status per file, including "awaiting checks" where applicable.

**[CONFIRMED] Acknowledgement.** States the first-response window (same day, Monday–Saturday, 9am–5pm), an urgent-request route via WhatsApp or phone (08035855944 or 08108196504), and promises no pricing or availability. Includes a WhatsApp handoff link with the enquiry reference.

**[CONFIRMED] Named owner and follow-up.** Phebian Nwokeji is first responder. Juliet Nwabueze is deputy. **[PROPOSED]** Assign an owner and a follow-up date to every enquiry.

**[PROPOSED] Stages:** new, reviewing, awaiting customer, quoted, won, lost, with reasons where useful.

### B2B02 Quotation workflow

**[PROPOSED] Phase 1 (minimal quote record):** staff prepare a numbered, versioned quote with line items, delivery, lead time, validity, and payment terms, issued as a PDF or secure page. Acceptance is recorded by staff, with the customer's written confirmation attached. The approver is recorded on each quote.

**[CONFIRMED] Quote validity:** 14 days from issue. After expiry, the quote must be revalidated by staff before it can be accepted. Provisional, may be changed by the owner.

**[CONFIRMED] Deposit:** 60% of the quoted total, with the balance payable on delivery or completion. Recorded in admin. Provisional, may be changed by the owner.

**[CONFIRMED] Discount ceiling:** 3% without owner approval. Anything above 3% requires the owner's authorisation. Recorded on each quote.

**[PROPOSED] Phase 2 (online acceptance):** acceptance by secure link, recorded with timestamp and version. The accept function checks "this version is current and unexpired" inside the same transaction that creates the order. A unique constraint ensures a quote converts to one order only. Accepted versions are immutable (no update or delete grants). Payment amounts come from the accepted version's stored totals.

**[BLOCKED: owner, with legal input]** Who may accept for a company, and whether a link click suffices as evidence.

**[CONFIRMED] Full payment or deposit.** Commercial orders may be paid by deposit (60%) or in full. Recorded in admin (B2B03).

### B2B03 Offline payment record

**[CONFIRMED] In launch scope.** Recorded in admin, not spreadsheet.

**[PROPOSED]** Staff with the appropriate role may record an offline or staged payment against an accepted quote: amount, method, reference, date, who confirmed, and a reason. Offline entries are visually distinct from provider-verified payments, written to the audit log in the same transaction, and require an approver. The order carries a "release approved by" field, which production must see before dispatch.

**[CONFIRMED] Owner approves refunds.** **[PROPOSED]** A named deputy approves when the owner is unavailable. **[BLOCKED: owner]** Who the deputy is.

Automated deposits, instalments, and credit limits remain out of scope.

### ADM01 Admin dashboard

**[PROPOSED] Phase 1:** products and variants, price state and availability, colours, enquiry assignment, quote preparation, offline payment record, audit log, and a failed-notifications list.

**[PROPOSED] Phase 2:** order search, payment visibility, delivery updates, payment-exceptions queue (with age indicator and notification to the owner), and CSV export, limited to the Owner role.

**Staff permissions:**

- **Owner or administrator:** staff access, configuration, product publishing, pricing, quote approval above 3% discount, refund approval, authorised adjustments.
- **Sales:** customer enquiries, quotations within approved pricing rules (up to 3% discount without approval), order follow-up.
- **Fulfilment (Phase 2):** only the order and contact details required to prepare and deliver purchases; no permission to change prices or payment status.

**[PROPOSED]** Fulfilment reads from a restricted view containing only what is needed to prepare and deliver. Administrative accounts require multi-factor authentication, enforced server-side **[VERIFY]**. Audit events are append-only and written in the same transaction as the change they record.

### Content and communications

**[PROPOSED]** Provide editable company information, delivery guidance, product documents, and genuine project case studies. Send enquiry acknowledgements, quote notices, and (Phase 2) order confirmations from approved templates. Keep marketing consent distinct from messages needed to fulfil an enquiry or quote.

**[CONFIRMED]** Automated WhatsApp messaging is not in scope. WhatsApp is a manual channel.

### COM01 References and channel consistency

**[PROPOSED]** One reference format and one vocabulary list (enquiry, quote, order) used on the site, in emails, and in WhatsApp. WhatsApp prefill contains product, colour name and code, pack, and an existing enquiry reference where one exists, and contains no name or phone. Each template states what happens next and when.

**[CONFIRMED]** Phebian Nwokeji and Juliet Nwabueze monitor WhatsApp during contact hours (Monday–Saturday, 9am–5pm). **[PROPOSED]** State who monitors WhatsApp and during what hours beside the button.

---

## §6 Architecture and core data

### Recommended implementation

**[PROPOSED]** Use Next.js and TypeScript for public pages, server-side business logic, and the admin interface. Use Tailwind CSS for a consistent responsive design. Use Supabase Postgres for structured data, Supabase Auth for staff authentication, and Supabase Storage for images and private attachments. Deploy the application on Vercel. **Paystack integration is deferred to Phase 2.**

Choose a transactional email provider during setup. Keep delivery pricing rules in the application initially; add courier integrations only when an actual partner and supported service are confirmed. Antigravity is the development environment, while hosting and connected services run the finished application.

Use supported stable package versions at implementation, record them in the lockfile, and verify current provider documentation. Avoid a separate backend service until requirements justify it.

### Core records

**[PROPOSED] Launch schema:**

- Product, category, colour, variant: descriptive information and sellable combinations with stable identifiers.
- Enquiry and attachment: customer requirements, assignment, stage, private files, and follow-up.
- Quote, quote version, quote item and acceptance: proposed terms and an immutable accepted version.
- Offline payment: amount, method, reference, who confirmed, approver, linked to quote or order.
- Customer and address: contact details and delivery destinations; guest customers need no login.
- Notification and audit event: queued messages, retry status, staff actions, and relevant timestamps.

**[PROPOSED] Phase 2 schema (deferred):** inventory balance and reservation; cart and cart item; order and order item; payment and payment event; delivery zone and shipment.

### Data and integration rules

**[PROPOSED]** Use foreign keys, unique references, and database transactions for operations that must succeed together. Store timestamps in UTC and display business-facing dates in Africa/Lagos time. Store monetary amounts as integers in the smallest currency unit. Store measured quantities with explicit units and validated precision. Public product images may be public; customer attachments, quote documents, and private enquiry data require access-controlled storage. Keep API secrets on the server. Test and production environments need isolated data. Use migration files, version control, preview deployments, and a documented rollback and backup recovery procedure.

---

## §7 Quality requirements and measurement

### Security and privacy

**[PROPOSED] SEC01 Guest access to private records.** Anonymous roles have no direct access to private tables (deny by default). Guest access to enquiries, quotes, and attachments goes only through server handlers that look up a long random token, store only its hash, enforce expiry, and support revocation. Enquiry and quote references are identifiers, not credentials. Token pages set `noindex` and a strict referrer policy, and tokens are excluded from logs and analytics. "Send me my link again" verifies against the stored email or phone and reveals nothing about whether a record exists. Downloads use short-lived signed URLs issued after the token check. The privileged server key is confined to a small set of reviewed modules.

**[PROPOSED] SEC02 Uploads.** The team records one explicit choice: (a) automated malware scanning, or (b) quarantine. Quarantine means a private bucket, status `unscanned`, a type allowlist that rejects macro-enabled formats, content-based type checks, size caps, forced download, and a warning to staff before opening. Orphaned files are removed after a set period. Uploaded files are never served inline from the application's origin. **Conditional:** if an automated agent ever processes enquiries, uploaded content is treated as data and never as instructions.

**[CONFIRMED] Privacy retention.** Personal data collected through enquiries, quotes, and orders is retained for 24 months from the last contact, after which it is deleted or anonymised. **[PENDING: legal review]** The privacy notice is pending qualified legal review, and the retention period may change once that review is complete.

**[PROPOSED]** Collect only necessary personal data. Enforce row-level access policies for staff records and storage policies for private files. Rate-limit public submissions. Do not store card details or manufacturing recipes.

### Accessibility and performance

**[PROPOSED]** Target WCAG 2.2 AA for public and admin journeys, with keyboard access, labelled inputs, sufficient contrast, visible focus, useful alt text, and errors associated with fields. Colour swatches must also have readable names and codes.

Proposed performance targets: LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile where field data is available. Use representative mobile tests before launch and real-user monitoring afterward. Optimise images and defer nonessential scripts; do not autoplay large video on the homepage.

### Search and operational reliability

**[PROPOSED]** Provide unique product titles and descriptions, readable URLs, sitemap, canonical URLs, and structured data that matches visible facts. Keep admin, quote, and private pages out of search indexing. Handle missing products with helpful navigation and suitable redirect rules.

Monitor failed notifications and application failures. Set up database backups and test restoration. Save an enquiry before sending notifications. Staff must be able to recover from an email outage without losing the enquiry.

**[PROPOSED] JOB01 Scheduled jobs.** The system requires three idempotent, logged jobs that alert a named owner on failure: notification retry, orphan-file cleanup, and quote expiry. The runner is chosen after checking that the selected hosting and database plans support the needed frequency and duration **[VERIFY]**. The hosting decision is made against this capability list, not price alone.

### Measures of success

**[PROPOSED]**

- Product-to-quote rate: sessions adding a product to a quote request divided by product-view sessions.
- Quote completion: submitted quote forms divided by quote forms started.
- Quote win rate: accepted or won quotations divided by issued quotations for the same cohort.
- Median time from enquiry submission to first staff response.
- WhatsApp handoff rate: quote request confirmations where the WhatsApp link is clicked, divided by quote request confirmations.
- Painting service enquiries: enquiries mentioning painting services divided by total enquiries.

Capture product views, guide completion, calculator use, quote submission, and WhatsApp clicks. Exclude staff and test activity. Treat contact clicks separately from sales. Set commercial targets after an initial 30-day baseline; no revenue uplift is assumed.

---

## §8 Delivery plan and release gates

### Phase 0 Business setup

**[CONFIRMED]** Confirm the brand (ORACHIN Paints), catalogue, claims, prices (quote-only), ordering policy (quotation-only), delivery coverage, payment account, and customer policies. Collect packaging photos, product specifications, colour references, and contact information. Approve the navigation and one representative product page before filling the catalogue.

**[PROPOSED] OPS00 responsibility table:** a named person for product information, prices and discounts, stock status (production capacity), production lead times, quotations, delivery promises, payment reconciliation and refunds, damage and shortages, and enquiry follow-up, each with a record and an exception procedure.

| Area | Named person | Record they maintain | Exception procedure |
|---|---|---|---|
| Product information and approved specs | **[BLOCKED: owner]** | Product records, documents | Correct or unpublish a wrong spec |
| List prices and discounts | Owner | Price list, approver on quotes | Price change between quote and acceptance |
| Production capacity and lead times | **[BLOCKED: owner]** | Lead time per made-to-order item | Slippage notice to customer |
| Quotations | Phebian Nwokeji | Quote versions, acceptance | Expired or revised quote |
| Delivery cost and promises | **[BLOCKED: owner]** | Courier rate, dispatch log, proof | Failed delivery, dispute |
| Payment reconciliation and refunds | Owner (deputy: **[BLOCKED: owner]**) | Offline payment entries vs quotes | Late payment on expired quote |
| Damage and shortages | **[BLOCKED: owner]** | Incident notes on the quote | Replace versus refund |
| Enquiry follow-up | Phebian Nwokeji (deputy: Juliet Nwabueze) | Enquiry list, follow-up dates | Missed response window |

**[PROPOSED] Baseline enquiry log:** log every enquiry for a few weeks (source, product, quantity, residential or commercial, outcome, and repeated questions). Let that data set the catalogue, form fields, and the selector trigger.

### Phase 1 Catalogue and enquiries (Launch)

**[CONFIRMED]** Build public pages, product variants, colours, static guide, calculator, commercial enquiry, WhatsApp handoff, minimal quote record, offline payment record, and admin content management. Add private uploads and enquiry notifications. This phase launches as a quotation-only website.

### Phase 2 Transactional launch (Deferred)

**[PROPOSED]** Add the validated cart, delivery routing, stock reservations, Paystack, online quote acceptance, order administration, and fulfilment messages. Enable checkout only for eligible products and destinations.

### Phase 3 Repeat business and enhancements

**[PROPOSED]** Prioritise accounts and reordering, approved trade prices, samples, dealer applications, staged-payment support, and integrations using observed demand. Treat visualisation and AI support as separately scoped experiments with usage costs and quality checks.

### Checkout enablement gate

**[PROPOSED]** All conditions recorded before CHK01 is switched on:

- [ ] Named stock owner and a trial count of the checkout SKUs
- [ ] Signed prices and tax presentation
- [ ] Delivery zone table, delivery owner, and proof of delivery
- [ ] Paystack account live and live payment verified
- [ ] Named payment-exceptions owner and deputy with a written refund and alternative-supply procedure
- [ ] Published returns and damage rule
- [ ] Chosen reservation expiry
- [ ] Staffed support contacts
- [ ] Checkout trigger confirmed by owner **[PENDING: owner]**

### Mandatory acceptance scenarios (Phase 1)

- A homeowner can find a supported product, estimate quantity, choose a valid variant, and submit a quote request on a phone.
- Missing coverage or unsupported guide answers lead to useful guidance without invented specifications.
- An enquiry survives notification failure and can be found by staff.
- One customer cannot access another customer's attachment, quote, or enquiry.
- Keyboard navigation, mobile layouts, missing-image states, form errors, and slow-network behaviour are usable.
- WhatsApp handoff carries the enquiry reference and the selected product, colour, and pack, with no personal data in the URL.
- A quote cannot be accepted after expiry.

### Additional acceptance scenarios (Phase 2, deferred)

- Parallel purchase of the final unit tested against a real Postgres database.
- Replayed, unsigned, early, and missing webhooks.
- Amount-mismatch handling.
- Simultaneous quote accept and revise.
- Cross-customer access attempts including token enumeration.
- Role-by-operation permission matrix.
- Disguised and oversize uploads.
- Forced job failure producing an alert.

### Launch gate

**[PROPOSED]** Require approved product content, passing acceptance scenarios, confirmed support contacts, monitored notifications, access-control checks, and a restore test. The owner authorises production release after reviewing the working customer journeys.

### Human review required before launch

**[PROPOSED]** Payment state machine and transition table (Phase 2); every use of the privileged key; storage and access policies; migration set. Code that runs is not treated as verified.

---

## §9 Decisions

### Blocking publication (quotation-only launch)

- Named first responder and deputy — **[CONFIRMED]** Phebian Nwokeji, Juliet Nwabueze.
- Working days and hours — **[CONFIRMED]** Monday–Saturday, 9am–5pm.
- Contact details — **[CONFIRMED]** 08035855944, 08108196504, orachinpaints@gmail.com.
- Returns and damage rules — **[CONFIRMED]** Option A; **[PENDING: owner — damage reporting window]**, provisional 48 hours.
- Colour confirmation route — **[CONFIRMED]** Option E, disclosure.
- Painting services — **[CONFIRMED]** Offered.
- Privacy notice and retention — **[CONFIRMED]** 24 months; **[PENDING: legal review]**.
- Approved product content, coverage data, colour names and codes — **[BLOCKED: owner]** for catalogue seeding.
- Brand, domain, genuine project images — **[CONFIRMED]** ORACHIN Paints, 110b Old Ewu Road, Aviation Estate, Mafoluku, Lagos; **[BLOCKED: owner]** domain and project images.
- What happens outside contact hours — **[BLOCKED: owner]**.

### Blocking quotation features

- Deposit percentage — **[CONFIRMED]** 60%, provisional.
- Discount ceiling — **[CONFIRMED]** 3%, owner approval above.
- Quote validity — **[CONFIRMED]** 14 days, provisional.
- Quote acceptance rule — **[BLOCKED: owner, with legal input]** who may accept for a company, and whether a link click suffices.
- Damage reporting window — **[PENDING: owner]**, provisional 48 hours.
- Payment terms, deposits, credit — **[CONFIRMED]** full payment or 60% deposit; credit position **[BLOCKED: owner]**.
- Invoice documents — **[BLOCKED: owner]**.
- Bulk threshold — **[BLOCKED: owner]**.

### Blocking checkout (Phase 2)

- Ordering policy and which variants become checkout-eligible — **[BLOCKED: owner]**.
- Stock method, owner, and offline-sale handling — **[BLOCKED: owner]**.
- How colours are produced — **[BLOCKED: owner]**.
- Prices and tax presentation — **[BLOCKED: owner]**.
- Delivery zones, fees, delivery owner, and proof of delivery — **[BLOCKED: owner]**.
- Reservation expiry — **[BLOCKED: owner]**.
- Payment-exceptions owner and deputy — **[BLOCKED: owner]**.
- Paystack account readiness — **[VERIFY]**.
- Checkout trigger — **[PENDING: owner]**.

### Blocking deployment

- Hosting and database budget against the JOB01 capability list — **[BLOCKED: owner]**.
- Email provider — **[PROPOSED]**.
- Staff roles — **[PROPOSED]**.
- Analytics choice — **[PROPOSED]**.
- Alert owner — **[BLOCKED: owner]**.

### Provider verifications still needed

**[VERIFY]** Supabase anonymous-role access behaviour; Supabase MFA enforcement; Supabase Storage signed URL limits; Vercel function duration and body size limits; Vercel scheduled job capability; database backup retention and point-in-time recovery; Antigravity capabilities and constraints.

---

## Appendix A: Deferred checkout work and applicable findings

The following findings from the review cycle apply to Phase 2 checkout work. They are recorded here so they are not lost.

| Finding | Applies to Phase 2 |
|---|---|
| SKEP-01 Checkout justification | Trigger condition for CHK01 |
| SKEP-03 Reservations assume stock data | ST01 quantity mode |
| OPS-01 No stock source of truth | Inventory schema |
| OPS-02 Ready stock vs. made-to-order | Variant stock mode |
| OPS-04 Delivery owner and proof | DEL01 checkout portions |
| OPS-05 Reconciliation and refund ownership | PAY02, exceptions queue |
| OPS-06 Commercial payment and delivery model | ORD02, B2B03 Phase 2 |
| ENG-01 Reservation lifecycle | PAY01 Phase 2 |
| ENG-02 Transition table, verification, reconciliation | PAY02 |
| ENG-04 Guest access vs. row-level policy | SEC01 for orders |
| ENG-05 Uploads | SEC02 unchanged |
| ENG-06 Variant vs. stock item | ST01 |
| ENG-07 Permissions, audit, overrides | ADM01 Phase 2 |
| ENG-08 Jobs, hosting limits, recovery | JOB01 Phase 2 expansion |
| CUST-03 Price, delivery, lead time | UX01 checkout portions |
| CUST-04 Whole-cart routing | ORD01 Phase 2 |
| DESIGN-03 Fork after address entry | UX01 checkout portions |
| DESIGN-07 Payment states and guest return | UX02 Phase 2 |

---

## Appendix B: Rejected criticisms

The following criticisms were considered and rejected during the review cycle. They are recorded so they are not re-raised.

1. **"Checkout is unjustified at launch" (strong form of SKEP-01).** Rejected as an assertion. No sales, enquiry, or channel data supports either keeping or removing checkout. The owner has chosen quotation-only launch; checkout is deferred, not condemned.

2. **"The product selector is speculative" as a settled claim (SKEP-06).** Rejected as stated. Whether it is speculative depends on catalogue size and enquiry mix, both unknown. The static guide launches; the interactive selector is deferred with a trigger.

3. **"Email acceptance" for quotes (SKEP-05).** Rejected in favor of the minimal quote record. Email acceptance loses the record and conflicts with audit requirements.

4. **"Thousands of variants" as evidence of a modelling defect (ENG-06).** Rejected as an illustration. The underlying separation of sellable variant from stock item is deferred with checkout.

5. **Dropping email for orders (part of CUST-04).** Rejected unless the provider confirms it is not required. This is a **[VERIFY]** item for Phase 2.

6. **The Customer review's specific behavioural predictions.** Rejected as evidence. They are useful hypotheses for the Phase 0 log and later interviews, not grounds for requirements.

---

## Appendix C: Status summary

| Section | Status |
|---|---|
| §1 Product direction | Revised: quotation-only; painting services confirmed |
| §2 Navigation and journey | Revised: WhatsApp handoff; contact details; navigation reduced |
| §3 CAT01 | Revised: approved data confirmed |
| §3 CAT02 | Revised: quote-only price state; made-to-order availability; 1–3 day lead time |
| §3 COL01 | Revised: Option E disclosure |
| §3 GUIDE01 | Split: static guide launch; interactive deferred |
| §3 CALC01 | Revised: product-page step; approved coverage |
| §4 ORD01 | Revised: quote request cart only |
| §4 DEL01 | Revised: third-party courier; quoted per job |
| §4 PAY01 | Deferred to Phase 2 |
| §4 ORD02 | Revised: enquiry/quote reference; offline payment record |
| §5 B2B01 | Revised: two-step form; acknowledgement with response window and WhatsApp |
| §5 B2B02 | Revised: minimal quote record; 14-day validity; 60% deposit; 3% discount ceiling |
| §5 B2B03 | Confirmed in launch scope: admin recording |
| §5 ADM01 | Revised: Phase 1 and Phase 2 split |
| §5 Staff permissions | Revised: discount ceiling 3% |
| §5 Content and communications | Revised: WhatsApp manual |
| §6 COM01 | New: reference and vocabulary consistency |
| §6 Architecture | Revised: Paystack deferred |
| §6 Core records | Revised: launch schema only |
| §7 SEC01 | New: guest access |
| §7 SEC02 | New: uploads |
| §7 Privacy | Confirmed: 24 months, pending legal review |
| §7 JOB01 | New: three jobs |
| §7 Measures | Revised: no paid conversion; WhatsApp handoff rate added |
| §8 Phases | Revised: Phase 1 quotation-only; Phase 2 deferred |
| §8 Checkout gate | New |
| §8 Acceptance scenarios | Revised: Phase 1 and Phase 2 separated |
| §9 Decisions | Rewritten as decision register |

---

## What still needs to be done

**Before publication:**

1. Provide the domain name.
2. Provide genuine project images, or confirm Projects stays hidden.
3. Provide approved product list, coverage data, colour names and codes.
4. Confirm what happens outside contact hours.
5. Confirm the damage reporting window (provisional 48 hours).
6. Commission the privacy notice legal review.

**Before quotes are issued:**

1. Confirm deposit 60% and quote validity 14 days are final or provisional.
2. Confirm discount ceiling 3% is final.
3. Confirm who may accept a quote for a company.
4. Confirm the invoice or receipt document issued.
5. Confirm the bulk threshold.
6. Confirm the credit position.

**Before checkout (Phase 2):**

1. All checkout enablement gate items.
2. All provider verifications.
3. All Phase 2 findings in Appendix A.

**Before deployment:**

1. Hosting and database budget.
2. Email provider.
3. Analytics choice.
4. Alert owner.
5. Staff roles.
