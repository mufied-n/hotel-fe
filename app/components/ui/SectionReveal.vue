<script setup lang="ts">
const root = ref<HTMLElement | null>(null)
useSectionReveal(root)
</script>

<template><div ref="root" class="section-reveal"><slot /></div></template>
