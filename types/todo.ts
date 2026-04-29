export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt?: number
  order?: number
  scheduledDate?: string
}

export type FilterStatus = 'today' | 'all' | 'pending' | 'completed'
