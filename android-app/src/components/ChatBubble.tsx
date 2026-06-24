import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SparringMessage } from '@/models/types';
import { colors, borderRadius, spacing, typography } from '@/theme';

interface ChatBubbleProps {
  message: SparringMessage;
  personaName?: string;
  personaColor?: string;
}

export function ChatBubble({ message, personaName, personaColor }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isCoach = message.role === 'coach';

  return (
    <View
      style={[styles.container, isUser && styles.containerUser]}
      accessibilityLabel={`${isUser ? 'You' : isCoach ? 'Coach' : personaName ?? 'Persona'} said: ${message.content}`}
    >
      {!isUser && (
        <Text style={[styles.sender, isCoach && styles.senderCoach, { color: isCoach ? colors.accent : personaColor }]}>
          {isCoach ? 'Coach' : personaName ?? 'Persona'}
        </Text>
      )}
      <View
        style={[
          styles.bubble,
          isUser && styles.bubbleUser,
          isCoach && styles.bubbleCoach,
        ]}
      >
        <Text style={[styles.text, isUser && styles.textUser]}>
          {message.content}
        </Text>
      </View>

      {message.feedback && !isCoach && (
        <View style={styles.feedbackContainer}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={[styles.scoreValue, { color: getScoreColor(message.feedback.score) }]}>
              {message.feedback.score}/100
            </Text>
          </View>
          {message.feedback.conceptsApplied.length > 0 && (
            <View style={styles.conceptsRow}>
              {message.feedback.conceptsApplied.map((concept) => (
                <View key={concept} style={styles.conceptTag}>
                  <Text style={styles.conceptText}>{concept}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return colors.success;
  if (score >= 60) return colors.accent;
  if (score >= 40) return colors.warning;
  return colors.error;
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    marginBottom: spacing.md,
  },
  containerUser: {
    alignSelf: 'flex-end',
  },
  sender: {
    ...typography.caption,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  senderCoach: {
    fontStyle: 'italic',
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderTopLeftRadius: borderRadius.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.sm,
    borderColor: colors.primaryDark,
  },
  bubbleCoach: {
    backgroundColor: 'transparent',
    borderColor: colors.accent + '40',
    borderStyle: 'dashed' as any,
  },
  text: {
    ...typography.body,
    color: colors.text,
  },
  textUser: {
    color: colors.textOnPrimary,
  },
  feedbackContainer: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  scoreValue: {
    ...typography.caption,
    fontWeight: '700',
  },
  conceptsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  conceptTag: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  conceptText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontSize: 10,
  },
});
