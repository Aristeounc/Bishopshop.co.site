import React, { useState, useRef } from 'react';
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
  startDecoder,
  beginGuessing,
  submitDecoderGuess,
  advanceDecoderCard,
  DecoderState,
  DecoderAnswer,
} from '@/services/emotionalDecoder/engine';
import {
  DECODER_SETS,
  EMOTION_OPTIONS,
  DecoderSet,
} from '@/services/emotionalDecoder/scenarios';

type ScreenState = 'select' | 'playing' | 'results';

const RATING_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  surface_reader: { label: 'Surface Reader', color: colors.textMuted, icon: 'eye-off-outline' },
  observant: { label: 'Observant', color: colors.info, icon: 'eye-outline' },
  empath: { label: 'Empath', color: colors.success, icon: 'heart-pulse' },
  decoder: { label: 'Decoder', color: colors.accent, icon: 'brain' },
};

export function EmotionalDecoderScreen() {
  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<DecoderState | null>(null);
  const [lastAnswer, setLastAnswer] = useState<DecoderAnswer | null>(null);
  const [guessStartTime, setGuessStartTime] = useState(0);
  const cardFlipAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;

  function handleStartSet(set: DecoderSet) {
    const state = startDecoder(set.id);
    setGameState(state);
    setScreenState('playing');
    setLastAnswer(null);
    cardFlipAnim.setValue(0);
  }

  function handleBeginGuessing() {
    if (!gameState) return;
    setGameState(beginGuessing(gameState));
    setGuessStartTime(Date.now());
  }

  function handleSelectEmotion(emotionId: string) {
    if (!gameState || gameState.phase !== 'guessing') return;

    const timeMs = Date.now() - guessStartTime;
    const { state, answer } = submitDecoderGuess(gameState, emotionId, timeMs);
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
    const updated = advanceDecoderCard(gameState);
    setGameState(updated);
    setLastAnswer(null);

    if (updated.isComplete) {
      setScreenState('results');
    } else {
      cardFlipAnim.setValue(0);
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
        <Text style={styles.title}>Emotional Decoder</Text>
        <Text style={styles.subtitle}>
          Read the surface emotion and decode what's really going on underneath.
        </Text>

        <Card variant="outlined" style={styles.howCard}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howStep}>
            <Icon name="card-text-outline" size={20} color={colors.info} />
            <Text style={styles.stepText}>Read a situation with visible emotional cues</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="magnify" size={20} color={colors.accent} />
            <Text style={styles.stepText}>Look beyond surface anger or silence</Text>
          </View>
          <View style={styles.howStep}>
            <Icon name="heart-pulse" size={20} color={colors.error} />
            <Text style={styles.stepText}>Identify the hidden emotion driving the behavior</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Choose a Set</Text>
        {DECODER_SETS.map((set) => (
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
            <Text style={styles.setMeta}>{set.cards.length} cards</Text>
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
          <Text style={styles.bigScore}>{score.accuracy}%</Text>
          <Text style={styles.scoreLabel}>Accuracy</Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.correctCount}/{score.totalCards}</Text>
              <Text style={styles.scoreStatLabel}>Correct</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{score.bestStreak}</Text>
              <Text style={styles.scoreStatLabel}>Best Streak</Text>
            </View>
            <View style={styles.scoreStat}>
              <Text style={styles.scoreStatValue}>{(score.averageTimeMs / 1000).toFixed(1)}s</Text>
              <Text style={styles.scoreStatLabel}>Avg Time</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Card Breakdown</Text>
        {gameState.answers.map((answer, idx) => {
          const card = gameState.set.cards[idx];
          if (!card) return null;
          const selectedEmotion = EMOTION_OPTIONS.find((e) => e.id === answer.selectedEmotionId);
          const correctEmotion = EMOTION_OPTIONS.find((e) => e.id === card.hiddenEmotionId);

          return (
            <Card key={card.id} style={styles.breakdownCard}>
              <Text style={styles.breakdownSituation}>{card.situation}</Text>
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownEmotion}>
                  <Text style={styles.breakdownEmotionLabel}>Your guess:</Text>
                  <View style={[styles.emotionChip, { backgroundColor: (selectedEmotion?.color ?? colors.textMuted) + '20' }]}>
                    <Icon name={selectedEmotion?.icon ?? 'help'} size={14} color={selectedEmotion?.color ?? colors.textMuted} />
                    <Text style={[styles.emotionChipText, { color: selectedEmotion?.color }]}>
                      {selectedEmotion?.label ?? 'Unknown'}
                    </Text>
                  </View>
                </View>
                {!answer.isCorrect && (
                  <View style={styles.breakdownEmotion}>
                    <Text style={styles.breakdownEmotionLabel}>Correct:</Text>
                    <View style={[styles.emotionChip, { backgroundColor: (correctEmotion?.color ?? colors.textMuted) + '20' }]}>
                      <Icon name={correctEmotion?.icon ?? 'help'} size={14} color={correctEmotion?.color ?? colors.textMuted} />
                      <Text style={[styles.emotionChipText, { color: correctEmotion?.color }]}>
                        {correctEmotion?.label ?? 'Unknown'}
                      </Text>
                    </View>
                  </View>
                )}
                <Icon
                  name={answer.isCorrect ? 'check-circle' : 'close-circle'}
                  size={20}
                  color={answer.isCorrect ? colors.success : colors.error}
                />
              </View>
              {!answer.isCorrect && (
                <Text style={styles.breakdownExplanation}>{card.explanation}</Text>
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
  const card = gameState.set.cards[gameState.currentIndex];
  if (!card) return null;

  const isReading = gameState.phase === 'reading';
  const isGuessing = gameState.phase === 'guessing';
  const isReveal = gameState.phase === 'reveal';

  const correctEmotion = EMOTION_OPTIONS.find((e) => e.id === card.hiddenEmotionId);
  const emotionChoices = EMOTION_OPTIONS.filter(
    (e) => e.id === card.hiddenEmotionId || card.decoyEmotions.includes(e.id),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBackToSelect}>
          <Icon name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.streakContainer}>
          {gameState.score.streak > 0 && (
            <View style={styles.streakBadge}>
              <Icon name="fire" size={16} color={colors.accent} />
              <Text style={styles.streakText}>{gameState.score.streak} streak</Text>
            </View>
          )}
        </View>
        <Text style={styles.questionCount}>
          {gameState.currentIndex + 1}/{gameState.set.cards.length}
        </Text>
      </View>

      <ScrollView style={styles.playBody} contentContainerStyle={styles.playBodyContent}>
        {/* Situation card */}
        <Card style={styles.situationCard} variant="elevated">
          <View style={styles.speakerBadge}>
            <Icon name="account-outline" size={16} color={colors.textMuted} />
            <Text style={styles.speakerText}>{card.speaker}</Text>
          </View>
          <Text style={styles.situationText}>{card.situation}</Text>
          <View style={styles.quoteBox}>
            <Icon name="format-quote-open" size={20} color={colors.accent + '40'} />
            <Text style={styles.statementText}>{card.statement}</Text>
          </View>
          <View style={styles.cueRow}>
            <Icon name="eye-outline" size={14} color={colors.textMuted} />
            <Text style={styles.cueText}>{card.bodyLanguage}</Text>
          </View>
          <View style={styles.surfaceRow}>
            <Text style={styles.surfaceLabel}>Surface emotion:</Text>
            <Text style={styles.surfaceValue}>{card.surfaceEmotion}</Text>
          </View>
        </Card>

        {/* Reading phase prompt */}
        {isReading && (
          <View style={styles.readingPrompt}>
            <Text style={styles.readingText}>
              What's the hidden emotion behind these words?
            </Text>
            <Button
              title="I'm Ready to Guess"
              onPress={handleBeginGuessing}
              variant="accent"
              icon="brain"
            />
          </View>
        )}

        {/* Guessing phase — emotion grid */}
        {isGuessing && (
          <>
            <Text style={styles.guessPrompt}>What are they really feeling?</Text>
            <View style={styles.emotionGrid}>
              {emotionChoices.map((emotion) => (
                <TouchableOpacity
                  key={emotion.id}
                  style={[styles.emotionCard, { borderColor: emotion.color + '40' }]}
                  onPress={() => handleSelectEmotion(emotion.id)}
                  activeOpacity={0.7}
                >
                  <Icon name={emotion.icon} size={28} color={emotion.color} />
                  <Text style={[styles.emotionLabel, { color: emotion.color }]}>
                    {emotion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                  {lastAnswer.isCorrect ? 'Exactly right!' : 'Not quite'}
                </Text>
              </View>

              <View style={styles.revealAnswer}>
                <Text style={styles.revealLabel}>Hidden emotion:</Text>
                <View style={[styles.emotionChip, { backgroundColor: (correctEmotion?.color ?? colors.textMuted) + '20' }]}>
                  <Icon name={correctEmotion?.icon ?? 'help'} size={16} color={correctEmotion?.color} />
                  <Text style={[styles.emotionChipText, { color: correctEmotion?.color }]}>
                    {card.hiddenEmotion}
                  </Text>
                </View>
              </View>

              <Text style={styles.revealExplanation}>{card.explanation}</Text>

              <View style={styles.betterResponseBox}>
                <Text style={styles.betterResponseLabel}>A better response would be:</Text>
                <Text style={styles.betterResponseText}>{card.betterResponse}</Text>
              </View>
            </Card>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom */}
      {isReveal && (
        <View style={styles.bottomBar}>
          <Button
            title={
              gameState.currentIndex >= gameState.set.cards.length - 1
                ? 'See Results'
                : 'Next Card'
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

  playBody: { flex: 1 },
  playBodyContent: { padding: spacing.lg, paddingBottom: spacing.xxl },

  situationCard: { padding: spacing.lg, marginBottom: spacing.md },
  speakerBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  speakerText: { ...typography.label, color: colors.textSecondary },
  situationText: { ...typography.body, color: colors.text, marginBottom: spacing.md },
  quoteBox: { flexDirection: 'row', gap: spacing.sm, paddingLeft: spacing.sm, marginBottom: spacing.md },
  statementText: { ...typography.h3, color: colors.text, fontStyle: 'italic', flex: 1, lineHeight: 26 },
  cueRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  cueText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic' },
  surfaceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border },
  surfaceLabel: { ...typography.caption, color: colors.textMuted },
  surfaceValue: { ...typography.label, color: colors.warning },

  readingPrompt: { alignItems: 'center', gap: spacing.lg, marginTop: spacing.lg },
  readingText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },

  guessPrompt: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  emotionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center' },
  emotionCard: { width: '47%', alignItems: 'center', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1.5 },
  emotionLabel: { ...typography.label, textAlign: 'center' },

  revealCard: { padding: spacing.lg, borderWidth: 1.5, borderRadius: borderRadius.lg, marginTop: spacing.sm },
  revealHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  revealTitle: { ...typography.h3 },
  revealAnswer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  revealLabel: { ...typography.bodySmall, color: colors.textMuted },
  emotionChip: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  emotionChipText: { ...typography.label },
  revealExplanation: { ...typography.body, color: colors.text, lineHeight: 24, marginBottom: spacing.md },
  betterResponseBox: { backgroundColor: colors.surface, padding: spacing.md, borderRadius: borderRadius.md, borderLeftWidth: 3, borderLeftColor: colors.accent },
  betterResponseLabel: { ...typography.caption, color: colors.accent, marginBottom: spacing.xs },
  betterResponseText: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic', lineHeight: 22 },

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
  breakdownSituation: { ...typography.bodySmall, color: colors.text, marginBottom: spacing.sm },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  breakdownEmotion: { flex: 1 },
  breakdownEmotionLabel: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.xs },
  breakdownExplanation: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18 },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
