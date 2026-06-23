import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '@/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: string;
  iconColor?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon,
  iconColor = colors.accent,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconCircle, { backgroundColor: iconColor + '15' }]}>
        <Icon name={icon} size={48} color={iconColor} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onAction && (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="accent"
          size="lg"
          style={styles.action}
        />
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <Button
          title={secondaryActionLabel}
          onPress={onSecondaryAction}
          variant="ghost"
          size="sm"
          style={styles.secondaryAction}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  action: {
    marginTop: spacing.lg,
    minWidth: 200,
  },
  secondaryAction: {
    marginTop: spacing.sm,
  },
});
