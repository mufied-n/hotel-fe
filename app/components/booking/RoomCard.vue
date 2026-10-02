<script setup lang="ts">
import type { Occupancy, RoomFamily } from '~/types/booking'
import { ratePlans } from '~/data/rate-plans'
import { formatMoney, money } from '~/utils/money'

defineProps<{ family: RoomFamily, roomIndex: number, occupancy: Occupancy, selectedVariant?: string, selectedRate?: string }>()
const emit = defineEmits<{ select: [selection: { variantId: string, ratePlanId: string }] }>()
const localVariant = ref('')
const localRate = ref('')
function choose() { if (localVariant.value && localRate.value) emit('select', { variantId: localVariant.value, ratePlanId: localRate.value }) }
</script>
<template>
  <article class="room-card panel">
    <div class="placeholder-image" role="img" :aria-label="family.variants[0]?.imageAlt"><span>Foto resmi menunggu handoff</span></div>
    <div class="room-copy">
      <p class="eyebrow">Pilihan untuk kamar {{ roomIndex + 1 }}</p><h3>{{ family.name }}</h3><p>{{ family.description }}</p>
      <label class="field-label">Varian / tempat tidur<select v-model="localVariant"><option value="" disabled>Pilih varian</option><option v-for="variant in family.variants" :key="variant.id" :value="variant.id" :disabled="occupancy.adults + occupancy.childrenAges.length > variant.capacity">{{ variant.name }} · {{ variant.bed }} · kapasitas sample {{ variant.capacity }}</option></select></label>
      <fieldset class="rates"><legend>Paket</legend><label v-for="rate in ratePlans" :key="rate.id"><input v-model="localRate" type="radio" :name="`rate-${roomIndex}-${family.id}`" :value="rate.id"><span><strong>{{ rate.name }}</strong><small>{{ rate.policy }}</small></span></label></fieldset>
      <p class="muted">Mulai <strong>{{ formatMoney(money(113150000)) }}</strong> per malam pada snapshot demo.</p>
      <BrandButton :disabled="!localVariant || !localRate" @click="choose">Pilih untuk kamar {{ roomIndex + 1 }}</BrandButton>
      <p v-if="selectedVariant && family.variants.some(v => v.id === selectedVariant)" class="selected" role="status">✓ Dipilih: {{ family.variants.find(v => v.id === selectedVariant)?.name }} / {{ ratePlans.find(r => r.id === selectedRate)?.name }}</p>
    </div>
  </article>
</template>
<style scoped>
.room-card { display: grid; gap: 24px; background: #fff; border: 1px solid var(--line); }.room-card:nth-child(even) { background: #000; color: #fff; }.room-copy { display: grid; align-content: start; gap: 14px; }.field-label { display: grid; gap: 8px; }.field-label select { width: 100%; border: 1px solid #777; border-radius: 12px; background: #fff; color: #000; padding: 10px; }.rates { border: 0; padding: 0; display: grid; gap: 8px; }.rates legend { font-weight: 800; margin-bottom: 5px; }.rates label { display: flex; align-items: flex-start; gap: 10px; border: 1px solid #888; border-radius: 14px; padding: 12px; cursor: pointer; }.rates input { min-height: auto; width: 20px; height: 20px; }.rates span { display: grid; }.rates small { opacity: .8; }.selected { color: var(--success); font-weight: 800; }.room-card:nth-child(even) .selected { color: #9ff0af; }
@media (min-width: 850px) { .room-card { grid-template-columns: 1fr 1fr; } }
</style>
