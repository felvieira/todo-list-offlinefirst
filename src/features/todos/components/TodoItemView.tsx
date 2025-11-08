import { motion } from 'framer-motion'
import { Trash2, Edit2 } from 'lucide-react'
import { Todo, Priority } from '../types'
import { Checkbox } from '@/shared/ui/checkbox'
import { Button } from '@/shared/ui/button'
import { PriorityBadge } from './PriorityBadge'
import { listItem } from '@/shared/lib/animations'
import { cn } from '@/shared/lib/cn'
import { formatDate } from '../lib/formatDate'

interface TodoItemViewProps {
  todo: Todo
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
  onPriorityChange: (priority: Priority) => void
  isTogglePending: boolean
  isDeletePending: boolean
}

export function TodoItemView({
  todo,
  onToggle,
  onEdit,
  onDelete,
  onPriorityChange,
  isTogglePending,
  isDeletePending
}: TodoItemViewProps) {
  return (
    <motion.div
      variants={listItem}
      layout
      className={cn(
        'group flex items-start gap-4 p-5 rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-200',
        todo.completed && 'opacity-60'
      )}
    >
      <div onClick={onToggle} className="cursor-pointer flex-shrink-0">
        <Checkbox
          checked={todo.completed}
          onChange={() => {}} // Controlled by parent onClick
          disabled={isTogglePending}
          className="mt-0.5 pointer-events-none"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className={cn(
              'font-semibold text-base text-gray-900',
              todo.completed && 'line-through text-gray-400'
            )}
          >
            {todo.title}
          </h3>
          <PriorityBadge
            priority={todo.priority}
            onPriorityChange={onPriorityChange}
            interactive
          />
        </div>

        {todo.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{todo.description}</p>
        )}

        <time className="text-xs text-gray-400">
          {formatDate(todo.created_at)}
        </time>
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          disabled={todo.completed}
          className="flex-shrink-0 hover:bg-indigo-50 hover:text-indigo-600"
          aria-label="Editar tarefa"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={isDeletePending}
          className="flex-shrink-0 hover:bg-red-50 hover:text-red-600"
          aria-label="Excluir tarefa"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
