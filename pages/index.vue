<script setup lang="ts">
const {
  paginatedTodos,
  storageError,
  currentPage,
  totalPages,
  toggleTodo,
  deleteTodo,
  reorderTodos,
  setPage,
} = useTodos()

const PAGE_SIZE = 15

const dismissStorageError = ref(false)
const showStorageError = computed(() => storageError.value !== null && !dismissStorageError.value)
</script>

<template>
  <div class="min-h-screen bg-dark-bg px-4 py-10">
    <div class="max-w-xl mx-auto flex flex-col gap-6">

      <!-- App Title -->
      <h1 class="font-retro text-neon-purple text-center text-lg leading-relaxed drop-shadow-[0_0_8px_#d946ef]">
        VIBE TODO
      </h1>

      <!-- Storage Error Banner -->
      <div
        v-if="showStorageError"
        class="flex items-start justify-between gap-3 bg-red-900 border border-red-400 text-red-200 font-mono text-xs px-4 py-3 rounded"
      >
        <span>⚠ {{ storageError }}</span>
        <button
          class="text-red-200 hover:text-white font-retro text-xs shrink-0"
          @click="dismissStorageError = true"
        >
          ×
        </button>
      </div>

      <!-- Main Card -->
      <div class="bg-dark-card border border-neon-violet rounded p-6 flex flex-col gap-6">
        <TodoInput />
        <TodoList
          :todos="paginatedTodos"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @reorder="(from, to) => reorderTodos(
            from + (currentPage - 1) * PAGE_SIZE,
            to + (currentPage - 1) * PAGE_SIZE,
          )"
        />
        <PaginationControl
          v-if="totalPages > 1"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="setPage"
        />
      </div>

    </div>
  </div>
</template>
