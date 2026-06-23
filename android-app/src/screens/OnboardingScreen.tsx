import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Button } from '@/components/Button';
import { useStore } from '@/store/useStore';
import { updateUserProfile } from '@/services/auth';
import { SKILL_TRACKS } from '@/utils/constants';

interface OnboardingScreenProps {
  navigation: any;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingPage {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

export function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentPage(page);
  }

  function goToPage(page: number) {
    scrollRef.current?.scrollTo({ x: page * SCREEN_WIDTH, animated: true });
    setCurrentPage(page);
  }

  function handleNext() {
    if (currentPage < pages.length - 1) {
      goToPage(currentPage + 1);
    } else {
      handleComplete();
    }
  }

  async function handleComplete() {
    if (user) {
      const updated = { ...user, hasCompletedOnboarding: true };
      setUser(updated);
      updateUserProfile(user.id, { hasCompletedOnboarding: true }).catch(() => {});
    }
    navigation.replace('Main');
  }

  function handleSkip() {
    handleComplete();
  }

  const pages: OnboardingPage[] = [
    {
      icon: 'creation',
      iconColor: colors.accent,
      title: 'Welcome to Peitho',
      subtitle: 'The Art of Influence',
      content: (
        <View style={styles.pageContent}>
          <Text style={styles.pageBody}>
            Peitho is your personal gym for mastering the conversations that matter most
            — negotiations, difficult talks, persuasion, and connection.
          </Text>
          <View style={styles.valueProps}>
            {[
              { icon: 'brain', label: 'Research-backed techniques' },
              { icon: 'sword-cross', label: 'AI-powered sparring partners' },
              { icon: 'chart-line', label: 'Track your growth with ELO' },
            ].map((item) => (
              <View key={item.label} style={styles.valueProp}>
                <Icon name={item.icon} size={20} color={colors.accent} />
                <Text style={styles.valuePropText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      icon: 'dumbbell',
      iconColor: colors.primary,
      title: 'Train Like a Gym',
      subtitle: 'Four phases, every session',
      content: (
        <View style={styles.pageContent}>
          <Text style={styles.pageBody}>
            Each daily session follows a proven structure designed to build lasting skills.
          </Text>
          <View style={styles.phases}>
            {[
              { icon: 'fire', color: colors.accent, label: 'Warmup', desc: 'Learn a new concept from expert research' },
              { icon: 'dumbbell', color: colors.primary, label: 'Drills', desc: 'Practice targeted exercises' },
              { icon: 'sword-cross', color: colors.error, label: 'Sparring', desc: 'Apply skills against AI personas' },
              { icon: 'meditation', color: colors.success, label: 'Recovery', desc: 'Review your performance and debrief' },
            ].map((phase) => (
              <View key={phase.label} style={styles.phaseRow}>
                <View style={[styles.phaseIcon, { backgroundColor: phase.color + '15' }]}>
                  <Icon name={phase.icon} size={20} color={phase.color} />
                </View>
                <View style={styles.phaseText}>
                  <Text style={styles.phaseLabel}>{phase.label}</Text>
                  <Text style={styles.phaseDesc}>{phase.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      icon: 'radar',
      iconColor: '#45B7D1',
      title: '8 Skill Dimensions',
      subtitle: 'Build a complete communicator',
      content: (
        <View style={styles.pageContent}>
          <Text style={styles.pageBody}>
            Every interaction engages different skills. Peitho tracks and develops all eight.
          </Text>
          <View style={styles.skillsGrid}>
            {SKILL_TRACKS.map((track) => (
              <View key={track.id} style={styles.skillChip}>
                <View style={[styles.skillDot, { backgroundColor: track.color }]} />
                <Text style={styles.skillChipLabel}>{track.name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.pageHint}>
            Your weakest skills get priority in daily programs so your growth stays balanced.
          </Text>
        </View>
      ),
    },
    {
      icon: 'karate',
      iconColor: '#F2C744',
      title: 'Earn Your Belt',
      subtitle: 'From white belt to black belt',
      content: (
        <View style={styles.pageContent}>
          <Text style={styles.pageBody}>
            Your ELO rating reflects real skill growth. As your average ELO climbs, you earn new belt levels.
          </Text>
          <View style={styles.beltLadder}>
            {[
              { name: 'White Belt', color: '#E8E8E8', elo: 'Start' },
              { name: 'Yellow Belt', color: '#F2C744', elo: '200+' },
              { name: 'Green Belt', color: '#2EA043', elo: '500+' },
              { name: 'Blue Belt', color: '#1F5BA8', elo: '800+' },
              { name: 'Brown Belt', color: '#8B6914', elo: '1200+' },
              { name: 'Black Belt', color: '#333', elo: '1600+' },
            ].map((belt) => (
              <View key={belt.name} style={styles.beltRow}>
                <View style={[styles.beltSwatch, { backgroundColor: belt.color }]} />
                <Text style={styles.beltName}>{belt.name}</Text>
                <Text style={styles.beltElo}>{belt.elo}</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      icon: 'rocket-launch',
      iconColor: colors.accent,
      title: 'Ready to Begin',
      subtitle: 'Your first session awaits',
      content: (
        <View style={styles.pageContent}>
          <Text style={styles.pageBody}>
            Start with your Daily Program to learn a concept and practice with drills,
            or jump straight into a Sparring match to test your instincts.
          </Text>
          <View style={styles.startOptions}>
            <TouchableOpacity
              style={[styles.startOption, { borderColor: colors.accent }]}
              onPress={() => {
                handleComplete().then(() => {});
              }}
            >
              <Icon name="calendar-check-outline" size={32} color={colors.accent} />
              <Text style={styles.startOptionTitle}>Daily Program</Text>
              <Text style={styles.startOptionDesc}>Guided training session</Text>
              <View style={styles.recommendedTag}>
                <Text style={styles.recommendedTagText}>Recommended</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.startOption, { borderColor: colors.primary }]}
              onPress={() => {
                handleComplete().then(() => {});
              }}
            >
              <Icon name="sword-cross" size={32} color={colors.primary} />
              <Text style={styles.startOptionTitle}>Free Spar</Text>
              <Text style={styles.startOptionDesc}>Jump into the ring</Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {currentPage < pages.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipButton} />
        )}
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {pages.map((page, index) => (
          <View key={index} style={styles.page}>
            <View style={[styles.heroIcon, { backgroundColor: page.iconColor + '15' }]}>
              <Icon name={page.icon} size={56} color={page.iconColor} />
            </View>
            <Text style={styles.pageTitle}>{page.title}</Text>
            <Text style={styles.pageSubtitle}>{page.subtitle}</Text>
            <ScrollView
              style={styles.contentScroll}
              contentContainerStyle={styles.contentScrollInner}
              showsVerticalScrollIndicator={false}
            >
              {page.content}
            </ScrollView>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentPage && styles.dotActive,
                index === currentPage && { backgroundColor: pages[currentPage].iconColor },
              ]}
            />
          ))}
        </View>

        {currentPage < pages.length - 1 ? (
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
            size="lg"
            style={styles.nextButton}
          />
        ) : (
          <Button
            title="Let's Go"
            onPress={handleComplete}
            variant="accent"
            size="lg"
            style={styles.nextButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  skipButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 60,
  },
  skipText: {
    ...typography.button,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  page: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  heroIcon: {
    width: 112,
    height: 112,
    borderRadius: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  pageTitle: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  pageSubtitle: {
    ...typography.h3,
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  contentScroll: {
    flex: 1,
    width: '100%',
  },
  contentScrollInner: {
    paddingBottom: spacing.lg,
  },
  pageContent: {
    width: '100%',
    alignItems: 'center',
  },
  pageBody: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
    maxWidth: 320,
  },
  pageHint: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: spacing.md,
    maxWidth: 280,
  },
  valueProps: {
    gap: spacing.md,
    width: '100%',
    maxWidth: 300,
  },
  valueProp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  valuePropText: {
    ...typography.body,
    color: colors.text,
  },
  phases: {
    gap: spacing.sm,
    width: '100%',
    maxWidth: 340,
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  phaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: {
    flex: 1,
  },
  phaseLabel: {
    ...typography.label,
    color: colors.text,
  },
  phaseDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    maxWidth: 340,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
  },
  skillDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  skillChipLabel: {
    ...typography.label,
    color: colors.text,
  },
  beltLadder: {
    width: '100%',
    maxWidth: 300,
    gap: spacing.sm,
  },
  beltRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
  },
  beltSwatch: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  beltName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  beltElo: {
    ...typography.caption,
    color: colors.textMuted,
  },
  startOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    width: '100%',
    maxWidth: 340,
  },
  startOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  startOptionTitle: {
    ...typography.label,
    color: colors.text,
  },
  startOptionDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  recommendedTag: {
    backgroundColor: colors.accent + '20',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  recommendedTagText: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 10,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
    gap: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 24,
    borderRadius: 4,
  },
  nextButton: {
    width: '100%',
    maxWidth: 300,
  },
});
