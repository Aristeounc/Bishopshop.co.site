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
  startSubtextSession,
  submitTranslation,
  advancePrompt,
  SubtextState,
  SubtextResponse,
} from '@/services/subtextTranslator/engine';
import { SUBTEXT_SETS, SubtextSet } from '@/services/subtextTranslator/prompts';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const EMOTION_CHIPS = [
  { id: 'hurt', label: 'Hurt', icon: 'heart-broken', color: '#FF6B6B' },
  { id: 'fear', label: 'Fear', icon: 'alert-circle', color: '#D29922' },
  { id: 'anger', label: 'Anger', icon: 'fire', color: '#D93025' },
  { id: 'loneliness', label: 'Loneliness', icon: 'account-off', color: '#7B68EE' },
  { id: 'frustration', label: 'Frustration', icon: 'emoticon-angry', color: '#FF8C42' },
  { id: 'resentment', label: 'Resentment', icon: 'thought-bubble', color: '#8B6914' },
  { id: 'sadness', label: 'Sadness', icon: 'emoticon-sad', color: '#58A6FF' },
  { id: 'anxiety', label: 'Anxiety', icon: 'head-question', color: '#4ECDC4' },
  { id: 'shame', label: 'Shame', icon: 'eye-off', color: '#7B2D8E' },
  { id: 'exhaustion', label: 'Exhaustion', icon: 'sleep', color: '#4A5568' },
];

const RATING_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  novice: { label: 'Novice', icon: 'school', color: colors.textMuted },
  perceptive: { label: 'Perceptive', icon: 'eye', color: colors.info },
  empath: { label: 'Empath', icon: 'heart', color: colors.skill.empathize },
  mind_reader: { label: 'Mind Reader', icon: 'head-lightbulb', color: colors.accent },
};

export function SubtextTranslatorScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'subtext_translator')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('subtext_translator'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<SubtextState | null>(null);
  const [translationInput, setTranslationInput] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<SubtextResponse | null>(null);
  const [showingReveal, setShowingReveal] = useState(false);

  function handleStartSet(set: SubtextSet) {
    setGameState(startSubtextSession(set.id));
    setScreenState('playing');
    setTranslationInput('');
    setSelectedEmotion(null);
    setLastResponse(null);
    setShowingReveal(false);
  }

  function handleSubmitTranslation() {
    if (!gameState || !translationInput.trim() || !selectedEmotion) return;

    const { state, response } = submitTranslation(
      gameState,
      translationInput.trim(),
      selectedEmotion,
    );
    setGameState(state);
    setLastResponse(response);
    setShowingReveal(true);
  }

  function handleNextPrompt() {
    if (!gameState) return;
    const updated = advancePrompt(gameState);
    setGameState(updated);
    setTranslationInput('');
    setSelectedEmotion(null);
    setLastResponse(null);
    setShowingReveal(false);

    if (updated.isComplete) {
      setScreenState('results');
      const uid = useStore.getState().user?.id;
      if (uid) {
        saveDrillResult(uid, 'subtext_translator', updated.score.averageAccuracy, 'listen').catch(() => {});
        updateStreak(uid).catch(() => {});
      }
    }
  }

  function handleBackToSelect() {
    setScreenState('select');
    setGameState(null);
    setTranslationInput('');
    setSelectedEmotion(null);
    setLastResponse(null);
    setShowingReveal(false);
  }

  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Subtext Translator</Text>
        <Text style={styles.subtitle}>
          Read between the lines — translate what people really mean beneath what they say
        </Text>

        <View style={styles.howItWorks}>
          <Card variant="outlined" style={styles.howCard}>
            <Text style={styles.howTitle}>How It Works</Text>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Read the statement someone says out loud and the context</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Write what you think they really mean underneath</Text>
            </View>
            <View style={styles.howStep}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Pick the core emotion driving the statement</Text>
            </View>
          </Card>
        </View>

        <Text style={styles.sectionTitle}>Sets</Text>
        {SUBTEXT_SETS.map((set) => (
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
              {set.prompts.length} prompts
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (screenState === 'results' && gameState) {
    const { score } = gameState;
    const ratingInfo = RATING_LABELS[score.overallRating];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.subtitle}>{gameState.set.title}</Text>

        <Card style={styles.scoreCard} variant="elevated">
          <Icon name={ratingInfo.icon} size={48} color={ratingInfo.color} />
          <Text style={[styles.ratingLabel, { color: ratingInfo.color }]}>
            {ratingInfo.label}
          </Text>
          <Text style={styles.bigScore}>{score.averageAccuracy}%</Text>
          <Text style={styles.scoreLabel}>Average Accuracy</Text>
          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {score.emotionsCorrect}/{score.completed}
              </Text>
              <Text style={styles.scoreStatLabel}>Emotions</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>
                {score.completed}/{score.totalPrompts}
              </Text>
              <Text style={styles.scoreStatLabel}>Completed</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Breakdown</Text>
        {gameState.set.prompts.map((prompt, index) => {
          const response = gameState.responses[index];
          if (!response) return null;

          return (
            <Card key={prompt.id} style={styles.breakdownCard}>
              <Text style={styles.breakdownStatement}>"{prompt.statement}"</Text>
              <Text style={styles.breakdownSpeaker}>
                {prompt.speaker} - {prompt.context}
              </Text>

              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownLabel}>Your translation:</Text>
                <Text style={styles.breakdownPlayerText}>
                  {response.playerTranslation}
                </Text>
              </View>

              <View style={styles.breakdownSection}>
                <Text style={styles.breakdownLabel}>Actual subtext:</Text>
                <Text style={styles.breakdownActualText}>
                  {prompt.actualSubtext}
                </Text>
              </View>

              <View style={styles.breakdownFooter}>
                <View style={styles.breakdownScoreBadge}>
                  <Text style={styles.breakdownScoreText}>
                    {response.accuracyScore}%
                  </Text>
                </View>
                <View style={[
                  styles.emotionMatchBadge,
                  response.emotionMatch ? styles.emotionMatchCorrect : styles.emotionMatchWrong,
                ]}>
                  <Icon
                    name={response.emotionMatch ? 'check-circle' : 'close-circle'}
                    size={14}
                    color={response.emotionMatch ? colors.success : colors.error}
                  />
                  <Text style={[
                    styles.emotionMatchText,
                    { color: response.emotionMatch ? colors.success : colors.error },
                  ]}>
                    {prompt.underlyingEmotion}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}

        <View style={styles.resultActions}>
          <Button title="Try Another Set" onPress={handleBackToSelect} variant="outline" />
          <Button title="Replay" onPress={() => handleStartSet(gameState.set)} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  if (!gameState) return null;

  const currentPrompt = gameState.set.prompts[gameState.currentIndex];
  const canSubmit = translationInput.trim().length > 0 && selectedEmotion !== null;

  return (
    <View style={styles.container}>
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.playTitle}>{gameState.set.title}</Text>
        <Text style={styles.playProgress}>
          {gameState.currentIndex + 1}/{gameState.set.prompts.length}
        </Text>
      </View>

      <ScrollView style={styles.playScroll} contentContainerStyle={styles.playContent}>
        <View style={styles.statementContainer}>
          <Icon name="format-quote-open" size={32} color={colors.accent} style={styles.quoteIcon} />
          <Text style={styles.statementText}>{currentPrompt.statement}</Text>
          <Icon name="format-quote-close" size={32} color={colors.accent} style={styles.quoteIconClose} />
        </View>

        <View style={styles.contextContainer}>
          <Text style={styles.speakerLabel}>{currentPrompt.speaker}</Text>
          <Text style={styles.contextText}>{currentPrompt.context}</Text>
        </View>

        {!showingReveal ? (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>What are they really saying?</Text>
            <TextInput
              style={styles.translationInput}
              value={translationInput}
              onChangeText={setTranslationInput}
              placeholder="Translate the subtext..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
              maxLength={2000}
              accessibilityLabel="Translate the subtext"
            />

            <Text style={styles.inputLabel}>What emotion is underneath?</Text>
            <View style={styles.emotionGrid}>
              {EMOTION_CHIPS.map((emotion) => (
                <TouchableOpacity
                  key={emotion.id}
                  style={[
                    styles.emotionChip,
                    selectedEmotion === emotion.id && {
                      backgroundColor: emotion.color + '30',
                      borderColor: emotion.color,
                    },
                  ]}
                  onPress={() =>
                    setSelectedEmotion(selectedEmotion === emotion.id ? null : emotion.id)
                  }
                >
                  <Icon
                    name={emotion.icon}
                    size={16}
                    color={selectedEmotion === emotion.id ? emotion.color : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.emotionLabel,
                      selectedEmotion === emotion.id && { color: emotion.color },
                    ]}
                  >
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Submit Translation"
              onPress={handleSubmitTranslation}
              variant="primary"
              size="lg"
              disabled={!canSubmit}
            />
          </View>
        ) : (
          <View style={styles.revealSection}>
            {lastResponse && (
              <>
                <Card style={styles.revealCard} variant="elevated">
                  <View style={styles.revealHeader}>
                    <Text style={styles.revealScoreValue}>
                      {lastResponse.accuracyScore}%
                    </Text>
                    <Text style={styles.revealScoreLabel}>Accuracy</Text>
                  </View>

                  <View style={styles.revealComparison}>
                    <View style={styles.revealBlock}>
                      <Text style={styles.revealBlockLabel}>You said:</Text>
                      <Text style={styles.revealBlockText}>
                        {lastResponse.playerTranslation}
                      </Text>
                    </View>

                    <View style={styles.revealDivider} />

                    <View style={styles.revealBlock}>
                      <Text style={styles.revealBlockLabel}>Actual subtext:</Text>
                      <Text style={styles.revealBlockTextActual}>
                        {currentPrompt.actualSubtext}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.emotionResult}>
                    <Icon
                      name={lastResponse.emotionMatch ? 'check-circle' : 'close-circle'}
                      size={20}
                      color={lastResponse.emotionMatch ? colors.success : colors.error}
                    />
                    <Text style={styles.emotionResultText}>
                      {lastResponse.emotionMatch
                        ? `Correct! The emotion is ${currentPrompt.underlyingEmotion}.`
                        : `The emotion was ${currentPrompt.underlyingEmotion}, not ${selectedEmotion}.`}
                    </Text>
                  </View>
                </Card>

                <Button
                  title={
                    gameState.currentIndex >= gameState.set.prompts.length - 1
                      ? 'See Results'
                      : 'Next Prompt'
                  }
                  onPress={handleNextPrompt}
                  variant="primary"
                  size="lg"
                  icon={
                    <Icon
                      name={
                        gameState.currentIndex >= gameState.set.prompts.length - 1
                          ? 'chart-bar'
                          : 'arrow-right'
                      }
                      size={20}
                      color={colors.textOnPrimary}
                    />
                  }
                />
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
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

  // Playing state
  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { padding: spacing.xs },
  playTitle: { ...typography.h3, color: colors.text, flex: 1, marginLeft: spacing.sm },
  playProgress: { ...typography.caption, color: colors.textMuted },
  playScroll: { flex: 1 },
  playContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  statementContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  quoteIcon: { alignSelf: 'flex-start', marginBottom: spacing.xs },
  quoteIconClose: { alignSelf: 'flex-end', marginTop: spacing.xs },
  statementText: {
    ...typography.hero,
    color: colors.text,
    textAlign: 'center',
  },

  contextContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  speakerLabel: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  contextText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  inputSection: { gap: spacing.md },
  inputLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  translationInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
  },

  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emotionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emotionLabel: { ...typography.caption, color: colors.textSecondary },

  // Reveal state
  revealSection: { gap: spacing.lg },
  revealCard: { padding: spacing.lg, marginBottom: spacing.md },
  revealHeader: { alignItems: 'center', marginBottom: spacing.lg },
  revealScoreValue: { ...typography.hero, color: colors.accent },
  revealScoreLabel: { ...typography.caption, color: colors.textMuted },
  revealComparison: { gap: spacing.md, marginBottom: spacing.lg },
  revealBlock: {},
  revealBlockLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  revealBlockText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  revealDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  revealBlockTextActual: {
    ...typography.body,
    color: colors.accent,
  },
  emotionResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  emotionResultText: { ...typography.bodySmall, color: colors.text, flex: 1 },

  // Results state
  scoreCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  ratingLabel: { ...typography.h2, marginTop: spacing.sm },
  bigScore: { ...typography.hero, color: colors.accent, marginTop: spacing.xs },
  scoreLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  scoreRow: { flexDirection: 'row', gap: spacing.xxl },
  scoreStat: { alignItems: 'center' },
  scoreStatValue: { ...typography.h2, color: colors.text },
  scoreStatLabel: { ...typography.caption, color: colors.textMuted },

  breakdownCard: { padding: spacing.md, marginBottom: spacing.md },
  breakdownStatement: {
    ...typography.h3,
    color: colors.text,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  breakdownSpeaker: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  breakdownSection: { marginBottom: spacing.sm },
  breakdownLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: 2,
  },
  breakdownPlayerText: { ...typography.bodySmall, color: colors.textSecondary },
  breakdownActualText: { ...typography.bodySmall, color: colors.accent },
  breakdownFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  breakdownScoreBadge: {
    backgroundColor: colors.primary + '20',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  breakdownScoreText: { ...typography.label, color: colors.primaryLight },
  emotionMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  emotionMatchCorrect: { backgroundColor: colors.success + '15' },
  emotionMatchWrong: { backgroundColor: colors.error + '15' },
  emotionMatchText: { ...typography.caption },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
