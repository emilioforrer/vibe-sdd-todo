# Tasks: Schedule & Filter with Visual Redesign

**Input**: Design documents from `/specs/002-schedule-filter/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: Not explicitly requested in the feature specification — test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Design token migration and config updates — everything depends on the new visual foundation

- [ ] T001 Replace color, font, shadow, and border-radius tokens in `tailwind.config.ts` with new glassmorphism design tokens per DESIGN.md (colors: primary, primary-mid, primary-end, border, text-dark, text-medium, text-subtle, text-placeholder, track, error, bg-start, bg-mid, bg-end; font: Inter sans-serif default; shadows: glass-sm, glass-lg; border-radius: sm 14px, md 16px, lg 24px)
- [ ] T002 [P] Update `nuxt.config.ts` to switch Google Fonts from Press Start 2P + Space Mono to Inter [400, 500] with `display: 'swap'`
- [ ] T003 [P] Update `assets/css/main.css` to remove old dark-theme styles and add any glassmorphism Tailwind utilities if needed (gradient background on body/app wrapper)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extend the data model and composable with all new state, computed properties, and actions that user story components depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Extend the `Todo` interface in `types/todo.ts` to add `scheduledDate?: string` field (ISO 8601 date string "YYYY-MM-DD") and add the `FilterStatus` type (`'today' | 'all' | 'pending' | 'completed'`)
- [ ] T005 Extend `composables/useTodos.ts` with: `searchQuery` ref, `activeFilter` ref (default `'today'`), `filteredTodos` computed (applies activeFilter + searchQuery), rewire `paginatedTodos` to slice from `filteredTodos` instead of `todos`, add watcher to reset `currentPage` to 1 on filter/search change, add `totalCount` / `todayCount` / `progressPercentage` computed properties, update `addTodo()` signature to `(text: string, scheduledDate?: string)`, add `updateTodoDate(id: string, date: string | undefined)` action — per contracts in `specs/002-schedule-filter/contracts/component-contracts.md`

**Checkpoint**: Foundation ready — all composable APIs available for user story components

---

## Phase 3: User Story 1 — Visual Redesign to Light Theme (Priority: P1) 🎯 MVP

**Goal**: Replace the dark theme with the light glassmorphism aesthetic — gradient background, semi-transparent cards, updated typography, and purple accent palette across all existing components

**Independent Test**: Load the app and verify the new visual treatment is applied — light gradient background, glassmorphism cards, Inter typography, and purple accent palette

### Implementation for User Story 1

- [ ] T006 [US1] Restyle `pages/index.vue` — apply the soft lavender-to-pink gradient background (`bg-gradient-to-b from-[#F5F3FF] via-[#FAF5FF] to-[#FDF4FF]`), centered container (~900px max-width), and updated page layout structure to accommodate new sections (AppHeader, ProgressCard, SearchFilter)
- [ ] T007 [P] [US1] Restyle `components/TodoInput.vue` — apply glassmorphism card styling (bg-white/70, backdrop-blur-md, border-white/40, rounded corners, glass shadows), update placeholder to "What would you like to accomplish?", update character counter styling, update button to purple gradient accent
- [ ] T008 [P] [US1] Restyle `components/TodoItem.vue` — apply glassmorphism card styling, replace square checkbox with circular checkbox (empty circle outline when pending, filled when completed), add drag handle visual on the left, update delete icon styling, update text styling to Inter
- [ ] T009 [P] [US1] Restyle `components/TodoList.vue` — apply glassmorphism styling, update empty-state messaging and styling
- [ ] T010 [P] [US1] Restyle `components/PaginationControl.vue` — apply glassmorphism styling, update button and text colors to match new palette
- [ ] T011 [P] [US1] Restyle `components/ConfirmationDialog.vue` — apply glassmorphism card styling to the dialog overlay and card, update button colors to purple gradient

**Checkpoint**: App should display full light glassmorphism visual treatment. All existing functionality (create, complete, delete, reorder, paginate) works with new styling.

---

## Phase 4: User Story 2 — Search & Filter Tasks (Priority: P2)

**Goal**: Add search input and filter tabs (Today/All/Pending/Completed) so users can quickly find specific tasks

**Independent Test**: Create several tasks (some completed, some pending), then use the search input and filter tabs to verify correct filtering behavior. "Today" tab is default on load.

### Implementation for User Story 2

- [ ] T012 [US2] Create `components/SearchFilter.vue` — search input with magnifying glass icon + filter tabs (Today/All/Pending/Completed) with count badges per tab; bind to `searchQuery` and `activeFilter` via v-model emits per component contract; glassmorphism card styling; "Today" tab selected by default; apply 44×44px minimum touch targets on tabs
- [ ] T013 [US2] Integrate `SearchFilter.vue` into `pages/index.vue` — place between ProgressCard and TodoInput sections, wire `searchQuery` and `activeFilter` to `useTodos()` composable refs; also pass `totalCount`, `pendingCount`, `completedCount`, and `todayCount` from `useTodos()` to the corresponding `SearchFilter` props (required for tab count badges per component contract)
- [ ] T014 [US2] Update `components/TodoList.vue` with filter-aware empty states — show contextual messages per active filter ("No tasks scheduled for today", "No pending tasks", "No completed tasks", "No tasks match your search")

**Checkpoint**: Search and filter are functional. Typing filters tasks by keyword. Tabs filter by status. Counts update. "Today" is default. Pagination resets on filter/search change.

---

## Phase 5: User Story 3 — Task Scheduling with Date Picker (Priority: P3)

**Goal**: Allow users to assign a date to tasks via a custom calendar dropdown date picker

**Independent Test**: Create a new task, use the date picker to assign a date, verify the date appears beneath the task text. Create a task without a date and verify no date subtitle is shown.

### Implementation for User Story 3

- [ ] T015 [US3] Create `components/DatePicker.vue` — custom calendar dropdown with month grid (6×7), prev/next month navigation, date cell selection, glassmorphism card styling, click-outside to close, Escape to close, 44×44px touch targets on date cells, ARIA attributes for accessibility; props/emits per component contract (modelValue as ISO date string, update:modelValue emit); include a "No date" / "Clear" button that emits `update:modelValue` with `undefined` to remove an existing date (FR-009)
- [ ] T016 [US3] Integrate `DatePicker.vue` into `components/TodoInput.vue` — add calendar icon button next to the input field that opens the DatePicker, pass selected date to `addTodo(text, scheduledDate)` on form submit, clear selected date after submission
- [ ] T017 [US3] Update `components/TodoItem.vue` — display `scheduledDate` as formatted date subtitle (e.g., "Apr 29, 2026" via `Intl.DateTimeFormat`) beneath task text; show calendar icon on undated tasks; add `DatePicker` integration for editing dates on existing tasks (tapping date subtitle or calendar icon opens picker); emit `update-date` event per component contract
- [ ] T018 [US3] Update `components/TodoList.vue` — bubble the `update-date` event from `TodoItem` to parent; wire to `updateTodoDate()` composable action in `pages/index.vue`

**Checkpoint**: Tasks can be created with or without dates. Date picker opens/closes correctly. Dates display on task items. Existing tasks can have dates assigned or changed. Dates persist in localStorage.

---

## Phase 6: User Story 4 — Progress Tracking (Priority: P4)

**Goal**: Show a visual progress card with completion percentage and gradient progress bar

**Independent Test**: Create tasks, complete some, verify the progress card shows correct percentage, bar fill, and summary count. With zero tasks, verify 0% and "0 of 0 tasks completed".

### Implementation for User Story 4

- [ ] T019 [US4] Create `components/ProgressCard.vue` — display "Progress Today" label, completion percentage number, gradient progress bar (purple-to-pink fill), and "X of Y tasks completed" summary; glassmorphism card styling; props: total, completed, percentage per component contract
- [ ] T020 [US4] Integrate `ProgressCard.vue` into `pages/index.vue` — place below AppHeader, wire `totalCount`, `completedCount`, and `progressPercentage` from `useTodos()` composable

**Checkpoint**: Progress card visible, updates in real time when tasks are created/completed/deleted. Shows 0% with no tasks, 100% when all complete.

---

## Phase 7: User Story 5 — Redesigned Header (Priority: P5)

**Goal**: Display a clean, modern header with app title, sparkle decorations, subtitle, and bell icon

**Independent Test**: Load the app and verify the header shows "Vibe ToDo" with sparkle icons, "Your productivity companion" subtitle, and a notification bell icon button.

### Implementation for User Story 5

- [ ] T021 [US5] Create `components/AppHeader.vue` — display app title "Vibe ToDo" with decorative sparkle icons (✨ or SVG) flanking the title, subtitle "Your productivity companion" in muted text below, notification bell icon button on the right; glassmorphism styling; 44×44px touch target on bell button
- [ ] T022 [US5] Integrate `AppHeader.vue` into `pages/index.vue` — place at the top of the page layout, replacing any existing header content

**Checkpoint**: Header renders with title, sparkles, subtitle, and bell icon. Bell is a visual placeholder (no notification functionality).

---

## Phase 8: User Story 6 — Redesigned Todo Items (Priority: P6)

**Goal**: Finalize todo item card design with circular checkbox, visible drag handle, task text, optional date subtitle, and delete action

**Independent Test**: Create tasks with and without dates, complete tasks, reorder via drag handles, delete tasks — verify each interaction and visual state matches the design spec.

### Implementation for User Story 6

- [ ] T023 [US6] Final polish on `components/TodoItem.vue` — ensure drag handle is visually prominent (grip dots/lines icon on the left), circular checkbox has proper empty/filled states with transition animation, completed task text has strikethrough styling, delete icon has hover/focus states, all interactive elements meet 44×44px touch targets, card has proper spacing and visual hierarchy per DESIGN.md

**Checkpoint**: Todo items display complete card design. All interactions (toggle, drag, delete) work smoothly with visual feedback.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, and cross-cutting improvements

- [ ] T024 [P] Verify all interactive elements have visible focus indicators (keyboard navigation) across all components
- [ ] T025 [P] Verify responsive design across mobile (375px) and desktop (1440px) viewports — centered container, touch targets, no overflow or horizontal scrolling
- [ ] T026 [P] Run `npm run lint` and fix any linting/formatting issues across all modified files
- [ ] T027 Run quickstart.md validation — execute setup steps, verify dev server starts, verify all user stories are functional end-to-end
- [ ] T028 Run `npm test` and fix any failing tests caused by component changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: No dependency on Phase 1 — T004/T005 are pure TypeScript/composable changes with no dependency on Tailwind tokens. Can start immediately in parallel with Phase 1. BLOCKS all user stories from beginning component work.
- **US1 Visual Redesign (Phase 3)**: Depends on Phase 2 completion
- **US2 Search & Filter (Phase 4)**: Depends on Phase 2 completion; can run in parallel with US1
- **US3 Date Picker (Phase 5)**: Depends on Phase 2 completion; can run in parallel with US1/US2
- **US4 Progress Tracking (Phase 6)**: Depends on Phase 2 completion; can run in parallel with US1-US3
- **US5 Header (Phase 7)**: Depends on Phase 1 completion only (design tokens); can run in parallel with US1-US4
- **US6 Todo Items Polish (Phase 8)**: Depends on US1 (T008) and US3 (T017) — builds on prior TodoItem changes
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent after Foundation — MVP deliverable
- **US2 (P2)**: Independent after Foundation — needs `filteredTodos` from composable (Phase 2)
- **US3 (P3)**: Independent after Foundation — needs `updateTodoDate` from composable (Phase 2)
- **US4 (P4)**: Independent after Foundation — needs `progressPercentage` from composable (Phase 2)
- **US5 (P5)**: Independent after Setup — pure visual component
- **US6 (P6)**: Depends on US1 + US3 (TodoItem restyling + date integration must be in place first)

### Within Each User Story

- Component creation before page integration
- Composable extensions before component consumption
- Core implementation before polish

### Parallel Opportunities

- T002 and T003 can run in parallel with each other (after T001)
- T007, T008, T009, T010, T011 can all run in parallel (US1 component restyling)
- US2, US3, US4, US5 can all start in parallel once Phase 2 is complete
- T024, T025, T026 can run in parallel (polish tasks)

---

## Parallel Example: User Story 1

```bash
# After Phase 2 is complete, launch all US1 component restyling in parallel:
Task T007: "Restyle TodoInput.vue — glassmorphism"
Task T008: "Restyle TodoItem.vue — circular checkbox, drag handle"
Task T009: "Restyle TodoList.vue — glassmorphism"
Task T010: "Restyle PaginationControl.vue — glassmorphism"
Task T011: "Restyle ConfirmationDialog.vue — glassmorphism"
```

## Parallel Example: Cross-Story

```bash
# After Phase 2, different stories can proceed simultaneously:
Story US2 (T012): "Create SearchFilter.vue"
Story US3 (T015): "Create DatePicker.vue"
Story US4 (T019): "Create ProgressCard.vue"
Story US5 (T021): "Create AppHeader.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (design token migration)
2. Complete Phase 2: Foundational (type + composable extensions)
3. Complete Phase 3: User Story 1 (visual redesign)
4. **STOP and VALIDATE**: Test the visual redesign independently
5. Deploy/demo if ready — app has the new light glassmorphism look

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Visual Redesign) → Test independently → Deploy (MVP!)
3. Add US2 (Search & Filter) → Test independently → Deploy
4. Add US3 (Date Picker) → Test independently → Deploy
5. Add US4 (Progress Tracking) → Test independently → Deploy
6. Add US5 (Header) → Test independently → Deploy
7. Add US6 (Todo Items Polish) → Test independently → Deploy
8. Complete Polish phase → Final validation → Deploy

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Visual Redesign) + US6 (Todo Items Polish)
   - Developer B: US2 (Search & Filter) + US4 (Progress Tracking)
   - Developer C: US3 (Date Picker) + US5 (Header)
3. Stories complete and integrate independently
4. Team runs Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No new runtime dependencies — all built with Vue 3, Nuxt, Tailwind CSS
- All glassmorphism styling uses Tailwind utilities (bg-white/70, backdrop-blur-md, border-white/40) + config tokens
