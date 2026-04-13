<script setup lang="ts">
import type { Todo } from '~/types/todo'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
}>()
</script>

<template>
  <li
    class="flex items-center gap-3 px-4 py-3 border-b border-neon-violet/30 bg-dark-card
           last:border-b-0 group"
  >
    <!-- Checkbox -->
    <input
      :id="`todo-${todo.id}`"
      type="checkbox"
      :checked="todo.completed"
      class="w-4 h-4 accent-neon-purple cursor-pointer shrink-0
             transition-all duration-200"
      @change="emit('toggle', todo.id)"
    >

    <!-- Text -->
    <label
      :for="`todo-${todo.id}`"
      class="flex-1 font-mono text-sm cursor-pointer select-none transition-all duration-200"
      :class="todo.completed
        ? 'text-gray-500 line-through opacity-50'
        : 'text-gray-100'"
    >
      {{ todo.text }}
    </label>

    <!-- Delete Button -->
    <button
      class="text-neon-violet/40 hover:text-red-400 hover:shadow-neon-sm font-retro text-sm
             opacity-0 group-hover:opacity-100 focus:opacity-100
             transition-all duration-200 shrink-0 px-1"
      title="Delete todo"
      @click="emit('delete', todo.id)"
    >
      ×
    </button>
  </li>
</template>
