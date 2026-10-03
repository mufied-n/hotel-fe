<script setup lang="ts">
import type { SearchInput } from '~/types/booking'
import { encodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Cari kamar' })
const { setSearch } = useBookingDraft()
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
async function search(input: SearchInput) { setSearch(input); await navigateTo({ path: '/booking/results', query: encodeSearch(input) }) }
</script>
<template><div class="container booking-page"><BookingSteps :current="1" /><div class="booking-hero"><div><p class="eyebrow">Booking Webapp</p><h1>Temukan ruang untuk pulang.</h1><p v-if="isApi">Pilih tanggal dan tamu untuk memeriksa harga serta ketersediaan lingkungan booking uji.</p><p v-else>Pilih tanggal dan tamu. Harga dan ketersediaan bersifat fixture deterministik.</p></div><BookingSearchForm @search="search" /></div></div></template>
<style scoped>.booking-page { max-width: 1100px; }.booking-hero { display: grid; gap: 36px; }.booking-hero > div:first-child { max-width: 780px; }.booking-hero h1 { font-size: clamp(3rem, 8vw, 6rem); } @media (min-width: 960px) { .booking-hero { grid-template-columns: .8fr 1.2fr; align-items: start; } }</style>
