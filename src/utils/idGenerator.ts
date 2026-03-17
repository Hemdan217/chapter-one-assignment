/**
 * Generates a unique id for new tasks.
 */
export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
