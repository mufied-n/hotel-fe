import type { StaffPrincipal, StaffPreviewRole } from '~/types/management'
import { roleCan } from './useStaffPreview'

interface SessionResponse { staff: { username: string, role: StaffPreviewRole, full_name?: string }, expiresAt: string }

export function useStaffSession() {
  const principal = useState<StaffPrincipal | null>('staff-session-principal', () => null)
  const checked = useState('staff-session-checked', () => false)
  const loading = useState('staff-session-loading', () => false)
  const apiMode = computed(() => useRuntimeConfig().public.operationsMode === 'api')

  function apply(value: SessionResponse) {
    principal.value = { username: value.staff.username, role: value.staff.role, fullName: value.staff.full_name, expiresAt: value.expiresAt }
    checked.value = true
  }
  async function refresh() {
    if (!apiMode.value) { checked.value = true; return null }
    loading.value = true
    try {
      const request = import.meta.server ? useRequestFetch() : $fetch
      const value = await request<SessionResponse>('/api/bff/staff/auth/me')
      apply(value)
      return principal.value
    }
    catch (cause) {
      principal.value = null
      checked.value = true
      throw cause
    }
    finally { loading.value = false }
  }
  async function login(username: string, password: string) {
    const value = await $fetch<SessionResponse>('/api/bff/staff/auth/login', { method: 'POST', headers: { 'X-Pulang-CSRF': '1' }, body: { username, password } })
    apply(value)
    return principal.value
  }
  async function logout() {
    try { await $fetch('/api/bff/staff/auth/logout', { method: 'POST', headers: { 'X-Pulang-CSRF': '1' } }) }
    finally { principal.value = null; checked.value = true }
  }
  return {
    principal,
    checked,
    loading,
    apiMode,
    refresh,
    login,
    logout,
    can: (capability: Parameters<typeof roleCan>[1]) => principal.value ? roleCan(principal.value.role, capability) : false,
  }
}
