import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { SkillTrack, SkillProgress } from '@/models/types';
import { colors, borderRadius, spacing, typography } from '@/theme';
import { formatEloChange } from '@/utils/helpers';

interface SkillCardProps {
  track: SkillTrack;
  progress: SkillProgress;
  onPress?: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SkillCard({ track, progress, onPress, index = 0 }: SkillCardProps) {
  const eloPercent = Math.min(100, (progress.elo / 2000) * 100);

  // Animate progress bar width on mount
  const barWidth = useSharedValue(0);

  useEffect(() => {
    barWidth.value = withDelay(
      index * 100,
      withTiming(eloPercent, {
        duration: 600,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [eloPercent, index]);

  const barAnimatedStyle = useAnimatedStyle(() => ({
    width: `${barWidth.value}%` as any,
  }));

  // Press feedback: subtle scale-down
  const scale = useSharedValue(1);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  // Derive gradient colors from track color (full opacity -> 60% opacity)
  const gradientStart = track.color;
  const gradientEnd = track.color + '99'; // ~60% opacity hex suffix

  return (
    <AnimatedPressable
      style={[styles.container, containerAnimatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={`${track.name}, ELO ${progress.elo}, ${progress.sessionsCompleted} sessions completed`}
    >
      <View style={[styles.iconContainer, { backgroundColor: track.color + '20' }]}>
        <Icon name={track.icon} size={24} color={track.color} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{track.name}</Text>
          <Text style={[styles.elo, { color: track.color }]}>{progress.elo}</Text>
        </View>

        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFillWrapper, barAnimatedStyle]}>
            <LinearGradient
              colors={[gradientStart, gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressGradient}
            />
          </Animated.View>
        </View>

        <Text style={styles.sessions}>
          {progress.sessionsCompleted} sessions completed
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    fontSize: 16,
  },
  elo: {
    ...typography.button,
    fontSize: 18,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  progressFillWrapper: {
    height: '100%',
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    borderRadius: borderRadius.full,
  },
  sessions: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
