<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>

<template>
  <header class="header" :class="{ 'header--compact': compact }">
    <div class="header-inner">
      <NuxtLink class="logo" to="/" aria-label="PULANG ke UTTARA, beranda">
        <span>PUL<span class="logo-accent">A</span>NG</span><small>KE UTTARA · BOOKING</small>
      </NuxtLink>
      <nav id="main-nav" class="nav" aria-label="Navigasi utama">
        <NuxtLink to="/booking">Cari kamar</NuxtLink><NuxtLink to="/booking/my">Booking Saya</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header { position: sticky; top: 0; z-index: 30; background: #000; color: #fff; }
.header-inner { width: min(calc(100% - 32px), var(--max)); min-height: var(--header-height); margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.header--compact .header-inner { min-height: var(--header-height); }
.logo { display: grid; line-height: .82; text-decoration: none; }
.logo span { font-size: 1.72rem; font-weight: 900; letter-spacing: -.075em; }
.logo-accent { color: var(--brand); }
.logo small { margin-top: 7px; font-size: .5rem; letter-spacing: .16em; color: #bbb; }
.nav { display: flex; align-items: center; gap: 24px; font-size: .84rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
.nav a { min-height: 44px; display: inline-flex; align-items: center; text-decoration: none; transition: color var(--motion-fast) var(--ease-standard), transform var(--motion-press) var(--ease-standard); }
.nav a:active { transform: scale(.98); }
.nav a.router-link-exact-active { color: var(--brand); }
.nav span { color: var(--muted); }
@media (max-width: 639px) { .nav { display: none; } }
@media (hover: hover) and (pointer: fine) { .nav a:hover { color: var(--brand); } }
</style>
