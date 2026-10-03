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

async function load() {
  pending.value = true; error.value = ''
  try { const response = await $fetch<{ data: GuestBookingSummary[], total: number }>('/api/bff/guest/bookings', { query: { status: filter.value } }); bookings.value = response.data }
  catch (cause) { const value = cause as { statusCode?: number, data?: { statusMessage?: string } }; if (value.statusCode === 401) profile.value = null; error.value = value.data?.statusMessage || 'Daftar booking belum dapat dimuat.' }
  finally { pending.value = false }
}

onMounted(async () => { if (!checked.value) await refresh(); if (profile.value) await load() })
watch(filter, () => { if (profile.value) load() })
async function signOut() { await logout(); await navigateTo('/booking') }
</script>

<template>
  <div class="container"><header class="my-head"><div><p class="eyebrow">Area penghuni</p><h1>Booking Saya</h1><p v-if="profile">{{ profile.email }} · maksimal 20 booking per daftar saat ini.</p></div><BrandButton v-if="profile" dark @click="signOut">Keluar</BrandButton></header>
    <p v-if="!checked" role="status">Memeriksa sesi…</p>
    <UiInlineAlert v-else-if="!profile" tone="info">Masuk menggunakan email booking untuk melihat reservasi milik Anda. <BrandButton to="/booking/login?returnTo=/booking/my">Masuk penghuni</BrandButton></UiInlineAlert>
    <template v-else><label class="filter">Tampilkan<select v-model="filter"><option value="all">Semua</option><option value="upcoming">Akan datang</option><option value="completed">Selesai</option><option value="cancelled">Dibatalkan</option></select></label><p v-if="pending" role="status">Memuat booking…</p><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Coba lagi</BrandButton></UiInlineAlert><UiInlineAlert v-else-if="!pending && !bookings.length" tone="info">Belum ada booking pada filter ini.</UiInlineAlert><div class="booking-list"><NuxtLink v-for="booking in bookings" :key="booking.id" class="panel booking-row" :to="`/booking/my/${booking.id}`"><div><span class="badge">{{ booking.status.replace('_', ' ') }}</span><h2>{{ booking.room_type_name }}</h2><p>{{ formatDate(booking.check_in) }} — {{ formatDate(booking.check_out) }} · {{ booking.num_rooms }} kamar</p></div><strong>{{ formatMoney(rupiah(booking.total_price_minor)) }}</strong></NuxtLink></div></template>
  </div>
</template>

<style scoped>.my-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: start; gap: 24px; margin-bottom: 30px; }.filter { display: grid; gap: 6px; max-width: 260px; font-weight: 800; }.filter select { padding: 10px; border-radius: 12px; background: #fff; }.booking-list { display: grid; gap: 16px; margin-top: 24px; }.booking-row { color: inherit; text-decoration: none; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 20px; align-items: center; }.booking-row h2 { margin-block: 12px 5px; }</style>
