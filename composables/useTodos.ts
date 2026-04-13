import type { Todo } from '~/types/todo'

const STORAGE_KEY = 'vibe-todo:todos'

export function useTodos() {
  const todos = useState<Todo[]>('todos', () => [])
  const storageError = ref<string | null>(null)

  const pendingCount = computed(() => todos.value.filter(t => !t.completed).length)
  const completedCount = computed(() => todos.value.filter(t => t.completed).length)

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

  onMounted(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        todos.value = JSON.parse(raw) as Todo[]
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
    addTodo,
    toggleTodo,
    deleteTodo,
  }
}
