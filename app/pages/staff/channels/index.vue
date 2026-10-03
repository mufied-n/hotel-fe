<script setup lang="ts">
import { sampleChannels } from '~/data/management-scenarios'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Channel sync preview' })
const notice = ref(''); function retry(name: string) { notice.value = `Retry ${name} disimulasikan. Tidak ada pesan yang dikirim ke channel.` }
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Distribution" title="Channel sync" description="Status, antrean, dan recovery untuk integrasi OTA." /><UiInlineAlert tone="info">Data sample. Backend belum menyediakan monitoring dan retry channel.</UiInlineAlert><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><div class="ops-grid"><article v-for="channel in sampleChannels" :key="channel.id" class="ops-card"><div class="ops-card__top"><h2>{{ channel.name }}</h2><StaffStatusBadge :label="channel.status" :status="channel.status" /></div><strong>{{ channel.pendingUpdates }} pembaruan menunggu</strong><p>{{ channel.message }}</p><small>Sync terakhir {{ new Date(channel.lastSyncAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</small><BrandButton :disabled="channel.status === 'healthy'" @click="retry(channel.name)">Simulasikan retry</BrandButton></article></div></div></template>
