<script setup lang="ts">
// Static display component — no props or emits
</script>

<template>
  <header class="flex items-center justify-between py-2">
    <div class="flex-1">
      <!-- spacer -->
    </div>

    <!-- Title with sparkles -->
    <div class="flex flex-col items-center gap-1 flex-1">
      <div class="flex items-center gap-3">
        <span class="text-2xl" aria-hidden="true">✨</span>
        <h1 class="font-sans font-medium text-[60px] leading-[60px] text-gradient-primary">
          Vibe ToDo
        </h1>
        <span class="text-2xl" aria-hidden="true">✨</span>
      </div>
      <p class="font-sans text-text-medium text-base">
        Your productivity companion
      </p>
    </div>

    <!-- Notification Bell -->
    <div class="flex-1 flex justify-end">
      <button
        type="button"
        class="w-[37px] h-[37px] min-w-[44px] min-h-[44px] bg-white/70 border border-[#E2E8F0] rounded-sm
               flex items-center justify-center text-text-subtle hover:text-primary hover:border-primary
               focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
        aria-label="Notifications (no notifications)"
        title="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M9 1.5C9 1.5 5 3 5 8v3l-1.5 2.5h11L13 11V8C13 3 9 1.5 9 1.5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <path d="M7.5 14a1.5 1.5 0 003 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </header>
</template>
