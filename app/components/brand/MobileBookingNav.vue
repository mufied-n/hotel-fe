<template>
  <nav class="mobile-nav" aria-label="Navigasi booking mobile">
    <NuxtLink to="/booking#booking-search"><span aria-hidden="true">⌕</span>Cari kamar</NuxtLink>
    <NuxtLink to="/booking/my"><span aria-hidden="true">▣</span>Booking Saya</NuxtLink>
  </nav>
</template>

<style scoped>
.mobile-nav { position: fixed; z-index: 28; left: 12px; right: 12px; bottom: max(10px, env(safe-area-inset-bottom)); display: grid; grid-template-columns: 1fr 1fr; gap: 4px; min-height: 62px; padding: 5px; border: 1px solid #333; border-radius: 999px; background: #050505; color: #fff; box-shadow: var(--shadow); }
.mobile-nav a { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 50px; border-radius: 999px; font-size: .72rem; font-weight: 900; letter-spacing: .04em; text-decoration: none; text-transform: uppercase; transition: background var(--motion-fast) var(--ease-standard), color var(--motion-fast) var(--ease-standard), transform var(--motion-press) var(--ease-standard); }
.mobile-nav a:active { transform: scale(.98); }
.mobile-nav a.router-link-exact-active { background: var(--brand); color: #000; }
.mobile-nav span { font-size: 1.15rem; }
@media (min-width: 640px) { .mobile-nav { display: none; } }
</style>
