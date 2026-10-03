<script setup lang="ts">
import type { Quote } from '~/types/booking'
import { formatDate } from '~/utils/dates'

defineProps<{ quote: Quote }>()
</script>
<template>
  <section class="panel summary" aria-labelledby="summary-title">
    <p class="eyebrow">Ringkasan booking</p><h3 id="summary-title">{{ quote.nights }} malam · {{ quote.numRooms || quote.items.length }} kamar</h3>
    <p>{{ formatDate(quote.search.checkIn) }} — {{ formatDate(quote.search.checkOut) }}</p>
    <div v-for="item in quote.items" :key="item.roomIndex" class="summary-room"><strong>{{ quote.numRooms || 1 }}× {{ item.variant.name }}</strong><span>{{ item.variant.bed }} · {{ item.ratePlan.name }}</span><span>{{ item.occupancy.adults }} dewasa<span v-if="item.occupancy.childrenAges.length"> · {{ item.occupancy.childrenAges.length }} anak</span></span></div>
    <BookingPriceBreakdown :quote="quote" />
  </section>
</template>
<style scoped>.summary { align-content: start; }.summary-room { display: grid; gap: 2px; padding-block: 14px; border-top: 1px solid var(--line); }.summary-room span { color: var(--muted); }</style>
