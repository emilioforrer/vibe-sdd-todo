# Contract: Drag-and-Drop Task Reordering Behavior

**Feature**: UX Improvement – Task Reordering via Drag & Drop  
**Related**: [data-model.md](../data-model.md), [spec.md](../spec.md), [components/TodoItem.vue](../../../components/TodoItem.vue)

---

## Overview

This contract specifies the drag-and-drop interaction contract for task reordering. It defines event flows, visual feedback, state mutations, and browser/device-specific behavior (desktop HTML5 Drag & Drop vs. mobile long-press drag).

---

## Desktop Interaction (HTML5 Drag & Drop API)

### Markup Requirements

```vue
<!-- components/TodoItem.vue -->
<template>
  <div class="todo-item" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd">
    <!-- Drag handle icon (visual affordance) -->
    <span class="drag-handle" aria-label="Reorder todo">⠿</span>
    
    <!-- Task content -->
    <span class="todo-text">{{ todo.text }}</span>
    
    <!-- Timestamp -->
    <TimeDisplay :createdAt="todo.createdAt" />
  </div>
</template>

<!-- Parent container (TodoList.vue) -->
<div class="todo-list" @dragover="onDragOver" @drop="onDrop">
  <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" />
</div>
```

### Event Flow: Desktop (Drag & Drop API)

```
1. User hovers over TodoItem with mouse
   → TodoItem shows drag handle (⠿) with cursor: grab

2. User clicks & holds on drag handle
   → @dragstart event fires
   → State: draggedIndex = source position
   → Visual: Dragged item becomes semi-transparent (opacity: 0.6)
   → Drag image: Optional (browser default or custom)

3. User drags item over target position
   → @dragover event fires repeatedly
   → Visual: Target todo item shows drop indicator (bottom border highlight)
   → State: No changes (preview only)

4. User releases mouse over target position
   → @drop event fires
   → Action: Reorder array (swap or insert)
   → Action: Update order field for affected todos
   → Action: Save to localStorage
   → Visual: All items return to normal; list re-renders in new order

5. @dragend event fires (cleanup)
   → State: Reset draggedIndex = null
   → Visual: Clear any drag-related styles
```

### Event Handlers

```typescript
// components/TodoItem.vue (or parent TodoList.vue)
import type { Todo } from "~/types/todo";

export default defineComponent({
  emits: ["reorder"],
  
  data() {
    return {
      draggedIndex: null as number | null,
    };
  },
  
  methods: {
    onDragStart(event: DragEvent) {
      // event.dataTransfer is set by browser
      event.dataTransfer!.effectAllowed = "move";
      event.dataTransfer!.setData("text/html", this.$el.innerHTML);
      
      // Store index in composable or parent
      this.draggedIndex = this.todos.indexOf(this.todo);
      
      // Visual feedback
      (event.target as HTMLElement).classList.add("dragging");
    },
    
    onDragOver(event: DragEvent) {
      event.preventDefault(); // Allow drop
      event.dataTransfer!.dropEffect = "move";
      
      // Highlight drop target
      const target = event.target as HTMLElement;
      if (target.classList.contains("todo-item")) {
        target.classList.add("drop-target");
      }
    },
    
    onDragLeave(event: DragEvent) {
      (event.target as HTMLElement).classList.remove("drop-target");
    },
    
    onDrop(event: DragEvent, targetIndex: number) {
      event.preventDefault();
      event.stopPropagation();
      
      if (this.draggedIndex === null || this.draggedIndex === targetIndex) {
        return; // No-op: dropped on self
      }
      
      // Emit reorder event to parent composable
      this.$emit("reorder", {
        fromIndex: this.draggedIndex,
        toIndex: targetIndex,
      });
    },
    
    onDragEnd(event: DragEvent) {
      // Cleanup
      (event.target as HTMLElement).classList.remove("dragging");
      document.querySelectorAll(".drop-target").forEach(el => {
        el.classList.remove("drop-target");
      });
      
      this.draggedIndex = null;
    },
  },
});
```

### Styling (Tailwind + CSS)

```tailwind
/* Drag handle affordance */
.drag-handle {
  @apply cursor-grab text-purple-400 hover:text-purple-300 transition-colors;
}

/* Dragging state */
.todo-item.dragging {
  @apply opacity-60 bg-purple-900 scale-105 shadow-lg;
}

/* Drop target indicator */
.todo-item.drop-target {
  @apply border-b-2 border-purple-400;
}
```

---

## Mobile Interaction (Long-Press Drag)

### Touch Activation

Mobile devices do not support native drag-and-drop (or it's inconsistent). Instead, use long-press (500ms) to activate drag mode.

```typescript
// composables/useDragDrop.ts
export const useDragDrop = () => {
  let longPressTimer: ReturnType<typeof setTimeout> | null = null;
  let isDragging = false;
  let draggedIndex: number | null = null;
  
  const onPointerDown = (event: PointerEvent, index: number) => {
    longPressTimer = setTimeout(() => {
      isDragging = true;
      draggedIndex = index;
      
      // Visual feedback: highlight item as draggable
      (event.target as HTMLElement).classList.add("drag-mode");
      
      console.log("📌 Drag mode activated for todo", index);
    }, 500); // 500ms long-press threshold
  };
  
  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging || draggedIndex === null) return;
    
    // Prevent default scroll
    event.preventDefault();
    
    // Find drop target under pointer
    const elementAtPoint = document.elementFromPoint(
      event.clientX,
      event.clientY
    );
    const todoItem = elementAtPoint?.closest(".todo-item");
    
    if (todoItem) {
      todoItem.classList.add("mobile-drop-target");
    }
  };
  
  const onPointerUp = (event: PointerEvent, targetIndex: number | null = null) => {
    clearTimeout(longPressTimer!);
    
    if (!isDragging || draggedIndex === null) {
      isDragging = false;
      draggedIndex = null;
      return;
    }
    
    // Execute reorder if target is valid
    if (targetIndex !== null && targetIndex !== draggedIndex) {
      console.log(`🔄 Reorder: ${draggedIndex} → ${targetIndex}`);
      // Emit reorder event
    }
    
    // Cleanup
    document.querySelectorAll(".drag-mode, .mobile-drop-target").forEach(el => {
      el.classList.remove("drag-mode", "mobile-drop-target");
    });
    
    isDragging = false;
    draggedIndex = null;
  };
  
  return { onPointerDown, onPointerMove, onPointerUp };
};
```

### Mobile Markup

```vue
<!-- components/TodoItem.vue -->
<template>
  <div
    class="todo-item"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <!-- Drag handle (touch-friendly, larger hit area) -->
    <span class="drag-handle-mobile" aria-label="Long-press to reorder">⠿</span>
    
    <span class="todo-text">{{ todo.text }}</span>
  </div>
</template>
```

### Mobile Styling

```tailwind
/* Mobile drag handle (larger for touch) */
.drag-handle-mobile {
  @apply w-10 h-10 flex items-center justify-center cursor-grab text-purple-400;
}

/* Long-press drag mode active */
.todo-item.drag-mode {
  @apply bg-purple-900 opacity-80 scale-105 shadow-lg transition-transform;
}

/* Mobile drop target */
.todo-item.mobile-drop-target {
  @apply border-l-4 border-purple-400;
}
```

---

## State Mutation: Reorder

### Composable Integration

```typescript
// composables/useTodos.ts
export const useTodos = () => {
  const todos = ref<Todo[]>([]);
  
  const reorderTodos = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return; // No-op
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= todos.value.length) return;
    
    // Clone and reorder
    const updated = [...todos.value];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    
    // Update order field to reflect new positions
    updated.forEach((todo, index) => {
      todo.order = index;
    });
    
    todos.value = updated;
    saveTodos(); // Persist to localStorage
  };
  
  return { todos, reorderTodos };
};
```

### localStorage Persistence

```typescript
const saveTodos = () => {
  localStorage.setItem("vibe-todo:todos", JSON.stringify(todos.value));
  console.log("💾 Saved todos to localStorage");
};
```

---

## Acceptance Criteria (from Spec)

### P2 - Drag-and-Drop Task Reordering

✅ **AC1**: User hovers over task → drag handle (⠿) visible  
✅ **AC2**: User clicks and holds drag handle → task shows visual active state (scale, shadow, opacity)  
✅ **AC3**: User drags task to new position → list reorders, new position persisted  
✅ **AC4**: Page refresh → tasks remain in reordered position  
✅ **AC5**: Mobile long-press (500ms+) → task enters drag mode with visual indication  
✅ **AC6**: Mobile drag to new position → list reorders, position persisted  

### Testing Checklist

- [ ] Desktop: Drag task from position 0 to position 2 → verify order persists after refresh
- [ ] Desktop: Drag task to position 0 (first) → verify order correct
- [ ] Desktop: Drag task to last position → verify order correct
- [ ] Desktop: Drag task over itself → verify no change
- [ ] Mobile: Long-press (500ms) on drag handle → task highlights
- [ ] Mobile: Long-press + drag to new position → order updates
- [ ] Mobile: Drag to position and release → position persists after refresh
- [ ] Browser refresh → all reordered todos maintain order
- [ ] localStorage → verify `order` field incremented correctly (0, 1, 2, ...)

---

## Browser Support

| Browser | HTML5 Drag & Drop | Touch Events | Status |
|---------|------------------|--------------|--------|
| Chrome 90+ | ✅ | ✅ | Full support |
| Firefox 89+ | ✅ | ✅ | Full support |
| Safari 14+ | ✅ | ✅ | Full support |
| Edge 90+ | ✅ | ✅ | Full support |

**Target**: Latest 2 versions (Constitution §V) — all supported ✅

---

## Edge Cases

### Edge Case 1: Rapid Reordering

**Scenario**: User drags multiple items in quick succession  
**Handling**: Each reorder updates `order` field incrementally; localStorage writes batched (Vue batches updates)  
**Result**: Final order is correct after all interactions complete

### Edge Case 2: Reorder + Simultaneous Delete

**Scenario**: User drags item, then deletes another item  
**Handling**: Delete updates `order` field for remaining todos; reorder operates on current state  
**Result**: No conflicts; operations are sequential

### Edge Case 3: Touch Device + Accidental Scroll During Drag

**Scenario**: User long-presses to enter drag mode, then scroll happens  
**Handling**: `@pointermove` event fires; custom scroll prevention via `event.preventDefault()`  
**Result**: Drag continues; page doesn't scroll

---

## Performance Considerations

| Operation | Target | Implementation |
|-----------|--------|-----------------|
| Drag visual feedback | Instant | CSS transforms (GPU-accelerated) |
| Drop + reorder | < 100ms | Synchronous array operation + single localStorage write |
| Re-render after reorder | 60 fps | Vue's virtual DOM efficiently updates |
| localStorage persist | < 50ms | JSON.stringify is fast for ~100 items |

---

## Summary

✅ **Desktop**: HTML5 Drag & Drop API with visual affordance (⠿)  
✅ **Mobile**: Long-press (500ms) activation + touch drag  
✅ **State**: Reorder updates `order` field; persists to localStorage  
✅ **Visual Feedback**: Dragging state, drop target highlight  
✅ **Persistence**: Order maintained across page refresh  
✅ **Browser Support**: All modern browsers (latest 2 versions)  
✅ **Performance**: Smooth 60 fps interactions
