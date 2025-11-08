import { useState } from 'react'
import { Priority } from '../types'
import { useUpdateTodo } from '../api/mutations'

interface UseTodoItemEditProps {
  todoId: string
}

interface UpdateData {
  title?: string
  description?: string
  priority?: Priority
}

export function useTodoItemEdit({ todoId }: UseTodoItemEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const updateMutation = useUpdateTodo()

  const startEdit = () => setIsEditing(true)
  const cancelEdit = () => setIsEditing(false)

  const saveEdit = (data: UpdateData) => {
    updateMutation.mutate(
      {
        id: todoId,
        ...data
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        }
      }
    )
  }

  const updatePriority = (priority: Priority) => {
    updateMutation.mutate({
      id: todoId,
      priority
    })
  }

  return {
    isEditing,
    isPending: updateMutation.isPending,
    startEdit,
    cancelEdit,
    saveEdit,
    updatePriority
  }
}
