<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>

<template>
  <header class="header" :class="{ 'header--compact': compact }">
    <div class="header-inner">
      <NuxtLink class="logo" to="/" aria-label="PULANG ke UTTARA, beranda">
        <span>PULANG</span><small>ke UTTARA</small>
      </NuxtLink>
      <nav id="main-nav" class="nav" aria-label="Navigasi utama">
        <NuxtLink to="/booking">Cari kamar</NuxtLink>
        <NuxtLink to="/booking/my">Booking Saya</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header { position: relative; z-index: 30; background: #fff; border-bottom: 1px solid var(--line); }
.header-inner { width: min(calc(100% - 32px), var(--max)); min-height: 84px; margin: auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.header--compact .header-inner { min-height: 68px; }
.logo { display: grid; line-height: .8; text-decoration: none; transform: rotate(-2deg); }
.logo span { font-size: 1.75rem; font-weight: 900; letter-spacing: -.08em; }
.logo small { font-size: .55rem; letter-spacing: .17em; }
.nav { display: flex; align-items: center; gap: 24px; font-size: .84rem; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
.nav a:not(.button) { text-decoration: none; }
.nav span { color: var(--muted); }
</style>
