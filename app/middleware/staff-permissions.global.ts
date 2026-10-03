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

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/staff')) return
  const session = useStaffSession()
  if (session.apiMode.value) {
    if (to.path === '/staff/login') {
      if (!session.checked.value) await session.refresh().catch(() => null)
      if (session.principal.value) return navigateTo('/staff')
      return
    }
    if (publicStaffPaths.has(to.path)) return
    if (!session.checked.value || !session.principal.value) await session.refresh().catch(() => null)
    if (!session.principal.value) return navigateTo({ path: '/staff/login', query: { returnTo: to.fullPath } })
    const match = capabilities.find(item => to.path.startsWith(item.prefix))
    if (match && !session.can(match.capability)) return navigateTo('/staff/forbidden')
    return
  }
  if (publicStaffPaths.has(to.path) || to.path === '/staff') return
  const preview = useStaffPreview()
  if (!preview.active.value) return navigateTo('/staff/session-expired')
  const match = capabilities.find(item => to.path.startsWith(item.prefix))
  if (match && !preview.can(match.capability)) return navigateTo('/staff/forbidden')
})
