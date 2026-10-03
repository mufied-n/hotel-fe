<script setup lang="ts">
import type { DailyRoster } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { jakartaDate, operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Front desk' })
const client = useOperationsClient(); const date = ref(jakartaDate()); const roster = ref<DailyRoster | null>(null); const loading = ref(false); const error = ref(''); let generation = 0
async function load() {
  const current = ++generation; loading.value = true; error.value = ''; try { const result = await client.getDailyRoster(date.value); if (current === generation) roster.value = result }
  catch (cause) { if (current === generation) error.value = operationsMessage(cause, 'Roster belum dapat dimuat.') }
  finally { if (current === generation) loading.value = false }
}
onMounted(load); onBeforeUnmount(() => generation++)
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Daily operations" title="Front desk" description="Kedatangan, keberangkatan, dan kesiapan kamar pada tanggal operasional."><template #nav><div class="ops-subnav"><NuxtLink to="/staff/front-desk">Roster</NuxtLink><NuxtLink to="/staff/front-desk/handover">Handover</NuxtLink></div></template></StaffPageHeader><UiInlineAlert v-if="error && roster" tone="error" live>{{ error }}</UiInlineAlert>
  <form class="ops-toolbar" @submit.prevent="load"><div class="field"><label for="roster-date">Tanggal operasional</label><input id="roster-date" v-model="date" type="date" required /></div><BrandButton type="submit" :loading="loading" loading-label="Memuat roster…">Lihat roster</BrandButton></form><StaffDataState v-if="!roster" :loading="loading" :error="error" loading-label="Memuat roster…" @retry="load" />
  <template v-if="roster"><div class="ops-metrics"><div class="ops-metric"><strong>{{ roster.metrics.occupancyRatePercent.toFixed(1) }}%</strong>Okupansi</div><div class="ops-metric"><strong>{{ roster.metrics.occupiedRooms }}</strong>Kamar terisi</div><div class="ops-metric"><strong>{{ roster.metrics.vacantInspectedRooms }}</strong>Siap dihuni</div><div class="ops-metric"><strong>{{ roster.metrics.outOfOrderRooms }}</strong>Rusak berat</div></div>
  <section class="stack"><h2>Kedatangan</h2><div v-if="!roster.expectedArrivals.length" class="ops-card">Tidak ada kedatangan.</div><div v-else class="ops-grid"><article v-for="item in roster.expectedArrivals" :key="item.bookingId" class="ops-card"><div class="ops-card__top"><div><p class="eyebrow">{{ item.bookingId }}</p><h3>{{ item.guestName }}</h3></div><span class="badge">{{ item.estimatedArrivalTime || 'Waktu belum ada' }}</span></div><p>{{ item.roomTypeName }} · {{ item.numRooms }} kamar · {{ item.numGuests }} tamu</p><p>{{ item.assignedRooms.length ? `Kamar ${item.assignedRooms.join(', ')}` : 'Kamar belum ditugaskan' }}</p><p v-if="item.specialRequests" class="muted">{{ item.specialRequests }}</p><strong>{{ formatMoney(rupiah(item.totalPriceMinor)) }}</strong><BrandButton :to="`/staff/bookings/${item.bookingId}/stay`">Buka stay operations</BrandButton></article></div></section>
  <section class="stack"><h2>Keberangkatan</h2><div v-if="!roster.expectedDepartures.length" class="ops-card">Tidak ada keberangkatan.</div><div v-else class="ops-grid"><article v-for="item in roster.expectedDepartures" :key="item.bookingId" class="ops-card"><div><p class="eyebrow">{{ item.bookingId }}</p><h3>{{ item.guestName }}</h3></div><p>Kamar {{ item.roomNumbers.join(', ') }} · keluar {{ item.checkOutDate }}</p></article></div></section><UiInlineAlert tone="info">{{ roster.inHouseCount }} tamu/kamar tercatat in-house. API belum menyediakan daftar detail lengkap dari angka ini.</UiInlineAlert></template>
</div></template>
