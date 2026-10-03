<script setup lang="ts">
import type { BookingStatusView } from '~/types/booking'

const props = defineProps<{ booking: BookingStatusView }>()
defineEmits<{ cancel: [], elapsed: [] }>()
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
const content = computed(() => ({
  pending: ['Menunggu pembayaran', 'Selesaikan pembayaran sebelum batas waktu dan periksa status kembali.'],
  pending_payment: ['Menunggu pembayaran', 'Selesaikan pembayaran atau simulasi sebelum waktu habis.'],
  processing: ['Pembayaran sedang diperiksa', 'Jangan memulai pembayaran baru. Periksa status ini kembali.'],
  confirmed: ['Terkonfirmasi', isApi.value ? 'Booking telah dikonfirmasi oleh lingkungan booking uji.' : 'Simulasi booking berhasil dikonfirmasi. Tidak ada reservasi nyata yang dibuat.'],
  checked_in: ['Sudah check-in', 'Masa menginap sedang berlangsung.'],
  checked_out: ['Sudah check-out', 'Masa menginap telah selesai.'],
  cancelled: ['Dibatalkan', 'Booking telah dibatalkan. Status refund diperiksa terpisah.'],
  no_show: ['Tidak hadir', 'Booking ditandai no-show oleh hotel.'],
  failed: ['Pembayaran gagal', 'Periksa status attempt yang sama sebelum mencoba kembali.'],
  expired: ['Waktu booking habis', 'Cari dan pilih kembali; harga mungkin berubah.'],
  needs_assistance: ['Perlu bantuan', 'Hasil terakhir belum dapat dipastikan. Simpan kode booking dan periksa kembali sebelum membuat pembayaran baru.'],
}[props.booking.status]))
const tone = computed(() => ['confirmed', 'checked_in', 'checked_out'].includes(props.booking.status) ? 'success' : ['failed', 'expired', 'cancelled', 'no_show'].includes(props.booking.status) ? 'critical' : 'pending')
</script>
<template>
  <section class="status" :class="`status--${tone}`" aria-live="polite">
    <div class="status-icon" aria-hidden="true">{{ tone === 'success' ? '✓' : tone === 'critical' ? '!' : '•' }}</div><div><p class="eyebrow">Booking · {{ booking.reference }}</p><h1>{{ content?.[0] || 'Status belum dikenali' }}</h1><p class="status-copy">{{ content?.[1] || 'Periksa kembali status booking ini sebelum melakukan tindakan lain.' }}</p></div>
    <BookingHoldTimer v-if="['pending', 'pending_payment'].includes(booking.status)" :server-time="booking.serverTime" :expires-at="booking.expiresAt" @elapsed="$emit('elapsed')" />
    <div class="actions"><a v-if="['pending', 'pending_payment'].includes(booking.status) && booking.paymentUrl" class="button" :href="booking.paymentUrl" rel="noopener noreferrer">Lanjut pembayaran</a><BrandButton v-if="['pending', 'pending_payment', 'confirmed'].includes(booking.status)" dark @click="$emit('cancel')">Batalkan booking</BrandButton><BrandButton v-if="['expired', 'failed'].includes(booking.status)" to="/booking">Cari kamar lagi</BrandButton><BrandButton to="/booking/my">Booking Saya</BrandButton><BrandButton to="/booking" dark>Kembali ke pencarian</BrandButton></div>
  </section>
</template>
<style scoped>.status { display: grid; grid-template-columns: auto 1fr; gap: 18px; padding: clamp(24px, 5vw, 54px); border-radius: 32px; background: var(--soft); }.status--success { background: #0d2417; color: #fff; }.status--critical { background: #260e0b; color: #fff; }.status--pending { border: 2px solid #000; }.status-icon { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; background: var(--brand); color: #000; font-size: 1.5rem; font-weight: 900; }.status h1 { max-width: 900px; margin-bottom: 16px; }.status-copy { max-width: 62ch; font-size: 1.08rem; }.status :deep(.timer) { grid-column: 1 / -1; }.actions { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 12px; margin-top: 14px; } @media (max-width: 560px) { .status { grid-template-columns: 1fr; }.status-icon { width: 42px; height: 42px; }.actions { grid-column: 1; }.actions > * { width: 100%; } }</style>
