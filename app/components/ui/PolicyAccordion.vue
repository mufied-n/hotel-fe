<script setup lang="ts">
defineProps<{ title: string }>()
</script>
<template><details class="accordion"><summary>{{ title }}</summary><div class="accordion-body"><slot /></div></details></template>
<style scoped>.accordion { border-block: 1px solid var(--line); }.accordion summary { min-height: 52px; display: flex; align-items: center; font-weight: 800; cursor: pointer; }.accordion-body { padding: 0 0 18px; }</style>
