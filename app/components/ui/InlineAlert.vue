<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'info' | 'error', live?: boolean }>(), { tone: 'info', live: false })
</script>
<template><div class="alert" :class="`alert--${tone}`" :role="tone === 'error' ? 'alert' : 'status'" :aria-live="live ? 'polite' : undefined"><slot /></div></template>
