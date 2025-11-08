import { useMemo } from 'react'
import { Todo } from '../types'
import { useTodoStore } from '../store/useTodoStore'

export function useTodoFilters(todos: Todo[] | undefined) {
  const { filter, priorityFilter, searchQuery } = useTodoStore()

  return useMemo(() => {
    if (!todos) return []

    let filtered = todos

    if (filter === 'active') {
      filtered = filtered.filter((t) => !t.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter((t) => t.completed)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [todos, filter, priorityFilter, searchQuery])
}
