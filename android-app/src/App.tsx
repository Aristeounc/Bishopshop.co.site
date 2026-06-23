import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useStore } from '@/store/useStore';
import { onAuthStateChanged, fetchUserProfile, fetchSkillProgress } from '@/services/auth';
import { requestNotificationPermission, getAndSaveToken, onForegroundMessage } from '@/services/messaging';
import { createNotificationChannels, scheduleDailyReminder, scheduleStreakReminder, parseReminderTime } from '@/services/notifications';
import { initializeBilling, setupPurchaseListeners, verifyAndActivateSubscription } from '@/services/billing';
import { setUserProperties } from '@/services/analytics';
import { colors } from '@/theme';
import notifee from '@notifee/react-native';

LogBox.ignoreLogs(['Reanimated']);

export default function App() {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);
  const setSkillProgress = useStore((s) => s.setSkillProgress);
  const setNotificationToken = useStore((s) => s.setNotificationToken);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(async (uid) => {
      if (uid) {
        try {
          const [user, progress] = await Promise.all([
            fetchUserProfile(uid),
            fetchSkillProgress(uid),
          ]);
          setUser(user);
          setSkillProgress(progress);

          setUserProperties({
            subscription_tier: user.subscription,
            belt_level: user.beltLevel,
          });

          const permissionGranted = await requestNotificationPermission();
          if (permissionGranted) {
            const token = await getAndSaveToken(uid);
            setNotificationToken(token);
            await createNotificationChannels();
            if (user.preferences.notificationsEnabled) {
              const { hour, minute } = parseReminderTime(user.preferences.dailyReminderTime);
              await scheduleDailyReminder(hour, minute);
              await scheduleStreakReminder();
            }
          }
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    initializeBilling();

    const cleanupPurchases = setupPurchaseListeners(
      async (purchase) => {
        const uid = useStore.getState().user?.id;
        if (uid && purchase.productId) {
          const tier = await verifyAndActivateSubscription(
            uid,
            purchase.productId,
            purchase.transactionId ?? '',
          );
          const currentUser = useStore.getState().user;
          if (currentUser) {
            setUser({ ...currentUser, subscription: tier });
          }
        }
      },
      (_error) => {},
    );

    const unsubMessages = onForegroundMessage(async (message) => {
      if (message.notification) {
        await notifee.displayNotification({
          title: message.notification.title ?? 'Peitho',
          body: message.notification.body ?? '',
          android: {
            channelId: 'daily_reminder',
            smallIcon: 'ic_notification',
            pressAction: { id: 'default' },
          },
        });
      }
    });

    return () => {
      unsubAuth();
      cleanupPurchases();
      unsubMessages();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </>
  );
}
