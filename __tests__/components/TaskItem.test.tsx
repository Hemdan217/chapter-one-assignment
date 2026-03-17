import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../../src/constants/theme';
import { TaskItem } from '../../src/components/TaskItem';
import type { Task } from '../../src/types/task';

const mockTask: Task = {
  id: '1',
  title: 'Test task',
  completed: false,
};

const mockTaskCompleted: Task = {
  id: '2',
  title: 'Done task',
  completed: true,
};

const noop = () => {};

function wrap(component: React.ReactElement) {
  return <ThemeProvider>{component}</ThemeProvider>;
}

describe('TaskItem', () => {
  it('renders task title', () => {
    render(wrap(<TaskItem task={mockTask} onToggle={noop} />));
    expect(screen.getByText('Test task')).toBeTruthy();
  });

  it('renders completed task', () => {
    render(wrap(<TaskItem task={mockTaskCompleted} onToggle={noop} />));
    expect(screen.getByText('Done task')).toBeTruthy();
  });
});
