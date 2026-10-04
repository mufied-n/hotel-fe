<script setup lang="ts">
import type { Occupancy, RoomFamily } from '~/types/booking'
import { ratePlans } from '~/data/rate-plans'
import { formatMoney } from '~/utils/money'

const props = defineProps<{ family: RoomFamily, roomIndex: number, occupancy: Occupancy, selectedVariant?: string, selectedRate?: string, roomCount?: number, disabled?: boolean }>()
const emit = defineEmits<{ select: [selection: { variantId: string, ratePlanId: string }] }>()
const route = useRoute()
const localVariant = ref('')
const localRate = ref('')
watch(() => [props.selectedVariant, props.selectedRate] as const, ([variant, rate]) => { if (variant && props.family.variants.some(item => item.id === variant)) { localVariant.value = variant; localRate.value = rate || '' } }, { immediate: true })
const activeVariant = computed(() => props.family.variants.find(item => item.id === localVariant.value) || props.family.variants[0])
const isSelected = computed(() => Boolean(props.selectedVariant && props.family.variants.some(item => item.id === props.selectedVariant)))
const detailTo = computed(() => ({ path: `/booking/rooms/${activeVariant.value?.id}`, query: route.query }))
function choose() { if (!props.disabled && localVariant.value && localRate.value) emit('select', { variantId: localVariant.value, ratePlanId: localRate.value }) }
</script>
<template>
  <article class="room-card panel" :class="{ 'room-card--selected': isSelected }">
    <div class="room-media placeholder-image" role="img" :aria-label="activeVariant?.imageAlt"><div class="room-mark"><small>PULANG ROOM</small><strong>{{ family.name }}</strong></div><span>Foto resmi menunggu handoff</span></div>
    <div class="room-copy">
      <div>
        <p class="eyebrow">{{ roomCount || 1 }} kamar · hingga {{ Math.max(...family.variants.map(item => item.capacity)) }} tamu/kamar</p>
        <h3>{{ family.name }}</h3>
        <p>{{ family.description }}</p>
        <span v-if="activeVariant?.availableRooms && activeVariant.availableRooms <= 3" class="scarcity-badge">
          ⚡ Tersisa {{ activeVariant.availableRooms }} kamar lagi!
        </span>
      </div>
      <label class="field-label">Varian / tempat tidur<select v-model="localVariant" :disabled="disabled"><option value="" disabled>Pilih varian</option><option v-for="variant in family.variants" :key="variant.id" :value="variant.id">{{ variant.name }} · {{ variant.bed }} · kapasitas {{ variant.capacity }}<template v-if="variant.availableRooms !== undefined"> · tersisa {{ variant.availableRooms }}</template></option></select></label>
      <fieldset class="rates" :disabled="disabled"><legend>Bandingkan paket</legend><label v-for="rate in ratePlans" :key="rate.id"><input v-model="localRate" type="radio" :name="`rate-${roomIndex}-${family.id}`" :value="rate.id"><span><strong>{{ rate.name }}</strong><small>{{ rate.benefits.join(' · ') }}</small><small>{{ rate.policy }}</small></span></label></fieldset>
      <p v-if="activeVariant?.startingPrice" class="starting-price"><span>Harga tersedia untuk pencarian ini</span><strong>{{ formatMoney(activeVariant.startingPrice) }}</strong><small>Total final dihitung setelah paket dipilih.</small></p>
      <p v-else class="muted">Harga final dihitung setelah kamar dan paket dipilih.</p>
      <div class="room-actions"><NuxtLink class="room-detail-link" :to="detailTo">Lihat detail kamar</NuxtLink><BrandButton :disabled="disabled || !localVariant || !localRate" @click="choose">Pilih kamar & paket</BrandButton></div>
      <p v-if="selectedVariant && family.variants.some(v => v.id === selectedVariant)" class="selected" role="status">✓ Dipilih: {{ family.variants.find(v => v.id === selectedVariant)?.name }} / {{ ratePlans.find(r => r.id === selectedRate)?.name }}</p>
    </div>
  </article>
</template>
<style scoped>
.room-card { display: grid; gap: 24px; overflow: hidden; background: #fff; border: 1px solid var(--line); box-shadow: var(--shadow-small); transition: border-color var(--motion-feedback) var(--ease-standard), box-shadow var(--motion-feedback) var(--ease-standard); }.room-card--selected { border-color: var(--brand); box-shadow: 0 18px 48px rgb(245 129 50 / 20%); }.room-card:nth-of-type(odd) { background: #000; color: #fff; }.room-media { min-height: 360px; align-items: end; justify-items: start; }.room-mark { display: grid; justify-items: start; text-align: left; }.room-mark small { font-weight: 900; letter-spacing: .12em; }.room-mark strong { max-width: 8ch; font-size: clamp(2.5rem, 7vw, 5rem); line-height: .83; letter-spacing: -.06em; text-transform: uppercase; }.room-copy { display: grid; align-content: start; gap: 16px; }.room-copy h3 { margin-bottom: 10px; }.field-label { display: grid; gap: 8px; font-weight: 900; }.field-label select { width: 100%; border: 1px solid #777; border-radius: 14px; background: #fff; color: #000; padding: 10px 12px; }.rates { border: 0; padding: 0; display: grid; gap: 9px; }.rates legend { font-weight: 900; margin-bottom: 6px; }.rates label { display: flex; align-items: flex-start; gap: 11px; border: 1px solid #888; border-radius: 16px; padding: 13px; cursor: pointer; transition: border-color var(--motion-fast) var(--ease-standard), background var(--motion-fast) var(--ease-standard), transform var(--motion-press) var(--ease-standard); }.rates label:active { transform: scale(.99); }.rates label:has(input:checked) { border-color: var(--brand); background: rgb(245 129 50 / 9%); box-shadow: inset 0 0 0 1px var(--brand); }.rates input { min-height: auto; width: 20px; height: 20px; accent-color: var(--brand); }.rates span { display: grid; gap: 3px; }.rates small { opacity: .78; }.starting-price { display: grid; gap: 2px; margin: 0; }.starting-price span, .starting-price small { color: inherit; opacity: .72; }.starting-price strong { font-size: 1.55rem; font-variant-numeric: tabular-nums; }.room-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px; }.selected { margin: 0; color: var(--success); font-weight: 900; animation: selected-in var(--motion-feedback) var(--ease-emphasized); }.room-card:nth-of-type(odd) .selected { color: #9ff0af; }.room-detail-link { min-height: 44px; display: inline-flex; align-items: center; font-weight: 900; text-decoration-thickness: 2px; text-underline-offset: 4px; } @keyframes selected-in { from { opacity: 0; transform: translateY(6px); } }
.scarcity-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 999px; background: #fff0eb; color: #d9480f; font-size: 0.8rem; font-weight: 800; border: 1px solid #ffd8a8; margin-top: 6px; }
.room-card:nth-of-type(odd) .scarcity-badge { background: #3b1812; color: #ff922b; border-color: #7b2d1c; }
@media (min-width: 850px) { .room-card { grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); }.room-card:nth-of-type(odd) .room-media { order: 2; } }
</style>
