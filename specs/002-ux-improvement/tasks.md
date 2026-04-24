# Tasks: UX Improvement – Vibe Todo

**Branch**: `002-ux-improvement`
**Input**: Design documents from `specs/002-ux-improvement/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: Not requested — no test tasks included per spec.

**Organization**: Tasks grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: Which user story this task belongs to ([US1]–[US5])
- Exact file paths in every description

## Story Map

| Story | Priority | Phase | Spec Dependency |
|-------|----------|-------|-----------------|
| US1 – Visual Polish | P1 | 3 | None |
| US2 – Creation Metadata | P1 | 4 | None |
| US4 – Delete Confirmation | P2 | 5 | US1 (delete button visible) |
| US3 – Drag & Drop Reorder | P2 | 6 | US2 (conceptual); US1 (TodoItem stable) |
| US5 – Pagination | P3 | 7 | US3 (reorder index math) |

---

## Phase 1: Setup (Baseline Verification)

**Purpose**: Confirm the existing app is functional before any changes.

- [ ] T001 Verify baseline — run `npm run dev`, confirm existing todos create/complete/delete and persist to localStorage at key `vibe-todo:todos`

---

## Phase 2: Foundational (Todo Type + Order Field)

**Purpose**: Extend the data model with `order` — required by US3 (drag-and-drop) and US5 (pagination). Must complete before US3 and US5.

**⚠️ CRITICAL**: US3 and US5 cannot begin until T002–T004 are complete.

- [ ] T002 Add `order?: number` field to `Todo` interface in `types/todo.ts`
- [ ] T003 Update `onMounted` handler in `composables/useTodos.ts` to backfill `order: index` for todos loaded from localStorage that lack the field — do NOT touch `createdAt` (must remain `undefined` for legacy tasks per FR-021)
- [ ] T004 Update `addTodo` in `composables/useTodos.ts` to set `order: todos.value.length` on every newly created todo

**Checkpoint**: `Todo` type updated; existing todos gain `order` on next load; new todos persist `order`.

---

## Phase 3: User Story 1 – Improved Visual Polish (Priority: P1) 🎯 MVP Start

**Goal**: Refined header glow proportional to heading size; delete button always visible with high contrast.

**Independent Test**: Open app, verify `VIBE TODO` header glow is subtle/proportional. Create a task, verify `×` button is clearly visible (not hidden) at all times without hovering.

- [ ] T005 [US1] Reduce neon glow on `<h1>` in `pages/index.vue` — replace `shadow-neon-lg drop-shadow-[0_0_20px_#d946ef]` with `shadow-neon-sm` (or equivalent smaller `drop-shadow` value) so glow is proportional to the heading size, not oversized
- [ ] T006 [US1] Make delete button always visible in `components/TodoItem.vue` — remove `opacity-0 group-hover:opacity-100` classes; apply a consistently visible style with high contrast against the dark background (e.g., `text-neon-violet hover:text-red-400`)

**Checkpoint**: US1 fully testable — header glow is proportional; delete button visible at all times.

---

## Phase 4: User Story 2 – Task Creation Metadata Display (Priority: P1)

**Goal**: Each task shows its creation date as relative time (e.g., "2 hours ago"); hovering reveals absolute time tooltip (e.g., "Apr 23, 2026 2:30 PM"); legacy tasks without `createdAt` show "Date unknown".

**Independent Test**: Create a task — confirm relative time appears below label in small muted text. Hover over it — confirm tooltip shows absolute date. Refresh — confirm time persists. Check a legacy task (if any in localStorage) shows "Date unknown".

- [ ] T007 [P] [US2] Add `formatRelativeTime(ts: number | undefined): string` helper export to `composables/useTodos.ts` — returns `'Date unknown'` when `ts` is falsy; otherwise uses `Intl.RelativeTimeFormat('en', { numeric: 'auto' })` with thresholds: seconds (<60s), minutes (<1h), hours (<1d), days (<30d), months (<1y), years
- [ ] T008 [P] [US2] Add `formatAbsoluteTime(ts: number): string` helper export to `composables/useTodos.ts` — uses `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })` to produce e.g. `"Apr 23, 2026 2:30 PM"`
- [ ] T009 [US2] Update `components/TodoItem.vue` to display `createdAt` metadata — add a `<span>` below the task label showing `formatRelativeTime(todo.createdAt)` with `:title="todo.createdAt ? formatAbsoluteTime(todo.createdAt) : ''"` tooltip; style with `font-mono text-xs text-neon-violet/50` so it is subtly muted and does not compete with the task label

**Checkpoint**: US2 fully testable — creation date visible on all tasks; relative/absolute display correct; legacy tasks show "Date unknown".

---

## Phase 5: User Story 4 – Delete Confirmation Workflow (Priority: P2)

**Goal**: Clicking `×` shows a confirmation dialog; task deleted only after user confirms. Cancel, backdrop click, Escape, and Enter all work correctly.

**Independent Test**: Click `×` on any task — confirm dialog appears with message "Are you sure you want to delete this task?". Click Cancel — task remains. Click `×` again, press Enter — task deleted. Click `×` again, press Escape — dialog dismisses, task remains. Click `×` again, click outside dialog — dialog closes. Verify dialog uses retro neo-purple style.

Note: Depends on Phase 3 (T006) — delete button must be visible to reach it.

- [ ] T010 [US4] Create `components/ConfirmationDialog.vue` — `<Teleport to="body">` modal with `v-if="isOpen"`, backdrop `<div>` with `@click.self="$emit('cancel')"`, inner dialog panel with retro styling (`border border-neon-violet bg-dark-card font-mono`), message `"Are you sure you want to delete this task?"` plus `taskText` prop shown as secondary label, "Confirm" button (`@click="$emit('confirm')"`) and "Cancel" button (`@click="$emit('cancel')"`); mount/unmount `document.addEventListener('keydown', ...)` handler: `Escape` → emit `cancel`, `Enter` → emit `confirm`; props: `isOpen: boolean`, `taskText: string`; emits: `confirm`, `cancel`
- [ ] T011 [US4] Update `components/TodoItem.vue` to gate deletion through `ConfirmationDialog` — add `showConfirm = ref(false)`; change delete button `@click` from `emit('delete', todo.id)` to `showConfirm.value = true`; add `<ConfirmationDialog :is-open="showConfirm" :task-text="todo.text" @confirm="() => { emit('delete', todo.id); showConfirm.value = false }" @cancel="showConfirm.value = false" />` inside the template
- [ ] T012 [US4] Verify `components/TodoList.vue` correctly bubbles the `delete` event from `TodoItem` to its parent — existing `@delete="emit('delete', $event)"` binding should be sufficient; confirm no changes needed

**Checkpoint**: US4 fully testable — confirmation dialog appears on every delete attempt; all confirmation/cancellation paths work; retro styling applied.

---

## Phase 6: User Story 3 – Task Reordering via Drag and Drop (Priority: P2)

**Goal**: Tasks can be reordered by drag-and-drop (desktop: HTML5 DnD; mobile: 500ms long-press + drag). Reordered order persists to localStorage across page refresh.

**Independent Test**: Create 3+ tasks. On desktop: click-drag handle to reorder — verify visual active state, new order on release, order after refresh. On mobile (DevTools device mode): long-press 500ms on handle — verify drag activation indication; drag to reorder; verify order persists.

Note: Requires Phase 2 (T002–T004) for `order` field. Builds on Phase 3 (TodoItem stable).

- [ ] T013 [US3] Add `reorderTodos(fromIndex: number, toIndex: number): void` to `composables/useTodos.ts` — splice-insert the item from `fromIndex` to `toIndex`, then remap each todo's `order` field to its new array index, then call `persist()`; guard: no-op if `fromIndex === toIndex` or out-of-bounds
- [ ] T014 [US3] Add `index: number` prop to `components/TodoItem.vue`; add drag handle `<span>` element (`⠿`) with classes `cursor-grab select-none text-neon-violet/60 hover:text-neon-violet font-mono shrink-0` always visible (not hover-only); add `touch-action: none` inline style on handle span to prevent browser scroll capture
- [ ] T015 [US3] Add desktop HTML5 DnD events to `components/TodoItem.vue` — set `draggable="true"` on root `<li>`; `@dragstart`: set `dataTransfer.effectAllowed = 'move'` and store `props.index`; `@dragover.prevent`: set drop effect; `@drop.prevent.stop`: read source index from `dataTransfer`, emit `reorder` if different from `props.index`; `@dragend`: clear drag CSS class
- [ ] T016 [US3] Add visual drag active state to `components/TodoItem.vue` — bind a reactive `isDragging` ref as a CSS class on the root `<li>` (`scale-105 opacity-60 shadow-neon-sm z-10`) that is set `true` on `dragstart` / long-press activation and `false` on `dragend` / `pointerup`
- [ ] T017 [US3] Add mobile Pointer Events long-press drag to `components/TodoItem.vue` — on drag handle: `@pointerdown`: record `startY`, start 500ms `setTimeout`; if `pointerType === 'touch'`, call `event.currentTarget.setPointerCapture(event.pointerId)` in the timer callback; `@pointermove`: if timer still pending and `|clientY − startY| > 10`, cancel timer (scroll intent); if dragging, compute drop target from `clientY` and store pending `dropIndex`; `@pointerup` / `@pointercancel`: clear timer; if dragging and `dropIndex !== props.index`, emit `reorder`; set `isDragging = false`
- [ ] T018 [P] [US3] Update `components/TodoList.vue` — pass `:index="index"` to `TodoItem` in the `v-for` loop; add `@reorder="emit('reorder', $event[0], $event[1])"` (or use `(from, to)` destructure) to bubble the event to the page; add `reorder` to the `defineEmits` declaration
- [ ] T019 [US3] Update `pages/index.vue` — destructure `reorderTodos` from `useTodos()`; bind `@reorder="(from, to) => reorderTodos(from, to)"` on `<TodoList>`

**Checkpoint**: US3 fully testable — drag handle visible; desktop drag-drop reorders list; mobile long-press activates drag mode; order persists after refresh.

---

## Phase 7: User Story 5 – Task List Pagination (Priority: P3)

**Goal**: When more than 15 tasks exist, only 15 are shown per page with Previous/Next controls and a "Page X of Y" indicator. Drag-and-drop reorder is page-local only.

**Independent Test**: Create 20+ tasks. Verify only 15 appear; pagination controls visible below list. Click Next — tasks 16–20 visible. Click Previous — back to page 1. Delete a task on page 2 so page becomes empty — verify auto-reset to last non-empty page. Drag-and-drop works within the current page only.

Note: Requires Phase 2 (T002–T004) for `order`; T023 adjusts Phase 6's reorder index wiring.

- [ ] T020 [US5] Add pagination state to `composables/useTodos.ts` — add `const PAGE_SIZE = 15`; `const currentPage = ref(1)`; `const totalPages = computed(() => Math.max(1, Math.ceil(todos.value.length / PAGE_SIZE)))`; `const paginatedTodos = computed(() => todos.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE))`; `function setPage(n: number) { currentPage.value = Math.min(Math.max(1, n), totalPages.value) }`; add `watch(() => todos.value.length, () => { currentPage.value = Math.min(currentPage.value, totalPages.value) })`; expose `paginatedTodos`, `currentPage`, `totalPages`, `setPage` in the return object
- [ ] T021 [P] [US5] Create `components/PaginationControl.vue` — props: `currentPage: number`, `totalPages: number`; emits: `page-change: [page: number]`; template: "Previous" button (disabled when `currentPage === 1`, `@click="$emit('page-change', currentPage - 1)"`), "Page X of Y" `<span>` in `font-retro text-xs text-neon-violet`, "Next" button (disabled when `currentPage === totalPages`, `@click="$emit('page-change', currentPage + 1)"`); retro styling consistent with existing UI (border `neon-violet`, background `dark-card`, hover `neon-purple`)
- [ ] T022 [US5] Update `pages/index.vue` — destructure `paginatedTodos`, `currentPage`, `totalPages`, `setPage` from `useTodos()`; change `<TodoList :todos="todos"` to `<TodoList :todos="paginatedTodos"`; add `<PaginationControl v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" @page-change="setPage" />` below `<TodoList>`
- [ ] T023 [US5] Update `@reorder` handler in `pages/index.vue` to translate page-local indexes to absolute list indexes — change to `(from, to) => reorderTodos(from + (currentPage.value - 1) * PAGE_SIZE, to + (currentPage.value - 1) * PAGE_SIZE)`

**Checkpoint**: US5 fully testable — 15 tasks per page; Previous/Next navigation works; page resets when task count drops below threshold; drag-and-drop stays page-local.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: Visual consistency, lint pass, end-to-end verification.

- [ ] T024 [P] Visual consistency audit — review all modified/new components (`TodoItem.vue`, `ConfirmationDialog.vue`, `PaginationControl.vue`, `pages/index.vue`) to confirm all new elements use only existing Tailwind tokens (`neon-purple`, `neon-violet`, `dark-card`, `dark-bg`, `font-retro`, `font-mono`, `shadow-neon-sm/md/lg`) per FR-020 and Constitution §II; no hardcoded hex values or raw CSS files added
- [ ] T025 [P] Run `npm run lint` from repository root and resolve all TypeScript and ESLint errors across `types/todo.ts`, `composables/useTodos.ts`, `components/TodoItem.vue`, `components/TodoList.vue`, `components/ConfirmationDialog.vue`, `components/PaginationControl.vue`, `pages/index.vue`
- [ ] T026 Run through `specs/002-ux-improvement/quickstart.md` testing checklist — verify all acceptance scenarios for US1–US5; document any failures as follow-up issues

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)           → No dependencies; start immediately
Phase 2 (Foundational)    → After Phase 1; BLOCKS Phase 6 (US3) and Phase 7 (US5)
Phase 3 (US1)             → After Phase 1 (independent of Phase 2)
Phase 4 (US2)             → After Phase 1 (independent of Phase 2 and Phase 3)
Phase 5 (US4)             → After Phase 3 (delete button must be visible)
Phase 6 (US3)             → After Phase 2 + Phase 3 (order field + stable TodoItem)
Phase 7 (US5)             → After Phase 2 + Phase 6 (order field + reorder logic)
Polish (Final)            → After all user story phases complete
```

### User Story Dependencies

- **US1 (P1)**: Independent — starts after baseline
- **US2 (P1)**: Independent — starts after baseline; can run in parallel with US1
- **US4 (P2)**: Requires US1 — delete button must be always visible before wiring confirmation
- **US3 (P2)**: Requires Phase 2 (order field); builds on US1 (stable TodoItem); independent of US2/US4
- **US5 (P3)**: Requires Phase 2 (order field) and US3 (reorder logic complete)

### Within Each User Story

- Data model changes before composable changes
- Composable changes before component changes
- Parent component wiring after child component complete

### Parallel Opportunities

- **T007 and T008** (Phase 4): Different utilities in the same file — write both before T009
- **T021** (Phase 7): `PaginationControl.vue` is a standalone new file — can be written while T020 composable changes are in progress
- **T018** (Phase 6): `TodoList.vue` change is independent of all Phase 6 `TodoItem.vue` work
- **T024 and T025** (Polish): Different concerns — can run in parallel

---

## Parallel Example: Phase 4 (US2)

```
Parallel: T007 + T008 (add formatRelativeTime + formatAbsoluteTime to useTodos.ts)
Sequential: T009 after T007 + T008 (update TodoItem.vue to use both helpers)
```

## Parallel Example: Phase 6 (US3)

```
Parallel (independent file): T018 - update TodoList.vue
Sequential (same file): T013 → T014 → T015 → T016 → T017 (useTodos.ts then TodoItem.vue in order)
Sequential after all: T019 - wire in pages/index.vue
```

---

## Implementation Strategy

### MVP First (US1 + US2 Only — Pure Visual, No Interaction Complexity)

1. Phase 1: Setup (T001)
2. Phase 2: Foundational (T002–T004) — fast, type extension only
3. Phase 3: US1 Visual Polish (T005–T006) — ~30 min
4. Phase 4: US2 Metadata Display (T007–T009) — ~45 min
5. **STOP and VALIDATE**: US1 + US2 independently testable — deploy/demo P1 features

### Incremental Delivery

1. Foundation → US1 → US2 → **Deploy P1**
2. Add US4 (T010–T012) → **Deploy delete confirmation**
3. Add US3 (T013–T019) → **Deploy drag-and-drop reorder**
4. Add US5 (T020–T023) → **Deploy pagination**
5. Polish (T024–T026) → **Final release**

### Solo Developer Order (Recommended)

T001 → T002 → T003 → T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014 → T015 → T016 → T017 → T018 → T019 → T020 → T021 → T022 → T023 → T024 → T025 → T026

---

## Notes

- `[P]` = different files, no dependency on incomplete tasks in the same batch
- `[USn]` label maps each task to its user story for traceability
- **Do not backfill `createdAt`** for legacy tasks — must display "Date unknown" (FR-021)
- **No new runtime dependencies** — all APIs are browser-native or Vue 3 built-ins
- Commit after each phase checkpoint to enable easy rollback
- Stop at any checkpoint to validate the story independently before proceeding
