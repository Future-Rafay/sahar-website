# Sahar Project Guide

## Purpose and boundaries

This repository is the standalone website and admin panel for the single Pakistani restaurant Sahar (`sahar.ch`). It is not a reusable template, a multi-tenant restaurant platform, or part of Foodeez.

- Read `PLAN.md` before making architecture, schema, route, payment, or workflow changes.
- Foodeez repositories are read-only references. Do not copy their code, schema, routes, or business rules into Sahar without explicit approval for that exact piece.
- Keep the public site and `/admin` in this Next.js project.
- The later Android ordering/PDA app is a separate React Native project and may communicate only with Sahar's authenticated backend API. It must never access MySQL directly.
- Do not scaffold or implement a later phase until the user approves the preceding checkpoint.

## Confirmed stack

- Current stable Next.js App Router, React, strict TypeScript, and Tailwind CSS 4.
- MySQL and Prisma 7.
- Auth.js/NextAuth with credentials, Google OAuth, and Prisma sessions.
- Stripe Checkout/webhooks/refunds, CHF integer rappen, AWS S3, Resend, and Vercel.
- German and English public routes under `/de` and `/en`; `/` redirects to `/de`.
- `/admin` lives in the same app and uses server-side `OWNER`/`STAFF` authorization.
- `lucide-react` for standard UI iconography across public and admin interfaces.

## Phase 2 foundation seams

- `src/server/db.ts` is the only Prisma client constructor. Runtime MySQL access uses Prisma's MariaDB adapter and `DATABASE_URL`.
- Google OAuth uses NextAuth's Prisma adapter with database sessions. Credentials login uses the same `Session` table and standard NextAuth session cookie through `POST /api/auth/credentials`; do not add a second session system.
- The initial `OWNER` is created only by `prisma/seed.ts` from `OWNER_EMAIL`, `OWNER_PASSWORD`, and `OWNER_NAME`. Staff accounts are created only through the hashed, expiring invitation flow under `/api/v1/staff/invitations`.
- S3 upload authorization lives in `src/server/storage/s3.ts`; only server-issued, validated presigned uploads are allowed.
- Resend calls go through `src/server/email/client.ts`; placeholder keys must not send real email.
- German and English message files live under `src/messages`; shared accessible primitives live under `src/components/ui`.
- Local migrations and seeds may target only the dedicated `sahar_dev` schema. Never reuse a Foodeez or unrelated database connection.

## Phase 3 ordering seams

- `src/server/services/ordering.ts` is the shared authority for product repricing, option validation, promo limits, delivery quotes/minimums, slot reservation, order snapshots, Stripe completion, tracking DTOs, routine status transitions, cash confirmation, and sold-out changes. Public pages and route handlers must not duplicate these rules.
- Checkout mutations require a UUID `checkoutKey`; only its SHA-256 hash is stored in `Order.checkoutKeyHash`, and the same opaque value is the one-time guest tracking token. Public labels always come from `formatOrderNumber` as `SAH-000001`.
- Scheduled slots are generated from Zurich opening windows/exceptions by `getAvailableSlots`, then reserved atomically with `bookedCount < capacity` inside the serializable order transaction. Failed or expired Stripe Checkout orders release their reserved slot.
- Cash orders enter `CONFIRMED` with payment still `PENDING` until OWNER/STAFF uses the cash-confirmation route. Stripe orders remain `PAYMENT_PENDING`; only a signature-verified `checkout.session.completed` webhook marks them paid and confirmed.
- Customer APIs live under `/api/v1/public/*` and `/api/v1/customer/*`. Server responses are explicit DTOs; account order access requires ownership and guest access requires the hashed tracking token.
- The active queue, forward-only routine transitions, cash confirmation, and product sold-out controls remain backed by the Phase 3 ordering service; Phase 4 layers structural admin operations around this seam.
- Order emails use `NotificationDelivery.deduplicationKey` and are sent only after database transactions. Placeholder Resend keys remain non-sending. Stripe requires `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in addition to `APP_URL`.
- `prisma/seed-ordering.ts` adds idempotent MOCK-prefixed development menu, zones, hours, and `WELCOME10`; replace these only with approved Sahar data and keep `content-todo.md` synchronized.
- `src/components/site/cart-context.tsx` owns the versioned local browser cart. Server quote/order endpoints ignore browser prices and always rebuild totals from current database variants/options.

## Phase 4 admin operations seams

- `src/server/services/admin.ts` is the shared Phase 4 authority for structural menu operations, product time windows, fulfilment/hours/exceptions, delivery zones/postcodes, site settings, promos, staff access, order history, cancellation, Stripe refunds, and audit queries. Admin pages and the staff cancellation API call this service instead of duplicating database rules.
- `src/server/validators/admin.ts` validates every Phase 4 form and money/schedule trust boundary. Admin mutations use the single `adminAction` server action under `src/app/admin/(protected)/actions.ts`, which independently checks `OWNER` or `OWNER`/`STAFF` as appropriate.
- Structural menu records use their existing `deletedAt` fields and are never physically deleted. Product variants, option groups/choices, allergens, dietary flags, and product availability windows are managed under `/admin/menu/*`; fast sold-out state remains available to both roles under `/admin/availability`.
- `AdminShell` (`src/components/admin/admin-shell.tsx`) provides a Shopify-style administration interface with a left sidebar, top header bar, live website shortcut, far-right user avatar dropdown, profile info, and sign out action.
- Owner-only route layouts protect menu structure, general settings, hours/exceptions, delivery zones, promos, staff, and audit pages. Staff may access the queue, availability, order history/details, eligible cancellation, cash confirmation, and routine forward transitions.
- `SiteSettings.primaryColor` and `secondaryColor` now drive the root semantic CSS variables. General settings also own the existing contact, asset-key, bilingual hero/about/announcement, and social fields; VAT remains blocked until the business confirms it.
- Hours use minute-of-day values and `Europe/Zurich`; exceptions replace a service window or close a day. Delivery postcodes remain unique four-digit Swiss codes, and zone fees/minimums/thresholds use integer rappen.
- Staff invitations still use the hashed 48-hour token and Resend flow. Invitations, acceptance, activation, and deactivation write audit events; deactivation also invalidates existing web sessions.
- `POST /api/v1/staff/orders/{orderNumber}/cancel` and the admin action share the same cancellation service. Completed/cancelled orders cannot be cancelled, reasons are required, reserved slot capacity is released, and paid Stripe orders are rejected unless the owner uses the refund-aware flow.
- Owner refunds call Stripe outside the database transaction with a UUID idempotency key, then store the Stripe refund and update payment/order/audit state transactionally. Partial refunds do not cancel orders; cancellation requires the full remaining amount. The confirmation dialog displays the exact entered CHF amount and keeps refund/cancel controls apart from routine actions.
- Phase 4 reused the complete existing Prisma schema, so it required no schema change or migration. Do not invent a Phase 4 migration unless a future approved requirement changes the schema.

## Phase 5 hardening and deployment seams

- `src/config/security.ts` is the single global browser-security header definition used by `next.config.ts`. Production blocks framing/object embedding and enables CSP, HSTS, MIME sniffing protection, referrer control, and a restrictive permissions policy; `unsafe-eval` is development-only so React debugging works without weakening production.
- Next.js and `eslint-config-next` are pinned to `16.3.0`; this removes the high-severity PostCSS/Sharp audit findings present in `16.2.12`. Keep the framework and matching ESLint config aligned and rerun `npm audit` after upgrades.
- `assertProductionEnvironment` in `src/config/env.ts` and `npm run phase5:preflight` reject local/placeholder infrastructure, non-TLS or non-strict MySQL, mismatched/non-HTTPS app/auth origins, short auth secrets, insecure asset origins, and Stripe test keys before production promotion. Owner seed variables remain operator-only and must not be stored in Vercel.
- Runtime Prisma continues to use the one client in `src/server/db.ts`, now with explicit MariaDB pool limits/timeouts and verified TLS/optional CA handling. Prisma CLI migrations continue to use the immutable committed migrations and a `DATABASE_URL` ending in `sslaccept=strict`.
- Stripe webhook claims can replay `FAILED` or stale `PROCESSING` deliveries while still deduplicating processed/concurrent events. Checkout completion verifies the stored Checkout session ID, CHF currency, exact stored amount, and public order number before payment confirmation; expired sessions also verify their stored session ID.
- Browser-origin upload and staff-invitation mutations use the shared same-origin guard. Native mobile clients remain compatible because they do not send browser `Origin` headers.
- Public and admin shells provide keyboard skip links, explicit content language, and clear main top-padding (`pt-20 sm:pt-24`) to eliminate sticky header overlap. Public destinations hidden from the compact header remain available in the footer; shared controls, dialogs, danger separation, touch targets, and reduced-motion behavior remain unchanged.
- `docs/phase-5-deployment-runbook.md` is the operational source for managed MySQL/TLS/backups, S3/IAM, Stripe, Google OAuth, Resend, Vercel environments/rate limits, evidence capture, rollback, and the DNS hold point.
- Phase 5 required no Prisma schema change or migration. Managed services, isolated `sahar_test` replay execution, production migrations/backups/smoke tests, and DNS remain pending owner access and approved real content. DNS must not be changed without explicit written launch approval.
- Phase 6 Android work remains unimplemented pending Phase 5 review and approval.

## Phase 1 brand and content seams

- `src/content/phase-1.ts` is the working Phase 1 source for supplied business details and draft bilingual menu, delivery, VAT, photography, hero, and about content. Do not duplicate these definitions elsewhere before approval.
- Real supplied client data must remain verbatim. Every placeholder value uses the `` prefix and nearby `// MOCK - replace with real client data` comments.
- `content-todo.md` is the production-blocking inventory of every unresolved placeholder and approval. Keep it synchronized whenever mock content is added, replaced, or approved.
- The client-supplied raster logo is stored unchanged at `public/brand/sahar-logo.png`. Do not generate replacement concepts; compact, monochrome, favicon, and Android variants still require client approval/source artwork.
- Temporary Pexels assets live under `public/images/placeholders/`, with source and credit records in `src/content/phase-1.ts` and `content-todo.md`. They must be replaced by real Sahar photography before production and must never be presented as actual Sahar dishes.
- Phase 1 visual and responsive direction is documented in `docs/phase-1-brand-direction.md`. Palette, typography, rising-horizon treatment, wording, menu, VAT, delivery zones, photography, and logo variants remain unapproved until their `` entries are resolved.
- Phase 1 content work does not authorize Phase 3 public pages, ordering flows, database seeding, migrations, or DNS checks. The domain is registered/live, and DNS access remains a launch-time task.

## Architecture rules

- Server Components are the default. Add client components only for real interactivity.
- Keep database, pricing, availability, authorization, order transitions, and payment logic in server-only services.
- Use one Prisma client module. Do not instantiate Prisma in routes or components.
- Validate every trust boundary with shared schemas and map database records to explicit response DTOs.
- Public web mutations and versioned `/api/v1` mobile endpoints must call the same server services rather than duplicate business rules.
- The staff API returns server-derived `allowedActions`; clients must not recreate order transition rules.
- Use integer rappen for all money. Never trust totals, discounts, delivery fees, product prices, or payment state supplied by a client.
- Store timestamps in UTC and calculate/display business time in `Europe/Zurich`.
- Keep German/English customer content explicit. Do not introduce a generic translation CMS for the two fixed locales.
- This is a single-restaurant system. Do not add speculative tenant, organization, or business-scoping abstractions.

## Database and migrations

- `prisma/schema.prisma` is the schema source of truth.
- MySQL Workbench may create the empty local `sahar_dev` and `sahar_test` databases/users only. Prisma migrations own application tables and indexes.
- `prisma migrate dev` is local-only. Preview and production use committed immutable migrations with `prisma migrate deploy`.
- Never edit a migration that has run in another environment. Create a forward migration instead.
- Keep schema and data migrations separate.
- Add indexes for foreign keys and real filter/sort paths, especially orders, slots, promo usage, notifications, and sessions.
- Use transactions for order creation, slot capacity, promo redemption, payment/refund state, and order status events.
- Never perform email, push, Stripe, or S3 network calls inside a long database transaction.

## Product and order contracts

- Delivery and pickup support ASAP and scheduled orders.
- Delivery eligibility uses configured Swiss postcodes and server-calculated zone fees/minimums.
- Products have categories, variants, option groups, allergens, dietary flags, optional spice level, and manual available/sold-out state. There is no numeric inventory.
- Customers may check out as guests or with optional email/password or Google accounts.
- Prices are CHF tax-inclusive customer prices; VAT configuration remains blocked until the business confirms its registration details.
- Public order labels use `SAH-000001` formatting; raw database IDs stay internal.
- Cash orders confirm on creation. Stripe orders confirm only after a verified webhook.
- Valid flows are:
  - Pickup: Confirmed -> Preparing -> Ready for pickup -> Completed.
  - Delivery: Confirmed -> Preparing -> Out for delivery -> Completed.
- Do not allow arbitrary backward status transitions.
- Placed order items and totals are immutable snapshots. Staff do not edit items after checkout.
- Customer cancellation is not self-service.
- `STAFF` handles routine order state/ETA, cash confirmation, eligible cash/unpaid cancellation, and sold-out state.
- `OWNER` manages structural menu/settings/staff/promos and all Stripe refund actions.
- A paid Stripe order must not be cancelled unless the owner refund flow succeeds or Stripe accepts the refund request.

## UI and UX rules

- One Sahar design language must be used across the public site, admin panel, and companion app. Staff surfaces may be denser but should not invent separate buttons, forms, cards, dialogs, or terminology.
- Modern non-traditional floating glassmorphic navbar with rounded container and far-right User Account Dropdown menu.
- Shopify-style admin shell with left navigation sidebar, top app bar, "Go to Website" link, and far-right user avatar menu.
- Use standard Lucide icons (`lucide-react`) across both public and admin surfaces instead of emoji icons.
- Primary color, secondary color, and logo come from the central Sahar brand settings and semantic CSS variables. Do not scatter raw brand values through components.
- Target WCAG 2.2 AA: semantic HTML, connected form labels/errors, keyboard operation, visible focus, sufficient contrast, reduced-motion handling, and minimum 44px touch targets.
- Use native elements before custom controls. Use accessible primitives for complex dialogs, menus, or selects.
- Keep routine primary actions easy to reach.
- Keep return, reject, cancel, refund, delete, clear, and other dangerous actions visually and spatially separate from routine actions so they cannot be tapped accidentally.
- Dangerous actions require confirmation and a reason when applicable. Refund confirmation must show the exact amount.
- Use real Sahar photography in production; do not imply that generated or stock food is the actual served dish.

## Security and integrations

- Authenticate and authorize every server action and API mutation independently of the UI.
- Hash passwords and mobile refresh tokens. Rotate and revoke device sessions.
- Verify Stripe webhook signatures and store processed event IDs for idempotency.
- Treat webhook state as authoritative; redirect/success pages do not mark payments paid.
- Keep S3 writes server-authorized and validate file type, size, and object keys.
- Keep secrets server-only and separate across local, preview, and production environments.
- Do not log passwords, tokens, raw card data, or unnecessary customer personal data.

## Verification and completion

- Every non-trivial pricing, scheduling, transition, authorization, and payment change needs the smallest runnable regression check.
- Run type checking, linting, Prisma validation/generation, and a production build before completing implementation phases.
- Use the isolated `sahar_test` database for integration checks.
- Use Playwright CLI snapshots/traces for critical customer/admin flows and responsive/accessibility verification.
- Companion-app printer work is blocked until the exact Android terminal, printer model, connection method, and 58/80mm paper width are physically confirmed.
- Keep this file synchronized when durable architecture, routes, schema contracts, roles, payment behavior, or workflow rules change.


## Phase 6 Android companion app seams

- Phase 6 staff mobile API endpoints are now implemented under `/api/v1/staff/*` for login, refresh, logout, context, push-token registration, order list/detail, status, ETA, cash confirmation, cancellation, and product availability compatibility.
- Browser admin staff routes and Android routes share the same order/admin services. Browser calls still use same-origin session authorization; Android calls use bearer access tokens backed by hashed rotating `StaffDeviceSession` refresh tokens.
- `src/server/auth/staff-mobile-token.ts` owns signed short-lived staff access tokens. `src/server/auth/staff-mobile.ts` owns login, refresh rotation, logout revocation, bearer validation, and push-token updates.
- `src/server/services/staff-mobile-actions.ts` is the shared source for mobile `allowedActions`; it keeps refund-required paid Stripe orders out of routine staff cancellation while allowing routine cash confirmation and eligible unpaid/cash cancellation.
- `src/server/services/staff-order-mutations.ts` owns staff ETA mutation with optimistic version checks and audit logging. Routine status advancement remains in `src/server/services/ordering.ts`.
- The plan's `/status` endpoint is implemented, and the older `/advance` endpoint remains for existing admin queue compatibility.
- The separate React Native CLI Android app source lives in `apps/sahar-staff-android`. It never connects to MySQL and calls only Sahar HTTPS staff APIs.
- The Android app implements owner/staff login, 10-second foreground polling, cached read-only offline queue state, order detail actions, ETA adjustment, FCM token registration hook, alert vibration, printer setup, cancellation reason confirmation, and ESC/POS receipt formatting.
- Printer hardware integration remains adapter-based until the exact terminal, printer model, connection method, paper width, and ESC/POS or Android PrintService support are physically confirmed. The current adapter formats the payload and returns a pending-adapter message instead of pretending hardware has been tested.
- Root Next.js checks intentionally ignore `apps/sahar-staff-android` until that app's own dependencies are installed inside its folder. Use its local `npm install`, `npm run android`, and `npm run typecheck` workflow after Android setup.
- Root layout rendering is forced dynamic because Sahar brand/settings are database-backed runtime data; production build must not prerender pages by fanning out live Prisma queries.
- `docs/phase-6-android-companion.md` is the Phase 6 handoff and hardware acceptance reference.
