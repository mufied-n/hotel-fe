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
<template>
  <div class="container review-page"><BookingSteps :current="3" /><UiInlineAlert v-if="!draft.selectedQuote" tone="error">Ringkasan harga sudah tidak tersedia dalam sesi ini. <BrandButton to="/booking">Pilih kamar lagi</BrandButton></UiInlineAlert>
    <div v-else class="review-grid"><div class="review-main"><header class="section-heading"><p class="eyebrow">Tinjau booking</p><h1>Pastikan semuanya terasa tepat.</h1><p class="lede">Periksa kamar, data tamu, total, dan kebijakan sebelum melanjutkan.</p></header>
        <section class="guest-card"><div><p class="eyebrow">Tamu utama</p><h2>{{ draft.guest.fullName }}</h2><p>{{ draft.guest.email }}<template v-if="draft.guest.phone"><br>{{ draft.guest.phone }}</template></p><p v-if="draft.guest.arrivalTime">Perkiraan tiba {{ draft.guest.arrivalTime }} WIB</p><p v-if="draft.guest.specialRequests" class="request">“{{ draft.guest.specialRequests }}”</p></div><BrandButton to="/booking/guest">Edit data tamu</BrandButton></section>
        <UiSectionReveal><section class="policy-section"><p class="eyebrow">Sebelum melanjutkan</p><h2>Kebijakan penting</h2><div class="policy-lead"><strong>{{ draft.selectedQuote.policySnapshot.cancellation }}</strong><span>{{ draft.selectedQuote.policySnapshot.payment }}</span><span>{{ draft.selectedQuote.policySnapshot.noShow }}</span></div><UiPolicyAccordion title="Tentang harga dan permintaan"><p>Harga dan kebijakan berlaku untuk pilihan yang sedang ditinjau. Permintaan khusus bergantung ketersediaan dan belum berarti disetujui.</p></UiPolicyAccordion><label class="consent"><input v-model="draft.consent" type="checkbox"> <span>Saya telah membaca dan menyetujui ketentuan booking serta kebijakan pembatalan.</span></label><label class="consent"><input v-model="draft.privacyConsent" type="checkbox"> <span>Saya menyetujui pemrosesan data untuk reservasi dan komunikasi terkait.</span></label></section></UiSectionReveal>
        <UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><BrandButton class="desktop-submit" :disabled="!draft.consent || !draft.privacyConsent" :loading="pending" loading-label="Memproses booking…" slow-loading-label="Booking masih diproses…" @click="submit">{{ isApi ? 'Buat booking & lanjut bayar' : 'Simulasikan booking' }}</BrandButton></div>
      <aside class="review-aside"><BookingSummary :quote="draft.selectedQuote" /><BrandButton :disabled="!draft.consent || !draft.privacyConsent" :loading="pending" loading-label="Memproses booking…" slow-loading-label="Booking masih diproses…" @click="submit">{{ isApi ? 'Buat booking & lanjut bayar' : 'Simulasikan booking' }}</BrandButton><small>{{ isApi ? 'Anda akan melanjutkan sesuai alur pembayaran pada lingkungan uji.' : 'Tidak ada reservasi atau pembayaran nyata pada mode demo.' }}</small></aside></div>
  </div>
</template>
<style scoped>
.review-page { max-width: 1160px; }.review-grid, .review-main { display: grid; gap: 32px; }.review-main h1 { max-width: 760px; font-size: clamp(2.8rem, 7vw, 5.2rem); }.guest-card { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 24px; padding: clamp(24px, 5vw, 44px); border-radius: 30px; background: #000; color: #fff; }.guest-card h2 { margin-bottom: 12px; }.request { max-width: 55ch; color: #ccc; }.policy-section { display: grid; gap: 18px; }.policy-section h2 { margin-bottom: 0; }.policy-lead { display: grid; gap: 9px; padding: 20px; border-left: 5px solid var(--brand); background: var(--soft-orange); }.consent { display: flex; align-items: flex-start; gap: 12px; margin: 0; padding: 15px 0; border-top: 1px solid var(--line); font-weight: 800; }.consent input { width: 22px; min-height: auto; height: 22px; flex: 0 0 auto; accent-color: var(--brand); }.review-aside { display: grid; gap: 14px; align-content: start; }.review-aside small { color: var(--muted); }.desktop-submit { display: none; }
@media (min-width: 900px) { .review-grid { grid-template-columns: minmax(0, 1fr) 410px; align-items: start; }.review-aside { position: sticky; top: 96px; }.desktop-submit { display: inline-flex; justify-self: start; }.review-aside > .button { display: none; } }
</style>
