import { createApiOperationsClient } from '~/services/api-operations-client'
import { createMockOperationsClient } from '~/services/mock-operations-client'
import { parseOperationsQAControls } from '~/utils/qa-controls'

export function useOperationsClient() {
  const apiMode = useRuntimeConfig().public.operationsMode === 'api'
  if (apiMode) return createApiOperationsClient()
  const route = useRoute()
  return createMockOperationsClient(parseOperationsQAControls(route.query, import.meta.dev))
}
