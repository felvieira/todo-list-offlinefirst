import { useEffect, useState } from 'react'
import { Cloud, Loader2, WifiOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { MESSAGES } from '@/shared/lib/messages'

interface SyncIndicatorProps {
  isSyncing?: boolean
}

export function SyncIndicator({ isSyncing = false }: SyncIndicatorProps) {
  const isOnline = useOnlineStatus()
  const [showLabel, setShowLabel] = useState(false)

  // Auto-hide label after 3 seconds
  useEffect(() => {
    if (showLabel) {
      const timer = setTimeout(() => setShowLabel(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showLabel])

  // Show label when status changes
  useEffect(() => {
    setShowLabel(true)
  }, [isOnline, isSyncing])

  const getIndicatorState = () => {
    if (isSyncing) {
      return {
        icon: Loader2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        label: MESSAGES.SYNC_STATUS_SYNCING,
        animate: true,
      }
    }

    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        label: MESSAGES.SYNC_STATUS_OFFLINE,
        animate: false,
      }
    }

    return {
      icon: Cloud,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      label: MESSAGES.SYNC_STATUS_SYNCED,
      animate: false,
    }
  }

  const state = getIndicatorState()
  const Icon = state.icon

  return (
    <motion.button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${state.bgColor}`}
      onClick={() => setShowLabel(!showLabel)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={state.animate ? { rotate: 360 } : {}}
        transition={state.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        <Icon className={`h-4 w-4 ${state.color}`} />
      </motion.div>

      <AnimatePresence>
        {showLabel && (
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-sm font-medium ${state.color} overflow-hidden whitespace-nowrap`}
          >
            {state.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
