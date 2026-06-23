import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { colors, typography, spacing, borderRadius, shadows } from '@/theme';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import {
  getOrCreateThread,
  getMessages,
  sendMessage,
  markRead,
  getRandomReflectionPrompt,
  EMOTION_TAGS,
} from '@/services/safeSpace';
import { logScreenView } from '@/services/analytics';
import { SafeSpaceMessage, SafeSpaceThread, ChildProfile } from '@/models/types';

interface SafeSpaceScreenProps {
  navigation: any;
  route: {
    params: {
      childProfile: ChildProfile;
    };
  };
}

export function SafeSpaceScreen({ navigation, route }: SafeSpaceScreenProps) {
  const { childProfile } = route.params;
  const user = useStore((s) => s.user);
  const [thread, setThread] = useState<SafeSpaceThread | null>(null);
  const [messages, setMessages] = useState<SafeSpaceMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionPrompt, setReflectionPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    logScreenView('SafeSpace');
    initThread();
  }, []);

  const initThread = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const t = await getOrCreateThread(user.id, childProfile.id, childProfile.displayName);
    setThread(t);
    const msgs = await getMessages(t.id);
    setMessages(msgs);
    await markRead(t.id, 'parent');
    setIsLoading(false);
  }, [user, childProfile]);

  async function handleSend() {
    if (!user || !thread || !inputText.trim()) return;

    if (thread.safeSpaceRules.promptReflectionBeforeSend && !showReflection) {
      setReflectionPrompt(getRandomReflectionPrompt());
      setShowReflection(true);
      return;
    }

    setIsSending(true);
    setShowReflection(false);

    const msg = await sendMessage(
      thread.id,
      user.id,
      'parent',
      inputText.trim(),
      selectedEmotion ?? undefined,
    );

    setMessages([...messages, msg]);
    setInputText('');
    setSelectedEmotion(null);
    setIsSending(false);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  function handleCancelReflection() {
    setShowReflection(false);
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerAvatar}>{childProfile.avatarEmoji}</Text>
          <View>
            <Text style={styles.headerName}>{childProfile.displayName}</Text>
            <Text style={styles.headerLabel}>Safe Space</Text>
          </View>
        </View>
        <Icon name="shield-check" size={20} color={colors.success} />
      </View>

      {/* Safe Space Banner */}
      <Card style={styles.safeBanner}>
        <View style={styles.bannerRow}>
          <Icon name="shield-heart-outline" size={18} color={colors.success} />
          <Text style={styles.bannerText}>
            This is a safe space. What's shared here stays here — no consequences, no judgment.
            Both sides practice honest communication.
          </Text>
        </View>
      </Card>

      {/* Messages */}
      <FlatList
        ref={scrollRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyEmoji}>🤝</Text>
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptyBody}>
              This is a judgment-free zone. Tag how you're feeling, speak honestly,
              and practice the communication skills you're learning together.
            </Text>
          </View>
        }
        renderItem={({ item: msg }) => {
          const isParent = msg.senderRole === 'parent';
          return (
            <View style={[styles.messageBubbleRow, isParent && styles.messageBubbleRowRight]}>
              {!isParent && (
                <Text style={styles.bubbleAvatar}>{childProfile.avatarEmoji}</Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  isParent ? styles.bubbleParent : styles.bubbleChild,
                ]}
              >
                {msg.emotionTag && (
                  <Text style={styles.emotionTagInBubble}>{msg.emotionTag}</Text>
                )}
                <Text style={[styles.messageText, isParent && styles.messageTextParent]}>
                  {msg.content}
                </Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Reflection Prompt */}
      {showReflection && (
        <Card style={styles.reflectionCard} variant="elevated">
          <View style={styles.reflectionRow}>
            <Icon name="thought-bubble-outline" size={20} color={colors.warning} />
            <Text style={styles.reflectionText}>{reflectionPrompt}</Text>
          </View>
          <View style={styles.reflectionActions}>
            <Button title="Revise" onPress={handleCancelReflection} variant="outline" size="sm" />
            <Button title="Send Anyway" onPress={handleSend} variant="accent" size="sm" />
          </View>
        </Card>
      )}

      {/* Emotion Picker */}
      {showEmotionPicker && (
        <View style={styles.emotionPicker}>
          {EMOTION_TAGS.map((tag) => (
            <TouchableOpacity
              key={tag.label}
              style={[
                styles.emotionOption,
                selectedEmotion === tag.emoji && styles.emotionOptionSelected,
              ]}
              onPress={() => {
                setSelectedEmotion(selectedEmotion === tag.emoji ? null : tag.emoji);
                setShowEmotionPicker(false);
              }}
            >
              <Text style={styles.emotionEmoji}>{tag.emoji}</Text>
              <Text style={styles.emotionLabel}>{tag.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TouchableOpacity
          onPress={() => setShowEmotionPicker(!showEmotionPicker)}
          style={styles.emotionButton}
        >
          <Text style={styles.emotionButtonText}>{selectedEmotion ?? '😊'}</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Share what's on your mind..."
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || isSending}
          style={styles.sendButton}
        >
          <Icon
            name="send"
            size={20}
            color={inputText.trim() ? colors.primary : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  headerAvatar: {
    fontSize: 28,
  },
  headerName: {
    ...typography.h3,
    color: colors.text,
  },
  headerLabel: {
    ...typography.caption,
    color: colors.success,
  },
  safeBanner: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
    borderWidth: 1,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bannerText: {
    ...typography.caption,
    color: colors.success,
    flex: 1,
    lineHeight: 18,
  },
  messagesList: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  emptyMessages: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
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
    paddingHorizontal: spacing.lg,
  },
  messageBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  messageBubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubbleAvatar: {
    fontSize: 20,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  bubbleParent: {
    backgroundColor: colors.primary + '30',
    borderBottomRightRadius: borderRadius.sm,
  },
  bubbleChild: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: borderRadius.sm,
  },
  emotionTagInBubble: {
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  messageText: {
    ...typography.body,
    color: colors.text,
  },
  messageTextParent: {
    color: colors.text,
  },
  messageTime: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
    fontSize: 10,
  },
  reflectionCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderColor: colors.warning + '40',
    borderWidth: 1,
  },
  reflectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  reflectionText: {
    ...typography.bodySmall,
    color: colors.warning,
    flex: 1,
    fontStyle: 'italic',
  },
  reflectionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  emotionPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  emotionOption: {
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    minWidth: 64,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emotionOptionSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '20',
  },
  emotionEmoji: {
    fontSize: 20,
  },
  emotionLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  emotionButton: {
    padding: spacing.xs,
  },
  emotionButtonText: {
    fontSize: 22,
  },
  textInput: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    padding: spacing.sm,
  },
});
