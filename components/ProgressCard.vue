<script setup lang="ts">
defineProps<{
  total: number
  completed: number
  percentage: number
}>()
</script>

<template>
  <section class="bg-glass-card rounded-lg shadow-glass-sm p-8">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="font-sans text-text-subtle text-sm mb-1">
          Progress Today
        </p>
        <p class="font-sans font-medium text-text-dark text-2xl leading-8">
          {{ percentage }}%
        </p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full h-3 bg-track rounded-full overflow-hidden mb-3" role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :aria-label="`${percentage}% complete`">
      <div
        class="h-full bg-gradient-primary rounded-full transition-all duration-500"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <p class="font-sans text-text-subtle text-sm">
      {{ completed }} of {{ total }} tasks completed
    </p>
  </section>
</template>
