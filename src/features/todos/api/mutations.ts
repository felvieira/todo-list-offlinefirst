import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/services/supabase/client'
import { db } from '@/services/db/schema'
import { enqueueOp } from '@/services/db/operations'
import { uuid } from '@/shared/lib/uuid'
import { Todo, Priority } from '../types'
import { QUERY_KEYS } from './queries'
import { toast } from 'sonner'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { MESSAGES, getSyncDescription } from '@/shared/lib/messages'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

interface AddTodoInput {
  id?: string
  title: string
  description?: string
  priority?: Priority
}

interface UpdateTodoInput {
  id: string
  title?: string
  description?: string
  priority?: Priority
  completed?: boolean
}

const IMMEDIATE_SYNC_TIMEOUT_MS = 4000

type SyncTimeout = {
  timedOut: true
}

function getBrowserOnlineStatus() {
  if (typeof navigator === 'undefined') return true
  return navigator.onLine
}

function createTimeoutPromise(ms: number) {
  let timeoutId: ReturnType<typeof setTimeout>
  const promise = new Promise<SyncTimeout>((resolve) => {
    timeoutId = setTimeout(() => resolve({ timedOut: true }), ms)
  })
  const cancel = () => clearTimeout(timeoutId)
  return { promise, cancel }
}

function isTimeoutResult(result: any): result is SyncTimeout {
  return Boolean(result && typeof result === 'object' && 'timedOut' in result)
}

function ensureTodoId(input: AddTodoInput) {
  if (!input.id) {
    input.id = uuid()
  }
  return input.id
}

export function useAddTodo() {
  const qc = useQueryClient()
  const isOnline = useOnlineStatus()
  const user = useAuthStore((state) => state.user)
  const isOfflineMode = useAuthStore((state) => state.isOfflineMode)

  return useMutation({
    mutationFn: async (input: AddTodoInput) => {
      const id = ensureTodoId(input)
      const now = Date.now()
      const priority = input.priority ?? 'low'
      const userId = user?.id

      // Check online status at mutation time, not at hook creation time
      const browserOnline = getBrowserOnlineStatus()
      const shouldAttemptImmediateSync = browserOnline && !isOfflineMode

      await db.todos.put({
        id,
        title: input.title,
        description: input.description,
        priority,
        completed: false,
        created_at: now,
        updated_at: now,
        user_id: userId,
        _dirty: 1
      })

      await enqueueOp({
        entity: 'todo',
        action: 'insert',
        payload: {
          id,
          title: input.title,
          description: input.description,
          priority,
          completed: false,
          user_id: userId
        }
      })

      let synced = false

      if (shouldAttemptImmediateSync) {
        const payload = {
          id,
          title: input.title,
          description: input.description,
          priority,
          completed: false,
          user_id: userId
        }

        const { promise: timeoutPromise, cancel } = createTimeoutPromise(IMMEDIATE_SYNC_TIMEOUT_MS)

        try {
          const result = await Promise.race([
            supabase.from('todos').insert([payload as any]),
            timeoutPromise
          ])

          if (isTimeoutResult(result)) {
            // Timeout - will sync later via background sync
          } else if (!result.error) {
            await db.todos.update(id, { _dirty: 0 })
            synced = true
          }
        } catch {
          // Network/abort errors should not block UI; keep queued for later sync
        } finally {
          cancel()
        }
      }

      return { id, synced }
    },
    onMutate: async (variables) => {
      const id = ensureTodoId(variables)
      const optimisticDate = new Date().toISOString()
      await qc.cancelQueries({ queryKey: QUERY_KEYS.todos })

      const previousTodos = qc.getQueryData<Todo[]>(QUERY_KEYS.todos) ?? []
      const optimisticTodo: Todo = {
        id,
        title: variables.title,
        description: variables.description,
        priority: variables.priority ?? 'low',
        completed: false,
        created_at: optimisticDate,
        updated_at: optimisticDate,
        user_id: user?.id
      }

      qc.setQueryData<Todo[]>(QUERY_KEYS.todos, [optimisticTodo, ...previousTodos])

      return { previousTodos }
    },
    onSuccess: (_data, _variables) => {
      // Only invalidate if synced (online)
      // If offline, keep the optimistic update from onMutate
      if (_data.synced) {
        qc.invalidateQueries({ queryKey: QUERY_KEYS.todos })
      }

      if (_data.synced) {
        toast.success(MESSAGES.TODO_CREATED_AND_SYNCED)
      } else {
        toast.success(MESSAGES.TODO_SAVED_LOCALLY, {
          description: getSyncDescription(isOnline)
        })
      }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        qc.setQueryData(QUERY_KEYS.todos, context.previousTodos)
      }
      toast.error(MESSAGES.TODO_CREATE_ERROR)
    }
  })
}

export function useToggleTodo() {
  const qc = useQueryClient()
  const isOnline = useOnlineStatus()

  return useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const now = Date.now()

      await db.todos.update(id, { completed, updated_at: now, _dirty: 1 })

      await enqueueOp({
        entity: 'todo',
        action: 'update',
        payload: { id, completed, updated_at: new Date(now).toISOString() }
      })

      let synced = false

      // Only try to sync if online
      if (isOnline) {
        try {
          const { error } = await supabase.from('todos').update({ completed } as any).eq('id', id)
          if (!error) {
            await db.todos.update(id, { _dirty: 0 })
            synced = true
          }
        } catch {}
      }

      return { synced, completed }
    },
    onMutate: async ({ id, completed }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.todos })
      const prev = qc.getQueryData<Todo[]>(QUERY_KEYS.todos)
      if (prev) {
        qc.setQueryData<Todo[]>(
          QUERY_KEYS.todos,
          prev.map((t) => (t.id === id ? { ...t, completed } : t))
        )
      }
      return { prev }
    },
    onSuccess: (data) => {
      if (!data.synced && !isOnline) {
        toast.info(MESSAGES.TODO_UPDATED_LOCALLY, {
          description: MESSAGES.SYNC_WHEN_ONLINE
        })
      }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(QUERY_KEYS.todos, ctx.prev)
      }
      toast.error(MESSAGES.TODO_UPDATE_ERROR)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todos })
    }
  })
}

export function useUpdateTodo() {
  const qc = useQueryClient()
  const isOnline = useOnlineStatus()

  return useMutation({
    mutationFn: async (input: UpdateTodoInput) => {
      const now = Date.now()
      const updates: any = { updated_at: now, _dirty: 1 }

      if (input.title !== undefined) updates.title = input.title
      if (input.description !== undefined) updates.description = input.description
      if (input.priority !== undefined) updates.priority = input.priority
      if (input.completed !== undefined) updates.completed = input.completed

      await db.todos.update(input.id, updates)

      const payload: any = { id: input.id, updated_at: new Date(now).toISOString() }
      if (input.title !== undefined) payload.title = input.title
      if (input.description !== undefined) payload.description = input.description
      if (input.priority !== undefined) payload.priority = input.priority
      if (input.completed !== undefined) payload.completed = input.completed

      await enqueueOp({
        entity: 'todo',
        action: 'update',
        payload
      })

      // Only try to sync if online
      if (isOnline) {
        try {
          const todoUpdate: any = {}
          if (input.title !== undefined) todoUpdate.title = input.title
          if (input.description !== undefined) todoUpdate.description = input.description
          if (input.priority !== undefined) todoUpdate.priority = input.priority
          if (input.completed !== undefined) todoUpdate.completed = input.completed

          const { error } = await supabase.from('todos').update(todoUpdate).eq('id', input.id)
          if (!error) {
            await db.todos.update(input.id, { _dirty: 0 })
          }
        } catch {}
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todos })
    }
  })
}

export function useDeleteTodo() {
  const qc = useQueryClient()
  const isOnline = useOnlineStatus()

  return useMutation({
    mutationFn: async (id: string) => {
      await db.todos.delete(id)

      await enqueueOp({
        entity: 'todo',
        action: 'delete',
        payload: { id }
      })

      let synced = false

      // Only try to sync if online
      if (isOnline) {
        try {
          const { error } = await supabase.from('todos').delete().eq('id', id)
          if (!error) {
            synced = true
          }
        } catch {}
      }

      return { synced }
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todos })

      if (data.synced) {
        toast.success(MESSAGES.TODO_DELETED_SUCCESS)
      } else {
        toast.success(MESSAGES.TODO_DELETED_LOCALLY, {
          description: getSyncDescription(isOnline)
        })
      }
    },
    onError: () => {
      toast.error(MESSAGES.TODO_DELETE_ERROR)
    }
  })
}
