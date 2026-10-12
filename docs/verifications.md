# Provider verifications

## Supabase Auth and RLS — 12 October 2026

- Supabase's current Next.js server-side auth guidance requires cookie-backed sessions and says server code must verify identity with `auth.getClaims()` rather than trusting a session read from a cookie. The staff portal instead validates each opaque, HTTP-only session cookie through Supabase Auth's `/auth/v1/user` endpoint before authorising database access. Source: https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs
- Supabase supports TOTP MFA on all projects by default. MFA produces an `aal` claim; `aal2` represents a second-factor-verified session and can be enforced by server and database rules. The case-study admin requires `aal2` in both its server guard and `current_staff_role()` database function. Source: https://supabase.com/docs/guides/auth/auth-mfa/totp
- The documented TOTP interval is 30 seconds, with one interval of tolerated clock skew. The staff sign-in screen therefore accepts a fresh six-digit code and starts a new challenge for each verification attempt. Source: https://supabase.com/docs/guides/auth/auth-mfa/totp
- RLS policy behaviour and backup/restore limits still require verification against the selected Supabase project before production activation. No project, credentials, or restore test were available in this workspace.
