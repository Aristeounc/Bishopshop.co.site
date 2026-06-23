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
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import {
  createPost,
  fetchPosts,
  fetchReplies,
  createReply,
  likePost,
  BOARD_CATEGORIES,
} from '@/services/familyBoard';
import { logScreenView } from '@/services/analytics';
import { FamilyBoardPost, FamilyBoardReply, BoardCategory } from '@/models/types';

interface FamilyBoardScreenProps {
  navigation: any;
}

export function FamilyBoardScreen({ navigation }: FamilyBoardScreenProps) {
  const user = useStore((s) => s.user);
  const [posts, setPosts] = useState<FamilyBoardPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<BoardCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, FamilyBoardReply[]>>({});
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<BoardCategory>('what_worked');
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    logScreenView('FamilyBoard');
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    const result = await fetchPosts(selectedCategory ?? undefined);
    setPosts(result);
    setIsLoading(false);
  }, [selectedCategory]);

  async function handleCreatePost() {
    if (!user || !newPostTitle.trim() || !newPostBody.trim()) {
      Alert.alert('Required', 'Please enter a title and message.');
      return;
    }
    setIsSubmitting(true);
    const post = await createPost(
      user.id,
      user.displayName,
      'parent',
      newPostTitle.trim(),
      newPostBody.trim(),
      newPostCategory,
      [],
    );
    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostBody('');
    setShowNewPost(false);
    setIsSubmitting(false);
  }

  async function handleExpandPost(postId: string) {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    if (!replies[postId]) {
      const postReplies = await fetchReplies(postId);
      setReplies({ ...replies, [postId]: postReplies });
    }
  }

  async function handleReply(postId: string) {
    if (!user || !replyText.trim()) return;
    setIsSubmitting(true);
    const reply = await createReply(postId, user.id, user.displayName, 'parent', replyText.trim());
    setReplies({
      ...replies,
      [postId]: [...(replies[postId] ?? []), reply],
    });
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, replyCount: p.replyCount + 1 } : p)),
    );
    setReplyText('');
    setIsSubmitting(false);
  }

  async function handleLike(postId: string) {
    await likePost(postId);
    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p)),
    );
  }

  function getCategoryInfo(id: BoardCategory) {
    return BOARD_CATEGORIES.find((c) => c.id === id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Family Board</Text>
        <TouchableOpacity onPress={() => setShowNewPost(!showNewPost)}>
          <Icon name={showNewPost ? 'close' : 'plus-circle-outline'} size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Share what works, ask other families, celebrate wins together
      </Text>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity
          style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {BOARD_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
          >
            <Icon
              name={cat.icon}
              size={14}
              color={selectedCategory === cat.id ? colors.textOnPrimary : colors.textSecondary}
            />
            <Text
              style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* New Post Form */}
      {showNewPost && (
        <Card style={styles.newPostCard} variant="elevated">
          <Text style={styles.formLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catSelectRow}>
            {BOARD_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catSelectChip, newPostCategory === cat.id && styles.catSelectChipActive]}
                onPress={() => setNewPostCategory(cat.id)}
              >
                <Text
                  style={[styles.catSelectText, newPostCategory === cat.id && styles.catSelectTextActive]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.formLabel}>Title</Text>
          <TextInput
            style={styles.input}
            value={newPostTitle}
            onChangeText={setNewPostTitle}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />
          <Text style={styles.formLabel}>Message</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={newPostBody}
            onChangeText={setNewPostBody}
            placeholder="Share your experience, tip, or question..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <View style={styles.formActions}>
            <Button title="Cancel" onPress={() => setShowNewPost(false)} variant="outline" size="sm" />
            <Button
              title={isSubmitting ? 'Posting...' : 'Post'}
              onPress={handleCreatePost}
              variant="accent"
              size="sm"
              disabled={isSubmitting || !newPostTitle.trim()}
            />
          </View>
        </Card>
      )}

      {/* Posts List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : posts.length === 0 ? (
        <Card style={styles.emptyCard} variant="elevated">
          <Text style={styles.emptyEmoji}>💬</Text>
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyBody}>Be the first to share what's working for your family.</Text>
        </Card>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.postsList}
          renderItem={({ item: post }) => {
            const catInfo = getCategoryInfo(post.category);
            const isExpanded = expandedPostId === post.id;

            return (
              <Card style={styles.postCard}>
                <TouchableOpacity onPress={() => handleExpandPost(post.id)}>
                  <View style={styles.postHeader}>
                    <View style={styles.postMeta}>
                      <View style={styles.authorBadge}>
                        <Text style={styles.authorRole}>
                          {post.authorRole === 'parent' ? '👤' : '🧒'} {post.authorName}
                        </Text>
                      </View>
                      {catInfo && (
                        <View style={styles.postCatBadge}>
                          <Text style={styles.postCatText}>{catInfo.label}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.postDate}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postBody} numberOfLines={isExpanded ? undefined : 3}>
                    {post.body}
                  </Text>

                  <View style={styles.postActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                      <Icon name="heart-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.actionText}>{post.likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => handleExpandPost(post.id)}>
                      <Icon name="comment-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.actionText}>{post.replyCount}</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Expanded Replies */}
                {isExpanded && (
                  <View style={styles.repliesSection}>
                    <View style={styles.replyDivider} />
                    {(replies[post.id] ?? []).map((reply) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Text style={styles.replyAuthor}>
                          {reply.authorRole === 'parent' ? '👤' : '🧒'} {reply.authorName}
                        </Text>
                        <Text style={styles.replyBody}>{reply.body}</Text>
                        <Text style={styles.replyDate}>
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.replyInputRow}>
                      <TextInput
                        style={styles.replyInput}
                        value={replyText}
                        onChangeText={setReplyText}
                        placeholder="Reply..."
                        placeholderTextColor={colors.textMuted}
                        maxLength={500}
                      />
                      <TouchableOpacity
                        onPress={() => handleReply(post.id)}
                        disabled={!replyText.trim() || isSubmitting}
                      >
                        <Icon
                          name="send"
                          size={20}
                          color={replyText.trim() ? colors.primary : colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.md,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    maxHeight: 40,
    marginBottom: spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.textOnPrimary,
  },
  newPostCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  formLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.sm,
  },
  catSelectRow: {
    maxHeight: 32,
  },
  catSelectChip: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catSelectChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  catSelectText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  catSelectTextActive: {
    color: colors.accent,
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
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  emptyCard: {
    margin: spacing.lg,
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
  postsList: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  postCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  authorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorRole: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  postCatBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  postCatText: {
    ...typography.caption,
    color: colors.primaryLight,
    fontSize: 10,
  },
  postDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  postTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  postBody: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  postActions: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  repliesSection: {
    marginTop: spacing.sm,
  },
  replyDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  replyItem: {
    paddingLeft: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary + '40',
    paddingVertical: spacing.xs,
  },
  replyAuthor: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  replyBody: {
    ...typography.bodySmall,
    color: colors.text,
  },
  replyDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  replyInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
