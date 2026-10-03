<script setup lang="ts">
import type { GuestAllowedActions, GuestBookingDetail, GuestRefundStatus } from '~~/shared/types/backend'
import { formatDate } from '~/utils/dates'
import { formatMoney, rupiah } from '~/utils/money'

definePageMeta({ layout: 'booking' })
useSeoMeta({ title: 'Detail booking' })
const route = useRoute()
const detail = ref<GuestBookingDetail | null>(null)
const actions = ref<GuestAllowedActions | null>(null)
const refund = ref<GuestRefundStatus | null>(null)
const pending = ref(false)
const error = ref('')
async function load() {
  pending.value = true; error.value = ''; try { const id = encodeURIComponent(String(route.params.id)); const result = await $fetch<{ booking: GuestBookingDetail, allowed_actions: GuestAllowedActions }>(`/api/bff/guest/bookings/${id}`); detail.value = result.booking; actions.value = result.allowed_actions; refund.value = await $fetch<GuestRefundStatus>(`/api/bff/guest/bookings/${id}/refund-status`).catch(() => null) }
  catch (cause) { const value = cause as { statusCode?: number, data?: { statusMessage?: string } }; if (value.statusCode === 401) await navigateTo(`/booking/login?returnTo=${encodeURIComponent(route.fullPath)}`); else error.value = value.data?.statusMessage || 'Detail booking belum dapat dimuat.' }
  finally { pending.value = false }
}
onMounted(load)
</script>

<template><div class="container"><p v-if="pending" role="status">Memuat detail booking…</p><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Coba lagi</BrandButton></UiInlineAlert><template v-if="detail"><header><p class="eyebrow">Booking · {{ detail.id }}</p><h1>{{ detail.room_type_name }}</h1><span class="badge">{{ detail.status.replace('_', ' ') }}</span></header><div class="detail-grid"><section class="panel stack"><h2>Detail reservasi</h2><p><strong>{{ formatDate(detail.check_in) }} — {{ formatDate(detail.check_out) }}</strong></p><p>{{ detail.num_rooms }} kamar · {{ detail.num_guests }} tamu</p><p>{{ detail.guest_name }}<br>{{ detail.guest_email }}<br>{{ detail.guest_phone }}</p><p v-if="detail.estimated_arrival_time">Perkiraan tiba {{ detail.estimated_arrival_time }} WIB</p><p v-if="detail.special_requests">Permintaan: {{ detail.special_requests }}</p><p class="price">{{ formatMoney(rupiah(detail.total_price_minor)) }}</p><template v-if="refund?.has_refund"><h3>Status refund</h3><div v-for="item in refund.refunds" :key="item.id" class="refund-row"><span class="badge">{{ item.status }}</span><strong>{{ formatMoney(rupiah(item.amount_minor)) }}</strong><span>{{ item.reason }}</span></div></template></section><section class="panel stack"><h2>Aksi tersedia</h2><UiInlineAlert v-if="actions?.can_pay" tone="info">Backend menandai booking dapat dibayar, tetapi pemulihan link pembayaran lintas perangkat belum tersedia.</UiInlineAlert><BrandButton v-if="actions?.can_download_receipt" :to="`/booking/my/${detail.id}/receipt`">Lihat receipt</BrandButton><a v-if="actions?.can_download_receipt" class="button button--dark" :href="`/api/bff/guest/bookings/${detail.id}/calendar`">Unduh kalender</a><UiInlineAlert v-if="actions?.can_cancel" tone="info">Pembatalan historis menunggu kontrak credential sesi yang konsisten. Status ini belum menjadi tombol mutasi.</UiInlineAlert><BrandButton to="/booking/my" dark>Kembali ke daftar</BrandButton></section></div></template></div></template>
<style scoped>header { margin-bottom: 30px; }.detail-grid { display: grid; gap: 24px; }.refund-row { display: grid; grid-template-columns: auto 1fr; gap: 8px 14px; align-items: center; }.refund-row span:last-child { grid-column: 1 / -1; } @media (min-width: 850px) { .detail-grid { grid-template-columns: 1.15fr .85fr; } }</style>
