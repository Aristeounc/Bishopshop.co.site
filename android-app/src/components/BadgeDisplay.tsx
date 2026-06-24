import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  const iconSize = size === 'sm' ? 32 : size === 'md' ? 48 : 64;

  return (
    <View
      style={[styles.container, !isEarned && styles.locked]}
      accessibilityLabel={`Badge: ${badge.name}, ${tierInfo?.label ?? badge.tier} tier, ${isEarned ? 'earned' : 'locked'}`}
    >
      <View
        style={[
          styles.iconContainer,
          {
            width: iconSize,
            height: iconSize,
            borderColor: tierInfo?.color ?? colors.textMuted,
          },
        ]}
      >
        <Text style={[styles.icon, { fontSize: iconSize * 0.5 }]}>{badge.icon}</Text>
      </View>
      <Text style={[styles.name, size === 'sm' && styles.nameSmall]} numberOfLines={1}>
        {badge.name}
      </Text>
      <Text style={[styles.tier, { color: tierInfo?.color }]}>{tierInfo?.label}</Text>
    </View>
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
