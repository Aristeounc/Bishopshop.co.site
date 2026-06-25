import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  useDerivedValue,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors, typography } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = colors.primary,
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const targetOffset = circumference * (1 - clampedProgress);

  // Animated fill on mount
  const animatedOffset = useSharedValue(circumference);

  useEffect(() => {
    animatedOffset.value = withDelay(
      100,
      withTiming(targetOffset, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      }),
    );
  }, [targetOffset, circumference]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  // Animate the label number counting up (only when label is numeric)
  const isNumericLabel = label !== undefined && !isNaN(Number(label));
  const numericTarget = isNumericLabel ? Number(label) : 0;
  const animatedNumber = useSharedValue(0);
  const [displayNumber, setDisplayNumber] = useState(0);

  const updateDisplayNumber = (val: number) => {
    setDisplayNumber(val);
  };

  useDerivedValue(() => {
    if (isNumericLabel) {
      const rounded = Math.round(animatedNumber.value);
      runOnJS(updateDisplayNumber)(rounded);
    }
  });

  useEffect(() => {
    if (isNumericLabel) {
      animatedNumber.value = withDelay(
        100,
        withTiming(numericTarget, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        }),
      );
    }
  }, [numericTarget, isNumericLabel]);

  // Glow shadow color derived from ring color
  const glowSize = size + strokeWidth * 2;

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel={`Progress: ${Math.round(clampedProgress * 100)}%${label ? `, ${label}` : ''}${sublabel ? ` ${sublabel}` : ''}`}
      accessibilityRole="progressbar"
    >
      {/* Glow effect behind the ring */}
      <View
        style={[
          styles.glow,
          {
            width: glowSize,
            height: glowSize,
            borderRadius: glowSize / 2,
            backgroundColor: color,
            opacity: 0.12,
          },
        ]}
      />

      <Svg width={size} height={size} style={styles.svg}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      <View style={styles.labelContainer}>
        {label !== undefined && (
          <Text style={styles.label}>
            {isNumericLabel ? String(displayNumber) : label}
          </Text>
        )}
        {sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  glow: {
    position: 'absolute',
  },
  labelContainer: {
    alignItems: 'center',
  },
  label: {
    ...typography.h2,
    color: colors.text,
  },
  sublabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});
