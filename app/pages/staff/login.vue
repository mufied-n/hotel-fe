<script setup lang="ts">
import type { StaffPreviewRole } from '~/types/management'
import { staffRoleLabels } from '~/composables/useStaffPreview'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Staff preview login' })
const selected = ref<StaffPreviewRole>('gm_admin'); const preview = useStaffPreview()
async function enter() { preview.enter(selected.value); await navigateTo('/staff/front-desk') }
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Identity preview</p><h1>Masuk workspace staff.</h1><p class="muted">Pilih peran untuk memeriksa navigasi dan permission state. Ini tidak membuat sesi backend.</p></header><UiInlineAlert tone="info">Trusted staff authentication belum tersedia. Seluruh identitas dan aktivitas di halaman ini adalah data sample.</UiInlineAlert><form class="panel stack" @submit.prevent="enter"><div class="field"><label for="preview-role">Peran sample</label><select id="preview-role" v-model="selected"><option v-for="(label, value) in staffRoleLabels" :key="value" :value="value">{{ label }}</option></select></div><BrandButton type="submit" dark>Masuk preview</BrandButton></form></div></template>
