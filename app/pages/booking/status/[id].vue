<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import type { BookingStatusView } from '~/types/booking'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Status booking demo' })
const route = useRoute(); const client = useBookingClient(); const booking = ref<BookingStatusView | null>(null); const error = ref(''); const loading = ref(false); const scenario = ref(typeof route.query.scenario === 'string' ? route.query.scenario : 'pending_payment')
async function load() {
  loading.value = true; error.value = ''; try { booking.value = await client.getBookingStatus(String(route.params.id), scenario.value) }
  catch (cause) { booking.value = null; error.value = cause instanceof BookingClientError ? cause.message : 'Status gagal diperiksa.' }
  finally { loading.value = false }
}
watch(scenario, load); onMounted(load)
</script>
<template><div class="container"><BookingSteps :current="4" /><DevDemoScenarioPanel v-model="scenario" /><p v-if="loading" role="status">Memeriksa status demo…</p><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton @click="load">Periksa lagi</BrandButton> <BrandButton to="/booking" dark>Mulai ulang</BrandButton></UiInlineAlert><template v-if="booking"><BookingStatusPanel :booking="booking" /><BookingSummary :quote="booking.quote" /></template></div></template>
<style scoped>.summary { margin-top: 30px; }</style>
