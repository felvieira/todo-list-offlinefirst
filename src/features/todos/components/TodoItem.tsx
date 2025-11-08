import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import { Todo } from '../types'
import { useToggleTodo, useDeleteTodo } from '../api/mutations'
import { Checkbox } from '@/shared/ui/checkbox'
import { Button } from '@/shared/ui/button'
import { PriorityBadge } from './PriorityBadge'
import { ConfirmDialog } from '@/shared/ui/dialog'
import { listItem } from '@/shared/lib/animations'
import { cn } from '@/shared/lib/cn'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const toggleMutation = useToggleTodo()
  const deleteMutation = useDeleteTodo()

  const handleToggle = () => {
    toggleMutation.mutate({ id: todo.id, completed: !todo.completed })
  }

  const handleDelete = () => {
    deleteMutation.mutate(todo.id)
  }

  return (
    <motion.div
      variants={listItem}
      layout
      className={cn(
        'group flex items-start gap-4 p-5 rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-indigo-200',
        todo.completed && 'opacity-60'
      )}
    >
      <div onClick={handleToggle} className="cursor-pointer flex-shrink-0">
        <Checkbox
          checked={todo.completed}
          onChange={() => {}} // Controlled by parent onClick
          disabled={toggleMutation.isPending}
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
          <PriorityBadge priority={todo.priority} />
        </div>

        {todo.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{todo.description}</p>
        )}

        <time className="text-xs text-gray-400">
          {new Date(todo.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </time>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDeleteDialog(true)}
        disabled={deleteMutation.isPending}
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Excluir tarefa"
        description={`Tem certeza que deseja excluir "${todo.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="danger"
      />
    </motion.div>
  )
}
