import { firestore, COLLECTIONS } from '@/config/firebase';
import {
  FamilyBoardPost,
  FamilyBoardReply,
  BoardCategory,
} from '@/models/types';

export async function createPost(
  authorId: string,
  authorName: string,
  authorRole: 'parent' | 'teen',
  title: string,
  body: string,
  category: BoardCategory,
  tags: string[],
): Promise<FamilyBoardPost> {
  const docRef = firestore().collection(COLLECTIONS.FAMILY_BOARD_POSTS).doc();

  const post: FamilyBoardPost = {
    id: docRef.id,
    authorId,
    authorName,
    authorRole,
    title,
    body,
    category,
    tags,
    likeCount: 0,
    replyCount: 0,
    createdAt: new Date().toISOString(),
    isPinned: false,
  };

  await docRef.set(post);
  return post;
}

export async function fetchPosts(
  category?: BoardCategory,
  limit = 20,
  startAfter?: string,
): Promise<FamilyBoardPost[]> {
  let query = firestore()
    .collection(COLLECTIONS.FAMILY_BOARD_POSTS)
    .orderBy('createdAt', 'desc')
    .limit(limit);

  if (category) {
    query = query.where('category', '==', category);
  }

  if (startAfter) {
    const startDoc = await firestore()
      .collection(COLLECTIONS.FAMILY_BOARD_POSTS)
      .doc(startAfter)
      .get();
    if (startDoc.exists) {
      query = query.startAfter(startDoc);
    }
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data() as FamilyBoardPost);
}

export async function fetchReplies(postId: string): Promise<FamilyBoardReply[]> {
  const snapshot = await firestore()
    .collection(COLLECTIONS.FAMILY_BOARD_REPLIES)
    .where('postId', '==', postId)
    .orderBy('createdAt', 'asc')
    .get();

  return snapshot.docs.map((doc) => doc.data() as FamilyBoardReply);
}

export async function createReply(
  postId: string,
  authorId: string,
  authorName: string,
  authorRole: 'parent' | 'teen',
  body: string,
): Promise<FamilyBoardReply> {
  const docRef = firestore().collection(COLLECTIONS.FAMILY_BOARD_REPLIES).doc();

  const reply: FamilyBoardReply = {
    id: docRef.id,
    postId,
    authorId,
    authorName,
    authorRole,
    body,
    likeCount: 0,
    createdAt: new Date().toISOString(),
  };

  await docRef.set(reply);

  await firestore()
    .collection(COLLECTIONS.FAMILY_BOARD_POSTS)
    .doc(postId)
    .update({
      replyCount: firestore.FieldValue.increment(1),
    });

  return reply;
}

export async function likePost(postId: string): Promise<void> {
  await firestore()
    .collection(COLLECTIONS.FAMILY_BOARD_POSTS)
    .doc(postId)
    .update({
      likeCount: firestore.FieldValue.increment(1),
    });
}

export async function deletePost(postId: string): Promise<void> {
  const repliesSnapshot = await firestore()
    .collection(COLLECTIONS.FAMILY_BOARD_REPLIES)
    .where('postId', '==', postId)
    .get();

  const batch = firestore().batch();
  repliesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(firestore().collection(COLLECTIONS.FAMILY_BOARD_POSTS).doc(postId));
  await batch.commit();
}

export const BOARD_CATEGORIES: { id: BoardCategory; label: string; icon: string }[] = [
  { id: 'what_worked', label: 'What Worked', icon: 'lightbulb-outline' },
  { id: 'ask_families', label: 'Ask Families', icon: 'help-circle-outline' },
  { id: 'wins', label: 'Family Wins', icon: 'trophy-outline' },
  { id: 'exercise_share', label: 'Exercise Tips', icon: 'dumbbell' },
  { id: 'teen_corner', label: 'Teen Corner', icon: 'account-group-outline' },
];
