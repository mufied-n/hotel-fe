<script setup lang="ts">
import type { PaymentCase } from '~/types/operations'
import { formatMoney, money } from '~/utils/money'
import { operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Kasus pembayaran' })
const client = useOperationsClient(); const cases = ref<PaymentCase[]>([]); const count = ref(0); const status = ref(''); const selected = ref<PaymentCase | null>(null); const action = ref('manual_adjustment'); const notes = ref(''); const loading = ref(false); const busy = ref(false); const error = ref(''); const notice = ref('')
function displayMoney(item: PaymentCase) { return item.currency === 'IDR' ? formatMoney(money(item.amountMinor, 0)) : `${item.currency} ${item.amountMinor}` }
async function load() {
  loading.value = true; error.value = ''; try { const result = await client.getFinanceCases(status.value || undefined, 50); cases.value = result.cases; count.value = result.total }
  catch (cause) { error.value = operationsMessage(cause, 'Kasus pembayaran belum dapat dimuat.') }
  finally { loading.value = false }
}
async function resolve() {
  if (!selected.value) return; busy.value = true; error.value = ''; try { await client.resolveCase(selected.value.id, action.value, notes.value); notice.value = 'Resolusi sample dicatat. Ini tidak mengeksekusi refund atau alokasi kamar.'; selected.value = null; await load() }
  catch (cause) { error.value = operationsMessage(cause, 'Resolusi belum dapat dicatat.') }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Payment cases</p><h1>Kasus pembayaran.</h1><div class="ops-subnav"><NuxtLink to="/staff/finance">Ringkasan</NuxtLink><NuxtLink to="/staff/finance/cases">Kasus</NuxtLink><NuxtLink to="/staff/finance/refunds">Refund</NuxtLink></div></header><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><form class="ops-toolbar" @submit.prevent="load"><div class="field"><label for="case-status">Status</label><select id="case-status" v-model="status"><option value="">Semua</option><option value="open">Open</option><option value="investigating">Investigating</option><option value="resolved">Resolved</option><option value="dismissed">Dismissed</option></select></div><BrandButton type="submit" :disabled="loading">Terapkan</BrandButton></form><p>{{ count }} baris pada response ini; bukan total seluruh database.</p>
<div class="ops-split"><section class="stack"><article v-for="item in cases" :key="item.id" class="ops-card"><div class="ops-card__top"><div><p class="eyebrow">{{ item.caseType }}</p><h3>{{ item.bookingId || 'Booking tidak terhubung' }}</h3></div><span class="badge">{{ item.status }}</span></div><strong>{{ displayMoney(item) }}</strong><p>{{ item.notes }}</p><small>Ref provider: {{ item.providerReference }}</small><BrandButton @click="selected = item; notes = item.notes">Tinjau resolusi</BrandButton></article><div v-if="!loading && !cases.length" class="ops-card">Tidak ada kasus pada filter ini.</div></section>
<form v-if="selected" class="panel stack" @submit.prevent="resolve"><p class="eyebrow">{{ selected.id }}</p><h2>Catat resolusi</h2><UiInlineAlert tone="info">Aksi ini hanya mencatat resolusi dalam kontrak saat ini. Refund atau realokasi harus dieksekusi melalui workflow terpisah.</UiInlineAlert><div class="field"><label for="case-action">Tindakan tercatat</label><select id="case-action" v-model="action"><option value="manual_adjustment">Penyesuaian manual</option><option value="refund">Refund dicatat</option><option value="reallocate">Realokasi dicatat</option><option value="dismiss">Tutup tanpa tindakan</option></select></div><div class="field"><label for="case-notes">Catatan</label><textarea id="case-notes" v-model="notes" rows="5" required /></div><div class="ops-actions"><BrandButton type="submit" dark :disabled="busy">Simpan simulasi</BrandButton><BrandButton @click="selected = null">Batal</BrandButton></div></form></div></div></template>
