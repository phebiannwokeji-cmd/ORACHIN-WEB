---
trigger: model_decision
description: Use when building or changing enquiry forms, the quote request cart, confirmation pages, emails, notifications, WhatsApp links or any wording about response hours and lead time.
---


# enquiry-and-communications.md
Job: what a customer submits, what they are told back and how the conversation moves to WhatsApp. It follows one path: submit, reference, confirmation, handoff.

- Accept a valid phone number, a valid email, or both. Check phone numbers in Nigerian local and international formats. Never require email. Never add SMS. Why: the owner decided it, and phone-only customers must still be served.
- Save the enquiry first. Send notifications after. If a notification fails, keep the enquiry and list the failure in the admin failed-notifications list. Why: the saved enquiry is the business record.
- Always show the reference on screen. Always email staff. Email the customer only if they gave an address. Give phone-only customers the on-screen reference and an optional manual WhatsApp link. Why: every customer ends with a reference, whatever their channel.
- Treat every cart as a quote request. Show the items and quantities with no prices, payment or delivery charge, and say prices, lead time and delivery are confirmed in the quote. Collect the delivery address, or at least the area. Why: nothing is priced or promised until staff quote it.
- Build the commercial form in two steps. Step one saves the enquiry. It needs a name, a phone or email, a project location and a short description. Optional fields are company, preferred products, estimated quantities, required dates, staged-delivery needs, site contact name and phone, and delivery windows. Accept a request with no exact quantities. Step two takes optional attachments. Show size limits before file selection and a status for each file, including "awaiting checks". If an attachment fails, never block the enquiry, and offer WhatsApp or email instead. Why: a customer must not lose a long form to one failed file.
- Make a repeated submission return the existing reference, using the idempotency key from data-integrity.md. Why: slow networks cause double taps.
- Validate every product combination. Allow advice requests with fields marked "unknown". Allow service-only requests with a service description. Never create placeholder SKUs or colours. Why: customers often do not know the finish, and fake variants corrupt the catalogue.
- Build the WhatsApp link from the known product, colour name and code, pack and an existing enquiry reference only. Show attachments as a count, such as "2 attachments". Never include a name, phone, address, filename, token or download link. Send no automated WhatsApp messages. Why: URLs get logged and shared, and WhatsApp is a conversation channel.
- Treat a WhatsApp click as a contact event, not an order or an acceptance. Why: a click proves nothing about intent to buy.
- Give anything agreed on WhatsApp no effect until staff write it into the quote. Why: the structured record is the only authority.
- Use one reference format and one set of words (enquiry, quote, order) on the site, in email and on WhatsApp. "Order" is a Phase 2 word. Why: mixed words cause disputes about what was promised.
- Keep three timings apart everywhere. Response hours are Monday to Saturday, 9am to 5pm, shown beside every contact action. Production lead time is 1 to 3 days, to be confirmed in the quote, and is never a delivery guarantee. Courier transit is separate. A "same day" promise may describe the first response only. Do not invent the lead-time start event, working-day basis or cutoff (G8). Why: blending them creates promises the business cannot keep.
- Make the acknowledgement state the first-response window and the urgent route by WhatsApp or phone. Make it promise no pricing or availability. Include the WhatsApp link with the reference. Why: customers need to know what happens next and must not mistake it for an offer.
- Show on the confirmation page and in email: the reference, the items, colour name and code, finish, pack, delivery area, what happens next and when, and how to report a problem. Include a returns summary only from approved policy text (G4). If none is approved, leave it out. Why: never state a policy that does not exist.
- Send acknowledgements and quote notices from approved templates. Why: consistent wording prevents accidental promises.
- Assign every enquiry to the configured first responder by default, with a follow-up date. Use the stages new, reviewing, awaiting customer, quoted, won and lost. Why: missed follow-up is the main cost of an enquiry business.
- Record whether an enquiry is residential or commercial and whether it mentions painting services. Why: the success measures cannot be computed without them.
- Keep marketing consent separate from messages needed to handle an enquiry or quote. Why: consent must be specific.
- Required tests: phone-only and email-only submissions. A notification failure leaves a findable enquiry. A repeat submission creates no duplicate. The WhatsApp link holds no personal data or filenames. A failed attachment keeps the form. The acknowledgement promises no price. The mobile journey from product to enquiry works. Why: these prove the rules above hold.