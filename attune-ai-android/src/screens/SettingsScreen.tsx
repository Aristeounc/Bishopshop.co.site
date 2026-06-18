import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';
import { useAppStore } from '@stores/appStore';

const SettingsScreen = ({ navigation }: any) => {
  const { user, signOut } = useAppStore();
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(true);
  const [reduceMotion, setReduceMotion] = React.useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Profile */}
      <View style={styles.profileSection}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name="account-circle"
              size={64}
              color={Colors.secondary}
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
      </View>

      {/* Subscription */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.cardTitle}>Current Plan</Text>
              <Text style={styles.cardValue}>
                {user?.subscriptionTier === 'free' ? 'Free' : 'Premium'}
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {user?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeText}>
              {user?.subscriptionTier === 'free' ? 'Upgrade Now' : 'Manage'}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color={Colors.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <MaterialCommunityIcons name="bell" size={20} color={Colors.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDesc}>Push notifications for achievements</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: Colors.border, true: Colors.secondary }}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <MaterialCommunityIcons name="moon-waning-crescent" size={20} color={Colors.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Always enabled for Attune AI</Text>
            </View>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} disabled />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLabel}>
            <MaterialCommunityIcons name="animation" size={20} color={Colors.secondary} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Reduce Motion</Text>
              <Text style={styles.settingDesc}>Minimize animations and transitions</Text>
            </View>
          </View>
          <Switch
            value={reduceMotion}
            onValueChange={setReduceMotion}
            trackColor={{ false: Colors.border, true: Colors.secondary }}
          />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons name="lock" size={20} color={Colors.secondary} />
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuItemContent}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color={Colors.error} />
            <Text style={[styles.menuItemText, { color: Colors.error }]}>Delete Account</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <MaterialCommunityIcons name="open-in-new" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Terms of Service</Text>
          <MaterialCommunityIcons name="open-in-new" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Attune AI v0.1.0</Text>
          <Text style={styles.appCopyright}>© 2026 Bishop Shop Enterprises LLC</Text>
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={20} color={Colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
  profileSection: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  profileEmail: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cardValue: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.label,
    color: Colors.ink,
    fontWeight: '600',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  upgradeText: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '500',
  },
  settingDesc: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  menuItemText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  appVersion: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
  },
  appCopyright: {
    ...Typography.label,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  signOutText: {
    ...Typography.bodySmall,
    color: Colors.error,
    fontWeight: '600',
  },
});

export default SettingsScreen;
