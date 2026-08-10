# Sahar Staff Android

React Native CLI companion app for Sahar staff order handling. It talks only to the Sahar HTTPS staff API and never connects to MySQL.

## Setup

1. Install Android Studio, JDK, and React Native CLI prerequisites.
2. Run `npm install` inside this folder.
3. Set the API base URL in `src/config.ts`.
4. Add Firebase Android files before enabling FCM push delivery.
5. Run `npm run android`.

Printer hardware is intentionally adapter-based. Select and implement the adapter after confirming the exact terminal, printer model, connection method, and paper width.
