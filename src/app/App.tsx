import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import { useAuthStore, setupAuthListener } from '@/features/auth/store/useAuthStore'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { SignUpPage } from '@/features/auth/pages/SignUpPage'
import { HomePage } from './pages/HomePage'

export default function App() {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    // Initialize auth state and setup listener
    initialize()
    setupAuthListener()
  }, [initialize])

  return (
    <BrowserRouter>
      <Providers>
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{
            duration: 3000,
            classNames: {
              toast: 'rounded-xl',
              title: 'font-semibold',
              description: 'text-sm',
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  )
}
