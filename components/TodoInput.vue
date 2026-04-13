<script setup lang="ts">
const { addTodo } = useTodos()

const inputText = ref('')
const validationError = ref<string | null>(null)

const charCount = computed(() => inputText.value.length)
const isNearLimit = computed(() => charCount.value >= 190)
const isOverLimit = computed(() => charCount.value > 200)

function handleSubmit() {
  validationError.value = null
  try {
    addTodo(inputText.value)
    inputText.value = ''
  }
  catch (err) {
    if (err instanceof Error) {
      validationError.value = err.message
    }
  }
}
</script>

<template>
  <form class="flex flex-col gap-2" @submit.prevent="handleSubmit">
    <div class="flex flex-col sm:flex-row gap-2">
      <input
        v-model="inputText"
        type="text"
        placeholder="ENTER TASK..."
        maxlength="201"
        class="flex-1 px-4 py-3 bg-dark-card border border-neon-violet text-gray-100 font-mono text-sm
               placeholder-neon-violet/50 rounded
               focus:outline-none focus:border-neon-purple focus:shadow-neon-sm
               transition-shadow duration-200"
      >
      <button
        type="submit"
        :disabled="isOverLimit"
        class="px-4 py-3 bg-neon-violet hover:bg-neon-purple text-white font-retro text-xs rounded
               shadow-neon-sm hover:shadow-neon-md
               disabled:opacity-40 disabled:cursor-not-allowed
               transition-all duration-200 whitespace-nowrap"
      >
        ADD
      </button>
    </div>

    <div class="flex justify-between items-center min-h-[1.25rem]">
      <p v-if="validationError" class="text-red-400 font-mono text-xs">
        {{ validationError }}
      </p>
      <span v-else />
      <span
        class="font-mono text-xs transition-colors duration-200"
        :class="isNearLimit ? 'text-red-400' : 'text-neon-violet/60'"
      >
        {{ charCount }} / 200
      </span>
    </div>
  </form>
</template>
