<script setup lang="ts">
import type { ReconciliationSummary } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Finance' })
const client = useOperationsClient(); const summary = ref<ReconciliationSummary | null>(null); const loading = ref(false); const error = ref('')
async function load() {
  loading.value = true; error.value = ''; try { summary.value = await client.getReconciliation() }
  catch (cause) { error.value = operationsMessage(cause, 'Ringkasan finance belum dapat dimuat.') }
  finally { loading.value = false }
}
onMounted(load)
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Reconciliation</p><h1>Finance.</h1><div class="ops-subnav"><NuxtLink to="/staff/finance">Ringkasan</NuxtLink><NuxtLink to="/staff/finance/cases">Kasus</NuxtLink><NuxtLink to="/staff/finance/refunds">Refund</NuxtLink></div></header><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><p v-if="loading" role="status">Memuat ringkasan…</p><template v-if="summary"><div class="ops-metrics"><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.totalSettledMinor)) }}</strong>Dana settled</div><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.totalRefundedMinor)) }}</strong>Refund</div><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.netCapturedMinor)) }}</strong>Net captured</div><div class="ops-metric"><strong>{{ summary.openCasesCount }}</strong>Kasus terbuka</div></div><UiInlineAlert tone="info">Angka ini ringkasan sample saat ini. API belum menyediakan rentang tanggal atau grafik historis.</UiInlineAlert><BrandButton to="/staff/finance/cases" dark>Tinjau kasus pembayaran</BrandButton></template></div></template>
