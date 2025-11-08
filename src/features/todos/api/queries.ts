import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/services/supabase/client'
import { db, TodoRow } from '@/services/db/schema'
import { Todo } from '../types'

const QUERY_KEYS = {
  todos: ['todos'] as const,
  todo: (id: string) => ['todos', id] as const
}

export const useTodos = () =>
  useQuery({
    queryKey: QUERY_KEYS.todos,
    queryFn: async (): Promise<Todo[]> => {
      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (data) {
          const rows: TodoRow[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description || undefined,
            priority: d.priority,
            completed: d.completed,
            created_at: new Date(d.created_at).getTime(),
            updated_at: new Date(d.updated_at).getTime(),
            user_id: d.user_id || undefined,
            _dirty: 0
          }))
          await db.todos.bulkPut(rows)
        }

        return (data as any) ?? []
      } catch {
        const local = await db.todos.orderBy('created_at').reverse().toArray()
        return local.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          priority: l.priority,
          completed: l.completed,
          created_at: new Date(l.created_at).toISOString(),
          updated_at: new Date(l.updated_at).toISOString(),
          user_id: l.user_id
        }))
      }
    },
    staleTime: 30_000
  })

export { QUERY_KEYS }
