import React, { useState, useEffect, useRef } from 'react';
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
  startFlashJudgment,
  submitFlashAnswer,
  advanceFlashQuestion,
  calculateFlashResults,
  FlashJudgmentState,
  FlashAnswer,
  FlashResults,
} from '@/services/flashJudgment/engine';
import { FLASH_JUDGMENT_SETS, FlashJudgmentSet, FlashOption } from '@/services/flashJudgment/scenarios';

type ScreenState = 'select' | 'playing' | 'results';

const QUALITY_CONFIG: Record<FlashOption['quality'], { label: string; color: string; icon: string }> = {
  best: { label: 'Best Response', color: colors.success, icon: 'star' },
  okay: { label: 'Acceptable', color: colors.warning, icon: 'check' },
  poor: { label: 'Poor Choice', color: '#FF8C42', icon: 'alert' },
  worst: { label: 'Worst Response', color: colors.error, icon: 'close' },
};

const RATING_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  novice: { label: 'Novice', color: colors.textMuted, icon: 'school-outline' },
  sharp: { label: 'Sharp', color: colors.info, icon: 'eye-outline' },
  expert: { label: 'Expert', color: colors.success, icon: 'shield-check-outline' },
  master: { label: 'Master', color: colors.accent, icon: 'crown-outline' },
};

export function FlashJudgmentScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<FlashJudgmentState | null>(null);
  const [lastAnswer, setLastAnswer] = useState<FlashAnswer | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [timerValue, setTimerValue] = useState(15);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    setTimerValue(15);
    progressAnim.setValue(1);
    setQuestionStartTime(Date.now());

    if (timerRef.current) clearInterval(timerRef.current);

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 15000,
      useNativeDriver: false,
    }).start();

    timerRef.current = setInterval(() => {
      setTimerValue((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeout();
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

  function handleTimeout() {
    if (!gameState || gameState.phase !== 'answering') return;
    const question = gameState.set.questions[gameState.currentIndex];
    const worstOption = question.options.find((o) => o.quality === 'worst') ?? question.options[0];
    handleSelectOption(worstOption.id);
  }

  function handleStartSet(set: FlashJudgmentSet) {
    const state = startFlashJudgment(set.id);
    setGameState(state);
    setScreenState('playing');
    setLastAnswer(null);
    setTimeout(() => startTimer(), 100);
  }

  function handleSelectOption(optionId: string) {
    if (!gameState || gameState.phase !== 'answering') return;
    stopTimer();

    const timeMs = Date.now() - questionStartTime;
    const { state, answer } = submitFlashAnswer(gameState, optionId, timeMs);
    setGameState(state);
    setLastAnswer(answer);
  }

  function handleNext() {
    if (!gameState) return;
    const updated = advanceFlashQuestion(gameState);
    setGameState(updated);
    setLastAnswer(null);

    if (updated.isComplete) {
      setScreenState('results');
    } else {
      setTimeout(() => startTimer(), 100);
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
        <Text style={styles.title}>Flash Judgment</Text>
        <Text style={styles.subtitle}>
          Pick the best response under time pressure. Hearts, streaks, and speed bonuses.
        </Text>

        <Card variant="outlined" style={styles.howCard}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howStep}>
            <Icon name="heart" size={20} color={colors.error} />
            <Text style={styles.stepText}>3 hearts — lose one for each bad response</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="fire" size={20} color={colors.accent} />
            <Text style={styles.stepText}>Build streaks for multiplied points</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="timer-outline" size={20} color={colors.info} />
            <Text style={styles.stepText}>15 seconds per question — faster = bonus points</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Choose a Set</Text>
        {FLASH_JUDGMENT_SETS.map((set) => (
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
            <Text style={styles.setMeta}>{set.questions.length} questions</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // --- RESULTS ---
  if (screenState === 'results' && gameState) {
    const results = calculateFlashResults(gameState);
    const ratingInfo = RATING_CONFIG[results.rating];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.subtitle}>{gameState.set.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Icon name={ratingInfo.icon} size={48} color={ratingInfo.color} />
          <Text style={[styles.ratingLabel, { color: ratingInfo.color }]}>{ratingInfo.label}</Text>
          <Text style={styles.bigScore}>{results.totalScore}</Text>
          <Text style={styles.scoreLabel}>Points</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{results.bestCount}/{results.totalQuestions}</Text>
              <Text style={styles.scoreStatLabel}>Best Picks</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{results.bestStreak}</Text>
              <Text style={styles.scoreStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {results.heartsRemaining > 0
                  ? Array(results.heartsRemaining).fill('❤️').join('')
                  : '0'}
              </Text>
              <Text style={styles.scoreStatLabel}>Hearts Left</Text>
            </View>
          </View>
          {results.perfectRound && (
            <View style={styles.perfectBadge}>
              <Icon name="star-circle" size={20} color={colors.accent} />
              <Text style={styles.perfectText}>Perfect Round!</Text>
            </View>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Question Breakdown</Text>
        {gameState.answers.map((answer, idx) => {
          const question = gameState.set.questions[idx];
          if (!question) return null;
          const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
          const qualityInfo = selectedOption ? QUALITY_CONFIG[selectedOption.quality] : null;

          return (
            <Card key={question.id} style={styles.breakdownCard}>
              <Text style={styles.breakdownScenario}>{question.scenario}</Text>
              <View style={styles.breakdownAnswer}>
                {qualityInfo && (
                  <View style={[styles.qualityPill, { backgroundColor: qualityInfo.color + '20' }]}>
                    <Icon name={qualityInfo.icon} size={14} color={qualityInfo.color} />
                    <Text style={[styles.qualityText, { color: qualityInfo.color }]}>{qualityInfo.label}</Text>
                  </View>
                )}
                <Text style={styles.breakdownPoints}>+{answer.pointsEarned}</Text>
              </View>
              {!answer.isBest && (
                <Text style={styles.breakdownExplanation}>{question.explanation}</Text>
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
  const question = gameState.set.questions[gameState.currentIndex];
  if (!question) return null;

  const isFeedback = gameState.phase === 'feedback';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect}>
          <Icon name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.heartsContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Icon
              key={i}
              name={i < gameState.hearts ? 'heart' : 'heart-outline'}
              size={20}
              color={i < gameState.hearts ? colors.error : colors.textMuted}
            />
          ))}
        </View>
        <Text style={styles.questionCount}>
          {gameState.currentIndex + 1}/{gameState.set.questions.length}
        </Text>
      </View>

      {/* Timer bar */}
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

      {/* Streak / Score */}
      <View style={styles.statsBar}>
        {gameState.streak > 0 && (
          <View style={styles.streakBadge}>
            <Icon name="fire" size={16} color={colors.accent} />
            <Text style={styles.streakText}>{gameState.streak}x streak</Text>
          </View>
        )}
        <Text style={styles.scoreText}>{gameState.score} pts</Text>
      </View>

      <ScrollView style={styles.playBody} contentContainerStyle={styles.playBodyContent}>
        {/* Scenario */}
        <Card style={styles.scenarioBox} variant="elevated">
          <Text style={styles.scenarioText}>{question.scenario}</Text>
          <Text style={styles.contextText}>{question.context}</Text>
        </Card>

        {/* Options */}
        {question.options.map((option) => {
          const isSelected = lastAnswer?.selectedOptionId === option.id;
          const showQuality = isFeedback;
          const qualityInfo = QUALITY_CONFIG[option.quality];
          const isBestOption = option.id === question.correctOptionId;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                showQuality && isBestOption && styles.optionBest,
                showQuality && isSelected && !isBestOption && styles.optionWrong,
              ]}
              onPress={() => !isFeedback && handleSelectOption(option.id)}
              disabled={isFeedback}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{option.text}</Text>
              {showQuality && (
                <View style={[styles.optionQuality, { backgroundColor: qualityInfo.color + '20' }]}>
                  <Icon name={qualityInfo.icon} size={14} color={qualityInfo.color} />
                  <Text style={[styles.optionQualityText, { color: qualityInfo.color }]}>
                    {qualityInfo.label}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Feedback */}
        {isFeedback && (
          <Card style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>Why?</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom action */}
      {isFeedback && (
        <View style={styles.bottomBar}>
          {lastAnswer && (
            <View style={styles.feedbackPoints}>
              <Text style={[
                styles.feedbackPointsText,
                { color: lastAnswer.isBest ? colors.success : lastAnswer.isCorrect ? colors.warning : colors.error },
              ]}>
                {lastAnswer.isBest ? `+${lastAnswer.pointsEarned}` : lastAnswer.isCorrect ? '+' + lastAnswer.pointsEarned : 'No points'}
              </Text>
            </View>
          )}
          <Button
            title={gameState.hearts <= 0 || gameState.currentIndex >= gameState.set.questions.length - 1 ? 'See Results' : 'Next'}
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
  heartsContainer: { flexDirection: 'row', gap: spacing.xs },
  questionCount: { ...typography.caption, color: colors.textMuted },
  timerBarContainer: { height: 4, backgroundColor: colors.surface, marginHorizontal: spacing.lg },
  timerBarFill: { height: 4, borderRadius: 2 },

  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  streakBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.accent + '20', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  streakText: { ...typography.caption, color: colors.accent, fontFamily: 'DMSans-SemiBold' },
  scoreText: { ...typography.button, color: colors.text },

  playBody: { flex: 1 },
  playBodyContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  scenarioBox: { padding: spacing.md, marginBottom: spacing.lg },
  scenarioText: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  contextText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic' },

  optionCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1.5, borderColor: colors.border },
  optionBest: { borderColor: colors.success, backgroundColor: colors.success + '08' },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.error + '08' },
  optionText: { ...typography.body, color: colors.text, lineHeight: 22 },
  optionQuality: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.sm, alignSelf: 'flex-start' },
  optionQualityText: { ...typography.caption },

  explanationBox: { padding: spacing.md, marginTop: spacing.sm, backgroundColor: colors.accent + '08', borderColor: colors.accent + '20', borderWidth: 1 },
  explanationTitle: { ...typography.label, color: colors.accent, marginBottom: spacing.xs },
  explanationText: { ...typography.bodySmall, color: colors.text, lineHeight: 22 },

  bottomBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  feedbackPoints: {},
  feedbackPointsText: { ...typography.h3 },

  // Results
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  ratingLabel: { ...typography.h3, marginTop: spacing.sm },
  bigScore: { ...typography.hero, color: colors.accent },
  scoreLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', gap: spacing.xl },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { ...typography.h3, color: colors.text },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },
  perfectBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.md, backgroundColor: colors.accent + '20', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full },
  perfectText: { ...typography.label, color: colors.accent },

  breakdownCard: { padding: spacing.md, marginBottom: spacing.sm },
  breakdownScenario: { ...typography.bodySmall, color: colors.text, marginBottom: spacing.sm },
  breakdownAnswer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  qualityPill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  qualityText: { ...typography.caption },
  breakdownPoints: { ...typography.button, color: colors.accent },
  breakdownExplanation: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18 },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
