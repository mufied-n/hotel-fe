<script setup lang="ts">
import type { Quote } from '~/types/booking'
import { formatDate } from '~/utils/dates'
import { formatMoney } from '~/utils/money'

defineProps<{ quote: Quote }>()
</script>
<template>
  <dl class="breakdown">
    <div><dt>Harga awal</dt><dd>{{ formatMoney(quote.original) }}</dd></div>
    <div v-if="quote.discount.amount"><dt>Diskon</dt><dd>− {{ formatMoney(quote.discount) }}</dd></div>
    <div><dt>Subtotal kamar</dt><dd>{{ formatMoney(quote.subtotal) }}</dd></div>
    <details v-if="quote.nightlyRates && quote.nightlyRates.length > 1" class="nightly-details">
      <summary>Rincian tarif per malam ({{ quote.nightlyRates.length }} malam)</summary>
      <div v-for="item in quote.nightlyRates" :key="item.date" class="nightly-item">
        <dt>{{ formatDate(item.date) }}</dt>
        <dd>{{ formatMoney(item.rate) }}</dd>
      </div>
    </details>
    <div><dt>Pajak</dt><dd>{{ formatMoney(quote.taxes) }}</dd></div>
    <div v-if="quote.service.amount"><dt>Layanan</dt><dd>{{ formatMoney(quote.service) }}</dd></div>
    <div class="total"><dt>Total menginap</dt><dd>{{ formatMoney(quote.total) }}</dd></div>
  </dl>
</template>
<style scoped>
.breakdown { display: grid; gap: 9px; margin: 0; }
.breakdown div { display: flex; justify-content: space-between; gap: 20px; }
.breakdown dt { color: var(--muted); }
.breakdown dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; }
.nightly-details { margin-block: 4px; padding: 8px 12px; border-radius: 10px; background: var(--soft); font-size: 0.9em; }
.nightly-details summary { cursor: pointer; font-weight: 700; color: var(--muted); }
.nightly-item { display: flex; justify-content: space-between; padding-top: 6px; }
.nightly-item dt { color: var(--muted); font-size: 0.85em; }
.nightly-item dd { font-size: 0.9em; }
.total { margin-top: 10px; padding-top: 14px; border-top: 2px solid currentColor; font-weight: 900; font-size: 1.2rem; }
.total dt { color: inherit; }
</style>
