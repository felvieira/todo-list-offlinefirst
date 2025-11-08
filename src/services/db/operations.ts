import { db, OpRow } from './schema'
import { uuid } from '@/shared/lib/uuid'

export async function enqueueOp(op: Omit<OpRow, 'id' | 'ts'>): Promise<OpRow> {
  const row: OpRow = {
    id: uuid(),
    ts: Date.now(),
    ...op
  }
  await db.ops.add(row)
  return row
}

export async function dequeueOp(id: string): Promise<void> {
  await db.ops.delete(id)
}

export async function getPendingOps(): Promise<OpRow[]> {
  return db.ops.orderBy('ts').toArray()
}

export async function clearOps(): Promise<void> {
  await db.ops.clear()
}
