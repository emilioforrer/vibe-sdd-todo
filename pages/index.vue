<script setup lang="ts">
const {
  paginatedTodos,
  storageError,
  currentPage,
  totalPages,
  totalCount,
  completedCount,
  progressPercentage,
  todayCount,
  pendingCount,
  searchQuery,
  activeFilter,
  toggleTodo,
  deleteTodo,
  reorderTodos,
  updateTodoDate,
  setPage,
} = useTodos()

const PAGE_SIZE = 15

const dismissStorageError = ref(false)
const showStorageError = computed(() => storageError.value !== null && !dismissStorageError.value)
</script>

<template>
  <main class="min-h-screen bg-gradient-to-b from-bg-start via-bg-mid to-bg-end px-4 py-8">
    <div class="max-w-[896px] mx-auto flex flex-col gap-6">

      <!-- Storage Error Banner -->
      <div
        v-if="showStorageError"
        role="alert"
        class="flex items-start justify-between gap-3 bg-error/10 border border-error/40 text-error font-sans text-sm px-4 py-3 rounded-md"
      >
        <span>⚠ {{ storageError }}</span>
        <button
          class="text-error hover:text-error/70 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Dismiss error"
          @click="dismissStorageError = true"
        >
          ×
        </button>
      </div>

      <!-- App Header -->
      <AppHeader />

      <!-- Progress Card -->
      <ProgressCard
        :total="totalCount"
        :completed="completedCount"
        :percentage="progressPercentage"
      />

      <!-- Input Card -->
      <section class="bg-glass-card rounded-lg shadow-glass-lg p-8">
        <TodoInput />
      </section>

      <!-- Task List Card -->
      <section class="bg-glass-card rounded-lg shadow-glass-lg p-8 flex flex-col gap-4">
        <SearchFilter
          :search-query="searchQuery"
          :active-filter="activeFilter"
          :total-count="totalCount"
          :pending-count="pendingCount"
          :completed-count="completedCount"
          :today-count="todayCount"
          @update:search-query="searchQuery = $event"
          @update:active-filter="activeFilter = $event"
        />

        <TodoList
          :todos="paginatedTodos"
          :active-filter="activeFilter"
          :search-query="searchQuery"
          @toggle="toggleTodo"
          @delete="deleteTodo"
          @update-date="(id, date) => updateTodoDate(id, date)"
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
      </section>

    </div>
  </main>
</template>
