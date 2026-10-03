<script setup lang="ts">
import { sampleDeliveries } from '~/data/management-scenarios'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Notification delivery preview' })
const notice = ref(''); function retry(id: string) { notice.value = `Retry ${id} disimulasikan. Pesan tidak dikirim.` }
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Delivery operations" title="Notifications" description="Riwayat delivery, jumlah percobaan, dan recovery per channel." /><UiInlineAlert tone="info">Data sample dan penerima dimask. Backend delivery/retry belum tersedia.</UiInlineAlert><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><div class="ops-grid"><article v-for="item in sampleDeliveries" :key="item.id" class="ops-card"><div class="ops-card__top"><div><p class="eyebrow">{{ item.channel }}</p><h3>{{ item.template }}</h3></div><StaffStatusBadge :label="item.status" :status="item.status" /></div><p>{{ item.recipient }} · {{ item.attempts }} percobaan</p><small>{{ new Date(item.updatedAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</small><BrandButton v-if="item.status !== 'delivered'" @click="retry(item.id)">Simulasikan retry</BrandButton></article></div></div></template>
