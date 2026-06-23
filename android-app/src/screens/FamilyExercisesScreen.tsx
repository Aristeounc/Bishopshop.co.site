import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { FAMILY_MODULES } from '@/utils/familyExercises';
import {
  getExercisesForRole,
  getExerciseHistory,
  getModuleProgress,
} from '@/services/familyExerciseService';
import { logScreenView } from '@/services/analytics';
import {
  FamilyModule,
  FamilyExercise,
  FamilyExerciseSession,
  FamilyModuleId,
  ExerciseRole,
} from '@/models/types';

interface FamilyExercisesScreenProps {
  navigation: any;
}

export function FamilyExercisesScreen({ navigation }: FamilyExercisesScreenProps) {
  const user = useStore((s) => s.user);
  const childProfiles = useStore((s) => s.childProfiles);
  const [selectedModule, setSelectedModule] = useState<FamilyModuleId | null>(null);
  const [selectedRole, setSelectedRole] = useState<ExerciseRole>('parent');
  const [history, setHistory] = useState<FamilyExerciseSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logScreenView('FamilyExercises');
    loadHistory();
  }, []);

  async function loadHistory() {
    if (!user) return;
    setIsLoading(true);
    const sessions = await getExerciseHistory(user.id);
    setHistory(sessions);
    setIsLoading(false);
  }

  const activeModule = selectedModule
    ? FAMILY_MODULES.find((m) => m.id === selectedModule)
    : null;

  const exercises = selectedModule
    ? getExercisesForRole(selectedModule, selectedRole)
    : [];

  const roleLabel = selectedRole === 'parent' ? 'Parent Track' : 'Kid/Teen Track';

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (selectedModule) {
            setSelectedModule(null);
          } else {
            navigation.goBack();
          }
        }} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {activeModule ? activeModule.name : 'Family Exercises'}
        </Text>
      </View>

      {!selectedModule ? (
        <>
          <Text style={styles.subtitle}>
            Three research-backed frameworks combined into practice exercises
            for parents and kids
          </Text>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleOption, selectedRole === 'parent' && styles.roleOptionActive]}
              onPress={() => setSelectedRole('parent')}
            >
              <Icon
                name="account"
                size={16}
                color={selectedRole === 'parent' ? colors.textOnPrimary : colors.textSecondary}
              />
              <Text
                style={[styles.roleText, selectedRole === 'parent' && styles.roleTextActive]}
              >
                I'm a Parent
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleOption, selectedRole === 'child' && styles.roleOptionActive]}
              onPress={() => setSelectedRole('child')}
            >
              <Icon
                name="account-child"
                size={16}
                color={selectedRole === 'child' ? colors.textOnPrimary : colors.textSecondary}
              />
              <Text
                style={[styles.roleText, selectedRole === 'child' && styles.roleTextActive]}
              >
                I'm a Kid/Teen
              </Text>
            </TouchableOpacity>
          </View>

          {/* Module Cards */}
          {FAMILY_MODULES.map((mod, index) => {
            const progress = getModuleProgress(history, mod.id);
            return (
              <TouchableOpacity
                key={mod.id}
                onPress={() => setSelectedModule(mod.id)}
                activeOpacity={0.8}
              >
                <Card style={styles.moduleCard} variant="elevated">
                  <View style={styles.moduleHeader}>
                    <View style={[styles.moduleIconBg, { backgroundColor: mod.color + '20' }]}>
                      <Icon name={mod.icon} size={28} color={mod.color} />
                    </View>
                    <View style={styles.moduleInfo}>
                      <Text style={styles.moduleStep}>Module {index + 1}</Text>
                      <Text style={styles.moduleName}>{mod.name}</Text>
                      <Text style={styles.moduleSubtitle}>{mod.subtitle}</Text>
                    </View>
                    <Icon name="chevron-right" size={20} color={colors.textMuted} />
                  </View>

                  <Text style={styles.moduleDesc}>{mod.description}</Text>

                  <View style={styles.moduleFramework}>
                    <Icon name="book-open-variant" size={14} color={colors.textMuted} />
                    <Text style={styles.frameworkText}>
                      {mod.framework} — {mod.expert}
                    </Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%`,
                            backgroundColor: mod.color,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {progress.completed}/{progress.total}
                    </Text>
                  </View>

                  {/* Principles Preview */}
                  <View style={styles.principlesPreview}>
                    {mod.principles.slice(0, 2).map((p, i) => (
                      <View key={i} style={styles.principleRow}>
                        <View style={[styles.principleDot, { backgroundColor: mod.color }]} />
                        <Text style={styles.principleText} numberOfLines={1}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </>
      ) : (
        <>
          {/* Module Detail View */}
          {activeModule && (
            <>
              <Card style={[styles.moduleDetailHeader, { borderLeftColor: activeModule.color }]} variant="elevated">
                <View style={styles.detailHeaderRow}>
                  <View style={[styles.moduleIconBg, { backgroundColor: activeModule.color + '20' }]}>
                    <Icon name={activeModule.icon} size={32} color={activeModule.color} />
                  </View>
                  <View style={styles.detailHeaderInfo}>
                    <Text style={styles.detailFramework}>
                      {activeModule.framework} — {activeModule.expert}
                    </Text>
                    <Text style={styles.detailSubtitle}>{activeModule.subtitle}</Text>
                  </View>
                </View>
                <Text style={styles.detailDesc}>{activeModule.description}</Text>
              </Card>

              {/* Core Principles */}
              <Text style={styles.sectionTitle}>Core Principles</Text>
              <Card>
                {activeModule.principles.map((p, i) => (
                  <View key={i}>
                    {i > 0 && <View style={styles.divider} />}
                    <View style={styles.principleFullRow}>
                      <Text style={[styles.principleNum, { color: activeModule.color }]}>
                        {i + 1}
                      </Text>
                      <Text style={styles.principleFullText}>{p}</Text>
                    </View>
                  </View>
                ))}
              </Card>

              {/* Role Toggle in Module View */}
              <View style={[styles.roleToggle, { marginTop: spacing.lg }]}>
                <TouchableOpacity
                  style={[styles.roleOption, selectedRole === 'parent' && styles.roleOptionActive]}
                  onPress={() => setSelectedRole('parent')}
                >
                  <Text
                    style={[styles.roleText, selectedRole === 'parent' && styles.roleTextActive]}
                  >
                    Parent Exercises
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleOption, selectedRole === 'child' && styles.roleOptionActive]}
                  onPress={() => setSelectedRole('child')}
                >
                  <Text
                    style={[styles.roleText, selectedRole === 'child' && styles.roleTextActive]}
                  >
                    Kid/Teen Exercises
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Exercise List */}
              <Text style={styles.sectionTitle}>
                {roleLabel} ({exercises.length})
              </Text>

              {exercises.length === 0 ? (
                <Card style={styles.emptyExercises}>
                  <Text style={styles.emptyExercisesText}>
                    No exercises available for this role in this module yet.
                  </Text>
                </Card>
              ) : (
                exercises.map((ex) => {
                  const completed = history.some(
                    (h) => h.exerciseId === ex.id && h.completedAt,
                  );
                  return (
                    <Card key={ex.id} style={styles.exerciseCard}>
                      <View style={styles.exerciseHeader}>
                        <View style={styles.exerciseLeft}>
                          <View
                            style={[
                              styles.exerciseTypeBadge,
                              { backgroundColor: activeModule.color + '20' },
                            ]}
                          >
                            <Text style={[styles.exerciseTypeText, { color: activeModule.color }]}>
                              {formatExerciseType(ex.type)}
                            </Text>
                          </View>
                          <Text style={styles.exerciseTitle}>{ex.title}</Text>
                          <Text style={styles.exerciseDesc}>{ex.description}</Text>
                        </View>
                        {completed && (
                          <Icon name="check-circle" size={20} color={colors.success} />
                        )}
                      </View>

                      <View style={styles.exerciseMeta}>
                        <View style={styles.metaItem}>
                          <Icon name="clock-outline" size={14} color={colors.textMuted} />
                          <Text style={styles.metaText}>{ex.estimatedMinutes} min</Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Icon name="signal" size={14} color={colors.textMuted} />
                          <Text style={styles.metaText}>
                            {'●'.repeat(ex.difficulty)}{'○'.repeat(5 - ex.difficulty)}
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Text style={styles.metaText}>
                            {ex.ageGroup === 'all' ? 'All ages' : ex.ageGroup === 'ages_8_12' ? '8-12' : '13-17'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.scenarioPreview}>
                        <Text style={styles.scenarioCount}>
                          {ex.scenarios.length} scenario{ex.scenarios.length !== 1 ? 's' : ''}
                        </Text>
                        {ex.scenarios.slice(0, 2).map((s) => (
                          <Text key={s.id} style={styles.scenarioName}>
                            • {s.title}
                          </Text>
                        ))}
                      </View>

                      <Button
                        title={completed ? 'Practice Again' : 'Start Exercise'}
                        onPress={() => {
                          // Navigate to exercise practice screen (future implementation)
                          navigation.navigate('ExercisePractice', { exercise: ex, module: activeModule });
                        }}
                        variant={completed ? 'outline' : 'accent'}
                        size="sm"
                        style={{ marginTop: spacing.md }}
                      />
                    </Card>
                  );
                })
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}

function formatExerciseType(type: string): string {
  const labels: Record<string, string> = {
    ai_roleplay: 'AI Roleplay',
    reflection: 'Reflection',
    sorting: 'Sorting',
    rewrite: 'Rewrite',
    assessment: 'Assessment',
    conversation_practice: 'Conversation',
  };
  return labels[type] ?? type;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  roleOptionActive: {
    backgroundColor: colors.primary,
  },
  roleText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  roleTextActive: {
    color: colors.textOnPrimary,
  },
  moduleCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  moduleIconBg: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleStep: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  moduleName: {
    ...typography.h2,
    color: colors.text,
  },
  moduleSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  moduleDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  moduleFramework: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  frameworkText: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  principlesPreview: {
    gap: spacing.xs,
  },
  principleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  principleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  principleText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  moduleDetailHeader: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  detailHeaderInfo: {
    flex: 1,
  },
  detailFramework: {
    ...typography.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  detailSubtitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.xs,
  },
  detailDesc: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  principleFullRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  principleNum: {
    ...typography.h2,
    width: 24,
  },
  principleFullText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 22,
  },
  emptyExercises: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyExercisesText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  exerciseCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  exerciseLeft: {
    flex: 1,
  },
  exerciseTypeBadge: {
    alignSelf: 'flex-start',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginBottom: spacing.xs,
  },
  exerciseTypeText: {
    ...typography.caption,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  exerciseDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  exerciseMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  metaText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  scenarioPreview: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  scenarioCount: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  scenarioName: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
