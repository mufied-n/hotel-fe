<script setup lang="ts">
import type { StaffCapability } from '~/types/management'
import { staffRoleLabels } from '~/composables/useStaffPreview'

const isMock = computed(() => useRuntimeConfig().public.operationsMode !== 'api')
const preview = useStaffPreview()
const links: Array<{ to: string, label: string, capability: StaffCapability }> = [
  { to: '/staff/front-desk', label: 'Front desk', capability: 'front_desk' },
  { to: '/staff/housekeeping', label: 'Housekeeping', capability: 'housekeeping' },
  { to: '/staff/finance', label: 'Finance', capability: 'finance' },
  { to: '/staff/catalog', label: 'Catalog', capability: 'catalog' },
  { to: '/staff/inventory', label: 'Inventory', capability: 'catalog' },
  { to: '/staff/rates', label: 'Revenue', capability: 'revenue' },
  { to: '/staff/channels', label: 'Channels', capability: 'channels' },
  { to: '/staff/notifications', label: 'Notifications', capability: 'notifications' },
  { to: '/staff/configuration', label: 'Configuration', capability: 'configuration' },
  { to: '/staff/audit', label: 'Audit', capability: 'audit' },
]
</script>

<template>
  <div class="staff-shell">
    <aside class="staff-sidebar">
      <NuxtLink to="/staff" class="staff-brand"><strong>PUL<span>A</span>NG</strong><small>Operations workspace</small></NuxtLink>
      <nav aria-label="Workspace staff"><NuxtLink v-for="link in links.filter(item => preview.can(item.capability))" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink></nav>
      <NuxtLink class="guest-link" to="/booking">Buka booking tamu ↗</NuxtLink>
    </aside>
    <div class="staff-content">
      <div class="staff-mode" :class="{ 'staff-mode--api': !isMock }"><strong>{{ isMock ? 'Preview data sample' : 'Integrasi staff terkunci' }}</strong><span>{{ isMock ? `Peran: ${staffRoleLabels[preview.role.value]}. Perubahan hanya berlaku selama halaman ini dibuka.` : 'Trusted staff authentication belum tersedia.' }}</span><NuxtLink to="/staff/login">Ganti peran</NuxtLink></div>
      <main class="staff-main"><slot /></main>
    </div>
  </div>
</template>

<style scoped>
.staff-shell { min-height: 100vh; background: #f7f5f1; }.staff-sidebar { position: relative; z-index: 30; display: grid; gap: 16px; padding: 18px 20px; background: #000; color: #fff; }.staff-brand { display: grid; width: fit-content; color: #fff; text-decoration: none; }.staff-brand strong { font-size: 1.5rem; line-height: .9; letter-spacing: -.07em; }.staff-brand strong span { color: var(--brand); }.staff-brand small { margin-top: 7px; color: #aaa; font-size: .58rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }.staff-sidebar nav { display: flex; gap: 7px; overflow-x: auto; padding-bottom: 3px; }.staff-sidebar nav a { min-height: 42px; display: inline-flex; align-items: center; white-space: nowrap; border: 1px solid #444; border-radius: 999px; padding: 7px 13px; color: #fff; text-decoration: none; font-size: .78rem; font-weight: 800; }.staff-sidebar nav a.router-link-active { border-color: var(--brand); background: var(--brand); color: #000; }.guest-link { min-height: 44px; display: none; align-items: center; color: #aaa; font-size: .8rem; font-weight: 800; }.staff-content { min-width: 0; }.staff-mode { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 14px; padding: 9px 20px; background: #fff0e5; border-bottom: 1px solid #e4b28f; font-size: .86rem; }.staff-mode a { font-weight: 900; }.staff-mode--api { background: #fff2f0; color: var(--danger); }.staff-main { padding-block: 34px 80px; }
.staff-sidebar nav a { transition: background var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-press) var(--ease-standard); }
.staff-sidebar nav a:active { transform: scale(.98); }
.guest-link { transition: color var(--motion-fast) var(--ease-standard); }
@media (hover: hover) and (pointer: fine) { .staff-sidebar nav a:hover { border-color: var(--brand); color: var(--brand); }.staff-sidebar nav a.router-link-active:hover { color: #000; }.guest-link:hover { color: var(--brand); } }
@media (min-width: 960px) { .staff-shell { display: grid; grid-template-columns: 252px minmax(0, 1fr); }.staff-sidebar { position: sticky; top: 0; height: 100vh; align-content: start; padding: 30px 22px; }.staff-sidebar nav { display: grid; overflow: visible; margin-top: 16px; }.staff-sidebar nav a { border: 0; border-radius: 12px; padding-inline: 14px; }.staff-sidebar nav a.router-link-active { background: var(--brand); }.guest-link { display: flex; align-self: end; margin-top: auto; }.staff-mode { justify-content: flex-start; }.staff-main :deep(.container) { width: min(calc(100% - 40px), 1180px); } }
</style>
