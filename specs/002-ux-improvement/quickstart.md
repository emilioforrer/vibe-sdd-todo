# Quick Start: UX Improvement Implementation Guide

**Phase**: 1 (Design)  
**Date**: April 23, 2026  
**Target Audience**: Developers implementing the feature  
**Related**: [plan.md](plan.md), [data-model.md](data-model.md), [contracts/](contracts/)

---

## Overview

This guide provides step-by-step implementation instructions for each P1 and P2 feature. Follow features in order to respect dependencies.

### Feature Dependency Map

```
P1: Header Glow Refinement (no dependencies)
P1: Task Creation Metadata (no dependencies)
P2: Delete Confirmation (depends on delete button visibility from P1)
P2: Drag & Drop Reordering (depends on metadata structure from P1)
P3: Pagination (deferred; depends on P1/P2 complete)
```

---

## Feature 1: Header Glow Refinement (P1)

### Goal
Refine the neon glow effect on the "VIBE TODO" header to be proportional and not overwhelming.

### Time Estimate
15 minutes

### Steps

#### 1. Locate the Header Component

```bash
# Current location
src/pages/index.vue  # or pages/index.vue (Nuxt auto-import)
```

#### 2. Find Existing glow CSS

Search for the header styling in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
theme: {
  extend: {
    boxShadow: {
      glow: "0 0 30px 10px rgba(168, 85, 247, 0.8)", // CURRENT
    },
  },
}
```

#### 3. Refine the Shadow Parameters

```typescript
// tailwind.config.ts - UPDATED
theme: {
  extend: {
    boxShadow: {
      // OLD: 30px blur, 10px spread, 0.8 opacity
      // NEW: 20px blur, 5px spread, 0.6 opacity (more subtle)
      glow: "0 0 20px 5px rgba(168, 85, 247, 0.6)",
    },
  },
}
```

**What Changed**:
- Blur radius: 30px → 20px (sharper)
- Spread radius: 10px → 5px (tighter)
- Opacity: 0.8 → 0.6 (more subtle)

#### 4. Test in Browser

```bash
npm run dev
# Navigate to http://localhost:3000
# Verify header glow is proportional to heading size
```

#### 5. Adjust if Needed

If the glow is still too intense or too faint:
- Too intense: Reduce blur to 15px, spread to 3px, opacity to 0.5
- Too faint: Increase blur to 25px, spread to 7px, opacity to 0.7

---

## Feature 2: Task Creation Metadata Display (P1)

### Goal
Display task creation dates in human-readable format (relative time with absolute tooltip).

### Time Estimate
45 minutes

### Steps

#### 1. Update Todo Type

```typescript
// types/todo.ts
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: number;      // NEW: Milliseconds since epoch
}
```

#### 2. Create TimeDisplay Component

```vue
<!-- components/TimeDisplay.vue -->
<script setup lang="ts">
import { computed } from "vue";

interface Props {
  createdAt?: number;
}

const props = defineProps<Props>();

const relativeTime = computed(() => {
  if (!props.createdAt) return "Date unknown";
  
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = props.createdAt - Date.now();
  
  if (Math.abs(diffMs) < 60000) return rtf.format(Math.round(diffMs / 1000), "second");
  if (Math.abs(diffMs) < 3600000) return rtf.format(Math.round(diffMs / 60000), "minute");
  if (Math.abs(diffMs) < 86400000) return rtf.format(Math.round(diffMs / 3600000), "hour");
  return rtf.format(Math.round(diffMs / 86400000), "day");
});

const absoluteTime = computed(() => {
  if (!props.createdAt) return "";
  
  const dtf = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  return dtf.format(new Date(props.createdAt));
});
</script>

<template>
  <span
    v-if="createdAt"
    class="text-xs text-purple-300 cursor-help"
    :title="absoluteTime"
  >
    {{ relativeTime }}
  </span>
  <span v-else class="text-xs text-gray-500">
    Date unknown
  </span>
</template>

<style scoped>
/* Subtle styling; smaller font, muted color */
</style>
```

#### 3. Update TodoItem Component

```vue
<!-- components/TodoItem.vue -->
<script setup lang="ts">
import type { Todo } from "~/types/todo";
import TimeDisplay from "./TimeDisplay.vue";

defineProps<{
  todo: Todo;
}>();
</script>

<template>
  <div class="todo-item flex items-start gap-3 p-2 hover:bg-purple-900/20">
    <!-- Checkbox (existing) -->
    <input
      type="checkbox"
      :checked="todo.completed"
      class="w-5 h-5 cursor-pointer"
    />
    
    <!-- Task text + timestamp (column layout) -->
    <div class="flex-1">
      <span
        class="block text-white"
        :class="{ 'line-through text-gray-500': todo.completed }"
      >
        {{ todo.text }}
      </span>
      
      <!-- NEW: Timestamp display -->
      <TimeDisplay :createdAt="todo.createdAt" />
    </div>
    
    <!-- Delete button (existing) -->
    <button class="text-red-400 hover:text-red-300">×</button>
  </div>
</template>
```

#### 4. Update useTodos Composable

```typescript
// composables/useTodos.ts
export const useTodos = () => {
  const todos = ref<Todo[]>([]);
  
  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: generateUUID(),
      text,
      completed: false,
      createdAt: Date.now(),  // NEW: Set timestamp on creation
    };
    todos.value.push(newTodo);
    saveTodos();
  };
  
  const loadTodos = () => {
    const raw = localStorage.getItem("vibe-todo:todos");
    if (!raw) return;
    
    const parsed = JSON.parse(raw) as Todo[];
    // Backfill only `order`; leave createdAt undefined for legacy tasks
    // (they will display "Date unknown" per FR-021 — do NOT set Date.now() as fallback)
    todos.value = parsed.map((todo, index) => ({
      ...todo,
      order: todo.order ?? index,
    }));
  };
  
  return { todos, addTodo, loadTodos };
};
```

#### 5. Test Creation Date Display

```bash
npm run dev
# Create a new task
# Verify timestamp appears below task text
# Hover over timestamp to see absolute time tooltip
# Refresh page and verify timestamp persists
```

---

## Feature 3: Delete Confirmation Dialog (P2)

### Goal
Show confirmation dialog before deleting a task to prevent accidental data loss.

### Time Estimate
30 minutes

### Steps

#### 1. Create ConfirmDeleteDialog Component

```vue
<!-- components/ConfirmDeleteDialog.vue -->
<script setup lang="ts">
import { ref } from "vue";

interface Props {
  isOpen: boolean;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: "Are you sure you want to delete this task?",
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const onConfirm = () => {
  emit("confirm");
};

const onCancel = () => {
  emit("cancel");
};

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === "Enter") onConfirm();
  if (e.key === "Escape") onCancel();
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    @keydown="onKeyDown"
  >
    <div class="bg-gray-900 border-4 border-purple-500 p-8 rounded-lg shadow-2xl max-w-sm">
      <!-- Title -->
      <h2 class="text-xl font-bold text-purple-300 mb-4">
        Confirm Delete
      </h2>
      
      <!-- Message -->
      <p class="text-white mb-6">
        {{ message }}
      </p>
      
      <!-- Buttons -->
      <div class="flex gap-4 justify-end">
        <button
          @click="onCancel"
          class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          @click="onConfirm"
          class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
</template>
```

#### 2. Update TodoItem to Use Dialog

```vue
<!-- components/TodoItem.vue -->
<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "~/types/todo";
import TimeDisplay from "./TimeDisplay.vue";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();

const showDeleteConfirm = ref(false);

const onDeleteClick = () => {
  showDeleteConfirm.value = true;
};

const onConfirmDelete = () => {
  emit("delete", props.todo.id);
  showDeleteConfirm.value = false;
};

const onCancelDelete = () => {
  showDeleteConfirm.value = false;
};
</script>

<template>
  <div class="todo-item flex items-start gap-3 p-2 hover:bg-purple-900/20">
    <!-- Checkbox (existing) -->
    <input type="checkbox" :checked="todo.completed" class="w-5 h-5" />
    
    <!-- Task text + timestamp -->
    <div class="flex-1">
      <span class="block text-white" :class="{ 'line-through': todo.completed }">
        {{ todo.text }}
      </span>
      <TimeDisplay :createdAt="todo.createdAt" />
    </div>
    
    <!-- Delete button triggers dialog -->
    <button
      @click="onDeleteClick"
      class="text-red-400 hover:text-red-300 transition-colors text-lg"
    >
      ×
    </button>
  </div>
  
  <!-- Delete confirmation dialog -->
  <ConfirmDeleteDialog
    :isOpen="showDeleteConfirm"
    :message="`Delete \"${todo.text}\"?`"
    @confirm="onConfirmDelete"
    @cancel="onCancelDelete"
  />
</template>
```

#### 3. Update TodoList to Handle Delete Events

```vue
<!-- components/TodoList.vue -->
<script setup lang="ts">
import type { Todo } from "~/types/todo";
import TodoItem from "./TodoItem.vue";

defineProps<{
  todos: Todo[];
}>();

const emit = defineEmits<{
  delete: [id: string];
}>();

const onTodoDelete = (id: string) => {
  emit("delete", id);
};
</script>

<template>
  <div class="todo-list space-y-2">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @delete="onTodoDelete"
    />
  </div>
</template>
```

#### 4. Test Delete Confirmation

```bash
npm run dev
# Click delete button on a task
# Verify dialog appears
# Click "Cancel" → dialog closes, task remains
# Click delete again
# Click "Confirm Delete" → task is deleted
# Press Escape in dialog → dialog closes
```

---

## Feature 4: Drag-and-Drop Task Reordering (P2)

### Goal
Allow users to reorder tasks by dragging and dropping them, with order persisted.

### Time Estimate
60 minutes

### Steps

#### 1. Update useTodos Composable

```typescript
// composables/useTodos.ts
export const useTodos = () => {
  const todos = ref<Todo[]>([]);
  const draggedIndex = ref<number | null>(null);
  
  const reorderTodos = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
    
    // Clone array and reorder
    const updated = [...todos.value];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    
    // Update order field
    updated.forEach((todo, index) => {
      todo.order = index;
    });
    
    todos.value = updated;
    saveTodos();
  };
  
  return { 
    todos, 
    draggedIndex, 
    reorderTodos, 
    // ... other methods
  };
};
```

#### 2. Create DragHandle Component

```vue
<!-- components/DragHandle.vue -->
<template>
  <span
    class="drag-handle text-purple-400 hover:text-purple-300 cursor-grab select-none"
    aria-label="Reorder todo"
  >
    ⠿
  </span>
</template>

<style scoped>
.drag-handle {
  @apply inline-block w-5 text-center;
}

.drag-handle:active {
  @apply cursor-grabbing;
}
</style>
```

#### 3. Update TodoItem with Drag Events

```vue
<!-- components/TodoItem.vue -->
<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "~/types/todo";
import TimeDisplay from "./TimeDisplay.vue";
import DragHandle from "./DragHandle.vue";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.vue";

const props = defineProps<{
  todo: Todo;
  index: number;
}>();

const emit = defineEmits<{
  delete: [id: string];
  reorder: [fromIndex: number, toIndex: number];
}>();

const isDragging = ref(false);

const onDragStart = (e: DragEvent) => {
  isDragging.value = true;
  e.dataTransfer!.effectAllowed = "move";
  e.dataTransfer!.setData("application/json", JSON.stringify({ index: props.index }));
};

const onDragEnd = () => {
  isDragging.value = false;
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  e.dataTransfer!.dropEffect = "move";
};

const onDrop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const data = JSON.parse(e.dataTransfer!.getData("application/json"));
  const fromIndex = data.index;
  const toIndex = props.index;
  
  if (fromIndex !== toIndex) {
    emit("reorder", fromIndex, toIndex);
  }
};
</script>

<template>
  <div
    class="todo-item flex items-start gap-3 p-2 hover:bg-purple-900/20 cursor-move rounded transition-colors"
    :class="{ 'bg-purple-900/40 opacity-60': isDragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- Drag handle -->
    <DragHandle />
    
    <!-- Checkbox (existing) -->
    <input type="checkbox" :checked="todo.completed" class="w-5 h-5" />
    
    <!-- Task text + timestamp -->
    <div class="flex-1">
      <span class="block text-white" :class="{ 'line-through': todo.completed }">
        {{ todo.text }}
      </span>
      <TimeDisplay :createdAt="todo.createdAt" />
    </div>
    
    <!-- Delete button -->
    <button
      @click="() => showDeleteConfirm = true"
      class="text-red-400 hover:text-red-300 text-lg"
    >
      ×
    </button>
  </div>
</template>
```

#### 4. Update TodoList to Pass Index and Handle Reorder

```vue
<!-- components/TodoList.vue -->
<script setup lang="ts">
import type { Todo } from "~/types/todo";
import TodoItem from "./TodoItem.vue";

const props = defineProps<{
  todos: Todo[];
}>();

const emit = defineEmits<{
  delete: [id: string];
  reorder: [fromIndex: number, toIndex: number];
}>();
</script>

<template>
  <div class="todo-list space-y-2">
    <TodoItem
      v-for="(todo, index) in todos"
      :key="todo.id"
      :todo="todo"
      :index="index"
      @delete="(id) => emit('delete', id)"
      @reorder="(from, to) => emit('reorder', from, to)"
    />
  </div>
</template>
```

#### 5. Update Index Page to Handle Reorder

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
import { useTodos } from "~/composables/useTodos";

const { todos, reorderTodos, deleteTodo } = useTodos();

const onReorder = (fromIndex: number, toIndex: number) => {
  reorderTodos(fromIndex, toIndex);
};

const onDelete = (id: string) => {
  deleteTodo(id);
};
</script>

<template>
  <div>
    <!-- ... header, input ... -->
    <TodoList
      :todos="todos"
      @reorder="onReorder"
      @delete="onDelete"
    />
  </div>
</template>
```

#### 6. Test Drag & Drop

```bash
npm run dev

# Desktop:
# - Hover over todo → see drag handle (⠿)
# - Click and drag todo to new position → item highlights, drop target shows
# - Release → list reorders
# - Refresh page → order persists

# Mobile (Chrome DevTools):
# - Enable device emulation (Ctrl+Shift+M)
# - Long-press (500ms) on todo → enters drag mode
# - Drag to new position → list reorders
# - Refresh → order persists
```

---

## Feature 5: Header Glow + Task Visibility (Combined P1 Polish)

### Additional Steps (Optional)

If delete button or other elements are not clearly visible:

```vue
<!-- pages/index.vue or components/TodoItem.vue -->
<style scoped>
/* Ensure high contrast for delete button */
button.delete {
  @apply text-red-500 hover:text-red-400 active:text-red-600;
  text-shadow: 0 0 5px rgba(239, 68, 68, 0.5); /* Subtle glow */
}
</style>
```

---

## Testing Checklist

Before marking feature complete, verify:

### P1: Header Glow
- [ ] Header glow is proportional to heading size
- [ ] Glow is not overwhelming or too subtle
- [ ] Glow persists on all viewport sizes (desktop/mobile)

### P1: Task Creation Metadata
- [ ] New tasks display creation time (relative format)
- [ ] Hover over timestamp shows absolute time
- [ ] Legacy tasks display "Date unknown"
- [ ] Timestamp display styled subtly (not prominent)
- [ ] Timestamp persists after page refresh

### P2: Delete Confirmation
- [ ] Delete button click shows confirmation dialog
- [ ] Clicking "Cancel" dismisses dialog, task remains
- [ ] Clicking "Confirm Delete" removes task
- [ ] Pressing Escape key dismisses dialog
- [ ] Pressing Enter key confirms delete
- [ ] Dialog styled with retro aesthetic

### P2: Drag & Drop Reordering
- [ ] Drag handle visible on hover
- [ ] Dragging item shows visual feedback (opacity, scale)
- [ ] Drop target shows highlight
- [ ] Dragged item moves to new position
- [ ] New order persists after page refresh
- [ ] Mobile: Long-press activates drag mode
- [ ] Mobile: Drag to new position works
- [ ] Mobile: Order persists after refresh

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `createdAt` undefined on new todos | Ensure `addTodo` sets `createdAt: Date.now()` |
| Drag & drop not working | Verify `@dragstart`, `@dragover`, `@drop` events bound |
| Timestamp not showing | Check `TimeDisplay` component is imported in `TodoItem` |
| Delete dialog not modal | Verify `z-50` class and `fixed` positioning in `ConfirmDeleteDialog` |
| Order not persisting | Ensure `saveTodos()` is called after `reorderTodos()` |

---

## Summary

✅ Feature 1 (P1): Header Glow Refinement — **15 min**  
✅ Feature 2 (P1): Task Creation Metadata — **45 min**  
✅ Feature 3 (P2): Delete Confirmation Dialog — **30 min**  
✅ Feature 4 (P2): Drag & Drop Reordering — **60 min**  

**Total Estimated Time**: ~2.5 hours for core implementation + testing

**Next Step**: Run `/speckit.tasks` to generate actionable tasks for Phase 2.
