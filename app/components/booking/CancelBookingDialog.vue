<script setup lang="ts">
const props = defineProps<{ open: boolean, reference: string, policy?: string, pending?: boolean }>()
const emit = defineEmits<{ close: [], confirm: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
watch(() => props.open, (open) => { if (open && !dialog.value?.open) dialog.value?.showModal(); if (!open && dialog.value?.open) dialog.value.close() })
function close() { emit('close') }
function confirm() { emit('confirm') }
</script>

<template><dialog ref="dialog" class="cancel-dialog" aria-labelledby="cancel-title" @cancel.prevent="close" @close="open && close()"><form method="dialog" class="stack" @submit.prevent><p class="eyebrow">Booking · {{ reference }}</p><h2 id="cancel-title">Batalkan booking?</h2><p>{{ policy || 'Kebijakan dan batas pembatalan akan diperiksa kembali oleh server.' }}</p><UiInlineAlert tone="info">Booking yang dibatalkan tidak otomatis berarti dana sudah direfund. Status refund diperiksa terpisah.</UiInlineAlert><div class="ops-actions"><BrandButton dark :loading="pending" loading-label="Membatalkan…" @click="confirm">Ya, batalkan booking</BrandButton><BrandButton :disabled="pending" @click="close">Kembali</BrandButton></div></form></dialog></template>
<style scoped>.cancel-dialog { width: min(560px, calc(100% - 32px)); border: 2px solid #000; border-radius: 28px; padding: clamp(24px, 5vw, 42px); box-shadow: var(--shadow); }.cancel-dialog[open] { animation: dialog-in var(--motion-panel) var(--ease-emphasized); }.cancel-dialog::backdrop { background: rgb(0 0 0 / 65%); animation: backdrop-in var(--motion-panel) var(--ease-standard); }.cancel-dialog h2 { font-size: clamp(2rem, 7vw, 4rem); } @keyframes dialog-in { from { opacity: 0; transform: translateY(14px) scale(.98); } } @keyframes backdrop-in { from { opacity: 0; } }</style>
