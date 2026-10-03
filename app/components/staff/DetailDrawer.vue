<script setup lang="ts">
const props = withDefaults(defineProps<{ open: boolean, title: string, eyebrow?: string, busy?: boolean }>(), { eyebrow: 'Detail' })
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const heading = ref<HTMLElement | null>(null)

watch(() => props.open, async (open) => {
  if (open && !dialog.value?.open) {
    dialog.value?.showModal()
    await nextTick()
    heading.value?.focus()
  }
  else if (!open && dialog.value?.open) dialog.value.close()
})
function close() { if (!props.busy) emit('close') }
</script>

<template><dialog ref="dialog" class="staff-drawer" :aria-labelledby="`${$attrs.id || 'staff-drawer'}-title`" @cancel.prevent="close" @close="open && close()"><div class="staff-drawer__header"><div><p class="eyebrow">{{ eyebrow }}</p><h2 :id="`${$attrs.id || 'staff-drawer'}-title`" ref="heading" tabindex="-1">{{ title }}</h2></div><button type="button" class="staff-drawer__close" :disabled="busy" aria-label="Tutup detail" @click="close">×</button></div><div class="staff-drawer__body"><slot /></div><div v-if="$slots.actions" class="staff-drawer__actions"><slot name="actions" /></div></dialog></template>

<style scoped>.staff-drawer { width: min(520px, 100%); max-width: none; height: 100dvh; max-height: none; margin: 0 0 0 auto; border: 0; padding: 0; background: #f8f5ef; box-shadow: -22px 0 60px rgb(0 0 0 / 24%); }.staff-drawer[open] { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; animation: drawer-in var(--motion-panel) var(--ease-emphasized); }.staff-drawer::backdrop { background: rgb(0 0 0 / 58%); animation: backdrop-in var(--motion-panel) var(--ease-standard); }.staff-drawer__header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 24px; border-bottom: 1px solid var(--line); background: #fff; }.staff-drawer__header h2, .staff-drawer__header p { margin: 0; }.staff-drawer__header h2 { font-size: clamp(1.8rem, 5vw, 3rem); }.staff-drawer__close { width: 44px; height: 44px; flex: 0 0 auto; border: 1px solid var(--ink); border-radius: 50%; background: #fff; color: #000; font-size: 1.5rem; }.staff-drawer__body { overflow-y: auto; padding: 24px; }.staff-drawer__actions { display: flex; flex-wrap: wrap; gap: 10px; padding: 18px 24px; border-top: 1px solid var(--line); background: #fff; }@keyframes drawer-in { from { opacity: 0; transform: translateX(28px); } }@keyframes backdrop-in { from { opacity: 0; } }@media (prefers-reduced-motion: reduce) { .staff-drawer[open], .staff-drawer::backdrop { animation: none; } }</style>
