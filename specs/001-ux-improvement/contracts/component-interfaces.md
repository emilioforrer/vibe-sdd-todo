# Contract: Vue Component Interfaces

**Feature**: UX Improvement – Vibe Todo
**Date**: 2026-04-23
**Related**: [data-model.md](../data-model.md), [drag-drop-spec.md](./drag-drop-spec.md)

---

## Overview

This contract defines the public interface (props and emits) for every Vue component
modified or created by this feature. Downstream components and the `pages/index.vue`
page must program against these interfaces.

---

## Modified: `TodoItem.vue`

### Props

```typescript
interface TodoItemProps {
  todo: Todo      // The task to render (id, text, completed, createdAt?, order?)
  index: number   // Zero-based position in the rendered list (used for DnD fromIndex)
}
```

### Emits

```typescript
interface TodoItemEmits {
  // Fired when the user confirms deletion via ConfirmationDialog
  'delete': (id: string) => void

  // Fired when the user toggles the completion checkbox
  'toggle': (id: string) => void

  // Fired when a desktop drag-and-drop reorder completes
  // fromIndex and toIndex are positions within the *current page* (paginatedTodos)
  'reorder': (fromIndex: number, toIndex: number) => void
}
```

### Behaviour notes

- The `×` delete button triggers `ConfirmationDialog` internally; the `delete` emit fires
  only after the user clicks "Confirm" (or presses Enter).
- The drag handle (`⠿`) is always visible (not only on hover) to provide a clear affordance.
- `createdAt` display: if `todo.createdAt` is falsy, render the string `"Date unknown"`.
- Relative time tooltip: `<span :title="absoluteTime">{{ relativeTime }}</span>` where
  `absoluteTime` uses `Intl.DateTimeFormat` and `relativeTime` uses `Intl.RelativeTimeFormat`.

---

## Modified: `TodoList.vue`

### Props

```typescript
interface TodoListProps {
  todos: readonly Todo[]   // Ordered slice of tasks to render (paginatedTodos from composable)
}
```

### Emits

```typescript
interface TodoListEmits {
  'toggle':  (id: string) => void
  'delete':  (id: string) => void
  // Passes through from TodoItem; indexes are page-local
  'reorder': (fromIndex: number, toIndex: number) => void
}
```

---

## New: `ConfirmationDialog.vue`

### Props

```typescript
interface ConfirmationDialogProps {
  isOpen:   boolean   // Controls visibility (v-if)
  taskText: string    // Displayed in the message: "Delete "Buy milk"?"
}
```

### Emits

```typescript
interface ConfirmationDialogEmits {
  // User clicked "Confirm" or pressed Enter
  'confirm': () => void
  // User clicked "Cancel", clicked backdrop, or pressed Escape
  'cancel':  () => void
}
```

### Behaviour notes

- Uses `<Teleport to="body">` to avoid clipping by `overflow: hidden` ancestors.
- On mount (`v-if` becomes `true`), attaches a `keydown` listener on `document`.
- On unmount, removes the `keydown` listener.
- Keyboard: `Escape` → emit `cancel`; `Enter` → emit `confirm`.
- Click outside (backdrop click) → emit `cancel`.
- Message format: `Are you sure you want to delete this task?`
  (with task label shown as secondary text for context).
- Follows retro neo-purple visual style (Constitution §II, FR-020):
  border `neon-violet`, background `dark-card`, button colours consistent with existing UI.

---

## New: `PaginationControl.vue`

### Props

```typescript
interface PaginationControlProps {
  currentPage: number   // 1-indexed current page
  totalPages:  number   // Total number of pages
}
```

### Emits

```typescript
interface PaginationControlEmits {
  // User clicked Previous or Next; newPage is 1-indexed
  'page-change': (newPage: number) => void
}
```

### Behaviour notes

- Rendered only when `totalPages > 1` (controlled by parent via `v-if`).
- "Previous" button is disabled when `currentPage === 1`.
- "Next" button is disabled when `currentPage === totalPages`.
- Page indicator format: `Page X of Y` (e.g., `Page 2 of 4`).
- Follows retro neo-purple visual style (FR-020).

---

## Modified: `pages/index.vue`

### Composable usage

```typescript
const {
  todos,           // full array (for count / page calculations)
  paginatedTodos,  // slice for current page → passed as :todos to TodoList
  currentPage,
  totalPages,
  storageError,
  toggleTodo,
  deleteTodo,
  reorderTodos,    // reorders within full array by translating page-local indexes
  setPage,
} = useTodos()
```

### Event wiring

```typescript
// TodoList emits
@toggle="toggleTodo"
@delete="deleteTodo"
@reorder="(from, to) => reorderTodos(from + (currentPage.value - 1) * PAGE_SIZE,
                                      to   + (currentPage.value - 1) * PAGE_SIZE)"

// PaginationControl emits
@page-change="setPage"
```

---

## `composables/useTodos.ts` — Public Return Shape

```typescript
interface UseTodosReturn {
  // State
  todos:         Readonly<Ref<Todo[]>>       // Full ordered list
  paginatedTodos: ComputedRef<Todo[]>        // Current page slice (up to 15 items)
  currentPage:   Readonly<Ref<number>>       // 1-indexed
  totalPages:    ComputedRef<number>         // Math.ceil(todos.length / PAGE_SIZE)
  storageError:  Readonly<Ref<string | null>>

  // Counts
  pendingCount:   ComputedRef<number>
  completedCount: ComputedRef<number>

  // Actions
  addTodo(text: string): void          // Creates todo with createdAt + order
  toggleTodo(id: string): void
  deleteTodo(id: string): void         // Removes and re-normalises order fields
  reorderTodos(fromIndex: number, toIndex: number): void  // Absolute indexes in todos[]
  setPage(page: number): void
}

const PAGE_SIZE = 15
```

---

## Summary

| Component | Modified/New | Key Change |
|-----------|-------------|------------|
| `TodoItem.vue` | Modified | Adds drag handle, creation date, confirmation dialog, `reorder` emit |
| `TodoList.vue` | Modified | Passes `index` to `TodoItem`, proxies `reorder` emit |
| `ConfirmationDialog.vue` | New | Teleported modal with keyboard support |
| `PaginationControl.vue` | New | Previous/Next with page indicator |
| `pages/index.vue` | Modified | Wires pagination + delete confirmation + reorder |
| `composables/useTodos.ts` | Modified | Adds `paginatedTodos`, `reorderTodos`, `setPage` |
