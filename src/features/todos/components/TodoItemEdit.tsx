import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Todo } from '../types'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { listItem } from '@/shared/lib/animations'

interface TodoItemEditProps {
  todo: Todo
  onSave: (data: { title: string; description?: string }) => void
  onCancel: () => void
  isPending: boolean
}

export function TodoItemEdit({ todo, onSave, onCancel, isPending }: TodoItemEditProps) {
  const [title, setTitle] = useState(todo.title)
  const [description, setDescription] = useState(todo.description || '')

  const handleSave = () => {
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim() || undefined
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <motion.div
      variants={listItem}
      layout
      className="group flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-sm border-2 border-indigo-300"
      onKeyDown={handleKeyDown}
    >
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da tarefa"
        className="font-semibold text-base"
        autoFocus
      />
      <Input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        className="text-sm"
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          disabled={isPending}
        >
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={!title.trim() || isPending}
        >
          <Check className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </motion.div>
  )
}
