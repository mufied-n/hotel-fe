<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>
<template>
  <footer class="footer" :class="{ compact }">
    <div class="footer-inner">
      <div><strong>PUL<span>A</span>NG</strong><p>Jl. Kaliurang, Yogyakarta</p></div>
      <nav aria-label="Navigasi footer"><NuxtLink to="/booking">Cari kamar</NuxtLink><NuxtLink to="/booking/my">Booking Saya</NuxtLink></nav>
      <p class="note">Webapp booking PULANG ke UTTARA. Informasi demo dan lingkungan uji selalu ditandai di bagian atas halaman.</p>
    </div>
  </footer>
</template>
<style scoped>
.footer { background: #000; color: #fff; padding: 64px 0 96px; }
.footer.compact { padding-block: 36px; }
.footer-inner { width: min(calc(100% - 32px), var(--max)); margin: auto; display: grid; gap: 24px; }
.footer strong { font-size: 1.5rem; letter-spacing: -.07em; }.footer strong span { color: var(--brand); }.footer p { margin: 4px 0 0; }
nav { display: flex; flex-wrap: wrap; gap: 20px; font-weight: 800; } nav a { min-height: 44px; display: inline-flex; align-items: center; } .note { color: #aaa; font-size: .86rem; }
@media (min-width: 768px) { .footer-inner { grid-template-columns: 1fr auto; }.note { grid-column: 1 / -1; } }
</style>
