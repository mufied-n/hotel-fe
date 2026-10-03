<script setup lang="ts">
import type { CleanlinessStatus, OperationalRoom, RoomBoard } from '~/types/operations'
import { cleanlinessLabels, jakartaDate, operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Housekeeping' })
const client = useOperationsClient()
const board = ref<RoomBoard | null>(null); const loading = ref(false); const error = ref(''); const notice = ref('')
const filters = reactive({ floor: 0, status: '', roomTypeId: '' })
const selected = ref<OperationalRoom | null>(null); const nextStatus = ref<CleanlinessStatus>('cleaning'); const notes = ref(''); const submitting = ref(false)
const ooo = reactive({ roomNumber: '', startDate: jakartaDate(), endDate: '', reason: '' })
const statuses = Object.keys(cleanlinessLabels) as CleanlinessStatus[]

async function load() {
  loading.value = true; error.value = ''; try { board.value = await client.getRoomBoard({ floor: filters.floor || undefined, status: filters.status || undefined, roomTypeId: filters.roomTypeId || undefined }) }
  catch (cause) { error.value = operationsMessage(cause, 'Board kamar belum dapat dimuat.') }
  finally { loading.value = false }
}
function edit(room: OperationalRoom) { selected.value = room; nextStatus.value = room.status === 'vacant_dirty' ? 'cleaning' : room.status === 'cleaning' ? 'vacant_clean' : room.status === 'vacant_clean' ? 'inspected' : room.status; notes.value = room.maintenanceNotes }
async function updateStatus() {
  if (!selected.value) return; submitting.value = true; error.value = ''; try { await client.updateRoomStatus(selected.value.roomNumber, nextStatus.value, notes.value); notice.value = `Simulasi status kamar ${selected.value.roomNumber} diperbarui.`; selected.value = null; await load() }
  catch (cause) { error.value = operationsMessage(cause, 'Status kamar tidak dapat diperbarui.') }
  finally { submitting.value = false }
}
async function markOOO() {
  submitting.value = true; error.value = ''; try { await client.markOutOfOrder(ooo.roomNumber, { startDate: ooo.startDate, endDate: ooo.endDate, reason: ooo.reason }); notice.value = `Simulasi kamar ${ooo.roomNumber} ditandai rusak berat.`; ooo.roomNumber = ''; ooo.reason = ''; await load() }
  catch (cause) { error.value = operationsMessage(cause, 'Kamar tidak dapat ditandai rusak berat.') }
  finally { submitting.value = false }
}
onMounted(load)
</script>

<template><div class="container ops-page"><header><p class="eyebrow">Operasional kamar</p><h1>Housekeeping board.</h1><p class="muted">Ringkasan mengikuti filter aktif. “Bersih” masih memerlukan inspeksi sebelum check-in.</p></header>
  <UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>
  <form class="ops-toolbar" @submit.prevent="load"><div class="field"><label for="floor">Lantai</label><input id="floor" v-model.number="filters.floor" type="number" min="0" placeholder="Semua" /></div><div class="field"><label for="hk-status">Status</label><select id="hk-status" v-model="filters.status"><option value="">Semua</option><option v-for="status in statuses" :key="status" :value="status">{{ cleanlinessLabels[status] }}</option></select></div><div class="field"><label for="room-type">ID tipe kamar</label><input id="room-type" v-model.trim="filters.roomTypeId" /></div><BrandButton type="submit" :disabled="loading">{{ loading ? 'Memuat…' : 'Terapkan filter' }}</BrandButton></form>
  <div v-if="board" class="ops-metrics"><div v-for="status in statuses" :key="status" class="ops-metric"><strong>{{ board.summary[status] || 0 }}</strong>{{ cleanlinessLabels[status] }}</div></div><p v-if="board" role="status">{{ board.totalRooms }} kamar pada hasil filter.</p>
  <div class="ops-split"><section><div v-if="loading" role="status">Memuat kamar…</div><div v-else-if="board && !board.rooms.length" class="ops-card">Tidak ada kamar pada filter ini.</div><div v-else class="ops-grid ops-grid--rooms"><article v-for="room in board?.rooms" :key="room.roomNumber" class="ops-card"><div class="ops-card__top"><div><p class="eyebrow">Kamar {{ room.roomNumber }} · L{{ room.floor }}</p><h3>{{ room.roomTypeName }}</h3></div><span class="badge">{{ cleanlinessLabels[room.status] }}</span></div><p v-if="room.guestName">Tamu: {{ room.guestName }}</p><p v-if="room.maintenanceNotes" class="muted">{{ room.maintenanceNotes }}</p><small>Diperbarui {{ new Date(room.updatedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</small><BrandButton @click="edit(room)">Ubah status</BrandButton></article></div></section>
    <aside class="stack"><form v-if="selected" class="panel stack" @submit.prevent="updateStatus"><p class="eyebrow">Kamar {{ selected.roomNumber }}</p><h2>Ubah status</h2><div class="field"><label for="next-status">Status berikutnya</label><select id="next-status" v-model="nextStatus"><option v-for="status in statuses" :key="status" :value="status">{{ cleanlinessLabels[status] }}</option></select></div><div class="field"><label for="status-notes">Catatan</label><textarea id="status-notes" v-model="notes" rows="3" /></div><div class="ops-actions"><BrandButton type="submit" dark :disabled="submitting">Simpan simulasi</BrandButton><BrandButton @click="selected = null">Batal</BrandButton></div></form>
      <form class="panel stack" @submit.prevent="markOOO"><p class="eyebrow">Khusus GM</p><h2>Rusak berat</h2><UiInlineAlert tone="info">Preview sample. Mutasi live tetap dikunci.</UiInlineAlert><div class="field"><label for="ooo-room">Nomor kamar</label><input id="ooo-room" v-model.trim="ooo.roomNumber" required /></div><div class="two-col"><div class="field"><label for="ooo-start">Mulai</label><input id="ooo-start" v-model="ooo.startDate" type="date" required /></div><div class="field"><label for="ooo-end">Selesai (eksklusif)</label><input id="ooo-end" v-model="ooo.endDate" type="date" required /></div></div><div class="field"><label for="ooo-reason">Alasan</label><textarea id="ooo-reason" v-model="ooo.reason" required rows="3" /></div><BrandButton type="submit" :disabled="submitting">Simpan simulasi OOO</BrandButton></form></aside>
  </div></div></template>
