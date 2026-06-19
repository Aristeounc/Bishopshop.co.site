import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SkillTrack, SkillProgress } from '@/models/types';
import { colors, borderRadius, spacing, typography } from '@/theme';
import { formatEloChange } from '@/utils/helpers';

interface SkillCardProps {
  track: SkillTrack;
  progress: SkillProgress;
  onPress?: () => void;
}

export function SkillCard({ track, progress, onPress }: SkillCardProps) {
  const eloPercent = Math.min(100, (progress.elo / 2000) * 100);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
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
          <View
            style={[styles.progressFill, { width: `${eloPercent}%`, backgroundColor: track.color }]}
          />
        </View>

        <Text style={styles.sessions}>
          {progress.sessionsCompleted} sessions completed
        </Text>
      </View>
    </TouchableOpacity>
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
  },
  progressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  sessions: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
