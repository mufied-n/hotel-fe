<script setup lang="ts">
import { roomVariants } from '~/data/rooms'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Inventory preview' })
const notice = ref(''); function apply() { notice.value = 'Perubahan allotment hanya disimulasikan; inventory live tidak berubah.' }
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Inventory controls</p><h1>Inventory.</h1><p class="muted">Preview allotment per room type dan tanggal.</p></header><UiInlineAlert tone="info">Mode sample. Availability publik tetap dibaca dari endpoint yang tersedia ketika bookingMode=api.</UiInlineAlert><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><form class="ops-toolbar" @submit.prevent="apply"><div class="field"><label for="inventory-room">Room type</label><select id="inventory-room"><option v-for="room in roomVariants" :key="room.id">{{ room.name }}</option></select></div><div class="field"><label for="inventory-date">Tanggal</label><input id="inventory-date" type="date" value="2026-10-04" required></div><div class="field"><label for="inventory-count">Allotment sample</label><input id="inventory-count" type="number" min="0" value="3" required></div><BrandButton type="submit">Terapkan simulasi</BrandButton></form></div></template>
