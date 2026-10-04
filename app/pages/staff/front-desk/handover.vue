<script setup lang="ts">
import type { HandoverNote, Shift } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { operationsMessage, shiftLabels } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Handover shift' })
const client = useOperationsClient(); const notes = ref<HandoverNote[]>([]); const total = ref(0); const offset = ref(0); const limit = 10; const loading = ref(false); const submitting = ref(false); const error = ref(''); const notice = ref('')
const apiMode = computed(() => useRuntimeConfig().public.operationsMode === 'api')
const form = reactive({ shift: 'morning' as Shift, cashFloatMinor: 0, pendingIssues: '', vipGuestNotes: '' })
async function load() {
  loading.value = true; error.value = ''; try { const result = await client.getHandovers(limit, offset.value); notes.value = result.notes; total.value = result.total }
  catch (cause) { error.value = operationsMessage(cause, 'Catatan handover belum dapat dimuat.') }
  finally { loading.value = false }
}
async function submit() {
  submitting.value = true; error.value = ''; notice.value = ''; try { await client.recordHandover({ ...form }); notice.value = 'Catatan sample ditambahkan.'; form.pendingIssues = ''; form.vipGuestNotes = ''; offset.value = 0; await load() }
  catch (cause) { error.value = operationsMessage(cause, 'Catatan belum dapat disimpan.') }
  finally { submitting.value = false }
}
onMounted(load)
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Shift logbook" title="Handover" description="Riwayat serah terima shift, cash float, dan pekerjaan yang masih perlu ditindaklanjuti."><template #nav><div class="ops-subnav"><NuxtLink to="/staff/front-desk">Roster</NuxtLink><NuxtLink to="/staff/front-desk/handover">Handover</NuxtLink><NuxtLink to="/staff/front-desk/verify">Verifikasi Voucher</NuxtLink></div></template></StaffPageHeader><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><div class="ops-split"><section class="stack"><h2>Riwayat</h2><p class="muted">{{ total }} catatan tersedia.</p><StaffDataState v-if="loading && !notes.length" loading loading-label="Memuat catatan…" /><StaffDataState v-else-if="!notes.length" empty empty-label="Belum ada catatan pada halaman ini." /><article v-for="note in notes" :key="note.id" class="ops-card"><div class="ops-card__top"><StaffStatusBadge :label="`Shift ${shiftLabels[note.shift]}`" /><time>{{ new Date(note.createdAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</time></div><strong>Cash float {{ formatMoney(rupiah(note.cashFloatMinor)) }}</strong><p><b>Pending:</b> {{ note.pendingIssues || 'Tidak ada' }}</p><p><b>VIP:</b> {{ note.vipGuestNotes || 'Tidak ada' }}</p></article><div class="ops-actions"><BrandButton :disabled="offset === 0" @click="offset = Math.max(0, offset - limit); load()">Sebelumnya</BrandButton><BrandButton :disabled="offset + limit >= total" @click="offset += limit; load()">Berikutnya</BrandButton></div></section>
<form class="panel stack" @submit.prevent="submit"><p class="eyebrow">Catatan baru</p><h2>Serah terima shift</h2><div class="field"><label for="shift">Shift</label><select id="shift" v-model="form.shift"><option v-for="(label, value) in shiftLabels" :key="value" :value="value">{{ label }}</option></select></div><div class="field"><label for="cash">Cash float (IDR)</label><input id="cash" v-model.number="form.cashFloatMinor" type="number" min="0" step="1" required /></div><div class="field"><label for="pending-issues">Masalah pending</label><textarea id="pending-issues" v-model="form.pendingIssues" rows="4" /></div><div class="field"><label for="vip-notes">Catatan VIP</label><textarea id="vip-notes" v-model="form.vipGuestNotes" rows="4" /></div><UiInlineAlert tone="info">{{ apiMode ? 'Riwayat live dapat dibaca. Penulisan handover masih dikunci.' : 'Isi minimal satu catatan. Submit sample hanya disimpan selama halaman aktif.' }}</UiInlineAlert><BrandButton type="submit" dark :loading="submitting" :disabled="apiMode">Simpan catatan sample</BrandButton></form></div></div></template>
