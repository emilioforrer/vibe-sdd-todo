# Data Model: Schedule & Filter with Visual Redesign

**Feature**: 002-schedule-filter  
**Date**: 2026-04-29

## Entities

### Todo (extended)

The existing `Todo` type in `types/todo.ts` is extended with an optional `scheduledDate` field.

```typescript
export interface Todo {
  id: string              // crypto.randomUUID() — unique identifier
  text: string            // Task description, 1–200 characters
  completed: boolean      // Completion status
  createdAt?: number      // Unix timestamp (ms) when created — existing field
  order?: number          // Display order index — existing field
  scheduledDate?: string  // ISO 8601 date string (YYYY-MM-DD), e.g. "2026-04-29" — NEW
}
```

**Field details for `scheduledDate`**:
- Type: `string` (ISO 8601 date, no time component) — stored as `"2026-04-29"` format
- Optional: tasks may be created without a date
- Display format: `"Apr 29, 2026"` (Intl.DateTimeFormat with `month: 'short', day: 'numeric', year: 'numeric'`)
- Rationale for `string` over `number` (timestamp): Dates are date-only (no time), so a date string avoids timezone conversion bugs. `"2026-04-29"` is unambiguous and directly comparable.

**Validation rules**:
- `id`: Auto-generated via `crypto.randomUUID()`. Never user-provided.
- `text`: Must be non-empty after trimming. Maximum 200 characters.
- `completed`: Defaults to `false` on creation.
- `createdAt`: Set to `Date.now()` on creation. Not backfilled for legacy todos (per existing FR-021).
- `order`: Set to array length on creation. Updated on reorder.
- `scheduledDate`: Optional. If provided, must be a valid ISO 8601 date string. No past-date restriction.

**State transitions**:
- Created → `{ completed: false, scheduledDate: undefined | "YYYY-MM-DD" }`
- Toggled → `completed` flips between `true` and `false`
- Date assigned/changed → `scheduledDate` updated to new date string
- Date removed → `scheduledDate` set to `undefined`
- Deleted → removed from array

### FilterStatus (new)

Enumerated type for the active filter tab.

```typescript
export type FilterStatus = 'today' | 'all' | 'pending' | 'completed'
```

**Values**:
- `'today'` (default): Shows tasks with `scheduledDate` matching today's date OR tasks without a `scheduledDate`
- `'all'`: Shows all tasks regardless of status or date
- `'pending'`: Shows tasks where `completed === false`
- `'completed'`: Shows tasks where `completed === true`

### ProgressSummary (derived)

A derived view computed from the full todos array (not filtered). Not persisted.

```typescript
interface ProgressSummary {
  total: number           // todos.length
  completed: number       // todos.filter(t => t.completed).length
  percentage: number      // Math.round((completed / total) * 100) || 0
}
```

## Relationships

```
Todo[] ──(filtered by)──> FilterStatus + searchQuery ──> filteredTodos[]
Todo[] ──(derived)──────> ProgressSummary
filteredTodos[] ──(paginated)──> paginatedTodos[]
```

- A `FilterStatus` + search query combination determines which subset of `Todo[]` is visible.
- `ProgressSummary` is always derived from the full `Todo[]` array (not filtered results).
- Pagination operates on `filteredTodos[]`, not raw `todos[]`.

## Persistence

- **Storage mechanism**: Browser `localStorage`
- **Storage key**: `vibe-todo:todos` (unchanged)
- **Serialization**: `JSON.stringify(todos)` / `JSON.parse(raw)`
- **Migration**: Existing todos without `scheduledDate` field will work without migration — the field is optional and `undefined` serializes as absent in JSON.
- **Filter/search state**: Not persisted. Resets to `{ activeFilter: 'today', searchQuery: '' }` on page load.

## Schema Changes Summary

| Field | Before | After | Breaking? |
|-------|--------|-------|-----------|
| `Todo.scheduledDate` | N/A | `string?` (ISO date) | No — additive, optional |
| `FilterStatus` type | N/A | New union type | No — new type |
