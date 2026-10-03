<script setup lang="ts">
import { sampleAudits } from '~/data/management-scenarios'

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Audit activity' })
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="Identity & controls" title="Audit activity" description="Actor, target, waktu, dan hasil perubahan operasional." /><UiInlineAlert tone="info">Audit log live belum terintegrasi. Data berikut hanya memperagakan hierarchy dan filter detail.</UiInlineAlert><div class="ops-grid"><article v-for="item in sampleAudits" :key="item.id" class="ops-card"><div class="ops-card__top"><strong>{{ item.action }}</strong><StaffStatusBadge :label="item.result" :status="item.result" /></div><p>{{ item.actor }} · {{ item.role }}</p><p>Target: {{ item.target }}</p><time>{{ new Date(item.occurredAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</time></article></div></div></template>
