import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/services/supabase/client'
import {
  cacheCredentials,
  verifyCachedCredentials,
  updateCacheValidation,
  clearCachedCredentials,
  saveOfflineSession,
  getOfflineSession,
  clearOfflineSession
} from '@/services/auth/credentialsCache'

interface AuthState {
  // State
  user: User | null
  session: Session | null
  loading: boolean
  isOfflineMode: boolean

  // Actions
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  setIsOfflineMode: (isOfflineMode: boolean) => void

  // Auth Methods
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; offlineMode?: boolean }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>

  // Initialization
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: true,
      isOfflineMode: false,

      // Setters
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session, user: session?.user ?? null }),
      setLoading: (loading) => set({ loading }),
      setIsOfflineMode: (isOfflineMode) => set({ isOfflineMode }),

      // Initialize auth state
      initialize: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          set({
            session,
            user: session?.user ?? null,
            loading: false,
            isOfflineMode: false
          })
        } catch (err) {
          // If offline or error, try to restore offline session
          console.log('Failed to get session (likely offline):', err)

          const offlineSession = getOfflineSession()
          if (offlineSession) {
            const offlineUser: User = {
              id: offlineSession.userId,
              email: offlineSession.email,
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            } as User

            set({
              user: offlineUser,
              isOfflineMode: true,
              loading: false
            })
          } else {
            set({ loading: false })
          }
        }
      },

      // Sign up
      signUp: async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        return { error }
      },

      // Sign in (online/offline)
      signIn: async (email: string, password: string) => {
        const isOnline = navigator.onLine

        // Try online login first
        if (isOnline) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })

            if (!error && data.user) {
              // Cache credentials for future offline login
              await cacheCredentials(email, password, data.user.id)
              await updateCacheValidation()

              set({
                user: data.user,
                session: data.session,
                isOfflineMode: false
              })

              return { error: null, offlineMode: false }
            }

            return { error, offlineMode: false }
          } catch (err) {
            // Network error, try offline login
            console.log('Online login failed, trying offline...', err)
          }
        }

        // Offline login attempt
        const { valid, userId, expired } = await verifyCachedCredentials(email, password)

        if (expired) {
          return {
            error: {
              message: 'Suas credenciais offline expiraram. Conecte-se à internet para fazer login.',
              name: 'OfflineExpired',
              status: 401
            } as AuthError,
            offlineMode: false
          }
        }

        if (!valid) {
          return {
            error: {
              message: 'Email ou senha inválidos, ou você nunca fez login online antes.',
              name: 'InvalidCredentials',
              status: 401
            } as AuthError,
            offlineMode: false
          }
        }

        // Create offline user session
        const offlineUser: User = {
          id: userId || email,
          email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as User

        set({
          user: offlineUser,
          isOfflineMode: true
        })

        // Save offline session for page refresh
        saveOfflineSession(email, userId || email)

        return { error: null, offlineMode: true }
      },

      // Sign in with Google
      signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        return { error }
      },

      // Sign out
      signOut: async () => {
        await supabase.auth.signOut()
        clearCachedCredentials()
        clearOfflineSession()
        set({
          user: null,
          session: null,
          isOfflineMode: false
        })
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        // Only persist offline mode flag, not user/session
        // (those are restored via initialize or offline session)
        isOfflineMode: state.isOfflineMode
      })
    }
  )
)

// Setup auth state listener (called once at app startup)
export const setupAuthListener = () => {
  supabase.auth.onAuthStateChange((_event, session) => {
    useAuthStore.setState({
      session,
      user: session?.user ?? null,
      loading: false,
      isOfflineMode: false
    })
  })
}
