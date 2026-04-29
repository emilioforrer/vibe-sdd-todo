<script setup lang="ts">
import type { Todo } from '~/types/todo'

const props = defineProps<{
  todo: Todo
  index: number
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
  'update-date': [id: string, date: string | undefined]
}>()

// --- Delete confirmation ---
const showConfirm = ref(false)

// --- Drag state ---
const isDragging = ref(false)

// --- Desktop HTML5 DnD ---
function onDragStart(e: DragEvent) {
  isDragging.value = true
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(props.index))
  }
}

function onDragEnd() {
  isDragging.value = false
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (!e.dataTransfer) return
  const fromIndex = Number(e.dataTransfer.getData('text/plain'))
  if (!Number.isNaN(fromIndex) && fromIndex !== props.index) {
    emit('reorder', fromIndex, props.index)
  }
}

// --- Mobile Pointer Events long-press drag ---
let longPressTimer: ReturnType<typeof setTimeout> | null = null
let pointerStartY = 0
let isPointerDragging = false
let pendingDropIndex: number | null = null

function onHandlePointerDown(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  pointerStartY = e.clientY
  isPointerDragging = false
  pendingDropIndex = null
  longPressTimer = setTimeout(() => {
    isPointerDragging = true
    isDragging.value = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, 500)
}

function onHandlePointerMove(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  if (!isPointerDragging) {
    if (Math.abs(e.clientY - pointerStartY) > 10 && longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
    return
  }
  const listEl = (e.currentTarget as HTMLElement).closest('ul')
  if (!listEl) return
  const items = Array.from(listEl.querySelectorAll('li'))
  let dropIdx = props.index
  for (let i = 0; i < items.length; i++) {
    const rect = items[i].getBoundingClientRect()
    const mid = rect.top + rect.height / 2
    if (e.clientY < mid) {
      dropIdx = i
      break
    }
    dropIdx = i
  }
  pendingDropIndex = dropIdx
}

function onHandlePointerUp(e: PointerEvent) {
  if (e.pointerType !== 'touch') return
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  if (isPointerDragging && pendingDropIndex !== null && pendingDropIndex !== props.index) {
    emit('reorder', props.index, pendingDropIndex)
  }
  isPointerDragging = false
  isDragging.value = false
  pendingDropIndex = null
}

function onHandlePointerCancel() {
  if (longPressTimer) {
    clearTimeout(longPressTimer)
    longPressTimer = null
  }
  isPointerDragging = false
  isDragging.value = false
  pendingDropIndex = null
}

// --- Date formatting ---
function formatScheduledDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr + 'T00:00:00Z'))
}
</script>

<template>
  <li
    :draggable="true"
    class="flex items-center gap-3 px-4 py-3 bg-glass-card-light rounded-md border border-[rgba(226,232,240,0.5)] last:border-b"
    :class="isDragging ? 'scale-105 opacity-60 shadow-glass-sm z-10' : ''"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- Drag Handle -->
    <span
      class="cursor-grab select-none text-text-placeholder hover:text-text-subtle shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
      style="touch-action: none"
      title="Drag to reorder"
      @pointerdown="onHandlePointerDown"
      @pointermove="onHandlePointerMove"
      @pointerup="onHandlePointerUp"
      @pointercancel="onHandlePointerCancel"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <circle cx="7" cy="5" r="1.5" />
        <circle cx="13" cy="5" r="1.5" />
        <circle cx="7" cy="10" r="1.5" />
        <circle cx="13" cy="10" r="1.5" />
        <circle cx="7" cy="15" r="1.5" />
        <circle cx="13" cy="15" r="1.5" />
      </svg>
    </span>

    <!-- Circular Checkbox -->
    <button
      type="button"
      class="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
             min-w-[44px] min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/40"
      :class="todo.completed
        ? 'border-primary bg-gradient-primary'
        : 'border-[#E2E8F0] bg-transparent hover:border-primary'"
      :aria-label="todo.completed ? 'Mark as pending' : 'Mark as completed'"
      :aria-pressed="todo.completed"
      @click="emit('toggle', todo.id)"
    >
      <svg
        v-if="todo.completed"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        class="text-white"
        aria-hidden="true"
      >
        <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Text + metadata -->
    <div class="flex-1 min-w-0">
      <span
        class="block font-sans text-base select-none transition-all duration-200"
        :class="todo.completed ? 'text-text-placeholder line-through' : 'text-text-dark'"
      >
        {{ todo.text }}
      </span>
      <span
        v-if="todo.scheduledDate"
        class="font-sans text-xs text-text-subtle"
      >
        {{ formatScheduledDate(todo.scheduledDate) }}
      </span>
    </div>

    <!-- Date Picker for editing existing task date -->
    <DatePicker
      :model-value="todo.scheduledDate"
      trigger-class="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-placeholder hover:text-primary
                     focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-sm transition-colors"
      @update:model-value="(date) => emit('update-date', todo.id, date)"
    />

    <!-- Delete Button -->
    <button
      class="text-text-placeholder hover:text-error
             transition-all duration-200 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center
             focus:outline-none focus:ring-2 focus:ring-error/30 rounded-sm"
      title="Delete todo"
      aria-label="Delete todo"
      @click="showConfirm = true"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
        <path d="M6 2h6M2 4h14M4 4l1 11a1 1 0 001 1h8a1 1 0 001-1L16 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
      </svg>
    </button>

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :is-open="showConfirm"
      :task-text="todo.text"
      @confirm="() => { emit('delete', todo.id); showConfirm = false }"
      @cancel="showConfirm = false"
    />
  </li>
</template>
