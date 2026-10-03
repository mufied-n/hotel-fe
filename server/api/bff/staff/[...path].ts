import { denyUnavailableStaffIntegration } from '../../../utils/staff-capabilities'

export default defineEventHandler(event => denyUnavailableStaffIntegration(event))
