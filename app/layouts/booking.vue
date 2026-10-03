<script setup lang="ts">
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
</script>

<template>
  <div>
    <BrandHeader compact />
    <div class="demo-strip"><span class="badge">{{ isApi ? 'Terhubung ke lingkungan booking uji' : 'Demo — tidak membuat reservasi' }}</span></div>
    <main class="booking-main"><slot /></main>
    <BrandFooter compact />
  </div>
</template>

<style scoped>
.demo-strip { position: sticky; top: 0; z-index: 20; display: flex; justify-content: center; padding: 8px; background: var(--brand); border-block: 1px solid #000; }
.demo-strip .badge { background: #000; color: #fff; }
.booking-main { min-height: 65vh; padding-block: 42px 80px; }
</style>
