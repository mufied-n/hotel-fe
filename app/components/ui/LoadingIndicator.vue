<script setup lang="ts">
withDefaults(defineProps<{ size?: 'small' | 'medium', label?: string }>(), { size: 'medium' })
</script>

<template>
  <span class="loading-indicator" :class="`loading-indicator--${size}`" aria-hidden="true" />
</template>
