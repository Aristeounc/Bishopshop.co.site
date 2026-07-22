import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { useStore } from '@/store/useStore';
import { SKILL_TRACKS } from '@/utils/constants';
import { CONCEPT_LIBRARY, Concept } from '@/services/concepts';
import { logScreenView } from '@/services/analytics';
import { SkillTrackId } from '@/models/types';

interface Props {
  navigation: any;
}

export function ConceptsScreen({ navigation }: Props) {
  const skillProgress = useStore((s) => s.skillProgress);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    logScreenView('Concepts');
  }, []);

  const allMasteredIds = useMemo(() => {
    const ids = new Set<string>();
    for (const sp of Object.values(skillProgress)) {
      for (const cid of sp.conceptsMastered) {
        ids.add(cid);
      }
    }
    return ids;
  }, [skillProgress]);

  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) return CONCEPT_LIBRARY;
    const q = searchQuery.toLowerCase();
    return CONCEPT_LIBRARY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.expertSource.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const groupedBySkill = useMemo(() => {
    const groups: Record<SkillTrackId, Concept[]> = {} as any;
    for (const track of SKILL_TRACKS) {
      groups[track.id] = [];
    }
    for (const concept of filteredConcepts) {
      if (groups[concept.primarySkill]) {
        groups[concept.primarySkill].push(concept);
      }
    }
    return groups;
  }, [filteredConcepts]);

  const masteredCount = filteredConcepts.filter((c) => allMasteredIds.has(c.id)).length;

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Concepts Library</Text>
          <Text style={styles.subtitle}>
            {masteredCount}/{filteredConcepts.length} mastered
          </Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search concepts, sources..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {SKILL_TRACKS.map((track) => {
          const concepts = groupedBySkill[track.id];
          if (!concepts || concepts.length === 0) return null;

          return (
            <View key={track.id} style={styles.skillGroup}>
              <View style={styles.skillHeader}>
                <View style={[styles.skillDot, { backgroundColor: track.color }]} />
                <Text style={styles.skillGroupTitle}>{track.name}</Text>
                <Text style={styles.skillGroupCount}>
                  {concepts.filter((c) => allMasteredIds.has(c.id)).length}/{concepts.length}
                </Text>
              </View>

              {concepts.map((concept) => {
                const isMastered = allMasteredIds.has(concept.id);
                const isExpanded = expandedId === concept.id;

                return (
                  <TouchableOpacity
                    key={concept.id}
                    style={[
                      styles.conceptCard,
                      isExpanded && styles.conceptCardExpanded,
                    ]}
                    onPress={() => toggleExpand(concept.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.conceptHeader}>
                      <View style={styles.conceptTitleRow}>
                        <View style={styles.conceptTitleArea}>
                          <Text style={styles.conceptName}>{concept.name}</Text>
                          <Text style={styles.conceptSource}>{concept.expertSource}</Text>
                        </View>
                        <View style={styles.conceptIcons}>
                          {isMastered && (
                            <Icon
                              name="check-circle"
                              size={20}
                              color={colors.success}
                              style={styles.masteredIcon}
                            />
                          )}
                          <Icon
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={colors.textMuted}
                          />
                        </View>
                      </View>
                    </View>

                    {isExpanded && (
                      <View style={styles.conceptBody}>
                        <Text style={styles.sectionLabel}>Summary</Text>
                        <Text style={styles.summaryText}>{concept.summary}</Text>

                        <Text style={styles.sectionLabel}>Key Takeaways</Text>
                        {concept.keyTakeaways.map((takeaway, idx) => (
                          <View key={idx} style={styles.takeawayRow}>
                            <Icon
                              name="circle-small"
                              size={20}
                              color={colors.accent}
                              style={styles.bulletIcon}
                            />
                            <Text style={styles.takeawayText}>{takeaway}</Text>
                          </View>
                        ))}

                        <Text style={styles.sectionLabel}>Drill Prompts</Text>
                        {concept.drillPrompts.map((prompt, idx) => (
                          <View key={idx} style={styles.drillRow}>
                            <View style={styles.drillNumber}>
                              <Text style={styles.drillNumberText}>{idx + 1}</Text>
                            </View>
                            <Text style={styles.drillText}>{prompt}</Text>
                          </View>
                        ))}

                        {concept.secondarySkills.length > 0 && (
                          <>
                            <Text style={styles.sectionLabel}>Related Skills</Text>
                            <View style={styles.tagsRow}>
                              {concept.secondarySkills.map((skillId) => {
                                const st = SKILL_TRACKS.find((t) => t.id === skillId);
                                if (!st) return null;
                                return (
                                  <View
                                    key={skillId}
                                    style={[
                                      styles.skillTag,
                                      { backgroundColor: st.color + '20' },
                                    ]}
                                  >
                                    <Text style={[styles.skillTagText, { color: st.color }]}>
                                      {st.name}
                                    </Text>
                                  </View>
                                );
                              })}
                            </View>
                          </>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}

        {filteredConcepts.length === 0 && (
          <View style={styles.emptyState}>
            <Icon name="book-open-variant" size={48} color={colors.textMuted} />
            <Text style={styles.emptyText}>No concepts match your search</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
  },
  backButton: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.h1,
    color: colors.text,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    padding: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  skillGroup: {
    marginBottom: spacing.lg,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  skillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.sm,
  },
  skillGroupTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  skillGroupCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  conceptCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  conceptCardExpanded: {
    backgroundColor: colors.surfaceElevated,
  },
  conceptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  conceptTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conceptTitleArea: {
    flex: 1,
    marginRight: spacing.sm,
  },
  conceptName: {
    ...typography.label,
    color: colors.text,
  },
  conceptSource: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  conceptIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masteredIcon: {
    marginRight: spacing.xs,
  },
  conceptBody: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  summaryText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bulletIcon: {
    marginTop: -2,
  },
  takeawayText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
  },
  drillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  drillNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 1,
  },
  drillNumberText: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 11,
  },
  drillText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  skillTagText: {
    ...typography.caption,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
