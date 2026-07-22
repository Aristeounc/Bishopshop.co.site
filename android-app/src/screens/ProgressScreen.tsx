import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { BadgeDisplay } from '@/components/BadgeDisplay';
import { ProgressRing } from '@/components/ProgressRing';
import { useStore } from '@/store/useStore';
import { BELT_LEVELS, SKILL_TRACKS } from '@/utils/constants';
import { getAverageElo, getBeltForElo, getStreakEmoji } from '@/utils/helpers';
import { logScreenView } from '@/services/analytics';
import { Badge, BadgeTier } from '@/models/types';

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_session', name: 'First Step', description: 'Complete your first sparring session', icon: '🎯', tier: 'emerging', requirement: { type: 'sessions_completed', target: 1 } },
  { id: 'ten_sessions', name: 'Getting Warm', description: 'Complete 10 sparring sessions', icon: '🔥', tier: 'developing', requirement: { type: 'sessions_completed', target: 10 } },
  { id: 'fifty_sessions', name: 'Iron Sharpens Iron', description: 'Complete 50 sparring sessions', icon: '⚔️', tier: 'proficient', requirement: { type: 'sessions_completed', target: 50 } },
  { id: 'elo_300', name: 'Rising Star', description: 'Reach 300 average ELO', icon: '⭐', tier: 'developing', requirement: { type: 'elo_reached', target: 300 } },
  { id: 'elo_500', name: 'Contender', description: 'Reach 500 average ELO', icon: '💎', tier: 'proficient', requirement: { type: 'elo_reached', target: 500 } },
  { id: 'elo_1000', name: 'Elite', description: 'Reach 1000 average ELO', icon: '👑', tier: 'advanced', requirement: { type: 'elo_reached', target: 1000 } },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day training streak', icon: '📅', tier: 'developing', requirement: { type: 'streak_days', target: 7 } },
  { id: 'streak_30', name: 'Monthly Master', description: 'Maintain a 30-day training streak', icon: '🏆', tier: 'advanced', requirement: { type: 'streak_days', target: 30 } },
  { id: 'all_personas', name: 'Full Roster', description: 'Spar with all 6 personas', icon: '🎭', tier: 'proficient', requirement: { type: 'persona_defeated', target: 6 } },
  { id: 'concepts_10', name: 'Scholar', description: 'Master 10 concepts', icon: '📚', tier: 'developing', requirement: { type: 'concepts_mastered', target: 10 } },
  { id: 'concepts_25', name: 'Philosopher', description: 'Master 25 concepts', icon: '🧠', tier: 'advanced', requirement: { type: 'concepts_mastered', target: 25 } },
  { id: 'concepts_33', name: 'Grandmaster', description: 'Master all 33 concepts', icon: '🌟', tier: 'master', requirement: { type: 'concepts_mastered', target: 33 } },
];

export function ProgressScreen() {
  const user = useStore((s) => s.user);
  const skillProgress = useStore((s) => s.skillProgress);
  const badges = useStore((s) => s.badges);

  useEffect(() => {
    logScreenView('Progress');
  }, []);

  const avgElo = getAverageElo(
    Object.fromEntries(Object.entries(skillProgress).map(([k, v]) => [k, v.elo])),
  );
  const beltLevel = getBeltForElo(avgElo);
  const beltInfo = BELT_LEVELS.find((b) => b.level === beltLevel);
  const earnedBadgeIds = new Set(badges.filter((b) => b.earnedAt).map((b) => b.id));

  const displayBadges = DEFAULT_BADGES.map((badge) => ({
    ...badge,
    earnedAt: earnedBadgeIds.has(badge.id)
      ? badges.find((b) => b.id === badge.id)?.earnedAt
      : undefined,
  }));

  const tierGroups: Record<BadgeTier, Badge[]> = {
    emerging: [],
    developing: [],
    proficient: [],
    advanced: [],
    master: [],
  };
  for (const badge of displayBadges) {
    tierGroups[badge.tier].push(badge);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Progress</Text>

      <Card style={styles.overviewCard} variant="elevated">
        <View style={styles.overviewRow}>
          <ProgressRing
            progress={avgElo / 2000}
            size={90}
            color={beltInfo?.color ?? colors.primary}
            label={`${avgElo}`}
            sublabel="ELO"
          />
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>{user?.totalSessions ?? 0}</Text>
              <Text style={styles.overviewLabel}>Sessions</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {getStreakEmoji(user?.currentStreak ?? 0)} {user?.currentStreak ?? 0}
              </Text>
              <Text style={styles.overviewLabel}>Streak</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewValue}>
                {badges.filter((b) => b.earnedAt).length}/{DEFAULT_BADGES.length}
              </Text>
              <Text style={styles.overviewLabel}>Badges</Text>
            </View>
          </View>
        </View>
      </Card>

      {(user?.totalSessions ?? 0) === 0 && (
        <Card style={styles.nudgeCard}>
          <Text style={styles.nudgeText}>
            Complete your first sparring session or daily program to start tracking progress.
          </Text>
        </Card>
      )}

      <Text style={styles.sectionTitle}>Skill Radar</Text>
      <Card style={styles.radarCard}>
        {SKILL_TRACKS.map((track) => {
          const progress = skillProgress[track.id];
          const elo = progress?.elo ?? 0;
          const percent = Math.min(100, (elo / 2000) * 100);
          return (
            <View key={track.id} style={styles.radarRow}>
              <View style={[styles.radarDot, { backgroundColor: track.color }]} />
              <Text style={styles.radarLabel}>{track.name}</Text>
              <View style={styles.radarBarContainer}>
                <View
                  style={[
                    styles.radarBar,
                    { width: `${percent}%`, backgroundColor: track.color },
                  ]}
                />
              </View>
              <Text style={[styles.radarValue, { color: track.color }]}>
                {elo}
              </Text>
            </View>
          );
        })}
      </Card>

      <Text style={styles.sectionTitle}>Badges</Text>
      {(Object.entries(tierGroups) as [BadgeTier, Badge[]][]).map(([tier, tierBadges]) => (
        <View key={tier}>
          <Text style={styles.tierLabel}>{tier.charAt(0).toUpperCase() + tier.slice(1)}</Text>
          <View style={styles.badgeGrid}>
            {tierBadges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} size="md" />
            ))}
          </View>
        </View>
      ))}
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
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  overviewCard: {
    marginBottom: spacing.lg,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  overviewStats: {
    flex: 1,
    gap: spacing.sm,
  },
  overviewStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewValue: {
    ...typography.h3,
    color: colors.text,
  },
  overviewLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  radarCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  radarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  radarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radarLabel: {
    ...typography.bodySmall,
    color: colors.text,
    width: 70,
  },
  radarBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
  },
  radarBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  radarValue: {
    ...typography.caption,
    fontWeight: '700',
    width: 36,
    textAlign: 'right',
  },
  tierLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  nudgeCard: {
    padding: spacing.md,
    marginBottom: spacing.lg,
    backgroundColor: colors.accent + '15',
    borderRadius: borderRadius.lg,
  },
  nudgeText: {
    ...typography.body,
    color: colors.accent,
    textAlign: 'center',
  },
});
