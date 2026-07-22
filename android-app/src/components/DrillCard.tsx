import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrillContent } from '@/models/types';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from './Card';
import { Button } from './Button';
import { SKILL_TRACKS } from '@/utils/constants';

interface DrillCardProps {
  drill: DrillContent;
  index: number;
  onComplete: (drillId: string, response: string) => void;
}

const DRILL_TYPE_LABELS: Record<DrillContent['type'], { label: string; icon: string }> = {
  listening: { label: 'Listening', icon: 'ear-hearing' },
  boundary_setting: { label: 'Boundaries', icon: 'shield-check-outline' },
  reframing: { label: 'Reframing', icon: 'sync' },
  empathy: { label: 'Empathy', icon: 'heart-outline' },
  assertion: { label: 'Assertion', icon: 'bullhorn-outline' },
};

export function DrillCard({ drill, index, onComplete }: DrillCardProps) {
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(drill.completed);
  const typeInfo = DRILL_TYPE_LABELS[drill.type];
  const track = SKILL_TRACKS.find((t) => t.id === drill.skillTrack);

  function handleSubmit() {
    if (!response.trim()) return;
    setSubmitted(true);
    onComplete(drill.id, response.trim());
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.drillNumber}>
          <Text style={styles.drillNumberText}>{index + 1}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.typeRow}>
            <Icon name={typeInfo.icon} size={14} color={track?.color ?? colors.textMuted} />
            <Text style={[styles.typeLabel, { color: track?.color }]}>{typeInfo.label}</Text>
          </View>
          <Text style={styles.skillLabel}>{track?.name ?? drill.skillTrack}</Text>
        </View>
        {submitted && <Icon name="check-circle" size={20} color={colors.success} />}
      </View>

      <Text style={styles.prompt}>{drill.prompt}</Text>

      {!submitted ? (
        <View style={styles.responseArea}>
          <TextInput
            style={styles.input}
            placeholder="Type your response..."
            placeholderTextColor={colors.textMuted}
            value={response}
            onChangeText={setResponse}
            multiline
            textAlignVertical="top"
            maxLength={2000}
            accessibilityLabel={`Response for drill ${index + 1}: ${typeInfo.label}`}
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!response.trim()}
            variant="primary"
            size="sm"
          />
        </View>
      ) : (
        <View style={styles.completedBanner}>
          <Icon name="check" size={14} color={colors.success} />
          <Text style={styles.completedText}>Completed</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  drillNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillNumberText: {
    ...typography.button,
    color: colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  typeLabel: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  skillLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  prompt: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  responseArea: {
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  completedText: {
    ...typography.caption,
    color: colors.success,
  },
});
