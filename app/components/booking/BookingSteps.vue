<script setup lang="ts">
defineProps<{ current: 1 | 2 | 3 | 4 }>()
</script>
<template>
  <ol class="steps" aria-label="Tahap booking">
    <li v-for="(label, index) in ['Pilih kamar', 'Detail tamu', 'Tinjau & bayar', 'Status']" :key="label" :class="{ active: index + 1 === current, done: index + 1 < current }" :aria-current="index + 1 === current ? 'step' : undefined"><span>{{ index + 1 }}</span>{{ label }}</li>
  </ol>
</template>
<style scoped>
.steps { display: grid; grid-template-columns: repeat(4, 1fr); list-style: none; padding: 0; margin: 0 0 40px; gap: 8px; }.steps li { font-size: .72rem; color: var(--muted); }.steps span { width: 28px; height: 28px; display: grid; place-items: center; margin-bottom: 6px; border: 1px solid #777; border-radius: 50%; }.steps .active { color: #000; font-weight: 800; }.steps .active span, .steps .done span { background: var(--brand); border-color: #000; color: #000; }
@media (max-width: 600px) { .steps li { font-size: 0; }.steps li span { font-size: .72rem; } }
</style>
