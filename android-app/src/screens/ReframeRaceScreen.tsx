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
  ReframeChallenge,
  ReframeRound,
  ROUND_COUNT,
  getChallengesForRound,
  calculateReframeXp,
  isGoldenReframe,
  getTechniqueColor,
} from '@/services/reframeRace/engine';
import { logScreenView } from '@/services/analytics';
import { formatDuration } from '@/utils/helpers';

interface ReframeRaceScreenProps {
  navigation: any;
}

type Phase = 'intro' | 'playing' | 'review' | 'results';

export function ReframeRaceScreen({ navigation }: ReframeRaceScreenProps) {
  const user = useStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>('intro');
  const [challenges, setChallenges] = useState<ReframeChallenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userReframe, setUserReframe] = useState('');
  const [rounds, setRounds] = useState<ReframeRound[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [totalXp, setTotalXp] = useState(0);

  const goldenAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    logScreenView('ReframeRace');
  }, []);

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - roundStartTime);
      }, 100);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, roundStartTime]);

  const startGame = useCallback(() => {
    const selected = getChallengesForRound(ROUND_COUNT);
    setChallenges(selected);
    setCurrentIndex(0);
    setRounds([]);
    setUserReframe('');
    setShowHint(false);
    setShowExample(false);
    setRoundStartTime(Date.now());
    setElapsed(0);
    setPhase('playing');
  }, []);

  const flashGolden = useCallback(() => {
    goldenAnim.setValue(0);
    Animated.sequence([
      Animated.timing(goldenAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(goldenAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [goldenAnim]);

  const submitReframe = useCallback(() => {
    if (userReframe.trim().length < 10 || currentIndex >= challenges.length) return;
    const timeMs = Date.now() - roundStartTime;
    if (timerRef.current) clearInterval(timerRef.current);

    const challenge = challenges[currentIndex];
    const lengthFactor = Math.min(40, userReframe.trim().length * 0.4);
    const speedFactor = timeMs < 15000 ? 25 : timeMs < 30000 ? 15 : 5;
    const diffFactor = challenge.difficulty * 5;
    const hintPenalty = showHint ? 5 : 0;
    const examplePenalty = showExample ? 10 : 0;
    const score = Math.min(100, Math.round(lengthFactor + speedFactor + diffFactor - hintPenalty - examplePenalty));

    const golden = isGoldenReframe(score);
    if (golden) flashGolden();

    const round: ReframeRound = {
      challenge,
      userReframe: userReframe.trim(),
      score,
      timeMs,
      isGoldenReframe: golden,
    };

    const newRounds = [...rounds, round];
    setRounds(newRounds);
    setPhase('review');
  }, [userReframe, currentIndex, challenges, roundStartTime, showHint, showExample, rounds, flashGolden]);

  const nextRound = useCallback(() => {
    if (currentIndex + 1 >= challenges.length) {
      const xp = calculateReframeXp(rounds);
      setTotalXp(xp);
      setPhase('results');
      return;
    }
    setCurrentIndex(currentIndex + 1);
    setUserReframe('');
    setShowHint(false);
    setShowExample(false);
    setRoundStartTime(Date.now());
    setElapsed(0);
    setPhase('playing');
  }, [currentIndex, challenges, rounds]);

  const renderIntro = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.introCenter}>
        <View style={styles.iconCircle}>
          <Icon name="pencil-outline" size={40} color={colors.success} />
        </View>
        <Text style={styles.introTitle}>Reframe Race</Text>
        <Text style={styles.introDesc}>
          Rewrite toxic statements using specific techniques. Score 85+ for a Golden Reframe. Beat the clock for speed bonus XP.
        </Text>

        <View style={styles.rulesContainer}>
          <View style={styles.ruleRow}>
            <Icon name="format-text" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>{ROUND_COUNT} rounds with different techniques each time</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="star" size={20} color={colors.accent} />
            <Text style={styles.ruleText}>Score 85+ to earn a Golden Reframe</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="timer-outline" size={20} color={colors.info} />
            <Text style={styles.ruleText}>Respond under 15s for speed bonus XP</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="lightbulb-outline" size={20} color={colors.warning} />
            <Text style={styles.ruleText}>Hints available (small score penalty)</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Icon name="play" size={24} color={colors.textOnAccent} />
          <Text style={styles.startButtonText}>Start Reframing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPlaying = () => {
    if (currentIndex >= challenges.length) return null;
    const challenge = challenges[currentIndex];
    const techColor = getTechniqueColor(challenge.technique);

    return (
      <View style={styles.container}>
        <View style={styles.playHeader}>
          <Text style={styles.roundIndicator}>
            {currentIndex + 1}/{ROUND_COUNT}
          </Text>
          <View style={styles.timerContainer}>
            <Icon name="timer-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.timerText}>{formatDuration(elapsed)}</Text>
          </View>
          <View style={styles.goldenCount}>
            <Icon name="star" size={16} color={colors.accent} />
            <Text style={styles.goldenText}>
              {rounds.filter((r) => r.isGoldenReframe).length}
            </Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.goldenFlash,
            {
              opacity: goldenAnim,
              transform: [{ scale: goldenAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.2] }) }],
            },
          ]}
        >
          <Icon name="star" size={60} color={colors.accent} />
        </Animated.View>

        <ScrollView style={styles.playArea} contentContainerStyle={styles.playContent}>
          <View style={[styles.techniqueBadge, { backgroundColor: techColor + '20' }]}>
            <Text style={[styles.techniqueText, { color: techColor }]}>
              {challenge.techniqueLabel}
            </Text>
          </View>

          <Card style={styles.toxicCard} variant="elevated">
            <Text style={styles.toxicLabel}>REWRITE THIS:</Text>
            <Text style={styles.toxicText}>"{challenge.toxicStatement}"</Text>
          </Card>

          {showHint && (
            <View style={styles.hintBox}>
              <Icon name="lightbulb-outline" size={16} color={colors.warning} />
              <Text style={styles.hintText}>{challenge.hint}</Text>
            </View>
          )}

          {showExample && (
            <View style={styles.exampleBox}>
              <Text style={styles.exampleLabel}>Example reframe:</Text>
              <Text style={styles.exampleText}>"{challenge.exampleReframe}"</Text>
            </View>
          )}

          <TextInput
            style={styles.reframeInput}
            placeholder={`Reframe using ${challenge.techniqueLabel}...`}
            placeholderTextColor={colors.textMuted}
            value={userReframe}
            onChangeText={setUserReframe}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          <View style={styles.helpButtons}>
            {!showHint && (
              <TouchableOpacity style={styles.helpButton} onPress={() => setShowHint(true)}>
                <Icon name="lightbulb-outline" size={16} color={colors.warning} />
                <Text style={styles.helpButtonText}>Show Hint (-5)</Text>
              </TouchableOpacity>
            )}
            {!showExample && (
              <TouchableOpacity style={styles.helpButton} onPress={() => setShowExample(true)}>
                <Icon name="eye-outline" size={16} color={colors.info} />
                <Text style={styles.helpButtonText}>Show Example (-10)</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.submitButton, userReframe.trim().length < 10 && styles.submitDisabled]}
            onPress={submitReframe}
            disabled={userReframe.trim().length < 10}
          >
            <Text style={styles.submitText}>Submit Reframe</Text>
            <Icon name="send" size={18} color={colors.textOnAccent} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  const renderReview = () => {
    if (rounds.length === 0) return null;
    const lastRound = rounds[rounds.length - 1];
    const scoreColor = lastRound.score >= 85 ? colors.accent : lastRound.score >= 65 ? colors.success : lastRound.score >= 40 ? colors.warning : colors.error;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          {lastRound.isGoldenReframe && (
            <View style={styles.goldenBanner}>
              <Icon name="star" size={24} color={colors.accent} />
              <Text style={styles.goldenBannerText}>Golden Reframe!</Text>
            </View>
          )}
          <Text style={[styles.reviewScore, { color: scoreColor }]}>{lastRound.score}</Text>
          <Text style={styles.reviewTime}>
            {formatDuration(lastRound.timeMs)}
            {lastRound.timeMs < 15000 && (
              <Text style={{ color: colors.accent }}> +5 Speed Bonus</Text>
            )}
          </Text>
        </View>

        <Card style={styles.comparisonCard}>
          <Text style={styles.compLabel}>Your reframe:</Text>
          <Text style={styles.compUser}>"{lastRound.userReframe}"</Text>
          <View style={styles.compDivider} />
          <Text style={styles.compLabel}>Example reframe:</Text>
          <Text style={styles.compExample}>"{lastRound.challenge.exampleReframe}"</Text>
        </Card>

        <TouchableOpacity style={styles.nextButton} onPress={nextRound}>
          <Text style={styles.nextButtonText}>
            {currentIndex + 1 >= challenges.length ? 'See Results' : 'Next Round'}
          </Text>
          <Icon name="arrow-right" size={18} color={colors.accent} />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderResults = () => {
    const goldenCount = rounds.filter((r) => r.isGoldenReframe).length;
    const avgTime = rounds.length > 0 ? rounds.reduce((s, r) => s + r.timeMs, 0) / rounds.length : 0;
    const perfectRun = goldenCount === ROUND_COUNT;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContent}>
        <View style={styles.resultsHeader}>
          <Icon name={perfectRun ? 'crown' : 'trophy'} size={48} color={colors.accent} />
          <Text style={styles.resultsTitle}>
            {perfectRun ? 'Perfect Run!' : 'Race Complete!'}
          </Text>
          <Text style={styles.xpTotal}>+{totalXp} XP</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{goldenCount}</Text>
            <Text style={styles.statLabel}>Golden</Text>
            <Icon name="star" size={16} color={colors.accent} style={{ marginTop: 2 }} />
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {rounds.length > 0 ? Math.round(rounds.reduce((s, r) => s + r.score, 0) / rounds.length) : 0}
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatDuration(avgTime)}</Text>
            <Text style={styles.statLabel}>Avg Time</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {rounds.filter((r) => r.timeMs < 15000).length}
            </Text>
            <Text style={styles.statLabel}>Speed Bonus</Text>
          </View>
        </View>

        <View style={styles.roundsSummary}>
          <Text style={styles.summaryTitle}>Round Summary</Text>
          {rounds.map((round, i) => {
            const techColor = getTechniqueColor(round.challenge.technique);
            return (
              <Card key={i} style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <View style={[styles.summaryTech, { backgroundColor: techColor + '20' }]}>
                    <Text style={[styles.summaryTechText, { color: techColor }]}>
                      {round.challenge.techniqueLabel}
                    </Text>
                  </View>
                  <View style={styles.summaryRight}>
                    {round.isGoldenReframe && (
                      <Icon name="star" size={14} color={colors.accent} />
                    )}
                    <Text
                      style={[
                        styles.summaryScore,
                        { color: round.score >= 85 ? colors.accent : round.score >= 65 ? colors.success : colors.warning },
                      ]}
                    >
                      {round.score}
                    </Text>
                  </View>
                </View>
                <Text style={styles.summaryToxic} numberOfLines={1}>
                  "{round.challenge.toxicStatement}"
                </Text>
              </Card>
            );
          })}
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
            <Icon name="refresh" size={20} color={colors.textOnAccent} />
            <Text style={styles.playAgainText}>Race Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  switch (phase) {
    case 'intro':
      return renderIntro();
    case 'playing':
      return renderPlaying();
    case 'review':
      return renderReview();
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
    backgroundColor: colors.success + '20',
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
  roundIndicator: {
    ...typography.label,
    color: colors.text,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timerText: {
    ...typography.label,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  goldenCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  goldenText: {
    ...typography.label,
    color: colors.accent,
  },
  goldenFlash: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    zIndex: 10,
  },
  playArea: {
    flex: 1,
  },
  playContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  techniqueBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  techniqueText: {
    ...typography.label,
    fontWeight: '700',
  },
  toxicCard: {
    padding: spacing.lg,
  },
  toxicLabel: {
    ...typography.caption,
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  toxicText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warning + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  hintText: {
    ...typography.bodySmall,
    color: colors.warning,
    flex: 1,
  },
  exampleBox: {
    backgroundColor: colors.info + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  exampleLabel: {
    ...typography.caption,
    color: colors.info,
    marginBottom: spacing.xs,
  },
  exampleText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  reframeInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...typography.body,
    color: colors.text,
    minHeight: 100,
  },
  helpButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  helpButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
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
  reviewContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  reviewHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingTop: spacing.lg,
  },
  goldenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  goldenBannerText: {
    ...typography.label,
    color: colors.accent,
    fontWeight: '700',
  },
  reviewScore: {
    ...typography.hero,
    fontSize: 64,
  },
  reviewTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  comparisonCard: {
    width: '100%',
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  compLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  compUser: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  compDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  compExample: {
    ...typography.body,
    color: colors.success,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  nextButtonText: {
    ...typography.button,
    color: colors.accent,
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
  roundsSummary: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  summaryCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryTech: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  summaryTechText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryScore: {
    ...typography.h3,
    fontWeight: '700',
  },
  summaryToxic: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontStyle: 'italic',
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
