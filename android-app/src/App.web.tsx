import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useStore } from '@/store/useStore';
import { colors } from '@/theme';

export function App() {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);

  useEffect(() => {
    setUser({
      id: 'web-preview',
      email: 'preview@peitho.app',
      displayName: 'Preview User',
      subscription: 'core_gym',
      beltLevel: 'green',
      totalSessions: 42,
      currentStreak: 7,
      longestStreak: 14,
      freezeSlotsRemaining: 2,
      joinedAt: '2026-01-01',
      preferences: {
        notificationsEnabled: false,
        dailyReminderTime: '09:00',
        hapticFeedback: false,
        darkMode: true,
        articulationIntensity: 'standard',
      },
    });
    setLoading(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, maxWidth: 430, margin: 'auto' as any, width: '100%', height: '100%' }}>
      <AppNavigator />
    </View>
  );
}

export default App;
