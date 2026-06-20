import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SparringPersona } from '@/models/types';
import { colors, borderRadius, spacing, typography, shadows } from '@/theme';

interface PersonaAvatarProps {
  persona: SparringPersona;
  size?: number;
  onPress?: () => void;
  selected?: boolean;
  showInfo?: boolean;
}

export function PersonaAvatar({
  persona,
  size = 72,
  onPress,
  selected = false,
  showInfo = true,
}: PersonaAvatarProps) {
  const content = (
    <View style={[styles.container, showInfo && styles.containerWithInfo]}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: selected ? persona.color : colors.border,
            backgroundColor: persona.color + '15',
          },
          selected && styles.selected,
        ]}
      >
        <Text style={{ fontSize: size * 0.4 }}>{persona.avatar}</Text>
      </View>
      {showInfo && (
        <View style={styles.info}>
          <Text style={styles.name}>{persona.name}</Text>
          <Text style={styles.subtitle}>{persona.subtitle}</Text>
          <View style={styles.difficultyRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.difficultyDot,
                  i < persona.difficulty && { backgroundColor: persona.color },
                ]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    ...shadows.sm,
  },
  selected: {
    borderWidth: 3,
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
