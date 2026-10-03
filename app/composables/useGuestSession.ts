import type { GuestProfile } from '~~/shared/types/backend'

const csrfHeaders = { 'X-Pulang-CSRF': '1' }

export function useGuestSession() {
  const profile = useState<GuestProfile | null>('guest-profile', () => null)
  const checked = useState('guest-profile-checked', () => false)

  async function refresh() {
    try { profile.value = await $fetch<GuestProfile>('/api/bff/auth/me') }
    catch { profile.value = null }
    finally { checked.value = true }
    return profile.value
  }

  async function requestCode(email: string) {
    return $fetch<{ status: string, message: string, cooldown_seconds: number }>('/api/bff/auth/challenge', { method: 'POST', headers: csrfHeaders, body: { email } })
  }

  async function verify(email: string, code: string) {
    await $fetch('/api/bff/auth/verify', { method: 'POST', headers: csrfHeaders, body: { email, code } })
    return refresh()
  }

  async function logout() {
    await $fetch('/api/bff/auth/logout', { method: 'POST', headers: csrfHeaders })
    profile.value = null
    checked.value = true
  }

  return { profile, checked, refresh, requestCode, verify, logout }
}
