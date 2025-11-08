import { motion } from 'framer-motion'
import { Loader2, ListTodo } from 'lucide-react'
import { useTodos } from '../api/queries'
import { useTodoFilters } from '../hooks/useTodoFilters'
import { TodoItem } from './TodoItem'
import { AddTodo } from './AddTodo'
import { EmptyState } from '@/shared/components/EmptyState'
import { listContainer } from '@/shared/lib/animations'
import { Button } from '@/shared/ui/button'

export function TodoList() {
  const { data: todos, isLoading, error, refetch } = useTodos()
  const filteredTodos = useTodoFilters(todos)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={ListTodo}
        title="Erro ao carregar tarefas"
        description="Tente novamente mais tarde"
        action={
          <Button onClick={() => refetch()} variant="outline">
            Tentar novamente
          </Button>
        }
      />
    )
  }

  return (
    <>
      {/* Tasks List */}
      <div className="pb-48">
        {filteredTodos.length === 0 ? (
          <EmptyState
            icon={ListTodo}
            title="Nenhuma tarefa encontrada"
            description={
              todos?.length === 0
                ? 'Adicione sua primeira tarefa abaixo'
                : 'Nenhuma tarefa corresponde aos filtros'
            }
          />
        ) : (
          <motion.div
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Fixed Footer Input */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur-md shadow-lg z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <AddTodo />
        </div>
      </div>
    </>
  )
}
