import type { Todo, FilterStatus } from '~/types/todo'

const STORAGE_KEY = 'vibe-todo:todos'
const PAGE_SIZE = 15

export function formatRelativeTime(ts: number | undefined): string {
  if (!ts) return 'Date unknown'
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffMs = ts - Date.now()
  const absDiff = Math.abs(diffMs)
  if (absDiff < 60_000) return rtf.format(Math.round(diffMs / 1000), 'second')
  if (absDiff < 3_600_000) return rtf.format(Math.round(diffMs / 60_000), 'minute')
  if (absDiff < 86_400_000) return rtf.format(Math.round(diffMs / 3_600_000), 'hour')
  if (absDiff < 2_592_000_000) return rtf.format(Math.round(diffMs / 86_400_000), 'day')
  if (absDiff < 31_536_000_000) return rtf.format(Math.round(diffMs / 2_592_000_000), 'month')
  return rtf.format(Math.round(diffMs / 31_536_000_000), 'year')
}

export function formatAbsoluteTime(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(ts))
}

export function useTodos() {
  const todos = useState<Todo[]>('todos', () => [])
  const storageError = ref<string | null>(null)

  // Filter & search state
  const searchQuery = ref<string>('')
  const activeFilter = ref<FilterStatus>('today')

  // Derived counts from full todos array
  const pendingCount = computed(() => todos.value.filter(t => !t.completed).length)
  const completedCount = computed(() => todos.value.filter(t => t.completed).length)
  const totalCount = computed(() => todos.value.length)

  const todayCount = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    return todos.value.filter(t => !t.scheduledDate || t.scheduledDate === today).length
  })

  const progressPercentage = computed(() =>
    totalCount.value === 0 ? 0 : Math.round((completedCount.value / totalCount.value) * 100),
  )

  // Filtered todos
  const filteredTodos = computed(() => {
    const today = new Date().toISOString().slice(0, 10)
    const query = searchQuery.value.trim().toLowerCase()

    let result = todos.value

    // Apply filter
    if (activeFilter.value === 'today') {
      result = result.filter(t => !t.scheduledDate || t.scheduledDate === today)
    }
    else if (activeFilter.value === 'pending') {
      result = result.filter(t => !t.completed)
    }
    else if (activeFilter.value === 'completed') {
      result = result.filter(t => t.completed)
    }
    // 'all' — no filter

    // Apply search
    if (query) {
      result = result.filter(t => t.text.toLowerCase().includes(query))
    }

    return result
  })

  // Pagination
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(filteredTodos.value.length / PAGE_SIZE)))
  const paginatedTodos = computed(() =>
    filteredTodos.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
  )

  function setPage(n: number) {
    currentPage.value = Math.min(Math.max(1, n), totalPages.value)
  }

  // Reset page to 1 when filter or search changes
  watch([activeFilter, searchQuery], () => {
    currentPage.value = 1
  })

  watch(() => filteredTodos.value.length, () => {
    currentPage.value = Math.min(currentPage.value, totalPages.value)
  })

  function persist() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
    }
    catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        storageError.value = 'Storage is full. Some changes may not be saved.'
      }
      else {
        storageError.value = 'Could not save todos to local storage.'
      }
    }
  }

  function addTodo(text: string, scheduledDate?: string): void {
    const trimmed = text.trim()
    if (!trimmed) {
      throw new Error('Todo text cannot be empty.')
    }
    if (trimmed.length > 200) {
      throw new Error('Todo text cannot exceed 200 characters.')
    }
    const todo: Todo = {
      id: crypto.randomUUID(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      order: todos.value.length,
      ...(scheduledDate ? { scheduledDate } : {}),
    }
    todos.value = [...todos.value, todo]
    persist()
  }

  function toggleTodo(id: string): void {
    const index = todos.value.findIndex(t => t.id === id)
    if (index === -1) return
    const updated = [...todos.value]
    updated[index] = { ...updated[index], completed: !updated[index].completed }
    todos.value = updated
    persist()
  }

  function deleteTodo(id: string): void {
    todos.value = todos.value.filter(t => t.id !== id)
    persist()
  }

  function reorderTodos(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= todos.value.length || toIndex >= todos.value.length) return
    const updated = [...todos.value]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    todos.value = updated.map((t, i) => ({ ...t, order: i }))
    persist()
  }

  function updateTodoDate(id: string, date: string | undefined): void {
    const index = todos.value.findIndex(t => t.id === id)
    if (index === -1) return
    const updated = [...todos.value]
    const { scheduledDate: _removed, ...rest } = updated[index]
    updated[index] = date ? { ...rest, scheduledDate: date } : { ...rest }
    todos.value = updated
    persist()
  }

  onMounted(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Todo[]
        // Backfill order from array index; do NOT backfill createdAt (FR-021)
        todos.value = parsed.map((todo, index) => ({
          ...todo,
          order: todo.order ?? index,
        }))
      }
    }
    catch {
      todos.value = []
    }
  })

  watch(todos, () => {
    if (import.meta.client) {
      persist()
    }
  }, { deep: true })

  return {
    todos: readonly(todos),
    storageError: readonly(storageError),
    searchQuery,
    activeFilter,
    filteredTodos,
    pendingCount,
    completedCount,
    totalCount,
    todayCount,
    progressPercentage,
    currentPage,
    totalPages,
    paginatedTodos,
    setPage,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
    updateTodoDate,
  }
}
