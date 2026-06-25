import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { ChatBubble } from '@/components/ChatBubble';
import { PersonaAvatar } from '@/components/PersonaAvatar';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useStore } from '@/store/useStore';
import { sparringEngine } from '@/services/sparring/engine';
import { getPersona } from '@/services/sparring/personas';
import { saveSession, updateStreak, checkAndAwardBadges } from '@/services/firestore';
import { logSessionStart, logSessionComplete } from '@/services/analytics';
import { SPARRING_PERSONAS } from '@/utils/constants';
import { PersonaId, SkillTrackId, SparringSession } from '@/models/types';
import { formatEloChange } from '@/utils/helpers';
import { canAccessFeature, getUpgradeMessage, FREE_TRIAL_LIMITS } from '@/utils/subscriptionGate';

interface SparringScreenProps {
  navigation: any;
}

type SparringState = 'select_persona' | 'active' | 'debrief';

export function SparringScreen({ navigation }: SparringScreenProps) {
  const [state, setState] = useState<SparringState>('select_persona');
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);
  const [input, setInput] = useState('');
  const [session, setSession] = useState<SparringSession | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const user = useStore((s) => s.user);
  const skillProgress = useStore((s) => s.skillProgress);
  const sessionHistory = useStore((s) => s.sessionHistory);
  const completeSession = useStore((s) => s.completeSession);

  function handleSelectPersona(personaId: PersonaId) {
    setSelectedPersona(personaId);
  }

  function handleStartSparring() {
    if (!selectedPersona || !user) return;

    if (user.subscription === 'free_trial') {
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = sessionHistory.filter(
        (s) => s.completedAt && s.completedAt.startsWith(today),
      );
      if (todaySessions.length >= FREE_TRIAL_LIMITS.sparringSessions) {
        Alert.alert(
          'Daily Limit Reached',
          getUpgradeMessage('sparring'),
          [{ text: 'OK' }],
        );
        return;
      }
    }

    const persona = getPersona(selectedPersona);
    const newSession = sparringEngine.startSession(
      user.id,
      selectedPersona,
      persona.primarySkills,
    );

    setSession(newSession);
    setState('active');
    logSessionStart(selectedPersona, persona.primarySkills);
  }

  function handleSendMessage() {
    if (!input.trim() || !session) return;

    const response = sparringEngine.processUserMessage(session, input.trim());

    const updatedSession: SparringSession = {
      ...session,
      messages: [
        ...session.messages,
        response.userMessage,
        response.personaResponse,
      ],
    };

    setSession(updatedSession);
    setInput('');

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    if (response.shouldEndSession) {
      handleEndSession(updatedSession);
    }
  }

  function handleEndSession(currentSession?: SparringSession) {
    const s = currentSession ?? session;
    if (!s) return;

    const skillElos = Object.fromEntries(
      Object.entries(skillProgress).map(([k, v]) => [k, v.elo]),
    ) as Record<SkillTrackId, number>;

    const completedSession = sparringEngine.endSession(s, skillElos);
    setSession(completedSession);
    setState('debrief');

    if (completedSession.eloChanges) {
      completeSession(completedSession.eloChanges);
    }

    saveSession(completedSession).catch((error) => {
      console.error('Failed to save session:', error);
      Alert.alert('Save Error', 'Your session could not be saved. Please check your connection.');
    });

    if (user) {
      updateStreak(user.id).catch(() => {});
      const currentProgress = useStore.getState().skillProgress;
      const totalSessions = (user.totalSessions || 0) + 1;
      const currentStreak = (user.currentStreak || 0) + 1;
      checkAndAwardBadges(user.id, currentProgress, totalSessions, currentStreak)
        .then((newBadges) => {
          if (newBadges.length > 0) {
            const earnBadge = useStore.getState().earnBadge;
            newBadges.forEach((b) => earnBadge(b));
            const names = newBadges.map((b) => `${b.icon} ${b.name}`).join('\n');
            Alert.alert('Badge Earned!', `Congratulations!\n\n${names}`);
          }
        })
        .catch(() => {});
    }

    const durationMs = completedSession.completedAt
      ? new Date(completedSession.completedAt).getTime() - new Date(completedSession.startedAt).getTime()
      : 0;
    logSessionComplete(s.personaId, durationMs, completedSession.overallScore ?? 50);
  }

  function handleNewSession() {
    setSession(null);
    setSelectedPersona(null);
    setState('select_persona');
  }

  if (state === 'select_persona') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Choose Your Opponent</Text>
        <Text style={styles.subtitle}>Each persona trains different skills</Text>

        <View style={styles.personaList}>
          {SPARRING_PERSONAS.map((persona) => (
            <Card
              key={persona.id}
              style={[
                styles.personaCard,
                selectedPersona === persona.id && {
                  borderColor: persona.color,
                  borderWidth: 2,
                },
              ]}
            >
              <PersonaAvatar
                persona={persona}
                size={56}
                selected={selectedPersona === persona.id}
                onPress={() => handleSelectPersona(persona.id)}
              />
              <Text style={styles.personaDesc}>{persona.description}</Text>
              <View style={styles.personaSkills}>
                <Icon name="target" size={12} color={colors.textMuted} />
                <Text style={styles.personaSkillLabel}>{persona.skillLabel}</Text>
              </View>
            </Card>
          ))}
        </View>

        {selectedPersona && (
          <Button
            title="Start Sparring"
            onPress={handleStartSparring}
            variant="accent"
            size="lg"
            style={styles.startButton}
          />
        )}
      </ScrollView>
    );
  }

  if (state === 'debrief' && session?.debrief) {
    const persona = getPersona(session.personaId);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Session Debrief</Text>
        <Text style={styles.subtitle}>vs {persona.name}</Text>

        <Card style={styles.debriefCard}>
          <Text style={styles.debriefSection}>Strengths</Text>
          {session.debrief.strengths.map((s, i) => (
            <View key={i} style={styles.debriefItem}>
              <Icon name="check-circle" size={16} color={colors.success} />
              <Text style={styles.debriefText}>{s}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.debriefCard}>
          <Text style={styles.debriefSection}>Areas for Growth</Text>
          {session.debrief.areasForGrowth.map((a, i) => (
            <View key={i} style={styles.debriefItem}>
              <Icon name="arrow-up-circle" size={16} color={colors.accent} />
              <Text style={styles.debriefText}>{a}</Text>
            </View>
          ))}
        </Card>

        {session.debrief.patternsNoticed.length > 0 && (
          <Card style={styles.debriefCard}>
            <Text style={styles.debriefSection}>Patterns Noticed</Text>
            {session.debrief.patternsNoticed.map((p, i) => (
              <View key={i} style={styles.debriefItem}>
                <Icon name="lightbulb-outline" size={16} color={colors.info} />
                <Text style={styles.debriefText}>{p}</Text>
              </View>
            ))}
          </Card>
        )}

        <Card style={styles.debriefCard}>
          <Text style={styles.debriefSection}>ELO Changes</Text>
          {Object.entries(session.debrief.eloSummary).map(([trackId, data]) => (
            <View key={trackId} style={styles.eloRow}>
              <Text style={styles.eloTrack}>{trackId}</Text>
              <Text style={[styles.eloChange, { color: data.change >= 0 ? colors.success : colors.error }]}>
                {formatEloChange(data.change)}
              </Text>
              <Text style={styles.eloAfter}>{data.after}</Text>
            </View>
          ))}
        </Card>

        <Card style={styles.debriefCard}>
          <Text style={styles.debriefSection}>Next Step</Text>
          <Text style={styles.debriefText}>{session.debrief.nextRecommendation}</Text>
        </Card>

        <Button
          title="New Session"
          onPress={handleNewSession}
          variant="primary"
          size="lg"
          style={styles.startButton}
        />
      </ScrollView>
    );
  }

  const persona = selectedPersona ? getPersona(selectedPersona) : null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.sparringHeader}>
        <Text style={styles.sparringTitle}>
          {persona?.avatar} vs {persona?.name}
        </Text>
        <TouchableOpacity onPress={() => handleEndSession()}>
          <Text style={styles.endButton}>End Session</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {session?.messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            personaName={persona?.name}
            personaColor={persona?.color}
          />
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Type your response..."
          placeholderTextColor={colors.textMuted}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!input.trim()}
        >
          <Icon name="send" size={22} color={input.trim() ? colors.textOnPrimary : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  personaList: {
    gap: spacing.md,
  },
  personaCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  personaDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  personaSkills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  personaSkillLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  startButton: {
    marginTop: spacing.lg,
  },
  sparringHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sparringTitle: {
    ...typography.h3,
    color: colors.text,
  },
  endButton: {
    ...typography.button,
    color: colors.error,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingTop: spacing.md,
    ...typography.body,
    color: colors.text,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surface,
  },
  debriefCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  debriefSection: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  debriefItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  debriefText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  eloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  eloTrack: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    textTransform: 'capitalize',
  },
  eloChange: {
    ...typography.button,
    marginRight: spacing.md,
  },
  eloAfter: {
    ...typography.body,
    color: colors.textSecondary,
    width: 50,
    textAlign: 'right',
  },
});
