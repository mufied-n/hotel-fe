<script setup lang="ts">
import type { ExtendStayResult, MoveReason, RoomMove, RoomMoveResult, RoomBoard } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { cleanlinessLabels, operationsMessage, reasonLabels } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Stay operations' })
const route = useRoute(); const client = useOperationsClient(); const bookingId = computed(() => String(route.params.id)); const history = ref<RoomMove[]>([]); const board = ref<RoomBoard | null>(null); const loading = ref(false); const busy = ref(false); const error = ref(''); const moveResult = ref<RoomMoveResult | null>(null); const extensionResult = ref<ExtendStayResult | null>(null)
const move = reactive({ targetRoomNumber: '', reasonCategory: 'guest_request' as MoveReason, notes: '' }); const extension = reactive({ additionalNights: 1, paymentMethod: 'unconfirmed' })
const candidates = computed(() => board.value?.rooms.filter(room => room.status === 'inspected') || [])
async function load() {
  loading.value = true; error.value = ''; try { const [moves, rooms] = await Promise.all([client.getRoomMoves(bookingId.value), client.getRoomBoard({ status: 'inspected' })]); history.value = moves; board.value = rooms }
  catch (cause) { error.value = operationsMessage(cause, 'Data stay operations belum dapat dimuat.') }
  finally { loading.value = false }
}
async function submitMove() {
  busy.value = true; error.value = ''; moveResult.value = null; try { moveResult.value = await client.moveRoom(bookingId.value, { ...move }); await load() }
  catch (cause) { error.value = operationsMessage(cause, 'Kamar belum dapat dipindahkan.') }
  finally { busy.value = false }
}
async function submitExtension() {
  busy.value = true; error.value = ''; extensionResult.value = null; try { extensionResult.value = await client.extendStay(bookingId.value, { ...extension }) }
  catch (cause) { error.value = operationsMessage(cause, 'Masa inap belum dapat diperpanjang.') }
  finally { busy.value = false }
}
onMounted(load)
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Booking · {{ bookingId }}</p><h1>Stay operations.</h1><p class="muted">Preview sample untuk satu kamar. Perubahan live dan pembayaran perpanjangan tetap dikunci.</p></header><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><UiInlineAlert v-if="moveResult" tone="info" live>{{ moveResult.message }} {{ moveResult.previousRoomNumber }} → {{ moveResult.newRoomNumber }}.</UiInlineAlert><UiInlineAlert v-if="extensionResult" tone="info" live>Simulasi checkout berubah {{ extensionResult.previousCheckOut }} → {{ extensionResult.newCheckOut }}. Tambahan sample {{ formatMoney(rupiah(extensionResult.additionalAmountMinor)) }}; status pembayaran belum dikonfirmasi.</UiInlineAlert>
<div class="ops-split"><section class="stack"><form class="panel stack" @submit.prevent="submitMove"><p class="eyebrow">Room move</p><h2>Pindahkan kamar</h2><div class="field"><label for="target-room">Kamar tujuan yang sudah diinspeksi</label><select id="target-room" v-model="move.targetRoomNumber" required><option value="" disabled>Pilih kamar</option><option v-for="room in candidates" :key="room.roomNumber" :value="room.roomNumber">{{ room.roomNumber }} · {{ room.roomTypeName }} · {{ cleanlinessLabels[room.status] }}</option></select></div><div class="field"><label for="move-reason">Alasan</label><select id="move-reason" v-model="move.reasonCategory"><option v-for="(label, value) in reasonLabels" :key="value" :value="value">{{ label }}</option></select></div><div class="field"><label for="move-notes">Catatan</label><textarea id="move-notes" v-model="move.notes" rows="3" /></div><BrandButton type="submit" dark :disabled="busy || loading">Simulasikan room move</BrandButton></form>
<form class="panel stack" @submit.prevent="submitExtension"><p class="eyebrow">Extension</p><h2>Perpanjang menginap</h2><div class="field"><label for="nights">Tambahan malam</label><input id="nights" v-model.number="extension.additionalNights" type="number" min="1" max="30" required /></div><UiInlineAlert tone="info">Backend belum menyediakan preview harga. Nominal sample baru muncul setelah simulasi dan tidak berarti pembayaran tercatat.</UiInlineAlert><BrandButton type="submit" :disabled="busy">Simulasikan perpanjangan</BrandButton></form></section>
<section class="stack"><h2>Riwayat perpindahan</h2><div v-if="loading" role="status">Memuat riwayat…</div><div v-else-if="!history.length" class="ops-card">Belum ada perpindahan kamar.</div><article v-for="item in history" :key="item.id" class="ops-card"><div class="ops-card__top"><strong>{{ item.fromRoomNumber }} → {{ item.toRoomNumber }}</strong><span class="badge">{{ reasonLabels[item.reasonCategory] || item.reasonCategory }}</span></div><p>{{ item.moveDate }} · {{ item.notes || 'Tanpa catatan' }}</p></article></section></div></div></template>
