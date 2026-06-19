import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';
import { useAppStore } from '@stores/appStore';

const HomeScreen = ({ navigation }: any) => {
  const { user, skills, loadSkills, isLoading } = useAppStore();

  useEffect(() => {
    if (user?.id) {
      loadSkills(user.id);
    }
  }, [user?.id]);

  const topSkills = skills.slice(0, 3);

  const handleStartTraining = () => {
    navigation.navigate('Sparring');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Welcome back,</Text>
          <Text style={styles.nameText}>{user?.displayName || 'User'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <MaterialCommunityIcons name="account-circle" size={40} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Quick Action Card */}
      <LinearGradient
        colors={[Colors.primary, Colors.primary + 'dd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionCard}
      >
        <View style={styles.actionContent}>
          <MaterialCommunityIcons name="lightning-bolt" size={32} color={Colors.secondary} />
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Ready to Practice?</Text>
            <Text style={styles.actionSubtitle}>Start your next sparring session</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleStartTraining}
        >
          <MaterialCommunityIcons name="arrow-right" size={24} color={Colors.ink} />
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {skills.reduce((sum, s) => sum + s.sessionsCompleted, 0)}
            </Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {skills.filter(s => s.currentTier === 'master').length}
            </Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {Math.round(skills.reduce((sum, s) => sum + s.currentScore, 0) / Math.max(skills.length, 1))}%
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
        </View>
      </View>

      {/* Top Skills */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Skills</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SkillsTab')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topSkills}
            keyExtractor={(item) => item.trackId}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.skillCard}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{item.trackName}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${item.progressToNextTier}%`,
                          backgroundColor: Colors.badges[item.currentTier],
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.skillMetrics}>
                    <Text style={styles.metricText}>{item.currentScore}%</Text>
                    <Text style={styles.tierText}>{item.currentTier}</Text>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  nameText: {
    ...Typography.heading,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  profileButton: {
    padding: Spacing.sm,
  },
  actionCard: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
  },
  actionSubtitle: {
    ...Typography.label,
    color: Colors.text,
    opacity: 0.8,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: Colors.secondary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subheading,
    color: Colors.text,
  },
  viewAllText: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    ...Typography.heading,
    color: Colors.secondary,
  },
  statLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  skillCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skillInfo: {
    gap: Spacing.sm,
  },
  skillName: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  skillMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  metricText: {
    ...Typography.label,
    color: Colors.secondary,
    fontWeight: '600',
  },
  tierText: {
    ...Typography.label,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
