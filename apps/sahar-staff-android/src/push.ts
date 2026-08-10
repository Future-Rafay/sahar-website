import { PermissionsAndroid, Platform, Vibration } from "react-native";
import messaging from "@react-native-firebase/messaging";

import { registerPushToken } from "./api";

export async function registerDeviceForPush(accessToken: string) {
  if (Platform.OS === "android" && Platform.Version >= 33) {
    await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  }
  const token = await messaging().getToken();
  await registerPushToken(accessToken, token);
}

export function playNewOrderAlert() {
  Vibration.vibrate([0, 250, 120, 250]);
}
