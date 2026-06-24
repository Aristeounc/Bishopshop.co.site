import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useStore } from '@/store/useStore';
import { onAuthStateChanged, fetchUserProfile, fetchSkillProgress } from '@/services/auth';
import { requestNotificationPermission, getAndSaveToken, onForegroundMessage } from '@/services/messaging';
import { initializeBilling, setupPurchaseListeners, verifyAndActivateSubscription } from '@/services/billing';
import { setUserProperties } from '@/services/analytics';
import { colors } from '@/theme';

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

    const unsubMessages = onForegroundMessage((_message) => {});

    return () => {
      unsubAuth();
      cleanupPurchases();
      unsubMessages();
    };
  }, []);

  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <AppNavigator />
    </ErrorBoundary>
  );
}
