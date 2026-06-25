import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  startForecast,
  submitPrediction,
  advanceForecastRound,
  ForecastState,
  ForecastPrediction,
} from '@/services/tacticForecast/engine';
import { FORECAST_SETS, ForecastSet } from '@/services/tacticForecast/scenarios';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const THEME_ICONS: Record<string, string> = {
  workplace: 'briefcase-outline',
  relationships: 'heart-outline',
  sales: 'cash-register',
  family: 'home-heart',
  social: 'account-group-outline',
};

const THEME_COLORS: Record<string, string> = {
  workplace: colors.skill.negotiate,
  relationships: colors.skill.connect,
  sales: colors.skill.close,
  family: colors.skill.empathize,
  social: colors.skill.assert,
};

const RATING_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  blind_spot: { label: 'Blind Spot', color: colors.error, icon: 'eye-off-outline' },
  aware: { label: 'Aware', color: colors.warning, icon: 'eye-outline' },
  anticipator: { label: 'Anticipator', color: colors.info, icon: 'eye-check-outline' },
  oracle: { label: 'Oracle', color: colors.success, icon: 'crystal-ball' },
};

export function TacticForecastScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'tactic_forecast')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('tactic_forecast'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<ForecastState | null>(null);
  const [revealedLineCount, setRevealedLineCount] = useState(0);
  const [predictionStartTime, setPredictionStartTime] = useState<number>(0);
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  // ── Select State ─────────────────────────────────────────────────────

  function handleStartSet(set: ForecastSet) {
    const state = startForecast(set.id);
    setGameState(state);
    setScreenState('playing');
    setRevealedLineCount(0);
    setLastResult(null);
  }

  // ── Playing State ────────────────────────────────────────────────────

  function handleRevealNextLine() {
    if (!gameState) return;
    const round = gameState.set.rounds[gameState.currentRoundIndex];
    const nextCount = revealedLineCount + 1;
    setRevealedLineCount(nextCount);

    if (nextCount >= round.setupLines.length) {
      setGameState({ ...gameState, phase: 'predicting' });
      setPredictionStartTime(Date.now());
    }
  }

  function handleSelectTactic(tactic: string) {
    if (!gameState || gameState.phase !== 'predicting') return;

    const timeMs = Date.now() - predictionStartTime;
    const { state, isCorrect } = submitPrediction(gameState, tactic, timeMs);
    setGameState(state);
    setLastResult(isCorrect);
  }

  function handleNextRound() {
    if (!gameState) return;
    const updated = advanceForecastRound(gameState);
    setGameState(updated);
    setRevealedLineCount(0);
    setLastResult(null);

    if (updated.isComplete) {
      setScreenState('results');
      const uid = useStore.getState().user?.id;
      if (uid) {
        const accuracyPercent = Math.round(updated.score.accuracy * 100);
        saveDrillResult(uid, 'tactic_forecast', accuracyPercent, 'defend').catch(() => {});
        updateStreak(uid).catch(() => {});
      }
    }
  }

  function handleBackToSelect() {
    setScreenState('select');
    setGameState(null);
    setLastResult(null);
  }

  // ── Render: Select ───────────────────────────────────────────────────

  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Tactic Forecast</Text>
        <Text style={styles.subtitle}>
          Read the opening of a conversation and predict what influence tactic comes next
        </Text>

        <View style={styles.howItWorks}>
          <Card variant="outlined" style={styles.howCard}>
            <Text style={styles.howTitle}>How It Works</Text>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Read the opening lines of a conversation</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Predict what influence tactic comes next</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>See the reveal and learn why the signals were there</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Scenario Sets</Text>
        {FORECAST_SETS.map((set) => (
          <TouchableOpacity
            key={set.id}
            style={styles.setCard}
            onPress={() => handleStartSet(set)}
          >
            <View style={styles.setHeader}>
              <View style={styles.setTitleRow}>
                <Icon
                  name={THEME_ICONS[set.theme] ?? 'help-circle-outline'}
                  size={24}
                  color={THEME_COLORS[set.theme] ?? colors.accent}
                />
                <Text style={styles.setTitle}>{set.title}</Text>
              </View>
              <View style={styles.difficultyBadge}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.diffDot,
                      i < set.difficulty && styles.diffDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.setDescription}>{set.description}</Text>
            <Text style={styles.setMeta}>
              {set.rounds.length} rounds
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // ── Render: Results ──────────────────────────────────────────────────

  if (screenState === 'results' && gameState) {
    const { score, predictions, set } = gameState;
    const ratingInfo = RATING_LABELS[score.overallRating];
    const accuracyPercent = Math.round(score.accuracy * 100);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Forecast Results</Text>
        <Text style={styles.subtitle}>{set.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Icon name={ratingInfo.icon} size={48} color={ratingInfo.color} />
          <Text style={[styles.ratingLabel, { color: ratingInfo.color }]}>
            {ratingInfo.label}
          </Text>
          <Text style={styles.bigScore}>{accuracyPercent}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {score.correctPredictions}/{score.totalRounds}
              </Text>
              <Text style={styles.scoreStatLabel}>Correct</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.streakBest}</Text>
              <Text style={styles.scoreStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {score.averageTime > 0
                  ? `${(score.averageTime / 1000).toFixed(1)}s`
                  : '--'}
              </Text>
              <Text style={styles.scoreStatLabel}>Avg Time</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Round Breakdown</Text>
        {set.rounds.map((round, idx) => {
          const prediction = predictions[idx];
          if (!prediction) return null;

          const predictedLabel = prediction.isCorrect
            ? round.correctTacticLabel
            : round.decoyTactics.find((d) => d.tactic === prediction.predictedTactic)?.label ??
              prediction.predictedTactic;

          return (
            <Card key={round.id} style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <Icon
                  name={prediction.isCorrect ? 'check-circle' : 'close-circle'}
                  size={20}
                  color={prediction.isCorrect ? colors.success : colors.error}
                />
                <Text style={styles.breakdownRound}>Round {idx + 1}</Text>
                <Text style={styles.breakdownTime}>
                  {(prediction.timeToAnswer / 1000).toFixed(1)}s
                </Text>
              </View>
              <View style={styles.breakdownBody}>
                <Text style={styles.breakdownPredicted}>
                  You predicted: <Text style={styles.breakdownBold}>{predictedLabel}</Text>
                </Text>
                <Text style={styles.breakdownActual}>
                  Actual: <Text style={styles.breakdownBold}>{round.correctTacticLabel}</Text>
                </Text>
              </View>
            </Card>
          );
        })}

        <View style={styles.resultActions}>
          <Button title="Play Again" onPress={() => handleStartSet(set)} variant="outline" />
          <Button title="New Set" onPress={handleBackToSelect} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  // ── Render: Playing ──────────────────────────────────────────────────

  if (!gameState) return null;

  const currentRound = gameState.set.rounds[gameState.currentRoundIndex];
  const allLinesRevealed = revealedLineCount >= currentRound.setupLines.length;
  const allTacticOptions = [
    { tactic: currentRound.correctTactic, label: currentRound.correctTacticLabel },
    ...currentRound.decoyTactics,
  ].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <View style={styles.container}>
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.playTitle}>{gameState.set.title}</Text>
        <Text style={styles.playProgress}>
          {gameState.currentRoundIndex + 1}/{gameState.set.rounds.length}
        </Text>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {/* Setup Lines */}
        {currentRound.setupLines.map((line, idx) => {
          if (idx >= revealedLineCount) return null;
          return (
            <View key={`setup-${idx}`} style={styles.chatBubbleContainer}>
              <Text style={styles.chatSpeaker}>{line.speaker}</Text>
              <View style={styles.chatBubble}>
                <Text style={styles.chatText}>{line.text}</Text>
              </View>
            </View>
          );
        })}

        {/* "What happens next?" prompt */}
        {allLinesRevealed && gameState.phase === 'predicting' && (
          <View style={styles.questionContainer}>
            <Icon name="help-circle-outline" size={24} color={colors.accent} />
            <Text style={styles.questionText}>{currentRound.question}</Text>
          </View>
        )}

        {/* Reveal Line */}
        {gameState.phase === 'reveal' && (
          <>
            <View style={styles.chatBubbleContainer}>
              <Text style={styles.chatSpeaker}>{currentRound.revealLine.speaker}</Text>
              <View style={[styles.chatBubble, styles.revealBubble]}>
                <Text style={styles.chatText}>{currentRound.revealLine.text}</Text>
              </View>
            </View>

            <View style={[styles.resultBanner, lastResult ? styles.resultCorrect : styles.resultWrong]}>
              <Icon
                name={lastResult ? 'check-circle' : 'close-circle'}
                size={24}
                color={lastResult ? colors.success : colors.error}
              />
              <Text style={[styles.resultText, { color: lastResult ? colors.success : colors.error }]}>
                {lastResult ? 'Correct!' : `The answer was: ${currentRound.correctTacticLabel}`}
              </Text>
            </View>

            <Card style={styles.explanationCard}>
              <Text style={styles.explanationTitle}>Why this was predictable</Text>
              <Text style={styles.explanationText}>{currentRound.explanation}</Text>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {gameState.phase === 'reading' && (
          <Button
            title={revealedLineCount === 0 ? 'Start Reading' : 'Next Line'}
            onPress={handleRevealNextLine}
            variant="primary"
          />
        )}

        {gameState.phase === 'predicting' && (
          <View style={styles.tacticOptions}>
            <Text style={styles.controlsLabel}>Choose your prediction:</Text>
            {allTacticOptions.map((option) => (
              <TouchableOpacity
                key={option.tactic}
                style={styles.tacticChip}
                onPress={() => handleSelectTactic(option.tactic)}
              >
                <Icon name="shield-outline" size={18} color={colors.accent} />
                <Text style={styles.tacticChipLabel}>{option.label}</Text>
                <Icon name="chevron-right" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {gameState.phase === 'reveal' && (
          <Button
            title={
              gameState.currentRoundIndex >= gameState.set.rounds.length - 1
                ? 'See Results'
                : 'Next Round'
            }
            onPress={handleNextRound}
            variant="primary"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },

  // ── Header / Title ─────────────────────────────────────────────────
  title: { ...typography.h1, color: colors.text },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // ── How It Works ───────────────────────────────────────────────────
  howItWorks: { marginBottom: spacing.lg },
  howCard: { padding: spacing.md },
  howTitle: { ...typography.h3, color: colors.accent, marginBottom: spacing.md },
  howStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  stepNumber: {
    ...typography.button,
    color: colors.textOnPrimary,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
  },
  stepText: { ...typography.body, color: colors.text, flex: 1 },

  // ── Set Cards (Select) ─────────────────────────────────────────────
  setCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  setTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  setTitle: { ...typography.h3, color: colors.text },
  difficultyBadge: { flexDirection: 'row', gap: 3 },
  diffDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  diffDotActive: { backgroundColor: colors.accent },
  setDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  setMeta: { ...typography.caption, color: colors.textMuted },

  // ── Play Header ────────────────────────────────────────────────────
  playHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { marginRight: spacing.md },
  playTitle: { ...typography.h3, color: colors.text, flex: 1 },
  playProgress: { ...typography.caption, color: colors.textMuted },

  // ── Chat / Dialogue ────────────────────────────────────────────────
  chatContainer: { flex: 1 },
  chatContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  chatBubbleContainer: { marginBottom: spacing.md },
  chatSpeaker: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  chatBubble: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderTopLeftRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  revealBubble: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.primary + '12',
  },
  chatText: { ...typography.body, color: colors.text, lineHeight: 24 },

  // ── Question ───────────────────────────────────────────────────────
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: colors.accent + '15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  questionText: {
    ...typography.button,
    color: colors.accent,
    flex: 1,
  },

  // ── Result Banner ──────────────────────────────────────────────────
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  resultCorrect: { backgroundColor: colors.success + '15' },
  resultWrong: { backgroundColor: colors.error + '15' },
  resultText: { ...typography.button, flex: 1 },

  // ── Explanation ────────────────────────────────────────────────────
  explanationCard: { padding: spacing.md, marginBottom: spacing.md },
  explanationTitle: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  explanationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  // ── Controls ───────────────────────────────────────────────────────
  controlsContainer: {
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  controlsLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  tacticOptions: { gap: spacing.sm },
  tacticChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  tacticChipLabel: { ...typography.body, color: colors.text, flex: 1 },

  // ── Score Card (Results) ───────────────────────────────────────────
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  ratingLabel: { ...typography.h3, marginTop: spacing.sm },
  bigScore: { ...typography.hero, color: colors.accent },
  scoreLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', gap: spacing.xxl },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { ...typography.h2, color: colors.text },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },

  // ── Breakdown Cards ────────────────────────────────────────────────
  breakdownCard: { padding: spacing.md, marginBottom: spacing.sm },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  breakdownRound: { ...typography.label, color: colors.text, flex: 1 },
  breakdownTime: { ...typography.caption, color: colors.textMuted },
  breakdownBody: { marginLeft: spacing.lg + spacing.sm },
  breakdownPredicted: { ...typography.bodySmall, color: colors.textSecondary },
  breakdownActual: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  breakdownBold: { ...typography.label, color: colors.text },

  // ── Result Actions ─────────────────────────────────────────────────
  resultActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
