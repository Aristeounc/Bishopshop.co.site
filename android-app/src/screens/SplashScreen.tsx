import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors, typography, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

interface SplashScreenProps {
  navigation: any;
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  // --- Shared values for staggered fade-in + slide-up ---
  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);
  const loaderOpacity = useSharedValue(0);

  // --- Shared value for logo pulse ---
  const logoPulseScale = useSharedValue(1);

  useEffect(() => {
    const timingConfig = { duration: 600, easing: Easing.out(Easing.cubic) };

    // Staggered entrance: logo -> tagline -> subtitle -> loader
    logoOpacity.value = withTiming(1, timingConfig);
    logoTranslateY.value = withTiming(0, timingConfig);

    taglineOpacity.value = withDelay(200, withTiming(1, timingConfig));
    taglineTranslateY.value = withDelay(200, withTiming(0, timingConfig));

    subtitleOpacity.value = withDelay(400, withTiming(1, timingConfig));
    subtitleTranslateY.value = withDelay(400, withTiming(0, timingConfig));

    loaderOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));

    // Logo pulse: breathing scale between 1.0 and 1.05
    logoPulseScale.value = withRepeat(
      withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1, // infinite
      true, // reverse
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(isAuthenticated ? 'Main' : 'Login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigation]);

  // --- Animated styles ---
  const logoContainerStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: logoTranslateY.value }],
  }));

  const logoMarkPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoPulseScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const loaderStyle = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#0D1117', '#161B22', '#0D1117']}
      style={styles.container}
    >
      <Animated.View style={[styles.logoContainer, logoContainerStyle]}>
        <Animated.View style={[styles.logoMark, logoMarkPulseStyle]}>
          <Text style={styles.logoLetter}>P</Text>
        </Animated.View>
        <Text style={styles.logoText}>Peitho</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        The Art of Influence
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, subtitleStyle]}>
        Master every conversation.
      </Animated.Text>
      <Animated.View style={[styles.loader, loaderStyle]}>
        <ActivityIndicator size="small" color={colors.accent} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loader: {
    marginTop: spacing.xl,
  },
});
