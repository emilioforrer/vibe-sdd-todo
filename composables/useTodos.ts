import type { Todo } from '~/types/todo'

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

  const pendingCount = computed(() => todos.value.filter(t => !t.completed).length)
  const completedCount = computed(() => todos.value.filter(t => t.completed).length)

  // Pagination
  const currentPage = ref(1)
  const totalPages = computed(() => Math.max(1, Math.ceil(todos.value.length / PAGE_SIZE)))
  const paginatedTodos = computed(() =>
    todos.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE),
  )

  function setPage(n: number) {
    currentPage.value = Math.min(Math.max(1, n), totalPages.value)
  }

  watch(() => todos.value.length, () => {
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

  function addTodo(text: string): void {
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
    pendingCount,
    completedCount,
    currentPage,
    totalPages,
    paginatedTodos,
    setPage,
    addTodo,
    toggleTodo,
    deleteTodo,
    reorderTodos,
  }
}
