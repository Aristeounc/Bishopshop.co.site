import { firestore, COLLECTIONS } from '@/config/firebase';
import {
  SafeSpaceThread,
  SafeSpaceMessage,
  SafeSpaceRules,
} from '@/models/types';

const DEFAULT_SAFE_SPACE_RULES: SafeSpaceRules = {
  noConsequencesMode: true,
  cooldownMinutes: 2,
  promptReflectionBeforeSend: true,
  aiMediationEnabled: true,
};

export async function getOrCreateThread(
  parentUserId: string,
  childProfileId: string,
  childDisplayName: string,
): Promise<SafeSpaceThread> {
  const existing = await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .where('parentUserId', '==', parentUserId)
    .where('childProfileId', '==', childProfileId)
    .limit(1)
    .get();

  if (!existing.empty) {
    return existing.docs[0].data() as SafeSpaceThread;
  }

  const docRef = firestore().collection(COLLECTIONS.SAFE_SPACE_THREADS).doc();

  const thread: SafeSpaceThread = {
    id: docRef.id,
    parentUserId,
    childProfileId,
    childDisplayName,
    lastMessageAt: new Date().toISOString(),
    lastMessagePreview: '',
    unreadParent: 0,
    unreadChild: 0,
    safeSpaceRules: { ...DEFAULT_SAFE_SPACE_RULES },
  };

  await docRef.set(thread);
  return thread;
}

export async function getThreadsForParent(parentUserId: string): Promise<SafeSpaceThread[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .where('parentUserId', '==', parentUserId)
    .orderBy('lastMessageAt', 'desc')
    .get();

  return snapshot.docs.map((doc) => doc.data() as SafeSpaceThread);
}

export async function sendMessage(
  threadId: string,
  senderId: string,
  senderRole: 'parent' | 'child',
  content: string,
  emotionTag?: string,
): Promise<SafeSpaceMessage> {
  const docRef = firestore().collection(COLLECTIONS.SAFE_SPACE_MESSAGES).doc();

  const message: SafeSpaceMessage = {
    id: docRef.id,
    threadId,
    senderId,
    senderRole,
    content,
    timestamp: new Date().toISOString(),
    emotionTag,
  };

  await docRef.set(message);

  const unreadField = senderRole === 'parent' ? 'unreadChild' : 'unreadParent';
  await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .doc(threadId)
    .update({
      lastMessageAt: message.timestamp,
      lastMessagePreview: content.substring(0, 80),
      [unreadField]: firestore.FieldValue.increment(1),
    });

  return message;
}

export async function getMessages(
  threadId: string,
  limit = 50,
): Promise<SafeSpaceMessage[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_MESSAGES)
    .where('threadId', '==', threadId)
    .orderBy('timestamp', 'asc')
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => doc.data() as SafeSpaceMessage);
}

export async function markRead(
  threadId: string,
  role: 'parent' | 'child',
): Promise<void> {
  const field = role === 'parent' ? 'unreadParent' : 'unreadChild';
  await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .doc(threadId)
    .update({ [field]: 0 });
}

export async function updateThreadRules(
  threadId: string,
  rules: Partial<SafeSpaceRules>,
): Promise<void> {
  const threadDoc = await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .doc(threadId)
    .get();

  if (!threadDoc.exists) return;

  const currentRules = (threadDoc.data() as SafeSpaceThread).safeSpaceRules;
  await firestore()
    .collection(COLLECTIONS.SAFE_SPACE_THREADS)
    .doc(threadId)
    .update({ safeSpaceRules: { ...currentRules, ...rules } });
}

export const EMOTION_TAGS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😤', label: 'Frustrated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '😞', label: 'Disappointed' },
  { emoji: '🥰', label: 'Grateful' },
  { emoji: '😶', label: 'Unsure' },
  { emoji: '💪', label: 'Brave' },
];

export const REFLECTION_PROMPTS = [
  'Before you send: how might they feel reading this?',
  'Is this the way you\'d want someone to say it to you?',
  'Take a breath. Are you expressing what you really mean?',
  'Is this about the issue, or are you venting frustration?',
  'What do you actually need them to understand?',
  'Would you say this out loud to their face? If not, revise.',
];

export function getRandomReflectionPrompt(): string {
  return REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
}
