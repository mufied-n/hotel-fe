<script setup lang="ts">
import { demoScenarios } from '~/data/scenarios'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const isDev = import.meta.dev
</script>
<template><aside v-if="isDev" class="dev-panel"><label>Scenario demo <select :value="modelValue" @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"><option v-for="scenario in demoScenarios" :key="scenario" :value="scenario">{{ scenario }}</option></select></label></aside></template>
<style scoped>.dev-panel { margin-block: 20px; padding: 12px; border: 2px dashed #777; border-radius: 12px; }.dev-panel label { display: flex; gap: 10px; align-items: center; font-weight: 700; }.dev-panel select { border-radius: 8px; padding: 5px; }</style>
