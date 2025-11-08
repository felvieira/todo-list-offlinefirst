import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAddTodo } from '../api/mutations'
import { Priority, PRIORITY_CONFIG } from '../types'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { scaleIn } from '@/shared/lib/animations'

export function AddTodo() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('low')
  const [expanded, setExpanded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const addMutation = useAddTodo()

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        if (expanded && !title.trim()) {
          setExpanded(false)
          setDescription('')
          setPriority('low')
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [expanded, title])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addMutation.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        priority
      },
      {
        onSuccess: () => {
          setTitle('')
          setDescription('')
          setPriority('low')
          setExpanded(false)
        }
      }
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setExpanded(true)}
              placeholder="Digite sua tarefa..."
              disabled={addMutation.isPending}
              className="rounded-2xl border-2 border-gray-200 focus:border-indigo-500 px-4 py-3 text-base shadow-sm transition-all"
            />
          </div>

          {expanded && (
            <motion.div variants={scaleIn} initial="hidden" animate="visible" className="space-y-2">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição (opcional)"
                disabled={addMutation.isPending}
                className="rounded-2xl border-2 border-gray-200 focus:border-indigo-500 px-4 py-2"
              />

              <div className="flex gap-2 flex-wrap">
                {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
                  const config = PRIORITY_CONFIG[p]
                  const Icon = config.icon
                  return (
                    <Button
                      key={p}
                      type="button"
                      variant={priority === p ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPriority(p)}
                      disabled={addMutation.isPending}
                      className="gap-1 rounded-full"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        <Button
          type="submit"
          disabled={!title.trim() || addMutation.isPending}
          size="icon"
          className="rounded-full h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </form>
  )
}
