import React, { useCallback } from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { colors, borderRadius, typography, spacing } from '@/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

const GRADIENT_COLORS: Record<string, string[]> = {
  primary: ['#8E44AD', '#6C3483'],
  accent: ['#D4AF37', '#B8961E'],
};

const GLOW_SHADOWS: Record<string, ViewStyle> = {
  primary: {
    shadowColor: '#8E44AD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  accent: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_CONFIG);
    opacity.value = withSpring(0.92, SPRING_CONFIG);
  }, [scale, opacity]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_CONFIG);
    opacity.value = withSpring(1, SPRING_CONFIG);
  }, [scale, opacity]);

  const hasGradient = variant === 'primary' || variant === 'accent';
  const hasGlow = hasGradient && size === 'lg';

  const buttonStyles: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}` as keyof typeof styles] as ViewStyle,
    hasGlow ? (GLOW_SHADOWS[variant] as ViewStyle) : undefined,
    disabled ? styles.disabled : undefined,
    style,
  ].filter(Boolean) as ViewStyle[];

  const labelStyles = [
    styles.label,
    styles[`label_${variant}` as keyof typeof styles],
    styles[`labelSize_${size}` as keyof typeof styles],
    textStyle,
  ];

  const content = loading ? (
    <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textOnPrimary} />
  ) : (
    <>
      {icon}
      <Text style={labelStyles}>{title}</Text>
    </>
  );

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: disabled || loading }}
      >
        {hasGradient ? (
          <LinearGradient
            colors={GRADIENT_COLORS[variant]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={buttonStyles}
          >
            {content}
          </LinearGradient>
        ) : (
          <View style={buttonStyles}>{content}</View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.md,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md - 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
  },
  label_primary: {
    color: colors.textOnPrimary,
  },
  label_secondary: {
    color: colors.text,
  },
  label_accent: {
    color: colors.textOnAccent,
  },
  label_outline: {
    color: colors.primary,
  },
  label_ghost: {
    color: colors.primary,
  },
  labelSize_sm: {
    fontSize: 14,
  },
  labelSize_md: {
    fontSize: 16,
  },
  labelSize_lg: {
    fontSize: 18,
  },
});
