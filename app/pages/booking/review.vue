<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import { validateGuest } from '~/utils/validation'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Tinjau booking' })
const { draft } = useBookingDraft(); const client = useBookingClient(); const pending = ref(false); const error = ref('')
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
onMounted(() => { if (!draft.value.selectedQuote || Object.keys(validateGuest(draft.value.guest)).length) navigateTo('/booking/guest') })
async function submit() {
  if (pending.value || !draft.value.consent) return
  pending.value = true; error.value = ''
  draft.value.idempotencyKey ||= crypto.randomUUID()
  try { const booking = await client.createBooking(draft.value, draft.value.idempotencyKey); await navigateTo(`/booking/status/${booking.id}`) }
  catch (cause) { error.value = cause instanceof BookingClientError ? cause.message : 'Simulasi gagal. Coba lagi dengan attempt yang sama.' }
  finally { pending.value = false }
}
</script>
<template><div class="container"><BookingSteps :current="3" /><UiInlineAlert v-if="!draft.selectedQuote" tone="error">Sesi quote telah hilang. Pilih kamar kembali. <BrandButton to="/booking">Mulai lagi</BrandButton></UiInlineAlert><div v-else class="review-grid"><div class="stack"><div><p class="eyebrow">Tinjau & lanjut bayar</p><h1>Satu langkah lagi.</h1></div><section class="panel panel--dark"><p class="eyebrow">Tamu utama</p><h3>{{ draft.guest.fullName }}</h3><p>{{ draft.guest.email }}</p><p v-if="draft.guest.phone">{{ draft.guest.phone }}</p><p v-if="draft.guest.arrivalTime">Perkiraan tiba {{ draft.guest.arrivalTime }} WIB</p><p v-if="draft.guest.specialRequests">“{{ draft.guest.specialRequests }}”</p><BrandButton to="/booking/guest">Edit tamu</BrandButton></section><section><h3>Kebijakan penting</h3><UiInlineAlert tone="info"><strong>{{ draft.selectedQuote.policySnapshot.cancellation }}</strong> {{ draft.selectedQuote.policySnapshot.payment }}</UiInlineAlert><UiPolicyAccordion title="Ketentuan booking"><p>Harga, masa berlaku quote, dan kebijakan diambil dari snapshot server. Permintaan khusus bergantung ketersediaan.</p></UiPolicyAccordion><label class="consent"><input v-model="draft.consent" type="checkbox"> <span>Saya membaca dan menyetujui ketentuan booking serta kebijakan pembatalan.</span></label><label class="consent"><input v-model="draft.privacyConsent" type="checkbox"> <span>Saya menyetujui pemrosesan data untuk reservasi dan komunikasi terkait.</span></label></section><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><BrandButton :disabled="!draft.consent || !draft.privacyConsent || pending" @click="submit">{{ pending ? 'Membuat booking…' : (isApi ? 'Buat booking & lanjut bayar' : 'Simulasikan booking') }}</BrandButton></div><BookingSummary :quote="draft.selectedQuote" /></div></div></template>
<style scoped>.review-grid { display: grid; gap: 36px; }.review-grid h1 { font-size: clamp(3rem, 7vw, 5.5rem); }.consent { display: flex; align-items: flex-start; gap: 12px; margin-block: 20px; font-weight: 700; }.consent input { width: 22px; min-height: auto; height: 22px; flex: 0 0 auto; } @media (min-width: 900px) { .review-grid { grid-template-columns: 1fr 420px; }.summary { position: sticky; top: 100px; } }</style>
