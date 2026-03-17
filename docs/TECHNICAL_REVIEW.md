# Technical Review: React Native Task Manager (Take-Home Assessment)

**Reviewer role:** Senior mobile engineer / technical interviewer  
**Project:** Expo React Native Task Manager — local state only, no backend.  
**Review date:** March 2026

---

## 1. Feature completeness

**Required:** Add task, mark complete, delete task, display task list. State must be local (no backend/external storage).

| Requirement | Status | Evidence |
|-------------|--------|----------|
| **Add task** | ✅ Complete | `AddTaskInput` calls `onAdd(trimmed)`; empty/whitespace ignored (`if (!trimmed) return`); input clears after add (`setValue('')`). Submit via button and keyboard (`onSubmitEditing`). |
| **Mark complete** | ✅ Complete | Tap on task row triggers `onToggle(task.id)`; `useTasks` toggles `completed`; UI shows checkmark, strikethrough, and muted color via `theme.colors.textOnPrimary` / `titleCompleted`. |
| **Delete task** | ✅ Complete | Trash icon per task; native uses `Alert.alert` with Cancel/Delete; web uses `window.confirm`. Delete only after confirmation. |
| **Task list display** | ✅ Complete | `TaskList` uses `FlatList` with `keyExtractor`, `renderItem`; filter tabs (All / Active / Completed) in `HomeScreen`; progress bar “X of Y completed.” |
| **Local state only** | ✅ Compliant | All task state in `useTasks` (`useState` + `useCallback`). No Redux, no task Context, no persistence. `ThemeProvider` is UI-only. |

**Verdict:** All four required features are correctly implemented. No missing or incorrect behavior.

---

## 2. Code quality review

**Readability**  
- Files are short and single-purpose. `useTasks` is easy to follow (add/toggle/delete with immutable updates). `TaskItem` separates delete confirmation (web vs native) clearly.  
- JSDoc on `useTasks`, `ThemeProvider`, `Task`, `TaskFilter`, `copy`, and `generateTaskId` clarifies intent.  
- Theme-driven styles use a consistent pattern: `useMemo(() => StyleSheet.create({...}), [theme])`.

**Naming**  
- Clear and consistent: `useTasks`, `addTask`, `toggleComplete`, `deleteTask`; `TaskItem`, `TaskList`, `AddTaskInput`, `EmptyState`; `TaskFilter`, `FILTER_LABELS`; `copy.*`, `theme.colors.*`.  
- Props and handlers are well-named: `onAdd`, `onToggle`, `onDelete`, `ListEmptyComponent`.

**Component structure**  
- Single responsibility: `TaskItem` (one task + toggle + delete), `TaskList` (list + empty), `AddTaskInput` (input + submit), `EmptyState` (empty message).  
- Screens compose these and own screen-level state (filter in `HomeScreen`, tab in `App`).

**Separation of concerns**  
- Task CRUD only in `useTasks`. Theme only in `ThemeProvider` / `useTheme`. Copy in `copy.ts`; IDs in `idGenerator`; types in `task.ts`.  
- Presentational components only call callbacks; no business logic beyond “call with id/title.”

**Code duplication**  
- Theme-dependent styles repeated as `useMemo(() => StyleSheet.create({...}), [theme])` in multiple components. Acceptable at this scale; a `useThemedStyles` helper would reduce repetition if the app grew.  
- Delete confirmation and platform branching live in one place (`TaskItem`).

**Maintainability**  
- Adding a filter or new task field would touch a small, obvious set of files.  
- Semantic theme token `textOnPrimary` used for all text/icons on primary (no hardcoded `#fff`).  
- Constants and types centralized; tests cover hook and one component.

**Examples from code**  
- **Good:** `useTasks` returns stable callbacks via `useCallback`, and uses functional updates (`setTasks((prev) => ...)`).  
- **Good:** `TaskItem` uses `theme.colors.textOnPrimary` for checkmark icon; `HomeScreen` uses it for filter active label and header icon.  
- **Good:** `accessibilityRole`, `accessibilityState`, `accessibilityLabel` on filter tabs, add button, task row, delete button, switch, empty state.

**Verdict:** Code quality is strong: readable, consistent naming, clear separation, semantic theme usage, accessibility considered.

---

## 3. Architecture review

**Folder structure**

```
src/
├── components/   # TaskList, TaskItem, AddTaskInput, EmptyState (with index re-exports)
├── screens/      # HomeScreen, SettingsScreen
├── hooks/        # useTasks
├── types/        # task.ts (Task, TaskFilter)
├── utils/        # idGenerator
└── constants/    # theme.tsx, copy.ts
```

- Clear separation: components vs screens vs hooks vs shared (types, utils, constants).  
- No flat dump; each folder has a defined role.

**Component design**  
- Presentational components receive data and callbacks; they do not own task state.  
- `TaskList` accepts optional `ListEmptyComponent`, keeping the list reusable.  
- Screens own screen-level state and pass derived data down.

**State management**  
- Single source of truth for tasks: `useTasks`.  
- Filter in `HomeScreen`; input value in `AddTaskInput`; theme in `ThemeProvider`.  
- Aligns with “local component state” and is easy to reason about.

**Reusability**  
- `TaskList` / `TaskItem` could be reused with a different data source (e.g. API-backed hook).  
- `EmptyState` and `AddTaskInput` are generic.  
- Theme and copy shared via constants and hooks.

**Scalability**  
- For a take-home, scale is appropriate. Natural next steps if the app grew: extract filter tabs or progress bar into small components, add `useThemedStyles`, consider feature folders.

**Level:** Structure and data flow reflect **mid to senior** thinking: clear boundaries, single responsibility, and state ownership that could be swapped (e.g. useTasks → API) without redesigning the UI.

---

## 4. UI and UX review

**Visual clarity**  
- Header with icon and title; progress text and bar; filter tabs; list of cards with checkbox/checkmark and delete icon.  
- Hierarchy is clear; spacing and typography use theme tokens consistently.

**Interaction feedback**  
- Press states: `pressed && styles.mainRowPressed`, `buttonPressed`, `deleteBtnPressed` (opacity).  
- Toggle is immediate (checkbox/checkmark and strikethrough).  
- Delete requires confirmation, reducing accidental taps.

**Responsiveness**  
- Layout uses flex; `FlatList` for the list.  
- `KeyboardAvoidingView` on `AddTaskInput` for iOS.  
- Safe area used on main screens.

**Empty states**  
- Dedicated `EmptyState` with icon, title, and subtitle when there are no tasks (or none match the filter).  
- `TaskList` uses `ListEmptyComponent` so the empty state is integrated.

**Task completion feedback**  
- Completed: filled checkbox with checkmark, strikethrough title, muted color.  
- Progress bar and “X of Y completed” update immediately.

**Accessibility**  
- Filter tabs: `accessibilityRole="tab"`, `accessibilityState={{ selected }}`, `accessibilityLabel`.  
- Add button: `accessibilityRole="button"`, `accessibilityLabel="Add task"`.  
- Task row: `accessibilityRole="checkbox"`, `accessibilityState={{ checked }}`, descriptive label; delete: `accessibilityRole="button"`, `accessibilityLabel="Delete task: ..."`.  
- Settings switch: `accessibilityLabel="Dark mode"`, `accessibilityRole="switch"`.  
- Empty state: combined `accessibilityLabel` for title and subtitle.

**Verdict:** UI is clear, responsive, and provides good feedback. Empty state and accessibility strengthen usability.

---

## 5. Professional engineering signals

**Repository structure**  
- Root: `App.tsx`, `package.json`, README, config. Source under `src/` with logical folders.  
- Tests in `__tests__/` mirroring `src` (hooks, components).  
- `docs/` with `ARCHITECTURE.md`.

**File organization**  
- Components in folders with `index.ts` re-exports.  
- Types, utils, constants in dedicated files.

**Code style**  
- Consistent TypeScript (interfaces, types).  
- Consistent patterns: `useMemo` for theme-dependent styles, `useCallback` for handlers.

**Documentation**  
- **README:** Features, architecture, how to run (prerequisites, steps, troubleshooting), estimation, tech stack, design decisions, third-party libs.  
- **ARCHITECTURE.md:** Folder structure, data flow, state ownership.  
- JSDoc on hook and key modules.  
- README explicitly states “task state is local only” and explains ThemeProvider vs task state.

**Reusable components**  
- `TaskList`, `TaskItem`, `AddTaskInput`, `EmptyState` are prop-driven and reusable.  
- Theme and copy centralized.

**Caveat:** Part of the deliverable is uncommitted (README, `__tests__`, `docs/`, `jest.config.js`, `theme.tsx`, `SettingsScreen`, `EmptyState`, package changes). For a real submission, all deliverable code and docs should be committed.

**Verdict:** Strong signals: clear docs, intentional structure, separation of concerns, accessibility. Commit hygiene is the main gap.

---

## 6. Creativity and initiative

**Beyond basic requirements**

- **Filter (All / Active / Completed)** — Not required; improves usability.  
- **Progress bar** — “X of Y completed” with visual bar.  
- **Dark / light theme** — ThemeProvider, Settings screen, theme-aware StatusBar, semantic tokens (e.g. `textOnPrimary`).  
- **Bottom tab** — Todos vs Settings.  
- **Empty state** — Dedicated component with icon and copy.  
- **Platform-aware delete** — `Alert.alert` on native, `window.confirm` on web.  
- **Structured theme** — Semantic colors, spacing, radius, shadow.  
- **Centralized copy** — All user-facing strings in `copy.ts`.  
- **Tests** — `useTasks` and `TaskItem`; Jest + Testing Library.  
- **ARCHITECTURE.md** — Data flow and state ownership.  
- **Accessibility** — Roles and labels on key controls.

**Verdict:** Additions strengthen the submission and show awareness of UX, theming, cross-platform behavior, and maintainability.

---

## 7. Git history realism

**Observed history (12 commits):**

1. Initial commit  
2. chore: init Expo project with blank template  
3. chore: add TypeScript config  
4. chore: update .gitignore for Expo  
5. feat: add app shell and title  
6. chore: add src folder structure and Task type  
7. chore: add theme and copy constants  
8. chore: add idGenerator util  
9. feat: add useTasks hook with initial state  
10. feat: add TaskList and TaskItem components  
11. feat: add HomeScreen and wire task list  
12. feat: add AddTaskInput component  

**Number of commits:** 12 — reasonable for a take-home.

**Commit size:** Early commits are small (config, .gitignore, structure). Feature commits introduce coherent chunks (hook, components, screen, input). The working tree contains substantial uncommitted work (theme.tsx with dark/light, SettingsScreen, EmptyState, README, tests, docs), so the *committed* history does not show the full “polish” phase.

**Commit messages:** Conventional style (`feat:`, `chore:`), present tense, clear.

**Logical flow:** Sensible build order: setup → structure and types → constants and utils → state hook → list/item → screen → input.

**Realism score: 6/10** — History looks incremental with good messages, but the gap between last commit and current deliverable (tests, README, dark mode, Settings, EmptyState) suggests either a large final commit not yet made or work done in a batch. More granular commits (e.g. “feat: add dark mode and Settings,” “docs: add README,” “test: add useTasks and TaskItem tests”) would raise the score.

---

## 8. Human work simulation score

**Score: 6/10**

**Reasons it feels like real development:**  
- Incremental commit sequence.  
- Consistent naming and structure.  
- README and ARCHITECTURE explain choices.  
- Tests target hook and component.  
- Realistic details (web vs native delete, KeyboardAvoidingView, trim, accessibility).

**Reasons it might feel batched or tool-assisted:**  
- High consistency and completeness in one pass.  
- Much “polish” (README, docs, tests, theme, Settings, accessibility) exists only in the working tree.  
- Uniform style patterns across files.  
- No exploratory or “revert” commits.

**Summary:** Could be from a capable developer building in stages then polishing; could also be from a single intensive or tool-assisted pass. Uncommitted polish weakens the “gradual build” story.

---

## 9. Engineering level estimate

**Estimate: Mid level (with senior traits)**

**Reasoning:**

- **Mid level:** Delivers all requirements with good structure and readability. Uses TypeScript, hooks, and React patterns correctly. Adds sensible extras (filters, progress, empty state, theme, accessibility). Writes tests and docs.

- **Senior traits:** Clear architecture (state ownership, separation of concerns, reusable components). Thoughtful UX (platform-specific delete, KeyboardAvoidingView, confirmation, accessibility). Documented design decisions and data flow. Semantic theme tokens.

- **Not quite senior for this exercise:** Git history doesn’t tell a full “polish and document” story. Test coverage is minimal (one component + hook). No explicit trade-off discussion in the repo.

---

## 10. Improvement suggestions

1. **Commit all deliverable work** — Add commits for README, `__tests__`, `docs/`, `jest.config.js`, `theme.tsx`, `SettingsScreen`, `EmptyState`, and package/Expo changes. Use clear messages (e.g. “docs: add README and run instructions,” “test: add useTasks and TaskItem tests,” “feat: add dark mode and Settings”).

2. **Optional: extract `useThemedStyles`** — Reduce repetition of `useMemo(() => StyleSheet.create({...}), [theme])` with a small helper.

3. **Expand tests** — Add tests for `TaskList` (empty vs with items), `AddTaskInput` (submit, clear, ignore empty), and optionally `HomeScreen` filter behavior.

4. **README: “What’s not included”** — One line: “No persistence; tasks are lost on reload” to set expectations.

5. **Tab bar accessibility** — Add `accessibilityRole="tablist"` to the tab bar container and `accessibilityState={{ selected: true }}` on the active tab for consistency with filter tabs.

---

## 11. Final scoring

| Category | Score (out of 10) | Notes |
|----------|-------------------|--------|
| **Feature implementation** | 10 | All requirements met; local state only; behavior correct. |
| **Code quality** | 10 | Readable, consistent, good separation; theme tokens; no hardcoded colors; accessibility. |
| **Architecture** | 10 | Clear structure, state ownership, reusable components; semantic theme; scalable. |
| **UI and UX** | 10 | Clear, responsive, good feedback, empty state, accessibility on key controls. |
| **Professional practices** | 8 | Strong README and docs; good structure; part of deliverable uncommitted. |
| **Human work realism** | 6 | History looks incremental; polish uncommitted suggests batch or single final push. |

**بالعربية (ملخص التقييم):**

| المعيار | النتيجة |
|---------|---------|
| جودة الكود (Code quality) | 10 / 10 |
| الـ Architecture | 10 / 10 |
| الـ UI و UX | 10 / 10 |

**Overall:** (10 + 10 + 10 + 10 + 8 + 6) / 6 ≈ **9.0** → **90/100**.

(If “human work realism” is down-weighted, overall would sit in the **92–94** range.)

---

## 12. Hiring recommendation

**Recommendation: Hire**

**Reasoning:**

- **Strengths:** All required features are correctly implemented with local-only state. Code is readable, well-structured, and maintainable. Architecture shows clear separation of concerns and state ownership. Theme uses semantic tokens and no hardcoded colors. Accessibility is considered on key controls. README and ARCHITECTURE document choices. Initiative (filters, progress, theme, empty state, tests, platform-aware delete, accessibility) is above the brief. The candidate demonstrates mid-level competence with senior-style habits (documentation, structure, UX and a11y).

- **Concerns:** Git history doesn’t fully reflect the current deliverable (tests, README, theme, Settings in working tree). Human work simulation and history realism scores are moderate.

- **Why “Hire”:** For a take-home, we care most whether the person can design and implement a small app to a high standard. This submission does that. The history and “human” score can be probed in an interview (“Walk me through how you built this” / “How did you approach testing and accessibility?”). The technical quality and scope support a **Hire** with a follow-up on process and testing.

**If the role strongly emphasizes traceable, incremental process:** Consider **Borderline** and use the interview to clarify how the work was done and to ask for a short refactor or test addition live.
