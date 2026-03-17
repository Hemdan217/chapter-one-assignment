import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from '../components/TaskList';
import { AddTaskInput } from '../components/AddTaskInput';
import { EmptyState } from '../components/EmptyState';
import { copy } from '../constants/copy';
import { useTheme } from '../constants/theme';
import type { TaskFilter } from '../types/task';

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
};

export function HomeScreen() {
  const { theme } = useTheme();
  const { tasks, addTask, toggleComplete, deleteTask } = useTasks();
  const [filter, setFilter] = useState<TaskFilter>('all');

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: {
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
        titleIcon: {
          width: 40,
          height: 40,
          borderRadius: theme.radius.sm,
          backgroundColor: theme.colors.primary,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: theme.spacing.sm,
        },
        title: { fontSize: theme.fontSize.xl, fontWeight: '700', color: theme.colors.text },
        progressRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
        progressText: {
          fontSize: theme.fontSize.sm,
          color: theme.colors.textMuted,
          minWidth: 120,
        },
        progressTrack: {
          flex: 1,
          height: 8,
          borderRadius: 4,
          backgroundColor: theme.colors.surface,
          overflow: 'hidden',
        },
        progressFill: {
          height: '100%',
          backgroundColor: theme.colors.success,
          borderRadius: 4,
        },
        filterRow: {
          flexDirection: 'row',
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          gap: theme.spacing.sm,
          backgroundColor: theme.colors.background,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        },
        filterBtn: {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.radius.sm,
        },
        filterBtnActive: { backgroundColor: theme.colors.primary },
        filterLabel: {
          fontSize: theme.fontSize.sm,
          color: theme.colors.textMuted,
          fontWeight: '500',
        },
        filterLabelActive: { color: '#fff' },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.titleIcon}>
            <Ionicons name="list" size={22} color="#fff" />
          </View>
          <Text style={styles.title}>{copy.appTitle}</Text>
        </View>
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            {completedCount} of {totalCount} completed
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      </View>
      <AddTaskInput onAdd={addTask} />
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as const).map((f) => (
          <Pressable
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterLabel, filter === f && styles.filterLabelActive]}>
              {FILTER_LABELS[f]}
            </Text>
          </Pressable>
        ))}
      </View>
      <TaskList
        tasks={filteredTasks}
        onToggle={toggleComplete}
        onDelete={deleteTask}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
}
