# Sahar Website, Admin Panel, and Ordering App Plan

## 1. Summary and architecture

Sahar is a standalone, single-restaurant platform for `sahar.ch`. It is not a reusable template, a multi-tenant system, or a Foodeez integration. The Foodeez projects may be inspected as read-only references, but Sahar's code, routes, schema, design, and API contracts must be created fresh.

### Final stack

- Node.js 22 LTS and npm.
- Current stable Next.js App Router and React, pinned in the lockfile when scaffolding begins.
- Strict TypeScript and Tailwind CSS 4.
- MySQL with Prisma 7 and one shared server-only Prisma client.
- Auth.js/NextAuth with credentials, Google OAuth, and Prisma-backed sessions.
- Stripe Checkout, verified webhooks, and Stripe Refunds; CHF stored as integer rappen.
- AWS S3 for public brand and menu imagery through server-authorized uploads.
- Resend for account and order emails.
- Vercel for preview and production deployments.
- Zod at API, action, webhook, upload, and checkout trust boundaries.
- Server Components by default; client components only for interactive islands such as the cart, dialogs, filters, and foreground polling.
- Node runtime for Prisma, authentication, Stripe, and uploads.
- A separate Android React Native companion app after the web MVP, using only Sahar's authenticated `/api/v1/staff/*` API.

### Confirmed product scope

- Delivery and pickup.
- ASAP and scheduled ordering.
- Swiss postcode delivery zones with fee, minimum order, ETA, and optional free-delivery threshold.
- Weekly opening hours plus one-off closures/overrides.
- Configurable scheduled-slot capacity.
- Categories, products, variants, required/optional choice groups, add-ons, allergens, dietary labels, and spice level.
- Manual available/sold-out state; no numeric or ingredient inventory.
- German and English customer content entered explicitly by admin.
- Guest checkout plus optional customer accounts using email/password or Google.
- Stripe plus cash on delivery/payment at pickup.
- Standard fixed/percentage promo codes; no loyalty program.
- Auto-confirmed valid orders; no staff acceptance step.
- Operational tracking: confirmed, preparing, ready for pickup or out for delivery, completed, cancelled, and payment/refund states.
- Customer cancellation requires contacting the restaurant.
- Customer-visible order numbers use `SAH-000001` formatting while raw database IDs remain internal.
- Restaurant-run delivery with status updates only; no driver profiles, assignment, GPS, or route optimization.
- No reservations, dine-in ordering, table QR ordering, item editing after checkout, full CMS, sales reporting suite, dark mode, or multi-currency.

### Design direction

- Modern-premium Pakistani restaurant identity grounded in Sahar's "dawn" meaning.
- Proposed initial palette:
  - Primary plum: `#6A1F3D`
  - Secondary saffron: `#C58A1F`
  - Background: `#FFF9F3`
  - Surface: `#FFFFFF`
  - Foreground: `#211A1D`
  - Success: `#287A54`
  - Destructive: `#B42318`
- Sora for display text and Manrope for body/admin text.
- Signature element: a restrained rising-horizon mark used in the logo, hero, and selected dividers.
- The brand phase produces primary, compact, monochrome, favicon, and Android app-icon logo variants.
- Use real Sahar food/interior photography. Development may use placeholders until the photo shoot is complete.
- `SiteSettings` is the single runtime source for primary color, secondary color, and logo keys. The root layout exposes colors through semantic CSS variables; the public site, admin, emails, and companion app consume the same source.
- Public, admin, and app surfaces share one component and interaction vocabulary, with denser layouts for staff tools.
- Use restrained CSS motion and respect `prefers-reduced-motion`; do not add an animation library initially.
- Target WCAG 2.2 AA with semantic HTML, keyboard operation, visible focus, connected labels/errors, 44px touch targets, and accessible dialogs.
- Cancel, refund, delete, and similar dangerous actions must be separated from routine primary actions and require confirmation. Refunds also display the exact amount and require a reason.

## 2. Application structure and routes

```text
src/
  app/
    [locale]/
      (site)/
        page.tsx
        menu/page.tsx
        cart/page.tsx
        checkout/page.tsx
        order/[orderNumber]/page.tsx
        account/orders/page.tsx
        about/page.tsx
        contact/page.tsx
        privacy/page.tsx
        terms/page.tsx
      (auth)/
        login/page.tsx
        register/page.tsx
        forgot-password/page.tsx
        reset-password/page.tsx
    admin/
      login/page.tsx
      (protected)/
        page.tsx
        orders/page.tsx
        orders/[orderNumber]/page.tsx
        menu/categories/page.tsx
        menu/products/page.tsx
        menu/products/[productId]/page.tsx
        availability/page.tsx
        promos/page.tsx
        staff/page.tsx
        settings/general/page.tsx
        settings/hours/page.tsx
        settings/delivery-zones/page.tsx
    api/
      auth/[...nextauth]/route.ts
      webhooks/stripe/route.ts
      uploads/images/route.ts
      v1/public/
      v1/customer/
      v1/staff/
  components/
    ui/
    site/
    admin/
  config/
  lib/
  server/
    auth/
    policies/
    services/
    validators/
    db.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
```

- `/` redirects to `/de`; `/de` and `/en` are explicit, SEO-friendly locale roots.
- `/admin` lives in the same Next.js app and is English-first initially.
- Customer and staff accounts share one authentication foundation, but use separate login presentation and strict role guards.
- Every protected page, server action, route handler, and service mutation performs server-side authorization.
- `OWNER` has full access.
- `STAFF` may manage operational order status/ETA, confirm cash payment, cancel eligible unpaid/cash orders, and mark products sold out.
- Only `OWNER` may manage menu structure, site/settings, staff invitations, promos, and Stripe refunds.
- A paid Stripe order cannot be cancelled by `STAFF`; the owner must use the refund-aware cancellation flow.
- Customer-visible content requires both German and English values before publication.

## 3. Prisma schema design

All mutable models use `createdAt` and `updatedAt`. Menu records that must remain referenced by order history use `deletedAt` instead of physical deletion. Money uses integer rappen, percentages use integer basis points, timestamps are UTC, and business calculations use `Europe/Zurich`.

### Configuration and fulfilment

- `SiteSettings`: singleton ID, display/legal names, slug, email, phone, address, optional coordinates, timezone, currency, nullable VAT status/number, primary/secondary colors, logo/compact-logo/favicon/hero S3 keys, bilingual hero/about/announcement content, announcement state, and social links.
- `FulfillmentSettings`: singleton ID, delivery/pickup flags, ASAP/scheduled flags, pickup/delivery preparation minutes, lead time, booking horizon, slot interval/default capacity, and bilingual pickup instructions.
- `OpeningWindow`: fulfilment type, weekday, start/end minutes, active state, and sort order. Multiple windows per day are allowed; overnight periods are split at midnight.
- `ServiceException`: date, fulfilment type, closed state, optional start/end minutes, and note. It supports full closures or replacement windows.
- `FulfillmentSlot`: fulfilment type, start time, capacity, booked count, and closed state, unique by type/start. Checkout reserves capacity atomically and releases failed, expired, or cancelled reservations.
- `DeliveryZone`: bilingual name, active state, delivery fee, minimum subtotal, optional free-delivery threshold, estimated minutes, and sort order.
- `DeliveryZonePostalCode`: delivery-zone relation and unique normalized four-digit Swiss postcode.

### Menu

- `Category`: slug, bilingual name/description, active state, sort order, soft-delete timestamp, and product relation.
- `Product`: category relation, slug, bilingual name/description, image S3 key, active/available state, sort order, halal/vegetarian/vegan flags, optional spice level, and relations to variants, option groups, allergens, and availability windows.
- `ProductVariant`: product relation, bilingual name, optional SKU, price in rappen, active state, sort order, and soft-delete timestamp. Every published product has at least one active variant; single-price products use a Standard variant.
- `OptionGroup`: product relation, bilingual name, required state, minimum/maximum selections, active state, sort order, and soft-delete timestamp.
- `OptionChoice`: option-group relation, bilingual name, price adjustment in rappen, active state, sort order, and soft-delete timestamp.
- `ProductAvailabilityWindow`: product relation, weekday, and start/end minutes. Products without windows follow restaurant service hours.
- `Allergen`: stable code, bilingual name, and sort order.
- `ProductAllergen`: unique product/allergen relation.

### Identity

- `User`: unique normalized email, optional password hash/name/phone/image/email verification, role (`CUSTOMER`, `OWNER`, `STAFF`), active state, last login, and relations to authentication, addresses, devices, orders, and audit events.
- `Account`: standard Auth.js provider/account token fields with unique provider/provider-account relation.
- `Session`: unique session token, user relation, and expiry.
- `PasswordResetToken`: user relation, unique token hash, expiry, and used timestamp.
- `StaffInvitation`: normalized email, unique token hash, inviting owner, expiry, and accepted timestamp. Invitations create staff accounts only.
- `CustomerAddress`: user relation, label, recipient/phone, street/extra, postcode, city, country, and default state.
- `StaffDeviceSession`: user/device/platform, hashed refresh token, optional push token, expiry, last seen, and revocation timestamps.

### Promotions, orders, and payments

- `PromoCode`: unique uppercase code, fixed/percentage type, value, minimum subtotal, optional validity dates, total/per-customer limits, and active state. Discounts apply to item subtotal only and never reduce totals below zero.
- `PromoRedemption`: promo/order relation, optional user, normalized customer email, and discount snapshot. One redemption per order.
- `Order`: internal auto-increment ID, optional user and hashed guest tracking token, locale, customer snapshots, fulfilment/status/payment method, slot and schedule data, ETA, customer note, subtotal/discount/delivery/tax/total snapshots, optional promo/zone relations, zone snapshots, optimistic concurrency version, and completion/cancellation data. A shared formatter produces `SAH-000001` labels.
- `OrderAddress`: immutable one-to-one delivery address snapshot.
- `OrderItem`: order relation, optional source product/variant relations, bilingual product/variant snapshots, unit price, quantity, and line subtotal.
- `OrderItemOption`: item relation, optional source option relation, bilingual name snapshots, and price adjustment.
- `OrderStatusEvent`: immutable timeline containing order, optional actor, previous/next status, reason, note, and timestamp.
- `Payment`: one-to-one order relation, Stripe/cash provider, payment status, optional unique Stripe Checkout Session/PaymentIntent IDs, paid/refunded amounts, and timestamps.
- `Refund`: payment/requesting-owner relations, unique Stripe refund ID, amount, reason, status, and optional failure message.
- `StripeWebhookEvent`: unique Stripe event ID, type, processing status/error, and processed timestamp for idempotency.
- `NotificationDelivery`: optional order relation, email/push channel, event kind, recipient, unique deduplication key, status, attempt count, provider ID, and last error.
- `AuditLog`: immutable actor/action/entity metadata and request correlation ID for cancellations, refunds, cash confirmation, menu/settings changes, and staff changes.

### Order lifecycle

- Cash orders are created as `CONFIRMED`.
- Stripe orders remain `PAYMENT_PENDING` until a verified webhook marks payment successful and moves them to `CONFIRMED`.
- Pickup: `CONFIRMED -> PREPARING -> READY_FOR_PICKUP -> COMPLETED`.
- Delivery: `CONFIRMED -> PREPARING -> OUT_FOR_DELIVERY -> COMPLETED`.
- Eligible orders may move to `CANCELLED`; arbitrary backward transitions are forbidden.
- Partial refunds do not cancel an order.
- Owner cancellation of a paid Stripe order first requests the full refund with an idempotency key. If Stripe rejects the request, the order remains unchanged.
- Server services own all totals, capacity, transitions, permissions, promo limits, and refund eligibility.

### Migration policy

- Create only an empty local `sahar_dev` database/user in MySQL Workbench; Prisma owns every table and index.
- Use a separate `sahar_test` database for integration checks.
- `prisma migrate dev` is local-only.
- Preview/production use immutable committed migrations and `prisma migrate deploy`.
- Schema and data migrations remain separate, forward-only, and are never edited after deployment.
- Seed only singleton settings, allergen reference data, development fixtures, and the initial owner bootstrap.
- Production MySQL requires TLS, backups, migration credentials, and Vercel-compatible connection limits.

## 4. APIs and external integrations

### Public/customer API

- `GET /api/v1/public/config`: locales, brand/contact details, fulfilment availability, and public hours.
- `GET /api/v1/public/menu`: localized categories/products, variants/options, availability, and food metadata.
- `POST /api/v1/public/delivery-quote`: validates postcode/subtotal and returns zone, fee, minimum, and threshold progress.
- `GET /api/v1/public/slots`: returns available capacity by fulfilment type/date.
- `POST /api/v1/customer/quote`: recalculates current database products, options, promo, delivery, and totals.
- `POST /api/v1/customer/orders`: creates idempotent cash or Stripe-payment-pending orders.
- `GET /api/v1/customer/orders/{orderNumber}`: requires account ownership or secure guest tracking token.
- `/api/webhooks/stripe` is authoritative for payment state; redirect pages never mark orders paid by themselves.

### Companion app API

All staff endpoints use HTTPS JSON, bearer access tokens, rotating refresh tokens, ISO UTC timestamps, integer rappen, public Sahar order numbers, stable error codes, optimistic concurrency, and idempotency keys for retriable mutations.

- `POST /api/v1/staff/auth/login`
- `POST /api/v1/staff/auth/refresh`
- `POST /api/v1/staff/auth/logout`
- `GET /api/v1/staff/context`
- `PUT /api/v1/staff/devices/current/push-token`
- `GET /api/v1/staff/orders?status=&cursor=&updatedAfter=`
- `GET /api/v1/staff/orders/{orderNumber}`
- `PATCH /api/v1/staff/orders/{orderNumber}/status`
- `PATCH /api/v1/staff/orders/{orderNumber}/eta`
- `PATCH /api/v1/staff/orders/{orderNumber}/cash-payment`
- `POST /api/v1/staff/orders/{orderNumber}/cancel`

Responses include server-derived `allowedActions`; the app must not recreate permission or transition rules.

### Android app

- Separate React Native Android repository; it never contains database credentials or connects directly to MySQL.
- Fresh Sahar implementation informed by the Foodeez POS separation pattern but without copied code.
- Poll active orders every 10 seconds while foregrounded, refresh immediately on focus, and use FCM for new-order push alerts.
- Cache the last successful order response read-only and disable mutations while offline.
- Initial screens: login, order queue, order details/actions, printer setup, and device/account settings.
- Receipt data comes from the order-detail DTO and is formatted locally for the selected printer.
- Printer model, connection method, paper width, Android PrintService support, and ESC/POS compatibility must be physically tested before selecting a print library.
- Prefer React Native CLI because printer/Bluetooth native compatibility controls the architecture.

## 5. Phased delivery and checkpoints

### Phase 1: Brand and content

- Produce logo concepts/variants, approved tokens, responsive wireframes, and public/admin/app component direction.
- Collect real menu data, prices, descriptions, options, allergens, photography, contact/address details, hours, delivery zones/fees/minimums, and legal copy.
- Stop for approval.

### Phase 2: Foundation and schema

- Scaffold Next.js, localization, shared UI primitives, Prisma/migrations, local seed, Auth.js, role policies, S3, Resend templates, and server service boundaries.
- Establish the initial owner and staff invitation flow.
- Stop after schema, auth, and component-system verification.

### Phase 3: Ordering MVP

- Build bilingual pages, menu, cart, options, sold-out behavior, postcode quotes, slots/capacity, promos, guest/account checkout, cash, Stripe test mode, tracking, and transactional emails.
- Include the minimum admin queue and sold-out controls needed for end-to-end operation.
- Stop after full customer-order verification.

### Phase 4: Full admin operations

- Add complete menu management, availability, hours/exceptions, zones, key site settings, promos, staff invitations, order history, owner refunds, and audit visibility.
- Stop for owner/staff workflow review.

### Phase 5: Hardening and deployment

- Provision managed production MySQL, S3/IAM, Stripe, Google OAuth, Resend domain, Vercel environments, and DNS.
- Run migrations, responsive/accessibility/security checks, webhook replay tests, backup checks, and production smoke tests.
- Stop before DNS cutover and obtain explicit launch approval.

### Phase 6: Android companion app

- Confirm physical terminal and printer before implementation.
- Freeze staff API DTOs.
- Build device authentication, order workflows, polling, FCM, cached read-only state, alert sound, receipt printing, and device revocation.
- Test on the real device/printer and stop for hardware acceptance.

## 6. Verification

- Type checking, linting, production build, Prisma validation, and Prisma generation.
- Focused `node:test`/`tsx` checks for money/promos, postcode quotes, opening hours/slots, concurrent capacity, transitions/permissions, webhook idempotency, and refund totals.
- Integration checks against `sahar_test` for checkout, promo limits, capacity races, guest ownership, paid-order cancellation restrictions, and webhook replay.
- Playwright CLI snapshots/traces for German/English navigation, delivery/pickup, variants/options, invalid postcode, minimum order, full slot, sold-out state, cash/Stripe outcomes, guest tracking, customer history, role boundaries, keyboard/focus/dialog behavior, and 375/768/1024/1440px layouts.
- Physical Android checks for reconnection, background push, alert sound, 58/80mm receipts, special characters, duplicate-print prevention, and printer disconnection.

## 7. Open prerequisites and risks

- Real menu, address/contact details, opening hours, delivery zones/pricing, photographs, and legal content are not yet supplied.
- Swiss VAT registration, VAT number, rate treatment, and receipt wording must be confirmed before production payments.
- `sahar.ch` is not yet acquired; DNS access is required for OAuth, Resend, Stripe, and launch.
- Stripe account onboarding remains an external prerequisite.
- Local MySQL is development-only; a managed production provider still needs selection.
- Google OAuth, Resend, S3, FCM, production MySQL, and Vercel secrets do not yet exist.
- Cash orders without phone/email verification carry fake-order risk; begin with platform rate limits and monitoring, adding OTP only if evidence justifies it.
- Printer hardware and Android distribution method remain blocking companion-app decisions.
- Final logo, palette, and photography require Phase 1 approval.
- Admin and companion app are English-first; bilingual staff interfaces are deferred unless requested.
