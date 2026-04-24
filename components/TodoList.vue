<script setup lang="ts">
import type { Todo } from '~/types/todo'

defineProps<{
  todos: readonly Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
}>()
</script>

<template>
  <div>
    <!-- Empty State -->
    <div
      v-if="todos.length === 0"
      class="py-10 text-center"
    >
      <p class="font-retro text-neon-violet/70 text-xs leading-relaxed">
        NO TASKS YET
      </p>
      <p class="font-retro text-neon-violet/40 text-xs mt-3">
        // ADD ONE ABOVE
      </p>
    </div>

    <!-- Todo List -->
    <ul v-else class="rounded overflow-hidden border border-neon-violet/30">
      <TodoItem
        v-for="(todo, index) in todos"
        :key="todo.id"
        :todo="todo"
        :index="index"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @reorder="(from, to) => emit('reorder', from, to)"
      />
    </ul>
  </div>
</template>
