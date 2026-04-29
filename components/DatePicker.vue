<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  triggerClass?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [date: string | undefined]
}>()

const isOpen = ref(false)

// Current calendar view month/year
const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

interface CalendarDay {
  date: string // ISO yyyy-MM-dd
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = viewYear.value
  const month = viewMonth.value
  const todayStr = new Date().toISOString().slice(0, 10)

  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const days: CalendarDay[] = []

  // Prev month padding
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    const correctedYear = month === 0 ? year - 1 : year
    const correctedMonth = month === 0 ? 12 : month
    const ds = `${correctedYear}-${String(correctedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: ds, day: d, isCurrentMonth: false, isToday: ds === todayStr, isSelected: ds === props.modelValue })
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: ds, day: d, isCurrentMonth: true, isToday: ds === todayStr, isSelected: ds === props.modelValue })
  }

  // Next month padding to fill 6 rows = 42 cells
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    const correctedYear = month === 11 ? year + 1 : year
    const correctedMonth = month === 11 ? 1 : month + 2
    const ds = `${correctedYear}-${String(correctedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: ds, day: d, isCurrentMonth: false, isToday: ds === todayStr, isSelected: ds === props.modelValue })
  }

  return days
})

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  }
  else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  }
  else {
    viewMonth.value++
  }
}

function selectDate(date: string) {
  emit('update:modelValue', date)
  isOpen.value = false
}

function clearDate() {
  emit('update:modelValue', undefined)
  isOpen.value = false
}

function toggleOpen() {
  isOpen.value = !isOpen.value
  if (isOpen.value && props.modelValue) {
    const d = new Date(props.modelValue + 'T00:00:00Z')
    viewYear.value = d.getUTCFullYear()
    viewMonth.value = d.getUTCMonth()
  }
}

// Click outside to close
const containerRef = ref<HTMLElement | null>(null)
function onDocumentClick(e: MouseEvent) {
  if (!containerRef.value?.contains(e.target as Node)) {
    isOpen.value = false
  }
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- Trigger Button -->
    <button
      type="button"
      :class="triggerClass"
      aria-label="Pick a date"
      :aria-expanded="isOpen"
      @click.stop="toggleOpen"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M6 2v4M14 2v4M2 9h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <!-- Calendar Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-2 z-50 bg-glass-card rounded-lg shadow-glass-lg p-4 w-72"
        role="dialog"
        aria-label="Date picker"
        @click.stop
      >
        <!-- Month Navigation -->
        <div class="flex items-center justify-between mb-3">
          <button
            type="button"
            class="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-subtle hover:text-primary
                   rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            aria-label="Previous month"
            @click="prevMonth"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
          <span class="font-sans font-medium text-text-dark text-sm">
            {{ MONTH_NAMES[viewMonth] }} {{ viewYear }}
          </span>
          <button
            type="button"
            class="min-w-[44px] min-h-[44px] flex items-center justify-center text-text-subtle hover:text-primary
                   rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            aria-label="Next month"
            @click="nextMonth"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>

        <!-- Day Headers -->
        <div class="grid grid-cols-7 mb-1">
          <span
            v-for="label in DAY_LABELS"
            :key="label"
            class="text-center font-sans text-xs text-text-placeholder py-1"
          >
            {{ label }}
          </span>
        </div>

        <!-- Calendar Grid -->
        <div class="grid grid-cols-7 gap-0.5">
          <button
            v-for="cell in calendarDays"
            :key="cell.date"
            type="button"
            class="min-w-[36px] min-h-[36px] w-full aspect-square flex items-center justify-center rounded-sm font-sans text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-150"
            :class="[
              cell.isSelected ? 'bg-gradient-primary text-white font-medium' :
              cell.isToday ? 'border-2 border-primary text-primary font-medium' :
              cell.isCurrentMonth ? 'text-text-dark hover:bg-primary/10' :
              'text-text-placeholder hover:bg-primary/5',
            ]"
            :aria-label="cell.date"
            :aria-pressed="cell.isSelected"
            @click="selectDate(cell.date)"
          >
            {{ cell.day }}
          </button>
        </div>

        <!-- Clear Date -->
        <button
          type="button"
          class="mt-3 w-full min-h-[40px] font-sans text-sm text-text-subtle hover:text-primary border border-[#E2E8F0]
                 hover:border-primary rounded-sm transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
          @click="clearDate"
        >
          No date / Clear
        </button>
      </div>
    </Transition>
  </div>
</template>
