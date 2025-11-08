import Dexie, { Table } from 'dexie'

export type Priority = 'low' | 'medium' | 'high'

export interface TodoRow {
  id: string
  title: string
  description?: string
  priority: Priority
  completed: boolean
  created_at: number
  updated_at: number
  user_id?: string
  _dirty?: 0 | 1
}

export interface OpRow {
  id: string
  entity: 'todo'
  action: 'insert' | 'update' | 'delete'
  payload: any
  ts: number
}

export class AppDB extends Dexie {
  todos!: Table<TodoRow, string>
  ops!: Table<OpRow, string>

  constructor() {
    super('myndo-db')
    this.version(1).stores({
      todos: 'id, updated_at, completed, priority',
      ops: 'id, ts'
    })
    // Version 2: Add created_at index for proper ordering
    this.version(2).stores({
      todos: 'id, created_at, updated_at, completed, priority',
      ops: 'id, ts'
    })
  }
}

export const db = new AppDB()
