---
trigger: always_on
---


# testing.md
Job: what must be tested and what counts as proof. Required tests for each area live in that area's file.

- Test access control, permissions, transactions, constraints and migrations on a real Postgres database built from the repo's migrations. Do not use a mocked client. Why: mocks cannot fail the way database policies and constraints fail.
- Test simultaneous actions by running them at the same time. Assert that exactly one succeeds. Why: races do not appear in tests that run one step at a time.
- Test each limit just below, at and just above its value. Also test zero, empty and maximum. Why: most calculation and rounding bugs sit at boundaries.
- Give every permission and every closed gate a test that proves the forbidden action fails. Why: a denial that is not tested may not exist.
- Ship tests with each feature that launches, in the same change set. Write none for deferred features. Why: untested launch code is unverified, and tests for deferred work are dead weight.
- Never delete, skip or weaken a test to make it pass. Fix the cause or report the failure. Why: a weakened test hides the bug it was written to catch.
- Name each test after the requirement ID or gate ID it covers. Why: the owner can trace tests back to the PRD.
- Treat a test that passes against a mock as proof of the mock only. Check live email, storage and schedulers by hand and label them as manual checks. Why: "works with a mock" does not mean "works live".