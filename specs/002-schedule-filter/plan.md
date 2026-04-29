# Implementation Plan: Schedule & Filter with Visual Redesign

**Branch**: `002-schedule-filter` | **Date**: 2026-04-29 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-schedule-filter/spec.md`

## Summary

Complete visual redesign to light glassmorphism aesthetic per Figma design, plus new functional capabilities: search & filter (by keyword and status), task scheduling with custom date picker, progress tracking, and redesigned header/todo items. All changes use existing Vue 3 + Nuxt + Tailwind stack with localStorage persistence.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Vue 3.4, Nuxt 3.11, Tailwind CSS 3.4, @nuxtjs/google-fonts  
**Storage**: Browser localStorage (key `vibe-todo:todos`) — extend `Todo` type with optional `scheduledDate` field  
**Testing**: Vitest + @vue/test-utils + happy-dom  
**Target Platform**: Web browser (SPA, `ssr: false`)  
**Project Type**: Web application (SPA)  
**Performance Goals**: Instant UI response (<100ms) for all interactions; real-time progress updates  
**Constraints**: No new runtime dependencies; offline-capable (localStorage only); minimum 44×44px touch targets  
**Scale/Scope**: Single page app, ~6 components to modify/create, 1 composable to extend, 1 type to extend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Component-Driven Architecture | ✅ PASS | All new UI in Vue SFCs under `components/`; new state via composable in `composables/`; page in `pages/` |
| II. Figma-Driven Design Consistency | ✅ PASS | Visual design follows the Figma design file as the single source of truth. Glassmorphism aesthetic matches current Figma specifications. |
| III. Technology Stack Discipline | ✅ PASS | No new dependencies. Uses Vue 3, Nuxt, Tailwind CSS, Vite. Google Fonts switch from Press Start 2P/Space Mono to Inter via existing `@nuxtjs/google-fonts` module. |
| IV. Simplicity First | ✅ PASS | All features solve direct user needs (search, filter, scheduling, progress). Custom date picker avoids new dependency. |
| V. User Experience Focus | ✅ PASS | 1-2 click interactions preserved. Responsive design. Visual feedback for all actions. 44×44px touch targets. |
| Technology Stack Constraints | ✅ PASS | TypeScript used throughout. SPA mode (`ssr: false`). No new runtime deps. |

## Project Structure

### Documentation (this feature)

```text
specs/002-schedule-filter/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
types/
└── todo.ts              # Extended Todo type with scheduledDate

composables/
└── useTodos.ts          # Extended with search, filter, progress, date management

components/
├── AppHeader.vue        # NEW — redesigned header with sparkles, subtitle, bell
├── ProgressCard.vue     # NEW — progress tracker with percentage bar
├── TodoInput.vue        # MODIFIED — glassmorphism styling, calendar button, date picker
├── DatePicker.vue       # NEW — custom calendar dropdown date picker
├── SearchFilter.vue     # NEW — search input + filter tabs (Today/All/Pending/Completed)
├── TodoList.vue         # MODIFIED — glassmorphism styling, empty states per filter
├── TodoItem.vue         # MODIFIED — glassmorphism card, circular checkbox, date subtitle
├── PaginationControl.vue # MODIFIED — glassmorphism styling
└── ConfirmationDialog.vue # MODIFIED — glassmorphism styling

pages/
└── index.vue            # MODIFIED — new layout with all redesigned sections

assets/css/
└── main.css             # MODIFIED — add glassmorphism utilities if needed

nuxt.config.ts           # MODIFIED — update Google Fonts to Inter
tailwind.config.ts       # MODIFIED — new design tokens (colors, fonts, shadows)
```

**Structure Decision**: Single-project Nuxt SPA structure preserved. New components added under `components/`, composable extended in-place. No new directories needed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations — all principles pass.
