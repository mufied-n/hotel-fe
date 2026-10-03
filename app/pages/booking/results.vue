<script setup lang="ts">
import { BookingClientError } from '~/services/booking-client'
import type { SearchInput, SearchResult } from '~/types/booking'
import { decodeSearch, encodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Pilih kamar' })
const route = useRoute(); const client = useBookingClient(); const { setSearch, setQuote } = useBookingDraft()
const input = computed(() => decodeSearch(route.query)); const result = ref<SearchResult | null>(null); const pending = ref(false); const quotePending = ref(false); const error = ref(''); const scenario = ref(typeof route.query.scenario === 'string' ? route.query.scenario : 'available')
const selection = ref<{ variantId: string, ratePlanId: string }>({ variantId: '', ratePlanId: '' })
const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api')
let loadGeneration = 0
let quoteGeneration = 0
const { showIndicator: showSearchIndicator, isSlow: isSearchSlow } = usePendingFeedback(pending)
const { isSlow: isQuoteSlow } = usePendingFeedback(quotePending)

function copySearch(value: SearchInput): SearchInput {
  return { ...value, occupancy: value.occupancy.map(room => ({ ...room, childrenAges: [...room.childrenAges] })) }
}

async function load() {
  const current = ++loadGeneration
  quoteGeneration++
  error.value = ''; result.value = null
  if (!input.value) { pending.value = false; quotePending.value = false; error.value = 'URL pencarian tidak valid. Isi ulang pencarian.'; return }
  pending.value = true; setSearch(input.value); selection.value = { variantId: '', ratePlanId: '' }
  try { const response = await client.search(input.value, scenario.value); if (current === loadGeneration) result.value = response }
  catch (cause) { if (current === loadGeneration) error.value = cause instanceof BookingClientError ? cause.message : 'Pencarian gagal.' }
  finally { if (current === loadGeneration) pending.value = false }
}
function selectForStay(value: { variantId: string, ratePlanId: string }) { if (!quotePending.value) selection.value = value }
const ready = computed(() => Boolean(selection.value.variantId && selection.value.ratePlanId))
async function continueBooking() {
  if (!input.value || !ready.value || quotePending.value) return
  const current = ++quoteGeneration
  const searchSnapshot = copySearch(input.value)
  const selectionSnapshot = { ...selection.value }
  const roomCount = searchSnapshot.occupancy.length
  quotePending.value = true; error.value = ''
  try {
    const quote = await client.quote(searchSnapshot, { variantIds: Array(roomCount).fill(selectionSnapshot.variantId), ratePlanIds: Array(roomCount).fill(selectionSnapshot.ratePlanId) })
    if (current !== quoteGeneration) return
    setQuote(quote); await navigateTo('/booking/guest')
  }
  catch (cause) { if (current === quoteGeneration) error.value = cause instanceof Error ? cause.message : 'Quote gagal dibuat.' }
  finally { if (current === quoteGeneration) quotePending.value = false }
}
async function editSearch(value: Parameters<typeof encodeSearch>[0]) { setSearch(value); await navigateTo({ path: '/booking/results', query: encodeSearch(value) }) }
watch(() => route.fullPath, load, { immediate: true })
onBeforeUnmount(() => { loadGeneration++; quoteGeneration++ })
</script>
<template>
  <div class="container results-page">
    <BookingSteps :current="1" />
    <header class="results-head"><div><p class="eyebrow">Kamar tersedia</p><h1>Pilih cara Anda pulang.</h1></div><p v-if="input" class="search-summary">{{ input.checkIn }} → {{ input.checkOut }}<br><strong>{{ input.occupancy.length }} kamar · {{ input.occupancy.reduce((n, room) => n + room.adults + room.childrenAges.length, 0) }} tamu</strong></p></header>
    <details class="edit"><summary>Ubah tanggal atau tamu</summary><BookingSearchForm v-if="input" :initial="input" @search="editSearch" /></details>
    <details v-if="!isApi" class="demo-scenarios"><summary>Kontrol skenario demo</summary><DevDemoScenarioPanel v-model="scenario" /></details>
    <Transition name="feedback"><UiInlineAlert v-if="error" tone="error" live>{{ error }} <BrandButton v-if="input" @click="load">Coba lagi</BrandButton></UiInlineAlert></Transition>
    <Transition name="content-fade" mode="out-in">
      <section v-if="pending" key="loading" class="results-loading" aria-busy="true" aria-labelledby="results-loading-label"><div class="loading-state" role="status"><UiLoadingIndicator v-if="showSearchIndicator" /><strong id="results-loading-label">{{ isSearchSlow ? 'Masih memeriksa ketersediaan kamar…' : 'Mencari ruang yang tersedia…' }}</strong></div><div v-if="showSearchIndicator" class="loading-card" aria-hidden="true"><UiSkeletonBlock variant="media" /><div class="loading-lines"><UiSkeletonBlock variant="line" /><UiSkeletonBlock variant="line" /><UiSkeletonBlock variant="line" /></div></div></section>
      <div v-else-if="result && input" key="ready" class="results-ready">
        <section class="room-group" aria-labelledby="room-list-title"><UiSectionReveal><div class="section-heading"><p class="eyebrow">{{ result.rooms.length }} keluarga kamar</p><h2 id="room-list-title">Kamar dan paket</h2><p class="lede">Pilih tempat tidur dan paket pada kamar yang paling sesuai. Total final muncul setelah pilihan dikonfirmasi.</p><UiInlineAlert v-if="input.occupancy.length > 1" tone="info">Untuk pencarian ini, semua {{ input.occupancy.length }} kamar menggunakan tipe dan paket yang sama.</UiInlineAlert></div></UiSectionReveal><BookingRoomCard v-for="family in result.rooms" :key="family.id" :family="family" :room-index="0" :room-count="input.occupancy.length" :occupancy="{ roomIndex: 0, adults: input.occupancy.reduce((n, room) => n + room.adults, 0), childrenAges: input.occupancy.flatMap(room => room.childrenAges) }" :selected-variant="selection.variantId" :selected-rate="selection.ratePlanId" :disabled="quotePending" @select="selectForStay" /></section>
        <div class="continue" :aria-busy="quotePending || undefined"><div><span class="continue-label">Pilihan Anda</span><strong>{{ quotePending ? (isQuoteSlow ? 'Total masih sedang dihitung…' : 'Menyiapkan total pilihan…') : (ready ? 'Kamar dan paket siap ditinjau' : 'Pilih kamar dan paket dahulu') }}</strong></div><BrandButton :disabled="!ready" :loading="quotePending" loading-label="Menyiapkan total…" slow-loading-label="Masih menghitung…" @click="continueBooking">Lanjut <span aria-hidden="true">→</span></BrandButton></div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.results-page { max-width: 1160px; }.results-head { display: grid; gap: 22px; margin-bottom: 24px; }.results-head h1 { max-width: 850px; margin-bottom: 0; }.search-summary { align-self: end; margin: 0; padding: 16px 18px; border: 1px solid var(--line); border-radius: 18px; background: var(--soft); }.edit, .demo-scenarios { margin-bottom: 20px; border-bottom: 1px solid var(--line); }.edit > summary, .demo-scenarios > summary { min-height: 50px; display: flex; align-items: center; font-weight: 900; cursor: pointer; }.edit .search-form { margin-bottom: 24px; }.demo-scenarios { font-size: .9rem; }.results-loading { display: grid; gap: 18px; min-height: 300px; padding: 20px; border-radius: 28px; background: var(--soft); }.loading-card { display: grid; gap: 18px; }.loading-lines { display: grid; align-content: center; gap: 14px; }.loading-lines > :nth-child(2) { width: 76%; }.loading-lines > :nth-child(3) { width: 48%; }.results-ready { display: grid; }.room-group { display: grid; gap: 26px; margin-block: 48px; }.section-heading { margin-bottom: 8px; }.continue { position: sticky; z-index: 18; bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 12px 12px 12px 18px; border: 2px solid #000; border-radius: 999px; background: #fff; box-shadow: var(--shadow); transition: border-color var(--motion-feedback) var(--ease-standard), box-shadow var(--motion-feedback) var(--ease-standard); }.continue[aria-busy='true'] { border-color: var(--brand); box-shadow: 0 16px 48px rgb(245 129 50 / 24%); }.continue div { display: grid; line-height: 1.25; }.continue-label { color: var(--muted); font-size: .68rem; font-weight: 900; letter-spacing: .08em; text-transform: uppercase; }.continue .button { flex: 0 0 auto; }.continue p { margin: 0; }
@media (min-width: 800px) { .results-head { grid-template-columns: 1fr auto; align-items: end; }.search-summary { min-width: 250px; }.loading-card { grid-template-columns: minmax(0, 1fr) minmax(260px, .85fr); }.continue { margin-inline: auto; max-width: 760px; } }
@media (max-width: 560px) { .continue strong { font-size: .78rem; }.continue .button { min-height: 44px; padding-inline: 17px; } }
</style>
