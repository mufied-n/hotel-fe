<script setup lang="ts">
const props = defineProps<{ serverTime: string, expiresAt: string }>()
const emit = defineEmits<{ elapsed: [] }>()
const { remainingSeconds } = useHoldTimer(toRef(props, 'serverTime'), toRef(props, 'expiresAt'), () => emit('elapsed'))
const formatted = computed(() => `${String(Math.floor(remainingSeconds.value / 60)).padStart(2, '0')}:${String(remainingSeconds.value % 60).padStart(2, '0')}`)
</script>
<template><p class="timer"><span>Sisa waktu demo</span><strong>{{ formatted }}</strong></p></template>
<style scoped>.timer { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-radius: 14px; background: #fff4eb; color: #532900; }.timer strong { font-size: 1.35rem; font-variant-numeric: tabular-nums; }</style>
