# Sahar Staff Android

React Native CLI companion app for Sahar staff order handling. It talks only to the Sahar HTTPS staff API and never connects to MySQL.

## Setup

1. Install Android Studio, JDK, and React Native CLI prerequisites.
2. Run `npm install` inside this folder.
3. Set the API base URL in `src/config.ts`.
4. Add Firebase Android files before enabling FCM push delivery.
5. Run `npm run android`.

Printer hardware is intentionally adapter-based. Select and implement the adapter after confirming the exact terminal, printer model, connection method, and paper width.

## Local Android run

Start the website first from the repository root:

```powershell
npm.cmd run dev
```

For Android emulator testing, `src/config.ts` should use:

```ts
export const API_BASE_URL = "http://10.0.2.2:3000";
```

Then run the Android app from this folder:

```powershell
npm.cmd run start
npm.cmd run android
```

If `npm.cmd run android` says no devices are attached, open an emulator in Android Studio or connect a device with USB debugging enabled, then confirm:

```powershell
adb devices
```

## Current push/printer status

FCM native packages are intentionally not installed in this local runnable version because their generated New Architecture C++ paths exceed Windows MAX_PATH in this long workspace path. The push action currently clears/registers a null token and local new-order alert vibration still works.

Receipt formatting exists, but the actual printer adapter is still pending the real terminal/printer model and connection method.
