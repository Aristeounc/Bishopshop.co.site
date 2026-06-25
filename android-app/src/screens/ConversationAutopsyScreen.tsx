import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import {
  startAutopsy,
  revealNextLine,
  selectDerailmentLine,
  submitDiagnosis,
  submitRewrite,
  calculateAutopsyScore,
  AutopsyState,
} from '@/services/conversationAutopsy/engine';
import {
  AUTOPSY_SCENARIOS,
  AutopsyScenario,
  MistakeCategory,
} from '@/services/conversationAutopsy/scenarios';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const MISTAKE_CATEGORIES: { id: MistakeCategory; label: string; icon: string; color: string }[] = [
  { id: 'criticism', label: 'Criticism', icon: 'sword-cross', color: '#D93025' },
  { id: 'contempt', label: 'Contempt', icon: 'emoticon-angry', color: '#7B2D8E' },
  { id: 'defensiveness', label: 'Defensiveness', icon: 'shield-alert', color: '#D29922' },
  { id: 'stonewalling', label: 'Stonewalling', icon: 'wall', color: '#4A5568' },
  { id: 'boundary_violation', label: 'Boundary Violation', icon: 'fence', color: '#1A365D' },
  { id: 'manipulation', label: 'Manipulation', icon: 'puppet', color: '#E6A817' },
  { id: 'escalation', label: 'Escalation', icon: 'trending-up', color: '#F85149' },
  { id: 'invalidation', label: 'Invalidation', icon: 'cancel', color: '#8B949E' },
];

export function ConversationAutopsyScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'conversation_autopsy')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('conversation_autopsy'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<AutopsyState | null>(null);
  const [rewriteText, setRewriteText] = useState('');
  const [selectionFeedback, setSelectionFeedback] = useState<{ lineId: string; isCorrect: boolean } | null>(null);

  function handleStartScenario(scenario: AutopsyScenario) {
    setGameState(startAutopsy(scenario.id));
    setScreenState('playing');
    setRewriteText('');
    setSelectionFeedback(null);
  }

  function handleRevealNext() {
    if (!gameState) return;
    const updated = revealNextLine(gameState);
    setGameState(updated);
  }

  function handleSelectLine(lineId: string) {
    if (!gameState || gameState.phase !== 'selecting') return;
    const { state, isCorrect } = selectDerailmentLine(gameState, lineId);
    setGameState(state);
    setSelectionFeedback({ lineId, isCorrect });
  }

  function handleSubmitDiagnosis(category: string) {
    if (!gameState) return;
    setGameState(submitDiagnosis(gameState, category));
  }

  function persistAutopsyResult(scored: AutopsyState) {
    const uid = useStore.getState().user?.id;
    if (uid) {
      saveDrillResult(uid, 'conversation_autopsy', scored.score.totalScore, 'listen').catch(() => {});
      updateStreak(uid).catch(() => {});
    }
  }

  function handleSubmitRewrite() {
    if (!gameState || !rewriteText.trim()) return;
    const withRewrite = submitRewrite(gameState, rewriteText);
    const scored = calculateAutopsyScore(withRewrite);
    setGameState(scored);
    setScreenState('results');
    persistAutopsyResult(scored);
  }

  function handleSkipRewrite() {
    if (!gameState) return;
    const scored = calculateAutopsyScore(gameState);
    setGameState(scored);
    setScreenState('results');
    persistAutopsyResult(scored);
  }

  // --- SELECT SCREEN ---
  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Conversation Autopsy</Text>
        <Text style={styles.subtitle}>
          Read conversations that went sideways. Find the exact moment it derailed, diagnose the mistake, and rewrite it.
        </Text>

        <View style={styles.howItWorks}>
          <Card variant="outlined" style={styles.howCard}>
            <Text style={styles.howTitle}>How It Works</Text>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Read the conversation as it unfolds line by line</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Tap the exact line where the conversation derailed</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Diagnose what type of mistake was made</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>4</Text>
              <Text style={styles.stepText}>Rewrite the bad line to save the conversation</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Scenarios</Text>
        {AUTOPSY_SCENARIOS.map((scenario) => (
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
              {scenario.dialogue.length} lines
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // --- RESULTS SCREEN ---
  if (screenState === 'results' && gameState) {
    const { score } = gameState;
    const derailmentLine = gameState.scenario.dialogue.find((l) => l.isDerailment);
    const selectedLine = gameState.scenario.dialogue.find((l) => l.id === gameState.playerSelection);
    const catInfo = MISTAKE_CATEGORIES.find((c) => c.id === gameState.scenario.mistakeCategory);
    const playerCatInfo = MISTAKE_CATEGORIES.find((c) => c.id === gameState.playerDiagnosis);

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Autopsy Results</Text>
        <Text style={styles.subtitle}>{gameState.scenario.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Text style={styles.bigScore}>{score.totalScore}</Text>
          <Text style={styles.scoreLabel}>out of 100</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Icon
                name={score.correctDerailment ? 'check-circle' : 'close-circle'}
                size={24}
                color={score.correctDerailment ? colors.success : colors.error}
              />
              <Text style={styles.scoreStatLabel}>Correct Line</Text>
            </View>
            <View style={styles.scoreStat}>
              <Icon
                name={score.diagnosisScore > 0 ? 'check-circle' : 'close-circle'}
                size={24}
                color={score.diagnosisScore > 0 ? colors.success : colors.error}
              />
              <Text style={styles.scoreStatLabel}>Diagnosis</Text>
            </View>
            <View style={styles.scoreStat}>
              <Icon
                name={score.rewriteSubmitted ? 'check-circle' : 'minus-circle'}
                size={24}
                color={score.rewriteSubmitted ? colors.success : colors.textMuted}
              />
              <Text style={styles.scoreStatLabel}>Rewrite</Text>
            </View>
          </View>
        </Card>

        {/* Derailment comparison */}
        <Card style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>The Derailment Point</Text>
          {derailmentLine && (
            <View style={styles.comparisonBlock}>
              <Text style={styles.comparisonLabel}>
                <Icon name="alert-circle" size={14} color={colors.error} /> Actual derailment
              </Text>
              <Text style={styles.comparisonSpeaker}>{derailmentLine.speaker}</Text>
              <Text style={styles.comparisonText}>{derailmentLine.text}</Text>
            </View>
          )}
          {!score.correctDerailment && selectedLine && (
            <View style={styles.comparisonBlock}>
              <Text style={styles.comparisonLabel}>
                <Icon name="close-circle" size={14} color={colors.warning} /> Your pick
              </Text>
              <Text style={styles.comparisonSpeaker}>{selectedLine.speaker}</Text>
              <Text style={styles.comparisonText}>{selectedLine.text}</Text>
            </View>
          )}
        </Card>

        {/* Diagnosis */}
        <Card style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Diagnosis</Text>
          <Text style={styles.diagnosisExplanation}>{gameState.scenario.derailmentDiagnosis}</Text>
          <View style={styles.diagnosisRow}>
            <View style={styles.diagnosisItem}>
              <Text style={styles.comparisonLabel}>Correct</Text>
              <View style={[styles.categoryBadge, { borderColor: catInfo?.color ?? colors.border }]}>
                <Icon name={catInfo?.icon ?? 'help'} size={16} color={catInfo?.color ?? colors.textMuted} />
                <Text style={[styles.categoryBadgeText, { color: catInfo?.color }]}>{catInfo?.label}</Text>
              </View>
            </View>
            {playerCatInfo && playerCatInfo.id !== catInfo?.id && (
              <View style={styles.diagnosisItem}>
                <Text style={styles.comparisonLabel}>Your guess</Text>
                <View style={[styles.categoryBadge, { borderColor: colors.error }]}>
                  <Icon name={playerCatInfo.icon} size={16} color={colors.error} />
                  <Text style={[styles.categoryBadgeText, { color: colors.error }]}>{playerCatInfo.label}</Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        {/* Rewrite comparison */}
        <Card style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>The Rewrite</Text>
          <View style={styles.comparisonBlock}>
            <Text style={styles.comparisonLabel}>
              <Icon name="star" size={14} color={colors.accent} /> Model rewrite
            </Text>
            <Text style={styles.comparisonText}>{gameState.scenario.betterAlternative}</Text>
          </View>
          {gameState.playerRewrite && (
            <View style={styles.comparisonBlock}>
              <Text style={styles.comparisonLabel}>
                <Icon name="pencil" size={14} color={colors.info} /> Your rewrite
              </Text>
              <Text style={styles.comparisonText}>{gameState.playerRewrite}</Text>
            </View>
          )}
        </Card>

        <View style={styles.resultActions}>
          <Button title="Try Another" onPress={() => setScreenState('select')} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  // --- PLAYING SCREEN ---
  if (!gameState) return null;

  const allRevealed = gameState.currentLineIndex >= gameState.scenario.dialogue.length - 1;
  const isReading = gameState.phase === 'reading';
  const isSelecting = gameState.phase === 'selecting';
  const isDiagnosing = gameState.phase === 'diagnosing';
  const isRewriting = gameState.phase === 'rewriting';

  return (
    <View style={styles.container}>
      <View style={styles.playHeader}>
        <Text style={styles.playTitle}>{gameState.scenario.title}</Text>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseText}>
            {isReading && 'Read'}
            {isSelecting && 'Select the derailment'}
            {isDiagnosing && 'Diagnose'}
            {isRewriting && 'Rewrite'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.dialogueContainer} contentContainerStyle={styles.dialogueContent}>
        <Text style={styles.contextText}>{gameState.scenario.context}</Text>

        {gameState.revealedLines.map((lineIdx) => {
          const line = gameState.scenario.dialogue[lineIdx];
          const isSelected = gameState.playerSelection === line.id;
          const showFeedback = selectionFeedback?.lineId === line.id;

          return (
            <TouchableOpacity
              key={line.id}
              style={[
                styles.dialogueLine,
                isSelecting && styles.dialogueLineSelectable,
                isSelected && (selectionFeedback?.isCorrect ? styles.dialogueLineCorrect : styles.dialogueLineWrong),
              ]}
              onPress={() => isSelecting ? handleSelectLine(line.id) : undefined}
              activeOpacity={isSelecting ? 0.7 : 1}
              disabled={!isSelecting}
            >
              <Text style={styles.speaker}>{line.speaker}</Text>
              <Text style={styles.lineText}>{line.text}</Text>

              {showFeedback && (
                <View style={[styles.feedbackBanner, selectionFeedback.isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
                  <Icon
                    name={selectionFeedback.isCorrect ? 'check-circle' : 'close-circle'}
                    size={16}
                    color={selectionFeedback.isCorrect ? colors.success : colors.error}
                  />
                  <Text style={styles.feedbackText}>
                    {selectionFeedback.isCorrect
                      ? 'Correct! This is where it went wrong.'
                      : 'Not the derailment point, but the conversation continues from your pick.'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Controls area */}
      <View style={styles.controlsContainer}>
        {isReading && !allRevealed && (
          <Button title="Next Line" onPress={handleRevealNext} variant="primary" />
        )}

        {isReading && allRevealed && (
          <View>
            <Text style={styles.controlsLabel}>All lines revealed. Now select the derailment point above.</Text>
            <Button title="Start Selecting" onPress={() => setGameState({ ...gameState, phase: 'selecting' })} variant="primary" />
          </View>
        )}

        {isSelecting && (
          <Text style={styles.controlsLabel}>Tap the line where the conversation went off the rails.</Text>
        )}

        {isDiagnosing && (
          <View>
            <Text style={styles.controlsLabel}>What type of mistake was made?</Text>
            <View style={styles.categoryGrid}>
              {MISTAKE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, { borderColor: cat.color + '60' }]}
                  onPress={() => handleSubmitDiagnosis(cat.id)}
                >
                  <Icon name={cat.icon} size={18} color={cat.color} />
                  <Text style={[styles.categoryLabel, { color: cat.color }]}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isRewriting && (
          <View>
            <Text style={styles.controlsLabel}>
              Rewrite the line to keep the conversation on track:
            </Text>
            <TextInput
              style={styles.rewriteInput}
              value={rewriteText}
              onChangeText={setRewriteText}
              placeholder="Write a better version of that line..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={2000}
              accessibilityLabel="Rewrite the conversation line"
            />
            <View style={styles.actionRow}>
              <Button title="Skip" onPress={handleSkipRewrite} variant="outline" size="sm" />
              <Button title="Submit Rewrite" onPress={handleSubmitRewrite} variant="primary" size="sm" />
            </View>
          </View>
        )}
      </View>
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
  phaseBadge: { backgroundColor: colors.primary + '20', paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: borderRadius.full },
  phaseText: { ...typography.caption, color: colors.primaryLight },
  dialogueContainer: { flex: 1 },
  dialogueContent: { padding: spacing.lg },
  contextText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },
  dialogueLine: { marginBottom: spacing.md, padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: 'transparent' },
  dialogueLineSelectable: { borderColor: colors.primaryLight, borderStyle: 'dashed' },
  dialogueLineCorrect: { borderColor: colors.success, backgroundColor: colors.success + '10' },
  dialogueLineWrong: { borderColor: colors.error, backgroundColor: colors.error + '10' },
  speaker: { ...typography.label, color: colors.accent, marginBottom: spacing.xs },
  lineText: { ...typography.body, color: colors.text, lineHeight: 24 },
  feedbackBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm, padding: spacing.sm, borderRadius: borderRadius.sm },
  feedbackCorrect: { backgroundColor: colors.success + '15' },
  feedbackWrong: { backgroundColor: colors.error + '15' },
  feedbackText: { ...typography.bodySmall, color: colors.text, flex: 1 },
  controlsContainer: { padding: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  controlsLabel: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border },
  categoryLabel: { ...typography.caption, color: colors.textSecondary },
  rewriteInput: { ...typography.body, color: colors.text, backgroundColor: colors.background, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minHeight: 80, marginBottom: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  bigScore: { ...typography.hero, color: colors.accent },
  scoreLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  scoreRow: { flexDirection: 'row', gap: spacing.xxl },
  scoreStat: { alignItems: 'center', gap: spacing.xs },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },
  comparisonCard: { padding: spacing.md, marginBottom: spacing.md },
  comparisonTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  comparisonBlock: { marginBottom: spacing.md, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  comparisonLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.xs },
  comparisonSpeaker: { ...typography.label, color: colors.accent, marginBottom: spacing.xs },
  comparisonText: { ...typography.body, color: colors.text, lineHeight: 24 },
  diagnosisExplanation: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md, lineHeight: 22 },
  diagnosisRow: { flexDirection: 'row', gap: spacing.lg },
  diagnosisItem: { flex: 1 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full, borderWidth: 1 },
  categoryBadgeText: { ...typography.label },
  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
