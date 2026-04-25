# Data Model: UX Improvement – Vibe Todo

**Phase**: 1 (Design)  
**Date**: April 23, 2026  
**Related**: [research.md](research.md), [contracts/](contracts/)

---

## Overview

This document defines the updated data schema and validation rules for the UX Improvement feature. The core entity (`Todo`) is extended to include creation timestamp metadata; all other data structures remain unchanged from the MVP.

---

## Entity: Todo (Extended)

### Schema

```typescript
// types/todo.ts
interface Todo {
  id: string;                    // UUID generated at creation (existing)
  text: string;                  // Task label (existing)
  completed: boolean;            // Completion status (existing)
  createdAt?: number;            // NEW: Timestamp in milliseconds since epoch
  order?: number;                // NEW: Position in task list (for reordering)
}

// Type aliases for clarity
type TodoId = string;
type TodoTimestamp = number; // milliseconds since Date.now()
type TodoOrder = number;     // 0-indexed position in list
```

### Field Details

| Field | Type | Required? | Notes | Validation |
|-------|------|-----------|-------|-----------|
| `id` | `string` | Yes | UUID; immutable | Must be non-empty, unique |
| `text` | `string` | Yes | Task label | Non-empty, max 500 chars |
| `completed` | `boolean` | Yes | Completion flag | Must be `true` or `false` |
| `createdAt` | `number` \| `undefined` | No | Epoch timestamp (ms) | Must be ≤ `Date.now()`, or `undefined` for legacy tasks |
| `order` | `number` \| `undefined` | No | List position (0-indexed) | Must be ≥ 0, or `undefined` if auto-ordered |

### Validation Rules

1. **ID Uniqueness**: No two todos in the list share the same `id`.
2. **Text Non-Empty**: `text.length > 0 && text.length <= 200` (matches existing `addTodo` validation).
3. **Completed Boolean**: `typeof completed === "boolean"`.
4. **Timestamp Validity**: `createdAt === undefined || (typeof createdAt === "number" && createdAt <= Date.now())`.
5. **Order Validity**: `order === undefined || (typeof order === "number" && order >= 0 && order < todos.length)`.

### Backward Compatibility

- **Legacy Tasks** (pre-feature): May lack `createdAt` field. Display "Date unknown" when rendering.
- **Legacy Tasks without `order`**: Preserve existing array position; auto-calculate `order` on first reorder.

### Default Values at Creation

```typescript
const newTodo: Todo = {
  id: generateUUID(),
  text: inputValue,
  completed: false,
  createdAt: Date.now(),      // NEW: Always set for new tasks
  order: todos.length,        // NEW: Append to end of list
};
```

---

## Collection: Todos Array

### Storage Format

```typescript
// In localStorage with key "vibe-todo:todos"
const todosArray: Todo[] = [
  {
    id: "abc-123",
    text: "Buy groceries",
    completed: false,
    createdAt: 1713897600000,  // Apr 23, 2026 2:30 PM UTC
    order: 0,
  },
  {
    id: "def-456",
    text: "Write spec",
    completed: true,
    createdAt: 1713811200000,  // Apr 22, 2026 2:30 PM UTC (older)
    order: 1,
  },
  // ... more todos
];
```

### Ordering Semantics

- **Array Index**: Physical position in `todosArray[]`
- **`order` Field**: Logical position after drag-and-drop reordering
- **Reconciliation**: On load, sort by `order` field if present; otherwise preserve array order

### Persistence Strategy

- **Write on Change**: Every todo action (create, reorder, delete) triggers a single `localStorage.setItem("vibe-todo:todos", JSON.stringify(todos))` call
- **Read on Load**: App startup reads and deserializes from `localStorage`; no network I/O

---

## State Transitions

### Todo Lifecycle

```
[Created] --complete--> [Completed]
    |                         |
    |<----uncomplete-----------
    |
    +--delete--> [Deleted] (removed from list)
    
[Reorder] changes order field, does not change completed status
[Timestamp] immutable after creation (createdAt never changes)
```

### List Operations

| Operation | Input | Effect | Storage |
|-----------|-------|--------|---------|
| Create | `text: string` | Add new Todo with `createdAt: Date.now()` | Write all todos |
| Complete | `id: string` | Toggle `completed` boolean | Write all todos |
| Delete | `id: string` | Remove todo from list | Write remaining todos |
| Reorder | `fromIndex: number, toIndex: number` | Swap/move todo, update `order` field | Write all todos |

---

## Computed / Derived Values

### Relative Time Display

```typescript
// From composable or component
const getRelativeTime = (createdAt: number | undefined): string => {
  if (!createdAt) return "Date unknown";
  
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const nowMs = Date.now();
  const diffMs = createdAt - nowMs;
  
  // Return relative string: "2 hours ago", "in 3 minutes", etc.
  if (Math.abs(diffMs) < 60000) return rtf.format(Math.round(diffMs / 1000), "second");
  if (Math.abs(diffMs) < 3600000) return rtf.format(Math.round(diffMs / 60000), "minute");
  if (Math.abs(diffMs) < 86400000) return rtf.format(Math.round(diffMs / 3600000), "hour");
  return rtf.format(Math.round(diffMs / 86400000), "day");
};
```

### Absolute Time Display (Tooltip)

```typescript
const getAbsoluteTime = (createdAt: number): string => {
  const dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return dtf.format(new Date(createdAt));
};
```

---

## Example Data Scenarios

### Scenario 1: New Task (P1 Feature)

```typescript
// User creates task "Buy milk" at April 23, 2026, 2:30 PM

const newTodo: Todo = {
  id: "0a1b-2c3d",
  text: "Buy milk",
  completed: false,
  createdAt: 1713897000000,  // Exact timestamp
  order: 5,                   // Appended to 5 existing tasks
};

// Display:
// "Buy milk" 
// "just now" (if < 1 min) or "3 hours ago" (if 3 hours have passed)
// Hover tooltip: "Apr 23, 2026 2:30 PM"
```

### Scenario 2: Legacy Task (Pre-Feature)

```typescript
// Task exists from MVP; no createdAt field
const legacyTodo: Todo = {
  id: "abc-123",
  text: "Write documentation",
  completed: false,
  // createdAt missing
  order: 2,
};

// Display:
// "Write documentation"
// "Date unknown"
```

### Scenario 3: Reordered Task (P2 Feature)

```typescript
// User drags task at position 1 to position 3

// Before:
const todosBefore: Todo[] = [
  { id: "a", text: "Task A", order: 0 },
  { id: "b", text: "Task B", order: 1 },
  { id: "c", text: "Task C", order: 2 },
  { id: "d", text: "Task D", order: 3 },
];

// After user drags Task B to position 3:
const todosAfter: Todo[] = [
  { id: "a", text: "Task A", order: 0 },
  { id: "c", text: "Task C", order: 1 },
  { id: "d", text: "Task D", order: 2 },
  { id: "b", text: "Task B", order: 3 },
];

// Visual order on screen: A, C, D, B (matches order field)
```

---

## Constraints & Edge Cases

### Edge Case 1: Task with `createdAt` in the Future

- **Trigger**: User's system clock set incorrectly (rare)
- **Handling**: Treat as valid (don't validate `createdAt <= Date.now()` at runtime); display will show negative relative time ("in 3 hours")
- **Mitigation**: Not a critical issue; time normalizes when clock corrects

### Edge Case 2: Reordering All Tasks (Empty List → Populate → Reorder)

- **Trigger**: User creates 5 tasks, then reorders all
- **Handling**: All tasks receive `order: 0` → `4` at creation; reordering updates `order` field; array order may differ from `order` values (sync on next load)
- **Resolution**: On app startup, sort todos by `order` field to restore last-saved order

### Edge Case 3: Concurrent Modifications (If Multi-Tab Access Allowed in Future)

- **Current Scope**: Not applicable (single-tab MVP)
- **Future**: If implemented, add `version` field or timestamp to detect stale writes

### Edge Case 4: Very Long Task Text with Timestamps

- **Trigger**: User creates task with 500-char text
- **Handling**: Timestamp display is separate, below task text; text truncation not affected
- **Validation**: `text.length <= 500` (characters, not bytes)

---

## Migration Path from MVP

### Step 1: Load Existing Todos

On feature branch deploy:
```typescript
const todos = JSON.parse(localStorage.getItem("vibe-todo:todos") || "[]");
// Result: todos without createdAt field (backward-compatible)
```

### Step 2: Assign order to Legacy Tasks (createdAt is NOT auto-populated)

Per the spec (FR-021) and assumptions, legacy tasks without `createdAt` **must display "Date unknown"**. Do NOT backfill with `Date.now()`.

```typescript
const migratedTodos = todos.map((todo, index) => ({
  ...todo,
  // createdAt intentionally left as-is (undefined for legacy tasks → displays "Date unknown")
  order: todo.order ?? index, // Only backfill order from current array position
}))
localStorage.setItem('vibe-todo:todos', JSON.stringify(migratedTodos))
```

### Step 3: All New Tasks Generated with createdAt

From this point forward, all new tasks include `createdAt: Date.now()` and `order: todos.length`.

---

## Summary

✅ **Schema**: `Todo` type extended with `createdAt` and `order` fields  
✅ **Backward Compatibility**: Legacy tasks handled gracefully  
✅ **Validation**: Clear rules for all fields  
✅ **Persistence**: Single key in `localStorage`, JSON format  
✅ **State Transitions**: All operations defined  
✅ **Derived Values**: Relative/absolute time calculations documented
