<script setup lang="ts">
import type { BookingStatusView } from '~/types/booking'

const props = defineProps<{ booking: BookingStatusView }>()
defineEmits<{ cancel: [] }>()
const content = computed(() => ({
  pending: ['Menunggu pembayaran', 'Selesaikan pembayaran sebelum batas waktu dan periksa status kembali.'],
  pending_payment: ['Menunggu pembayaran demo', 'Selesaikan simulasi sebelum waktu habis. Tidak ada charge nyata.'],
  processing: ['Pembayaran sedang diperiksa', 'Jangan memulai pembayaran baru. Periksa status ini kembali.'],
  confirmed: ['Terkonfirmasi', 'Booking telah dikonfirmasi oleh server hotel.'],
  checked_in: ['Sudah check-in', 'Masa menginap sedang berlangsung.'],
  checked_out: ['Sudah check-out', 'Masa menginap telah selesai.'],
  cancelled: ['Dibatalkan', 'Booking telah dibatalkan. Status refund diperiksa terpisah.'],
  no_show: ['Tidak hadir', 'Booking ditandai no-show oleh hotel.'],
  failed: ['Pembayaran demo gagal', 'Coba simulasi kembali sesuai attempt yang sama.'],
  expired: ['Waktu booking demo habis', 'Cari dan pilih kembali; harga mungkin berubah.'],
  needs_assistance: ['Perlu bantuan', 'Hasil simulasi belum pasti. Simpan reference dan hubungi hotel untuk alur live kelak.'],
}[props.booking.status]))
</script>
<template>
  <section class="panel status" aria-live="polite">
    <p class="eyebrow">Status · {{ booking.reference }}</p><h1>{{ content?.[0] }}</h1><p>{{ content?.[1] }}</p>
    <BookingHoldTimer v-if="['pending', 'pending_payment'].includes(booking.status)" :server-time="booking.serverTime" :expires-at="booking.expiresAt" />
    <div class="actions"><a v-if="['pending', 'pending_payment'].includes(booking.status) && booking.paymentUrl" class="button" :href="booking.paymentUrl" rel="noopener noreferrer">Lanjut pembayaran</a><BrandButton v-if="['pending', 'pending_payment', 'confirmed'].includes(booking.status)" dark @click="$emit('cancel')">Batalkan booking</BrandButton><BrandButton v-if="['expired', 'failed'].includes(booking.status)" to="/booking">Cari ulang</BrandButton><BrandButton to="/booking/my">Booking Saya</BrandButton><BrandButton to="/booking" dark>Kembali ke pencarian</BrandButton></div>
  </section>
</template>
<style scoped>.status h1 { max-width: 900px; }.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }</style>
