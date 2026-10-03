import { createApiOperationsClient } from '~/services/api-operations-client'
import { createMockOperationsClient } from '~/services/mock-operations-client'

export function useOperationsClient() {
  return useRuntimeConfig().public.operationsMode === 'api' ? createApiOperationsClient() : createMockOperationsClient()
}
