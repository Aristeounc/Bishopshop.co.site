import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Badge } from '@/models/types';
import { colors, borderRadius, spacing, typography } from '@/theme';
import { BADGE_TIERS } from '@/utils/constants';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeDisplay({ badge, size = 'md' }: BadgeDisplayProps) {
  const tierInfo = BADGE_TIERS.find((t) => t.tier === badge.tier);
  const isEarned = !!badge.earnedAt;
  const tierColor = tierInfo?.color ?? colors.textMuted;

  const iconSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;

  // Glow animation for earned badges
  const glowOpacity = useSharedValue(0);
  // Pop-in scale for earned badges
  const badgeScale = useSharedValue(isEarned ? 0.8 : 1);

  useEffect(() => {
    if (isEarned) {
      // Pulsing glow
      glowOpacity.value = withRepeat(
        withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
      // Pop-in spring
      badgeScale.value = withSpring(1.0, { damping: 10, stiffness: 200 });
    }
  }, [isEarned]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glowOpacity.value,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        !isEarned && styles.locked,
        isEarned && scaleStyle,
      ]}
      accessibilityLabel={`Badge: ${badge.name}, ${tierInfo?.label ?? badge.tier} tier, ${isEarned ? 'earned' : 'locked'}`}
    >
      <View style={styles.iconWrapper}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              width: iconSize,
              height: iconSize,
              borderColor: tierColor,
            },
            isEarned && {
              shadowColor: tierColor,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 8,
              elevation: 6,
            },
            isEarned && glowStyle,
          ]}
        >
          <Text style={[styles.icon, { fontSize: iconSize * 0.5 }]}>{badge.icon}</Text>
        </Animated.View>
        {!isEarned && (
          <View
            style={[
              styles.lockOverlay,
              {
                right: -(iconSize * 0.08),
                bottom: -(iconSize * 0.08),
              },
            ]}
          >
            <Icon name="lock" size={iconSize * 0.3} color={colors.textMuted} />
          </View>
        )}
      </View>
      <Text style={[styles.name, size === 'sm' && styles.nameSmall]} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={[styles.tier, { color: tierColor }]}>{tierInfo?.label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  locked: {
    opacity: 0.4,
  },
  iconWrapper: {
    position: 'relative',
  },
  iconContainer: {
    borderRadius: borderRadius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  icon: {
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  nameSmall: {
    fontSize: 10,
  },
  tier: {
    ...typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
