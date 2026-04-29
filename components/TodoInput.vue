<script setup lang="ts">
const { addTodo } = useTodos()

const inputText = ref('')
const selectedDate = ref<string | undefined>(undefined)
const validationError = ref<string | null>(null)

const charCount = computed(() => inputText.value.length)
const isNearLimit = computed(() => charCount.value >= 190)
const isOverLimit = computed(() => charCount.value > 200)

function handleSubmit() {
  validationError.value = null
  try {
    addTodo(inputText.value, selectedDate.value)
    inputText.value = ''
    selectedDate.value = undefined
  }
  catch (err) {
    if (err instanceof Error) {
      validationError.value = err.message
    }
  }
}
</script>

<template>
  <form class="flex flex-col gap-3" @submit.prevent="handleSubmit">
    <div class="flex gap-3">
      <input
        v-model="inputText"
        type="text"
        placeholder="What would you like to accomplish?"
        maxlength="201"
        class="flex-1 px-5 py-4 h-[60px] bg-white/80 border-2 border-[#E2E8F0] text-text-dark font-sans text-base
               placeholder-text-placeholder rounded-md
               focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
               transition-all duration-200"
      >
      <DatePicker
        v-model="selectedDate"
        trigger-class="h-[60px] w-[56px] bg-white border-2 border-[#DDD6FF] rounded-md shadow-glass-sm
                       flex items-center justify-center text-primary hover:border-primary hover:shadow-glass-sm
                       focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
      />
      <button
        type="submit"
        :disabled="isOverLimit"
        class="px-6 h-[60px] bg-gradient-primary text-white font-sans font-medium text-base rounded-md
               shadow-glass-sm hover:opacity-90
               disabled:opacity-40 disabled:cursor-not-allowed
               focus:outline-none focus:ring-2 focus:ring-primary/40
               transition-all duration-200 whitespace-nowrap"
      >
        Add Task
      </button>
    </div>

    <div
      v-if="selectedDate"
      class="flex items-center gap-2 text-text-subtle font-sans text-sm"
    >
      <span>📅</span>
      <span>Scheduled for {{ new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(selectedDate + 'T00:00:00Z')) }}</span>
      <button
        type="button"
        class="text-text-placeholder hover:text-error transition-colors ml-1"
        aria-label="Clear date"
        @click="selectedDate = undefined"
      >
        ×
      </button>
    </div>

    <div class="flex justify-between items-center min-h-[1.25rem]">
      <p v-if="validationError" class="text-error font-sans text-sm">
        {{ validationError }}
      </p>
      <span v-else />
      <span
        class="font-sans text-xs transition-colors duration-200"
        :class="isNearLimit ? 'text-error' : 'text-text-placeholder'"
      >
        {{ charCount }} / 200
      </span>
    </div>
  </form>
</template>
