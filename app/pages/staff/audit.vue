<script setup lang="ts">
import { sampleAudits } from '~/data/management-scenarios'

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Audit activity' })
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Identity & controls</p><h1>Audit activity.</h1><p class="muted">Snapshot sample untuk menilai kebutuhan actor, target, waktu, dan hasil.</p></header><UiInlineAlert tone="info">Audit log live belum terintegrasi.</UiInlineAlert><div class="ops-grid"><article v-for="item in sampleAudits" :key="item.id" class="ops-card"><div class="ops-card__top"><strong>{{ item.action }}</strong><span class="badge">{{ item.result }}</span></div><p>{{ item.actor }} · {{ item.role }}</p><p>Target: {{ item.target }}</p><time>{{ new Date(item.occurredAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</time></article></div></div></template>
