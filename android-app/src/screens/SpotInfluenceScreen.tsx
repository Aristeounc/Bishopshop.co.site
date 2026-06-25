import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  startSpotInfluence,
  advanceLine,
  submitTacticGuess,
  markLineClean,
  SpotInfluenceState,
  PlayerTacticSelection,
} from '@/services/spotInfluence/engine';
import { INFLUENCE_SCENARIOS, InfluenceScenario } from '@/services/spotInfluence/scenarios';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const TACTIC_CATEGORIES = [
  { id: 'flattery', label: 'Flattery', icon: '🎭', color: '#E6A817' },
  { id: 'pressure', label: 'Pressure', icon: '⏰', color: '#D93025' },
  { id: 'guilt', label: 'Guilt', icon: '😔', color: '#7B2D8E' },
  { id: 'authority', label: 'Authority', icon: '👔', color: '#1A365D' },
  { id: 'scarcity', label: 'Scarcity', icon: '🔒', color: '#D29922' },
  { id: 'reciprocity', label: 'Reciprocity', icon: '🤝', color: '#0E7C42' },
  { id: 'social_proof', label: 'Social Proof', icon: '👥', color: '#58A6FF' },
  { id: 'anchoring', label: 'Anchoring', icon: '⚓', color: '#4A5568' },
  { id: 'deflection', label: 'Deflection', icon: '🪞', color: '#8B949E' },
];

export function SpotInfluenceScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'spot_influence')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('spot_influence'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<SpotInfluenceState | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ lineId: string; result: PlayerTacticSelection } | null>(null);
  const [reviewMode, setReviewMode] = useState(false);

  function handleStartScenario(scenario: InfluenceScenario) {
    setGameState(startSpotInfluence(scenario.id));
    setScreenState('playing');
    setFeedback(null);
    setReviewMode(false);
  }

  function handleSpotTactic(lineId: string, lineText: string) {
    if (!gameState || !selectedCategory || reviewMode) return;

    const { state, result } = submitTacticGuess(
      gameState,
      lineId,
      lineText,
      selectedCategory,
    );
    setGameState(state);
    setFeedback({ lineId, result });
    setSelectedCategory(null);

    setTimeout(() => setFeedback(null), 3000);
  }

  function handleMarkClean(lineId: string) {
    if (!gameState || reviewMode) return;
    const { state, isCorrect } = markLineClean(gameState, lineId);
    setGameState(state);

    if (isCorrect) {
      Alert.alert('Correct!', 'This line had no influence tactics.');
    } else {
      Alert.alert('Missed!', 'This line actually contained influence tactics. Look closer.');
    }
  }

  function handleAdvance() {
    if (!gameState) return;
    const updated = advanceLine(gameState);
    setGameState(updated);
    if (updated.isComplete) {
      setScreenState('results');
      const uid = useStore.getState().user?.id;
      if (uid) {
        saveDrillResult(uid, 'spot_influence', updated.score.accuracy, 'defend').catch(() => {});
        updateStreak(uid).catch(() => {});
      }
    }
  }

  function handleReview() {
    setReviewMode(true);
    setScreenState('playing');
  }

  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Spot the Influence</Text>
        <Text style={styles.subtitle}>
          Watch conversations unfold and identify manipulation tactics in real time
        </Text>

        <View style={styles.howItWorks}>
          <Card variant="outlined" style={styles.howCard}>
            <Text style={styles.howTitle}>How It Works</Text>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Read each line of dialogue as it appears</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Select a tactic category, then tap the line using it</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Mark clean lines as "No Tactic" to advance</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Scenarios</Text>
        {INFLUENCE_SCENARIOS.map((scenario) => (
          <TouchableOpacity
            key={scenario.id}
            style={styles.scenarioCard}
            onPress={() => handleStartScenario(scenario)}
          >
            <View style={styles.scenarioHeader}>
              <Text style={styles.scenarioTitle}>{scenario.title}</Text>
              <View style={styles.difficultyBadge}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.diffDot,
                      i < scenario.difficulty && styles.diffDotActive,
                    ]}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.scenarioContext}>{scenario.context}</Text>
            <Text style={styles.scenarioMeta}>
              {scenario.dialogue.length} exchanges · {scenario.dialogue.reduce((s, l) => s + l.tactics.length, 0)} hidden tactics
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (screenState === 'results' && gameState) {
    const { score } = gameState;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.subtitle}>{gameState.scenario.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Text style={styles.bigScore}>{score.accuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.tacticsIdentified}/{score.totalTactics}</Text>
              <Text style={styles.scoreStatLabel}>Found</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={[styles.scoreStatValue, { color: score.falsePositives > 0 ? colors.error : colors.success }]}>
                {score.falsePositives}
              </Text>
              <Text style={styles.scoreStatLabel}>False Alarms</Text>
            </View>
          </View>
        </Card>

        {score.missedTactics.length > 0 && (
          <Card style={styles.missedCard}>
            <Text style={styles.missedTitle}>Tactics You Missed</Text>
            {score.missedTactics.map((tactic) => (
              <View key={tactic.id} style={styles.missedItem}>
                <Text style={styles.missedName}>{tactic.name}</Text>
                <Text style={styles.missedDesc}>{tactic.description}</Text>
              </View>
            ))}
          </Card>
        )}

        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        {Object.entries(score.categoryBreakdown).map(([cat, data]) => {
          const catInfo = TACTIC_CATEGORIES.find((c) => c.id === cat);
          return (
            <View key={cat} style={styles.catRow}>
              <Text style={styles.catIcon}>{catInfo?.icon ?? '?'}</Text>
              <Text style={styles.catLabel}>{catInfo?.label ?? cat}</Text>
              <Text style={[styles.catScore, { color: data.found === data.total ? colors.success : colors.accent }]}>
                {data.found}/{data.total}
              </Text>
            </View>
          );
        })}

        <View style={styles.resultActions}>
          <Button title="Review Dialogue" onPress={handleReview} variant="outline" />
          <Button title="New Scenario" onPress={() => setScreenState('select')} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  if (!gameState) return null;
  const currentLine = gameState.scenario.dialogue[gameState.currentLineIndex];
  const isLastLine = gameState.currentLineIndex >= gameState.scenario.dialogue.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.playHeader}>
        <Text style={styles.playTitle}>{gameState.scenario.title}</Text>
        <Text style={styles.playProgress}>
          {gameState.currentLineIndex + 1}/{gameState.scenario.dialogue.length}
        </Text>
      </View>

      <ScrollView style={styles.dialogueContainer} contentContainerStyle={styles.dialogueContent}>
        <Text style={styles.contextText}>{gameState.scenario.context}</Text>

        {gameState.revealedLines.map((lineIdx) => {
          const line = gameState.scenario.dialogue[lineIdx];
          const isActive = lineIdx === gameState.currentLineIndex && !reviewMode;
          const lineSelections = gameState.playerSelections[line.id] ?? [];
          const hasCorrect = lineSelections.some((s) => s.isCorrect);

          return (
            <View key={line.id} style={[styles.dialogueLine, isActive && styles.dialogueLineActive]}>
              <Text style={styles.speaker}>{line.speaker}</Text>
              <TouchableOpacity
                onPress={() => isActive && selectedCategory ? handleSpotTactic(line.id, line.text) : undefined}
                activeOpacity={isActive && selectedCategory ? 0.7 : 1}
              >
                <Text style={[styles.lineText, isActive && selectedCategory && styles.lineTextSelectable]}>
                  {line.text}
                </Text>
              </TouchableOpacity>

              {reviewMode && line.tactics.length > 0 && (
                <View style={styles.revealedTactics}>
                  {line.tactics.map((t) => (
                    <View key={t.id} style={[styles.tacticTag, { borderColor: TACTIC_CATEGORIES.find((c) => c.id === t.category)?.color ?? colors.border }]}>
                      <Text style={styles.tacticTagName}>{t.name}</Text>
                      <Text style={styles.tacticTagDesc}>{t.description}</Text>
                    </View>
                  ))}
                </View>
              )}

              {feedback?.lineId === line.id && (
                <View style={[styles.feedbackBanner, feedback.result.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                  <Icon name={feedback.result.isCorrect ? 'check-circle' : 'close-circle'} size={16} color={feedback.result.isCorrect ? colors.success : colors.error} />
                  <Text style={styles.feedbackText}>
                    {feedback.result.isCorrect
                      ? `Correct! ${feedback.result.matchedTactic?.name}`
                      : 'Not quite — try another category or line.'}
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {!reviewMode && (
        <View style={styles.controlsContainer}>
          <Text style={styles.controlsLabel}>Select a tactic to spot:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {TACTIC_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat.id && { backgroundColor: cat.color + '30', borderColor: cat.color },
                ]}
                onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: cat.color }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.actionRow}>
            {currentLine?.isClean && (
              <Button title="No Tactic Here" onPress={() => handleMarkClean(currentLine.id)} variant="secondary" size="sm" />
            )}
            <Button
              title={isLastLine ? 'Finish' : 'Next Line'}
              onPress={handleAdvance}
              variant="primary"
              size="sm"
            />
          </View>
        </View>
      )}

      {reviewMode && (
        <View style={styles.reviewBar}>
          <Button title="Back to Results" onPress={() => setScreenState('results')} variant="outline" />
          <Button title="Try Another" onPress={() => setScreenState('select')} variant="primary" />
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
  howItWorks: { marginBottom: spacing.lg },
  howCard: { padding: spacing.md },
  howTitle: { ...typography.h3, color: colors.accent, marginBottom: spacing.md },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  stepNumber: { ...typography.button, color: colors.textOnPrimary, backgroundColor: colors.primary, width: 28, height: 28, borderRadius: 14, textAlign: 'center', lineHeight: 28 },
  stepText: { ...typography.body, color: colors.text, flex: 1 },
  scenarioCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  scenarioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  scenarioTitle: { ...typography.h3, color: colors.text },
  difficultyBadge: { flexDirection: 'row', gap: 3 },
  diffDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  diffDotActive: { backgroundColor: colors.accent },
  scenarioContext: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  scenarioMeta: { ...typography.caption, color: colors.textMuted },
  playHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  playTitle: { ...typography.h3, color: colors.text },
  playProgress: { ...typography.caption, color: colors.textMuted },
  dialogueContainer: { flex: 1 },
  dialogueContent: { padding: spacing.lg },
  contextText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  dialogueLine: { marginBottom: spacing.md, padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'transparent' },
  dialogueLineActive: { borderColor: colors.primaryLight, backgroundColor: colors.primary + '08' },
  speaker: { ...typography.label, color: colors.accent, marginBottom: spacing.xs },
  lineText: { ...typography.body, color: colors.text, lineHeight: 24 },
  lineTextSelectable: { backgroundColor: colors.primary + '10', borderRadius: borderRadius.sm },
  revealedTactics: { marginTop: spacing.sm, gap: spacing.xs },
  tacticTag: { borderWidth: 1, borderRadius: borderRadius.sm, padding: spacing.sm },
  tacticTagName: { ...typography.label, color: colors.accent },
  tacticTagDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  feedbackBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, padding: spacing.sm, borderRadius: borderRadius.sm },
  feedbackCorrect: { backgroundColor: colors.success + '15' },
  feedbackWrong: { backgroundColor: colors.error + '15' },
  feedbackText: { ...typography.bodySmall, color: colors.text, flex: 1 },
  controlsContainer: { padding: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  controlsLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.sm },
  categoriesScroll: { marginBottom: spacing.md },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm },
  categoryEmoji: { fontSize: 14 },
  categoryLabel: { ...typography.caption, color: colors.textSecondary },
  actionRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  reviewBar: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  bigScore: { ...typography.hero, color: colors.accent },
  scoreLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', gap: spacing.xxl },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { ...typography.h2, color: colors.text },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },
  missedCard: { padding: spacing.md, marginBottom: spacing.lg },
  missedTitle: { ...typography.h3, color: colors.error, marginBottom: spacing.sm },
  missedItem: { marginBottom: spacing.sm, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  missedName: { ...typography.button, color: colors.text },
  missedDesc: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, gap: spacing.md },
  catIcon: { fontSize: 18 },
  catLabel: { ...typography.body, color: colors.text, flex: 1 },
  catScore: { ...typography.button },
  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
