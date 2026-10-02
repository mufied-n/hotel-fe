<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>
<template>
  <footer class="footer" :class="{ compact }">
    <div class="footer-inner">
      <div><strong>PULANG ke UTTARA</strong><p>Yogyakarta, Indonesia</p></div>
      <NuxtLink to="/booking">Kembali ke pencarian</NuxtLink>
      <p class="note">Prototype booking. Harga, kapasitas, dan ketersediaan adalah data demo.</p>
    </div>
  </footer>
</template>
<style scoped>
.footer { background: #000; color: #fff; padding: 64px 0 96px; }
.footer.compact { padding-block: 36px; }
.footer-inner { width: min(calc(100% - 32px), var(--max)); margin: auto; display: grid; gap: 24px; }
.footer strong { font-size: 1.3rem; }.footer p { margin: 4px 0 0; }
nav { display: flex; gap: 20px; font-weight: 700; } .note { color: #ccc; font-size: .9rem; }
@media (min-width: 768px) { .footer-inner { grid-template-columns: 1fr auto; }.note { grid-column: 1 / -1; } }
</style>
