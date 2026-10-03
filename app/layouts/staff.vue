<script setup lang="ts">
import type { StaffCapability } from '~/types/management'
import { staffRoleLabels } from '~/composables/useStaffPreview'

const route = useRoute()
const session = useStaffSession()
const preview = useStaffPreview()
const menuOpen = ref(false)
const desktopNavigation = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const sidebar = ref<HTMLElement | null>(null)
let navigationMedia: MediaQueryList | undefined
const updateNavigationMode = () => { desktopNavigation.value = Boolean(navigationMedia?.matches); if (desktopNavigation.value) closeMenu(false) }
const isLogin = computed(() => route.path === '/staff/login')
const role = computed(() => session.apiMode.value ? session.principal.value?.role : preview.role.value)
const displayName = computed(() => session.apiMode.value ? (session.principal.value?.fullName || session.principal.value?.username || 'Staff') : staffRoleLabels[preview.role.value])
const modeLabel = computed(() => session.apiMode.value ? 'Backend terhubung' : 'Data sample')
const groups: Array<{ label: string, links: Array<{ to: string, label: string, capability: StaffCapability }> }> = [
  { label: 'Operations', links: [{ to: '/staff/front-desk', label: 'Front desk', capability: 'front_desk' }, { to: '/staff/housekeeping', label: 'Housekeeping', capability: 'housekeeping' }] },
  { label: 'Finance', links: [{ to: '/staff/finance', label: 'Reconciliation', capability: 'finance' }] },
  { label: 'Inventory & revenue', links: [{ to: '/staff/catalog', label: 'Catalog', capability: 'catalog' }, { to: '/staff/inventory', label: 'Inventory', capability: 'catalog' }, { to: '/staff/rates', label: 'Rates', capability: 'revenue' }, { to: '/staff/promos', label: 'Promos', capability: 'revenue' }] },
  { label: 'Monitoring & admin', links: [{ to: '/staff/channels', label: 'Channels', capability: 'channels' }, { to: '/staff/notifications', label: 'Notifications', capability: 'notifications' }, { to: '/staff/configuration', label: 'Configuration', capability: 'configuration' }, { to: '/staff/audit', label: 'Audit', capability: 'audit' }] },
]
function can(capability: StaffCapability) { return session.apiMode.value ? session.can(capability) : preview.can(capability) }
async function logout() { if (session.apiMode.value) await session.logout().catch(() => null); else preview.expire(); await navigateTo('/staff/login') }
watch(() => route.fullPath, () => { menuOpen.value = false })
function closeMenu(restoreFocus = true) { const wasOpen = menuOpen.value; menuOpen.value = false; if (wasOpen && restoreFocus) nextTick(() => menuButton.value?.focus()) }
function toggleMenu() { if (menuOpen.value) closeMenu(); else menuOpen.value = true }
function navigationFocusable() { return sidebar.value ? [...sidebar.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(element => element.offsetParent !== null && !element.hasAttribute('inert')) : [] }
function onNavigationKeydown(event: KeyboardEvent) {
  if (!menuOpen.value || desktopNavigation.value) return
  if (event.key === 'Escape') { event.preventDefault(); closeMenu(); return }
  if (event.key !== 'Tab' || !sidebar.value) return
  const focusable = navigationFocusable()
  if (!focusable.length) return
  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
watch(menuOpen, async (open) => {
  if (import.meta.server || desktopNavigation.value) return
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) { await nextTick(); navigationFocusable()[0]?.focus() }
})
onMounted(() => {
  navigationMedia = window.matchMedia('(min-width: 960px)')
  updateNavigationMode()
  navigationMedia.addEventListener('change', updateNavigationMode)
})
onBeforeUnmount(() => { navigationMedia?.removeEventListener('change', updateNavigationMode); if (!import.meta.server) document.body.style.overflow = '' })
</script>

<template>
  <div class="staff-shell" :class="{ 'staff-shell--login': isLogin }">
    <a class="skip-link" href="#staff-main">Lewati ke konten</a>
    <header class="staff-mobile-header"><NuxtLink to="/staff" class="staff-brand"><strong>PUL<span>A</span>NG</strong><small>Operations</small></NuxtLink><button v-if="!isLogin" ref="menuButton" class="staff-menu-button" type="button" :aria-expanded="menuOpen" aria-controls="staff-navigation" @click="toggleMenu"><span aria-hidden="true">{{ menuOpen ? '×' : '☰' }}</span><span class="sr-only">{{ menuOpen ? 'Tutup navigasi' : 'Buka navigasi' }}</span></button></header>
    <div v-if="menuOpen" class="staff-nav-backdrop" aria-hidden="true" @click="closeMenu()" />
    <aside v-if="!isLogin" id="staff-navigation" ref="sidebar" class="staff-sidebar" :class="{ 'staff-sidebar--open': menuOpen }" :inert="desktopNavigation || menuOpen ? undefined : true" :aria-hidden="desktopNavigation || menuOpen ? undefined : true" :role="menuOpen && !desktopNavigation ? 'dialog' : undefined" :aria-modal="menuOpen && !desktopNavigation ? true : undefined" aria-label="Navigasi workspace staff" @keydown="onNavigationKeydown">
      <NuxtLink to="/staff" class="staff-brand staff-brand--desktop"><strong>PUL<span>A</span>NG</strong><small>Operations workspace</small></NuxtLink>
      <nav aria-label="Workspace staff"><section v-for="group in groups" v-show="group.links.some(link => can(link.capability))" :key="group.label" class="staff-nav-group"><h2>{{ group.label }}</h2><NuxtLink v-for="link in group.links.filter(item => can(item.capability))" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink></section></nav>
      <div class="staff-sidebar-footer"><NuxtLink class="guest-link" to="/booking">Buka booking tamu ↗</NuxtLink><button type="button" class="staff-logout" @click="logout">Keluar workspace</button></div>
    </aside>
    <div class="staff-content"><div v-if="!isLogin" class="staff-topbar"><div><span class="staff-connection" :class="{ 'staff-connection--live': session.apiMode.value }">{{ modeLabel }}</span><strong>{{ displayName }}</strong><span>{{ role ? staffRoleLabels[role] : 'Sesi belum tersedia' }}</span></div><button type="button" class="staff-topbar__logout" @click="logout">Keluar</button></div><main id="staff-main" class="staff-main" tabindex="-1"><slot /></main></div>
  </div>
</template>

<style scoped>
.staff-shell { min-height: 100vh; background: #f4f1eb; }.skip-link { position: fixed; z-index: 100; top: 8px; left: 8px; padding: 10px 14px; background: #fff; color: #000; transform: translateY(-150%); }.skip-link:focus { transform: translateY(0); }.staff-content { min-width: 0; }.staff-main { padding-block: 24px 80px; outline: none; }.staff-mobile-header { position: sticky; top: 0; z-index: 45; display: flex; align-items: center; justify-content: space-between; min-height: 66px; padding: 12px 18px; background: #000; color: #fff; }.staff-brand { display: grid; width: fit-content; color: #fff; text-decoration: none; }.staff-brand strong { font-size: 1.45rem; line-height: .9; letter-spacing: -.07em; }.staff-brand strong span { color: var(--brand); }.staff-brand small { margin-top: 6px; color: #aaa; font-size: .55rem; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }.staff-brand--desktop { display: none; }.staff-menu-button { width: 44px; height: 44px; border: 1px solid #555; border-radius: 50%; background: #111; color: #fff; font-size: 1.25rem; }.staff-sidebar { position: fixed; z-index: 50; inset: 0 auto 0 0; width: min(84vw, 290px); display: flex; flex-direction: column; gap: 22px; overflow-y: auto; padding: 80px 18px 22px; background: #050505; color: #fff; transform: translateX(-105%); transition: transform var(--motion-panel) var(--ease-standard); }.staff-sidebar--open { transform: translateX(0); }.staff-nav-backdrop { position: fixed; z-index: 49; inset: 0; background: rgb(0 0 0 / 58%); }.staff-sidebar nav { display: grid; gap: 22px; }.staff-nav-group { display: grid; gap: 5px; }.staff-nav-group h2 { margin: 0 10px 6px; color: #888; font-size: .63rem; letter-spacing: .12em; text-transform: uppercase; }.staff-nav-group a { min-height: 42px; display: flex; align-items: center; border-radius: 12px; padding: 9px 12px; color: #ddd; text-decoration: none; font-size: .86rem; font-weight: 800; transition: background var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-press) var(--ease-standard); }.staff-nav-group a.router-link-active { background: var(--brand); color: #000; }.staff-nav-group a:active { transform: scale(.98); }.staff-sidebar-footer { display: grid; gap: 10px; margin-top: auto; }.guest-link, .staff-logout { min-height: 44px; display: flex; align-items: center; padding: 8px 11px; color: #aaa; font-size: .78rem; font-weight: 800; text-decoration: none; }.staff-logout { width: 100%; border: 0; background: transparent; }.staff-topbar { min-height: 58px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 9px 18px; border-bottom: 1px solid var(--line); background: rgb(255 255 255 / 92%); backdrop-filter: blur(12px); }.staff-topbar > div { display: flex; align-items: center; flex-wrap: wrap; gap: 6px 12px; font-size: .78rem; }.staff-connection { border-radius: 999px; padding: 4px 8px; background: #fff0e5; color: #67300c; font-weight: 900; }.staff-connection--live { background: #e8f6ee; color: #14532d; }.staff-topbar__logout { border: 0; background: transparent; font-weight: 900; }.staff-shell--login .staff-main { min-height: calc(100vh - 66px); display: grid; align-items: center; padding-block: 0; }
@media (hover: hover) and (pointer: fine) { .staff-nav-group a:hover { color: var(--brand); background: #181818; }.staff-nav-group a.router-link-active:hover { color: #000; background: #ff9650; }.guest-link:hover, .staff-logout:hover { color: var(--brand); } }
@media (min-width: 960px) { .staff-shell:not(.staff-shell--login) { display: grid; grid-template-columns: 244px minmax(0, 1fr); }.staff-mobile-header { display: none; }.staff-brand--desktop { display: grid; }.staff-sidebar { position: sticky; grid-column: 1; grid-row: 1; top: 0; width: auto; height: 100vh; transform: none; padding: 28px 18px 20px; }.staff-content { grid-column: 2; grid-row: 1; }.staff-topbar { position: sticky; top: 0; z-index: 35; padding-inline: 28px; }.staff-main { padding-top: 34px; }.staff-main :deep(.container) { width: min(calc(100% - 48px), 1220px); }.staff-shell--login .staff-mobile-header { display: flex; position: fixed; inset: 0 0 auto; }.staff-shell--login .staff-main { min-height: 100vh; } }
@media (prefers-reduced-motion: reduce) { .staff-sidebar { transition: none; } }
</style>
