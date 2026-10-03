<script setup lang="ts">
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
const route = useRoute()
const showMobileNav = computed(() => ['/booking', '/booking/my'].includes(route.path))
</script>

<template>
  <div>
    <BrandHeader compact />
    <div class="demo-strip"><span>{{ isApi ? 'Lingkungan booking uji' : 'Mode demo · tidak membuat reservasi' }}</span></div>
    <main class="booking-main" :class="{ 'booking-main--with-nav': showMobileNav }"><slot /></main>
    <BrandFooter compact />
    <BrandMobileBookingNav v-if="showMobileNav" />
  </div>
</template>

<style scoped>
.demo-strip { position: relative; z-index: 20; display: flex; justify-content: center; padding: 7px 16px; background: var(--brand); border-bottom: 1px solid #000; color: #000; font-size: .7rem; font-weight: 900; letter-spacing: .08em; text-align: center; text-transform: uppercase; }
.booking-main { min-height: 65vh; padding-block: clamp(30px, 5vw, 64px) 90px; }
@media (max-width: 639px) { .booking-main--with-nav { padding-bottom: calc(var(--mobile-nav-height) + 62px); } }
</style>
