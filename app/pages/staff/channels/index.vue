<script setup lang="ts">
import { sampleChannels } from '~/data/management-scenarios'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Channel sync preview' })
const notice = ref(''); function retry(name: string) { notice.value = `Retry ${name} disimulasikan. Tidak ada pesan yang dikirim ke channel.` }
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Distribution</p><h1>Channel sync.</h1><p class="muted">Status, antrean, dan recovery untuk integrasi OTA.</p></header><UiInlineAlert tone="info">Data sample. Backend belum menyediakan monitoring dan retry channel.</UiInlineAlert><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><div class="ops-grid"><article v-for="channel in sampleChannels" :key="channel.id" class="ops-card"><div class="ops-card__top"><h2>{{ channel.name }}</h2><span class="badge">{{ channel.status }}</span></div><strong>{{ channel.pendingUpdates }} pembaruan menunggu</strong><p>{{ channel.message }}</p><small>Sync terakhir {{ new Date(channel.lastSyncAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</small><BrandButton :disabled="channel.status === 'healthy'" @click="retry(channel.name)">Simulasikan retry</BrandButton></article></div></div></template>
