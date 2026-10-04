<script setup lang="ts">
import type { DailyRoster } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { jakartaDate, operationsMessage } from '~/utils/operations'
import { decodeStaffFilterQuery, encodeStaffFilterQuery, type StaffFilterSchema } from '~/utils/staff-filter-query'
import { createLatestRequestOwner } from '~/utils/latest-request'
import { preserveOperationsQAQuery } from '~/utils/qa-controls'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Front desk' })
const route = useRoute(); const client = useOperationsClient(); const schema = { date: { type: 'date', default: jakartaDate() } } satisfies StaffFilterSchema
const date = ref(String(decodeStaffFilterQuery(schema, route.query).date)); const roster = ref<DailyRoster | null>(null); const loading = ref(false); const error = ref(''); const lastSuccess = ref<Date | null>(null); const requests = createLatestRequestOwner()
const activeFilters = computed(() => date.value === jakartaDate() ? [] : [`Tanggal ${date.value}`])
async function load() {
  const current = requests.begin(); loading.value = true; error.value = ''; try { const result = await client.getDailyRoster(date.value); if (requests.isLatest(current)) { roster.value = result; lastSuccess.value = new Date() } }
  catch (cause) { if (requests.isLatest(current)) error.value = operationsMessage(cause, 'Roster belum dapat dimuat.') }
  finally { if (requests.isLatest(current)) loading.value = false }
}
async function applyFilters() { await navigateTo({ path: route.path, query: { ...preserveOperationsQAQuery(route.query), ...encodeStaffFilterQuery(schema, { date: date.value }) } }, { replace: true }); await load() }
async function resetFilters() { date.value = jakartaDate(); await applyFilters() }
watch(() => route.query, (query) => { date.value = String(decodeStaffFilterQuery(schema, query).date) }, { deep: true })
onMounted(load); onBeforeUnmount(requests.invalidate)
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Daily operations" title="Front desk" description="Kedatangan, keberangkatan, dan kesiapan kamar pada tanggal operasional."><template #nav><div class="ops-subnav"><NuxtLink to="/staff/front-desk">Roster</NuxtLink><NuxtLink to="/staff/front-desk/handover">Handover</NuxtLink><NuxtLink to="/staff/front-desk/verify">Verifikasi Voucher</NuxtLink></div></template></StaffPageHeader><UiInlineAlert v-if="error && roster" tone="error" live>{{ error }}</UiInlineAlert>
  <StaffFilterBar :active="activeFilters" :busy="loading" :result-label="roster ? `Roster ${roster.date}` : ''" @apply="applyFilters" @reset="resetFilters"><div class="field"><label for="roster-date">Tanggal operasional</label><input id="roster-date" v-model="date" type="date" required /></div></StaffFilterBar><StaffFreshnessStatus v-if="roster" :loading="loading" :stale="Boolean(error)" :last-success="lastSuccess" /><StaffDataState v-if="!roster" :loading="loading" :error="error" loading-label="Memuat roster…" @retry="load" />
  <template v-if="roster"><div class="ops-metrics"><div class="ops-metric"><strong>{{ roster.metrics.occupancyRatePercent.toFixed(1) }}%</strong>Okupansi</div><div class="ops-metric"><strong>{{ roster.metrics.occupiedRooms }}</strong>Kamar terisi</div><div class="ops-metric"><strong>{{ roster.metrics.vacantInspectedRooms }}</strong>Siap dihuni</div><div class="ops-metric"><strong>{{ roster.metrics.outOfOrderRooms }}</strong>Rusak berat</div></div>
  <section class="stack"><h2>Kedatangan</h2><div v-if="!roster.expectedArrivals.length" class="ops-card">Tidak ada kedatangan.</div><div v-else class="ops-grid"><article v-for="item in roster.expectedArrivals" :key="item.bookingId" class="ops-card"><div class="ops-card__top"><div><p class="eyebrow">{{ item.bookingId }}</p><h3>{{ item.guestName }}</h3></div><span class="badge">{{ item.estimatedArrivalTime || 'Waktu belum ada' }}</span></div><p>{{ item.roomTypeName }} · {{ item.numRooms }} kamar · {{ item.numGuests }} tamu</p><p>{{ item.assignedRooms.length ? `Kamar ${item.assignedRooms.join(', ')}` : 'Kamar belum ditugaskan' }}</p><p v-if="item.specialRequests" class="muted">{{ item.specialRequests }}</p><strong>{{ formatMoney(rupiah(item.totalPriceMinor)) }}</strong><BrandButton :to="`/staff/bookings/${item.bookingId}/stay`">Buka stay operations</BrandButton></article></div></section>
  <section class="stack"><h2>Keberangkatan</h2><div v-if="!roster.expectedDepartures.length" class="ops-card">Tidak ada keberangkatan.</div><div v-else class="ops-grid"><article v-for="item in roster.expectedDepartures" :key="item.bookingId" class="ops-card"><div><p class="eyebrow">{{ item.bookingId }}</p><h3>{{ item.guestName }}</h3></div><p>Kamar {{ item.roomNumbers.join(', ') }} · keluar {{ item.checkOutDate }}</p></article></div></section><UiInlineAlert tone="info">{{ roster.inHouseCount }} tamu/kamar tercatat in-house. API belum menyediakan daftar detail lengkap dari angka ini.</UiInlineAlert></template>
</div></template>
