import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Priority } from '../types'

type FilterType = 'all' | 'active' | 'completed'

interface TodoStoreState {
  filter: FilterType
  priorityFilter: Priority | 'all'
  searchQuery: string
  setFilter: (filter: FilterType) => void
  setPriorityFilter: (priority: Priority | 'all') => void
  setSearchQuery: (query: string) => void
}

export const useTodoStore = create<TodoStoreState>()(
  persist(
    (set) => ({
      filter: 'all',
      priorityFilter: 'all',
      searchQuery: '',
      setFilter: (filter) => set({ filter }),
      setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
      setSearchQuery: (searchQuery) => set({ searchQuery })
    }),
    {
      name: 'todo-ui-store'
    }
  )
)
