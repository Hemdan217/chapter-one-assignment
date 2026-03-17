# Architecture

## Folder structure

```
src/
├── components/     # Reusable UI: TaskList, TaskItem, AddTaskInput, EmptyState
├── screens/         # HomeScreen (Todos), SettingsScreen
├── hooks/           # useTasks (task state and CRUD only)
├── types/           # Task, TaskFilter
├── utils/           # idGenerator
└── constants/       # theme (dark/light), copy
```

## Data flow

1. **App** renders `ThemeProvider` (UI preference only) and a bottom tab: **Todos** | **Settings**. Task state is not in context.
2. **HomeScreen (Todos)** calls `useTasks()` and gets `{ tasks, addTask, toggleComplete, deleteTask }`.
3. **Filter** state (All/Active/Completed) lives in HomeScreen; it derives `filteredTasks` and passes them to TaskList.
4. **TaskList** receives `tasks`, `onToggle`, `onDelete`, and optional `ListEmptyComponent`; it renders a FlatList of TaskItem.
5. **TaskItem** receives one `task` and callbacks; it shows checkbox/checkmark, title (with completed style), and delete icon with confirmation.
6. **AddTaskInput** owns local input state; on submit it calls `onAdd(trimmedTitle)` and clears the input.
7. **SettingsScreen** uses `useTheme()` to read and toggle dark/light mode; no task data.

## State ownership

- **Tasks array and CRUD:** `useTasks` only (single source of truth; local component state as required).
- **Filter (All/Active/Completed):** `HomeScreen` (`useState<TaskFilter>`).
- **Add input value:** `AddTaskInput` (`useState`).
- **Dark/light mode:** `ThemeProvider` (React Context for UI only; does not hold or manage tasks).

No global store for tasks; the hook could be swapped later for one that talks to an API or persistence without changing screens or components.
