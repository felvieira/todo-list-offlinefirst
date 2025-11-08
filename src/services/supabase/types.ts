export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high'
          completed: boolean
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          completed?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high'
          completed?: boolean
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
