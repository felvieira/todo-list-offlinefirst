import { useEffect, useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useOnline } from '@/shared/hooks/useOnline'
import { getPendingOps, dequeueOp } from '@/services/db/operations'
import { supabase } from '@/services/supabase/client'
import { db } from '@/services/db/schema'
import { QUERY_KEYS } from '../api/queries'
import { toast } from 'sonner'
import { MESSAGES, getSyncSuccessMessage } from '@/shared/lib/messages'
import { useAuthStore } from '@/features/auth/store/useAuthStore'

export function useSync() {
  const online = useOnline()
  const qc = useQueryClient()
  const isOfflineMode = useAuthStore((state) => state.isOfflineMode)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasPendingOps, setHasPendingOps] = useState(false)

  // Check for pending operations
  const checkPendingOps = useCallback(async () => {
    const ops = await getPendingOps()
    setHasPendingOps(ops.length > 0)
  }, [])

  // Initial check
  useEffect(() => {
    checkPendingOps()
  }, [checkPendingOps])

  useEffect(() => {
    // Don't sync if offline OR if in offline mode (no valid session)
    if (!online || isOfflineMode) return

    let cancelled = false

    ;(async () => {
      const ops = await getPendingOps()

      if (ops.length === 0) {
        setHasPendingOps(false)
        return
      }

      setIsSyncing(true)
      let syncedCount = 0
      let failedCount = 0

      for (const op of ops) {
        if (cancelled) return

        try {
          if (op.entity === 'todo') {
            if (op.action === 'insert') {
              const { error } = await supabase.from('todos').insert([op.payload as any])
              if (error) throw error
            } else if (op.action === 'update') {
              const { error } = await supabase
                .from('todos')
                .update(op.payload as any)
                .eq('id', op.payload.id)
              if (error) throw error
            } else if (op.action === 'delete') {
              const { error } = await supabase.from('todos').delete().eq('id', op.payload.id)
              if (error) throw error
            }
          }

          await dequeueOp(op.id)
          const todoId = op.payload.id
          if (todoId) {
            await db.todos.update(todoId, { _dirty: 0 })
          }
          syncedCount++
        } catch (err: any) {
          console.error('Sync error:', err)

          // If it's an auth error (no valid session), remove the operation from queue
          // This prevents showing errors for operations that can't be synced due to offline login
          if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
            console.log('Auth error - removing operation from queue:', op.id)
            await dequeueOp(op.id)
            // Don't count as failure if it's just an auth issue from offline mode
            continue
          }

          // If it's a duplicate key error (item already exists), remove from queue
          // This happens when the operation was already synced but still in queue
          if (err?.code === '23505') {
            console.log('Duplicate key error - item already synced, removing from queue:', op.id)
            await dequeueOp(op.id)
            const todoId = op.payload.id
            if (todoId) {
              await db.todos.update(todoId, { _dirty: 0 })
            }
            // Count as success since item is already synced
            syncedCount++
            continue
          }

          failedCount++
          break
        }
      }

      setIsSyncing(false)

      // Check if there are still pending operations
      const remainingOps = await getPendingOps()
      setHasPendingOps(remainingOps.length > 0)

      // Show toast notifications
      if (syncedCount > 0) {
        toast.success(getSyncSuccessMessage(syncedCount))
      }

      // Only show error if we actually had failures
      if (failedCount > 0) {
        toast.error(MESSAGES.SYNC_ERROR)
      }

      // Refresh todos list
      qc.invalidateQueries({ queryKey: QUERY_KEYS.todos })
    })()

    return () => {
      cancelled = true
    }
  }, [online, isOfflineMode, qc])

  return { isSyncing, hasPendingOps, checkPendingOps }
}
