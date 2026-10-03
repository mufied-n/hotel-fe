export type StaffFilterValue = string | number
export type StaffFilterSchema = Record<string, {
  type: 'string' | 'integer' | 'date' | 'enum'
  default?: StaffFilterValue
  values?: readonly string[]
  min?: number
  max?: number
  maxLength?: number
}>

function first(value: unknown) {
  return Array.isArray(value) ? value[0] : value
}

export function decodeStaffFilterQuery(schema: StaffFilterSchema, query: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(schema).map(([key, rule]) => {
    const raw = first(query[key])
    if (rule.type === 'integer') {
      const parsed = typeof raw === 'string' && /^\d+$/.test(raw) ? Number(raw) : Number.NaN
      return [key, Number.isInteger(parsed) && parsed >= (rule.min ?? 0) && parsed <= (rule.max ?? Number.MAX_SAFE_INTEGER) ? parsed : (rule.default ?? 0)]
    }
    const value = typeof raw === 'string' ? raw.trim().slice(0, rule.maxLength ?? 80) : ''
    if (rule.type === 'date') return [key, /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : (rule.default ?? '')]
    if (rule.type === 'enum') return [key, rule.values?.includes(value) ? value : (rule.default ?? '')]
    return [key, value || (rule.default ?? '')]
  })) as Record<string, StaffFilterValue>
}

export function encodeStaffFilterQuery(schema: StaffFilterSchema, values: Record<string, StaffFilterValue>) {
  const query: Record<string, string> = {}
  for (const [key, rule] of Object.entries(schema)) {
    const value = values[key] ?? rule.default ?? ''
    if (value === '' || value === 0 || (rule.default !== undefined && value === rule.default)) continue
    query[key] = String(value)
  }
  return query
}
