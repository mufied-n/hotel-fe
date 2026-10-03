<script setup lang="ts">
const props = withDefaults(defineProps<{ open: boolean, title: string, eyebrow?: string, busy?: boolean }>(), { eyebrow: 'Konfirmasi' })
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const heading = ref<HTMLElement | null>(null)
watch(() => props.open, async (open) => {
  if (open && !dialog.value?.open) { dialog.value?.showModal(); await nextTick(); heading.value?.focus() }
  else if (!open && dialog.value?.open) dialog.value.close()
})
function close() { if (!props.busy) emit('close') }
</script>
<template><dialog ref="dialog" class="staff-action-dialog" :aria-labelledby="`${$attrs.id || 'staff-action-dialog'}-title`" @cancel.prevent="close" @close="open && close()"><div class="stack"><p class="eyebrow">{{ eyebrow }}</p><h2 :id="`${$attrs.id || 'staff-action-dialog'}-title`" ref="heading" tabindex="-1">{{ title }}</h2><slot /><div class="staff-action-dialog__actions"><slot name="actions" /></div></div></dialog></template>
<style scoped>.staff-action-dialog { width: min(600px, calc(100% - 28px)); border: 2px solid #000; border-radius: 26px; padding: clamp(24px, 5vw, 42px); background: #fff; box-shadow: var(--shadow); }.staff-action-dialog[open] { animation: staff-dialog-in var(--motion-panel) var(--ease-emphasized); }.staff-action-dialog::backdrop { background: rgb(0 0 0 / 65%); animation: staff-backdrop-in var(--motion-panel) var(--ease-standard); }.staff-action-dialog h2, .staff-action-dialog p { margin-top: 0; }.staff-action-dialog h2 { font-size: clamp(2rem, 6vw, 3.6rem); }.staff-action-dialog__actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 8px; }@keyframes staff-dialog-in { from { opacity: 0; transform: translateY(12px) scale(.98); } }@keyframes staff-backdrop-in { from { opacity: 0; } }@media (prefers-reduced-motion: reduce) { .staff-action-dialog[open], .staff-action-dialog::backdrop { animation: none; } }</style>
