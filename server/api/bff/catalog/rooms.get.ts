import { backendRequest } from '../../../utils/bff'
import type { BackendRoomVariant } from '~~/shared/types/backend'

export default defineEventHandler(event => backendRequest<{ total: number, rooms: BackendRoomVariant[] }>(event, '/api/v1/catalog/rooms'))
