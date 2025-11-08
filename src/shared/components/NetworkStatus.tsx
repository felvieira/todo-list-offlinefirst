import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff } from 'lucide-react'
import { useOnline } from '@/shared/hooks/useOnline'
import { slideUp } from '@/shared/lib/animations'

export function NetworkStatus() {
  const online = useOnline()

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">Modo offline</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
