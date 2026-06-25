import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { useStore } from '@/store/useStore';
import { SKILL_TRACKS, BELT_LEVELS } from '@/utils/constants';
import { getGreeting, getStreakEmoji, getAverageElo, getBeltForElo } from '@/utils/helpers';
import { logScreenView } from '@/services/analytics';

// ---------------------------------------------------------------------------
// AnimatedActionCard — reusable wrapper with press-scale + staggered entrance
// ---------------------------------------------------------------------------

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface AnimatedActionCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress: () => void;
  delay?: number;
}

function AnimatedActionCard({ children, style, onPress, delay = 0 }: AnimatedActionCardProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const timingConfig = { duration: 500, easing: Easing.out(Easing.cubic) };
    opacity.value = withDelay(delay, withTiming(1, timingConfig));
    translateY.value = withDelay(delay, withTiming(0, timingConfig));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 120 });
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 150 });
  }, []);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// HomeScreen
// ---------------------------------------------------------------------------

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const user = useStore((s) => s.user);
  const skillProgress = useStore((s) => s.skillProgress);

  useEffect(() => {
    logScreenView('Home');
  }, []);

  // --- Belt card staggered entrance ---
  const beltCardOpacity = useSharedValue(0);
  const beltCardTranslateY = useSharedValue(20);

  // --- Streak glow pulse ---
  const streakGlowOpacity = useSharedValue(0.3);

  useEffect(() => {
    const timingConfig = { duration: 500, easing: Easing.out(Easing.cubic) };

    // Belt card fades in first
    beltCardOpacity.value = withTiming(1, timingConfig);
    beltCardTranslateY.value = withTiming(0, timingConfig);

    // Streak glow pulse (only matters visually when streak > 0)
    streakGlowOpacity.value = withRepeat(
      withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const beltCardAnimStyle = useAnimatedStyle(() => ({
    opacity: beltCardOpacity.value,
    transform: [{ translateY: beltCardTranslateY.value }],
  }));

  const streakGlowStyle = useAnimatedStyle(() => ({
    borderWidth: 1.5,
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
    shadowOpacity: streakGlowOpacity.value,
    opacity: streakGlowOpacity.value,
  }));

  const avgElo = getAverageElo(
    Object.fromEntries(Object.entries(skillProgress).map(([k, v]) => [k, v.elo])),
  );
  const currentBelt = getBeltForElo(avgElo);
  const beltInfo = BELT_LEVELS.find((b) => b.level === currentBelt);
  const nextBelt = BELT_LEVELS.find((b) => b.minElo > avgElo);
  const progressToNextBelt = nextBelt
    ? (avgElo - (beltInfo?.minElo ?? 0)) / (nextBelt.minElo - (beltInfo?.minElo ?? 0))
    : 1;

  const topSkills = Object.values(skillProgress)
    .sort((a, b) => b.elo - a.elo)
    .slice(0, 3);

  const currentStreak = user?.currentStreak ?? 0;

  // Action cards base stagger offset — belt card appears at 0ms, action cards start after
  const BASE_DELAY = 200; // ms after belt card
  const STAGGER = 80; // ms between each action card

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}{user?.displayName ? `, ${user.displayName}` : ''}
          </Text>
          <Text style={styles.subtitle}>Ready to train?</Text>
        </View>
        <TouchableOpacity
          style={styles.streakBadge}
          onPress={() => navigation.navigate('Progress')}
        >
          {currentStreak > 0 && (
            <Animated.View style={[StyleSheet.absoluteFill, styles.streakGlowOverlay, streakGlowStyle]} />
          )}
          <Text style={styles.streakEmoji}>
            {getStreakEmoji(currentStreak)}
          </Text>
          <Text style={styles.streakCount}>{currentStreak}</Text>
        </TouchableOpacity>
      </View>

      {/* Belt card with gradient background */}
      <Animated.View style={[styles.beltCard, beltCardAnimStyle]}>
        <LinearGradient
          colors={[
            (beltInfo?.color ?? colors.primary) + '10',
            (beltInfo?.color ?? colors.primary) + '05',
          ]}
          style={styles.beltCardGradient}
        >
          <View style={styles.beltRow}>
            <ProgressRing
              progress={progressToNextBelt}
              size={100}
              color={beltInfo?.color ?? colors.primary}
              label={`${avgElo}`}
              sublabel="AVG ELO"
            />
            <View style={styles.beltInfo}>
              <Text style={styles.beltName}>{beltInfo?.name ?? 'White Belt'}</Text>
              {nextBelt && (
                <Text style={styles.nextBelt}>
                  {nextBelt.minElo - avgElo} ELO to {nextBelt.name}
                </Text>
              )}
              <Text style={styles.sessionsCount}>
                {user?.totalSessions ?? 0} total sessions
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: colors.accent + '15' }]}
            onPress={() => navigation.navigate('Program')}
            delay={BASE_DELAY + STAGGER * 0}
          >
            <Icon name="calendar-check-outline" size={28} color={colors.accent} />
            <Text style={styles.actionLabel}>Daily Program</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}
            onPress={() => navigation.navigate('Sparring')}
            delay={BASE_DELAY + STAGGER * 1}
          >
            <Icon name="sword-cross" size={28} color={colors.primary} />
            <Text style={styles.actionLabel}>Start Sparring</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: colors.error + '15' }]}
            onPress={() => navigation.navigate('SpotInfluence')}
            delay={BASE_DELAY + STAGGER * 2}
          >
            <Icon name="eye-outline" size={28} color={colors.error} />
            <Text style={styles.actionLabel}>Spot Influence</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: colors.success + '15' }]}
            onPress={() => navigation.navigate('Progress')}
            delay={BASE_DELAY + STAGGER * 3}
          >
            <Icon name="trophy-outline" size={28} color={colors.success} />
            <Text style={styles.actionLabel}>Badges</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: colors.info + '15' }]}
            onPress={() => navigation.navigate('Concepts')}
            delay={BASE_DELAY + STAGGER * 4}
          >
            <Icon name="book-open-variant" size={28} color={colors.info} />
            <Text style={styles.actionLabel}>Concepts</Text>
          </AnimatedActionCard>
        </View>
      </View>

      {/* Training Activities */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Training Activities</Text>
        <View style={styles.actionsGrid}>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#FF6B6B' + '15' }]}
            onPress={() => navigation.navigate('ConversationAutopsy')}
            delay={BASE_DELAY + STAGGER * 5}
          >
            <Icon name="magnify" size={28} color="#FF6B6B" />
            <Text style={styles.actionLabel}>Autopsy</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#45B7D1' + '15' }]}
            onPress={() => navigation.navigate('SubtextTranslator')}
            delay={BASE_DELAY + STAGGER * 6}
          >
            <Icon name="translate" size={28} color="#45B7D1" />
            <Text style={styles.actionLabel}>Subtext</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#FF8C42' + '15' }]}
            onPress={() => navigation.navigate('EscalationGauntlet')}
            delay={BASE_DELAY + STAGGER * 7}
          >
            <Icon name="fire" size={28} color="#FF8C42" />
            <Text style={styles.actionLabel}>Gauntlet</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#7B68EE' + '15' }]}
            onPress={() => navigation.navigate('TacticForecast')}
            delay={BASE_DELAY + STAGGER * 8}
          >
            <Icon name="crystal-ball" size={28} color="#7B68EE" />
            <Text style={styles.actionLabel}>Forecast</Text>
          </AnimatedActionCard>
        </View>
      </View>

      {/* Exercises */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Exercises</Text>
        <View style={styles.actionsGrid}>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#D4AF37' + '15' }]}
            onPress={() => navigation.navigate('FlashJudgment')}
            delay={BASE_DELAY + STAGGER * 9}
          >
            <Icon name="flash" size={28} color="#D4AF37" />
            <Text style={styles.actionLabel}>Flash Judgment</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#D93025' + '15' }]}
            onPress={() => navigation.navigate('RedFlagRally')}
            delay={BASE_DELAY + STAGGER * 10}
          >
            <Icon name="flag" size={28} color="#D93025" />
            <Text style={styles.actionLabel}>Red Flag Rally</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#7B68EE' + '15' }]}
            onPress={() => navigation.navigate('EmotionalDecoder')}
            delay={BASE_DELAY + STAGGER * 11}
          >
            <Icon name="brain" size={28} color="#7B68EE" />
            <Text style={styles.actionLabel}>Decoder</Text>
          </AnimatedActionCard>
          <AnimatedActionCard
            style={[styles.actionCard, { backgroundColor: '#2EA043' + '15' }]}
            onPress={() => navigation.navigate('FirstResponse')}
            delay={BASE_DELAY + STAGGER * 12}
          >
            <Icon name="lightning-bolt" size={28} color="#2EA043" />
            <Text style={styles.actionLabel}>First Response</Text>
          </AnimatedActionCard>
        </View>
      </View>

      {/* Top Skills */}
      <View style={styles.topSkills}>
        <Text style={styles.sectionTitle}>Your Strongest Skills</Text>
        {topSkills.map((sp) => {
          const track = SKILL_TRACKS.find((t) => t.id === sp.trackId);
          if (!track) return null;
          return (
            <TouchableOpacity
              key={sp.trackId}
              style={styles.skillRow}
              onPress={() => navigation.navigate('Skills')}
            >
              <View style={[styles.skillDot, { backgroundColor: track.color }]} />
              <Text style={styles.skillName}>{track.name}</Text>
              <Text style={[styles.skillElo, { color: track.color }]}>{sp.elo}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  streakBadge: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  streakGlowOverlay: {
    borderRadius: borderRadius.lg,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakCount: {
    ...typography.button,
    color: colors.accent,
    marginTop: spacing.xs,
  },
  beltCard: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
    borderTopWidth: 1,
    borderTopColor: colors.accent + '30',
  },
  beltCardGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  beltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  beltInfo: {
    flex: 1,
  },
  beltName: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  nextBelt: {
    ...typography.bodySmall,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  sessionsCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  quickActions: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionLabel: {
    ...typography.label,
    color: colors.text,
  },
  topSkills: {
    marginBottom: spacing.lg,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  skillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  skillName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  skillElo: {
    ...typography.h3,
  },
});
