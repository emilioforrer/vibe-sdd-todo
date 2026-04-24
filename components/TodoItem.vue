<script setup lang="ts">
import type { Todo } from '~/types/todo'
import { formatRelativeTime, formatAbsoluteTime } from '~/composables/useTodos'

const props = defineProps<{
  todo: Todo
  index: number
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
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
    // Cancel long-press if intent is scroll
    if (Math.abs(e.clientY - pointerStartY) > 10 && longPressTimer) {
      clearTimeout(longPressTimer)
      longPressTimer = null
    }
    return
  }
  // Compute drop index from pointer position
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
</script>

<template>
  <li
    :draggable="true"
    class="flex items-center gap-3 px-4 py-3 border-b border-neon-violet/30 bg-dark-card last:border-b-0"
    :class="isDragging ? 'scale-105 opacity-60 shadow-neon-sm z-10' : ''"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <!-- Drag Handle -->
    <span
      class="cursor-grab select-none text-neon-violet/60 hover:text-neon-violet font-mono shrink-0"
      style="touch-action: none"
      title="Drag to reorder"
      @pointerdown="onHandlePointerDown"
      @pointermove="onHandlePointerMove"
      @pointerup="onHandlePointerUp"
      @pointercancel="onHandlePointerCancel"
    >⠿</span>

    <!-- Checkbox -->
    <input
      :id="`todo-${todo.id}`"
      type="checkbox"
      :checked="todo.completed"
      class="w-4 h-4 accent-neon-purple cursor-pointer shrink-0 transition-all duration-200"
      @change="emit('toggle', todo.id)"
    >

    <!-- Text + metadata -->
    <div class="flex-1 min-w-0">
      <label
        :for="`todo-${todo.id}`"
        class="block font-mono text-sm cursor-pointer select-none transition-all duration-200"
        :class="todo.completed ? 'text-gray-500 line-through opacity-50' : 'text-gray-100'"
      >
        {{ todo.text }}
      </label>
      <span
        class="font-mono text-xs text-neon-violet/50"
        :title="todo.createdAt ? formatAbsoluteTime(todo.createdAt) : ''"
      >{{ formatRelativeTime(todo.createdAt) }}</span>
    </div>

    <!-- Delete Button — always visible, high contrast -->
    <button
      class="text-neon-violet hover:text-red-400 hover:shadow-neon-sm font-retro text-sm
             transition-all duration-200 shrink-0 px-1"
      title="Delete todo"
      @click="showConfirm = true"
    >
      ×
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
