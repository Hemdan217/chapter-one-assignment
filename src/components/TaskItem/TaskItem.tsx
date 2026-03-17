import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Task } from '../../types/task';
import { useTheme } from '../../constants/theme';
import { copy } from '../../constants/copy';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const { theme } = useTheme();

  const handleDeletePress = () => {
    if (!onDelete) return;
    if (Platform.OS === 'web') {
      const ok = window.confirm(
        [copy.deleteConfirmTitle, copy.deleteConfirmMessage].filter(Boolean).join('\n\n')
      );
      if (ok) onDelete(task.id);
      return;
    }
    Alert.alert(
      copy.deleteConfirmTitle,
      copy.deleteConfirmMessage,
      [
        { text: copy.cancel, style: 'cancel' },
        { text: copy.delete, style: 'destructive', onPress: () => onDelete(task.id) },
      ]
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginHorizontal: theme.spacing.md,
          marginBottom: theme.spacing.sm,
          ...theme.shadowCard,
        },
        mainRow: { flex: 1, flexDirection: 'row', alignItems: 'center' },
        mainRowPressed: { opacity: 0.7 },
        checkboxRow: { marginRight: theme.spacing.sm },
        checkboxEmpty: {
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: theme.colors.border,
        },
        checkboxFilled: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: theme.colors.success,
          justifyContent: 'center',
          alignItems: 'center',
        },
        title: { flex: 1, fontSize: theme.fontSize.md, color: theme.colors.text },
        titleCompleted: {
          textDecorationLine: 'line-through',
          color: theme.colors.textMuted,
        },
        deleteBtn: {
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: theme.spacing.xs,
        },
        deleteBtnPressed: { opacity: 0.7 },
      }),
    [theme]
  );

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.mainRow, pressed && styles.mainRowPressed]}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
      >
        <View style={styles.checkboxRow}>
          {task.completed ? (
            <View style={styles.checkboxFilled}>
              <Ionicons name="checkmark" size={16} color={theme.colors.textOnPrimary} />
            </View>
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </View>
        <Text
          style={[styles.title, task.completed && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </Pressable>
      {onDelete && (
        <Pressable
          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
          onPress={handleDeletePress}
          accessibilityRole="button"
          accessibilityLabel={`Delete task: ${task.title}`}
        >
          <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
        </Pressable>
      )}
    </View>
  );
}
