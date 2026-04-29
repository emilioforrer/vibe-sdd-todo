<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  taskText: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function onKeyDown(e: KeyboardEvent) {
  if (!props.isOpen) return
  if (e.key === 'Escape') emit('cancel')
  if (e.key === 'Enter') emit('confirm')
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
      @click.self="emit('cancel')"
    >
      <div class="bg-glass-card rounded-lg shadow-glass-lg max-w-sm w-full p-6">
        <h2 id="confirm-dialog-title" class="text-text-dark font-sans font-medium text-base mb-2">
          Delete task?
        </h2>
        <p class="text-text-subtle font-sans text-sm mb-6 truncate">
          "{{ taskText }}"
        </p>
        <div class="flex gap-3 justify-end">
          <button
            class="min-w-[44px] min-h-[44px] px-4 py-2 bg-white/70 border border-[#E2E8F0] text-text-medium font-sans text-sm rounded-sm
                   hover:border-primary hover:text-primary transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-primary/30"
            @click="emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="min-w-[44px] min-h-[44px] px-4 py-2 bg-error/10 border border-error/40 text-error font-sans text-sm rounded-sm
                   hover:bg-error/20 transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-error/30"
            @click="emit('confirm')"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
