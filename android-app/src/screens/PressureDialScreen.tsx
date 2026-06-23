import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { useStore } from '@/store/useStore';
import {
  PressurePrompt,
  PressureRound,
  MAX_HEARTS,
  adjustDifficulty,
  shouldLoseHeart,
  calculatePressureXp,
  getNextPrompt,
} from '@/services/pressureDial/engine';
import { getPersona } from '@/services/sparring/personas';
import { logScreenView } from '@/services/analytics';

interface PressureDialScreenProps {
  navigation: any;
}

type Phase = 'intro' | 'playing' | 'responding' | 'feedback' | 'gameover' | 'results';

export function PressureDialScreen({ navigation }: PressureDialScreenProps) {
  const user = useStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>('intro');
  const [difficulty, setDifficulty] = useState(1);
  const [peakDifficulty, setPeakDifficulty] = useState(1);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [rounds, setRounds] = useState<PressureRound[]>([]);
  const [usedIds, setUsedIds] = useState<Set<string>>(new Set());
  const [currentPrompt, setCurrentPrompt] = useState<PressurePrompt | null>(null);
  const [userResponse, setUserResponse] = useState('');
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState(0);

  const dialAnim = useRef(new Animated.Value(0.1)).current;
  const heartShake = useRef(new Animated.Value(0)).current;
  const scorePop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    logScreenView('PressureDial');
  }, []);

  useEffect(() => {
    Animated.timing(dialAnim, {
      toValue: difficulty / 10,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [difficulty, dialAnim]);

  const shakeHearts = useCallback(() => {
    Animated.sequence([
      Animated.timing(heartShake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(heartShake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(heartShake, { toValue: 6, duration: 50, useNativeDriver: true }),
      Animated.timing(heartShake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [heartShake]);

  const popScore = useCallback(() => {
    scorePop.setValue(0);
    Animated.sequence([
      Animated.timing(scorePop, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(scorePop, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, [scorePop]);

  const startGame = useCallback(() => {
    setDifficulty(1);
    setPeakDifficulty(1);
    setHearts(MAX_HEARTS);
    setRounds([]);
    setUsedIds(new Set());
    setLastScore(null);
    nextPrompt(1, new Set());
  }, []);

  function nextPrompt(diff: number, used: Set<string>) {
    const prompt = getNextPrompt(diff, used);
    if (!prompt) {
      finishGame([], diff, MAX_HEARTS);
      return;
    }
    setCurrentPrompt(prompt);
    setUserResponse('');
    setRoundStartTime(Date.now());
    setPhase('playing');
  }

  const submitResponse = useCallback(() => {
    if (!currentPrompt || userResponse.trim().length < 5) return;
    const timeMs = Date.now() - roundStartTime;

    const lengthScore = Math.min(30, userResponse.trim().length * 0.5);
    const speedScore = timeMs < 20000 ? 20 : timeMs < 40000 ? 10 : 0;
    const difficultyScore = currentPrompt.difficulty * 5;
    const score = Math.min(100, Math.round(lengthScore + speedScore + difficultyScore));

    const round: PressureRound = {
      prompt: currentPrompt,
      userResponse: userResponse.trim(),
      score,
      timeMs,
    };

    const newRounds = [...rounds, round];
    setRounds(newRounds);
    setLastScore(score);
    popScore();

    const newUsed = new Set(usedIds);
    newUsed.add(currentPrompt.id);
    setUsedIds(newUsed);

    let newHearts = hearts;
    if (shouldLoseHeart(score)) {
      newHearts = hearts - 1;
      setHearts(newHearts);
      shakeHearts();
    }

    const newDiff = adjustDifficulty(difficulty, score);
    setDifficulty(newDiff);
    if (newDiff > peakDifficulty) setPeakDifficulty(newDiff);

    if (newHearts <= 0) {
      finishGame(newRounds, peakDifficulty, 0);
      return;
    }

    setPhase('feedback');
    setTimeout(() => {
      nextPrompt(newDiff, newUsed);
    }, 2000);
  }, [currentPrompt, userResponse, roundStartTime, rounds, usedIds, hearts, difficulty, peakDifficulty, popScore, shakeHearts]);

  function finishGame(finalRounds: PressureRound[], peak: number, remainingHearts: number) {
    const xp = calculatePressureXp(finalRounds, peak, remainingHearts);
    setTotalXp(xp);
    setPhase(remainingHearts <= 0 ? 'gameover' : 'results');
  }

  const renderHearts = () => (
    <Animated.View style={[styles.heartsRow, { transform: [{ translateX: heartShake }] }]}>
      {Array.from({ length: MAX_HEARTS }).map((_, i) => (
        <Icon
          key={i}
          name={i < hearts ? 'heart' : 'heart-outline'}
          size={24}
          color={i < hearts ? colors.error : colors.textMuted}
        />
      ))}
    </Animated.View>
  );

  const renderDial = () => {
    const dialColor = dialAnim.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [colors.success, colors.warning, '#FF8C42', colors.error],
    });

    return (
      <View style={styles.dialContainer}>
        <View style={styles.dialTrack}>
          <Animated.View
            style={[
              styles.dialFill,
              {
                width: dialAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: dialColor,
              },
            ]}
          />
        </View>
        <View style={styles.dialLabels}>
          <Text style={styles.dialLabel}>1</Text>
          <Text style={[styles.dialLevel, { color: colors.text }]}>{difficulty}</Text>
          <Text style={styles.dialLabel}>10</Text>
        </View>
      </View>
    );
  };

  const renderIntro = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.introCenter}>
        <View style={styles.iconCircle}>
          <Icon name="gauge" size={40} color={colors.error} />
        </View>
        <Text style={styles.introTitle}>Pressure Dial</Text>
        <Text style={styles.introDesc}>
          Face escalating pressure from different personas. The dial rises with your success — how high can you go before losing composure?
        </Text>

        <View style={styles.rulesContainer}>
          <View style={styles.ruleRow}>
            <Icon name="gauge" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Difficulty adapts in real-time (1-10 scale)</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="heart" size={20} color={colors.error} />
            <Text style={styles.ruleText}>3 hearts — lose one when score drops below 40</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="account-group" size={20} color={colors.warning} />
            <Text style={styles.ruleText}>Face all 6 personas with unique pressure tactics</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="trending-up" size={20} color={colors.success} />
            <Text style={styles.ruleText}>Push the dial as high as possible for bonus XP</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Icon name="play" size={24} color={colors.textOnAccent} />
          <Text style={styles.startButtonText}>Face the Pressure</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPlaying = () => {
    if (!currentPrompt) return null;
    const persona = getPersona(currentPrompt.personaId);

    return (
      <View style={styles.container}>
        <View style={styles.playHeader}>
          {renderHearts()}
          <Text style={styles.roundCount}>Round {rounds.length + 1}</Text>
        </View>

        {renderDial()}

        {lastScore !== null && (
          <Animated.View
            style={[
              styles.scorePopContainer,
              {
                opacity: scorePop,
                transform: [{
                  translateY: scorePop.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                }],
              },
            ]}
          >
            <Text style={[styles.scorePop, { color: lastScore >= 65 ? colors.success : lastScore >= 40 ? colors.warning : colors.error }]}>
              {lastScore >= 65 ? 'Strong!' : lastScore >= 40 ? 'Okay' : 'Weak'}  {lastScore}
            </Text>
          </Animated.View>
        )}

        <ScrollView style={styles.promptArea} contentContainerStyle={styles.promptContent}>
          <View style={styles.personaHeader}>
            <Text style={styles.personaAvatar}>{persona.avatar}</Text>
            <View>
              <Text style={styles.personaName}>{persona.name}</Text>
              <Text style={styles.tacticLabel}>{currentPrompt.tactic}</Text>
            </View>
          </View>

          <Card style={styles.statementCard} variant="elevated">
            <Text style={styles.statementText}>{currentPrompt.statement}</Text>
          </Card>

          <TextInput
            style={styles.responseInput}
            placeholder="Type your response..."
            placeholderTextColor={colors.textMuted}
            value={userResponse}
            onChangeText={setUserResponse}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, userResponse.trim().length < 5 && styles.submitDisabled]}
            onPress={submitResponse}
            disabled={userResponse.trim().length < 5}
          >
            <Text style={styles.submitText}>Respond</Text>
            <Icon name="send" size={18} color={colors.textOnAccent} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderFeedback = () => {
    if (!currentPrompt || lastScore === null) return null;
    const scoreColor = lastScore >= 65 ? colors.success : lastScore >= 40 ? colors.warning : colors.error;

    return (
      <View style={[styles.container, styles.feedbackCenter]}>
        <Text style={[styles.feedbackScore, { color: scoreColor }]}>{lastScore}</Text>
        <Text style={styles.feedbackLabel}>
          {lastScore >= 65 ? 'Strong response!' : lastScore >= 40 ? 'Decent, but room to grow' : 'Composure slipping...'}
        </Text>
        {shouldLoseHeart(lastScore) && (
          <View style={styles.heartLostBanner}>
            <Icon name="heart-broken" size={20} color={colors.error} />
            <Text style={styles.heartLostText}>Lost a heart!</Text>
          </View>
        )}
        <Text style={styles.feedbackHint}>Next round loading...</Text>
      </View>
    );
  };

  const renderGameOver = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.resultsContent}>
      <View style={styles.gameOverHeader}>
        <Icon name="heart-broken" size={48} color={colors.error} />
        <Text style={styles.gameOverTitle}>Composure Lost</Text>
        <Text style={styles.gameOverSub}>You survived {rounds.length} rounds!</Text>
      </View>
      {renderResultStats()}
    </ScrollView>
  );

  const renderResults = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.resultsContent}>
      <View style={styles.resultsHeader}>
        <Icon name="trophy" size={48} color={colors.accent} />
        <Text style={styles.resultsTitle}>Pressure Survived!</Text>
        <Text style={styles.xpTotal}>+{totalXp} XP</Text>
      </View>
      {renderResultStats()}
    </ScrollView>
  );

  const renderResultStats = () => (
    <>
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{rounds.length}</Text>
          <Text style={styles.statLabel}>Rounds</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{peakDifficulty}</Text>
          <Text style={styles.statLabel}>Peak Level</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{hearts}/{MAX_HEARTS}</Text>
          <Text style={styles.statLabel}>Hearts Left</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {rounds.length > 0 ? Math.round(rounds.reduce((s, r) => s + r.score, 0) / rounds.length) : 0}
          </Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </View>

      {rounds.length > 0 && (
        <View style={styles.roundsReview}>
          <Text style={styles.reviewTitle}>Round Review</Text>
          {rounds.map((round, i) => {
            const persona = getPersona(round.prompt.personaId);
            return (
              <Card key={i} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAvatar}>{persona.avatar}</Text>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewTactic}>{round.prompt.tactic}</Text>
                    <Text style={styles.reviewDiff}>Difficulty {round.prompt.difficulty}</Text>
                  </View>
                  <Text
                    style={[
                      styles.reviewScore,
                      { color: round.score >= 65 ? colors.success : round.score >= 40 ? colors.warning : colors.error },
                    ]}
                  >
                    {round.score}
                  </Text>
                </View>
              </Card>
            );
          })}
        </View>
      )}

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
          <Icon name="refresh" size={20} color={colors.textOnAccent} />
          <Text style={styles.playAgainText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  switch (phase) {
    case 'intro':
      return renderIntro();
    case 'playing':
    case 'responding':
      return renderPlaying();
    case 'feedback':
      return renderFeedback();
    case 'gameover':
      return renderGameOver();
    case 'results':
      return renderResults();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: spacing.md,
  },
  introContent: {
    paddingBottom: spacing.xxl,
  },
  introCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.error + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  introTitle: {
    ...typography.h1,
    color: colors.text,
  },
  introDesc: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  rulesContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.md,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  ruleText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
    ...shadows.md,
  },
  startButtonText: {
    ...typography.button,
    color: colors.textOnAccent,
  },
  playHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heartsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  roundCount: {
    ...typography.label,
    color: colors.textSecondary,
  },
  dialContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  dialTrack: {
    height: 12,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  dialFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  dialLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dialLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  dialLevel: {
    ...typography.h3,
    fontWeight: '700',
  },
  scorePopContainer: {
    position: 'absolute',
    top: 130,
    alignSelf: 'center',
    zIndex: 10,
  },
  scorePop: {
    ...typography.h2,
    fontWeight: '700',
  },
  promptArea: {
    flex: 1,
  },
  promptContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  personaAvatar: {
    fontSize: 36,
  },
  personaName: {
    ...typography.label,
    color: colors.text,
  },
  tacticLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  statementCard: {
    padding: spacing.lg,
  },
  statementText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
  },
  responseInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  submitDisabled: {
    opacity: 0.4,
  },
  submitText: {
    ...typography.button,
    color: colors.textOnAccent,
  },
  feedbackCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  feedbackScore: {
    ...typography.hero,
    fontSize: 72,
  },
  feedbackLabel: {
    ...typography.h3,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  heartLostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.error + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginTop: spacing.lg,
  },
  heartLostText: {
    ...typography.label,
    color: colors.error,
  },
  feedbackHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  gameOverHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  gameOverTitle: {
    ...typography.h1,
    color: colors.error,
  },
  gameOverSub: {
    ...typography.body,
    color: colors.textSecondary,
  },
  resultsContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  resultsHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  resultsTitle: {
    ...typography.h1,
    color: colors.text,
  },
  xpTotal: {
    ...typography.hero,
    color: colors.accent,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    width: '100%',
    marginBottom: spacing.lg,
  },
  statBox: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  roundsReview: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  reviewTitle: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  reviewCard: {
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  reviewAvatar: {
    fontSize: 24,
  },
  reviewMeta: {
    flex: 1,
  },
  reviewTactic: {
    ...typography.label,
    color: colors.text,
  },
  reviewDiff: {
    ...typography.caption,
    color: colors.textMuted,
  },
  reviewScore: {
    ...typography.h3,
    fontWeight: '700',
  },
  resultActions: {
    width: '100%',
    gap: spacing.md,
  },
  playAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.md,
  },
  playAgainText: {
    ...typography.button,
    color: colors.textOnAccent,
  },
  doneButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  doneText: {
    ...typography.button,
    color: colors.textSecondary,
  },
});
