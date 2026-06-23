import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { useStore } from '@/store/useStore';
import {
  ToneMatchScenario,
  ToneMatchPair,
  SnapJudgment,
  getComboMultiplier,
  calculateMatchXp,
  shuffleArray,
  getRandomScenario,
} from '@/services/toneMatch/engine';
import { logScreenView } from '@/services/analytics';
import { saveExerciseResult, updateStreak } from '@/services/firestore';
import { showStreakMilestone } from '@/services/notifications';
import { ExerciseResult } from '@/models/types';
import { formatDuration } from '@/utils/helpers';

interface ToneMatchScreenProps {
  navigation: any;
}

type Phase = 'intro' | 'matching' | 'snap' | 'results';

export function ToneMatchScreen({ navigation }: ToneMatchScreenProps) {
  const user = useStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>('intro');
  const [scenario, setScenario] = useState<ToneMatchScenario | null>(null);

  const [shuffledSituations, setShuffledSituations] = useState<ToneMatchPair[]>([]);
  const [shuffledResponses, setShuffledResponses] = useState<ToneMatchPair[]>([]);
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [comboHistory, setComboHistory] = useState<number[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongFlash, setWrongFlash] = useState(false);

  const [snapIndex, setSnapIndex] = useState(0);
  const [snapCorrect, setSnapCorrect] = useState(0);
  const [snapAnswered, setSnapAnswered] = useState(false);
  const [snapChoice, setSnapChoice] = useState<'A' | 'B' | null>(null);

  const [startTime, setStartTime] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  const comboAnim = useRef(new Animated.Value(1)).current;
  const wrongAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    logScreenView('ToneMatch');
  }, []);

  useEffect(() => {
    if (phase === 'matching' && startTime > 0) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase, startTime]);

  const startGame = useCallback(() => {
    const s = getRandomScenario();
    setScenario(s);
    setShuffledSituations(shuffleArray(s.pairs));
    setShuffledResponses(shuffleArray(s.pairs));
    setMatchedIds(new Set());
    setSelectedSituation(null);
    setSelectedResponse(null);
    setStreak(0);
    setMaxCombo(0);
    setComboHistory([]);
    setCorrectCount(0);
    setSnapIndex(0);
    setSnapCorrect(0);
    setSnapAnswered(false);
    setSnapChoice(null);
    setStartTime(Date.now());
    setElapsed(0);
    setPhase('matching');
  }, []);

  const pulseCombo = useCallback(() => {
    comboAnim.setValue(1.4);
    Animated.spring(comboAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [comboAnim]);

  const flashWrong = useCallback(() => {
    setWrongFlash(true);
    wrongAnim.setValue(1);
    Animated.timing(wrongAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setWrongFlash(false));
  }, [wrongAnim]);

  const handleSituationPress = useCallback(
    (pair: ToneMatchPair) => {
      if (matchedIds.has(pair.id)) return;
      setSelectedSituation(pair.id);

      if (selectedResponse) {
        const responsePair = shuffledResponses.find((p) => p.id === selectedResponse);
        if (responsePair && pair.id === responsePair.id) {
          const newMatched = new Set(matchedIds);
          newMatched.add(pair.id);
          setMatchedIds(newMatched);
          const newStreak = streak + 1;
          setStreak(newStreak);
          setMaxCombo(Math.max(maxCombo, newStreak));
          setComboHistory([...comboHistory, newStreak]);
          setCorrectCount(correctCount + 1);
          pulseCombo();

          if (newMatched.size === scenario!.pairs.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsed(Date.now() - startTime);
            setTimeout(() => setPhase('snap'), 600);
          }
        } else {
          setStreak(0);
          flashWrong();
        }
        setSelectedSituation(null);
        setSelectedResponse(null);
      }
    },
    [matchedIds, selectedResponse, shuffledResponses, streak, maxCombo, comboHistory, correctCount, scenario, startTime, pulseCombo, flashWrong],
  );

  const handleResponsePress = useCallback(
    (pair: ToneMatchPair) => {
      if (matchedIds.has(pair.id)) return;
      setSelectedResponse(pair.id);

      if (selectedSituation) {
        const sitPair = shuffledSituations.find((p) => p.id === selectedSituation);
        if (sitPair && pair.id === sitPair.id) {
          const newMatched = new Set(matchedIds);
          newMatched.add(pair.id);
          setMatchedIds(newMatched);
          const newStreak = streak + 1;
          setStreak(newStreak);
          setMaxCombo(Math.max(maxCombo, newStreak));
          setComboHistory([...comboHistory, newStreak]);
          setCorrectCount(correctCount + 1);
          pulseCombo();

          if (newMatched.size === scenario!.pairs.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setElapsed(Date.now() - startTime);
            setTimeout(() => setPhase('snap'), 600);
          }
        } else {
          setStreak(0);
          flashWrong();
        }
        setSelectedSituation(null);
        setSelectedResponse(null);
      }
    },
    [matchedIds, selectedSituation, shuffledSituations, streak, maxCombo, comboHistory, correctCount, scenario, startTime, pulseCombo, flashWrong],
  );

  const handleSnapAnswer = useCallback(
    (choice: 'A' | 'B') => {
      if (snapAnswered || !scenario) return;
      setSnapAnswered(true);
      setSnapChoice(choice);
      const judgment = scenario.snapJudgments[snapIndex];
      if (choice === judgment.correctOption) {
        setSnapCorrect(snapCorrect + 1);
      }
    },
    [snapAnswered, scenario, snapIndex, snapCorrect],
  );

  const advanceSnap = useCallback(() => {
    if (!scenario) return;
    if (snapIndex < scenario.snapJudgments.length - 1) {
      setSnapIndex(snapIndex + 1);
      setSnapAnswered(false);
      setSnapChoice(null);
    } else {
      const parTimeMs = scenario.pairs.length * 8000;
      const xp = calculateMatchXp(correctCount, comboHistory, snapCorrect, elapsed, parTimeMs);
      setTotalXp(xp);
      persistResult(scenario, xp);
      setPhase('results');
    }
  }, [scenario, snapIndex, correctCount, comboHistory, snapCorrect, elapsed]);

  const persistResult = useCallback(
    (s: ToneMatchScenario, xp: number) => {
      if (!user) return;
      const result: ExerciseResult = {
        id: `tm_${Date.now()}`,
        userId: user.id,
        type: 'tone_match',
        xpEarned: xp,
        skillsWorked: s.skillFocus,
        completedAt: new Date().toISOString(),
        durationMs: elapsed,
        details: {
          scenarioId: s.id,
          accuracy: s.pairs.length > 0 ? correctCount / s.pairs.length : 0,
          maxCombo,
          snapCorrect,
          snapTotal: s.snapJudgments.length,
        },
      };
      saveExerciseResult(result).catch(() => {});
      updateStreak(user.id).then((s) => showStreakMilestone(s.current)).catch(() => {});
    },
    [user, elapsed, correctCount, maxCombo, snapCorrect],
  );

  const renderIntro = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.introCenter}>
        <View style={styles.iconCircle}>
          <Icon name="swap-horizontal" size={40} color={colors.accent} />
        </View>
        <Text style={styles.introTitle}>Tone Match</Text>
        <Text style={styles.introDesc}>
          Match each situation to its best response as fast as you can. Build combos for bonus XP, then ace the Snap Judgments.
        </Text>

        <View style={styles.rulesContainer}>
          <View style={styles.ruleRow}>
            <Icon name="gesture-tap" size={20} color={colors.primary} />
            <Text style={styles.ruleText}>Tap a situation, then tap its matching response</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="fire" size={20} color={colors.error} />
            <Text style={styles.ruleText}>Consecutive correct matches build your combo (up to 3x)</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="lightning-bolt" size={20} color={colors.warning} />
            <Text style={styles.ruleText}>Snap Judgments test your split-second decision making</Text>
          </View>
          <View style={styles.ruleRow}>
            <Icon name="timer-outline" size={20} color={colors.info} />
            <Text style={styles.ruleText}>Beat par time for a 25 XP speed bonus</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Icon name="play" size={24} color={colors.textOnAccent} />
          <Text style={styles.startButtonText}>Start Matching</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderMatching = () => {
    if (!scenario) return null;
    const multiplier = getComboMultiplier(streak);

    return (
      <View style={styles.container}>
        <View style={styles.matchHeader}>
          <View style={styles.timerContainer}>
            <Icon name="timer-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.timerText}>{formatDuration(elapsed)}</Text>
          </View>
          <Animated.View style={[styles.comboContainer, { transform: [{ scale: comboAnim }] }]}>
            {streak > 0 && (
              <>
                <Icon name="fire" size={18} color={colors.error} />
                <Text style={styles.comboText}>{streak}x</Text>
                <Text style={styles.multiplierText}>{multiplier}x XP</Text>
              </>
            )}
          </Animated.View>
          <Text style={styles.matchCount}>
            {matchedIds.size}/{scenario.pairs.length}
          </Text>
        </View>

        <Card style={styles.contextCard} variant="outlined">
          <Text style={styles.contextText}>{scenario.context}</Text>
        </Card>

        {wrongFlash && (
          <Animated.View style={[styles.wrongBanner, { opacity: wrongAnim }]}>
            <Text style={styles.wrongText}>Wrong match! Combo reset</Text>
          </Animated.View>
        )}

        <ScrollView style={styles.matchArea} contentContainerStyle={styles.matchColumns}>
          <View style={styles.column}>
            <Text style={styles.columnLabel}>SITUATIONS</Text>
            {shuffledSituations.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isSelected = selectedSituation === pair.id;
              return (
                <TouchableOpacity
                  key={pair.id}
                  style={[
                    styles.matchCard,
                    styles.situationCard,
                    isMatched && styles.matchedCard,
                    isSelected && styles.selectedSituation,
                  ]}
                  onPress={() => handleSituationPress(pair)}
                  disabled={isMatched}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.matchCardText,
                      isMatched && styles.matchedText,
                    ]}
                    numberOfLines={3}
                  >
                    {pair.situation}
                  </Text>
                  {isMatched && (
                    <Icon name="check-circle" size={16} color={colors.success} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.column}>
            <Text style={styles.columnLabel}>RESPONSES</Text>
            {shuffledResponses.map((pair) => {
              const isMatched = matchedIds.has(pair.id);
              const isSelected = selectedResponse === pair.id;
              return (
                <TouchableOpacity
                  key={pair.id}
                  style={[
                    styles.matchCard,
                    styles.responseCard,
                    isMatched && styles.matchedCard,
                    isSelected && styles.selectedResponse,
                  ]}
                  onPress={() => handleResponsePress(pair)}
                  disabled={isMatched}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.matchCardText,
                      isMatched && styles.matchedText,
                    ]}
                    numberOfLines={3}
                  >
                    {pair.response}
                  </Text>
                  {isMatched && (
                    <Icon name="check-circle" size={16} color={colors.success} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSnap = () => {
    if (!scenario) return null;
    const judgment = scenario.snapJudgments[snapIndex];
    const isCorrect = snapChoice === judgment.correctOption;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.snapContent}>
        <View style={styles.snapHeader}>
          <Icon name="lightning-bolt" size={24} color={colors.warning} />
          <Text style={styles.snapTitle}>Snap Judgment</Text>
          <Text style={styles.snapProgress}>
            {snapIndex + 1}/{scenario.snapJudgments.length}
          </Text>
        </View>

        <Card style={styles.snapMomentCard} variant="elevated">
          <Text style={styles.snapMomentText}>{judgment.moment}</Text>
        </Card>

        <View style={styles.snapOptions}>
          <TouchableOpacity
            style={[
              styles.snapOption,
              snapAnswered && snapChoice === 'A' && (isCorrect ? styles.snapCorrect : styles.snapWrong),
              snapAnswered && snapChoice !== 'A' && judgment.correctOption === 'A' && styles.snapCorrect,
            ]}
            onPress={() => handleSnapAnswer('A')}
            disabled={snapAnswered}
          >
            <Text style={styles.snapOptionLabel}>A</Text>
            <Text style={styles.snapOptionText}>{judgment.optionA}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.snapOption,
              snapAnswered && snapChoice === 'B' && (isCorrect ? styles.snapCorrect : styles.snapWrong),
              snapAnswered && snapChoice !== 'B' && judgment.correctOption === 'B' && styles.snapCorrect,
            ]}
            onPress={() => handleSnapAnswer('B')}
            disabled={snapAnswered}
          >
            <Text style={styles.snapOptionLabel}>B</Text>
            <Text style={styles.snapOptionText}>{judgment.optionB}</Text>
          </TouchableOpacity>
        </View>

        {snapAnswered && (
          <View style={styles.snapExplanation}>
            <View style={styles.snapResultBadge}>
              <Icon
                name={isCorrect ? 'check-circle' : 'close-circle'}
                size={20}
                color={isCorrect ? colors.success : colors.error}
              />
              <Text style={[styles.snapResultText, { color: isCorrect ? colors.success : colors.error }]}>
                {isCorrect ? 'Correct!' : 'Not quite'}
              </Text>
            </View>
            <Text style={styles.explanationText}>{judgment.explanation}</Text>
            <TouchableOpacity style={styles.snapNextButton} onPress={advanceSnap}>
              <Text style={styles.snapNextText}>
                {snapIndex < scenario.snapJudgments.length - 1 ? 'Next' : 'See Results'}
              </Text>
              <Icon name="arrow-right" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderResults = () => {
    if (!scenario) return null;
    const parTimeMs = scenario.pairs.length * 8000;
    const beatPar = elapsed < parTimeMs;
    const accuracy = scenario.pairs.length > 0 ? correctCount / scenario.pairs.length : 0;

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultsContent}>
        <View style={styles.resultsHeader}>
          <Icon name="trophy" size={40} color={colors.accent} />
          <Text style={styles.resultsTitle}>Match Complete!</Text>
          <Text style={styles.xpTotal}>+{totalXp} XP</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatDuration(elapsed)}</Text>
            <Text style={styles.statLabel}>Time</Text>
            {beatPar && (
              <View style={styles.bonusBadge}>
                <Text style={styles.bonusText}>+25 XP</Text>
              </View>
            )}
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{Math.round(accuracy * 100)}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{maxCombo}x</Text>
            <Text style={styles.statLabel}>Max Combo</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {snapCorrect}/{scenario.snapJudgments.length}
            </Text>
            <Text style={styles.statLabel}>Snap Correct</Text>
          </View>
        </View>

        <View style={styles.xpBreakdown}>
          <Text style={styles.breakdownTitle}>XP Breakdown</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Base ({correctCount} matches x 10)</Text>
            <Text style={styles.breakdownValue}>{correctCount * 10}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Combo bonus</Text>
            <Text style={styles.breakdownValue}>
              {totalXp - correctCount * 10 - snapCorrect * 5 - (beatPar ? 25 : 0)}
            </Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Snap judgments ({snapCorrect} x 5)</Text>
            <Text style={styles.breakdownValue}>{snapCorrect * 5}</Text>
          </View>
          {beatPar && (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Speed bonus</Text>
              <Text style={[styles.breakdownValue, { color: colors.accent }]}>25</Text>
            </View>
          )}
        </View>

        <View style={styles.resultActions}>
          <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
            <Icon name="refresh" size={20} color={colors.textOnAccent} />
            <Text style={styles.playAgainText}>Play Again</Text>
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
    case 'matching':
      return renderMatching();
    case 'snap':
      return renderSnap();
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
    backgroundColor: colors.accent + '20',
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  comboContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  comboText: {
    ...typography.h3,
    color: colors.error,
  },
  multiplierText: {
    ...typography.caption,
    color: colors.accent,
  },
  matchCount: {
    ...typography.label,
    color: colors.text,
  },
  contextCard: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    padding: spacing.md,
  },
  contextText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  wrongBanner: {
    backgroundColor: colors.error + '20',
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  wrongText: {
    ...typography.caption,
    color: colors.error,
  },
  matchArea: {
    flex: 1,
  },
  matchColumns: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  column: {
    flex: 1,
    gap: spacing.sm,
  },
  columnLabel: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  matchCard: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 72,
    justifyContent: 'center',
  },
  situationCard: {
    backgroundColor: colors.primary + '15',
  },
  responseCard: {
    backgroundColor: colors.accent + '10',
  },
  selectedSituation: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '30',
  },
  selectedResponse: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '25',
  },
  matchedCard: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
    opacity: 0.6,
  },
  matchCardText: {
    ...typography.caption,
    color: colors.text,
    lineHeight: 16,
  },
  matchedText: {
    color: colors.textMuted,
  },
  snapContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  snapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  snapTitle: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
  },
  snapProgress: {
    ...typography.label,
    color: colors.textMuted,
  },
  snapMomentCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  snapMomentText: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  snapOptions: {
    gap: spacing.md,
  },
  snapOption: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  snapCorrect: {
    borderColor: colors.success,
    backgroundColor: colors.success + '15',
  },
  snapWrong: {
    borderColor: colors.error,
    backgroundColor: colors.error + '15',
  },
  snapOptionLabel: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: spacing.xs,
  },
  snapOptionText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
  snapExplanation: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  snapResultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  snapResultText: {
    ...typography.label,
    fontWeight: '700',
  },
  explanationText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  snapNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  snapNextText: {
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
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
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
  bonusBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  bonusText: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 10,
  },
  xpBreakdown: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  breakdownTitle: {
    ...typography.label,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  breakdownLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  breakdownValue: {
    ...typography.label,
    color: colors.text,
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
