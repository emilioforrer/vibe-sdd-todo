# Research: Todo App MVP

**Branch**: `001-todo-app-mvp` | **Date**: 2026-04-13  
**Status**: Complete — all NEEDS CLARIFICATION resolved

---

## R-001: Retro Pixel Font Integration in Nuxt + Tailwind

**Decision**: Use "Press Start 2P" (Google Fonts) loaded via `@nuxtjs/google-fonts` module; register as `font-retro` in `tailwind.config.ts`.

**Rationale**: "Press Start 2P" is the canonical retro pixel/8-bit font, universally recognised as an 80s aesthetic reference. The `@nuxtjs/google-fonts` module handles `<link>` injection at build time with zero runtime overhead and no additional npm package in the bundle. Registering it in Tailwind's `fontFamily` config makes it composable as a utility class (`font-retro`).

**Alternatives considered**:
- Self-hosted font files — correct option if GDPR/privacy requirements existed, but adds unnecessary asset management overhead for an MVP
- VueUse + custom CSS `@font-face` — no benefit over Nuxt module approach; more boilerplate
- Other retro fonts (Orbitron, VT323) — Orbitron is too "sci-fi"; VT323 is a valid secondary option for body text but less distinct than Press Start 2P for headings

**Implementation note**: "Press Start 2P" is intended for headings and UI labels, not long text. Body text and todo item text should use a complementary sans-serif (e.g., system-ui or "Space Mono") at readable sizes.

---

## R-002: Neon Glow Effects via Tailwind Custom Utilities

**Decision**: Extend `tailwind.config.ts` `theme.extend.boxShadow` with named glow utilities. Apply to buttons, checkbox labels, active inputs, and headings via `shadow-neon-*` classes.

**Rationale**: Tailwind's `boxShadow` extension is the idiomatic way to add reusable glow effects without writing raw CSS files. CSS `box-shadow` with a spread and large blur radius on a purple hue produces an authentic neon glow effect. The `text-shadow` equivalent can be achieved via a plugin or Tailwind's arbitrary value syntax (`[text-shadow:0_0_10px_#d946ef]`).

**Color palette decision**: The neon purple palette uses:
- `neon-purple`: `#d946ef` (Tailwind's fuchsia-500 — vivid, high contrast)  
- `neon-violet`: `#8b5cf6` (violet-500 — deeper purple for backgrounds)  
- `dark-bg`: `#0d0015` (near-black with purple hue for the page background)
- `glow-purple`: used in `boxShadow`: `0 0 8px #d946ef, 0 0 20px #a21caf`

**Alternatives considered**:
- CSS custom properties + a global stylesheet — conflicts with Constitution §II (all styling via Tailwind)
- A third-party "glowing buttons" library — introduces a dependency without justification (Constitution §III)

---

## R-003: SSR-Safe localStorage Persistence in Nuxt Composable

**Decision**: Implement a `useTodos` composable using Nuxt's `useState` for SSR-safe reactive state, with a `watch` that syncs to `localStorage` on the client only (guarded by `import.meta.client`). Initial hydration reads from `localStorage` inside an `onMounted` hook.

**Rationale**: Nuxt 3 runs on both server and client. `localStorage` is a browser-only API — accessing it during SSR throws a `ReferenceError`. The correct pattern is:
1. `useState('todos', () => [])` — provides SSR-safe shared state across components
2. In `onMounted`, hydrate from `localStorage` (runs only in browser)
3. `watch(todos, ...)` with `{ deep: true }` writes back to `localStorage` on every change (also client-only via guard)

This avoids adding VueUse (`useLocalStorage`) as a dependency, which would be unjustified per Constitution §III for a single composable behaviour.

**Error handling**: Wrap all `localStorage` reads/writes in `try/catch`. On `QuotaExceededError` or any parse failure, surface a user-visible warning (e.g., a dismissible banner) and degrade gracefully — the in-memory state remains functional for the session.

**Alternatives considered**:
- VueUse `useLocalStorage` — correct and elegant, but introduces a dependency not justified by the constitution for a single use case
- Pinia store with a persistence plugin — significantly over-engineered for a single entity on an MVP (Constitution §IV)
- Nuxt `useState` only (no localStorage) — fails SC-004 (persistence across sessions)

**localStorage key**: `vibe-todo:todos` (namespaced to avoid collisions)

---

## R-004: Deployment Mode — `nuxt generate` vs `nuxt build`

**Decision**: Use `nuxt generate` (static generation).

**Rationale**: The app has exactly one route (`/`), no server-side API routes, and all persistence is in the browser. Static generation produces a fully standalone directory of HTML/CSS/JS assets that can be served from any CDN or static host (GitHub Pages, Netlify, Vercel static) without a Node.js server. This aligns with the MVP's simplicity goals (Constitution §IV) and minimises operational overhead.

**Alternatives considered**:
- `nuxt build` (SSR) — appropriate if server-side rendering, API routes, or dynamic data were required; none apply here
- Vite SPA without Nuxt — would lose Nuxt's conveniences (auto-imports, file routing, font module), violates Constitution §III

---

## R-005: Todo Text Length Constraint

**Decision**: Enforce a 200-character maximum on `todo.text`. Display a real-time character counter that turns neon-red when the user approaches the limit.

**Rationale**: Q2 from the clarification session was not answered before planning; the recommended default (200 chars) is adopted. 200 characters is sufficient for any actionable task description. A character counter provides clear feedback without interrupting the user's flow.

**Alternatives considered**:
- No limit — risks edge cases in UI rendering and localStorage storage
- 500-char limit — larger than needed for a task description; makes the counter less useful
