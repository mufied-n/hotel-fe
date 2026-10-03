import type { ComputedRef } from 'vue'

export function stableSnapshot(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableSnapshot).join(',')}]`
  if (value && typeof value === 'object') return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => `${JSON.stringify(key)}:${stableSnapshot(item)}`).join(',')}}`
  return JSON.stringify(value)
}

export function useUnsavedChanges<T>(source: () => T): { dirty: ComputedRef<boolean>, accept: () => void, restore: () => T } {
  const baseline = ref(stableSnapshot(source()))
  const baselineValue = ref<T>(structuredClone(toRaw(source())))
  const dirty = computed(() => stableSnapshot(source()) !== baseline.value)
  function accept() { baseline.value = stableSnapshot(source()); baselineValue.value = structuredClone(toRaw(source())) }
  function restore() { return structuredClone(toRaw(baselineValue.value)) }
  function beforeUnload(event: BeforeUnloadEvent) { if (dirty.value) { event.preventDefault(); event.returnValue = '' } }
  onMounted(() => window.addEventListener('beforeunload', beforeUnload))
  onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
  return { dirty, accept, restore }
}
