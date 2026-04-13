# Contract: `useTodos` Composable

**Branch**: `001-todo-app-mvp` | **Date**: 2026-04-13  
**File**: `composables/useTodos.ts`  
**Type**: Internal Vue composable — public API consumed by all components

---

## Overview

`useTodos` is the single source of truth for todo state. It exposes reactive state and mutation functions to all components. It handles serialisation to and hydration from `localStorage` transparently.

---

## Signature

```typescript
function useTodos(): {
  // State (readonly from consumer perspective)
  todos: Readonly<Ref<Todo[]>>
  storageError: Readonly<Ref<string | null>>

  // Computed
  pendingCount: ComputedRef<number>
  completedCount: ComputedRef<number>

  // Mutations
  addTodo(text: string): void
  toggleTodo(id: string): void
  deleteTodo(id: string): void
}
```

---

## Behaviours

### `addTodo(text: string)`

- Trims `text`
- Validates: non-empty; max 200 characters — throws `Error` (with message) if violated
- Generates a UUID v4 `id` and `Date.now()` timestamp
- Prepends OR appends the new `Todo` to `todos` (append — oldest first ordering)
- Persists updated array to `localStorage`

### `toggleTodo(id: string)`

- Finds todo by `id`; no-op if not found (defensive)
- Flips `completed` between `true` and `false`
- Persists updated array to `localStorage`

### `deleteTodo(id: string)`

- Removes the todo with matching `id` from the array; no-op if not found
- Persists updated array to `localStorage`

### `storageError`

- `null` under normal conditions
- Set to a human-readable message string if `localStorage.setItem` throws (e.g., quota exceeded)
- Consumers SHOULD render a non-blocking warning banner when this is non-null

---

## localStorage Integration

| Operation | Behaviour |
|---|---|
| **Hydration** | Runs in `onMounted` (client-only). Reads `vibe-todo:todos`, parses JSON. On parse error → resets to `[]`. |
| **Sync** | `watch(todos, { deep: true })` writes to `localStorage` on every mutation. Guarded by `import.meta.client`. On write error → sets `storageError`. |

---

## Validation Errors

Thrown as `Error` instances from `addTodo`:

| Condition | Message |
|---|---|
| Empty text after trim | `"Todo text cannot be empty."` |
| Text > 200 characters | `"Todo text cannot exceed 200 characters."` |

Components MUST catch these and display inline form validation feedback.

---

## Usage Example

```vue
<script setup lang="ts">
const { todos, addTodo, toggleTodo, deleteTodo, storageError } = useTodos()
</script>
```
