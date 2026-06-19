import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

interface SplashScreenProps {
  navigation: any;
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Main' : 'Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>A</Text>
        </View>
        <Text style={styles.logoText}>Attune AI</Text>
      </View>
      <Text style={styles.tagline}>The Conversation Gym</Text>
      <Text style={styles.subtitle}>Train your words. Sharpen your edge.</Text>
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
