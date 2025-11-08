import { useState } from 'react'
import { Todo } from '../types'
import { useToggleTodo, useDeleteTodo } from '../api/mutations'
import { TodoItemEdit } from './TodoItemEdit'
import { TodoItemView } from './TodoItemView'
import { ConfirmDialog } from '@/shared/ui/dialog'
import { useTodoItemEdit } from '../hooks/useTodoItemEdit'

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toggleMutation = useToggleTodo()
  const deleteMutation = useDeleteTodo()

  const {
    isEditing,
    isPending,
    startEdit,
    cancelEdit,
    saveEdit,
    updatePriority
  } = useTodoItemEdit({ todoId: todo.id })

  const handleToggle = () => {
    toggleMutation.mutate({ id: todo.id, completed: !todo.completed })
  }

  const handleDelete = () => {
    deleteMutation.mutate(todo.id)
    setShowDeleteDialog(false)
  }

  if (isEditing) {
    return (
      <TodoItemEdit
        todo={todo}
        onSave={saveEdit}
        onCancel={cancelEdit}
        isPending={isPending}
      />
    )
  }

  return (
    <>
      <TodoItemView
        todo={todo}
        onToggle={handleToggle}
        onEdit={startEdit}
        onDelete={() => setShowDeleteDialog(true)}
        onPriorityChange={updatePriority}
        isTogglePending={toggleMutation.isPending}
        isDeletePending={deleteMutation.isPending}
      />

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
    </>
  )
}
