# Implementation Plan: Todo App MVP

**Branch**: `001-todo-app-mvp` | **Date**: 2026-04-13 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-todo-app-mvp/spec.md`

## Summary

Build a single-page todo tracking web application with full CRUD operations (create, complete, delete) persisted to `localStorage`, wrapped in a retro neo purple 80s visual theme. The UI is built as Vue 3 SFCs within Nuxt.js, styled with Tailwind CSS extended with a custom purple palette, retro pixel typography ("Press Start 2P" font), and neon glow box-shadow utilities. The app is deployed as a statically generated site (`nuxt generate`); no backend or authentication is required.

## Technical Context

**Language/Version**: TypeScript 5.x (mandatory per constitution)  
**Primary Dependencies**: Vue 3, Nuxt.js 3, Vite (via Nuxt), Tailwind CSS  
**Storage**: Browser `localStorage` — key `vibe-todo:todos`, JSON-serialised array of `Todo` objects  
**Testing**: Vitest + `@nuxt/test-utils`  
**Target Platform**: Web browser — latest 2 versions of Chrome, Firefox, Safari, Edge  
**Project Type**: Web application (SPA via `nuxt generate` static generation)  
**Performance Goals**: Core interactions (create/complete/delete) completable in ≤ 2 clicks; first paint < 1 s on a modern connection  
**Constraints**: Responsive across mobile (≥320 px) and desktop; offline-capable (localStorage only); TypeScript only; no external auth  
**Scale/Scope**: Single-user, client-only MVP; ~4 Vue components, 1 composable, 1 page

## Constitution Check

*GATE: Evaluated pre-Phase 0 and re-confirmed post-Phase 1.*

| Gate | Status | Rationale |
|---|---|---|
| I. Component-Driven Architecture | ✅ PASS | `pages/index.vue` orchestrates `TodoInput`, `TodoList`, `TodoItem` SFCs; state managed in `useTodos` composable |
| II. Retro 80s Design Consistency | ✅ PASS | All styling via Tailwind; `tailwind.config.ts` extended with neon-purple palette, `boxShadow` glow utilities, and "Press Start 2P" font |
| III. Technology Stack Discipline | ✅ PASS | No runtime dependencies added beyond Vue 3 + Nuxt + Tailwind; "Press Start 2P" loaded via Nuxt font module (zero-runtime-cost) |
| IV. Simplicity First | ✅ PASS | Single page, no routing, no backend; `useTodos` is the only composable; direct `localStorage` — no repository pattern or store library |
| V. UX Focus | ✅ PASS | All core interactions in 1 click; responsive Tailwind grid layout; visual feedback on every action |

**Post-Phase 1 re-check**: No new violations introduced by design artifacts. ✅

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app-mvp/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── use-todos.md     # Phase 1 output — useTodos composable contract
└── tasks.md             # Phase 2 output (/speckit.tasks — not created here)
```

### Source Code (repository root)

```text
pages/
└── index.vue              # Root page "/" — orchestrates the todo app UI

components/
├── TodoInput.vue          # Controlled input + submit button for adding todos
├── TodoList.vue           # Renders the full list (delegates to TodoItem)
└── TodoItem.vue           # Single todo row: checkbox, text, delete button

composables/
└── useTodos.ts            # Reactive todo state + localStorage persistence

assets/
└── css/
    └── main.css           # Tailwind @base / @components / @utilities directives

public/
└── favicon.ico

nuxt.config.ts             # Nuxt config: Tailwind module, font module, generate mode
tailwind.config.ts         # Extended palette (neon-purple), boxShadow glow, font family
tsconfig.json
package.json
```

**Structure Decision**: Single Nuxt project at the repository root. No backend; no separate frontend directory. Follows Nuxt conventions directly — file-based routing, auto-imported composables and components per Constitution §I.
