jest.mock('react-native', () => ({
  Platform: { OS: 'android', Version: 33 },
  StyleSheet: { create: (styles: any) => styles },
  Alert: { alert: jest.fn() },
  LogBox: { ignoreLogs: jest.fn() },
  PermissionsAndroid: {
    request: jest.fn().mockResolvedValue('granted'),
    PERMISSIONS: { POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS' },
    RESULTS: { GRANTED: 'granted' },
  },
  StatusBar: {},
  AppRegistry: { registerComponent: jest.fn() },
}));

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: { app: jest.fn() },
}));

jest.mock('@react-native-firebase/auth', () => {
  const mockAuth = jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }));
  return { __esModule: true, default: mockAuth };
});

jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
        update: jest.fn(),
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({ set: jest.fn(), get: jest.fn(), update: jest.fn() })),
          get: jest.fn(),
          orderBy: jest.fn(() => ({ limit: jest.fn(() => ({ get: jest.fn() })) })),
        })),
      })),
    })),
    batch: jest.fn(() => ({ set: jest.fn(), commit: jest.fn() })),
    collectionGroup: jest.fn(() => ({
      where: jest.fn(() => ({ get: jest.fn().mockResolvedValue({ size: 0 }) })),
    })),
  }));
  return { __esModule: true, default: mockFirestore };
});

jest.mock('@react-native-firebase/messaging', () => {
  const mockMessaging = jest.fn(() => ({
    requestPermission: jest.fn().mockResolvedValue(1),
    getToken: jest.fn().mockResolvedValue('mock-token'),
    onTokenRefresh: jest.fn(),
    onMessage: jest.fn(),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
  }));
  (mockMessaging as any).AuthorizationStatus = { AUTHORIZED: 1, PROVISIONAL: 2 };
  return { __esModule: true, default: mockMessaging };
});

jest.mock('@react-native-firebase/analytics', () => {
  const mockAnalytics = jest.fn(() => ({
    logScreenView: jest.fn(),
    logEvent: jest.fn(),
    setUserProperty: jest.fn(),
  }));
  return { __esModule: true, default: mockAnalytics };
});

jest.mock('react-native-iap', () => ({
  initConnection: jest.fn().mockResolvedValue(true),
  getSubscriptions: jest.fn().mockResolvedValue([]),
  requestSubscription: jest.fn(),
  finishTransaction: jest.fn(),
  purchaseUpdatedListener: jest.fn(() => ({ remove: jest.fn() })),
  purchaseErrorListener: jest.fn(() => ({ remove: jest.fn() })),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Circle: 'Circle',
}));
jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('react-native-reanimated', () => ({}));
jest.mock('react-native-screens', () => ({}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: any) => children,
}));
jest.mock('react-native-haptic-feedback', () => ({
  trigger: jest.fn(),
}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
