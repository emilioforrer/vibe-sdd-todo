# Tasks: Todo App MVP

**Input**: Design documents from `specs/001-todo-app-mvp/`  
**Branch**: `001-todo-app-mvp` | **Generated**: 2026-04-13  
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/use-todos.md ✅ quickstart.md ✅  
**Tests**: Not requested — no test tasks included

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: Parallelisable — no dependency on incomplete tasks; works on a different file
- **[Story]**: User story label (US1–US5); omitted for Setup and Foundational phases
- All file paths are relative to the repository root

---

## Phase 1: Setup (Project Initialisation)

**Purpose**: Bootstrap Nuxt project, install dependencies, wire Tailwind + Google Fonts, establish project scaffold

- [X] T001 Initialise Nuxt 3 project at repository root using `npx nuxi@latest init . --no-git-init` — choose TypeScript, accept defaults
- [X] T002 Install Tailwind and font modules: `npm install -D tailwindcss @nuxtjs/tailwindcss @nuxtjs/google-fonts`
- [X] T003 [P] Configure `nuxt.config.ts` — add `@nuxtjs/tailwindcss` and `@nuxtjs/google-fonts` modules, set `ssr: false`, configure `googleFonts` with "Press Start 2P" and "Space Mono" families
- [X] T004 [P] Create `tailwind.config.ts` — extend theme with `neon-purple` (#d946ef), `neon-violet` (#8b5cf6), `dark-bg` (#0d0015), `dark-card` (#1a0033) colors; `font-retro` and `font-mono` font families; `shadow-neon-sm/md/lg` box-shadow utilities per research.md R-002
- [X] T005 [P] Create `assets/css/main.css` — add Tailwind `@tailwind base/components/utilities` directives; reference in `nuxt.config.ts` `css` array

**Checkpoint**: `npm run dev` starts without errors; Tailwind classes and Google Fonts load in the browser

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definition and state composable — MUST be complete before any user story component work begins

⚠️ **CRITICAL**: No user story implementation can begin until this phase is complete

- [X] T006 Define `Todo` TypeScript interface in `types/todo.ts` — fields: `id: string`, `text: string`, `completed: boolean`, `createdAt: number`; export as named type per data-model.md
- [X] T007 Implement complete `useTodos` composable in `composables/useTodos.ts` — `useState` for SSR-safe reactive `todos` array; `addTodo(text)` with trim + validation (empty check, 200-char max, throws `Error` with message per contracts/use-todos.md); `toggleTodo(id)` flipping `completed`; `deleteTodo(id)` filtering out matching id; `onMounted` hydration from `localStorage` key `vibe-todo:todos` with `JSON.parse` + reset-to-`[]` on error; `watch(todos, { deep: true })` with `import.meta.client` guard writing back to `localStorage` on every mutation; `storageError` ref set on `QuotaExceededError`; expose `pendingCount` and `completedCount` computed refs

**Checkpoint**: `useTodos` is importable with no TypeScript errors; `addTodo/toggleTodo/deleteTodo` mutate state correctly in a test page

---

## Phase 3: User Story 1 — Create a Todo (Priority: P1) 🎯 MVP

**Goal**: A user can type a task description and submit it; it immediately appears in the list

**Independent Test**: Open app → type "Buy groceries" in the input → press Enter or click Add → "Buy groceries" appears in the list. Try submitting empty input — nothing is added and an error message appears. Type 201 characters — counter turns red and submit is blocked.

- [X] T008 [P] [US1] Create `components/TodoInput.vue` — controlled `<input>` bound to a local `ref`; real-time character counter display (e.g., "42 / 200") that turns `text-red-400` when ≥ 190 characters; submit button with `font-retro` label; `@submit.prevent` handler that calls `useTodos().addTodo()`, catches thrown `Error` and displays the message as inline validation feedback below the input; clears input on successful add
- [X] T009 [US1] Create `pages/index.vue` — app shell with `<TodoInput>` and a minimal `<ul>` rendering `todos` from `useTodos()`; no styling yet; verify end-to-end that adding a todo updates the rendered list

**Checkpoint**: User Story 1 independently testable — create todo flow works in the browser; empty/over-limit inputs are rejected with feedback

---

## Phase 4: User Story 2 — Complete a Todo (Priority: P1)

**Goal**: A user can click a checkbox on any todo to toggle its completion state; completed todos are visually different from pending ones

**Independent Test**: Create a todo → click its checkbox → verify visual change (strikethrough + dimmed). Click checkbox again → verify it returns to normal. Create multiple todos → toggle one → only that one changes.

- [X] T010 [P] [US2] Create `components/TodoItem.vue` — receives a `todo: Todo` prop and emits `toggle` and `delete` events; renders a styled checkbox (`<input type="checkbox">`) bound to `todo.completed`; `@change` emits `toggle`; todo text rendered with `font-mono`; applies `line-through opacity-50` classes when `todo.completed` is true
- [X] T011 [P] [US2] Create `components/TodoList.vue` — receives `todos: Todo[]` prop; renders `<TodoItem v-for="todo in todos" :key="todo.id">` and re-emits `toggle` and `delete` events upward
- [X] T012 [US2] Update `pages/index.vue` — replace minimal `<ul>` with `<TodoList :todos="todos">`; bind `@toggle="toggleTodo"` and `@delete="deleteTodo"` handlers from `useTodos()`

**Checkpoint**: User Story 2 independently testable — create a todo, mark it complete (strikethrough appears), toggle again (strikethrough removes)

---

## Phase 5: User Story 3 — View All Todos (Priority: P1)

**Goal**: All todos are visible in a styled list with clear pending/completed distinction; the app shows a friendly empty state when no todos exist; the full retro neo purple 80s theme is applied

**Independent Test**: Add a mix of completed and pending todos — verify both are visible and visually distinguishable at a glance. Delete all todos — verify a themed empty state message appears. Verify purple palette, retro font headings, and neon glow effects are present throughout.

- [X] T013 [P] [US3] Apply retro neo purple theme to `pages/index.vue` — `bg-dark-bg` full-height page background; `font-retro` app title with `shadow-neon-lg text-neon-purple`; centered content container with `max-w-xl mx-auto`; `bg-dark-card` card wrapper with `rounded border border-neon-violet`
- [X] T014 [P] [US3] Style `components/TodoInput.vue` with neon theme — `bg-dark-card border border-neon-violet` input field; `focus:shadow-neon-sm focus:outline-none` on focus; submit button with `bg-neon-violet hover:bg-neon-purple text-white font-retro shadow-neon-sm` styling
- [X] T015 [P] [US3] Style `components/TodoItem.vue` with retro theme — `bg-dark-card border-b border-neon-violet/30` row; custom neon checkbox accent via Tailwind `accent-neon-purple`; pending text in `text-gray-100 font-mono`; completed text in `text-gray-500 line-through opacity-50`
- [X] T016 [US3] Add empty state to `components/TodoList.vue` — when `todos` is empty, render a `<p>` with `font-retro text-neon-violet text-center` styling and a retro-themed message (e.g., "NO TASKS YET // ADD ONE ABOVE")

**Checkpoint**: User Story 3 independently testable — full retro purple UI visible; pending and completed todos clearly distinguished; empty state shown when list is empty

---

## Phase 6: User Story 4 — Delete a Todo (Priority: P2)

**Goal**: A user can remove any todo from the list; the item disappears immediately and other todos are unaffected

**Independent Test**: Create two todos → delete the first → verify only the first is gone. Create a todo → delete it → verify empty state appears.

- [X] T017 [US4] Add delete button to `components/TodoItem.vue` — an `×` or trash icon button positioned at the end of the todo row; styled `text-neon-purple hover:text-red-400 hover:shadow-neon-sm font-retro`; `@click` emits `delete` event with `todo.id`; verify that emitting delete from `TodoItem` → `TodoList` → `pages/index.vue` calls `deleteTodo(id)` from `useTodos()`

**Checkpoint**: User Story 4 independently testable — delete a todo, confirm it is removed; other todos remain intact

---

## Phase 7: User Story 5 — Persist Todos Between Sessions (Priority: P2)

**Goal**: All todos and their completion states survive browser close/reopen and page refresh

**Independent Test**: Add several todos, mark some complete → close the browser tab → reopen the app → verify all todos appear with correct states. Mark a todo complete → refresh the page → verify it remains complete.

- [X] T018 [US5] Verify `useTodos` localStorage persistence works end-to-end — confirm `onMounted` hydration in `composables/useTodos.ts` correctly reads `vibe-todo:todos` after a real browser refresh; confirm `watch` sync correctly persists mutations; confirm that corrupted `localStorage` data resets to `[]` without crashing
- [X] T019 [US5] Add storage error banner to `pages/index.vue` — conditionally render a dismissible `<div>` banner when `storageError` from `useTodos()` is non-null; style with `bg-red-900 border border-red-400 text-red-200 font-mono`; include a close `×` button that clears `storageError` locally

**Checkpoint**: User Story 5 independently testable — todos persist across a real browser close/reopen; storageError banner appears (can be tested by mocking `localStorage.setItem` to throw)

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, interaction polish, production build validation

- [X] T020 [P] Responsive layout pass — verify all components render correctly at ≥320px mobile width; adjust `pages/index.vue` padding/margins to `px-4`; ensure `TodoInput.vue` input+button stack vertically on narrow screens using `flex flex-col sm:flex-row`
- [X] T021 [P] Neon glow interaction polish — add `transition-shadow duration-200` to all interactive elements (buttons, input, checkbox) across `components/TodoInput.vue`, `components/TodoItem.vue`; verify hover/focus states have distinct neon glow feedback
- [X] T022 Run `npx nuxi generate` — verify static output builds without errors in `.output/public/`; confirm all assets are included and the app loads correctly from the static output
- [X] T023 Validate `specs/001-todo-app-mvp/quickstart.md` — follow the quickstart instructions end-to-end in the actual project to confirm they are accurate; update any steps that have diverged from the implemented configuration

**Checkpoint**: App is fully polished, responsive, and statically buildable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T003/T004/T005 parallelisable
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user story phases**
- **US1 (Phase 3)**: Depends on Phase 2 — T008 parallelisable with T009 sequential after
- **US2 (Phase 4)**: Depends on Phase 2 — T010/T011 parallelisable; T012 sequential after
- **US3 (Phase 5)**: Depends on US2 (Phase 4) — T013/T014/T015 parallelisable; T016 sequential after
- **US4 (Phase 6)**: Depends on US2 (Phase 4) — T017 depends on TodoItem.vue existing
- **US5 (Phase 7)**: Depends on US1 (Phase 3) — T018 validates composable; T019 needs index.vue shell
- **Polish (Final Phase)**: Depends on all user story phases — T020/T021 parallelisable

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories — start immediately after Phase 2
- **US2 (P1)**: No dependency on US1 logic, but creates TodoItem.vue used by US4
- **US3 (P1)**: Depends on US2 (TodoItem/TodoList created) — applies styling to existing components
- **US4 (P2)**: Depends on US2 (TodoItem.vue must exist) — adds delete button to it
- **US5 (P2)**: Depends on US1 (composable already has localStorage logic) — validates and surfaces errors

### Within Each User Story

- Composable logic before component consumption
- Parent components after child components (TodoItem → TodoList → index.vue)
- Core functionality before styling (Phase 3/4 before Phase 5)
- Story complete and independently testable before moving to next priority

### Parallel Opportunities

- **Phase 1**: T003, T004, T005 in parallel (different config files)
- **Phase 3**: T008 (TodoInput) can be built in parallel while reviewing T007
- **Phase 4**: T010 (TodoItem) and T011 (TodoList) in parallel (different files)
- **Phase 5**: T013 (index styling), T014 (input styling), T015 (item styling) all in parallel
- **Phase 7 onward**: T020 and T021 in parallel (different concerns, different files)

---

## Parallel Example: User Story 3 (Styling Phase)

Once Phase 4 (US2) is complete, T013/T014/T015 can all run simultaneously:

```
T013 (index.vue theme)   ──┐
T014 (TodoInput theme)   ──┼──► T016 (empty state) ──► Checkpoint
T015 (TodoItem theme)    ──┘
```

## Parallel Example: User Story 1

```
T007 (useTodos composable) ──► T008 (TodoInput.vue) ──► T009 (pages/index.vue) ──► Checkpoint
                                [can start in parallel
                                 once T007 signature
                                 is known]
```

---

## Implementation Strategy

### MVP Scope (recommended first delivery)

Completing **Phase 1 + Phase 2 + Phase 3** delivers the minimum viable product:
- User can add todos that appear in a list
- Basic app shell is functional

Completing **Phase 4 + Phase 5** delivers the full P1 feature set (complete, view, themed UI).

Completing **Phase 6 + Phase 7** delivers the full P2 feature set (delete, persist).

### Suggested Execution Order (single developer)

1. T001 → T002 → T003+T004+T005 (parallel) → Checkpoint
2. T006 → T007 → Checkpoint
3. T008+T009 → Checkpoint (US1 done)
4. T010+T011 (parallel) → T012 → Checkpoint (US2 done)
5. T013+T014+T015 (parallel) → T016 → Checkpoint (US3 done)
6. T017 → Checkpoint (US4 done)
7. T018 → T019 → Checkpoint (US5 done)
8. T020+T021 (parallel) → T022 → T023 → Checkpoint (Polish done)
