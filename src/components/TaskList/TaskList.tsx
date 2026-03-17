import React, { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { Task } from '../../types/task';
import { TaskItem } from '../TaskItem';
import { useTheme } from '../../constants/theme';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  ListEmptyComponent?: React.ComponentType;
}

export function TaskList({ tasks, onToggle, onDelete, ListEmptyComponent }: TaskListProps) {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1 },
        listContent: {
          paddingTop: theme.spacing.sm,
          paddingBottom: theme.spacing.lg,
        },
        emptyList: { flexGrow: 1 },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={onToggle} onDelete={onDelete} />
        )}
        contentContainerStyle={[
          styles.listContent,
          tasks.length === 0 && styles.emptyList,
        ]}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}
