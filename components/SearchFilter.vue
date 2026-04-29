<script setup lang="ts">
import type { FilterStatus } from '~/types/todo'

const props = defineProps<{
  searchQuery: string
  activeFilter: FilterStatus
  totalCount: number
  pendingCount: number
  completedCount: number
  todayCount: number
}>()

const emit = defineEmits<{
  'update:searchQuery': [query: string]
  'update:activeFilter': [filter: FilterStatus]
}>()

interface FilterTab {
  key: FilterStatus
  label: string
  count: number
}

const tabs = computed<FilterTab[]>(() => [
  { key: 'today', label: 'Today', count: props.todayCount },
  { key: 'all', label: 'All', count: props.totalCount },
  { key: 'pending', label: 'Pending', count: props.pendingCount },
  { key: 'completed', label: 'Completed', count: props.completedCount },
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Search Input -->
    <div class="relative">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
      <input
        :value="searchQuery"
        type="search"
        placeholder="Search tasks..."
        class="w-full h-[52px] pl-12 pr-4 bg-white/80 border-2 border-[#E2E8F0] text-text-dark font-sans text-base
               placeholder-text-placeholder rounded-md
               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
               transition-all duration-200"
        aria-label="Search tasks"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      >
    </div>

    <!-- Filter Tabs -->
    <div role="tablist" aria-label="Filter tasks" class="flex gap-2 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        role="tab"
        :aria-selected="activeFilter === tab.key"
        class="min-h-[44px] px-4 py-2 font-sans font-medium text-base rounded-sm transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-primary/40 flex items-center gap-2"
        :class="activeFilter === tab.key
          ? 'bg-gradient-primary text-white shadow-glass-sm'
          : 'bg-white/60 text-text-medium hover:bg-white/80'"
        @click="emit('update:activeFilter', tab.key)"
      >
        {{ tab.label }}
        <span
          class="font-sans text-xs px-2 py-0.5 rounded-full"
          :class="activeFilter === tab.key ? 'bg-white/30 text-white' : 'bg-[#E2E8F0] text-text-subtle'"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>
  </div>
</template>
