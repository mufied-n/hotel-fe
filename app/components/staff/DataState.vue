<script setup lang="ts">
withDefaults(defineProps<{ loading?: boolean, empty?: boolean, error?: string, loadingLabel?: string, emptyLabel?: string }>(), { loadingLabel: 'Memuat data…', emptyLabel: 'Belum ada data.' })
defineEmits<{ retry: [] }>()
</script>
<template><div v-if="loading" class="staff-data-state" role="status" aria-live="polite"><UiLoadingIndicator />{{ loadingLabel }}</div><div v-else-if="error" class="staff-data-state staff-data-state--error" role="alert"><p>{{ error }}</p><BrandButton v-if="$attrs.onRetry" @click="$emit('retry')">Coba lagi</BrandButton></div><div v-else-if="empty" class="staff-data-state"><p>{{ emptyLabel }}</p><slot /></div><slot v-else name="content" /></template>
<style scoped>.staff-data-state { min-height: 150px; display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; border: 1px dashed #aaa; border-radius: 20px; padding: 24px; background: rgb(255 255 255 / 70%); color: var(--muted); text-align: center; font-weight: 800; }.staff-data-state p { margin: 0; }.staff-data-state--error { border-style: solid; border-color: #d6a19c; color: var(--danger); }</style>
