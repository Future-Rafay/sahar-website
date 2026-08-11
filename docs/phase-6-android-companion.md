# Phase 6 Android Companion App

## Scope

The Sahar staff Android companion app lives in `apps/sahar-staff-android`. It is a separate React Native CLI project and uses only HTTPS JSON calls to `/api/v1/staff/*`.

The app never connects to MySQL and never stores database credentials.

## Implemented app flow

- Owner/staff login with device name.
- Rotating refresh token storage through `StaffDeviceSession`.
- Bearer access token calls to staff APIs.
- Active order queue with 10 second polling and refresh on foreground focus.
- Read-only cached order list while offline.
- Order detail actions for status advance, ETA adjustment, cash confirmation, routine cancellation, full Stripe refund-and-cancel, and receipt print attempt.
- All authenticated actions refresh an expired access token once before failing.
- Push-token registration hook for Firebase Cloud Messaging.
- Printer setup screen with 58mm/80mm selection.
- ESC/POS receipt text formatting.

## Staff API contracts

- `POST /api/v1/staff/auth/login`
- `POST /api/v1/staff/auth/refresh`
- `POST /api/v1/staff/auth/logout`
- `GET /api/v1/staff/context`
- `PUT /api/v1/staff/devices/current/push-token`
- `GET /api/v1/staff/orders`
- `GET /api/v1/staff/orders/{orderNumber}`
- `PATCH /api/v1/staff/orders/{orderNumber}/status`
- `PATCH /api/v1/staff/orders/{orderNumber}/eta`
- `PATCH /api/v1/staff/orders/{orderNumber}/cash-payment`
- `POST /api/v1/staff/orders/{orderNumber}/cancel`
- `POST /api/v1/staff/orders/{orderNumber}/refund-cancel`

## Release and admin download

- Debug builds use `http://10.0.2.2:3000`; release builds use `https://sahar.ch`.
- Release signing reads `SAHAR_RELEASE_STORE_FILE`, `SAHAR_RELEASE_STORE_PASSWORD`, `SAHAR_RELEASE_KEY_ALIAS`, and `SAHAR_RELEASE_KEY_PASSWORD` from Gradle properties or environment variables. Never commit them.
- Publish the signed APK to S3 with `Content-Disposition: attachment`, then set the website's optional `STAFF_APK_URL`. The admin download control remains disabled until that URL is configured.

The legacy `/advance` route remains as a compatibility alias for the existing admin queue.

## Hardware handoff

Printer output is adapter-based until the real terminal and printer are tested. The app currently formats ESC/POS receipt payloads and returns a clear pending-adapter message from `printReceipt`.

Before hardware acceptance, confirm:

- Android terminal model.
- Printer model.
- Bluetooth, USB, LAN, or Android PrintService connection.
- 58mm or 80mm paper width.
- ESC/POS compatibility.
- Duplicate-print behavior after disconnect/reconnect.
