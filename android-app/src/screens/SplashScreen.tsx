import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

interface SplashScreenProps {
  navigation: any;
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const user = useStore((s) => s.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        navigation.replace('Login');
      } else if (user && !user.hasCompletedOnboarding) {
        navigation.replace('Onboarding');
      } else {
        navigation.replace('Main');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, user, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>P</Text>
        </View>
        <Text style={styles.logoText}>Peitho</Text>
      </View>
      <Text style={styles.tagline}>The Art of Influence</Text>
      <Text style={styles.subtitle}>Master every conversation.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logoMark: {
    width: 80,
    height: 80,
    backgroundColor: colors.accent,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 48,
    color: colors.background,
  },
  logoText: {
    ...typography.h1,
    color: colors.text,
  },
  tagline: {
    ...typography.h3,
    color: colors.accent,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
