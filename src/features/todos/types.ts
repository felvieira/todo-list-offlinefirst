import { Circle, AlertCircle, AlertTriangle } from 'lucide-react'

export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  title: string
  description?: string
  priority: Priority
  completed: boolean
  created_at: string
  updated_at: string
  user_id?: string
}

export const PRIORITY_CONFIG = {
  low: {
    color: 'gray',
    variant: 'low' as const,
    icon: Circle,
    label: 'Baixa'
  },
  medium: {
    color: 'amber',
    variant: 'medium' as const,
    icon: AlertCircle,
    label: 'Média'
  },
  high: {
    color: 'rose',
    variant: 'high' as const,
    icon: AlertTriangle,
    label: 'Alta'
  }
} as const
