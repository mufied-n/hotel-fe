<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import type { BookingStatusView } from '~/types/booking'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Status booking' })
const route = useRoute(); const client = useBookingClient(); const booking = ref<BookingStatusView | null>(null); const error = ref(''); const loading = ref(false); const scenario = ref(typeof route.query.scenario === 'string' ? route.query.scenario : 'pending_payment')
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
const cancelling = ref(false)
let poll: ReturnType<typeof setInterval> | undefined
async function load() {
  loading.value = true; error.value = ''; try { booking.value = await client.getBookingStatus(String(route.params.id), scenario.value) }
  catch (cause) { booking.value = null; error.value = cause instanceof BookingClientError ? cause.message : 'Status gagal diperiksa.' }
  finally { loading.value = false }
}
watch(scenario, load); onMounted(load)
function syncPolling() {
  clearInterval(poll)
  if (isApi.value && ['pending', 'processing'].includes(booking.value?.status || '')) {
    poll = setInterval(() => { if (document.visibilityState === 'visible' && !loading.value) load() }, 5000)
  }
}
watch(() => booking.value?.status, syncPolling)
onBeforeUnmount(() => clearInterval(poll))
async function cancelBooking() {
  if (!booking.value || cancelling.value || !window.confirm('Batalkan booking ini? Pembatalan tidak otomatis berarti refund.')) return
  cancelling.value = true
  error.value = ''
  try { await client.cancelBooking(booking.value.id); await load() }
  catch (cause) { error.value = cause instanceof BookingClientError ? cause.message : 'Booking belum dapat dibatalkan.' }
  finally { cancelling.value = false }
}
</script>
<template><div class="container"><BookingSteps :current="4" /><DevDemoScenarioPanel v-if="!isApi" v-model="scenario" /><p v-if="loading || cancelling" role="status">{{ cancelling ? 'Membatalkan booking…' : 'Memeriksa status booking…' }}</p><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Periksa lagi</BrandButton> <BrandButton to="/booking" dark>Mulai ulang</BrandButton></UiInlineAlert><template v-if="booking"><BookingStatusPanel :booking="booking" @cancel="cancelBooking" /><BookingSummary v-if="booking.quote" :quote="booking.quote" /><UiInlineAlert v-else tone="info">Ringkasan lengkap tersedia melalui Booking Saya setelah Anda masuk menggunakan email booking.</UiInlineAlert></template></div></template>
<style scoped>.summary { margin-top: 30px; }</style>
