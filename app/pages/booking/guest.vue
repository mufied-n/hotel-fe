<script setup lang="ts">
import { validateGuest } from '~/utils/validation'

definePageMeta({ layout: 'booking' }); useSeoMeta({ title: 'Detail tamu' })
const { draft } = useBookingDraft(); const errors = ref<Record<string, string>>({})
const requestPresets = [
  'Bebas asap rokok',
  'Lantai atas',
  'Kamar tenang',
  'Bantal ekstra',
  'Check-in awal bila tersedia',
]
function togglePreset(preset: string) {
  const current = draft.value.guest.specialRequests.trim()
  if (current.includes(preset)) {
    draft.value.guest.specialRequests = current
      .replace(new RegExp(`(^|,\\s*)${preset}`, 'gi'), '')
      .replace(/^,\s*/, '')
      .trim()
  }
  else {
    draft.value.guest.specialRequests = current ? `${current}, ${preset}` : preset
  }
}
onMounted(() => { if (!draft.value.selectedQuote) navigateTo('/booking') })
async function submit() { errors.value = validateGuest(draft.value.guest); if (!Object.keys(errors.value).length) await navigateTo('/booking/review') }
</script>
<template>
  <div class="container guest-page"><BookingSteps :current="2" /><UiInlineAlert v-if="!draft.selectedQuote" tone="error">Pilihan kamar sudah tidak tersedia dalam sesi ini. <BrandButton to="/booking">Pilih kamar lagi</BrandButton></UiInlineAlert>
    <div v-else class="checkout-grid"><form class="guest-form" novalidate @submit.prevent="submit"><div class="section-heading"><p class="eyebrow">Detail tamu</p><h1>Siapa yang akan pulang?</h1><p class="lede">Masukkan data tamu utama. Kami menggunakan email ini untuk konfirmasi dan akses Booking Saya.</p></div><div class="form-section"><UiFormField id="full-name" label="Nama lengkap" :error="errors.fullName"><template #default="{ describedby }"><input id="full-name" v-model="draft.guest.fullName" autocomplete="name" :aria-describedby="describedby" :aria-invalid="Boolean(errors.fullName)"></template></UiFormField><UiFormField id="email" label="Email" :error="errors.email"><template #default="{ describedby }"><input id="email" v-model="draft.guest.email" type="email" autocomplete="email" :aria-describedby="describedby" :aria-invalid="Boolean(errors.email)"></template></UiFormField><UiFormField id="phone" label="Nomor telepon" :error="errors.phone" hint="Opsional. Sertakan kode negara bila digunakan."><template #default="{ describedby }"><input id="phone" v-model="draft.guest.phone" type="tel" autocomplete="tel" :aria-describedby="describedby" :aria-invalid="Boolean(errors.phone)"></template></UiFormField></div><details class="optional"><summary>Waktu tiba dan permintaan khusus</summary><div class="form-section"><UiFormField id="arrival" label="Perkiraan waktu tiba" :error="errors.arrivalTime" hint="Opsional, waktu lokal hotel."><template #default="{ describedby }"><input id="arrival" v-model="draft.guest.arrivalTime" type="time" :aria-describedby="describedby" :aria-invalid="Boolean(errors.arrivalTime)"></template></UiFormField><UiFormField id="requests" label="Permintaan khusus" :error="errors.specialRequests" hint="Bergantung ketersediaan dan belum berarti disetujui."><template #default="{ describedby }"><div class="preset-chips"><button v-for="preset in requestPresets" :key="preset" type="button" class="chip-button" :class="{ 'chip-button--active': draft.guest.specialRequests.includes(preset) }" @click="togglePreset(preset)">{{ draft.guest.specialRequests.includes(preset) ? '✓ ' : '+ ' }}{{ preset }}</button></div><textarea id="requests" v-model="draft.guest.specialRequests" rows="4" maxlength="500" :aria-describedby="describedby" /><small>{{ [...draft.guest.specialRequests].length }}/500</small></template></UiFormField></div></details><BrandButton type="submit">Tinjau booking <span aria-hidden="true">→</span></BrandButton></form><BookingSummary :quote="draft.selectedQuote" /></div>
  </div>
</template>
<style scoped>
.guest-page { max-width: 1160px; }.checkout-grid { display: grid; gap: 38px; }.guest-form { display: grid; gap: 28px; }.guest-form h1 { max-width: 720px; font-size: clamp(2.8rem, 7vw, 5.2rem); }.form-section { display: grid; gap: 18px; padding: clamp(20px, 4vw, 32px); border: 1px solid var(--line); border-radius: 26px; background: #fff; }.optional { border-block: 1px solid var(--line); }.optional summary { min-height: 56px; display: flex; align-items: center; font-weight: 900; cursor: pointer; }.optional .form-section { margin-bottom: 22px; }
.preset-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
.chip-button { display: inline-flex; align-items: center; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line); background: var(--soft); font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: all var(--motion-fast) var(--ease-standard); }
.chip-button:hover { border-color: var(--brand); }
.chip-button--active { background: #000; color: #fff; border-color: #000; }
@media (min-width: 900px) { .checkout-grid { grid-template-columns: minmax(0, 1fr) 410px; align-items: start; }.summary { position: sticky; top: 96px; } }
</style>
