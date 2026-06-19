import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { WarmupCard } from '@/components/WarmupCard';
import { DrillCard } from '@/components/DrillCard';
import { ProgressRing } from '@/components/ProgressRing';
import { useStore } from '@/store/useStore';
import { generateDailyProgram, calculateProgramProgress, getProgramPhaseLabel, getProgramPhaseDescription } from '@/services/dailyProgram';
import { saveDailyProgram } from '@/services/firestore';
import { DailyProgram, GymPhase } from '@/models/types';

interface DailyProgramScreenProps {
  navigation: any;
}

const PHASE_ICONS = ['fire', 'dumbbell', 'sword-cross', 'meditation'];
const PHASE_COLORS = [colors.accent, colors.primary, colors.error, colors.success];

export function DailyProgramScreen({ navigation }: DailyProgramScreenProps) {
  const user = useStore((s) => s.user);
  const skillProgress = useStore((s) => s.skillProgress);
  const dailyProgram = useStore((s) => s.dailyProgram);
  const setDailyProgram = useStore((s) => s.setDailyProgram);

  const [activePhase, setActivePhase] = useState(0);
  const [warmupComplete, setWarmupComplete] = useState(false);

  useEffect(() => {
    loadOrGenerateProgram();
  }, []);

  function loadOrGenerateProgram() {
    const today = new Date().toISOString().split('T')[0];

    if (dailyProgram?.date === today) {
      const progress = calculateProgramProgress(dailyProgram);
      setActivePhase(progress.phase);
      return;
    }

    const completedConcepts = Object.values(skillProgress).flatMap((sp) => sp.conceptsMastered);
    const program = generateDailyProgram(today, skillProgress, completedConcepts, []);
    setDailyProgram(program);

    if (user) {
      saveDailyProgram(user.id, program).catch(() => {});
    }
  }

  function handleWarmupComplete() {
    setWarmupComplete(true);
    setActivePhase(1);
  }

  function handleDrillComplete(drillId: string, _response: string) {
    if (!dailyProgram) return;

    const updatedDrills = dailyProgram.drills.map((d) =>
      d.id === drillId ? { ...d, completed: true } : d,
    );
    const updated = { ...dailyProgram, drills: updatedDrills };
    setDailyProgram(updated);

    const allComplete = updatedDrills.every((d) => d.completed);
    if (allComplete) {
      setActivePhase(2);
    }
  }

  function handleStartSparring() {
    navigation.navigate('Sparring');
  }

  function handleCompleteProgram() {
    if (!dailyProgram) return;
    const completed = { ...dailyProgram, completed: true };
    setDailyProgram(completed);
    setActivePhase(3);

    if (user) {
      saveDailyProgram(user.id, completed).catch(() => {});
    }
  }

  if (!dailyProgram) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loading}>Generating today's program...</Text>
      </View>
    );
  }

  const progress = calculateProgramProgress(dailyProgram);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Program</Text>
          <Text style={styles.date}>
            {new Date(dailyProgram.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
        <ProgressRing
          progress={progress.overallProgress}
          size={64}
          color={PHASE_COLORS[activePhase]}
          label={`${Math.round(progress.overallProgress * 100)}%`}
        />
      </View>

      <View style={styles.phaseTimeline}>
        {[0, 1, 2, 3].map((phase) => (
          <View key={phase} style={styles.phaseStep}>
            <View
              style={[
                styles.phaseIcon,
                phase <= activePhase && { backgroundColor: PHASE_COLORS[phase] + '20' },
                phase === activePhase && styles.phaseIconActive,
              ]}
            >
              <Icon
                name={PHASE_ICONS[phase]}
                size={18}
                color={phase <= activePhase ? PHASE_COLORS[phase] : colors.textMuted}
              />
            </View>
            <Text
              style={[
                styles.phaseLabel,
                phase === activePhase && { color: PHASE_COLORS[phase] },
              ]}
            >
              {getProgramPhaseLabel(phase)}
            </Text>
            {phase < 3 && (
              <View
                style={[
                  styles.phaseLine,
                  phase < activePhase && { backgroundColor: PHASE_COLORS[phase] },
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <Card style={styles.phaseCard} variant="outlined">
        <Text style={styles.phaseTitle}>
          {getProgramPhaseLabel(activePhase)}
        </Text>
        <Text style={styles.phaseDesc}>
          {getProgramPhaseDescription(activePhase)}
        </Text>
      </Card>

      {activePhase === 0 && (
        <View style={styles.phaseContent}>
          <WarmupCard
            warmup={dailyProgram.warmup}
            onComplete={handleWarmupComplete}
            completed={warmupComplete}
          />
          {!warmupComplete && (
            <Button
              title="I've Reviewed This — Start Drills"
              onPress={handleWarmupComplete}
              variant="accent"
              size="lg"
              style={styles.phaseButton}
            />
          )}
        </View>
      )}

      {activePhase === 1 && (
        <View style={styles.phaseContent}>
          <Text style={styles.sectionTitle}>
            Drills ({dailyProgram.drills.filter((d) => d.completed).length}/{dailyProgram.drills.length})
          </Text>
          {dailyProgram.drills.map((drill, idx) => (
            <DrillCard
              key={drill.id}
              drill={drill}
              index={idx}
              onComplete={handleDrillComplete}
            />
          ))}
        </View>
      )}

      {activePhase === 2 && (
        <View style={styles.phaseContent}>
          <Card style={styles.sparringPrompt} variant="elevated">
            <Icon name="sword-cross" size={40} color={colors.error} />
            <Text style={styles.sparringTitle}>Time to Spar</Text>
            <Text style={styles.sparringDesc}>
              Apply {dailyProgram.warmup.conceptName} under pressure.{'\n'}
              Today's focus: {dailyProgram.sparringConfig.scenario}
            </Text>
            <Button
              title="Enter the Ring"
              onPress={handleStartSparring}
              variant="accent"
              size="lg"
              style={styles.phaseButton}
            />
          </Card>

          <Button
            title="Skip to Recovery"
            onPress={handleCompleteProgram}
            variant="ghost"
            size="sm"
            style={{ marginTop: spacing.md }}
          />
        </View>
      )}

      {activePhase === 3 && (
        <View style={styles.phaseContent}>
          <Card style={styles.recoveryCard} variant="elevated">
            <Icon name="check-circle" size={48} color={colors.success} />
            <Text style={styles.recoveryTitle}>Program Complete</Text>
            <Text style={styles.recoveryDesc}>
              Great work today. You studied {dailyProgram.warmup.conceptName},
              completed {dailyProgram.drills.length} drills, and put it all into practice.
            </Text>
            <Text style={styles.recoveryQuote}>
              "Mastery is not about perfection. It's about a process, a journey."
            </Text>
          </Card>

          <Button
            title="Back to Home"
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            size="lg"
            style={styles.phaseButton}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loading: { ...typography.body, color: colors.textSecondary },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { ...typography.h1, color: colors.text },
  date: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  phaseTimeline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg, paddingHorizontal: spacing.sm },
  phaseStep: { alignItems: 'center', position: 'relative' },
  phaseIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  phaseIconActive: { borderWidth: 2 },
  phaseLabel: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs, fontSize: 10 },
  phaseLine: { position: 'absolute', top: 20, left: 40, width: 40, height: 2, backgroundColor: colors.border },
  phaseCard: { padding: spacing.md, marginBottom: spacing.lg },
  phaseTitle: { ...typography.h3, color: colors.accent, marginBottom: spacing.xs },
  phaseDesc: { ...typography.bodySmall, color: colors.textSecondary },
  phaseContent: { marginBottom: spacing.lg },
  phaseButton: { marginTop: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  sparringPrompt: { alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  sparringTitle: { ...typography.h2, color: colors.text },
  sparringDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  recoveryCard: { alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  recoveryTitle: { ...typography.h2, color: colors.success },
  recoveryDesc: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  recoveryQuote: { ...typography.bodySmall, color: colors.accent, fontStyle: 'italic', textAlign: 'center', marginTop: spacing.sm },
});
