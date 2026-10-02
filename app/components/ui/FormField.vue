<script setup lang="ts">
defineProps<{ id: string, label: string, error?: string, hint?: string }>()
</script>
<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <slot :describedby="[hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ')" />
    <small v-if="hint" :id="`${id}-hint`" class="muted">{{ hint }}</small>
    <small v-if="error" :id="`${id}-error`" class="field-error">{{ error }}</small>
  </div>
</template>
