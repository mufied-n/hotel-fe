<script setup lang="ts">
const isMock = computed(() => useRuntimeConfig().public.operationsMode !== 'api')
</script>

<template>
  <div class="staff-shell">
    <header class="staff-header">
      <NuxtLink to="/booking" class="staff-brand">PULANG <span>Operations</span></NuxtLink>
      <nav aria-label="Workspace staff">
        <NuxtLink to="/staff/front-desk">Front desk</NuxtLink><NuxtLink to="/staff/housekeeping">Housekeeping</NuxtLink><NuxtLink to="/staff/finance">Finance</NuxtLink>
      </nav>
    </header>
    <div class="staff-mode" :class="{ 'staff-mode--api': !isMock }"><strong>{{ isMock ? 'Preview data sample' : 'Integrasi staff terkunci' }}</strong><span>{{ isMock ? 'Perubahan hanya berlaku selama halaman ini dibuka.' : 'Trusted staff authentication belum tersedia.' }}</span></div>
    <main class="staff-main"><slot /></main>
  </div>
</template>

<style scoped>
.staff-shell { min-height: 100vh; background: #f7f5f1; }.staff-header { display: grid; gap: 16px; padding: 18px max(20px, calc((100vw - var(--max)) / 2)); background: #000; color: #fff; }.staff-brand { font-size: 1.35rem; font-weight: 900; text-decoration: none; letter-spacing: -.03em; }.staff-brand span { color: var(--brand); }.staff-header nav { display: flex; gap: 8px; overflow-x: auto; }.staff-header nav a { white-space: nowrap; border: 1px solid #555; border-radius: 999px; padding: 7px 13px; text-decoration: none; font-size: .83rem; font-weight: 700; }.staff-header nav a.router-link-active { border-color: var(--brand); background: var(--brand); color: #000; }.staff-mode { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px 14px; padding: 9px 20px; background: #fff0e5; border-bottom: 1px solid #e4b28f; font-size: .86rem; }.staff-mode--api { background: #fff2f0; color: var(--danger); }.staff-main { padding-block: 34px 80px; } @media (min-width: 800px) { .staff-header { grid-template-columns: 1fr auto; align-items: center; } }
</style>
