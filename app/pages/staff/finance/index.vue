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
<template><div class="container ops-page"><StaffPageHeader eyebrow="Reconciliation" title="Finance" description="Pantau settlement, refund, dan kasus pembayaran dari satu ringkasan."><template #nav><div class="ops-subnav"><NuxtLink to="/staff/finance">Ringkasan</NuxtLink><NuxtLink to="/staff/finance/cases">Kasus</NuxtLink><NuxtLink to="/staff/finance/refunds">Refund</NuxtLink></div></template><template #actions><BrandButton :loading="loading" loading-label="Memperbarui…" @click="load">Perbarui</BrandButton></template></StaffPageHeader><UiInlineAlert v-if="error && summary" tone="error" live>{{ error }}</UiInlineAlert><StaffDataState v-if="!summary" :loading="loading" :error="error" loading-label="Memuat ringkasan…" @retry="load" /><template v-if="summary"><div class="ops-metrics"><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.totalSettledMinor)) }}</strong>Dana settled</div><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.totalRefundedMinor)) }}</strong>Refund</div><div class="ops-metric"><strong>{{ formatMoney(rupiah(summary.netCapturedMinor)) }}</strong>Net captured</div><div class="ops-metric"><strong>{{ summary.openCasesCount }}</strong>Kasus terbuka</div></div><UiInlineAlert tone="info">Ringkasan ini belum memiliki filter periode. Angka yang tampil mengikuti agregasi backend saat refresh terakhir.</UiInlineAlert><BrandButton to="/staff/finance/cases" dark>Tinjau kasus pembayaran</BrandButton></template></div></template>
