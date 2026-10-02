<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import { validateGuest } from '~/utils/validation'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Tinjau booking' })
const { draft } = useBookingDraft(); const client = useBookingClient(); const pending = ref(false); const error = ref('')
onMounted(() => { if (!draft.value.selectedQuote || Object.keys(validateGuest(draft.value.guest)).length) navigateTo('/booking/guest') })
async function submit() {
  if (pending.value || !draft.value.consent) return
  pending.value = true; error.value = ''
  draft.value.idempotencyKey ||= `attempt-${draft.value.selectedQuote?.id ?? 'missing'}-${draft.value.guest.email}`
  try { const booking = await client.createBooking(draft.value, draft.value.idempotencyKey); await navigateTo(`/booking/status/${booking.id}`) }
  catch (cause) { error.value = cause instanceof BookingClientError ? cause.message : 'Simulasi gagal. Coba lagi dengan attempt yang sama.' }
  finally { pending.value = false }
}
</script>
<template><div class="container"><BookingSteps :current="3" /><UiInlineAlert v-if="!draft.selectedQuote" tone="error">Sesi demo telah hilang. Pilih kamar kembali. <BrandButton to="/booking">Mulai lagi</BrandButton></UiInlineAlert><div v-else class="review-grid"><div class="stack"><div><p class="eyebrow">Tinjau & bayar</p><h1>Satu langkah lagi.</h1></div><section class="panel panel--dark"><p class="eyebrow">Tamu utama</p><h3>{{ draft.guest.fullName }}</h3><p>{{ draft.guest.email }}</p><p v-if="draft.guest.specialRequests">“{{ draft.guest.specialRequests }}”</p><BrandButton to="/booking/guest">Edit tamu</BrandButton></section><section><h3>Kebijakan penting</h3><UiInlineAlert tone="info"><strong>Tidak dapat dibatalkan atau diubah.</strong> Pembayaran penuh saat booking; no-show dikenakan 100%. Ini snapshot kebijakan demo dan belum merupakan kebijakan final hotel.</UiInlineAlert><UiPolicyAccordion title="Ketentuan dan privasi demo"><p>Data tamu hanya hidup pada state sesi aplikasi. Prototype tidak mengirim data ke hotel, vendor, analytics, atau penyimpanan browser.</p></UiPolicyAccordion><label class="consent"><input v-model="draft.consent" type="checkbox"> <span>Saya membaca dan menyetujui ketentuan demo serta memahami bahwa ini tidak membuat reservasi.</span></label></section><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><BrandButton :disabled="!draft.consent || pending" @click="submit">{{ pending ? 'Memproses demo…' : 'Simulasikan pembayaran' }}</BrandButton></div><BookingSummary :quote="draft.selectedQuote" /></div></div></template>
<style scoped>.review-grid { display: grid; gap: 36px; }.review-grid h1 { font-size: clamp(3rem, 7vw, 5.5rem); }.consent { display: flex; align-items: flex-start; gap: 12px; margin-block: 20px; font-weight: 700; }.consent input { width: 22px; min-height: auto; height: 22px; flex: 0 0 auto; } @media (min-width: 900px) { .review-grid { grid-template-columns: 1fr 420px; }.summary { position: sticky; top: 100px; } }</style>
