import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Spacing, Typography, BorderRadius } from '@constants/colors';

const SparringScreen = ({ route, navigation }: any) => {
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'ai'; text: string }>
  >([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput('');
    setConversationHistory((prev) => [...prev, { role: 'user', text: userMessage }]);

    setIsLoading(true);
    // Simulate API call to get AI response
    setTimeout(() => {
      setConversationHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'I understand your perspective. Let me help you refine your communication approach...',
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.secondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Negotiation Training</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>5:23</Text>
        </View>
      </View>

      <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
        {conversationHistory.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="robot" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>Welcome to AI Sparring</Text>
            <Text style={styles.emptyText}>
              Start your conversation to practice negotiation skills. Share your thoughts, and I'll
              provide real-time feedback.
            </Text>
          </View>
        ) : (
          conversationHistory.map((msg, idx) => (
            <View
              key={idx}
              style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))
        )}

        {isLoading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator color={Colors.secondary} size="small" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={handleToggleRecording}
        >
          <MaterialCommunityIcons
            name={isRecording ? 'stop-circle' : 'microphone'}
            size={24}
            color={isRecording ? Colors.error : Colors.secondary}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Share your response..."
          placeholderTextColor={Colors.textSecondary}
          value={userInput}
          onChangeText={setUserInput}
          multiline
          maxHeight={100}
          editable={!isRecording && !isLoading}
        />

        <TouchableOpacity
          style={[styles.sendButton, (!userInput.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!userInput.trim() || isLoading}
        >
          <MaterialCommunityIcons
            name="send"
            size={20}
            color={userInput.trim() ? Colors.ink : Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.ink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  timer: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
  },
  timerText: {
    ...Typography.label,
    color: Colors.ink,
    fontWeight: '600',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.bodySmall,
    color: Colors.text,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    maxWidth: '80%',
  },
  messageBubble: {
    marginBottom: Spacing.md,
    maxWidth: '85%',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    ...Typography.bodySmall,
    color: Colors.text,
    lineHeight: 20,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  recordButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonActive: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  input: {
    flex: 1,
    backgroundColor: Colors.inkSoft,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default SparringScreen;
