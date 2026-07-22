import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { SparringPersona } from '@/models/types';
import { colors, borderRadius, spacing, typography, shadows } from '@/theme';

interface PersonaAvatarProps {
  persona: SparringPersona;
  size?: number;
  onPress?: () => void;
  selected?: boolean;
  showInfo?: boolean;
}

/** Extracted component so useAnimatedStyle is called at the top level of a component */
function DifficultyDot({
  filled,
  color,
  opacity,
}: {
  filled: boolean;
  color: string;
  opacity: SharedValue<number>;
}) {
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    backgroundColor: filled ? color : colors.border,
  }));

  return <Animated.View style={[styles.difficultyDot, animStyle]} />;
}

export function PersonaAvatar({
  persona,
  size = 72,
  onPress,
  selected = false,
  showInfo = true,
}: PersonaAvatarProps) {
  // Selection animation shared values
  const scale = useSharedValue(1);
  const borderW = useSharedValue(selected ? 3 : 2);

  // Difficulty dots shared values (always 5)
  const dot0 = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const dot4 = useSharedValue(0);
  const dotOpacities = [dot0, dot1, dot2, dot3, dot4];

  // Animate dots on mount with staggered delay
  useEffect(() => {
    dotOpacities.forEach((opacity, i) => {
      if (i < persona.difficulty) {
        opacity.value = withDelay(
          i * 80,
          withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) }),
        );
      } else {
        opacity.value = withTiming(1, { duration: 200 });
      }
    });
  }, [persona.difficulty]);

  // Selection animation
  useEffect(() => {
    if (selected) {
      borderW.value = withSpring(3, { damping: 15, stiffness: 200 });
      scale.value = withSpring(1.08, { damping: 8, stiffness: 300 }, () => {
        scale.value = withSpring(1.0, { damping: 12, stiffness: 200 });
      });
    } else {
      borderW.value = withSpring(2, { damping: 15, stiffness: 200 });
      scale.value = withSpring(1.0, { damping: 12, stiffness: 200 });
    }
  }, [selected]);

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderW.value,
  }));

  const content = (
    <View
      style={[styles.container, showInfo && styles.containerWithInfo]}
      accessibilityLabel={`${persona.name}, ${persona.subtitle}`}
    >
      {selected ? (
        <LinearGradient
          colors={[persona.color, persona.color + '4D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradientRing,
            {
              width: size + 8,
              height: size + 8,
              borderRadius: (size + 8) / 2,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderColor: persona.color,
                backgroundColor: persona.color + '15',
              },
              animatedAvatarStyle,
            ]}
          >
            <Text style={{ fontSize: size * 0.4 }}>{persona.avatar}</Text>
          </Animated.View>
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: colors.border,
              backgroundColor: persona.color + '15',
            },
            animatedAvatarStyle,
          ]}
        >
          <Text style={{ fontSize: size * 0.4 }}>{persona.avatar}</Text>
        </Animated.View>
      )}
      {showInfo && (
        <View style={styles.info}>
          <Text style={styles.name}>{persona.name}</Text>
          <Text style={styles.subtitle}>{persona.subtitle}</Text>
          <View style={styles.difficultyRow}>
            {dotOpacities.map((opacity, i) => (
              <DifficultyDot
                key={i}
                filled={i < persona.difficulty}
                color={persona.color}
                opacity={opacity}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`${persona.name}, ${persona.subtitle}, difficulty ${persona.difficulty} of 5`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...shadows.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    ...typography.h3,
    color: colors.text,
    fontSize: 16,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: spacing.xs,
  },
  difficultyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
});
