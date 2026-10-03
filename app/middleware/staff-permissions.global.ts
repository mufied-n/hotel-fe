import type { StaffCapability } from '~/types/management'

const publicStaffPaths = new Set(['/staff/login', '/staff/forbidden', '/staff/session-expired'])
const capabilities: Array<{ prefix: string, capability: StaffCapability }> = [
  { prefix: '/staff/front-desk', capability: 'front_desk' },
  { prefix: '/staff/bookings', capability: 'front_desk' },
  { prefix: '/staff/housekeeping', capability: 'housekeeping' },
  { prefix: '/staff/finance', capability: 'finance' },
  { prefix: '/staff/catalog', capability: 'catalog' },
  { prefix: '/staff/inventory', capability: 'catalog' },
  { prefix: '/staff/rates', capability: 'revenue' },
  { prefix: '/staff/promos', capability: 'revenue' },
  { prefix: '/staff/channels', capability: 'channels' },
  { prefix: '/staff/notifications', capability: 'notifications' },
  { prefix: '/staff/configuration', capability: 'configuration' },
  { prefix: '/staff/audit', capability: 'audit' },
]

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/staff') || publicStaffPaths.has(to.path) || to.path === '/staff') return
  const preview = useStaffPreview()
  if (!preview.active.value) return navigateTo('/staff/session-expired')
  const match = capabilities.find(item => to.path.startsWith(item.prefix))
  if (match && !preview.can(match.capability)) return navigateTo('/staff/forbidden')
})
