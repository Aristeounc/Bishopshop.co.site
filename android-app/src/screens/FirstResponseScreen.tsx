import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  startFirstResponse,
  beginChoosing,
  submitFirstResponse,
  advanceFirstResponseRound,
  FirstResponseState,
  FirstResponseAnswer,
} from '@/services/firstResponse/engine';
import { FIRST_RESPONSE_SETS, FirstResponseSet } from '@/services/firstResponse/scenarios';

type ScreenState = 'select' | 'playing' | 'results';

const RATING_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  reactive: { label: 'Reactive', color: colors.textMuted, icon: 'flash-outline' },
  composed: { label: 'Composed', color: colors.info, icon: 'shield-outline' },
  strategic: { label: 'Strategic', color: colors.success, icon: 'chess-knight' },
  instinctive: { label: 'Instinctive', color: colors.accent, icon: 'lightning-bolt' },
};

export function FirstResponseScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<FirstResponseState | null>(null);
  const [lastAnswer, setLastAnswer] = useState<FirstResponseAnswer | null>(null);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [timerValue, setTimerValue] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimer(durationMs: number) {
    const durationSec = Math.round(durationMs / 1000);
    setTimerValue(durationSec);
    progressAnim.setValue(1);
    setRoundStartTime(Date.now());

    if (timerRef.current) clearInterval(timerRef.current);

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: durationMs,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimerValue((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    progressAnim.stopAnimation();
  }

  function handleStartSet(set: FirstResponseSet) {
    const state = startFirstResponse(set.id);
    setGameState(state);
    setScreenState('playing');
    setLastAnswer(null);
  }

  function handleBeginChoosing() {
    if (!gameState) return;
    const updated = beginChoosing(gameState);
    setGameState(updated);
    const round = updated.set.rounds[updated.currentRoundIndex];
    if (round) {
      setTimeout(() => startTimer(round.timeLimitMs), 100);
    }
  }

  function handleSelectStrategy(strategyId: string) {
    if (!gameState || gameState.phase !== 'choosing') return;
    stopTimer();

    const timeMs = Date.now() - roundStartTime;
    const { state, answer } = submitFirstResponse(gameState, strategyId, timeMs);
    setGameState(state);
    setLastAnswer(answer);

    revealAnim.setValue(0);
    Animated.spring(revealAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 8,
    }).start();
  }

  function handleNext() {
    if (!gameState) return;
    const updated = advanceFirstResponseRound(gameState);
    setGameState(updated);
    setLastAnswer(null);

    if (updated.isComplete) {
      setScreenState('results');
    }
  }

  function handleBackToSelect() {
    stopTimer();
    setScreenState('select');
    setGameState(null);
    setLastAnswer(null);
  }

  // --- SELECT ---
  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>First Response</Text>
        <Text style={styles.subtitle}>
          Choose the best opening strategy when someone provokes you. Speed matters.
        </Text>

        <Card variant="outlined" style={styles.howCard}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howStep}>
            <Icon name="message-alert-outline" size={20} color={colors.error} />
            <Text style={styles.stepText}>Read a provocation or difficult statement</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="strategy" size={20} color={colors.accent} />
            <Text style={styles.stepText}>Pick the best communication strategy</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="timer-outline" size={20} color={colors.info} />
            <Text style={styles.stepText}>Faster correct answers earn bonus points</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Choose a Set</Text>
        {FIRST_RESPONSE_SETS.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={styles.setCard}
            onPress={() => handleStartSet(set)}
          >
            <View style={styles.setHeader}>
              <Text style={styles.setTitle}>{set.title}</Text>
              <View style={styles.difficultyBadge}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[styles.diffDot, i < set.difficulty && styles.diffDotActive]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.setDescription}>{set.description}</Text>
            <Text style={styles.setMeta}>{set.rounds.length} rounds</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // --- RESULTS ---
  if (screenState === 'results' && gameState) {
    const { score } = gameState;
    const ratingInfo = RATING_CONFIG[score.rating];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.subtitle}>{gameState.set.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Icon name={ratingInfo.icon} size={48} color={ratingInfo.color} />
          <Text style={[styles.ratingLabel, { color: ratingInfo.color }]}>{ratingInfo.label}</Text>
          <Text style={styles.bigScore}>{score.totalPoints}</Text>
          <Text style={styles.scoreLabel}>Points</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.correctCount}/{score.totalRounds}</Text>
              <Text style={styles.scoreStatLabel}>Correct</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.bestStreak}</Text>
              <Text style={styles.scoreStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {score.fastestCorrectMs > 0 ? (score.fastestCorrectMs / 1000).toFixed(1) + 's' : '-'}
              </Text>
              <Text style={styles.scoreStatLabel}>Fastest</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Round Breakdown</Text>
        {gameState.answers.map((answer, idx) => {
          const round = gameState.set.rounds[idx];
          if (!round) return null;
          const selectedStrategy = round.strategies.find((s) => s.id === answer.selectedStrategyId);
          const correctStrategy = round.strategies.find((s) => s.id === round.correctStrategyId);

          return (
            <Card key={round.id} style={styles.breakdownCard}>
              <Text style={styles.breakdownProvocation}>"{round.provocation}"</Text>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownChoice}>
                  <Text style={styles.breakdownChoiceLabel}>
                    {answer.isCorrect ? 'Correct:' : 'You chose:'}
                  </Text>
                  <Text style={[
                    styles.breakdownStrategyName,
                    { color: answer.isCorrect ? colors.success : colors.error },
                  ]}>
                    {selectedStrategy?.label ?? 'Unknown'}
                  </Text>
                </View>
                <Text style={styles.breakdownPoints}>
                  {answer.pointsEarned > 0 ? `+${answer.pointsEarned}` : '0'}
                </Text>
              </View>
              {!answer.isCorrect && correctStrategy && (
                <View style={styles.correctStrategyRow}>
                  <Text style={styles.correctStrategyLabel}>Better strategy:</Text>
                  <Text style={styles.correctStrategyName}>{correctStrategy.label}</Text>
                </View>
              )}
              {!answer.isCorrect && (
                <Text style={styles.breakdownExplanation}>{round.explanation}</Text>
              )}
            </Card>
          );
        })}

        <View style={styles.resultActions}>
          <Button title="Play Again" onPress={() => handleStartSet(gameState.set)} variant="outline" />
          <Button title="New Set" onPress={handleBackToSelect} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  // --- PLAYING ---
  if (!gameState) return null;
  const round = gameState.set.rounds[gameState.currentRoundIndex];
  if (!round) return null;

  const isReading = gameState.phase === 'reading';
  const isChoosing = gameState.phase === 'choosing';
  const isReveal = gameState.phase === 'reveal';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect}>
          <Icon name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.streakContainer}>
          {gameState.score.bestStreak > 0 && (
            <View style={styles.streakBadge}>
              <Icon name="fire" size={16} color={colors.accent} />
              <Text style={styles.streakText}>{gameState.score.bestStreak} streak</Text>
            </View>
          )}
        </View>
        <Text style={styles.questionCount}>
          {gameState.currentRoundIndex + 1}/{gameState.set.rounds.length}
        </Text>
      </View>

      {/* Timer bar (only in choosing phase) */}
      {isChoosing && (
        <View style={styles.timerBarContainer}>
          <Animated.View
            style={[
              styles.timerBarFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: timerValue <= 5 ? colors.error : colors.accent,
              },
            ]}
          />
        </View>
      )}

      {/* Points bar */}
      <View style={styles.statsBar}>
        <Text style={styles.scoreText}>{gameState.score.totalPoints} pts</Text>
        {isChoosing && (
          <Text style={[styles.timerText, timerValue <= 5 && { color: colors.error }]}>
            {timerValue}s
          </Text>
        )}
      </View>

      <ScrollView style={styles.playBody} contentContainerStyle={styles.playBodyContent}>
        {/* Provocation card */}
        <Card style={styles.provocationCard} variant="elevated">
          <View style={styles.speakerRow}>
            <Icon name="account-outline" size={16} color={colors.textMuted} />
            <Text style={styles.speakerText}>{round.speaker}</Text>
          </View>
          <Text style={styles.contextText}>{round.context}</Text>
          <Text style={styles.provocationText}>{round.provocation}</Text>
        </Card>

        {/* Reading phase */}
        {isReading && (
          <View style={styles.readingPrompt}>
            <Text style={styles.readingText}>
              How would you respond? Think about your opening move.
            </Text>
            <Button
              title="Show Strategies"
              onPress={handleBeginChoosing}
              variant="accent"
              icon="strategy"
            />
          </View>
        )}

        {/* Choosing phase — strategy cards */}
        {isChoosing && (
          <>
            <Text style={styles.choosePrompt}>Choose your strategy:</Text>
            {round.strategies.map((strategy) => (
              <TouchableOpacity
                key={strategy.id}
                style={styles.strategyCard}
                onPress={() => handleSelectStrategy(strategy.id)}
                activeOpacity={0.7}
              >
                <View style={styles.strategyHeader}>
                  <Icon name={strategy.icon} size={22} color={colors.accent} />
                  <Text style={styles.strategyLabel}>{strategy.label}</Text>
                </View>
                <Text style={styles.strategyDescription}>{strategy.description}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Reveal phase */}
        {isReveal && lastAnswer && (
          <Animated.View
            style={{
              opacity: revealAnim,
              transform: [
                { translateY: revealAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) },
              ],
            }}
          >
            <Card
              style={[
                styles.revealCard,
                {
                  borderColor: lastAnswer.isCorrect ? colors.success : colors.error,
                  backgroundColor: lastAnswer.isCorrect ? colors.success + '08' : colors.error + '08',
                },
              ]}
            >
              <View style={styles.revealHeader}>
                <Icon
                  name={lastAnswer.isCorrect ? 'check-circle' : 'close-circle'}
                  size={28}
                  color={lastAnswer.isCorrect ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.revealTitle,
                    { color: lastAnswer.isCorrect ? colors.success : colors.error },
                  ]}
                >
                  {lastAnswer.isCorrect ? 'Great instinct!' : 'Not the best move'}
                </Text>
                {lastAnswer.pointsEarned > 0 && (
                  <Text style={styles.revealPoints}>+{lastAnswer.pointsEarned}</Text>
                )}
              </View>

              <View style={styles.correctAnswerBox}>
                <Text style={styles.correctAnswerLabel}>Best strategy:</Text>
                <Text style={styles.correctAnswerStrategy}>
                  {round.strategies.find((s) => s.id === round.correctStrategyId)?.label}
                </Text>
              </View>

              <View style={styles.idealResponseBox}>
                <Text style={styles.idealLabel}>Ideal response:</Text>
                <Text style={styles.idealText}>{round.idealResponse}</Text>
              </View>

              <Text style={styles.revealExplanation}>{round.explanation}</Text>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom */}
      {isReveal && (
        <View style={styles.bottomBar}>
          <Button
            title={
              gameState.currentRoundIndex >= gameState.set.rounds.length - 1
                ? 'See Results'
                : 'Next Round'
            }
            onPress={handleNext}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },

  howCard: { padding: spacing.md, marginBottom: spacing.lg },
  howTitle: { ...typography.h3, color: colors.accent, marginBottom: spacing.md },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  stepText: { ...typography.body, color: colors.text, flex: 1 },

  setCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  setHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  setTitle: { ...typography.h3, color: colors.text },
  difficultyBadge: { flexDirection: 'row', gap: 3 },
  diffDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  diffDotActive: { backgroundColor: colors.accent },
  setDescription: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  setMeta: { ...typography.caption, color: colors.textMuted },

  // Playing
  playHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, paddingHorizontal: spacing.lg },
  streakContainer: { flex: 1, alignItems: 'center' },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.accent + '20', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  streakText: { ...typography.caption, color: colors.accent, fontFamily: 'DMSans-SemiBold' },
  questionCount: { ...typography.caption, color: colors.textMuted },

  timerBarContainer: { height: 4, backgroundColor: colors.surface, marginHorizontal: spacing.lg },
  timerBarFill: { height: 4, borderRadius: 2 },

  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  scoreText: { ...typography.button, color: colors.text },
  timerText: { ...typography.h3, color: colors.accent },

  playBody: { flex: 1 },
  playBodyContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  provocationCard: { padding: spacing.lg, marginBottom: spacing.md },
  speakerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  speakerText: { ...typography.label, color: colors.textSecondary },
  contextText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.md },
  provocationText: { ...typography.h3, color: colors.error, lineHeight: 28, fontStyle: 'italic' },

  readingPrompt: { alignItems: 'center', gap: spacing.lg, marginTop: spacing.lg },
  readingText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  choosePrompt: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  strategyCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1.5, borderColor: colors.border },
  strategyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  strategyLabel: { ...typography.h3, color: colors.text },
  strategyDescription: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },

  revealCard: { padding: spacing.lg, borderWidth: 1.5, borderRadius: borderRadius.lg, marginTop: spacing.sm },
  revealHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  revealTitle: { ...typography.h3, flex: 1 },
  revealPoints: { ...typography.h3, color: colors.accent },

  correctAnswerBox: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: colors.success + '10', borderRadius: borderRadius.sm },
  correctAnswerLabel: { ...typography.caption, color: colors.textMuted },
  correctAnswerStrategy: { ...typography.label, color: colors.success },

  idealResponseBox: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md, borderLeftWidth: 3, borderLeftColor: colors.accent, marginBottom: spacing.md },
  idealLabel: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  idealText: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic', lineHeight: 22 },

  revealExplanation: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },

  bottomBar: { padding: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },

  // Results
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  ratingLabel: { ...typography.h3, marginTop: spacing.sm },
  bigScore: { ...typography.hero, color: colors.accent },
  scoreLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', gap: spacing.xl },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { ...typography.h3, color: colors.text },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },

  breakdownCard: { padding: spacing.md, marginBottom: spacing.sm },
  breakdownProvocation: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic', marginBottom: spacing.sm },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownChoice: {},
  breakdownChoiceLabel: { ...typography.caption, color: colors.textMuted },
  breakdownStrategyName: { ...typography.label },
  breakdownPoints: { ...typography.button, color: colors.accent },
  correctStrategyRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  correctStrategyLabel: { ...typography.caption, color: colors.textMuted },
  correctStrategyName: { ...typography.label, color: colors.success },
  breakdownExplanation: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18 },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
