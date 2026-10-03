export const qaOperations = ['room-board', 'daily-roster', 'finance-cases'] as const
export type QAOperation = typeof qaOperations[number]
export interface OperationsQAControls { delayMs: number, failOperation?: QAOperation, failAfter: number }

function first(value: unknown) { return Array.isArray(value) ? value[0] : value }

export function parseOperationsQAControls(query: Record<string, unknown>, enabled: boolean): OperationsQAControls {
  if (!enabled) return { delayMs: 0, failAfter: Number.MAX_SAFE_INTEGER }
  const delay = Number(first(query.qa_delay))
  const operation = first(query.qa_fail)
  const failAfter = Number(first(query.qa_fail_after))
  return {
    delayMs: Number.isFinite(delay) ? Math.min(2000, Math.max(0, Math.trunc(delay))) : 0,
    failOperation: typeof operation === 'string' && qaOperations.includes(operation as QAOperation) ? operation as QAOperation : undefined,
    failAfter: Number.isInteger(failAfter) && failAfter >= 0 ? Math.min(failAfter, 20) : Number.MAX_SAFE_INTEGER,
  }
}

export function preserveOperationsQAQuery(query: Record<string, unknown>, enabled = import.meta.dev) {
  if (!enabled) return {}
  return Object.fromEntries(['qa_delay', 'qa_fail', 'qa_fail_after'].flatMap(key => typeof first(query[key]) === 'string' ? [[key, String(first(query[key]))]] : []))
}
