import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { ProgressRing } from '@/components/ProgressRing';
import { useStore } from '@/store/useStore';
import { SKILL_TRACKS, BELT_LEVELS } from '@/utils/constants';
import { getGreeting, getStreakEmoji, getAverageElo, getBeltForElo } from '@/utils/helpers';
import { logScreenView } from '@/services/analytics';

interface HomeScreenProps {
  navigation: any;
}

export function HomeScreen({ navigation }: HomeScreenProps) {
  const user = useStore((s) => s.user);
  const skillProgress = useStore((s) => s.skillProgress);

  useEffect(() => {
    logScreenView('Home');
  }, []);

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
          <Text style={styles.streakEmoji}>
            {getStreakEmoji(user?.currentStreak ?? 0)}
          </Text>
          <Text style={styles.streakCount}>{user?.currentStreak ?? 0}</Text>
        </TouchableOpacity>
      </View>

      <Card style={styles.beltCard} variant="elevated">
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
      </Card>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.accent + '15' }]}
            onPress={() => navigation.navigate('Program')}
          >
            <Icon name="calendar-check-outline" size={28} color={colors.accent} />
            <Text style={styles.actionLabel}>Daily Program</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}
            onPress={() => navigation.navigate('Sparring')}
          >
            <Icon name="sword-cross" size={28} color={colors.primary} />
            <Text style={styles.actionLabel}>Start Sparring</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.error + '15' }]}
            onPress={() => navigation.navigate('SpotInfluence')}
          >
            <Icon name="eye-outline" size={28} color={colors.error} />
            <Text style={styles.actionLabel}>Spot Influence</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.success + '15' }]}
            onPress={() => navigation.navigate('Progress')}
          >
            <Icon name="trophy-outline" size={28} color={colors.success} />
            <Text style={styles.actionLabel}>Badges</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Training Activities</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FF6B6B' + '15' }]}
            onPress={() => navigation.navigate('ConversationAutopsy')}
          >
            <Icon name="magnify" size={28} color="#FF6B6B" />
            <Text style={styles.actionLabel}>Autopsy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#45B7D1' + '15' }]}
            onPress={() => navigation.navigate('SubtextTranslator')}
          >
            <Icon name="translate" size={28} color="#45B7D1" />
            <Text style={styles.actionLabel}>Subtext</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#FF8C42' + '15' }]}
            onPress={() => navigation.navigate('EscalationGauntlet')}
          >
            <Icon name="fire" size={28} color="#FF8C42" />
            <Text style={styles.actionLabel}>Gauntlet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#7B68EE' + '15' }]}
            onPress={() => navigation.navigate('TacticForecast')}
          >
            <Icon name="crystal-ball" size={28} color="#7B68EE" />
            <Text style={styles.actionLabel}>Forecast</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    ...shadows.sm,
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
