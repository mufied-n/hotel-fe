<script setup lang="ts">
import type { RefundResult } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Refund finance' })
const client = useOperationsClient(); const form = reactive({ bookingId: '', amountMinor: 0, reason: '' }); const review = ref(false); const busy = ref(false); const error = ref(''); const result = ref<RefundResult | null>(null)
const apiMode = computed(() => useRuntimeConfig().public.operationsMode === 'api')
async function submit() {
  busy.value = true; error.value = ''; result.value = null; try { result.value = await client.createRefund({ ...form }); review.value = false }
  catch (cause) { error.value = operationsMessage(cause, 'Refund belum dapat diproses.') }
  finally { busy.value = false }
}
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Gateway refund" title="Refund review" description="Nominal, booking, alasan, dan status intent tetap terlihat sebelum dan sesudah confirmation."><template #nav><div class="ops-subnav"><NuxtLink to="/staff/finance">Ringkasan</NuxtLink><NuxtLink to="/staff/finance/cases">Kasus</NuxtLink><NuxtLink to="/staff/finance/refunds">Refund</NuxtLink></div></template></StaffPageHeader><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><UiInlineAlert v-if="result" tone="info" live>Intent sample {{ result.referenceId }} berstatus {{ result.status }}. Status pending belum berarti dana selesai dikembalikan.</UiInlineAlert><div class="ops-split"><form class="panel stack" @submit.prevent="review = true"><h2>Buat refund sample</h2><div class="field"><label for="refund-booking">Booking ID</label><input id="refund-booking" v-model.trim="form.bookingId" required /></div><div class="field"><label for="refund-amount">Nominal IDR</label><input id="refund-amount" v-model.number="form.amountMinor" type="number" min="1" step="1" required /></div><div class="field"><label for="refund-reason">Alasan</label><textarea id="refund-reason" v-model="form.reason" minlength="5" rows="4" required /></div><UiInlineAlert tone="info">Saldo refundable dan lookup intent staff belum tersedia. Refund live dikunci sampai recovery, transaksi, dan idempotensi terverifikasi.</UiInlineAlert><BrandButton type="submit" dark :disabled="apiMode">Tinjau refund sample</BrandButton></form>
<section v-if="review" class="panel stack"><p class="eyebrow">Review dampak</p><h2>{{ formatMoney(rupiah(form.amountMinor)) }}</h2><p>Booking {{ form.bookingId }}</p><p>{{ form.reason }}</p><UiInlineAlert tone="error">Tindakan ini dapat menggerakkan uang. Timeout tidak boleh diulang otomatis.</UiInlineAlert><div class="ops-actions"><BrandButton :loading="busy" loading-label="Memproses…" @click="submit">Konfirmasi simulasi</BrandButton><BrandButton @click="review = false">Kembali</BrandButton></div></section></div></div></template>
