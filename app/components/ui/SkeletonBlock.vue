<script setup lang="ts">
withDefaults(defineProps<{ variant?: 'line' | 'media' | 'card' }>(), { variant: 'line' })
</script>

<template><span class="skeleton" :class="`skeleton--${variant}`" aria-hidden="true" /></template>
