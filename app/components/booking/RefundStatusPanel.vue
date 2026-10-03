<script setup lang="ts">
import type { GuestRefundStatus } from '~~/shared/types/backend'
import { formatMoney, money } from '~/utils/money'

defineProps<{ state: 'idle' | 'loading' | 'ready' | 'error', refund: GuestRefundStatus | null, error?: string }>()
defineEmits<{ retry: [] }>()
const statusLabel: Record<string, string> = { pending: 'Sedang diproses', succeeded: 'Selesai', failed: 'Gagal' }
function amount(value: number, currency: string) { return currency === 'IDR' ? formatMoney(money(value, 0)) : `${currency} ${new Intl.NumberFormat('id-ID').format(value)}` }
</script>

<template>
  <section class="refund-panel stack" aria-labelledby="refund-heading">
    <h3 id="refund-heading">Status refund</h3>
    <p v-if="state === 'loading'" role="status">Memuat status refund…</p>
    <UiInlineAlert v-else-if="state === 'error'" tone="error" live>{{ error || 'Status refund belum dapat dimuat.' }} <button class="text-action" type="button" @click="$emit('retry')">Coba lagi</button></UiInlineAlert>
    <p v-else-if="state === 'ready' && !refund?.has_refund" class="muted">Belum ada refund yang tercatat untuk booking ini.</p>
    <div v-else-if="state === 'ready'" class="refund-list">
      <article v-for="item in refund?.refunds" :key="item.id" class="refund-row">
        <div><span class="badge">{{ statusLabel[item.status] || 'Status belum diketahui' }}</span><small>{{ item.created_at ? new Date(item.created_at).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Waktu belum tersedia' }}</small></div>
        <strong>{{ amount(item.amount_minor, item.currency) }}</strong><p>{{ item.reason || 'Alasan tidak dicantumkan.' }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.refund-panel { border-top: 1px solid var(--line); padding-top: 22px; }.refund-list { display: grid; gap: 14px; }.refund-row { display: grid; gap: 10px; padding: 16px; border: 1px solid var(--line); border-radius: 18px; background: var(--canvas); }.refund-row div { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; align-items: center; }.refund-row p { margin: 0; }.text-action { min-height: 0; margin-left: 8px; border: 0; padding: 0; background: transparent; color: inherit; font-weight: 800; text-decoration: underline; cursor: pointer; }
</style>
