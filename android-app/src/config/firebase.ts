import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

export { auth, firestore, messaging, analytics };

export function getFirebaseApp() {
  return firebase.app();
}

export const COLLECTIONS = {
  USERS: 'users',
  SKILL_PROGRESS: 'skillProgress',
  SESSIONS: 'sessions',
  BADGES: 'badges',
  DAILY_PROGRAMS: 'dailyPrograms',
  NOTIFICATIONS: 'notifications',
  CHILD_PROFILES: 'childProfiles',
  FAMILY_BOARD_POSTS: 'familyBoardPosts',
  FAMILY_BOARD_REPLIES: 'familyBoardReplies',
  SAFE_SPACE_THREADS: 'safeSpaceThreads',
  SAFE_SPACE_MESSAGES: 'safeSpaceMessages',
  FAMILY_EXERCISE_SESSIONS: 'familyExerciseSessions',
} as const;
