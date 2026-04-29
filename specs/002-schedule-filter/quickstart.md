# Quickstart: Schedule & Filter with Visual Redesign

**Feature**: 002-schedule-filter  
**Date**: 2026-04-29

## Prerequisites

- Node.js LTS (18+)
- npm (project uses npm)

## Setup

```bash
# Ensure you're on the feature branch
git checkout 002-schedule-filter

# Install dependencies (no new packages required)
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:3000`.

## Implementation Order

The recommended implementation sequence follows the spec priority order and dependency chain:

### 1. Foundation: Design Token Migration (Story 1 - P1)

Update config files first — everything else depends on the new design tokens.

1. **`tailwind.config.ts`** — Replace old dark/neon tokens with new glassmorphism tokens (colors, fonts, shadows, border-radius)
2. **`nuxt.config.ts`** — Switch Google Fonts from Press Start 2P + Space Mono to Inter [400, 500]
3. **`assets/css/main.css`** — Add any custom Tailwind utilities if needed (likely unchanged)

### 2. Type Extension (Data Model)

4. **`types/todo.ts`** — Add `scheduledDate?: string` to the `Todo` interface. Add `FilterStatus` type.

### 3. Composable Extension (State Logic)

5. **`composables/useTodos.ts`** — Add search/filter state, filtered computed, progress stats, `updateTodoDate()`, updated `addTodo()` signature. Rewire pagination to use filtered results.

### 4. New Components

6. **`components/AppHeader.vue`** — New header with sparkles, subtitle, bell icon
7. **`components/ProgressCard.vue`** — Progress tracker with percentage and gradient bar
8. **`components/DatePicker.vue`** — Custom calendar dropdown date picker
9. **`components/SearchFilter.vue`** — Search input + filter tabs (Today/All/Pending/Completed)

### 5. Modified Components (Glassmorphism Restyling)

10. **`components/TodoInput.vue`** — Glassmorphism styling, integrate DatePicker, update addTodo call
11. **`components/TodoItem.vue`** — Glassmorphism card, circular checkbox, date subtitle, date editing
12. **`components/TodoList.vue`** — Glassmorphism styling, filter-aware empty states
13. **`components/PaginationControl.vue`** — Glassmorphism styling
14. **`components/ConfirmationDialog.vue`** — Glassmorphism styling

### 6. Page Assembly

15. **`pages/index.vue`** — Assemble all sections: AppHeader, ProgressCard, TodoInput, SearchFilter, TodoList, PaginationControl in new layout

## Verification

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## Key Design References

- **DESIGN.md** — Full design system specification (colors, typography, spacing, components)
- **specs/002-schedule-filter/spec.md** — Feature specification with acceptance scenarios
- **specs/002-schedule-filter/data-model.md** — Data model with entity definitions
- **specs/002-schedule-filter/contracts/component-contracts.md** — Component prop/emit interfaces
