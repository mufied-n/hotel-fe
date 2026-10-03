<script setup lang="ts">
defineProps<{ title: string }>()
</script>
<template><details class="accordion"><summary>{{ title }}</summary><div class="accordion-body"><slot /></div></details></template>
<style scoped>.accordion { border-block: 1px solid var(--line); }.accordion summary { min-height: 52px; display: flex; align-items: center; justify-content: space-between; gap: 16px; font-weight: 800; cursor: pointer; list-style: none; }.accordion summary::-webkit-details-marker { display: none; }.accordion summary::after { content: '↓'; transition: transform var(--motion-panel) var(--ease-standard); }.accordion[open] summary::after { transform: rotate(180deg); }.accordion-body { padding: 0 0 18px; animation: accordion-in var(--motion-panel) var(--ease-standard); } @keyframes accordion-in { from { opacity: 0; transform: translateY(-6px); } }</style>
