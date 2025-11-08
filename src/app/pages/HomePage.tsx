import { LogOut, User } from 'lucide-react'
import { useSync } from '@/features/todos/hooks/useSync'
import { useAuthStore } from '@/features/auth/store/useAuthStore'
import { TodoList } from '@/features/todos/components/TodoList'
import { SyncIndicator } from '@/shared/components/SyncIndicator'
import { Button } from '@/shared/ui/button'

export function HomePage() {
  const { isSyncing } = useSync()
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const isOfflineMode = useAuthStore((state) => state.isOfflineMode)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="flex-none px-4 py-6 border-b bg-white/50 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Myndo
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Organize suas tarefas com eficiência</p>
          </div>

          {/* User Menu & Sync Status */}
          <div className="flex items-center gap-3">
            <SyncIndicator isSyncing={isSyncing} />

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-200">
              {isOfflineMode && (
                <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                  Modo Offline
                </span>
              )}
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-red-50 hover:text-red-600"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <TodoList />
        </div>
      </main>
    </div>
  )
}
