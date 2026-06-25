import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { signOut, updateUserProfile } from '@/services/auth';
import { fetchProducts, purchaseSubscription, getProductDisplayInfo } from '@/services/billing';
import { logScreenView, logSubscriptionEvent } from '@/services/analytics';
import { BILLING_PRODUCTS } from '@/utils/constants';
import { BillingProduct } from '@/models/types';
import appJson from '../../app.json';

interface SettingsScreenProps {
  navigation: any;
}

export function SettingsScreen({ navigation }: SettingsScreenProps) {
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const setUser = useStore((s) => s.setUser);
  const [products, setProducts] = useState<BillingProduct[]>([]);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    logScreenView('Settings');
    loadProducts();
  }, []);

  async function loadProducts() {
    const result = await fetchProducts();
    setProducts(result);
  }

  async function handleToggleNotifications(value: boolean) {
    if (!user) return;
    const updated = {
      ...user,
      preferences: { ...user.preferences, notificationsEnabled: value },
    };
    setUser(updated);
    await updateUserProfile(user.id, { preferences: updated.preferences });
  }

  async function handleToggleHaptics(value: boolean) {
    if (!user) return;
    const updated = {
      ...user,
      preferences: { ...user.preferences, hapticFeedback: value },
    };
    setUser(updated);
    await updateUserProfile(user.id, { preferences: updated.preferences });
  }

  async function handlePurchase(productId: string) {
    logSubscriptionEvent('start_purchase', productId);
    const result = await purchaseSubscription(productId);
    if (result.success) {
      Alert.alert('Success', 'Your subscription is now active!');
      logSubscriptionEvent('purchase_success', productId);
    } else {
      Alert.alert('Purchase Failed', result.error ?? 'Please try again.');
      logSubscriptionEvent('purchase_fail', productId);
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          logout();
          navigation.replace('Login');
        },
      },
    ]);
  }

  const subscriptionLabel =
    user?.subscription === 'full_bundle'
      ? 'Full Bundle'
      : user?.subscription === 'core_gym'
        ? 'Core Gym'
        : 'Free Trial';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Card style={styles.profileCard} variant="elevated">
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0)?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.displayName ?? 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Subscription</Text>
      <Card style={styles.subscriptionCard}>
        <View style={styles.subRow}>
          <View>
            <Text style={styles.subTier}>{subscriptionLabel}</Text>
            <Text style={styles.subStatus}>
              {user?.subscription === 'free_trial' ? 'Upgrade to unlock all features' : 'Active'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowPlans(!showPlans);
              logSubscriptionEvent('view_plans');
            }}
          >
            <Text style={styles.manageSub}>{showPlans ? 'Hide Plans' : 'View Plans'}</Text>
          </TouchableOpacity>
        </View>

        {showPlans && (
          <View style={styles.plansContainer}>
            {[BILLING_PRODUCTS.CORE_GYM_MONTHLY, BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY].map(
              (productId) => {
                const info = getProductDisplayInfo(productId);
                const product = products.find((p) => p.productId === productId);
                return (
                  <Card key={productId} style={styles.planCard} variant="outlined">
                    <View style={styles.planHeader}>
                      <Text style={styles.planName}>{info.name}</Text>
                      {info.recommended && (
                        <View style={styles.recommendedBadge}>
                          <Text style={styles.recommendedText}>Most Popular</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.planPrice}>
                      {product?.price ?? (productId.includes('full') ? '$32' : '$9.99')}/mo
                    </Text>
                    {info.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <Icon name="check" size={14} color={colors.success} />
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                    <Button
                      title="Subscribe"
                      onPress={() => handlePurchase(productId)}
                      variant={info.recommended ? 'accent' : 'outline'}
                      size="sm"
                      style={{ marginTop: spacing.sm }}
                    />
                  </Card>
                );
              },
            )}
          </View>
        )}
      </Card>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <Card>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="bell-outline" size={20} color={colors.text} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={user?.preferences.notificationsEnabled ?? true}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Icon name="vibrate" size={20} color={colors.text} />
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
          </View>
          <Switch
            value={user?.preferences.hapticFeedback ?? true}
            onValueChange={handleToggleHaptics}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Account</Text>
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        variant="outline"
        size="md"
      />

      <Text style={styles.sectionTitle}>Legal</Text>
      <View style={styles.legalLinks}>
        <TouchableOpacity onPress={() => Linking.openURL('https://bishopshop.co.site/privacy.html')}>
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://bishopshop.co.site/terms.html')}>
          <Text style={styles.link}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Peitho v{appJson.version ?? '1.0.0'} (Android)</Text>
      <Text style={styles.legal}>Bishop Shop Enterprises LLC</Text>
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
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.textOnPrimary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...typography.h3,
    color: colors.text,
  },
  profileEmail: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  subscriptionCard: {
    padding: spacing.md,
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subTier: {
    ...typography.h3,
    color: colors.accent,
  },
  subStatus: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  manageSub: {
    ...typography.button,
    color: colors.primaryLight,
  },
  plansContainer: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  planCard: {
    padding: spacing.md,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  planName: {
    ...typography.h3,
    color: colors.text,
  },
  recommendedBadge: {
    backgroundColor: colors.accent + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  recommendedText: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 10,
  },
  planPrice: {
    ...typography.h2,
    color: colors.accent,
    marginBottom: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  featureText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  version: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  legal: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  link: {
    ...typography.body,
    color: colors.accent,
    textDecorationLine: 'underline',
  },
});
