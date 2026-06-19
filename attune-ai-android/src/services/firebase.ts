import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import { User, SkillProgress, SparringSession, NotificationData } from '@models/index';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'attune-ai.firebaseapp.com',
  projectId: process.env.FIREBASE_PROJECT_ID || 'attune-ai',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'attune-ai.appspot.com',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.FIREBASE_APP_ID || '',
};

// Initialize Firebase (automatically done by @react-native-firebase)
let firebaseApp: any;

export const initializeFirebase = async () => {
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    await setupMessaging();
    console.log('Firebase initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
};

// Authentication services
export const authService = {
  signUp: async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user?.updateProfile({ displayName });
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  getCurrentUser: () => auth().currentUser,

  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
  },

  resetPassword: async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
};

// Firestore user services
export const userService = {
  createUserProfile: async (userId: string, email: string, displayName: string) => {
    try {
      const userDoc: User = {
        id: userId,
        email,
        displayName,
        createdAt: Date.now(),
        subscriptionTier: 'free',
        subscriptionStatus: 'expired',
        preferences: {
          notifications: true,
          darkMode: true,
          reduceMotion: false,
        },
      };

      await firestore().collection('users').doc(userId).set(userDoc);
      return userDoc;
    } catch (error) {
      console.error('Create user profile error:', error);
      throw error;
    }
  },

  getUserProfile: async (userId: string): Promise<User | null> => {
    try {
      const doc = await firestore().collection('users').doc(userId).get();
      return doc.exists ? (doc.data() as User) : null;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    try {
      await firestore().collection('users').doc(userId).update(updates);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },

  updateSubscription: async (userId: string, tier: string, status: string) => {
    try {
      await firestore().collection('users').doc(userId).update({
        subscriptionTier: tier,
        subscriptionStatus: status,
      });
      await analytics().logEvent('subscription_change', {
        user_id: userId,
        tier,
        status,
      });
    } catch (error) {
      console.error('Update subscription error:', error);
      throw error;
    }
  },
};

// Skill progress services
export const skillService = {
  getSkillProgress: async (userId: string, trackId: string): Promise<SkillProgress | null> => {
    try {
      const doc = await firestore()
        .collection('users')
        .doc(userId)
        .collection('skills')
        .doc(trackId)
        .get();
      return doc.exists ? (doc.data() as SkillProgress) : null;
    } catch (error) {
      console.error('Get skill progress error:', error);
      throw error;
    }
  },

  getAllSkillsProgress: async (userId: string): Promise<SkillProgress[]> => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('skills')
        .get();
      return snapshot.docs.map((doc) => doc.data() as SkillProgress);
    } catch (error) {
      console.error('Get all skills progress error:', error);
      throw error;
    }
  },

  updateSkillProgress: async (
    userId: string,
    trackId: string,
    updates: Partial<SkillProgress>
  ) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('skills')
        .doc(trackId)
        .set(updates, { merge: true });
    } catch (error) {
      console.error('Update skill progress error:', error);
      throw error;
    }
  },
};

// Session services
export const sessionService = {
  saveSparringSession: async (userId: string, session: SparringSession) => {
    try {
      const docRef = await firestore()
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .add(session);
      return docRef.id;
    } catch (error) {
      console.error('Save sparring session error:', error);
      throw error;
    }
  },

  getSessions: async (userId: string, limit = 10) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .orderBy('startTime', 'desc')
        .limit(limit)
        .get();
      return snapshot.docs.map((doc) => doc.data() as SparringSession);
    } catch (error) {
      console.error('Get sessions error:', error);
      throw error;
    }
  },

  getSessionsByTrack: async (userId: string, trackId: string) => {
    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('sessions')
        .where('trackId', '==', trackId)
        .orderBy('startTime', 'desc')
        .get();
      return snapshot.docs.map((doc) => doc.data() as SparringSession);
    } catch (error) {
      console.error('Get sessions by track error:', error);
      throw error;
    }
  },
};

// Messaging setup
const setupMessaging = async () => {
  try {
    const granted = await messaging().requestPermission();
    if (granted) {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    }
  } catch (error) {
    console.error('Messaging setup error:', error);
  }
};

export const messagingService = {
  subscribeToNotifications: (
    userId: string,
    callback: (notification: NotificationData) => void
  ) => {
    return messaging().onMessage(async (remoteMessage) => {
      console.log('Notification received:', remoteMessage);
      const notification: NotificationData = {
        id: remoteMessage.messageId || Date.now().toString(),
        userId,
        type: (remoteMessage.data?.type as any) || 'news',
        title: remoteMessage.notification?.title || 'Attune AI',
        body: remoteMessage.notification?.body || '',
        createdAt: Date.now(),
        read: false,
        data: remoteMessage.data,
      };
      callback(notification);
    });
  },

  sendLocalNotification: async (title: string, body: string) => {
    // Note: Local notifications require react-native-notifee or similar
    console.log('Local notification:', { title, body });
  },
};

// Analytics services
export const analyticsService = {
  logEvent: async (eventName: string, params?: Record<string, any>) => {
    try {
      await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Log event error:', error);
    }
  },

  logScreenView: async (screenName: string) => {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenName,
      });
    } catch (error) {
      console.error('Log screen view error:', error);
    }
  },

  setUserProperties: async (userId: string, properties: Record<string, any>) => {
    try {
      await analytics().setUserId(userId);
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, String(value));
      }
    } catch (error) {
      console.error('Set user properties error:', error);
    }
  },
};
