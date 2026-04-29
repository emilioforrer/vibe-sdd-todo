# Research: Schedule & Filter with Visual Redesign

**Feature**: 002-schedule-filter  
**Date**: 2026-04-29

## 1. Glassmorphism with Tailwind CSS 3.4

- **Decision**: Extend Tailwind config with named design tokens for glass surfaces and shadows; use built-in opacity modifier syntax (`bg-white/70`, `border-white/40`) for translucent surfaces.
- **Rationale**: Tailwind 3.4 ships `backdrop-blur-*` and `bg-white/{opacity}` natively. Defining shadow tokens in config (`glass-sm`, `glass-lg`) keeps templates clean and the design system enforceable. No plugins needed.
- **Alternatives considered**:
  - Arbitrary values only (`bg-[rgba(255,255,255,0.7)]`): Long, non-reusable class strings.
  - Custom CSS classes in `main.css`: Breaks the Tailwind-only styling rule.
  - Tailwind glassmorphism plugin: Adds a dependency — prohibited.

**Key implementation notes**:
- Surfaces: `bg-white/70`, `bg-white/60` — native syntax, no config needed.
- Backdrop blur: `backdrop-blur-md` (12px built-in) for glass effect.
- Borders: `border-white/40` — native syntax.
- Shadows: Must define in config (multi-layer values can't be expressed with single utility).
- Gradient background: `bg-gradient-to-b from-[#F5F3FF] via-[#FAF5FF] to-[#FDF4FF]`.

## 2. Custom Calendar Date Picker (No Dependencies)

- **Decision**: Build a single `DatePicker.vue` SFC with a button trigger and floating calendar panel. Use a `ref<Date>` for displayed month, emit selected date, and use a small composable for click-outside detection.
- **Rationale**: Scope is limited (single date selection, no ranges, no time). A focused SFC avoids over-abstraction.
- **Alternatives considered**:
  - `<input type="date">`: Inconsistent styling across browsers, can't match glassmorphism design.
  - Headless UI date picker: Would add a dependency.
  - Teleporting dropdown: Unnecessary complexity for this use case.

**Key implementation notes**:
- Month grid: 6×7 grid (42 cells), computed from first day of month offset. Pure computed, no library.
- Navigation: Prev/next month buttons mutating a reactive `displayDate` ref.
- Positioning: `position: absolute; top: 100%` below trigger. On mobile, consider fixed bottom-sheet pattern.
- Click-outside: 10-line composable (`useClickOutside(el, callback)`), no dependency.
- Keyboard: `Tab`, `Enter`/`Space` to select, `Escape` to close. ARIA attributes for accessibility.
- Touch: 44×44px minimum cell size per design standards.

## 3. Search & Filter Reactivity Pattern

- **Decision**: Add `searchQuery` and `activeFilter` refs to existing `useTodos()` composable. Chain computed: `todos` → `filteredTodos` (filter + search) → `paginatedTodos` (page slice). Reset page on filter/search change.
- **Rationale**: Computed properties are idiomatic Vue 3 — lazy, cached, auto-tracking. Keeps composable API minimal.
- **Alternatives considered**:
  - Separate composable (`useFilteredTodos`): Over-engineers for single-page app (YAGNI).
  - Debouncing search: Unnecessary — filtering <1000 localStorage items is instant.
  - URL query params for filter state: Out of scope for this feature.

**Key implementation notes**:
- Filter type: `'today' | 'all' | 'pending' | 'completed'`, default `'today'`.
- "Today" filter: Compare scheduledDate's `getFullYear/Month/Date` against `new Date()`. Include undated tasks.
- Pagination: `paginatedTodos` slices from `filteredTodos` instead of `todos`. Watcher resets `currentPage` to 1 on filter/search change.
- Counts per tab: Separate computed properties for each filter count (used in tab labels).
- Progress stats (`pendingCount`/`completedCount`): Continue using full `todos` array (not filtered).

## 4. Tailwind CSS Design Token Migration

- **Decision**: Replace old tokens in `tailwind.config.ts` in a single pass. Do not keep old tokens alongside new ones.
- **Rationale**: DESIGN.md states "Don't mix old dark/neon retro aesthetic with the new light glassmorphism theme." Clean swap is safer for small app.
- **Alternatives considered**:
  - CSS custom properties: Adds indirection without benefit (no dark/light mode toggle).
  - Keeping old tokens with comments: Tailwind has no deprecation mechanism. Dead tokens create confusion.
  - Gradual migration: Extends transition period, risks visual inconsistency.

**New config token structure**:
- Colors: `primary`, `primary-mid`, `primary-end`, `border`, `text-dark`, `text-medium`, `text-subtle`, `text-placeholder`, `track`, `error`, `bg-start`, `bg-mid`, `bg-end`.
- Glass surfaces: Use built-in `bg-white/70`, `bg-white/60` instead of config tokens.
- Font: `sans: ['Inter', 'sans-serif']` — makes Inter the default.
- Shadows: `glass-sm` and `glass-lg` for two elevation levels.
- Border radius: Override `sm` (14px), `md` (16px), `lg` (24px) per DESIGN.md.

## 5. Inter Font via @nuxtjs/google-fonts

- **Decision**: Replace `googleFonts.families` in `nuxt.config.ts` to load `Inter: [400, 500]`. Override `fontFamily.sans` in Tailwind so Inter is the default sans-serif.
- **Rationale**: `@nuxtjs/google-fonts` (already installed at `^3.2.0`) handles fetching, preloading, and injection. Weights 400 and 500 match DESIGN.md exactly. `display: 'swap'` prevents FOIT.
- **Alternatives considered**:
  - Self-hosting Inter in `/public/fonts/`: Adds ~100KB to repo. CDN caching via Google Fonts is better.
  - `@font-face` in `main.css`: Loses automatic preload injection.
  - Adding weight 700: DESIGN.md only uses 400 and 500.
