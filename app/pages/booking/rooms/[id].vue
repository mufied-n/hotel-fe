<script setup lang="ts">
import type { BackendAvailabilityResponse, BackendRoomVariant } from '~~/shared/types/backend'
import { roomVariants } from '~/data/rooms'
import { addDays, todayInJakarta } from '~/utils/dates'
import { formatMoney, rupiah } from '~/utils/money'
import { decodeSearch } from '~/utils/search-query'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Detail kamar' })
const route = useRoute(); const isApi = computed(() => useRuntimeConfig().public.bookingMode === 'api'); const room = ref<BackendRoomVariant | null>(null); const loading = ref(false); const error = ref(''); const availability = ref<BackendAvailabilityResponse | null>(null); const availabilityPending = ref(false); const availabilityError = ref(''); const search = computed(() => decodeSearch(route.query)); const dates = reactive({ checkIn: search.value?.checkIn || todayInJakarta(), checkOut: search.value?.checkOut || addDays(todayInJakarta(), 1) }); const backToResults = computed(() => search.value ? { path: '/booking/results', query: route.query } : '/booking')
let roomGeneration = 0
let availabilityGeneration = 0
const { showIndicator: showRoomIndicator, isSlow: isRoomSlow } = usePendingFeedback(loading)
function mockRoom(): BackendRoomVariant | null { const source = roomVariants.find(item => item.id === String(route.params.id)); if (!source) return null; return { id: source.id, code: source.id, name: source.name, family_name: source.familyId, bed_type: source.bed, room_size_sqm: 0, max_capacity: source.capacity, max_adults: source.capacity, max_children: 0, description: 'Detail kamar sample mengikuti data demo.', base_price_minor: source.startingPrice?.amount || 0, amenities: source.features, photos: [] } }
async function load() {
  const current = ++roomGeneration
  loading.value = true; error.value = ''; room.value = null
  try { const response = isApi.value ? await $fetch<BackendRoomVariant>(`/api/bff/catalog/rooms/${encodeURIComponent(String(route.params.id))}`) : mockRoom(); if (!response) throw new Error('Kamar tidak ditemukan.'); if (current === roomGeneration) room.value = response }
  catch (cause) { if (current === roomGeneration) error.value = cause instanceof Error ? cause.message : 'Detail kamar belum dapat dimuat.' }
  finally { if (current === roomGeneration) loading.value = false }
}
async function checkAvailability() {
  if (!room.value || availabilityPending.value) return
  const current = ++availabilityGeneration
  availabilityPending.value = true; availabilityError.value = ''; availability.value = null
  try { const response = isApi.value ? await $fetch<BackendAvailabilityResponse>('/api/bff/availability', { query: { room_type_id: room.value.id, check_in: dates.checkIn, check_out: dates.checkOut } }) : { availability: [{ date: dates.checkIn, total_rooms: 10, available_rooms: 3 }], quotes: [{ date: dates.checkIn, rate_minor: 1131500 }], total_minor: 1131500 }; if (current === availabilityGeneration) availability.value = response }
  catch (cause) { if (current === availabilityGeneration) { const value = cause as { data?: { statusMessage?: string } }; availabilityError.value = value.data?.statusMessage || 'Ketersediaan belum dapat diperiksa.' } }
  finally { if (current === availabilityGeneration) availabilityPending.value = false }
}
watch(() => String(route.params.id), load, { immediate: true })
watch(() => [dates.checkIn, dates.checkOut], () => { availabilityGeneration++; availabilityPending.value = false; availability.value = null; availabilityError.value = '' })
onBeforeUnmount(() => { roomGeneration++; availabilityGeneration++ })
</script>
<template>
  <div class="container room-detail">
    <NuxtLink class="back-link" :to="backToResults">← {{ search ? 'Kembali ke hasil pencarian' : 'Pilih tanggal menginap' }}</NuxtLink>
    <div v-if="loading" class="room-loading" aria-busy="true"><div class="loading-state" role="status"><UiLoadingIndicator v-if="showRoomIndicator" /><strong>{{ isRoomSlow ? 'Detail kamar memerlukan waktu lebih lama…' : 'Memuat detail kamar…' }}</strong></div><UiSkeletonBlock v-if="showRoomIndicator" variant="media" /></div><Transition name="feedback"><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert></Transition>
    <template v-if="room">
      <header><div><p class="eyebrow">{{ room.family_name }}</p><h1>{{ room.name }}</h1></div><p class="lede">{{ room.description }}</p></header>
      <div class="gallery" role="region" :aria-label="`Galeri ${room.name}`"><BookingRoomMedia v-for="photo in room.photos" :key="photo.url" :src="photo.url" :alt="photo.alt" /><div v-if="!room.photos.length" class="placeholder-image" role="img" :aria-label="`Foto ${room.name} belum tersedia`"><div class="gallery-mark">{{ room.name }}</div><span>Foto resmi menunggu handoff</span></div></div>
      <div class="room-detail-grid">
        <section class="room-facts" aria-labelledby="about-room-title">
          <UiSectionReveal>
          <div class="facts-heading"><span class="section-number" aria-hidden="true">01 /</span><p class="eyebrow">Kenali ruang Anda</p></div>
          <h2 id="about-room-title">Tentang kamar.</h2>
          <p class="facts-intro">Detail untuk membantu Anda memilih tempat beristirahat yang sesuai.</p>
          <dl class="room-specs">
            <div class="room-spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v3m18-3v3M3 14V5h18v9M2 14h20v4H2zM6 14V9h5v5m2 0V9h5v5" /></svg>
              <dt>Tempat tidur</dt><dd>{{ room.bed_type || 'Belum tersedia' }}</dd>
            </div>
            <div class="room-spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" /></svg>
              <dt>Kapasitas</dt><dd>{{ room.max_capacity > 0 ? `Hingga ${room.max_capacity} tamu` : 'Belum tersedia' }}</dd>
            </div>
            <div v-if="room.room_size_sqm > 0" class="room-spec">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M8 16l8-8m-5 0h5v5" /></svg>
              <dt>Luas kamar</dt><dd>{{ room.room_size_sqm }} m²</dd>
            </div>
          </dl>
          <div class="amenities-heading"><h3>Fasilitas kamar</h3><span>{{ room.amenities.length }} fasilitas</span></div>
          <ul v-if="room.amenities.length" class="amenities-list"><li v-for="amenity in room.amenities" :key="amenity"><span class="amenity-icon" aria-hidden="true">↗</span>{{ amenity }}</li></ul>
          <p v-else class="facts-intro">Informasi fasilitas belum tersedia untuk kamar ini.</p>
          <p v-if="!isApi" class="facts-note"><span aria-hidden="true">i</span>Detail dan kapasitas pada halaman ini adalah data demo.</p>
          </UiSectionReveal>
        </section>
        <form class="availability" aria-labelledby="availability-title" @submit.prevent="checkAvailability">
          <div class="availability-heading"><p class="eyebrow">Rencanakan menginap</p><h2 id="availability-title">{{ search ? 'Tanggal pilihan Anda' : 'Kapan ingin pulang?' }}</h2><p>Pilih tanggal untuk memeriksa ketersediaan kamar.</p></div>
          <div class="availability-body">
            <div v-if="room.base_price_minor" class="starting"><span>Harga dasar</span><strong>{{ formatMoney(rupiah(room.base_price_minor)) }}</strong><small>Total final mengikuti tanggal dan paket.</small></div>
            <div class="stay-dates"><div class="field"><label for="detail-in">Check-in</label><input id="detail-in" v-model="dates.checkIn" type="date" required></div><div class="field"><label for="detail-out">Check-out</label><input id="detail-out" v-model="dates.checkOut" type="date" required></div></div>
            <BrandButton type="submit" :loading="availabilityPending" loading-label="Memeriksa tanggal…" slow-loading-label="Masih memeriksa…">Periksa tanggal <span aria-hidden="true">↗</span></BrandButton>
            <Transition name="feedback"><UiInlineAlert v-if="availabilityError" tone="error" live>{{ availabilityError }}</UiInlineAlert><UiInlineAlert v-else-if="availability" tone="info"><strong>{{ Math.min(...availability.availability.map(item => item.available_rooms)) }} kamar</strong> tersedia untuk data yang diperiksa. Estimasi {{ formatMoney(rupiah(availability.total_minor)) }}; total final mengikuti quote.</UiInlineAlert></Transition>
            <p class="availability-note">Memeriksa tanggal belum membuat reservasi.</p>
            <NuxtLink class="return-to-results" :to="backToResults">{{ search ? 'Kembali memilih kamar' : 'Lihat pilihan kamar' }} <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </form>
      </div>
    </template>
  </div>
</template>
<style scoped>
.room-detail { max-width: 1160px; display: grid; gap: 30px; }.room-loading { display: grid; gap: 16px; min-height: 300px; padding: 18px; border-radius: 28px; background: var(--soft); }.back-link { width: fit-content; min-height: 44px; display: inline-flex; align-items: center; font-weight: 900; text-underline-offset: 4px; }.room-detail header { display: grid; gap: 18px; }.room-detail header h1 { max-width: 850px; margin-bottom: 0; }.gallery { display: grid; gap: 12px; }.gallery .placeholder-image { width: 100%; min-height: min(68vh, 650px); max-height: 650px; object-fit: cover; border-radius: 28px; }.gallery-mark { align-self: end; justify-self: start; max-width: 8ch; font-size: clamp(3rem, 10vw, 7rem); font-weight: 900; line-height: .83; letter-spacing: -.07em; text-align: left; text-transform: uppercase; }
.room-detail-grid { display: grid; gap: 32px; padding-top: 18px; }
.room-facts { min-width: 0; padding: 8px 0; }
.facts-heading { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.facts-heading .eyebrow { margin: 0; font-size: .7rem; }
.section-number { color: var(--muted); font-size: .72rem; font-weight: 700; font-variant-numeric: tabular-nums; }
.room-facts h2 { margin-bottom: 18px; font-size: clamp(2.35rem, 4.5vw, 3.6rem); letter-spacing: -.045em; }
.facts-intro { max-width: 40ch; margin-bottom: 26px; color: var(--muted); font-size: .95rem; line-height: 1.65; }
.room-specs { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 0 0 34px; }
.room-spec { display: grid; align-content: start; gap: 7px; padding: 20px 16px; border: 1px solid var(--line); border-radius: 18px; }
.room-spec svg { width: 26px; height: 26px; margin-bottom: 12px; }
.room-spec dt { color: var(--muted); font-size: .8rem; }
.room-spec dd { margin: 0; font-weight: 800; font-size: 1.06rem; line-height: 1.3; }
.amenities-heading { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.amenities-heading h3 { margin: 0; font-size: 1.2rem; line-height: 1.25; letter-spacing: -.02em; }
.amenities-heading > span { color: var(--muted); font-size: .75rem; }
.amenities-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 22px; margin: 0; padding: 0; list-style: none; }
.amenities-list li { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 15px 0; border-bottom: 1px solid var(--line); font-size: .9rem; overflow-wrap: anywhere; }
.amenity-icon { display: grid; place-items: center; flex: 0 0 28px; height: 28px; border-radius: 50%; background: var(--soft-orange); color: var(--ink); }
.facts-note { display: flex; align-items: baseline; gap: 10px; margin: 24px 0 0; color: var(--muted); font-size: .8rem; line-height: 1.6; }
.facts-note > span { flex: 0 0 16px; height: 16px; line-height: 16px; text-align: center; border: 1px solid currentColor; border-radius: 50%; font-size: .65rem; }
.availability { min-width: 0; align-self: start; overflow: hidden; border: 1px solid var(--line); border-radius: 26px; background: var(--canvas); box-shadow: var(--shadow-small); }
.availability-heading { padding: 26px; background: var(--ink); color: var(--canvas); }
.availability-heading .eyebrow { color: var(--brand); font-size: .68rem; }
.availability-heading h2 { max-width: 15ch; margin-bottom: 12px; font-size: clamp(1.8rem, 3vw, 2.3rem); line-height: 1.05; }
.availability-heading > p:last-child { max-width: 30ch; margin: 0; color: #ccc; font-size: .88rem; }
.availability-body { display: grid; gap: 18px; padding: 24px; }
.starting { display: grid; gap: 4px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
.starting span, .starting small { color: var(--muted); font-size: .8rem; }
.starting strong { font-size: 1.6rem; font-variant-numeric: tabular-nums; }
.stay-dates { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.stay-dates .field { min-width: 0; }
.stay-dates label { font-size: .78rem; }
.stay-dates input { min-width: 0; max-width: 100%; padding: 12px 8px; border-color: var(--line); border-radius: 12px; font-size: .86rem; }
.availability-body > .button { width: 100%; justify-content: space-between; }
.availability-note { margin: 0; color: var(--muted); text-align: center; font-size: .75rem; }
.return-to-results { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 44px; padding-top: 14px; border-top: 1px solid var(--line); font-size: .8rem; font-weight: 800; text-decoration: none; }
@media (hover: hover) and (pointer: fine) { .return-to-results:hover { text-decoration: underline; text-underline-offset: 4px; } }
@media (max-width: 359px) { .stay-dates, .amenities-list { grid-template-columns: 1fr; } }
@media (min-width: 820px) { .room-detail header { grid-template-columns: 1fr minmax(280px, .55fr); align-items: end; }.room-detail-grid { grid-template-columns: minmax(0, 1fr) minmax(340px, .75fr); gap: clamp(36px, 6vw, 80px); align-items: start; padding-top: 30px; }.availability { position: sticky; top: calc(var(--header-height) + 24px); } }
</style>
