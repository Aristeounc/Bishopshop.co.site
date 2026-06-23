import {
  initConnection,
  getSubscriptions,
  requestSubscription,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  type Subscription,
  type SubscriptionPurchase,
  type PurchaseError,
} from 'react-native-iap';
import { firestore, COLLECTIONS } from '@/config/firebase';
import { BILLING_PRODUCTS } from '@/utils/constants';
import { BillingProduct, PurchaseResult, SubscriptionTier } from '@/models/types';

const SUBSCRIPTION_SKUS = [
  BILLING_PRODUCTS.CORE_GYM_MONTHLY,
  BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY,
  BILLING_PRODUCTS.ARTICULATION_ADDON,
  BILLING_PRODUCTS.INTROPROFILES_ADDON,
  BILLING_PRODUCTS.PARENT_KID_ADDON,
];

export async function initializeBilling(): Promise<boolean> {
  try {
    await initConnection();
    return true;
  } catch {
    return false;
  }
}

export async function fetchProducts(): Promise<BillingProduct[]> {
  try {
    const subscriptions: Subscription[] = await getSubscriptions({ skus: SUBSCRIPTION_SKUS });

    return subscriptions.map((sub) => ({
      productId: sub.productId,
      title: sub.title,
      description: sub.description,
      price: sub.localizedPrice ?? '',
      currency: sub.currency ?? 'USD',
      type: 'subscription' as const,
      subscriptionPeriod: sub.subscriptionPeriodAndroid ?? 'P1M',
    }));
  } catch {
    return [];
  }
}

export async function purchaseSubscription(productId: string): Promise<PurchaseResult> {
  try {
    await requestSubscription({ sku: productId });
    return { success: true, productId };
  } catch (error: any) {
    return {
      success: false,
      productId,
      error: error?.message ?? 'Purchase failed',
    };
  }
}

export function setupPurchaseListeners(
  onSuccess: (purchase: SubscriptionPurchase) => void,
  onError: (error: PurchaseError) => void,
) {
  const purchaseListener = purchaseUpdatedListener(async (purchase) => {
    if (purchase.transactionReceipt) {
      await finishTransaction({ purchase, isConsumable: false });
      onSuccess(purchase as SubscriptionPurchase);
    }
  });

  const errorListener = purchaseErrorListener((error) => {
    onError(error);
  });

  return () => {
    purchaseListener.remove();
    errorListener.remove();
  };
}

export async function verifyAndActivateSubscription(
  userId: string,
  productId: string,
  transactionId: string,
): Promise<SubscriptionTier> {
  const tier = mapProductToTier(productId);

  await firestore().collection(COLLECTIONS.USERS).doc(userId).update({
    subscription: tier,
    subscriptionExpiresAt: getExpirationDate(),
    lastPurchaseId: transactionId,
    lastPurchaseProductId: productId,
    lastPurchaseAt: new Date().toISOString(),
  });

  return tier;
}

export async function checkSubscriptionStatus(userId: string): Promise<{
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
}> {
  const doc = await firestore().collection(COLLECTIONS.USERS).doc(userId).get();
  const data = doc.data();

  if (!data) return { tier: 'free_trial', isActive: false };

  const expiresAt = data.subscriptionExpiresAt;
  const isActive = expiresAt ? new Date(expiresAt) > new Date() : false;

  return {
    tier: isActive ? data.subscription : 'free_trial',
    isActive,
    expiresAt,
  };
}

function mapProductToTier(productId: string): SubscriptionTier {
  switch (productId) {
    case BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY:
      return 'full_bundle';
    case BILLING_PRODUCTS.CORE_GYM_MONTHLY:
    default:
      return 'core_gym';
  }
}

function getExpirationDate(): string {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString();
}

export function getProductDisplayInfo(productId: string): {
  name: string;
  features: string[];
  recommended: boolean;
} {
  switch (productId) {
    case BILLING_PRODUCTS.CORE_GYM_MONTHLY:
      return {
        name: 'Core Gym',
        features: [
          'Daily training program',
          'All 6 sparring personas',
          '8 ELO skill tracks',
          '6 belt progression levels',
          'Coach vector memory',
          '33+ concept corpus',
        ],
        recommended: false,
      };
    case BILLING_PRODUCTS.FULL_BUNDLE_MONTHLY:
      return {
        name: 'Full Bundle',
        features: [
          'Everything in Core Gym',
          'Articulation Training (3 intensities)',
          'IntroProfiles',
          'Gifted access support',
          'Priority coach feedback',
          'Full admin dashboard',
        ],
        recommended: true,
      };
    case BILLING_PRODUCTS.ARTICULATION_ADDON:
      return {
        name: 'Articulation Add-on',
        features: [
          'Gentle, Standard, Intensive modes',
          'Real-time articulation scoring',
          'Pronunciation feedback',
        ],
        recommended: false,
      };
    case BILLING_PRODUCTS.INTROPROFILES_ADDON:
      return {
        name: 'IntroProfiles Add-on',
        features: [
          'Context-specific introductions',
          'Scenario-matched profiles',
          'Custom intro generation',
        ],
        recommended: false,
      };
    case BILLING_PRODUCTS.PARENT_KID_ADDON:
      return {
        name: 'Parent/Kid Add-on',
        features: [
          'Up to 4 child profiles (8-12 & 13-17)',
          '3 research-backed exercise modules',
          'Safe Space messaging (judgment-free zone)',
          'Family community message board',
          'Parent & kid/teen training tracks',
          'Content filters & persona controls',
        ],
        recommended: false,
      };
    default:
      return { name: 'Unknown', features: [], recommended: false };
  }
}
