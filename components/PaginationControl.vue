<script setup lang="ts">
const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-4 mt-4">
    <button
      :disabled="currentPage === 1"
      class="px-3 py-1 border border-neon-violet/50 text-neon-violet/80 font-retro text-xs
             hover:border-neon-violet hover:text-neon-violet transition-all duration-200
             disabled:opacity-30 disabled:cursor-not-allowed"
      @click="emit('page-change', currentPage - 1)"
    >
      ← PREV
    </button>

    <span class="font-retro text-xs text-neon-violet">
      PAGE {{ currentPage }} OF {{ totalPages }}
    </span>

    <button
      :disabled="currentPage === totalPages"
      class="px-3 py-1 border border-neon-violet/50 text-neon-violet/80 font-retro text-xs
             hover:border-neon-violet hover:text-neon-violet transition-all duration-200
             disabled:opacity-30 disabled:cursor-not-allowed"
      @click="emit('page-change', currentPage + 1)"
    >
      NEXT →
    </button>
  </div>
</template>
