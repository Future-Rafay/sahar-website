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
- Order detail actions for status advance, ETA adjustment, cash confirmation, cancellation with reason, and receipt print attempt.
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
