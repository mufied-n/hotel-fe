<script setup lang="ts">
import type { BookingStatusView } from '~/types/booking'

const props = defineProps<{ booking: BookingStatusView }>()
const content = computed(() => ({
  pending_payment: ['Menunggu pembayaran demo', 'Selesaikan simulasi sebelum waktu habis. Tidak ada charge nyata.'],
  processing: ['Pembayaran sedang diperiksa', 'Jangan memulai pembayaran baru. Periksa status ini kembali.'],
  confirmed: ['Terkonfirmasi — demo', 'Simulasi selesai. Tidak ada reservasi hotel atau email yang dibuat.'],
  failed: ['Pembayaran demo gagal', 'Coba simulasi kembali sesuai attempt yang sama.'],
  expired: ['Waktu booking demo habis', 'Cari dan pilih kembali; harga mungkin berubah.'],
  needs_assistance: ['Perlu bantuan', 'Hasil simulasi belum pasti. Simpan reference dan hubungi hotel untuk alur live kelak.'],
}[props.booking.status]))
</script>
<template>
  <section class="panel status" aria-live="polite">
    <p class="eyebrow">Status · {{ booking.reference }}</p><h1>{{ content?.[0] }}</h1><p>{{ content?.[1] }}</p>
    <BookingHoldTimer v-if="booking.status === 'pending_payment'" :server-time="booking.serverTime" :expires-at="booking.expiresAt" />
    <div class="actions"><BrandButton v-if="booking.status === 'pending_payment'">Lanjut simulasi</BrandButton><BrandButton v-if="['expired', 'failed'].includes(booking.status)" to="/booking">Cari ulang</BrandButton><BrandButton to="/booking" dark>Kembali ke pencarian</BrandButton></div>
  </section>
</template>
<style scoped>.status h1 { max-width: 900px; }.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }</style>
