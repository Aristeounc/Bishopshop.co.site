import React, { useState, useEffect, useMemo } from 'react';
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
import { Card } from '@/components/Card';
import { useStore } from '@/store/useStore';
import { CONCEPT_LIBRARY, Concept } from '@/services/concepts';
import { SKILL_TRACKS } from '@/utils/constants';
import { logScreenView } from '@/services/analytics';
import { SkillTrackId } from '@/models/types';

interface ConceptLibraryScreenProps {
  navigation: any;
}

export function ConceptLibraryScreen({ navigation }: ConceptLibraryScreenProps) {
  const skillProgress = useStore((s) => s.skillProgress);
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState<SkillTrackId | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    logScreenView('ConceptLibrary');
  }, []);

  const masteredIds = useMemo(() => {
    const ids = new Set<string>();
    for (const sp of Object.values(skillProgress)) {
      for (const cid of sp.conceptsMastered) {
        ids.add(cid);
      }
    }
    return ids;
  }, [skillProgress]);

  const filteredConcepts = useMemo(() => {
    let result = CONCEPT_LIBRARY;

    if (filterSkill) {
      result = result.filter(
        (c) => c.primarySkill === filterSkill || c.secondarySkills.includes(filterSkill),
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.expertSource.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q),
      );
    }

    return result;
  }, [filterSkill, search]);

  const skillTrackForConcept = (concept: Concept) =>
    SKILL_TRACKS.find((t) => t.id === concept.primarySkill);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Concept Library</Text>
          <Text style={styles.subtitle}>
            {CONCEPT_LIBRARY.length} concepts · {masteredIds.size} mastered
          </Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Icon name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search concepts or experts..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterChip, !filterSkill && styles.filterChipActive]}
          onPress={() => setFilterSkill(null)}
        >
          <Text style={[styles.filterChipText, !filterSkill && styles.filterChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {SKILL_TRACKS.map((track) => {
          const isActive = filterSkill === track.id;
          const count = CONCEPT_LIBRARY.filter(
            (c) => c.primarySkill === track.id || c.secondarySkills.includes(track.id),
          ).length;
          return (
            <TouchableOpacity
              key={track.id}
              style={[
                styles.filterChip,
                isActive && { backgroundColor: track.color + '20', borderColor: track.color },
              ]}
              onPress={() => setFilterSkill(isActive ? null : track.id)}
            >
              <View style={[styles.filterDot, { backgroundColor: track.color }]} />
              <Text style={[styles.filterChipText, isActive && { color: track.color }]}>
                {track.name} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredConcepts.length === 0 ? (
        <View style={styles.noResults}>
          <Icon name="book-search-outline" size={40} color={colors.textMuted} />
          <Text style={styles.noResultsText}>No concepts match your search.</Text>
        </View>
      ) : (
        <View style={styles.conceptList}>
          {filteredConcepts.map((concept) => {
            const track = skillTrackForConcept(concept);
            const isMastered = masteredIds.has(concept.id);
            const isExpanded = expandedId === concept.id;

            return (
              <TouchableOpacity
                key={concept.id}
                activeOpacity={0.8}
                onPress={() => setExpandedId(isExpanded ? null : concept.id)}
              >
                <Card style={styles.conceptCard}>
                  <View style={styles.conceptHeader}>
                    <View style={styles.conceptMeta}>
                      <View style={styles.conceptTitleRow}>
                        {isMastered && (
                          <Icon name="check-decagram" size={16} color={colors.success} />
                        )}
                        <Text style={styles.conceptName}>{concept.name}</Text>
                      </View>
                      <Text style={styles.conceptExpert}>{concept.expertSource}</Text>
                    </View>
                    <View style={styles.conceptBadges}>
                      <View style={[styles.skillTag, { backgroundColor: (track?.color ?? colors.primary) + '15' }]}>
                        <Text style={[styles.skillTagText, { color: track?.color ?? colors.primary }]}>
                          {track?.name ?? concept.primarySkill}
                        </Text>
                      </View>
                      <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color={colors.textMuted}
                      />
                    </View>
                  </View>

                  {!isExpanded && (
                    <Text style={styles.conceptPreview} numberOfLines={2}>
                      {concept.summary}
                    </Text>
                  )}

                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      <Text style={styles.conceptSummary}>{concept.summary}</Text>

                      <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Key Takeaways</Text>
                        {concept.keyTakeaways.map((takeaway, i) => (
                          <View key={i} style={styles.takeawayRow}>
                            <View style={[styles.takeawayBullet, { backgroundColor: track?.color ?? colors.accent }]} />
                            <Text style={styles.takeawayText}>{takeaway}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Practice Prompts</Text>
                        {concept.drillPrompts.map((prompt, i) => (
                          <Card key={i} style={styles.drillPromptCard} variant="outlined">
                            <View style={styles.drillPromptHeader}>
                              <Icon name="lightbulb-outline" size={14} color={colors.accent} />
                              <Text style={styles.drillPromptLabel}>Drill {i + 1}</Text>
                            </View>
                            <Text style={styles.drillPromptText}>{prompt}</Text>
                          </Card>
                        ))}
                      </View>

                      <View style={styles.skillsRow}>
                        <Text style={styles.skillsLabel}>Trains:</Text>
                        <View style={[styles.skillTag, { backgroundColor: (track?.color ?? colors.primary) + '15' }]}>
                          <Text style={[styles.skillTagText, { color: track?.color ?? colors.primary }]}>
                            {track?.name}
                          </Text>
                        </View>
                        {concept.secondarySkills.map((sid) => {
                          const st = SKILL_TRACKS.find((t) => t.id === sid);
                          return (
                            <View
                              key={sid}
                              style={[styles.skillTag, { backgroundColor: (st?.color ?? colors.textMuted) + '15' }]}
                            >
                              <Text style={[styles.skillTagText, { color: st?.color ?? colors.textMuted }]}>
                                {st?.name ?? sid}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
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
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  filterRow: {
    marginBottom: spacing.lg,
    maxHeight: 40,
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
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  conceptList: {
    gap: spacing.md,
  },
  conceptCard: {
    padding: spacing.md,
  },
  conceptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  conceptMeta: {
    flex: 1,
    marginRight: spacing.sm,
  },
  conceptTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  conceptName: {
    ...typography.label,
    color: colors.text,
    fontSize: 15,
  },
  conceptExpert: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  conceptBadges: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  skillTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  skillTagText: {
    ...typography.caption,
    fontSize: 11,
  },
  conceptPreview: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: spacing.md,
  },
  conceptSummary: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.accent,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  takeawayBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
  },
  takeawayText: {
    ...typography.bodySmall,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  drillPromptCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  drillPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  drillPromptLabel: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  drillPromptText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  skillsLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.md,
  },
  noResultsText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
