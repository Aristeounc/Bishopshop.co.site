import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';
import { useAppStore } from '@stores/appStore';
import { BadgeTier } from '@models/index';

const BADGE_INFO: Record<BadgeTier, { icon: string; color: string; motto: string }> = {
  emerging: { icon: '🌱', color: Colors.badges.emerging, motto: 'Initium Sapientiae' },
  competent: { icon: '⭐', color: Colors.badges.competent, motto: 'Firmus et Fortis' },
  proficient: { icon: '🏅', color: Colors.badges.proficient, motto: 'Aureus Animus' },
  expert: { icon: '🎯', color: Colors.badges.expert, motto: 'Viridis Victoriae' },
  master: { icon: '👑', color: Colors.badges.master, motto: 'Summum Fastigium' },
};

const ProgressScreen = () => {
  const { user, skills, loadSkills, isLoading } = useAppStore();

  useEffect(() => {
    if (user?.id) {
      loadSkills(user.id);
    }
  }, [user?.id]);

  const totalSessions = skills.reduce((sum, s) => sum + s.sessionsCompleted, 0);
  const avgScore = Math.round(skills.reduce((sum, s) => sum + s.currentScore, 0) / Math.max(skills.length, 1));
  const masteredSkills = skills.filter((s) => s.currentTier === 'master');

  const getAllBadges = () => {
    const badges: Array<{ tier: BadgeTier; count: number }> = [];
    Object.keys(BADGE_INFO).forEach((tier) => {
      const count = skills.filter((s) => s.currentTier === tier).length;
      if (count > 0) {
        badges.push({ tier: tier as BadgeTier, count });
      }
    });
    return badges;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  const badges = getAllBadges();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Overall Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{totalSessions}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{avgScore}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{masteredSkills.length}</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
        </View>
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.badgesContainer}>
            {badges.map(({ tier, count }) => (
              <View key={tier} style={styles.badgeItem}>
                <View
                  style={[
                    styles.badgeCircle,
                    { backgroundColor: BADGE_INFO[tier].color },
                  ]}
                >
                  <Text style={styles.badgeIcon}>{BADGE_INFO[tier].icon}</Text>
                </View>
                <Text style={styles.badgeName}>{tier}</Text>
                <Text style={styles.badgeCount}>{count} {count === 1 ? 'skill' : 'skills'}</Text>
                <Text style={styles.badgeMotto}>{BADGE_INFO[tier].motto}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Skill Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill Breakdown</Text>
        <FlatList
          data={skills}
          keyExtractor={(item) => item.trackId}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.breakdownItem}>
              <View style={styles.breakdownInfo}>
                <Text style={styles.breakdownName}>{item.trackName}</Text>
                <View style={styles.breakdownStats}>
                  <Text style={styles.breakdownStat}>
                    Score: {item.currentScore}%
                  </Text>
                  <Text style={styles.breakdownStat}>
                    Sessions: {item.sessionsCompleted}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.tierBadge,
                  { backgroundColor: BADGE_INFO[item.currentTier].color },
                ]}
              >
                <Text style={styles.tierText}>{item.currentTier}</Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subheading,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  statsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  statBlock: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...Typography.subheading,
    color: Colors.secondary,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  badgeItem: {
    width: '31%',
    alignItems: 'center',
  },
  badgeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeIcon: {
    fontSize: 40,
  },
  badgeName: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  badgeCount: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: 2,
    fontSize: 11,
  },
  badgeMotto: {
    ...Typography.label,
    color: Colors.secondary,
    marginTop: 4,
    fontSize: 10,
    fontStyle: 'italic',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownInfo: {
    flex: 1,
  },
  breakdownName: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'capitalize',
  },
  breakdownStats: {
    gap: Spacing.sm,
  },
  breakdownStat: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  tierBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  tierText: {
    ...Typography.label,
    color: Colors.ink,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default ProgressScreen;
