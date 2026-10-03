<script setup lang="ts">
import type { GuestBookingSummary } from '~~/shared/types/backend'
import { formatDate } from '~/utils/dates'
import { formatMoney, rupiah } from '~/utils/money'

definePageMeta({ layout: 'booking' })
useSeoMeta({ title: 'Booking Saya' })
const { profile, checked, refresh, logout } = useGuestSession()
const filter = ref('all')
const bookings = ref<GuestBookingSummary[]>([])
const pending = ref(false)
const error = ref('')
const hasLoaded = ref(false)
let loadGeneration = 0
const { showIndicator, isSlow } = usePendingFeedback(pending)
const initialLoading = computed(() => pending.value && !hasLoaded.value)
const refreshing = computed(() => pending.value && hasLoaded.value)

async function load() {
  const current = ++loadGeneration
  pending.value = true; error.value = ''
  try { const response = await $fetch<{ data: GuestBookingSummary[], total: number }>('/api/bff/guest/bookings', { query: { status: filter.value } }); if (current === loadGeneration) { bookings.value = response.data; hasLoaded.value = true } }
  catch (cause) { if (current === loadGeneration) { const value = cause as { statusCode?: number, data?: { statusMessage?: string } }; if (value.statusCode === 401) profile.value = null; error.value = value.data?.statusMessage || 'Daftar booking belum dapat dimuat.' } }
  finally { if (current === loadGeneration) pending.value = false }
}

onMounted(async () => { if (!checked.value) await refresh(); if (profile.value) await load() })
watch(filter, () => { if (profile.value) load() })
async function signOut() { await logout(); await navigateTo('/booking') }
onBeforeUnmount(() => { loadGeneration++ })
</script>

<template>
  <div class="container my-page"><header class="my-head"><div><p class="eyebrow">Rencana menginap</p><h1>Booking Saya</h1><p v-if="profile" class="lede">Reservasi yang dapat diakses melalui {{ profile.email }}.</p></div><BrandButton v-if="profile" dark @click="signOut">Keluar</BrandButton></header>
    <p v-if="!checked" role="status">Memeriksa sesi…</p>
    <UiInlineAlert v-else-if="!profile" tone="info"><strong>Sudah punya booking?</strong> Masuk menggunakan email booking untuk melihat detail, receipt, dan status layanan yang tersedia. <BrandButton to="/booking/login?returnTo=/booking/my">Masuk ke Booking Saya</BrandButton></UiInlineAlert>
    <template v-else><div class="list-toolbar"><label class="filter">Tampilkan<select v-model="filter" :disabled="pending"><option value="all">Semua booking</option><option value="upcoming">Akan datang</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option></select></label><small>Menampilkan hingga 20 booking terbaru.</small></div><div v-if="initialLoading" class="list-loading" aria-busy="true"><div class="loading-state" role="status"><UiLoadingIndicator v-if="showIndicator" /><strong>{{ isSlow ? 'Data booking memerlukan waktu lebih lama…' : 'Memuat booking Anda…' }}</strong></div><template v-if="showIndicator"><UiSkeletonBlock variant="card" /><UiSkeletonBlock variant="card" /></template></div><div v-else-if="refreshing" class="refresh-status" role="status"><UiLoadingIndicator v-if="showIndicator" size="small" /><span>{{ isSlow ? 'Data masih sedang diperbarui…' : 'Hasil sebelumnya · sedang memperbarui…' }}</span></div><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Coba lagi</BrandButton></UiInlineAlert><div v-if="!initialLoading && hasLoaded && !bookings.length" class="empty-bookings"><p class="eyebrow">{{ filter === 'all' ? 'Belum ada booking' : 'Tidak ada hasil filter' }}</p><h2>{{ filter === 'all' ? 'Belum ada reservasi yang dapat ditampilkan.' : 'Belum ada booking pada kategori ini.' }}</h2><div class="ops-actions"><BrandButton v-if="filter !== 'all'" @click="filter = 'all'">Tampilkan semua</BrandButton><BrandButton to="/booking" dark>Cari kamar</BrandButton></div></div><div v-else-if="!initialLoading && bookings.length" class="booking-list" :aria-busy="refreshing || undefined"><NuxtLink v-for="booking in bookings" :key="booking.id" class="booking-row" :class="{ 'booking-row--refreshing': refreshing }" :to="`/booking/my/${booking.id}`" :aria-disabled="refreshing || undefined" :tabindex="refreshing ? -1 : undefined" @click="refreshing && $event.preventDefault()"><div class="booking-thumb" aria-hidden="true"><span>P</span></div><div class="booking-copy"><span class="badge">{{ booking.status.replaceAll('_', ' ') }}</span><h2>{{ booking.room_type_name }}</h2><p>{{ formatDate(booking.check_in) }} — {{ formatDate(booking.check_out) }} · {{ booking.num_rooms }} kamar</p></div><div class="booking-total"><strong>{{ formatMoney(rupiah(booking.total_price_minor)) }}</strong><span>Lihat detail →</span></div></NuxtLink></div></template>
  </div>
</template>

<style scoped>
.my-page { max-width: 1100px; }.my-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: start; gap: 24px; margin-bottom: 34px; }.list-toolbar { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 14px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }.list-toolbar small { color: var(--muted); }.filter { display: grid; gap: 6px; max-width: 280px; font-weight: 900; }.filter select { padding: 10px 12px; border: 1px solid var(--line); border-radius: 12px; background: #fff; }.list-loading { display: grid; gap: 14px; padding-block: 18px; }.refresh-status { min-height: 48px; display: flex; align-items: center; gap: 10px; color: var(--muted); font-size: .86rem; font-weight: 800; }.empty-bookings { display: grid; gap: 14px; justify-items: start; margin-top: 24px; padding: clamp(26px, 5vw, 52px); border-radius: 30px; background: var(--soft); }.empty-bookings h2 { max-width: 620px; }.booking-list { display: grid; gap: 14px; margin-top: 22px; }.booking-row { color: inherit; text-decoration: none; display: grid; grid-template-columns: 86px minmax(0, 1fr); gap: 18px; align-items: center; padding: 14px; border: 1px solid var(--line); border-radius: 24px; background: #fff; transition: transform var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), opacity var(--motion-fast) var(--ease-standard); }.booking-row:active { transform: scale(.995); }.booking-row--refreshing { opacity: .65; cursor: progress; }.booking-thumb { width: 86px; aspect-ratio: .86; display: grid; place-items: center; border-radius: 17px; background: #000; color: var(--brand); font-size: 2rem; font-weight: 900; }.booking-copy { min-width: 0; }.booking-row h2 { margin-block: 12px 6px; font-size: clamp(1.6rem, 4vw, 2.45rem); }.booking-row p { margin: 0; color: var(--muted); }.booking-total { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding-top: 12px; border-top: 1px solid var(--line); }.booking-total strong { font-size: 1.15rem; }.booking-total span { font-size: .8rem; font-weight: 900; text-transform: uppercase; } @media (hover: hover) and (pointer: fine) { .booking-row:not(.booking-row--refreshing):hover { transform: translateY(-2px); border-color: #aaa; box-shadow: var(--shadow-small); } }
@media (min-width: 700px) { .booking-row { grid-template-columns: 105px minmax(0, 1fr) auto; padding: 16px; }.booking-thumb { width: 105px; }.booking-total { grid-column: auto; display: grid; justify-items: end; padding: 0; border: 0; } }
</style>
