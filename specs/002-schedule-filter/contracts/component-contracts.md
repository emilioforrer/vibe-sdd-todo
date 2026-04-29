# Component Contracts: Schedule & Filter with Visual Redesign

**Feature**: 002-schedule-filter  
**Date**: 2026-04-29

This project is a client-side SPA with no external APIs. The contracts below define the **component prop/emit interfaces** and **composable API** that serve as internal boundaries.

## Composable: `useTodos()`

The primary state management contract. All components consume state and actions through this composable.

### Returned API

```typescript
interface UseTodosReturn {
  // State (readonly)
  todos: Readonly<Ref<Todo[]>>
  storageError: Readonly<Ref<string | null>>
  
  // Filter & search state (read/write)
  searchQuery: Ref<string>
  activeFilter: Ref<FilterStatus>
  
  // Derived (readonly computed)
  filteredTodos: ComputedRef<Todo[]>
  paginatedTodos: ComputedRef<Todo[]>
  pendingCount: ComputedRef<number>
  completedCount: ComputedRef<number>
  totalCount: ComputedRef<number>
  todayCount: ComputedRef<number>
  progressPercentage: ComputedRef<number>
  
  // Pagination
  currentPage: Ref<number>
  totalPages: ComputedRef<number>
  setPage: (n: number) => void
  
  // Actions
  addTodo: (text: string, scheduledDate?: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  reorderTodos: (fromIndex: number, toIndex: number) => void
  updateTodoDate: (id: string, date: string | undefined) => void
}
```

### Changed from current API

| Change | Before | After |
|--------|--------|-------|
| `addTodo` signature | `(text: string) => void` | `(text: string, scheduledDate?: string) => void` |
| New: `searchQuery` | — | `Ref<string>` |
| New: `activeFilter` | — | `Ref<FilterStatus>` |
| New: `filteredTodos` | — | `ComputedRef<Todo[]>` |
| New: `totalCount` | — | `ComputedRef<number>` |
| New: `todayCount` | — | `ComputedRef<number>` |
| New: `progressPercentage` | — | `ComputedRef<number>` |
| New: `updateTodoDate` | — | `(id: string, date: string \| undefined) => void` |
| `paginatedTodos` | Slices from `todos` | Slices from `filteredTodos` |

## Component: `DatePicker.vue`

### Props

```typescript
interface DatePickerProps {
  modelValue?: string      // ISO date "YYYY-MM-DD" or undefined
  triggerClass?: string    // Optional CSS classes for the trigger button
}
```

### Emits

```typescript
interface DatePickerEmits {
  'update:modelValue': [date: string | undefined]
}
```

### Behavior
- Renders a calendar icon button as the trigger
- Opens a dropdown calendar panel on click
- Emits selected date on date cell click
- Closes on click-outside, Escape key, or date selection

## Component: `SearchFilter.vue`

### Props

```typescript
interface SearchFilterProps {
  searchQuery: string
  activeFilter: FilterStatus
  totalCount: number
  pendingCount: number
  completedCount: number
  todayCount: number
}
```

### Emits

```typescript
interface SearchFilterEmits {
  'update:searchQuery': [query: string]
  'update:activeFilter': [filter: FilterStatus]
}
```

## Component: `ProgressCard.vue`

### Props

```typescript
interface ProgressCardProps {
  total: number
  completed: number
  percentage: number
}
```

### Emits

None — display-only component.

## Component: `AppHeader.vue`

### Props

None — static display component.

### Emits

None.

## Component: `TodoInput.vue` (modified)

### Props

No change to existing props (none).

### Emits

No change — internally calls `addTodo()` from `useTodos()`.

### Internal changes
- Adds a `DatePicker` instance for optional date selection
- Passes `scheduledDate` to `addTodo(text, scheduledDate)` on submit

## Component: `TodoItem.vue` (modified)

### Props

```typescript
interface TodoItemProps {
  todo: Todo        // Now includes optional scheduledDate
  index: number     // unchanged
}
```

### Emits

```typescript
interface TodoItemEmits {
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
  'update-date': [id: string, date: string | undefined]  // NEW
}
```

## Component: `TodoList.vue` (modified)

### Props

```typescript
interface TodoListProps {
  todos: readonly Todo[]  // unchanged type, but now receives filtered + paginated slice
}
```

### Emits

```typescript
interface TodoListEmits {
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
  'update-date': [id: string, date: string | undefined]  // NEW — bubbled from TodoItem
}
```

## localStorage Schema

### Key: `vibe-todo:todos`

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "Buy groceries",
    "completed": false,
    "createdAt": 1745942400000,
    "order": 0,
    "scheduledDate": "2026-04-29"
  },
  {
    "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "text": "Call dentist",
    "completed": true,
    "createdAt": 1745856000000,
    "order": 1
  }
]
```

- `scheduledDate` is optional and omitted from JSON when not set
- Backward compatible: existing todos without `scheduledDate` load correctly
