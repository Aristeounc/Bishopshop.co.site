import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography, spacing } from '@/theme';
import { SkillCard } from '@/components/SkillCard';
import { useStore } from '@/store/useStore';
import { SKILL_TRACKS } from '@/utils/constants';
import { getAverageElo } from '@/utils/helpers';
import { logScreenView } from '@/services/analytics';

export function SkillsScreen() {
  const skillProgress = useStore((s) => s.skillProgress);

  useEffect(() => {
    logScreenView('Skills');
  }, []);

  const avgElo = getAverageElo(
    Object.fromEntries(Object.entries(skillProgress).map(([k, v]) => [k, v.elo])),
  );
  const totalSessions = Object.values(skillProgress).reduce(
    (sum, sp) => sum + sp.sessionsCompleted,
    0,
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Skill Tracks</Text>
      <Text style={styles.subtitle}>
        8 dimensions of communication mastery
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{avgElo}</Text>
          <Text style={styles.statLabel}>Avg ELO</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalSessions}</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {Object.values(skillProgress).reduce(
              (sum, sp) => sum + sp.conceptsMastered.length,
              0,
            )}
          </Text>
          <Text style={styles.statLabel}>Concepts</Text>
        </View>
      </View>

      <View style={styles.tracks}>
        {SKILL_TRACKS.map((track) => (
          <SkillCard
            key={track.id}
            track={track}
            progress={skillProgress[track.id]}
          />
        ))}
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
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.accent,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  tracks: {
    gap: spacing.md,
  },
});
