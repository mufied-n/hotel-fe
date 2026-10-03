<script setup lang="ts">
defineProps<{ loading?: boolean, stale?: boolean, lastSuccess?: Date | null }>()
</script>
<template><p class="freshness" :class="{ 'freshness--stale': stale }" role="status"><UiLoadingIndicator v-if="loading" size="small" /><span v-if="loading">Memperbarui data…</span><span v-else-if="stale">Data terakhir tetap ditampilkan; pembaruan gagal.</span><span v-else-if="lastSuccess">Terakhir diperbarui {{ lastSuccess.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }) }} WIB</span></p></template>
<style scoped>.freshness { min-height: 24px; display: flex; align-items: center; gap: 8px; margin: 0; color: var(--muted); font-size: .86rem; font-weight: 800; }.freshness--stale { color: var(--danger); }</style>
