import { useState, useCallback } from 'react';
import type { Task } from '../types/task';
import { generateTaskId } from '../utils/idGenerator';

const SEED_TASKS: Task[] = [
  { id: '1', title: 'Review the plan', completed: false },
  { id: '2', title: 'Implement Stage 3', completed: true },
];

/**
 * Single source of truth for task list state (local component state per assignment).
 * Exposes tasks array and CRUD handlers (add, toggle complete, delete).
 * Components receive data and callbacks via props; no global store or persistence.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);

  const addTask = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks((prev) => [
      ...prev,
      { id: generateTaskId(), title: trimmed, completed: false },
    ]);
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { tasks, addTask, toggleComplete, deleteTask };
}
