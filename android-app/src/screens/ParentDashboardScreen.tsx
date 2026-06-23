import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import {
  createChildProfile,
  getChildProfiles,
  deleteChildProfile,
  updateContentFilter,
  getChildProgressSummary,
  getAgeGroupLabel,
} from '@/services/parentKid';
import { logScreenView } from '@/services/analytics';
import { PARENT_KID_CONFIG } from '@/utils/constants';
import { SPARRING_PERSONAS } from '@/utils/constants';
import {
  ChildProfile,
  ChildAgeGroup,
  ChildProgressSummary,
  PersonaId,
} from '@/models/types';
import { searchUsersByNameOrPhone } from '@/services/parentKid';

const AVATAR_OPTIONS = ['🧒', '👦', '👧', '🧑', '👶', '🐣', '🌟', '🎮'];
const PARENT_AVATAR_OPTIONS = ['👤', '👩', '👨', '🧑‍🦱', '🧔', '👩‍🦳', '🦸', '🌻'];

interface ParentDashboardScreenProps {
  navigation: any;
}

export function ParentDashboardScreen({ navigation }: ParentDashboardScreenProps) {
  const user = useStore((s) => s.user);
  const childProfiles = useStore((s) => s.childProfiles);
  const setChildProfiles = useStore((s) => s.setChildProfiles);
  const addChildProfile = useStore((s) => s.addChildProfile);
  const removeChildProfile = useStore((s) => s.removeChildProfile);

  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<ChildAgeGroup>('ages_8_12');
  const [newChildAvatar, setNewChildAvatar] = useState('🧒');
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, ChildProgressSummary>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; displayName: string; avatarEmoji: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  useEffect(() => {
    logScreenView('ParentDashboard');
    loadProfiles();
  }, []);

  const loadProfiles = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const profiles = await getChildProfiles(user.id);
    setChildProfiles(profiles);

    const progress: Record<string, ChildProgressSummary> = {};
    for (const profile of profiles) {
      const summary = await getChildProgressSummary(profile.id);
      if (summary) progress[profile.id] = summary;
    }
    setProgressData(progress);
    setIsLoading(false);
  }, [user, setChildProfiles]);

  async function handleAddChild() {
    if (!user) return;
    if (!newChildName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for the child profile.');
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = await createChildProfile(
        user.id,
        newChildName.trim(),
        newChildAge,
        newChildAvatar,
      );
      addChildProfile(profile);
      setNewChildName('');
      setNewChildAge('ages_8_12');
      setNewChildAvatar('🧒');
      setShowAddForm(false);
    } catch (error: any) {
      Alert.alert('Error', error?.message ?? 'Could not create child profile.');
    }
    setIsSubmitting(false);
  }

  async function handleDeleteChild(child: ChildProfile) {
    Alert.alert(
      'Remove Profile',
      `Remove ${child.displayName}'s profile? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteChildProfile(child.id);
            removeChildProfile(child.id);
            if (selectedChild === child.id) setSelectedChild(null);
          },
        },
      ],
    );
  }

  async function handleTogglePersona(child: ChildProfile, personaId: PersonaId) {
    const current = child.contentFilter.allowedPersonas;
    const updated = current.includes(personaId)
      ? current.filter((p) => p !== personaId)
      : [...current, personaId];

    const newFilter = { ...child.contentFilter, allowedPersonas: updated };
    await updateContentFilter(child.id, newFilter);
    useStore.getState().updateChildProfileInStore(child.id, { contentFilter: newFilter });
  }

  async function handleToggleEscalation(child: ChildProfile) {
    const newFilter = {
      ...child.contentFilter,
      allowEscalationGauntlet: !child.contentFilter.allowEscalationGauntlet,
    };
    await updateContentFilter(child.id, newFilter);
    useStore.getState().updateChildProfileInStore(child.id, { contentFilter: newFilter });
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchUsersByNameOrPhone(searchQuery.trim());
    setSearchResults(results);
    setIsSearching(false);
  }

  async function handleEditParentProfile() {
    if (!user || !editName.trim()) return;
    const { updateUserProfile } = require('@/services/auth');
    await updateUserProfile(user.id, { displayName: editName.trim() });
    useStore.getState().setUser({ ...user, displayName: editName.trim() });
    setShowEditProfile(false);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profiles...</Text>
      </View>
    );
  }

  const selectedProfile = childProfiles.find((c) => c.id === selectedChild);
  const selectedProgress = selectedChild ? progressData[selectedChild] : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
      </View>

      <Text style={styles.subtitle}>
        Manage up to {PARENT_KID_CONFIG.MAX_CHILDREN} child profiles with age-appropriate training
      </Text>

      {/* Child Profile Cards */}
      <View style={styles.profilesRow}>
        {childProfiles.map((child) => (
          <TouchableOpacity
            key={child.id}
            style={[
              styles.profileChip,
              selectedChild === child.id && styles.profileChipSelected,
            ]}
            onPress={() => setSelectedChild(selectedChild === child.id ? null : child.id)}
          >
            <Text style={styles.profileAvatar}>{child.avatarEmoji}</Text>
            <Text
              style={[
                styles.profileChipName,
                selectedChild === child.id && styles.profileChipNameSelected,
              ]}
            >
              {child.displayName}
            </Text>
            <Text style={styles.profileChipAge}>{getAgeGroupLabel(child.ageGroup)}</Text>
          </TouchableOpacity>
        ))}

        {childProfiles.length < PARENT_KID_CONFIG.MAX_CHILDREN && (
          <TouchableOpacity
            style={styles.addChip}
            onPress={() => setShowAddForm(!showAddForm)}
          >
            <Icon name="plus" size={20} color={colors.primary} />
            <Text style={styles.addChipText}>Add Child</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Feature Hub */}
      <View style={styles.featureHub}>
        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('FamilyExercises')}
        >
          <View style={[styles.featureIconBg, { backgroundColor: '#7B68EE20' }]}>
            <Icon name="handshake" size={24} color="#7B68EE" />
          </View>
          <Text style={styles.featureLabel}>Exercises</Text>
          <Text style={styles.featureDesc}>Practice together</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => {
            if (selectedProfile) {
              navigation.navigate('SafeSpace', { childProfile: selectedProfile });
            } else if (childProfiles.length > 0) {
              navigation.navigate('SafeSpace', { childProfile: childProfiles[0] });
            } else {
              Alert.alert('Add a child profile first');
            }
          }}
        >
          <View style={[styles.featureIconBg, { backgroundColor: '#2EA04320' }]}>
            <Icon name="shield-heart-outline" size={24} color="#2EA043" />
          </View>
          <Text style={styles.featureLabel}>Safe Space</Text>
          <Text style={styles.featureDesc}>Talk without fear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.featureCard}
          onPress={() => navigation.navigate('FamilyBoard')}
        >
          <View style={[styles.featureIconBg, { backgroundColor: '#FF8C4220' }]}>
            <Icon name="forum-outline" size={24} color="#FF8C42" />
          </View>
          <Text style={styles.featureLabel}>Board</Text>
          <Text style={styles.featureDesc}>Family community</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Parent Profile */}
      <TouchableOpacity
        style={styles.editProfileRow}
        onPress={() => {
          setEditName(user?.displayName ?? '');
          setEditAvatar('');
          setShowEditProfile(!showEditProfile);
        }}
      >
        <Icon name="account-edit-outline" size={18} color={colors.primaryLight} />
        <Text style={styles.editProfileText}>Edit your profile name & avatar</Text>
      </TouchableOpacity>

      {showEditProfile && (
        <Card style={styles.addForm} variant="elevated">
          <Text style={styles.formTitle}>Your Profile</Text>
          <Text style={styles.fieldLabel}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            maxLength={30}
          />
          <Text style={styles.fieldLabel}>Avatar</Text>
          <View style={styles.avatarRow}>
            {PARENT_AVATAR_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.avatarOption,
                  editAvatar === emoji && styles.avatarOptionSelected,
                ]}
                onPress={() => setEditAvatar(emoji)}
              >
                <Text style={styles.avatarOptionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.formActions}>
            <Button title="Cancel" onPress={() => setShowEditProfile(false)} variant="outline" size="sm" />
            <Button title="Save" onPress={handleEditParentProfile} variant="accent" size="sm" disabled={!editName.trim()} />
          </View>
        </Card>
      )}

      {/* Search & Add Family Member */}
      <TouchableOpacity
        style={styles.editProfileRow}
        onPress={() => setShowSearch(!showSearch)}
      >
        <Icon name="account-search-outline" size={18} color={colors.primaryLight} />
        <Text style={styles.editProfileText}>Find family member by name or phone</Text>
      </TouchableOpacity>

      {showSearch && (
        <Card style={styles.addForm} variant="elevated">
          <Text style={styles.formTitle}>Find Family Member</Text>
          <Text style={styles.fieldLabel}>Search by name or phone number</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Name or phone number..."
              placeholderTextColor={colors.textMuted}
              maxLength={40}
            />
            <Button
              title={isSearching ? '...' : 'Search'}
              onPress={handleSearch}
              variant="primary"
              size="sm"
              disabled={isSearching || !searchQuery.trim()}
            />
          </View>
          {searchResults.length > 0 && (
            <View style={styles.searchResults}>
              {searchResults.map((result) => (
                <TouchableOpacity key={result.id} style={styles.searchResultItem}>
                  <Text style={styles.searchResultAvatar}>{result.avatarEmoji}</Text>
                  <Text style={styles.searchResultName}>{result.displayName}</Text>
                  <Button title="Add" onPress={() => {
                    Alert.alert('Invite Sent', `An invite has been sent to ${result.displayName}.`);
                  }} variant="outline" size="sm" />
                </TouchableOpacity>
              ))}
            </View>
          )}
          {searchResults.length === 0 && searchQuery.trim() && !isSearching && (
            <Text style={styles.noResults}>No users found. They may need to create an account first.</Text>
          )}
        </Card>
      )}

      {/* Add Child Form */}
      {showAddForm && (
        <Card style={styles.addForm} variant="elevated">
          <Text style={styles.formTitle}>New Child Profile</Text>

          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={newChildName}
            onChangeText={setNewChildName}
            placeholder="Child's name"
            placeholderTextColor={colors.textMuted}
            maxLength={20}
          />

          <Text style={styles.fieldLabel}>Age Group</Text>
          <View style={styles.ageRow}>
            <TouchableOpacity
              style={[styles.ageOption, newChildAge === 'ages_8_12' && styles.ageOptionSelected]}
              onPress={() => setNewChildAge('ages_8_12')}
            >
              <Text
                style={[
                  styles.ageOptionText,
                  newChildAge === 'ages_8_12' && styles.ageOptionTextSelected,
                ]}
              >
                Ages 8–12
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ageOption, newChildAge === 'ages_13_17' && styles.ageOptionSelected]}
              onPress={() => setNewChildAge('ages_13_17')}
            >
              <Text
                style={[
                  styles.ageOptionText,
                  newChildAge === 'ages_13_17' && styles.ageOptionTextSelected,
                ]}
              >
                Ages 13–17
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>Avatar</Text>
          <View style={styles.avatarRow}>
            {AVATAR_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.avatarOption,
                  newChildAvatar === emoji && styles.avatarOptionSelected,
                ]}
                onPress={() => setNewChildAvatar(emoji)}
              >
                <Text style={styles.avatarOptionText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formActions}>
            <Button
              title="Cancel"
              onPress={() => setShowAddForm(false)}
              variant="outline"
              size="sm"
            />
            <Button
              title={isSubmitting ? 'Creating...' : 'Create Profile'}
              onPress={handleAddChild}
              variant="accent"
              size="sm"
              disabled={isSubmitting || !newChildName.trim()}
            />
          </View>
        </Card>
      )}

      {/* Selected Child Detail */}
      {selectedProfile && (
        <>
          <Card style={styles.detailCard} variant="elevated">
            <View style={styles.detailHeader}>
              <Text style={styles.detailAvatar}>{selectedProfile.avatarEmoji}</Text>
              <View style={styles.detailInfo}>
                <Text style={styles.detailName}>{selectedProfile.displayName}</Text>
                <Text style={styles.detailAge}>
                  {getAgeGroupLabel(selectedProfile.ageGroup)} · {selectedProfile.beltLevel} belt
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDeleteChild(selectedProfile)}>
                <Icon name="trash-can-outline" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedProfile.totalSessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedProfile.currentStreak}</Text>
                <Text style={styles.statLabel}>Streak</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {selectedProgress?.weeklySessionCount ?? 0}
                </Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{selectedProgress?.topSkillElo ?? 0}</Text>
                <Text style={styles.statLabel}>Top ELO</Text>
              </View>
            </View>
          </Card>

          {/* Content Filters */}
          <Text style={styles.sectionTitle}>Content Filters</Text>
          <Card style={styles.filterCard}>
            <View style={styles.filterRow}>
              <View style={styles.filterInfo}>
                <Icon name="fire" size={18} color={colors.warning} />
                <Text style={styles.filterLabel}>Escalation Gauntlet</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.togglePill,
                  selectedProfile.contentFilter.allowEscalationGauntlet && styles.togglePillOn,
                ]}
                onPress={() => handleToggleEscalation(selectedProfile)}
              >
                <Text style={styles.togglePillText}>
                  {selectedProfile.contentFilter.allowEscalationGauntlet ? 'ON' : 'OFF'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.filterSectionLabel}>Allowed Sparring Personas</Text>
            <View style={styles.personaGrid}>
              {SPARRING_PERSONAS.map((persona) => {
                const isAllowed = selectedProfile.contentFilter.allowedPersonas.includes(
                  persona.id,
                );
                return (
                  <TouchableOpacity
                    key={persona.id}
                    style={[styles.personaChip, isAllowed && styles.personaChipOn]}
                    onPress={() => handleTogglePersona(selectedProfile, persona.id)}
                  >
                    <Text style={styles.personaChipEmoji}>{persona.avatar}</Text>
                    <Text
                      style={[styles.personaChipText, isAllowed && styles.personaChipTextOn]}
                    >
                      {persona.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Recent Activity */}
          {selectedProgress && selectedProgress.recentActivity.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Card>
                {selectedProgress.recentActivity.map((entry, i) => (
                  <View key={i}>
                    {i > 0 && <View style={styles.divider} />}
                    <View style={styles.activityRow}>
                      <View>
                        <Text style={styles.activityMode}>{entry.mode}</Text>
                        <Text style={styles.activityDate}>
                          {new Date(entry.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.activityRight}>
                        {entry.score != null && (
                          <Text style={styles.activityScore}>{entry.score}/100</Text>
                        )}
                        <Text style={styles.activityDuration}>{entry.duration}m</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </Card>
            </>
          )}
        </>
      )}

      {childProfiles.length === 0 && !showAddForm && (
        <Card style={styles.emptyCard} variant="elevated">
          <Text style={styles.emptyEmoji}>👨‍👧‍👦</Text>
          <Text style={styles.emptyTitle}>No child profiles yet</Text>
          <Text style={styles.emptyBody}>
            Add a child profile to get started with age-appropriate communication training.
          </Text>
          <Button
            title="Add First Child"
            onPress={() => setShowAddForm(true)}
            variant="accent"
            size="md"
            style={{ marginTop: spacing.md }}
          />
        </Card>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
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
  profilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  profileChip: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  profileAvatar: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  profileChipName: {
    ...typography.label,
    color: colors.text,
  },
  profileChipNameSelected: {
    color: colors.primaryLight,
  },
  profileChipAge: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  addChip: {
    backgroundColor: 'transparent',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    gap: spacing.xs,
  },
  addChipText: {
    ...typography.caption,
    color: colors.primary,
  },
  addForm: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ageOption: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  ageOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  ageOptionText: {
    ...typography.label,
    color: colors.textSecondary,
  },
  ageOptionTextSelected: {
    color: colors.primaryLight,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  avatarOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  avatarOptionText: {
    fontSize: 22,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  detailCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  detailAvatar: {
    fontSize: 40,
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    ...typography.h2,
    color: colors.text,
  },
  detailAge: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  filterCard: {
    padding: spacing.md,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  filterLabel: {
    ...typography.body,
    color: colors.text,
  },
  togglePill: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  togglePillOn: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success,
  },
  togglePillText: {
    ...typography.caption,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  filterSectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  personaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    opacity: 0.5,
  },
  personaChipOn: {
    borderColor: colors.primaryLight,
    opacity: 1,
  },
  personaChipEmoji: {
    fontSize: 14,
  },
  personaChipText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  personaChipTextOn: {
    color: colors.text,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  activityMode: {
    ...typography.body,
    color: colors.text,
    textTransform: 'capitalize',
  },
  activityDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityScore: {
    ...typography.label,
    color: colors.accent,
  },
  activityDuration: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.text,
  },
  emptyBody: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  featureHub: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  featureLabel: {
    ...typography.label,
    color: colors.text,
    textAlign: 'center',
  },
  featureDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 10,
    marginTop: 2,
  },
  editProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  editProfileText: {
    ...typography.bodySmall,
    color: colors.primaryLight,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-end',
  },
  searchResults: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchResultAvatar: {
    fontSize: 24,
  },
  searchResultName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  noResults: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
