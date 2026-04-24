# Contract: Extended Todo Type Schema

**Feature**: UX Improvement – Task Creation Metadata & Reordering  
**Related**: [data-model.md](../data-model.md), [composables/useTodos.ts](../../../composables/useTodos.ts)

---

## Overview

This contract defines the extended `Todo` type interface with new `createdAt` and `order` fields. All consumers of the `Todo` type (components, composables, tests) must adhere to this contract.

---

## Type Definition

### TypeScript Interface

```typescript
// types/todo.ts
interface Todo {
  // Existing fields (MVP)
  id: string;           // Unique identifier (UUID v4)
  text: string;         // Task label / description
  completed: boolean;   // Completion status

  // New fields (UX Improvement feature)
  createdAt?: number;   // Timestamp in milliseconds since epoch (Date.now())
  order?: number;       // Position in the task list (0-indexed)
}

// Const type for immutable todo creation
type NewTodo = Omit<Todo, "id"> & { id?: never };
```

### Field Semantics

| Field | Type | Nullable? | Immutable? | Semantics |
|-------|------|-----------|-----------|-----------|
| `id` | `string` | No | Yes | Generated once at creation, never changes |
| `text` | `string` | No | No | Editable (not in MVP, may be added later) |
| `completed` | `boolean` | No | No | Toggled by user; always present |
| `createdAt` | `number` \| `undefined` | Yes | Yes | Set at creation; never updated; `undefined` for legacy tasks |
| `order` | `number` \| `undefined` | Yes | No | Updated on reorder; `undefined` if auto-ordered |

---

## Validation & Constructor

### Creating a New Todo

```typescript
// Correct: Creating with all fields
const todo: Todo = {
  id: generateUUID(),
  text: "Buy groceries",
  completed: false,
  createdAt: Date.now(),
  order: 0,
};

// Correct: Creating without order (will be auto-assigned)
const todo: Todo = {
  id: generateUUID(),
  text: "Buy groceries",
  completed: false,
  createdAt: Date.now(),
  // order omitted
};

// INCORRECT: Missing required fields
const todo: Todo = {
  id: generateUUID(),
  text: "Buy groceries",
  // ❌ completed missing — compile error (TypeScript will catch)
};

// INCORRECT: Invalid createdAt
const todo: Todo = {
  id: generateUUID(),
  text: "Buy groceries",
  completed: false,
  createdAt: Date.now() + 1000000, // ❌ Future timestamp (invalid)
};
```

### Validation Function

```typescript
// Composable or utility
export const isValidTodo = (todo: unknown): todo is Todo => {
  if (!todo || typeof todo !== "object") return false;
  
  const t = todo as any;
  
  // Required fields
  if (typeof t.id !== "string" || !t.id) return false;
  if (typeof t.text !== "string" || !t.text || t.text.length > 200) return false;
  if (typeof t.completed !== "boolean") return false;
  
  // Optional fields
  if (t.createdAt !== undefined && (typeof t.createdAt !== "number" || t.createdAt > Date.now())) {
    return false; // createdAt must be in the past or undefined
  }
  if (t.order !== undefined && (typeof t.order !== "number" || t.order < 0)) {
    return false;
  }
  
  return true;
};
```

---

## Serialization / Deserialization

### JSON Format (for localStorage)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": 1713897000000,
    "order": 0
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "text": "Write spec",
    "completed": true,
    "createdAt": 1713810600000,
    "order": 1
  }
]
```

### Deserialization (Loading from localStorage)

```typescript
export const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem("vibe-todo:todos");
    if (!raw) return [];
    
    const parsed: unknown[] = JSON.parse(raw);
    return parsed.filter(isValidTodo); // Filter out invalid entries
  } catch (err) {
    console.error("Failed to load todos:", err);
    return [];
  }
};
```

### Serialization (Saving to localStorage)

```typescript
export const saveTodos = (todos: Todo[]): void => {
  // Validate all todos before saving
  if (!todos.every(isValidTodo)) {
    throw new Error("Invalid todo in list; cannot save");
  }
  
  localStorage.setItem("vibe-todo:todos", JSON.stringify(todos));
};
```

---

## Backward Compatibility

### Legacy Tasks (Pre-Feature)

Tasks loaded from MVP may lack `createdAt` and `order` fields:

```typescript
// Legacy todo from MVP
const legacyTodo = {
  id: "old-id",
  text: "Old task",
  completed: false,
  // createdAt missing
  // order missing
};

// Validation still passes (both fields optional)
isValidTodo(legacyTodo); // → true
```

### Migration on Feature Deploy

Per FR-021 and the spec assumptions, legacy tasks without `createdAt` MUST display "Date unknown" — do NOT backfill with `Date.now()`. Only backfill `order`.

```typescript
// Migrate legacy todos on app startup: only assign order, never backfill createdAt
export const ensureOrderField = (todos: Todo[]): Todo[] => {
  return todos.map((todo, index) => ({
    ...todo,
    // createdAt intentionally preserved as-is: undefined → "Date unknown" display
    order: todo.order ?? index, // Use current array position if missing
  }))
}
```

---

## Consumer Expectations

### Components

- **Input**: Expect `Todo` to always have `id`, `text`, `completed`
- **Optional**: Handle missing `createdAt` (display "Date unknown")
- **Optional**: Handle missing `order` (use array index as fallback)

```vue
<script setup lang="ts">
import type { Todo } from "~/types/todo";

defineProps<{
  todo: Todo;
}>();
</script>

<template>
  <div class="todo-item">
    <span class="text">{{ todo.text }}</span>
    <span class="timestamp">
      {{ todo.createdAt ? formatTime(todo.createdAt) : "Date unknown" }}
    </span>
  </div>
</template>
```

### Composables

- **Input**: Receive `Todo[]` array from localStorage
- **Processing**: Validate, migrate, and maintain invariants (unique IDs, valid timestamps)
- **Output**: Return validated, migrated `Todo[]`

```typescript
export const useTodos = () => {
  const todos = ref<Todo[]>([]);
  
  const load = () => {
    const loaded = loadTodos() // Deserialize + validate
    const migrated = ensureOrderField(loaded) // Only backfill order field; createdAt preserved
    todos.value = migrated
  }
  
  const save = () => {
    saveTodos(todos.value); // Validate + serialize
  };
  
  return { todos, load, save };
};
```

### Tests

- **Unit Tests**: Validate `isValidTodo` with valid/invalid inputs
- **Integration Tests**: Load, save, and round-trip todos via localStorage
- **Regression Tests**: Ensure legacy todos without `createdAt` are handled correctly

---

## API for Feature Implementations

### Timestamp Display Helpers

```typescript
// components/TimeDisplay.vue or composable
export const getRelativeTime = (createdAt: number | undefined): string => {
  if (!createdAt) return "Date unknown";
  // Returns: "2 hours ago", "just now", etc.
};

export const getAbsoluteTime = (createdAt: number): string => {
  // Returns: "Apr 23, 2026 2:30 PM"
};
```

### Reordering Helpers

```typescript
export const reorderTodo = (todos: Todo[], fromIndex: number, toIndex: number): Todo[] => {
  const updated = [...todos];
  const [item] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, item);
  
  // Update order field to reflect new positions
  return updated.map((todo, index) => ({ ...todo, order: index }));
};
```

---

## Breaking Changes (None)

- MVP code continues to work without modifications (backward-compatible)
- Existing tests pass without changes (new fields optional)
- `Todo` type is extended, not replaced

---

## Summary

✅ **Contract**: `Todo` type extended with optional `createdAt` and `order` fields  
✅ **Validation**: Clear rules for field types and values  
✅ **Serialization**: JSON format matches localStorage convention  
✅ **Backward Compatibility**: Legacy tasks handled gracefully  
✅ **Migration**: Auto-migrate on feature deploy  
✅ **Consumer API**: Clear expectations for components, composables, tests
