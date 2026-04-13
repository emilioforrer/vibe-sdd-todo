# Data Model: Todo App MVP

**Branch**: `001-todo-app-mvp` | **Date**: 2026-04-13

---

## Entities

### Todo

Represents a single task to be tracked by the user.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `id` | `string` | Required; UUID v4; immutable | Unique identifier for the todo |
| `text` | `string` | Required; 1–200 characters; trimmed | The task description entered by the user |
| `completed` | `boolean` | Required; default `false` | Whether the task has been marked as done |
| `createdAt` | `number` | Required; Unix timestamp (ms); immutable | When the todo was created, used for ordering |

**TypeScript interface**:

```typescript
interface Todo {
  id: string        // UUID v4
  text: string      // 1–200 chars, trimmed
  completed: boolean
  createdAt: number // Date.now() at creation
}
```

---

## State

### TodoList

The complete collection of all `Todo` items for the current user session.

- Stored as a `Todo[]` array in `localStorage` under the key `vibe-todo:todos`
- Ordered by `createdAt` ascending (oldest first) for display
- Mutated only through the `useTodos` composable — never directly

---

## Validation Rules

| Rule | Field | Condition |
|---|---|---|
| V-001 | `text` | MUST NOT be empty or whitespace-only after trimming |
| V-002 | `text` | MUST NOT exceed 200 characters |
| V-003 | `id` | Generated at creation time; MUST be a valid UUID v4 |
| V-004 | `createdAt` | Generated at creation time via `Date.now()`; immutable |

---

## State Transitions

```
        addTodo(text)
  ┌─────────────────────────────┐
  │                             ▼
[not created]              pending (completed: false)
                                │
                    toggleTodo(id) ◄─────────────────┐
                                │                    │
                                ▼                    │
                          completed (completed: true) ┘
                                │
                  deleteTodo(id) (from either state)
                                │
                                ▼
                          [removed]
```

---

## Persistence Contract

| Key | Value | Format |
|---|---|---|
| `vibe-todo:todos` | Serialised `Todo[]` array | JSON string via `JSON.stringify` / `JSON.parse` |

**Error behaviour**: If `JSON.parse` throws (corrupted data), the composable resets to an empty array `[]` and continues. If `JSON.stringify` + `localStorage.setItem` throws (e.g., `QuotaExceededError`), a warning state is set so the UI can surface it. In-memory state remains usable.
