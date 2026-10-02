<script setup lang="ts">
import type { Quote } from '~/types/booking'
import { formatMoney } from '~/utils/money'

defineProps<{ quote: Quote }>()
</script>
<template>
  <dl class="breakdown">
    <div><dt>Harga awal</dt><dd>{{ formatMoney(quote.original) }}</dd></div>
    <div><dt>Diskon demo</dt><dd>− {{ formatMoney(quote.discount) }}</dd></div>
    <div><dt>Subtotal sebelum pajak & layanan</dt><dd>{{ formatMoney(quote.subtotal) }}</dd></div>
    <div><dt>Pajak (sudah termasuk)</dt><dd>{{ formatMoney(quote.taxes) }}</dd></div>
    <div><dt>Layanan (sudah termasuk)</dt><dd>{{ formatMoney(quote.service) }}</dd></div>
    <div class="total"><dt>Total final</dt><dd>{{ formatMoney(quote.total) }}</dd></div>
  </dl>
</template>
<style scoped>.breakdown { display: grid; gap: 8px; margin: 0; }.breakdown div { display: flex; justify-content: space-between; gap: 20px; }.breakdown dd { margin: 0; text-align: right; font-variant-numeric: tabular-nums; }.total { margin-top: 10px; padding-top: 12px; border-top: 2px solid currentColor; font-weight: 800; font-size: 1.15rem; }</style>
