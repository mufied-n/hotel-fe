<script setup lang="ts">
import type { Quote } from '~/types/booking'
import { formatMoney } from '~/utils/money'

defineProps<{ quote: Quote }>()
</script>
<template>
  <dl class="breakdown">
    <div><dt>Harga awal</dt><dd>{{ formatMoney(quote.original) }}</dd></div>
    <div><dt>Diskon</dt><dd>− {{ formatMoney(quote.discount) }}</dd></div>
    <div><dt>Subtotal kamar</dt><dd>{{ formatMoney(quote.subtotal) }}</dd></div>
    <div><dt>Pajak</dt><dd>{{ formatMoney(quote.taxes) }}</dd></div>
    <div v-if="quote.service.amount"><dt>Layanan</dt><dd>{{ formatMoney(quote.service) }}</dd></div>
    <div class="total"><dt>Total menginap</dt><dd>{{ formatMoney(quote.total) }}</dd></div>
  </dl>
</template>
<style scoped>.breakdown { display: grid; gap: 9px; margin: 0; }.breakdown div { display: flex; justify-content: space-between; gap: 20px; }.breakdown dt { color: var(--muted); }.breakdown dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; }.total { margin-top: 10px; padding-top: 14px; border-top: 2px solid currentColor; font-weight: 900; font-size: 1.2rem; }.total dt { color: inherit; }</style>
