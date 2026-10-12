---
trigger: model_decision
description: Use when building or changing guest links, token pages, link recovery, file uploads, downloads, storage buckets or any page a customer reaches without an account.
---


# guest-access-and-uploads.md
Job: let guests reach only their own records and files, and accept uploads safely. General protections are in security.md.

- Treat the reference as a label, not a password. Guest access uses a token of at least 128 bits from a secure random source. Store only its hash. Compare in constant time. Why: a guessable reference would expose every customer's record.
- Issue the token when the enquiry is created. Show the private link on the confirmation screen and email it only if an address was given. Use tokens for guest views of enquiries, quotes and attachments. Why: one access path is easier to secure than several.
- Make tokens expire and make them revocable. Treat the expiry time, and whether a new link revokes older ones, as agent defaults. Why: a leaked link must stop working.
- Keep existing valid tokens working. Why: customers already hold their links.
- On token pages, send a strict no-referrer policy and no-store caching. Why: tokens leak through referrers and caches.
- For email recovery, send only to the stored address. Give the same reply whether or not a record exists. Why: a different reply reveals who is a customer.
- Offer no self-service recovery by phone until G7 is cleared. Show a neutral support route. Staff must not give out private links because someone knows a phone number or reference. Changing a contact address needs verified identity. Why: a phone number is not proof of possession.
- Keep public product images and private customer files in separate buckets. Why: a mistake in one bucket's policy must not expose the other.
- Issue download links only after the token check, or after a role check for staff. Make them short-lived and treat the lifetime as an agent default. Why: a signed URL works for anyone who holds it, and one path is easier to audit.
- Keep uploads switched off until the scanning-or-quarantine choice is recorded (G6). If it is quarantine, use a private bucket, mark files "unscanned" until cleared, and warn staff before they open one. Why: uploaded files can carry malware.
- Allow only PDF, spreadsheet and image files. Check the file contents, not the extension or declared type. Reject executable and macro-enabled files. Set the size cap and file count as agent defaults and show them on the form. Why: extensions and headers are controlled by the sender.
- Serve every upload as a forced download with the nosniff header. Never show one inline from the app's own origin. Why: inline files can run scripts on your site.
- Store files under generated keys. Keep the original filename only as database data. Never put it in a path, URL, WhatsApp link or log. Why: filenames often hold names and project details.
- Required tests: one customer cannot read another's enquiry, quote or file. Tokens expire and can be revoked. Recovery replies are identical for known and unknown records. Disguised, executable, macro and oversize files are rejected. Anonymous file access is denied. No private filename appears in a URL. Why: these prove the rules above hold.