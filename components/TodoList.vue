<script setup lang="ts">
import type { Todo, FilterStatus } from '~/types/todo'

defineProps<{
  todos: readonly Todo[]
  activeFilter?: FilterStatus
  searchQuery?: string
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  reorder: [fromIndex: number, toIndex: number]
  'update-date': [id: string, date: string | undefined]
}>()
</script>

<template>
  <div>
    <!-- Empty State -->
    <div
      v-if="todos.length === 0"
      class="py-12 text-center"
    >
      <p class="font-sans text-text-subtle text-base">
        <template v-if="searchQuery">
          No tasks match your search
        </template>
        <template v-else-if="activeFilter === 'today'">
          No tasks scheduled for today
        </template>
        <template v-else-if="activeFilter === 'pending'">
          No pending tasks
        </template>
        <template v-else-if="activeFilter === 'completed'">
          No completed tasks
        </template>
        <template v-else>
          No tasks yet
        </template>
      </p>
      <p class="font-sans text-text-placeholder text-sm mt-2">
        Add one above to get started
      </p>
    </div>

    <!-- Task List -->
    <ul v-else class="flex flex-col gap-2">
      <TodoItem
        v-for="(todo, index) in todos"
        :key="todo.id"
        :todo="todo"
        :index="index"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
        @update-date="(id, date) => emit('update-date', id, date)"
        @reorder="(from, to) => emit('reorder', from, to)"
      />
    </ul>
  </div>
</template>
