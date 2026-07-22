import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { SparringMessage } from '@/models/types';
import { colors, borderRadius, spacing, typography } from '@/theme';

interface ChatBubbleProps {
  message: SparringMessage;
  personaName?: string;
  personaColor?: string;
}

/** Concept tag with shimmer border animation */
function ConceptTag({ concept }: { concept: string }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(142, 68, 173, ${0.15 + shimmer.value * 0.25})`,
  }));

  return (
    <Animated.View style={[styles.conceptTag, shimmerStyle]}>
      <Text style={styles.conceptText}>{concept}</Text>
    </Animated.View>
  );
}

export function ChatBubble({ message, personaName, personaColor }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const isCoach = message.role === 'coach';

  // Slide-in animation
  const translateX = useSharedValue(isUser ? 20 : -20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, []);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.container, isUser && styles.containerUser, slideStyle]}
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
          <View style={styles.scoreBarContainer}>
            <View
              style={[
                styles.scoreBarFill,
                {
                  width: `${message.feedback.score}%`,
                  backgroundColor: getScoreColor(message.feedback.score),
                },
              ]}
            />
          </View>
          {message.feedback.conceptsApplied.length > 0 && (
            <View style={styles.conceptsRow}>
              {message.feedback.conceptsApplied.map((concept) => (
                <ConceptTag key={concept} concept={concept} />
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
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
  scoreBarContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 2,
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
    borderWidth: 1,
    borderColor: colors.primary + '25',
  },
  conceptText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontSize: 10,
  },
});
