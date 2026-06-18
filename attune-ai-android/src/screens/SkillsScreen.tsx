import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';
import { useAppStore } from '@stores/appStore';

const SKILL_ICONS: Record<string, string> = {
  negotiation: 'handshake',
  'conflict-resolution': 'peace',
  influence: 'trending-up',
  'high-stakes': 'fire',
  nvc: 'heart',
  'emotional-awareness': 'emoticon',
  defensiveness: 'shield',
  advanced: 'star',
};

const SkillsScreen = ({ navigation }: any) => {
  const { user, skills, loadSkills, isLoading } = useAppStore();

  useEffect(() => {
    if (user?.id) {
      loadSkills(user.id);
    }
  }, [user?.id]);

  const handleSkillPress = (skillTrackId: string) => {
    // Navigate to skill detail or start training
    navigation.navigate('HomeTab', { screen: 'HomeMain', params: { selectedSkill: skillTrackId } });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={skills}
        keyExtractor={(item) => item.trackId}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.skillCard}
            onPress={() => handleSkillPress(item.trackId)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: Colors.badges[item.currentTier] }]}>
              <MaterialCommunityIcons
                name={SKILL_ICONS[item.trackId] || 'star'}
                size={32}
                color={Colors.ink}
              />
            </View>

            <View style={styles.skillContent}>
              <Text style={styles.skillTitle}>{item.trackName}</Text>
              <View style={styles.tier}>
                <Text style={styles.tierBadge}>{item.currentTier.toUpperCase()}</Text>
              </View>
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
              <View style={styles.stats}>
                <Text style={styles.stat}>{item.currentScore}% • {item.sessionsCompleted} sessions</Text>
              </View>
            </View>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
  },
  contentContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  skillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillContent: {
    flex: 1,
    gap: Spacing.sm,
  },
  skillTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tier: {
    alignSelf: 'flex-start',
  },
  tierBadge: {
    ...Typography.label,
    color: Colors.secondary,
    fontWeight: '700',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  stats: {
    marginTop: Spacing.sm,
  },
  stat: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
});

export default SkillsScreen;
