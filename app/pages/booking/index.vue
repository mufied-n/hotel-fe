<script setup lang="ts">
import type { SearchInput } from '~/types/booking'
import { encodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Cari kamar' })
const { setSearch } = useBookingDraft()
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
const heroPhoto = '/asset/rooms/hero.jpg'
const heroFailed = ref(false)
async function search(input: SearchInput) { setSearch(input); await navigateTo({ path: '/booking/results', query: encodeSearch(input) }) }
</script>
<template>
  <div class="container booking-page">
    <BookingSteps :current="1" />
    <section class="booking-hero">
      <div class="hero-visual" :class="{ 'placeholder-image': heroFailed }">
        <template v-if="!heroFailed">
          <img
            class="hero-photo"
            :src="heroPhoto"
            alt="Suasana kamar dan arsitektur PULANG ke UTTARA"
            @error="heroFailed = true"
          >
          <div class="hero-overlay">
            <p>NOT JUST<br>A HOTEL.</p>
          </div>
        </template>
        <template v-else>
          <p>NOT JUST<br>A HOTEL.</p><span>Foto resmi menunggu handoff</span>
        </template>
      </div>
      <div class="hero-copy">
        <p class="eyebrow">Booking langsung</p><h1>Temukan ruang untuk pulang.</h1>
        <p class="lede">Pilih waktu menginap dan jumlah tamu. Kami akan menampilkan kamar, paket, serta total yang tersedia untuk pilihan Anda.</p>
        <p class="mode-note">{{ isApi ? 'Harga dan ketersediaan berasal dari lingkungan booking uji.' : 'Anda sedang melihat data demo. Tidak ada reservasi yang dibuat.' }}</p>
      </div>
      <BookingSearchForm class="hero-search" @search="search" />
    </section>
  </div>
</template>
<style scoped>
.booking-page { max-width: 1180px; }.booking-hero { display: grid; gap: 26px; }.hero-visual { position: relative; min-height: 260px; overflow: hidden; border-radius: 24px; background: #111; display: grid; align-items: end; justify-items: start; isolation: isolate; }.hero-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }.hero-overlay { position: absolute; inset: 0; z-index: 1; display: grid; align-items: end; padding: 24px; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.8) 100%); color: #fff; pointer-events: none; }.hero-visual p { margin: 0; font-size: clamp(2.8rem, 10vw, 6rem); font-weight: 900; line-height: .82; letter-spacing: -.07em; text-align: left; color: #fff; text-shadow: 0 2px 14px rgba(0,0,0,0.4); }.hero-copy { order: -1; align-self: end; }.hero-copy h1 { max-width: 760px; margin-bottom: 18px; }.mode-note { max-width: 58ch; padding-left: 13px; border-left: 3px solid var(--brand); color: var(--muted); font-size: .9rem; }.hero-search { position: relative; z-index: 2; }
@media (min-width: 960px) { .booking-hero { grid-template-columns: minmax(0, .9fr) minmax(470px, 1.1fr); align-items: start; }.hero-visual { grid-column: 1; grid-row: 1 / span 2; min-height: min(62vh, 520px); }.hero-copy { order: initial; grid-column: 2; padding: 34px 8px 0 22px; }.hero-copy h1 { font-size: clamp(3.4rem, 6vw, 5.7rem); }.hero-search { grid-column: 2; margin-left: -54px; } }
</style>
