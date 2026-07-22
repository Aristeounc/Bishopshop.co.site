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
  startGauntlet,
  submitGauntletResponse,
  advanceGauntletRound,
  GauntletState,
  PlayerGauntletResponse,
} from '@/services/escalationGauntlet/engine';
import {
  GAUNTLET_SCENARIOS,
  GauntletScenario,
  GauntletRound,
} from '@/services/escalationGauntlet/scenarios';
import { useStore } from '@/store/useStore';
import { saveDrillResult, updateStreak } from '@/services/firestore';
import { canAccessFeature, getUpgradeMessage } from '@/utils/subscriptionGate';

type ScreenState = 'select' | 'playing' | 'results';

const ESCALATION_LEVELS: Record<GauntletRound['escalationLevel'], {
  label: string;
  color: string;
  icon: string;
  levelNumber: number;
}> = {
  civil: { label: 'Civil', color: '#2EA043', icon: 'emoticon-neutral-outline', levelNumber: 1 },
  emotional: { label: 'Emotional', color: '#D29922', icon: 'emoticon-sad-outline', levelNumber: 2 },
  manipulative: { label: 'Manipulative', color: '#FF8C42', icon: 'emoticon-angry-outline', levelNumber: 3 },
  threatening: { label: 'Threatening', color: '#F85149', icon: 'alert-octagon-outline', levelNumber: 4 },
};

const RATING_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  crumbled: { label: 'Crumbled', color: colors.error, icon: 'shield-off-outline' },
  bent: { label: 'Bent', color: '#D29922', icon: 'shield-half-full' },
  stood_firm: { label: 'Stood Firm', color: '#2EA043', icon: 'shield-check-outline' },
  unshakeable: { label: 'Unshakeable', color: colors.accent, icon: 'shield-star-outline' },
};

const TREND_CONFIG: Record<string, { label: string; icon: string; color: string }> = {
  declining: { label: 'Declining under pressure', icon: 'trending-down', color: colors.error },
  steady: { label: 'Steady composure', icon: 'trending-neutral', color: '#D29922' },
  improving: { label: 'Rising to the challenge', icon: 'trending-up', color: '#2EA043' },
};

export function EscalationGauntletScreen() {
  const navigation = useNavigation();
  const user = useStore((s) => s.user);

  useEffect(() => {
    if (user && !canAccessFeature(user.subscription, 'escalation_gauntlet')) {
      Alert.alert(
        'Upgrade Required',
        getUpgradeMessage('escalation_gauntlet'),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
        { cancelable: false },
      );
    }
  }, []);

  const [screenState, setScreenState] = useState<ScreenState>('select');
  const [gameState, setGameState] = useState<GauntletState | null>(null);
  const [responseText, setResponseText] = useState('');
  const [roundFeedback, setRoundFeedback] = useState<PlayerGauntletResponse | null>(null);
  const [showCoachHint, setShowCoachHint] = useState(false);

  function handleStartScenario(scenario: GauntletScenario) {
    const state = startGauntlet(scenario.id);
    setGameState({ ...state, phase: 'responding' });
    setScreenState('playing');
    setResponseText('');
    setRoundFeedback(null);
    setShowCoachHint(false);
  }

  function handleSubmitResponse() {
    if (!gameState || !responseText.trim()) return;

    const { state, roundResult } = submitGauntletResponse(gameState, responseText.trim());
    setGameState(state);
    setRoundFeedback(roundResult);
    setResponseText('');
  }

  function handleNextRound() {
    if (!gameState) return;

    const updated = advanceGauntletRound(gameState);
    setGameState(updated);
    setRoundFeedback(null);
    setShowCoachHint(false);

    if (updated.isComplete) {
      setScreenState('results');
      const uid = useStore.getState().user?.id;
      if (uid) {
        saveDrillResult(uid, 'escalation_gauntlet', updated.score.averageComposure, 'regulate').catch(() => {});
        updateStreak(uid).catch(() => {});
      }
    }
  }

  function handleBack() {
    setScreenState('select');
    setGameState(null);
    setRoundFeedback(null);
    setResponseText('');
    setShowCoachHint(false);
  }

  // --- SELECT SCREEN ---
  if (screenState === 'select') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Escalation Gauntlet</Text>
        <Text style={styles.subtitle}>
          Face the same person as they escalate from civil to threatening. Can you hold your ground?
        </Text>

        <Card variant="outlined" style={styles.howCard}>
          <Text style={styles.howTitle}>How It Works</Text>
          <View style={styles.howStep}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Choose a scenario and meet your opponent</Text>
          </View>
          <View style={styles.howStep}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>They escalate through 4 levels: civil, emotional, manipulative, threatening</Text>
          </View>
          <View style={styles.howStep}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>Type your response at each level and get scored on composure and technique</Text>
          </View>
          <View style={styles.howStep}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>See how your composure holds up as the pressure mounts</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Choose Your Gauntlet</Text>
        {GAUNTLET_SCENARIOS.map((scenario) => (
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
            <View style={styles.scenarioMeta}>
              <Text style={styles.metaText}>
                <Icon name="account-outline" size={12} color={colors.textMuted} /> {scenario.opponent}
              </Text>
              <View style={styles.skillTags}>
                {scenario.skillsInvolved.map((skill) => (
                  <View key={skill} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  // --- RESULTS SCREEN ---
  if (screenState === 'results' && gameState) {
    const { score } = gameState;
    const ratingInfo = RATING_CONFIG[score.overallRating];
    const trendInfo = TREND_CONFIG[score.composureTrend];

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Gauntlet Complete</Text>
        <Text style={styles.subtitle}>{gameState.scenario.title}</Text>

        <Card style={styles.ratingCard} variant="elevated">
          <Icon name={ratingInfo.icon} size={56} color={ratingInfo.color} />
          <Text style={[styles.ratingLabel, { color: ratingInfo.color }]}>{ratingInfo.label}</Text>

          <View style={styles.averagesRow}>
            <View style={styles.averageStat}>
              <Text style={styles.averageValue}>{score.averageComposure}</Text>
              <Text style={styles.averageLabel}>Composure</Text>
            </View>
            <View style={styles.averageDivider} />
            <View style={styles.averageStat}>
              <Text style={styles.averageValue}>{score.averageTechnique}</Text>
              <Text style={styles.averageLabel}>Technique</Text>
            </View>
          </View>

          <View style={[styles.trendBadge, { backgroundColor: trendInfo.color + '20' }]}>
            <Icon name={trendInfo.icon} size={18} color={trendInfo.color} />
            <Text style={[styles.trendText, { color: trendInfo.color }]}>{trendInfo.label}</Text>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Round-by-Round Breakdown</Text>
        {gameState.scenario.rounds.map((round, index) => {
          const playerResponse = score.roundScores[index];
          const levelInfo = ESCALATION_LEVELS[round.escalationLevel];

          return (
            <Card key={round.id} style={styles.roundBreakdownCard}>
              <View style={styles.roundBreakdownHeader}>
                <View style={[styles.levelBadge, { backgroundColor: levelInfo.color + '20' }]}>
                  <Icon name={levelInfo.icon} size={16} color={levelInfo.color} />
                  <Text style={[styles.levelBadgeText, { color: levelInfo.color }]}>
                    Level {levelInfo.levelNumber}: {levelInfo.label}
                  </Text>
                </View>
                {playerResponse && (
                  <Text style={[styles.roundOverallScore, { color: playerResponse.overallScore >= 60 ? '#2EA043' : colors.error }]}>
                    {playerResponse.overallScore}/100
                  </Text>
                )}
              </View>

              <Text style={styles.breakdownLabel}>They said:</Text>
              <Text style={styles.breakdownOpponentLine}>{round.opponentLine}</Text>

              {playerResponse && (
                <>
                  <Text style={styles.breakdownLabel}>You responded:</Text>
                  <Text style={styles.breakdownPlayerLine}>{playerResponse.playerResponse}</Text>

                  <View style={styles.breakdownScores}>
                    <View style={styles.miniScorePill}>
                      <Text style={styles.miniScoreLabel}>Composure</Text>
                      <Text style={[styles.miniScoreValue, { color: playerResponse.composureScore >= 60 ? '#2EA043' : colors.error }]}>
                        {playerResponse.composureScore}
                      </Text>
                    </View>
                    <View style={styles.miniScorePill}>
                      <Text style={styles.miniScoreLabel}>Technique</Text>
                      <Text style={[styles.miniScoreValue, { color: playerResponse.techniqueScore >= 60 ? '#2EA043' : colors.error }]}>
                        {playerResponse.techniqueScore}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.breakdownLabel}>Ideal response:</Text>
                  <Text style={styles.breakdownIdealLine}>{round.idealResponse}</Text>
                </>
              )}
            </Card>
          );
        })}

        <View style={styles.resultActions}>
          <Button title="Try Again" onPress={() => handleStartScenario(gameState.scenario)} variant="outline" />
          <Button title="New Scenario" onPress={handleBack} variant="primary" />
        </View>
      </ScrollView>
    );
  }

  // --- PLAYING SCREEN ---
  if (!gameState) return null;
  const currentRound = gameState.scenario.rounds[gameState.currentRound];
  if (!currentRound) return null;
  const levelInfo = ESCALATION_LEVELS[currentRound.escalationLevel];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.playHeader}>
        <TouchableOpacity onPress={handleBack}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.playTitle}>{gameState.scenario.title}</Text>
        <Text style={styles.playProgress}>
          {gameState.currentRound + 1}/4
        </Text>
      </View>

      {/* Escalation Meter */}
      <View style={styles.escalationMeter}>
        {gameState.scenario.rounds.map((round, index) => {
          const info = ESCALATION_LEVELS[round.escalationLevel];
          const isActive = index === gameState.currentRound;
          const isCompleted = index < gameState.currentRound;
          return (
            <View key={round.id} style={styles.meterSegment}>
              <View
                style={[
                  styles.meterDot,
                  { borderColor: info.color },
                  (isActive || isCompleted) && { backgroundColor: info.color },
                ]}
              >
                {isCompleted && <Icon name="check" size={10} color={colors.textOnPrimary} />}
              </View>
              <Text style={[
                styles.meterLabel,
                isActive && { color: info.color, fontFamily: 'DMSans-SemiBold' },
              ]}>
                {info.label}
              </Text>
              {index < 3 && (
                <View style={[styles.meterLine, isCompleted && { backgroundColor: info.color }]} />
              )}
            </View>
          );
        })}
      </View>

      {/* Level Banner */}
      <View style={[styles.levelBanner, { backgroundColor: levelInfo.color + '15', borderColor: levelInfo.color + '40' }]}>
        <Icon name={levelInfo.icon} size={20} color={levelInfo.color} />
        <Text style={[styles.levelBannerText, { color: levelInfo.color }]}>
          Level {levelInfo.levelNumber}: {levelInfo.label}
        </Text>
        <Text style={[styles.tacticLabel, { color: levelInfo.color }]}>
          {currentRound.escalationTactic.replace(/_/g, ' ')}
        </Text>
      </View>

      <ScrollView style={styles.playBody} contentContainerStyle={styles.playBodyContent}>
        {/* Context (first round only) */}
        {gameState.currentRound === 0 && (
          <Text style={styles.contextText}>{gameState.scenario.context}</Text>
        )}

        {/* Opponent Speech Bubble */}
        <View style={styles.speechBubbleContainer}>
          <Text style={styles.opponentName}>{gameState.scenario.opponent}</Text>
          <View style={[styles.speechBubble, { borderColor: levelInfo.color + '40' }]}>
            <Text style={styles.speechBubbleText}>{currentRound.opponentLine}</Text>
          </View>
          <View style={[styles.speechBubbleArrow, { borderTopColor: levelInfo.color + '40' }]} />
        </View>

        {/* Coach Hint */}
        <TouchableOpacity
          style={styles.coachHintToggle}
          onPress={() => setShowCoachHint(!showCoachHint)}
        >
          <Icon name="lightbulb-outline" size={16} color={colors.accent} />
          <Text style={styles.coachHintToggleText}>
            {showCoachHint ? 'Hide Coach Hint' : 'Show Coach Hint'}
          </Text>
          <Icon name={showCoachHint ? 'chevron-up' : 'chevron-down'} size={16} color={colors.accent} />
        </TouchableOpacity>
        {showCoachHint && (
          <Card style={styles.coachHintCard}>
            <Text style={styles.coachHintText}>{currentRound.coachHint}</Text>
          </Card>
        )}

        {/* Round Feedback */}
        {roundFeedback && gameState.phase === 'feedback' && (
          <Card style={styles.feedbackCard} variant="elevated">
            <Text style={styles.feedbackTitle}>Round {currentRound.roundNumber} Feedback</Text>
            <View style={styles.feedbackScores}>
              <View style={styles.feedbackScoreItem}>
                <Icon name="meditation" size={24} color={roundFeedback.composureScore >= 60 ? '#2EA043' : colors.error} />
                <Text style={styles.feedbackScoreValue}>{roundFeedback.composureScore}</Text>
                <Text style={styles.feedbackScoreLabel}>Composure</Text>
              </View>
              <View style={styles.feedbackScoreItem}>
                <Icon name="target" size={24} color={roundFeedback.techniqueScore >= 60 ? '#2EA043' : colors.error} />
                <Text style={styles.feedbackScoreValue}>{roundFeedback.techniqueScore}</Text>
                <Text style={styles.feedbackScoreLabel}>Technique</Text>
              </View>
              <View style={styles.feedbackScoreItem}>
                <Icon name="star-outline" size={24} color={roundFeedback.overallScore >= 60 ? '#2EA043' : colors.error} />
                <Text style={styles.feedbackScoreValue}>{roundFeedback.overallScore}</Text>
                <Text style={styles.feedbackScoreLabel}>Overall</Text>
              </View>
            </View>
            <Button
              title={gameState.currentRound < 3 ? 'Next Round' : 'See Results'}
              onPress={handleNextRound}
              variant="primary"
            />
          </Card>
        )}
      </ScrollView>

      {/* Response Input */}
      {gameState.phase === 'responding' && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.responseInput}
            placeholder="Type your response..."
            placeholderTextColor={colors.textMuted}
            value={responseText}
            onChangeText={setResponseText}
            multiline
            maxLength={500}
          />
          <View style={styles.inputActions}>
            <Text style={styles.charCount}>{responseText.length}/500</Text>
            <Button
              title="Submit"
              onPress={handleSubmitResponse}
              variant="primary"
              size="sm"
            />
          </View>
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

  // How it works
  howCard: { padding: spacing.md, marginBottom: spacing.lg },
  howTitle: { ...typography.h3, color: colors.accent, marginBottom: spacing.md },
  howStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  stepNumber: { ...typography.button, color: colors.textOnPrimary, backgroundColor: colors.primary, width: 28, height: 28, borderRadius: 14, textAlign: 'center', lineHeight: 28 },
  stepText: { ...typography.body, color: colors.text, flex: 1 },

  // Scenario cards
  scenarioCard: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border },
  scenarioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  scenarioTitle: { ...typography.h3, color: colors.text },
  difficultyBadge: { flexDirection: 'row', gap: 3 },
  diffDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  diffDotActive: { backgroundColor: colors.accent },
  scenarioContext: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm },
  scenarioMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaText: { ...typography.caption, color: colors.textMuted },
  skillTags: { flexDirection: 'row', gap: spacing.xs },
  skillTag: { backgroundColor: colors.primary + '20', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  skillTagText: { ...typography.caption, color: colors.primaryLight, textTransform: 'capitalize' },

  // Play header
  playHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, paddingHorizontal: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.border },
  playTitle: { ...typography.h3, color: colors.text, flex: 1, marginLeft: spacing.md },
  playProgress: { ...typography.caption, color: colors.textMuted },

  // Escalation meter
  escalationMeter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.lg, gap: spacing.xs },
  meterSegment: { alignItems: 'center', position: 'relative' },
  meterDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  meterLabel: { ...typography.caption, color: colors.textMuted, marginTop: 4, fontSize: 10 },
  meterLine: { position: 'absolute', top: 9, left: 20, width: 24, height: 2, backgroundColor: colors.border },

  // Level banner
  levelBanner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginHorizontal: spacing.lg, marginTop: spacing.sm, padding: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1 },
  levelBannerText: { ...typography.label },
  tacticLabel: { ...typography.caption, marginLeft: 'auto', textTransform: 'capitalize' },

  // Play body
  playBody: { flex: 1 },
  playBodyContent: { padding: spacing.lg },
  contextText: { ...typography.bodySmall, color: colors.textMuted, fontStyle: 'italic', marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.surface, borderRadius: borderRadius.md },

  // Speech bubble
  speechBubbleContainer: { marginBottom: spacing.md },
  opponentName: { ...typography.label, color: colors.accent, marginBottom: spacing.xs },
  speechBubble: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1 },
  speechBubbleText: { ...typography.body, color: colors.text, lineHeight: 24 },
  speechBubbleArrow: { width: 0, height: 0, marginLeft: spacing.lg, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent' },

  // Coach hint
  coachHintToggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm, paddingVertical: spacing.sm },
  coachHintToggleText: { ...typography.caption, color: colors.accent },
  coachHintCard: { padding: spacing.md, marginBottom: spacing.md, backgroundColor: colors.accent + '10', borderColor: colors.accent + '30', borderWidth: 1 },
  coachHintText: { ...typography.bodySmall, color: colors.text, fontStyle: 'italic' },

  // Feedback card
  feedbackCard: { padding: spacing.md, marginTop: spacing.md },
  feedbackTitle: { ...typography.h3, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  feedbackScores: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg },
  feedbackScoreItem: { alignItems: 'center', gap: spacing.xs },
  feedbackScoreValue: { ...typography.h2, color: colors.text },
  feedbackScoreLabel: { ...typography.caption, color: colors.textMuted },

  // Input
  inputContainer: { padding: spacing.md, paddingHorizontal: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  responseInput: { ...typography.body, color: colors.text, backgroundColor: colors.background, borderRadius: borderRadius.md, padding: spacing.md, minHeight: 80, maxHeight: 140, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border },
  inputActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  charCount: { ...typography.caption, color: colors.textMuted },

  // Results
  ratingCard: { alignItems: 'center', padding: spacing.lg, marginBottom: spacing.lg },
  ratingLabel: { ...typography.hero, marginTop: spacing.sm },
  averagesRow: { flexDirection: 'row', gap: spacing.xxl, marginTop: spacing.md, marginBottom: spacing.md },
  averageStat: { alignItems: 'center' },
  averageValue: { ...typography.h2, color: colors.text },
  averageLabel: { ...typography.caption, color: colors.textMuted },
  averageDivider: { width: 1, backgroundColor: colors.border },
  trendBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.full },
  trendText: { ...typography.label },

  // Round breakdown
  roundBreakdownCard: { padding: spacing.md, marginBottom: spacing.md },
  roundBreakdownHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  levelBadgeText: { ...typography.caption },
  roundOverallScore: { ...typography.h3 },
  breakdownLabel: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm, marginBottom: spacing.xs },
  breakdownOpponentLine: { ...typography.bodySmall, color: colors.textSecondary, fontStyle: 'italic', paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.border },
  breakdownPlayerLine: { ...typography.bodySmall, color: colors.text, paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.primary },
  breakdownIdealLine: { ...typography.bodySmall, color: colors.accent, paddingLeft: spacing.sm, borderLeftWidth: 2, borderLeftColor: colors.accent + '40' },
  breakdownScores: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  miniScorePill: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, backgroundColor: colors.surface, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: borderRadius.full },
  miniScoreLabel: { ...typography.caption, color: colors.textMuted },
  miniScoreValue: { ...typography.button, fontSize: 14 },

  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
});
