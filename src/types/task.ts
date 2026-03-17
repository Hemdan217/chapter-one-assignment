/**
 * Task model for the task manager app.
 */
export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

/** Filter for task list: all, active only, or completed only. */
export type TaskFilter = 'all' | 'active' | 'completed';
