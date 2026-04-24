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
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click.self="emit('cancel')"
    >
      <div class="border border-neon-violet bg-dark-card font-mono max-w-sm w-full mx-4 p-6 rounded">
        <p class="text-gray-100 text-sm mb-2">
          Are you sure you want to delete this task?
        </p>
        <p class="text-neon-violet/60 text-xs mb-6 truncate">
          "{{ taskText }}"
        </p>
        <div class="flex gap-3 justify-end">
          <button
            class="px-4 py-2 border border-neon-violet/50 text-neon-violet/80 text-xs font-retro
                   hover:border-neon-violet hover:text-neon-violet transition-all duration-200"
            @click="emit('cancel')"
          >
            CANCEL
          </button>
          <button
            class="px-4 py-2 border border-red-500 text-red-400 text-xs font-retro
                   hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
            @click="emit('confirm')"
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
