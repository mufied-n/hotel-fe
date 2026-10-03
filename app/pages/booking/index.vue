<script setup lang="ts">
import type { SearchInput } from '~/types/booking'
import { encodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Cari kamar' })
const { setSearch } = useBookingDraft()
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
async function search(input: SearchInput) { setSearch(input); await navigateTo({ path: '/booking/results', query: encodeSearch(input) }) }
</script>
<template>
  <div class="container booking-page">
    <BookingSteps :current="1" />
    <section class="booking-hero">
      <div class="hero-visual placeholder-image" role="img" aria-label="Foto suasana PULANG ke UTTARA belum tersedia pada webapp">
        <p>NOT JUST<br>A HOTEL.</p><span>Foto resmi menunggu handoff</span>
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
.booking-page { max-width: 1180px; }.booking-hero { display: grid; gap: 26px; }.hero-visual { min-height: 260px; align-items: end; justify-items: start; }.hero-visual p { margin: 0; font-size: clamp(2.8rem, 10vw, 6rem); font-weight: 900; line-height: .82; letter-spacing: -.07em; text-align: left; }.hero-copy { order: -1; align-self: end; }.hero-copy h1 { max-width: 760px; margin-bottom: 18px; }.mode-note { max-width: 58ch; padding-left: 13px; border-left: 3px solid var(--brand); color: var(--muted); font-size: .9rem; }.hero-search { position: relative; z-index: 2; }
@media (min-width: 960px) { .booking-hero { grid-template-columns: minmax(0, .9fr) minmax(470px, 1.1fr); align-items: start; }.hero-visual { grid-column: 1; grid-row: 1 / span 2; min-height: min(62vh, 520px); }.hero-copy { order: initial; grid-column: 2; padding: 34px 8px 0 22px; }.hero-copy h1 { font-size: clamp(3.4rem, 6vw, 5.7rem); }.hero-search { grid-column: 2; margin-left: -54px; } }
</style>
