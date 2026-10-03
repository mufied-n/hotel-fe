<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import type { SearchResult } from '~/types/booking'
import { decodeSearch, encodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Pilih kamar' })
const route = useRoute(); const client = useBookingClient(); const { setSearch, setQuote } = useBookingDraft()
const input = computed(() => decodeSearch(route.query)); const result = ref<SearchResult | null>(null); const pending = ref(false); const error = ref(''); const scenario = ref(typeof route.query.scenario === 'string' ? route.query.scenario : 'available')
const selection = ref<{ variantId: string, ratePlanId: string }>({ variantId: '', ratePlanId: '' })
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')

async function load() {
  error.value = ''; result.value = null
  if (!input.value) { error.value = 'URL pencarian tidak valid. Isi ulang pencarian.'; return }
  pending.value = true; setSearch(input.value); selection.value = { variantId: '', ratePlanId: '' }
  try { result.value = await client.search(input.value, scenario.value) }
  catch (cause) { error.value = cause instanceof BookingClientError ? cause.message : 'Pencarian gagal.' }
  finally { pending.value = false }
}
function selectForStay(value: { variantId: string, ratePlanId: string }) { selection.value = value }
const ready = computed(() => Boolean(selection.value.variantId && selection.value.ratePlanId))
async function continueBooking() {
  if (!input.value || !ready.value) return
  const roomCount = input.value.occupancy.length
  try { const quote = await client.quote(input.value, { variantIds: Array(roomCount).fill(selection.value.variantId), ratePlanIds: Array(roomCount).fill(selection.value.ratePlanId) }); setQuote(quote); await navigateTo('/booking/guest') }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Quote gagal dibuat.' }
}
async function editSearch(value: Parameters<typeof encodeSearch>[0]) { setSearch(value); await navigateTo({ path: '/booking/results', query: encodeSearch(value) }) }
watch(() => route.fullPath, load, { immediate: true })
</script>
<template><div class="container"><BookingSteps :current="1" /><header class="results-head"><p class="eyebrow">Ketersediaan</p><h1>Pilih kamar.</h1><p v-if="input">{{ input.occupancy.length }} kamar · backend saat ini memakai satu varian dan paket untuk seluruh kamar.</p></header><DevDemoScenarioPanel v-if="!isApi" v-model="scenario" /><details class="edit"><summary>Ubah pencarian</summary><BookingSearchForm v-if="input" :initial="input" @search="editSearch" /></details><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton v-if="input" @click="load">Coba lagi</BrandButton></UiInlineAlert><div v-if="pending" class="loading" role="status">Mencari kamar…</div><template v-if="result && input"><section class="room-group"><div><p class="eyebrow">{{ input.occupancy.length }} kamar</p><h2>Pilih satu varian & paket</h2></div><BookingRoomCard v-for="family in result.rooms" :key="family.id" :family="family" :room-index="0" :room-count="input.occupancy.length" :occupancy="{ roomIndex: 0, adults: input.occupancy.reduce((n, room) => n + room.adults, 0), childrenAges: input.occupancy.flatMap(room => room.childrenAges) }" :selected-variant="selection.variantId" :selected-rate="selection.ratePlanId" @select="selectForStay" /></section><div class="continue"><p>{{ ready ? 'Kamar dan paket telah dipilih.' : 'Pilih satu varian dan paket untuk jumlah kamar ini.' }}</p><BrandButton :disabled="!ready" @click="continueBooking">Lanjut ke detail tamu</BrandButton></div></template></div></template>
<style scoped>.results-head { margin-bottom: 30px; }.results-head h1 { margin-bottom: 12px; }.edit { margin-bottom: 30px; }.edit > summary { font-weight: 800; cursor: pointer; margin-bottom: 16px; }.loading { min-height: 240px; display: grid; place-items: center; border-radius: 24px; background: var(--soft); }.room-group { display: grid; gap: 20px; margin-block: 54px; }.continue { position: sticky; z-index: 10; bottom: 16px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 20px; border: 2px solid #000; border-radius: 20px; background: #fff; box-shadow: var(--shadow); }.continue p { margin: 0; }</style>
