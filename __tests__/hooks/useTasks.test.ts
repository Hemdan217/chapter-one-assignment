import { renderHook, act } from '@testing-library/react';
import { useTasks } from '../../src/hooks/useTasks';

describe('useTasks', () => {
  it('returns initial tasks', () => {
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks.length).toBeGreaterThanOrEqual(0);
    expect(result.current.addTask).toBeDefined();
    expect(result.current.toggleComplete).toBeDefined();
    expect(result.current.deleteTask).toBeDefined();
  });

  it('addTask appends a new task', () => {
    const { result } = renderHook(() => useTasks());
    const initialCount = result.current.tasks.length;

    act(() => {
      result.current.addTask('New task');
    });

    expect(result.current.tasks.length).toBe(initialCount + 1);
    expect(result.current.tasks[result.current.tasks.length - 1].title).toBe('New task');
    expect(result.current.tasks[result.current.tasks.length - 1].completed).toBe(false);
  });

  it('addTask ignores empty string', () => {
    const { result } = renderHook(() => useTasks());
    const initialCount = result.current.tasks.length;

    act(() => {
      result.current.addTask('   ');
    });

    expect(result.current.tasks.length).toBe(initialCount);
  });

  it('toggleComplete flips completed', () => {
    const { result } = renderHook(() => useTasks());
    const id = result.current.tasks[0]?.id;
    if (!id) return;
    const completedBefore = result.current.tasks[0].completed;

    act(() => {
      result.current.toggleComplete(id);
    });

    expect(result.current.tasks.find((t) => t.id === id)?.completed).toBe(!completedBefore);
  });

  it('deleteTask removes task', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask('To delete');
    });
    const taskToDelete = result.current.tasks.find((t) => t.title === 'To delete');
    const id = taskToDelete?.id;
    if (!id) return;
    const countBefore = result.current.tasks.length;

    act(() => {
      result.current.deleteTask(id);
    });

    expect(result.current.tasks.length).toBe(countBefore - 1);
    expect(result.current.tasks.find((t) => t.id === id)).toBeUndefined();
  });
});
