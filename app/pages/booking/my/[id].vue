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
const paymentUrl = ref<string | undefined>()
const refundState = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
const refundError = ref('')
let generation = 0
const { showIndicator, isSlow } = usePendingFeedback(pending)

function fetchError(cause: unknown, fallback: string) {
  const value = cause as { statusCode?: number, statusMessage?: string, data?: { statusMessage?: string } }
  return { status: value.statusCode, message: value.data?.statusMessage || value.statusMessage || fallback }
}
async function loadRefund(id = encodeURIComponent(String(route.params.id)), current = generation) {
  refundState.value = 'loading'; refundError.value = ''
  try {
    const result = await $fetch<GuestRefundStatus>(`/api/bff/guest/bookings/${id}/refund-status`)
    if (current !== generation) return
    refund.value = result; refundState.value = 'ready'
  }
  catch (cause) {
    if (current !== generation) return
    const failure = fetchError(cause, 'Status refund belum dapat dimuat.')
    if (failure.status === 401) { await navigateTo(`/booking/login?returnTo=${encodeURIComponent(route.fullPath)}`); return }
    refund.value = null; refundError.value = failure.message; refundState.value = 'error'
  }
}
async function load() {
  const current = ++generation
  pending.value = true; error.value = ''; detail.value = null; refund.value = null; refundState.value = 'idle'
  const id = encodeURIComponent(String(route.params.id))
  try {
    const result = await $fetch<{ booking: GuestBookingDetail, allowed_actions: GuestAllowedActions }>(`/api/bff/guest/bookings/${id}`)
    if (current !== generation) return
    detail.value = result.booking; actions.value = result.allowed_actions
    if (result.allowed_actions.can_pay) {
      try {
        const recovery = await $fetch<{ payment_url?: string }>(`/api/bff/guest/bookings/${id}/payment`)
        if (current === generation) paymentUrl.value = recovery.payment_url
      }
      catch { if (current === generation) paymentUrl.value = undefined }
    }
    await loadRefund(id, current)
  }
  catch (cause) {
    if (current !== generation) return
    const failure = fetchError(cause, 'Detail booking belum dapat dimuat.')
    if (failure.status === 401) await navigateTo(`/booking/login?returnTo=${encodeURIComponent(route.fullPath)}`)
    else error.value = failure.message
  }
  finally { if (current === generation) pending.value = false }
}
watch(() => route.params.id, load)
onMounted(load)
onBeforeUnmount(() => { generation++ })
</script>

<template>
  <div class="container">
    <div v-if="pending" class="detail-loading" role="status"><UiLoadingIndicator v-if="showIndicator" /><strong>{{ isSlow ? 'Detail booking memerlukan waktu lebih lama…' : 'Memuat detail booking…' }}</strong></div>
    <UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Coba lagi</BrandButton></UiInlineAlert>
    <template v-if="detail">
      <header><div><NuxtLink class="back-link" to="/booking/my">← Semua booking</NuxtLink><p class="eyebrow">Booking · {{ detail.id }}</p><h1>{{ detail.room_type_name }}</h1></div><span class="badge">{{ detail.status.replaceAll('_', ' ') }}</span></header>
      <div class="detail-grid">
        <section class="panel stack">
          <h2>Detail reservasi</h2><p><strong>{{ formatDate(detail.check_in) }} — {{ formatDate(detail.check_out) }}</strong></p><p>{{ detail.num_rooms }} kamar · {{ detail.num_guests }} tamu</p>
          <p>{{ detail.guest_name }}<br>{{ detail.guest_email }}<br>{{ detail.guest_phone }}</p><p v-if="detail.estimated_arrival_time">Perkiraan tiba {{ detail.estimated_arrival_time }} WIB</p><p v-if="detail.special_requests">Permintaan: {{ detail.special_requests }}</p><p class="price">{{ formatMoney(rupiah(detail.total_price_minor)) }}</p>
          <BookingRefundStatusPanel :state="refundState" :refund="refund" :error="refundError" @retry="loadRefund()" />
        </section>
        <section class="panel stack">
          <h2>Yang dapat dilakukan</h2>
          <template v-if="actions?.can_pay">
            <a v-if="paymentUrl" class="button" :href="paymentUrl" rel="noopener noreferrer">Lanjut pembayaran</a>
            <UiInlineAlert v-else tone="info">Booking ini masih dapat dibayar. Silakan periksa status sebelum mencoba pembayaran lain.</UiInlineAlert>
          </template>
          <BrandButton v-if="actions?.can_download_receipt" :to="`/booking/my/${detail.id}/receipt`">Lihat receipt</BrandButton>
          <a v-if="actions?.can_download_receipt" class="button" :href="`/api/bff/guest/bookings/${detail.id}/voucher.pdf`">Unduh voucher (PDF)</a>
          <a v-if="actions?.can_download_receipt" class="button" :href="`/api/bff/guest/bookings/${detail.id}/invoice.pdf`">Unduh invoice (PDF)</a>
          <a v-if="actions?.can_download_receipt" class="button button--dark" :href="`/api/bff/guest/bookings/${detail.id}/calendar`">Unduh kalender (.ics)</a>
          <UiInlineAlert v-if="actions?.can_cancel" tone="info">Pembatalan mandiri belum tersedia untuk booking ini. Gunakan bantuan hotel bila perlu mengubah rencana.</UiInlineAlert><BrandButton to="/booking/my" dark>Kembali ke daftar</BrandButton>
        </section>
      </div>
      <BookingGuestRequestPanel :booking-id="detail.id" :enabled="Boolean(actions?.can_request_assistance)" />
    </template>
  </div>
</template>

<style scoped>.container { max-width: 1080px; }.detail-loading { min-height: 180px; display: flex; align-items: center; justify-content: center; gap: 12px; color: var(--muted); } header { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 32px; } header h1 { margin-bottom: 12px; }.back-link { min-height: 44px; display: inline-flex; align-items: center; margin-bottom: 24px; font-weight: 900; text-underline-offset: 4px; }.detail-grid { display: grid; gap: 24px; }.detail-grid > .panel { border: 1px solid var(--line); background: #fff; }.detail-grid > .panel:first-child { background: var(--soft); } @media (min-width: 850px) { .detail-grid { grid-template-columns: 1.15fr .85fr; align-items: start; } }</style>
