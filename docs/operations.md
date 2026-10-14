# Operations

## Case-study admin activation

1. Create an isolated Supabase project for the applicable environment and apply both files in `supabase/migrations` in order.
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and server-only `SUPABASE_SERVICE_ROLE_KEY`. Do not expose the service-role key to browser code.
3. Create the initial staff account in Supabase Auth, enroll TOTP through `/staff/sign-in`, then record its UUID with an active `owner` or `administrator` role in `public.staff_roles`. Role grants are intentionally not exposed through the application.
4. Run database integration checks against an isolated test project: anonymous reads/writes denied; `aal1` staff denied; inactive staff denied; valid `aal2` staff can create/update/status-change; every write has exactly one audit event; failed writes leave no audit event; direct audit updates/deletes are denied; duplicate slugs are rejected.
5. Keep G9 configured. Do not set it to cleared or expose `/projects` until the owner records approved genuine project content and imagery. Before enabling the public reader, verify the service-role key remains in server-only modules and test the gate on the deployed environment.

## Rollback

Revert the application release to remove access to the staff routes. Database rollback must be planned against the target Supabase project; do not drop case-study or audit data as part of an application rollback.

## Lint setup run log — 2026-10-14

Commands were run from the repository root on branch `add-lint`. No automatic lint fixes were run.

| Command | Result |
| --- | --- |
| `git status --short` | Passed; working tree was clean. |
| `git branch --show-current` | Returned `main`. |
| `git switch -c add-lint main` | Passed; created `add-lint` from `main`. |
| `Get-Content package.json` | Confirmed Next.js `16.4.0` and no existing lint script or ESLint dependencies. |
| `Get-Content docs/operations.md` | Passed; reviewed the existing operations format. |
| `npm view eslint-config-next@16.4.0 version peerDependencies --json` | Timed out without changing the working tree. |
| `npm install --save-dev eslint@^9 eslint-config-next@16.4.0` | First attempt stalled and was terminated; it made no package or lockfile changes. |
| `npm ls eslint eslint-config-next --depth=0` | Initially returned no installed ESLint packages. |
| `npm ping --registry=https://registry.npmjs.org --fetch-timeout=15000 --fetch-retries=0` | Failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. |
| `$env:NODE_OPTIONS = "--use-system-ca"; npm ping --registry=https://registry.npmjs.org --fetch-timeout=15000 --fetch-retries=0` | Passed; npm returned `PONG`. |
| `$env:NODE_OPTIONS = "--use-system-ca"; npm install --save-dev eslint@^9 eslint-config-next@16.4.0` | Passed; installed `eslint@9.39.5` and `eslint-config-next@16.4.0`. npm reported five high-severity audit findings and did not change them. |
| `npm ls eslint eslint-config-next --depth=0` | Passed; confirmed `eslint@9.39.5` and `eslint-config-next@16.4.0`. |
| `npm run lint` | Failed before linting because `typescript-eslint` cannot use the TypeScript 7 API. |
| `$env:NODE_OPTIONS = "--use-system-ca"; npm install --save-dev "typescript@npm:@typescript/typescript6@^6.0.2" "@typescript/native@npm:typescript@^7.0.2"` | Passed; added Microsoft's TypeScript 6 API compatibility alias while retaining TypeScript 7 for `tsc`. |
| `npm run lint` | Ran successfully and reported 9 findings: 4 errors and 5 warnings. |
| `Get-Content src/components/home/CalculatorHighlight.tsx` | Confirmed the homepage error was an unescaped apostrophe. |
| `git log --oneline --all -- src/components/home/CalculatorHighlight.tsx` | Confirmed the file was introduced by homepage redesign commit `a44fe00`. |
| `npm run lint` | After the scoped homepage fix, reported 8 remaining findings: 3 errors and 5 warnings. |
| `npm run type-check` | Passed with no TypeScript errors. |
| `npm run build` | Passed; Next.js compiled and generated all routes successfully. |
| `git diff -- src/styles/design-tokens.css` | Showed only the build-generated timestamp change. |
| `git restore -- src/styles/design-tokens.css` | Passed; removed the timestamp-only validation noise. |

Initial lint findings by rule:

- `react-hooks/set-state-in-effect`: 1 error.
- `react/no-unescaped-entities`: 1 error.
- `@typescript-eslint/no-unsafe-function-type`: 2 errors.
- `react-hooks/exhaustive-deps`: 1 warning.
- `@next/next/no-img-element`: 1 warning.
- `@typescript-eslint/no-unused-vars`: 3 warnings.

The `react/no-unescaped-entities` homepage error was fixed. The other 3 errors and 5 warnings are outside the homepage redesign scope and remain for separate work.
