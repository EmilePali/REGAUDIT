# RegAudit

Mobile-first PWA that trains mutuelle/institution staff for AIRMS-style regulatory audits, sold to regulators (APEX SKY's clients) as a white-label, multi-tenant platform.

## Run & Operate

- `pnpm --filter @workspace/regaudit run dev` — run the frontend (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec (not set up yet — no OpenAPI spec exists, `lib/api-zod` and `lib/api-client-react` are placeholders until it is)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env (`artifacts/api-server`): `DATABASE_URL`, `PORT`, `PLATFORM_ROOT_DOMAIN`, `VERIFICATION_DOMAIN`, `IP_HASH_SALT`, `SUPER_ADMIN_API_KEY` — see `source-material/RegAudit-contact-to-revenue-addendum.md` §5.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/regaudit-app/` — React/Vite frontend PWA. Currently a placeholder shell (see Gotchas).
- `artifacts/api-server/` — Express API: tenant resolution, subscription gating, billing, certificate verification. Entry point `src/index.ts`, app wiring in `src/app.ts`.
- `lib/db/src/schema.ts` — source of truth for the data model (tenants, organizations, users, subscriptions, plan_pricing, payments, certificates, certificate_scans).
- `lib/billing/` — pure subscription/trial state machine, no I/O. This is where "is a tenant allowed in" logic lives, not in the API routes.
- `lib/tenancy/` — subdomain parsing/validation and certificate verification code/URL generation. The one rule that matters most (certificate QR always resolves on OUR domain, never a tenant subdomain) is enforced here by `buildVerificationUrl` taking no tenant argument at all.
- `lib/api-zod/`, `lib/api-client-react/` — placeholders for Orval-generated types/hooks; empty until an OpenAPI spec exists.
- `source-material/RegAudit-cahier-des-charges.md` — full functional spec (French).
- `source-material/RegAudit-contact-to-revenue-addendum.md` — multi-tenant/white-label/billing architecture addendum, decisions made, and open items.

## Architecture decisions

- **Tenant = regulator, not institution.** A regulator (e.g. ARMP) gets one subdomain shared by all institutions it supervises; institutions are scoped `organizations` under a tenant, not separate tenants. See addendum §1.
- **Access state is recomputed from dates on every check, never trusted from a stored status flag** (`lib/billing`'s `computeAccessState`) — same reproducibility principle as `source-material/regaudit-simulation-engine.js`'s scoring. The DB `status` column is a cache for querying/filtering, not the source of truth, except `canceled` which is a genuine event no date comparison can recover.
- **Payment provider is pluggable** (`artifacts/api-server/src/payments/provider.ts`) because the actual mobile money aggregator vendor isn't chosen yet. `manual` (admin-confirmed) is fully implemented and usable today; `mobile_money_aggregator` is a documented stub.
- **Super_admin ops routes use a shared API key**, not per-user auth — there's no auth system yet (phone+OTP per the cahier des charges is still unbuilt). This is explicitly interim; see `middleware/require-super-admin.ts`.
- **Certificate scans are logged passively**, no gate/form in front of the verification result — decided explicitly over a gated-lead-capture alternative.

## Product

Two audiences: (1) trainees at regulated institutions learn AIRMS-style audit readiness through short modules, quizzes and simulations (see cahier des charges); (2) regulators buy RegAudit as a white-label platform for their supervised institutions, with a 3-month free trial then a 3/6/12-month paid subscription, and every issued certificate's QR code drives a lead back to APEX SKY when scanned.

## User preferences

- User (EmilePali) prefers direct questions only when a decision is genuinely business-critical and unguessable (e.g. payment method) — otherwise proceed and build.

## Gotchas

- `artifacts/regaudit-app/src/App.tsx` still renders the original Replit Agent placeholder ("Replit Agent is building...") — no product screens exist yet, including for anything in this addendum. The backend is ahead of the frontend.
- This sandbox has no live Postgres — `lib/db`'s schema/client are typechecked and unit-tested where possible (`lib/billing`, `lib/tenancy`), but never run against a real database. Run `pnpm --filter @workspace/db run push` against a real `DATABASE_URL` before trusting the schema end-to-end.
- `regaudit-app` and `attached_assets/` used to live at the repo root; they were moved to `artifacts/regaudit-app/` and root `attached_assets/` respectively because `tsconfig.json`, `pnpm-workspace.yaml`, and `vite.config.ts`'s `@assets` alias all already assumed that layout — the previous location silently broke `pnpm install` and `pnpm run typecheck`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
