import { Linking } from 'react-native';
import * as Application from 'expo-application';

import { API_BASE_URL } from '../config/api';

/** This installed app's version, e.g. "1.1.0" (from the Android build itself). */
export const APP_VERSION = Application.nativeApplicationVersion || '0.0.0';

const PLAY_STORE_APP_URL = `market://details?id=${Application.applicationId || 'com.medbangladesh.app'}`;

/** Compares "1.2.0"-style versions: negative if a < b, 0 if equal, positive if a > b. */
export const compareVersions = (a, b) => {
  const left = String(a || '0').split('.').map((part) => parseInt(part, 10) || 0);
  const right = String(b || '0').split('.').map((part) => parseInt(part, 10) || 0);

  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0);

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
};

/**
 * Asks the server for the latest app version. Resolves to null when no update is needed
 * (or the server cannot be reached), otherwise to { required, message, playStoreUrl, downloadUrl }.
 */
export const checkForAppUpdateAsync = async (headers) => {
  try {
    const response = await fetch(`${API_BASE_URL}/app-version`, { headers });

    if (!response.ok) {
      return null;
    }

    const info = (await response.json()).data || {};

    if (!info.latest_version || compareVersions(APP_VERSION, info.latest_version) >= 0) {
      return null;
    }

    return {
      required: Boolean(info.minimum_version) && compareVersions(APP_VERSION, info.minimum_version) < 0,
      latestVersion: info.latest_version,
      message: info.message,
      playStoreUrl: info.play_store_url,
      downloadUrl: info.download_url,
    };
  } catch {
    return null;
  }
};

/**
 * Opens the app's page in the Play Store app; if the phone has no Play Store,
 * opens the download link instead (then the Play Store website as a last resort).
 */
export const openAppUpdateAsync = async (update) => {
  const candidates = [PLAY_STORE_APP_URL, update?.downloadUrl, update?.playStoreUrl].filter(Boolean);

  for (const url of candidates) {
    try {
      await Linking.openURL(url);
      return;
    } catch {
      // Try the next link.
    }
  }
};
