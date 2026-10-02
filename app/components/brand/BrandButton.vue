<script setup lang="ts">
withDefaults(defineProps<{ to?: string, dark?: boolean, type?: 'button' | 'submit', disabled?: boolean }>(), { type: 'button' })
</script>
<template>
  <NuxtLink v-if="to" :to="to" class="button" :class="{ 'button--dark': dark }"><slot /></NuxtLink>
  <button v-else :type="type" class="button" :class="{ 'button--dark': dark }" :disabled="disabled"><slot /></button>
</template>
