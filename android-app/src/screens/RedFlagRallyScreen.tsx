import React, { useState, useRef, useEffect } from 'react';
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
  startRedFlagRally,
  submitFlagJudgment,
  advanceFlagStatement,
  calculateRedFlagResults,
  RedFlagState,
  FlagAnswer,
  RedFlagResults,
} from '@/services/redFlagRally/engine';
import { RED_FLAG_SETS, RedFlagSet } from '@/services/redFlagRally/scenarios';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const RATING_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  naive: { label: 'Naive', color: colors.textMuted, icon: 'eye-off-outline' },
  cautious: { label: 'Cautious', color: colors.warning, icon: 'eye-outline' },
  perceptive: { label: 'Perceptive', color: colors.info, icon: 'eye-check-outline' },
  detector: { label: 'Detector', color: colors.accent, icon: 'shield-check-outline' },
};

const CATEGORY_ICONS: Record<string, string> = {
  manipulation: 'account-switch',
  boundary_violation: 'shield-off-outline',
  gaslighting: 'head-question-outline',
  love_bombing: 'heart-flash',
  control: 'lock-outline',
  healthy: 'check-circle-outline',
  assertive: 'shield-check-outline',
  empathetic: 'heart-outline',
};

export function RedFlagRallyScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'red_flag_rally')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('red_flag_rally'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<RedFlagState | null>(null);
  const [lastAnswer, setLastAnswer] = useState<FlagAnswer | null>(null);
  const [statementStartTime, setStatementStartTime] = useState(0);
  const cardAnim = useRef(new Animated.Value(0)).current;
  const feedbackAnim = useRef(new Animated.Value(0)).current;

  function handleStartSet(set: RedFlagSet) {
    const state = startRedFlagRally(set.id);
    setGameState(state);
    setScreenState('playing');
    setLastAnswer(null);
    setStatementStartTime(Date.now());
    cardAnim.setValue(0);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }

  function handleJudgment(isRedFlag: boolean) {
    if (!gameState || gameState.phase !== 'judging') return;

    const timeMs = Date.now() - statementStartTime;
    const { state, answer } = submitFlagJudgment(gameState, isRedFlag, timeMs);
    setGameState(state);
    setLastAnswer(answer);

    feedbackAnim.setValue(0);
    Animated.spring(feedbackAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  }

  function handleNext() {
    if (!gameState) return;
    const updated = advanceFlagStatement(gameState);
    setGameState(updated);
    setLastAnswer(null);

    if (updated.isComplete) {
      setScreenState('results');
      const uid = useStore.getState().user?.id;
      if (uid) {
        const results = calculateRedFlagResults(updated);
        saveDrillResult(uid, 'red_flag_rally', results.accuracy, 'defend').catch(() => {});
        updateStreak(uid).catch(() => {});
      }
    } else {
      setStatementStartTime(Date.now());
      cardAnim.setValue(0);
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }

  function handleBackToSelect() {
    setScreenState('select');
    setGameState(null);
    setLastAnswer(null);
  }

  // --- SELECT ---
  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Red Flag Rally</Text>
        <Text style={styles.subtitle}>
          Sort statements as red flags or green flags. Build combos for massive points.
        </Text>

        <Card variant="outlined" style={styles.howCard}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howStep}>
            <Icon name="flag" size={20} color={colors.error} />
            <Text style={styles.stepText}>Tap Red Flag for toxic / manipulative statements</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="flag" size={20} color={colors.success} />
            <Text style={styles.stepText}>Tap Green Flag for healthy / positive statements</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="fire" size={20} color={colors.accent} />
            <Text style={styles.stepText}>Build combos for up to 4x point multiplier</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Choose a Set</Text>
        {RED_FLAG_SETS.map((set) => (
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
            <Text style={styles.setMeta}>{set.statements.length} statements</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // --- RESULTS ---
  if (screenState === 'results' && gameState) {
    const results = calculateRedFlagResults(gameState);
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
              <Text style={styles.scoreStatValue}>{results.accuracy}%</Text>
              <Text style={styles.scoreStatLabel}>Accuracy</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{results.bestCombo}x</Text>
              <Text style={styles.scoreStatLabel}>Best Combo</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{(results.averageTimeMs / 1000).toFixed(1)}s</Text>
              <Text style={styles.scoreStatLabel}>Avg Time</Text>
            </View>
          </View>
        </Card>

        <View style={styles.flagAccuracyRow}>
          <Card style={styles.flagAccuracyCard}>
            <Icon name="flag" size={24} color={colors.error} />
            <Text style={styles.flagAccuracyValue}>{results.redFlagAccuracy}%</Text>
            <Text style={styles.flagAccuracyLabel}>Red Flag Accuracy</Text>
          </Card>
          <Card style={styles.flagAccuracyCard}>
            <Icon name="flag" size={24} color={colors.success} />
            <Text style={styles.flagAccuracyValue}>{results.greenFlagAccuracy}%</Text>
            <Text style={styles.flagAccuracyLabel}>Green Flag Accuracy</Text>
          </Card>
        </View>

        {results.missedRedFlags.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Missed Red Flags</Text>
            {results.missedRedFlags.map((stmt) => (
              <Card key={stmt.id} style={styles.missedCard}>
                <View style={styles.missedHeader}>
                  <Icon name="alert-circle" size={16} color={colors.error} />
                  <Text style={styles.missedCategory}>{stmt.category.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.missedText}>"{stmt.text}"</Text>
                <Text style={styles.missedExplanation}>{stmt.explanation}</Text>
              </Card>
            ))}
          </>
        )}

        {results.falseAlarms.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>False Alarms</Text>
            {results.falseAlarms.map((stmt) => (
              <Card key={stmt.id} style={styles.missedCard}>
                <View style={styles.missedHeader}>
                  <Icon name="information-outline" size={16} color={colors.warning} />
                  <Text style={[styles.missedCategory, { color: colors.warning }]}>
                    {stmt.category.replace('_', ' ')}
                  </Text>
                </View>
                <Text style={styles.missedText}>"{stmt.text}"</Text>
                <Text style={styles.missedExplanation}>{stmt.explanation}</Text>
              </Card>
            ))}
          </>
        )}

        <View style={styles.resultActions}>
          <Button title="Play Again" onPress={() => handleStartSet(gameState.set)} variant="outline" />
          <Button title="New Set" onPress={handleBackToSelect} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  // --- PLAYING ---
  if (!gameState) return null;
  const statement = gameState.set.statements[gameState.currentIndex];
  if (!statement) return null;

  const isFeedback = gameState.phase === 'feedback';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect}>
          <Icon name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.comboContainer}>
          {gameState.combo > 0 && (
            <View style={styles.comboBadge}>
              <Icon name="fire" size={16} color={colors.accent} />
              <Text style={styles.comboText}>
                {gameState.combo}x combo
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.questionCount}>
          {gameState.currentIndex + 1}/{gameState.set.statements.length}
        </Text>
      </View>

      {/* Score bar */}
      <View style={styles.statsBar}>
        <Text style={styles.scoreText}>{gameState.score} pts</Text>
        <View style={styles.progressDots}>
          {gameState.set.statements.map((_, i) => {
            const answer = gameState.answers[i];
            return (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  answer && answer.isCorrect && styles.progressDotCorrect,
                  answer && !answer.isCorrect && styles.progressDotWrong,
                  i === gameState.currentIndex && !answer && styles.progressDotCurrent,
                ]}
              />
            );
          })}
        </View>
      </View>

      <ScrollView style={styles.playBody} contentContainerStyle={styles.playBodyContent}>
        {/* Statement card */}
        <Animated.View
          style={{
            opacity: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
            transform: [
              { scale: cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
            ],
          }}
        >
          <Card style={styles.statementCard} variant="elevated">
            <View style={styles.speakerRow}>
              <Icon name="account-outline" size={18} color={colors.textMuted} />
              <Text style={styles.speakerText}>{statement.speaker}</Text>
              <Text style={styles.contextText}>{statement.context}</Text>
            </View>
            <Text style={styles.statementText}>"{statement.text}"</Text>
          </Card>
        </Animated.View>

        {/* Feedback */}
        {isFeedback && lastAnswer && (
          <Animated.View
            style={{
              opacity: feedbackAnim,
              transform: [
                { scale: feedbackAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
              ],
            }}
          >
            <Card
              style={[
                styles.feedbackCard,
                {
                  borderColor: lastAnswer.isCorrect ? colors.success : colors.error,
                  backgroundColor: lastAnswer.isCorrect ? colors.success + '08' : colors.error + '08',
                },
              ]}
            >
              <View style={styles.feedbackHeader}>
                <Icon
                  name={lastAnswer.isCorrect ? 'check-circle' : 'close-circle'}
                  size={24}
                  color={lastAnswer.isCorrect ? colors.success : colors.error}
                />
                <Text
                  style={[
                    styles.feedbackTitle,
                    { color: lastAnswer.isCorrect ? colors.success : colors.error },
                  ]}
                >
                  {lastAnswer.isCorrect ? 'Correct!' : 'Wrong!'}
                </Text>
                {lastAnswer.pointsEarned > 0 && (
                  <Text style={styles.feedbackPoints}>+{lastAnswer.pointsEarned}</Text>
                )}
              </View>

              <View style={styles.actualFlagRow}>
                <Icon
                  name="flag"
                  size={16}
                  color={statement.isRedFlag ? colors.error : colors.success}
                />
                <Text style={styles.actualFlagText}>
                  This is a {statement.isRedFlag ? 'Red Flag' : 'Green Flag'}
                  {statement.category !== 'healthy' && (
                    ` — ${statement.category.replace('_', ' ')}`
                  )}
                </Text>
              </View>

              <Text style={styles.feedbackExplanation}>{statement.explanation}</Text>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom action */}
      {!isFeedback ? (
        <View style={styles.flagButtons}>
          <TouchableOpacity
            style={[styles.flagButton, styles.redFlagButton]}
            onPress={() => handleJudgment(true)}
            activeOpacity={0.7}
          >
            <Icon name="flag" size={28} color="#FFF" />
            <Text style={styles.flagButtonText}>Red Flag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flagButton, styles.greenFlagButton]}
            onPress={() => handleJudgment(false)}
            activeOpacity={0.7}
          >
            <Icon name="flag" size={28} color="#FFF" />
            <Text style={styles.flagButtonText}>Green Flag</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.bottomBar}>
          <Button
            title={
              gameState.currentIndex >= gameState.set.statements.length - 1
                ? 'See Results'
                : 'Next'
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
  comboContainer: { flex: 1, alignItems: 'center' },
  comboBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.accent + '20', paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  comboText: { ...typography.caption, color: colors.accent, fontFamily: 'DMSans-SemiBold' },
  questionCount: { ...typography.caption, color: colors.textMuted },

  statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  scoreText: { ...typography.button, color: colors.text },
  progressDots: { flexDirection: 'row', gap: 3, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' },
  progressDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  progressDotCorrect: { backgroundColor: colors.success },
  progressDotWrong: { backgroundColor: colors.error },
  progressDotCurrent: { backgroundColor: colors.accent },

  playBody: { flex: 1 },
  playBodyContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  statementCard: { padding: spacing.lg, marginBottom: spacing.md },
  speakerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  speakerText: { ...typography.label, color: colors.textSecondary },
  contextText: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic', flex: 1 },
  statementText: { ...typography.h3, color: colors.text, lineHeight: 28, fontStyle: 'italic' },

  feedbackCard: { padding: spacing.md, borderWidth: 1.5, borderRadius: borderRadius.lg },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  feedbackTitle: { ...typography.h3, flex: 1 },
  feedbackPoints: { ...typography.h3, color: colors.accent },
  actualFlagRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, backgroundColor: colors.surface, borderRadius: borderRadius.sm },
  actualFlagText: { ...typography.bodySmall, color: colors.text, textTransform: 'capitalize' },
  feedbackExplanation: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 22 },

  flagButtons: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, paddingTop: spacing.md },
  flagButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg, borderRadius: borderRadius.lg },
  redFlagButton: { backgroundColor: colors.error },
  greenFlagButton: { backgroundColor: colors.success },
  flagButtonText: { ...typography.button, color: '#FFF', fontSize: 16 },

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

  flagAccuracyRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  flagAccuracyCard: { flex: 1, alignItems: 'center', padding: spacing.md },
  flagAccuracyValue: { ...typography.h2, color: colors.text, marginTop: spacing.sm },
  flagAccuracyLabel: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },

  missedCard: { padding: spacing.md, marginBottom: spacing.sm },
  missedHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  missedCategory: { ...typography.caption, color: colors.error, textTransform: 'capitalize' },
  missedText: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic', marginBottom: spacing.sm },
  missedExplanation: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
