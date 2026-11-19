import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { API_BASE_URL } from '../config/api';

export const DEFAULT_CHANNEL_ID = 'default';

// Show notifications as a popup even while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Android 13+ only shows the permission prompt after a channel exists,
// so the channel must be created before asking for permission.
const ensureAndroidChannel = async () => {
  if (Platform.OS !== 'android') {
    return;
  }

  await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL_ID, {
    name: 'Offers & Medicine',
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: '#1A7F5A',
    vibrationPattern: [0, 250, 250, 250],
  });
};

const permissionResult = (permission) => ({
  granted: permission.status === 'granted',
  // false once the user has denied too often; then only the phone's Settings can enable it.
  canAskAgain: permission.canAskAgain !== false,
});

/** Current notification permission, without showing any prompt. */
export const getNotificationPermissionAsync = async () => {
  try {
    await ensureAndroidChannel();
    return permissionResult(await Notifications.getPermissionsAsync());
  } catch {
    return { granted: false, canAskAgain: true };
  }
};

/** Shows Android's "Allow notifications?" prompt (only if it can still be shown). */
export const requestNotificationPermissionAsync = async () => {
  try {
    await ensureAndroidChannel();
    return permissionResult(await Notifications.requestPermissionsAsync());
  } catch {
    return { granted: false, canAskAgain: true };
  }
};

/** This phone's FCM token, or null if it is not available (call only after permission is granted). */
export const getDeviceTokenAsync = async () => {
  try {
    const devicePushToken = await Notifications.getDevicePushTokenAsync();
    return devicePushToken.data || null;
  } catch {
    return null;
  }
};

const sendDeviceTokenRequest = async (method, token, headers) => {
  const response = await fetch(`${API_BASE_URL}/device-tokens`, {
    method,
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, platform: Platform.OS }),
  });

  return response.ok;
};

/** Saves this phone's FCM token on the server for the logged-in customer. Returns true on success. */
export const saveDeviceTokenAsync = (token, headers) =>
  sendDeviceTokenRequest('POST', token, headers).catch(() => false);

/** Removes this phone's FCM token from the server (on logout). Returns true on success. */
export const removeDeviceTokenAsync = (token, headers) =>
  sendDeviceTokenRequest('DELETE', token, headers).catch(() => false);

/** Calls `onToken` whenever FCM gives this phone a new token. Returns an unsubscribe function. */
export const listenForTokenChanges = (onToken) => {
  const subscription = Notifications.addPushTokenListener((devicePushToken) => {
    onToken(devicePushToken.data);
  });

  return () => subscription.remove();
};

/** Loads the customer's notification inbox: { data: [...], unread_count }. */
export const fetchNotificationsAsync = async (headers) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, { headers });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || 'Could not load notifications.');
  }

  return { data: payload.data || [], unreadCount: Number(payload.unread_count || 0) };
};

/** Marks every notification as read for the logged-in customer. */
export const markNotificationsReadAsync = (headers) =>
  fetch(`${API_BASE_URL}/notifications/read`, { method: 'POST', headers })
    .then((response) => response.ok)
    .catch(() => false);

/** Loads one product by id, or null if it no longer exists. */
export const fetchProductAsync = async (productId, headers) => {
  const response = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}`, { headers });

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data || null;
};

/**
 * Reads our custom data (product_id, notification_id) from a tapped notification.
 * Android delivers it in different places depending on whether the app was open or closed.
 */
export const getNotificationData = (notification) => {
  const request = notification?.request || {};
  const content = request.content || {};
  let data = { ...(request.trigger?.remoteMessage?.data || {}), ...(content.data || {}) };

  if (content.dataString) {
    try {
      data = { ...data, ...JSON.parse(content.dataString) };
    } catch {
      // Ignore malformed data.
    }
  }

  const productId = Number(data.product_id);
  const notificationId = Number(data.notification_id);

  return {
    productId: Number.isInteger(productId) && productId > 0 ? productId : null,
    notificationId: Number.isInteger(notificationId) && notificationId > 0 ? notificationId : null,
  };
};

/** Fires when a notification arrives while the app is open. Returns an unsubscribe function. */
export const listenForIncomingNotifications = (onNotification) => {
  const subscription = Notifications.addNotificationReceivedListener(onNotification);
  return () => subscription.remove();
};

/** Fires when the customer taps a notification. Returns an unsubscribe function. */
export const listenForNotificationTaps = (onTap) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(onTap);
  return () => subscription.remove();
};

/** The notification tap that opened the app from a closed state (if any), then forgets it. */
export const takeLaunchNotificationTapAsync = async () => {
  try {
    const response = await Notifications.getLastNotificationResponseAsync();

    if (response) {
      await Notifications.clearLastNotificationResponseAsync();
    }

    return response;
  } catch {
    return null;
  }
};
