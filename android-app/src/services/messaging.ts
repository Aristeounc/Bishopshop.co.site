import { messaging, firestore, COLLECTIONS } from '@/config/firebase';
import { Platform, PermissionsAndroid } from 'react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (result !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

export async function getAndSaveToken(userId: string): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    if (token) {
      await firestore()
        .collection(COLLECTIONS.USERS)
        .doc(userId)
        .update({ fcmToken: token });
    }
    return token;
  } catch {
    return null;
  }
}

export function onTokenRefresh(userId: string) {
  return messaging().onTokenRefresh(async (token) => {
    await firestore()
      .collection(COLLECTIONS.USERS)
      .doc(userId)
      .update({ fcmToken: token });
  });
}

export function onForegroundMessage(handler: (message: any) => void) {
  return messaging().onMessage(handler);
}

export async function subscribeToTopic(topic: string): Promise<void> {
  await messaging().subscribeToTopic(topic);
}

export async function unsubscribeFromTopic(topic: string): Promise<void> {
  await messaging().unsubscribeFromTopic(topic);
}

export interface NotificationChannel {
  id: string;
  name: string;
  description: string;
}

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  {
    id: 'daily_reminder',
    name: 'Daily Training Reminder',
    description: 'Your daily nudge to train at your preferred time',
  },
  {
    id: 'streak_alert',
    name: 'Streak Alerts',
    description: 'Warnings when your training streak is about to expire',
  },
  {
    id: 'achievement',
    name: 'Achievements',
    description: 'Notifications when you earn badges or reach milestones',
  },
  {
    id: 'new_content',
    name: 'New Content',
    description: 'Alerts for new concepts, personas, and features',
  },
];
