<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import type { BookingStatusView } from '~/types/booking'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Status booking' })
const route = useRoute(); const client = useBookingClient(); const booking = ref<BookingStatusView | null>(null); const error = ref(''); const loading = ref(false); const scenario = ref(typeof route.query.scenario === 'string' ? route.query.scenario : 'pending_payment')
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
const cancelling = ref(false)
const cancelOpen = ref(false)
const stale = ref(false)
let loadGeneration = 0
let poll: ReturnType<typeof setInterval> | undefined
const { showIndicator: showStatusIndicator, isSlow: isStatusSlow } = usePendingFeedback(loading)
async function load() {
  const current = ++loadGeneration
  loading.value = true; error.value = ''; try { const result = await client.getBookingStatus(String(route.params.id), scenario.value); if (current === loadGeneration) { booking.value = result; stale.value = false } }
  catch (cause) { if (current === loadGeneration) { stale.value = Boolean(booking.value); error.value = cause instanceof BookingClientError ? cause.message : 'Status gagal diperiksa.' } }
  finally { if (current === loadGeneration) loading.value = false }
}
watch(scenario, load); onMounted(load)
function syncPolling() {
  clearInterval(poll)
  if (isApi.value && ['pending', 'processing'].includes(booking.value?.status || '')) {
    poll = setInterval(() => { if (document.visibilityState === 'visible' && !loading.value) load() }, 5000)
  }
}
watch(() => booking.value?.status, syncPolling)
function onVisibility() { if (document.visibilityState === 'visible' && isApi.value && ['pending', 'processing'].includes(booking.value?.status || '')) load() }
onMounted(() => document.addEventListener('visibilitychange', onVisibility))
onBeforeUnmount(() => { clearInterval(poll); document.removeEventListener('visibilitychange', onVisibility); loadGeneration++ })
async function cancelBooking() {
  if (!booking.value || cancelling.value) return
  cancelling.value = true
  error.value = ''
  try { await client.cancelBooking(booking.value.id); cancelOpen.value = false; if (isApi.value) await load(); else booking.value = { ...booking.value, status: 'cancelled', paymentUrl: undefined } }
  catch (cause) { error.value = cause instanceof BookingClientError ? cause.message : 'Booking belum dapat dibatalkan.' }
  finally { cancelling.value = false }
}
</script>
<template><div class="container status-page"><BookingSteps :current="4" /><details v-if="!isApi" class="demo-scenarios"><summary>Kontrol status demo</summary><DevDemoScenarioPanel v-model="scenario" /></details><div v-if="loading || cancelling" class="loading-state" role="status"><UiLoadingIndicator v-if="cancelling || showStatusIndicator" /><strong>{{ cancelling ? 'Membatalkan booking…' : (isStatusSlow ? 'Status masih sedang diperbarui…' : 'Memeriksa status booking…') }}</strong></div><UiInlineAlert v-if="error" tone="error" live>{{ error }} <span v-if="stale">Status terakhir tetap ditampilkan dan mungkin belum terbaru.</span> <BrandButton :loading="loading" loading-label="Memeriksa…" slow-loading-label="Masih memeriksa…" @click="load">Periksa lagi</BrandButton> <BrandButton to="/booking" dark>Cari kamar</BrandButton></UiInlineAlert><template v-if="booking"><BookingStatusPanel :booking="booking" @cancel="cancelOpen = true" @elapsed="load" /><BookingSummary v-if="booking.quote" :quote="booking.quote" /><UiInlineAlert v-else tone="info">Ringkasan lengkap tersedia melalui Booking Saya setelah Anda masuk menggunakan email booking.</UiInlineAlert><BookingCancelBookingDialog :open="cancelOpen" :reference="booking.reference" :policy="booking.quote?.policySnapshot.cancellation" :pending="cancelling" @close="cancelOpen = false" @confirm="cancelBooking" /></template></div></template>
<style scoped>.status-page { max-width: 1080px; }.demo-scenarios { margin-bottom: 22px; border-bottom: 1px solid var(--line); }.demo-scenarios summary { min-height: 48px; display: flex; align-items: center; font-weight: 900; cursor: pointer; }.summary { margin-top: 30px; }</style>
