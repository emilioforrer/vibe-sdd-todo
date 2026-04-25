# Implementation Plan: UX Improvement – Vibe Todo

**Branch**: `002-ux-improvement` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ux-improvement/spec.md`

## Summary

Adds five UX improvements to the existing Vibe Todo app: (1) refined header neon glow and always-visible delete button, (2) task creation date display with relative time + hover tooltip, (3) drag-and-drop task reordering persisted to localStorage, (4) delete confirmation dialog with keyboard support, and (5) pagination for lists exceeding 15 tasks. All changes are front-end only (Vue 3 + Nuxt.js), use no new runtime dependencies, and maintain the retro neo-purple visual identity.

## Technical Context

**Language/Version**: TypeScript 5.4 + Vue 3.4 (via Nuxt.js 3.11)
**Primary Dependencies**: Nuxt.js 3.11, Tailwind CSS 3.4, @nuxtjs/tailwindcss 6.12
**Storage**: localStorage (browser-native; existing `STORAGE_KEY = 'vibe-todo:todos'`)
**Testing**: No test runner currently installed (vitest to be added if test coverage required; deferred per YAGNI)
**Target Platform**: Web browser SPA — latest 2 versions of Chrome, Firefox, Safari, Edge
**Project Type**: web-application (Nuxt.js SPA/SSR)
**Performance Goals**: No noticeable lag with 100+ tasks; relative time formatting ≤1ms per item
**Constraints**: Frontend-only; no backend; localStorage persistence; all drag-and-drop via native Pointer Events API (no new runtime dependencies); offline-capable
**Scale/Scope**: Single-page app; up to 100+ tasks in localStorage (~50KB ceiling well within 5MB limit)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check | Notes |
|-----------|-------|-------|
| I. Component-Driven Architecture | ✅ PASS | New `ConfirmationDialog.vue` and `PaginationControl.vue` extracted as reusable SFCs; reorder logic in `useTodos.ts` composable; no direct DOM manipulation outside Vue reactivity |
| II. Retro 80s Design Consistency | ✅ PASS | FR-020 explicitly mandates retro neo-purple styling for all new elements; existing Tailwind color tokens (`neon-purple`, `neon-violet`, `dark-card`) reused |
| III. Technology Stack Discipline | ✅ PASS | No new runtime dependencies; drag-and-drop uses native Pointer Events API; relative time uses `Intl.RelativeTimeFormat` (browser-native); confirmation dialog uses `<Teleport to="body">` (Vue 3 built-in) |
| IV. Simplicity First | ✅ PASS | All five features solve direct user needs from spec; no speculative abstractions; pagination uses simple offset computation in composable |
| V. User Experience Focus | ✅ PASS | All interactions (create, complete, delete, reorder, paginate) remain achievable in 1-2 clicks/taps; visual feedback provided for drag state and deletion confirmation |

**Post-Phase 1 re-check**: No violations identified after design (see data-model.md). No Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/002-ux-improvement/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── todo-type-schema.md      # Todo TypeScript interface + validation + localStorage schema
│   ├── drag-drop-spec.md        # Drag-and-drop interaction contract (desktop + mobile)
│   └── component-interfaces.md # Vue component props/emits contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
types/
└── todo.ts               # MODIFY: add `order` field to Todo interface

composables/
└── useTodos.ts           # MODIFY: add reorderTodos(), pagination state, formatRelativeTime()

components/
├── TodoItem.vue          # MODIFY: add drag handle, creation date display, emit confirm-delete
├── TodoList.vue          # MODIFY: add Pointer Events drag-drop coordination, pagination
├── ConfirmationDialog.vue  # NEW: confirmation modal (Teleport to body, Escape/Enter keyboard)
└── PaginationControl.vue   # NEW: pagination controls (Previous/Next/page indicator)

pages/
└── index.vue             # MODIFY: wire ConfirmationDialog, pass delete handler

app.vue                   # no change
tailwind.config.ts        # no change (existing tokens sufficient)
nuxt.config.ts            # no change
```

**Structure Decision**: Single web-application project (Option 2 variant — frontend-only Nuxt SPA). All feature code lives in the repository root's `components/`, `composables/`, `types/`, and `pages/` directories per Nuxt conventions and Constitution Principle I.
