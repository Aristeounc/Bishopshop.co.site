import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { useStore } from '@/store/useStore';
import { fetchSessionHistory } from '@/services/firestore';
import { getPersona } from '@/services/sparring/personas';
import { logScreenView } from '@/services/analytics';
import { SparringSession, PersonaId, SkillTrackId } from '@/models/types';
import { formatEloChange, formatDuration } from '@/utils/helpers';

interface SessionHistoryScreenProps {
  navigation: any;
}

export function SessionHistoryScreen({ navigation }: SessionHistoryScreenProps) {
  const user = useStore((s) => s.user);
  const sessionHistory = useStore((s) => s.sessionHistory);
  const [sessions, setSessions] = useState<SparringSession[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPersona, setFilterPersona] = useState<PersonaId | null>(null);

  useEffect(() => {
    logScreenView('SessionHistory');
    loadSessions();
  }, []);

  async function loadSessions() {
    if (!user) {
      setSessions(sessionHistory);
      setLoading(false);
      return;
    }
    try {
      const remote = await fetchSessionHistory(user.id, 50);
      setSessions(remote.length > 0 ? remote : sessionHistory);
    } catch {
      setSessions(sessionHistory);
    }
    setLoading(false);
  }

  const filteredSessions = filterPersona
    ? sessions.filter((s) => s.personaId === filterPersona)
    : sessions;

  const personasUsed = [...new Set(sessions.map((s) => s.personaId))];

  function formatSessionDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function getSessionDuration(session: SparringSession): string {
    if (!session.completedAt) return '--';
    const ms = new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime();
    return formatDuration(ms);
  }

  function getScoreColor(score: number): string {
    if (score >= 70) return colors.success;
    if (score >= 40) return colors.warning;
    return colors.error;
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading sessions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Session History</Text>
      </View>

      {sessions.length === 0 ? (
        <EmptyState
          icon="history"
          iconColor={colors.primary}
          title="No sessions yet"
          description="Your sparring session history will appear here after you complete your first match."
          actionLabel="Start Sparring"
          onAction={() => navigation.navigate('Sparring')}
        />
      ) : (
        <>
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{personasUsed.length}</Text>
              <Text style={styles.statLabel}>Personas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {sessions.length > 0
                  ? Math.round(
                      sessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / sessions.length,
                    )
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>

          {personasUsed.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterRow}
              contentContainerStyle={styles.filterContent}
            >
              <TouchableOpacity
                style={[styles.filterChip, !filterPersona && styles.filterChipActive]}
                onPress={() => setFilterPersona(null)}
              >
                <Text style={[styles.filterChipText, !filterPersona && styles.filterChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              {personasUsed.map((pid) => {
                const persona = getPersona(pid);
                const isActive = filterPersona === pid;
                return (
                  <TouchableOpacity
                    key={pid}
                    style={[
                      styles.filterChip,
                      isActive && { backgroundColor: persona.color + '20', borderColor: persona.color },
                    ]}
                    onPress={() => setFilterPersona(isActive ? null : pid)}
                  >
                    <Text style={styles.filterAvatar}>{persona.avatar}</Text>
                    <Text style={[styles.filterChipText, isActive && { color: persona.color }]}>
                      {persona.name.replace('The ', '')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          <View style={styles.sessionList}>
            {filteredSessions.map((session) => {
              const persona = getPersona(session.personaId);
              const isExpanded = expandedId === session.id;
              const score = session.overallScore ?? 0;

              return (
                <TouchableOpacity
                  key={session.id}
                  activeOpacity={0.8}
                  onPress={() => setExpandedId(isExpanded ? null : session.id)}
                >
                  <Card style={styles.sessionCard}>
                    <View style={styles.sessionHeader}>
                      <View style={styles.sessionMeta}>
                        <Text style={styles.sessionAvatar}>{persona.avatar}</Text>
                        <View>
                          <Text style={styles.sessionPersona}>{persona.name}</Text>
                          <Text style={styles.sessionDate}>
                            {formatSessionDate(session.startedAt)} · {getSessionDuration(session)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.sessionScore}>
                        <Text style={[styles.scoreValue, { color: getScoreColor(score) }]}>
                          {score}
                        </Text>
                        <Icon
                          name={isExpanded ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color={colors.textMuted}
                        />
                      </View>
                    </View>

                    {session.eloChanges && (
                      <View style={styles.eloChips}>
                        {Object.entries(session.eloChanges)
                          .filter(([, change]) => change !== 0)
                          .slice(0, 4)
                          .map(([trackId, change]) => (
                            <View
                              key={trackId}
                              style={[
                                styles.eloChip,
                                { backgroundColor: (change >= 0 ? colors.success : colors.error) + '15' },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.eloChipText,
                                  { color: change >= 0 ? colors.success : colors.error },
                                ]}
                              >
                                {trackId} {formatEloChange(change)}
                              </Text>
                            </View>
                          ))}
                      </View>
                    )}

                    {isExpanded && session.debrief && (
                      <View style={styles.expandedDebrief}>
                        <View style={styles.debriefDivider} />

                        {session.debrief.strengths.length > 0 && (
                          <View style={styles.debriefSection}>
                            <Text style={styles.debriefLabel}>Strengths</Text>
                            {session.debrief.strengths.map((s, i) => (
                              <View key={i} style={styles.debriefItem}>
                                <Icon name="check-circle" size={14} color={colors.success} />
                                <Text style={styles.debriefText}>{s}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {session.debrief.areasForGrowth.length > 0 && (
                          <View style={styles.debriefSection}>
                            <Text style={styles.debriefLabel}>Areas for Growth</Text>
                            {session.debrief.areasForGrowth.map((a, i) => (
                              <View key={i} style={styles.debriefItem}>
                                <Icon name="arrow-up-circle" size={14} color={colors.accent} />
                                <Text style={styles.debriefText}>{a}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {session.debrief.patternsNoticed.length > 0 && (
                          <View style={styles.debriefSection}>
                            <Text style={styles.debriefLabel}>Patterns</Text>
                            {session.debrief.patternsNoticed.map((p, i) => (
                              <View key={i} style={styles.debriefItem}>
                                <Icon name="lightbulb-outline" size={14} color={colors.info} />
                                <Text style={styles.debriefText}>{p}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        <View style={styles.debriefSection}>
                          <Text style={styles.debriefLabel}>ELO Changes</Text>
                          {Object.entries(session.debrief.eloSummary).map(([trackId, data]) => (
                            <View key={trackId} style={styles.eloDetailRow}>
                              <Text style={styles.eloDetailTrack}>{trackId}</Text>
                              <Text style={styles.eloDetailBefore}>{data.before}</Text>
                              <Icon name="arrow-right" size={12} color={colors.textMuted} />
                              <Text style={styles.eloDetailAfter}>{data.after}</Text>
                              <Text
                                style={[
                                  styles.eloDetailChange,
                                  { color: data.change >= 0 ? colors.success : colors.error },
                                ]}
                              >
                                {formatEloChange(data.change)}
                              </Text>
                            </View>
                          ))}
                        </View>

                        <Text style={styles.nextRec}>{session.debrief.nextRecommendation}</Text>
                      </View>
                    )}

                    {isExpanded && !session.debrief && (
                      <View style={styles.expandedDebrief}>
                        <View style={styles.debriefDivider} />
                        <Text style={styles.noDebrief}>
                          No debrief available for this session.
                        </Text>
                      </View>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })}
          </View>

          {filteredSessions.length === 0 && filterPersona && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>
                No sessions with this persona yet.
              </Text>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.accent,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  filterRow: {
    marginBottom: spacing.md,
    maxHeight: 44,
  },
  filterContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterChipActive: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  filterChipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.primary,
  },
  filterAvatar: {
    fontSize: 14,
  },
  sessionList: {
    gap: spacing.md,
  },
  sessionCard: {
    padding: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sessionAvatar: {
    fontSize: 28,
  },
  sessionPersona: {
    ...typography.label,
    color: colors.text,
  },
  sessionDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  sessionScore: {
    alignItems: 'center',
    gap: 2,
  },
  scoreValue: {
    ...typography.h3,
    fontWeight: '700',
  },
  eloChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  eloChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  eloChipText: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  expandedDebrief: {
    marginTop: spacing.sm,
  },
  debriefDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  debriefSection: {
    marginBottom: spacing.md,
  },
  debriefLabel: {
    ...typography.label,
    color: colors.accent,
    marginBottom: spacing.xs,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  debriefItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  debriefText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  eloDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 3,
  },
  eloDetailTrack: {
    ...typography.caption,
    color: colors.text,
    textTransform: 'capitalize',
    flex: 1,
  },
  eloDetailBefore: {
    ...typography.caption,
    color: colors.textMuted,
    width: 32,
    textAlign: 'right',
  },
  eloDetailAfter: {
    ...typography.caption,
    color: colors.text,
    width: 32,
    textAlign: 'right',
  },
  eloDetailChange: {
    ...typography.caption,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  nextRec: {
    ...typography.bodySmall,
    color: colors.primary,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  noDebrief: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  noResultsText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
