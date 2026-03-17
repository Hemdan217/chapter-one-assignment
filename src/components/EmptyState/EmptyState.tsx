import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { copy } from '../../constants/copy';
import { useTheme } from '../../constants/theme';

export function EmptyState() {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: theme.spacing.xl,
        },
        iconWrap: { marginBottom: theme.spacing.md },
        title: {
          fontSize: theme.fontSize.lg,
          fontWeight: '600',
          color: theme.colors.textMuted,
          marginBottom: theme.spacing.xs,
          textAlign: 'center',
        },
        subtitle: {
          fontSize: theme.fontSize.md,
          color: theme.colors.textMuted,
          textAlign: 'center',
        },
      }),
    [theme]
  );

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`${copy.emptyStateTitle}. ${copy.emptyStateSubtitle}`}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name="clipboard-outline"
          size={64}
          color={theme.colors.textMuted}
        />
      </View>
      <Text style={styles.title}>{copy.emptyStateTitle}</Text>
      <Text style={styles.subtitle}>{copy.emptyStateSubtitle}</Text>
    </View>
  );
}
