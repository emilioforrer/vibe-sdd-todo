# Research: UX Improvement – Vibe Todo

**Phase**: 0 (Clarification & Research)  
**Date**: April 23, 2026  
**Status**: Complete — no blocking unknowns

## Overview

This document captures research findings for the UX Improvement feature. All clarifications recorded in the feature specification are resolved; no blocking technical unknowns prevent proceeding to Phase 1 design.

---

## Research Topics

### 1. Header Glow Styling Refinement

**Question**: How should the header glow effect be refined to avoid being oversized or overwhelming?

**Decision**: Adjust Tailwind `boxShadow` configuration in `tailwind.config.ts`.

**Rationale**:
- MVP uses custom Tailwind `boxShadow` utilities for neon glow effects
- The "VIBE TODO" heading size (h1, ~32px) should have proportional shadow parameters
- Reduce blur radius and spread to scale with heading dimensions

**Implementation Approach**:
```text
Current: boxShadow: { glow: "0 0 30px 10px rgba(168, 85, 247, 0.8)" }
Refined: boxShadow: { glow: "0 0 20px 5px rgba(168, 85, 247, 0.6)" }
```

**Alternatives Considered**:
- CSS filter drop-shadow: Rejected (less browser-controllable for blur/spread)
- SVG filter: Rejected (over-complicated for retro aesthetic)

---

### 2. Task Creation Timestamp Display

**Question**: How should task creation timestamps be generated, formatted, and handled for tasks predating this feature?

**Decision**: 
- Generate `createdAt` at task creation time (milliseconds since epoch)
- Display relative format via `Intl.RelativeTimeFormat` (e.g., "2 hours ago")
- Provide absolute time tooltip via `Intl.DateTimeFormat` (e.g., "Apr 23, 2026 2:30 PM")
- For legacy tasks (pre-feature), display "Date unknown" placeholder

**Rationale**:
- `Intl` APIs are native (zero dependencies) and widely supported (Chrome 71+, Firefox 65+, Safari 14+)
- Relative time is more user-friendly for recent tasks; absolute time provides precision
- Graceful degradation for missing metadata maintains MVP compatibility

**Implementation Approach**:
```typescript
// In composable or component:
const formatRelativeTime = (createdAt: number | undefined) => {
  if (!createdAt) return "Date unknown";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = createdAt - Date.now();
  if (diff > -60000) return rtf.format(Math.round(diff / 1000), "second");
  if (diff > -3600000) return rtf.format(Math.round(diff / 60000), "minute");
  return rtf.format(Math.round(diff / 3600000), "hour");
};

const getAbsoluteTime = (createdAt: number) => {
  const dtf = new Intl.DateTimeFormat("en", { /* options */ });
  return dtf.format(new Date(createdAt));
};
```

**Alternatives Considered**:
- External library (date-fns, day.js): Rejected (violates Technology Stack Discipline §III)
- Store time as ISO string: Rejected (less efficient; `number` is more compact in localStorage)

---

### 3. Drag-and-Drop Task Reordering

**Question**: What browser APIs and interaction patterns should be used for drag-and-drop reordering across desktop and mobile?

**Decision**:
- **Desktop** (mouse): Native HTML5 Drag & Drop API (`draggable`, `dragstart`, `dragover`, `drop`) — provides OS-native drag ghost and cursor feedback
- **Mobile** (touch): Pointer Events API (`pointerdown`, `pointermove`, `pointerup`) with 500ms long-press activation — required because iOS Safari does not support HTML5 Drag & Drop on touch input

**Rationale**:
- HTML5 Drag & Drop is well-supported on desktop browsers (Chrome, Firefox, Safari macOS, Edge) and gives native OS-level visual feedback for free
- iOS Safari does not support HTML5 DnD events on touch; Pointer Events work across all devices
- Two code paths (`pointerType === 'mouse'` → DnD, `pointerType === 'touch'` → Pointer Events) is manageable and avoids a library dependency
- No third-party library required; Vue handles event binding

**Implementation Approach**:
```typescript
// Desktop: HTML5 DnD events on TodoItem
// @dragstart → store fromIndex; @dragover → preventDefault; @drop → reorder

// Mobile: Pointer Events on drag handle
const onPointerDown = (event: PointerEvent, index: number) => {
  if (event.pointerType !== 'touch') return
  longPressTimer = setTimeout(() => {
    isDragging = true
    draggedIndex = index
    event.target.setPointerCapture(event.pointerId)
  }, 500)
}
const onPointerMove = (event: PointerEvent) => {
  if (!isDragging) {
    // Cancel long-press if pointer moved > 10px before timer fired
    if (Math.abs(event.clientY - startY) > 10) clearTimeout(longPressTimer)
    return
  }
  // Compute drop target from clientY position
}
const onPointerUp = (event: PointerEvent) => {
  clearTimeout(longPressTimer)
  if (isDragging) commitReorder()
  isDragging = false
}
```

**Alternatives Considered**:
- Vue Draggable (SortableJS): Rejected (external dependency; violates §III)
- Pointer Events only (no HTML5 DnD): Valid but loses native OS drag ghost on desktop. Rejected in favour of hybrid approach for better desktop UX.
- Touch Events API directly: Rejected in favour of Pointer Events (unified API, less code)

---

### 4. Delete Confirmation Dialog

**Question**: What is the simplest way to implement a reusable confirmation dialog that integrates with the existing Vue component architecture?

**Decision**: Create a scoped `ConfirmDeleteDialog.vue` component with v-if toggle and event emit pattern.

**Rationale**:
- Matches existing component architecture (TodoItem, TodoList, etc.)
- No external dialog library needed; styling uses existing Tailwind palette
- Keyboard support (Escape/Enter) is native HTML + Vue events

**Implementation Approach**:
```vue
<!-- components/ConfirmDeleteDialog.vue -->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-gray-900 border-4 border-purple-500 p-6 rounded-lg">
      <p class="text-white mb-4">{{ message }}</p>
      <div class="flex gap-4">
        <button @click="confirm" class="btn-primary">Confirm</button>
        <button @click="cancel" class="btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>
```

**Alternatives Considered**:
- Browser `confirm()`: Rejected (not styleable; breaks retro aesthetic)
- Third-party dialog library: Rejected (external dependency)
- Inline confirmation: Rejected (UX anti-pattern; accidental deletion risk)

---

### 5. Task List Pagination (P3 — Deferred)

**Question**: How should pagination be implemented for task lists > 15 items?

**Decision**: Deferred to P3. When implemented: simple index-based pagination with prev/next buttons, 15 items per page.

**Rationale**:
- Does not block P1/P2 features
- Can be added incrementally after reordering is stable
- Simple pattern: no infinite scroll or lazy loading complexity

**Implementation Sketch** (for future reference):
```typescript
const pageSize = 15;
const totalPages = Math.ceil(todos.length / pageSize);
const currentPage = ref(0);
const paginatedTodos = computed(() => 
  todos.slice(currentPage.value * pageSize, (currentPage.value + 1) * pageSize)
);
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge | Notes |
|---------|--------|---------|--------|------|-------|
| HTML5 Drag & Drop | ✅ 3+ | ✅ 3.6+ | ✅ 3.1+ | ✅ 12+ | Well-supported |
| `Intl.RelativeTimeFormat` | ✅ 71+ | ✅ 65+ | ✅ 14+ | ✅ 79+ | Covers latest 2 versions |
| `Intl.DateTimeFormat` | ✅ All | ✅ All | ✅ All | ✅ All | Universal support |
| Pointer Events | ✅ 55+ | ✅ 59+ | ✅ 13+ | ✅ 12+ | Covers latest 2 versions |
| `localStorage` | ✅ All | ✅ All | ✅ All | ✅ All | Existing (MVP) |

**Conclusion**: All proposed APIs are well-supported across the target browser versions (latest 2 versions).

---

## Dependencies & Build Impact

| Technology | Required? | Rationale |
|-----------|-----------|-----------|
| External drag-drop library | ❌ No | HTML5 API sufficient |
| Date/time library | ❌ No | `Intl` APIs native |
| Dialog/modal library | ❌ No | Simple Vue component |
| Animation library | ❌ No | Tailwind transitions sufficient |

**Conclusion**: Zero new runtime dependencies. Aligns with Constitution §III (Technology Stack Discipline).

---

## Design System Alignment

All visual refinements use the existing retro 80s Tailwind theme:
- **Neon purple palette**: `#a855f7`, `#c084fc`, etc.
- **Glow effects**: Custom `boxShadow` utilities in `tailwind.config.ts`
- **Typography**: "Press Start 2P" font (existing Nuxt font module)
- **Spacing/sizes**: Standard Tailwind scale (no custom units)

**Implication**: No new CSS files or design tokens needed.

---

## Performance Considerations

| Feature | Performance Goal | Implementation |
|---------|-----------------|-----------------|
| Drag-and-drop | 60 fps smooth interaction | Use CSS transforms, not layout thrashing |
| Timestamp calculations | Lazy-computed on render | Cache relative time, recalculate only on interval |
| Confirmation dialog | Instant open/close | Use v-if toggle (fast) + Tailwind transitions |
| List reorder + persist | < 100ms update | Batch DOM updates, single localStorage write |

**Implication**: No special performance optimization libraries needed. Vue's reactivity + Tailwind CSS handles efficiently.

---

## Conclusion

All research questions resolved. No technical blockers identified. The feature can proceed directly to Phase 1 design using existing tools and patterns from the MVP.

**Key Findings**:
✅ Browser APIs well-supported  
✅ Zero new dependencies required  
✅ Design system alignment maintained  
✅ Constitution constraints satisfied  
✅ All clarifications resolved from feature spec  

**Ready for**: Phase 1 design artifacts (data-model.md, contracts/, quickstart.md)
