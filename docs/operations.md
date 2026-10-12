# Operations

## Case-study admin activation

1. Create an isolated Supabase project for the applicable environment and apply both files in `supabase/migrations` in order.
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`. Do not expose the service-role key to browser code.
3. Create the initial staff account in Supabase Auth, enroll TOTP through `/staff/sign-in`, then record its UUID with an active `owner` or `administrator` role in `public.staff_roles`. Role grants are intentionally not exposed through the application.
4. Run database integration checks against an isolated test project: anonymous reads/writes denied; `aal1` staff denied; inactive staff denied; valid `aal2` staff can create/update/status-change; every write has exactly one audit event; failed writes leave no audit event; direct audit updates/deletes are denied; duplicate slugs are rejected.
5. Keep G9 configured. Do not set it to cleared or expose `/projects` until the owner records approved genuine project content and imagery. Before enabling the public reader, verify the service-role key remains in server-only modules and test the gate on the deployed environment.

## Rollback

Revert the application release to remove access to the staff routes. Database rollback must be planned against the target Supabase project; do not drop case-study or audit data as part of an application rollback.
