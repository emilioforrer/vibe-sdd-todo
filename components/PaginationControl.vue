<script setup lang="ts">
defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()
</script>

<template>
  <nav aria-label="Pagination" class="flex items-center justify-center gap-3 mt-2">
    <button
      :disabled="currentPage === 1"
      class="min-w-[44px] min-h-[44px] px-4 py-2 bg-white/70 border border-[#E2E8F0] text-text-medium font-sans text-sm rounded-sm
             hover:border-primary hover:text-primary transition-all duration-200
             disabled:opacity-30 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-primary/30"
      @click="emit('page-change', currentPage - 1)"
    >
      ← Prev
    </button>

    <span class="font-sans text-sm text-text-subtle">
      {{ currentPage }} / {{ totalPages }}
    </span>

    <button
      :disabled="currentPage === totalPages"
      class="min-w-[44px] min-h-[44px] px-4 py-2 bg-white/70 border border-[#E2E8F0] text-text-medium font-sans text-sm rounded-sm
             hover:border-primary hover:text-primary transition-all duration-200
             disabled:opacity-30 disabled:cursor-not-allowed
             focus:outline-none focus:ring-2 focus:ring-primary/30"
      @click="emit('page-change', currentPage + 1)"
    >
      Next →
    </button>
  </nav>
</template>
