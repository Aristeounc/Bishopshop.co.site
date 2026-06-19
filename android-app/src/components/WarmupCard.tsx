import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WarmupContent } from '@/models/types';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from './Card';

interface WarmupCardProps {
  warmup: WarmupContent;
  onComplete: () => void;
  completed: boolean;
}

export function WarmupCard({ warmup, onComplete, completed }: WarmupCardProps) {
  return (
    <Card style={styles.container} variant="elevated">
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="book-open-outline" size={24} color={colors.accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.conceptName}>{warmup.conceptName}</Text>
          <Text style={styles.expertSource}>{warmup.expertSource}</Text>
        </View>
        {completed && (
          <Icon name="check-circle" size={20} color={colors.success} />
        )}
      </View>

      <Text style={styles.summary}>{warmup.summary}</Text>

      <View style={styles.takeaways}>
        <Text style={styles.takeawaysTitle}>Key Takeaways</Text>
        {warmup.keyTakeaways.map((takeaway, index) => (
          <View key={index} style={styles.takeawayRow}>
            <View style={styles.bullet} />
            <Text style={styles.takeawayText}>{takeaway}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  conceptName: {
    ...typography.h3,
    color: colors.text,
  },
  expertSource: {
    ...typography.caption,
    color: colors.accent,
    marginTop: 2,
  },
  summary: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  takeaways: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  takeawaysTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  takeawayText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
});
