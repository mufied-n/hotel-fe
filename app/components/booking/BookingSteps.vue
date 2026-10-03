<script setup lang="ts">
defineProps<{ current: 1 | 2 | 3 | 4 }>()
</script>
<template>
  <p class="mobile-step"><strong>Tahap {{ current }} dari 4</strong> · {{ ['Pilih kamar', 'Detail tamu', 'Tinjau & bayar', 'Status'][current - 1] }}</p>
  <ol class="steps" aria-label="Tahap booking">
    <li v-for="(label, index) in ['Pilih kamar', 'Detail tamu', 'Tinjau & bayar', 'Status']" :key="label" :class="{ active: index + 1 === current, done: index + 1 < current }" :aria-current="index + 1 === current ? 'step' : undefined"><span>{{ index + 1 }}</span>{{ label }}</li>
  </ol>
</template>
<style scoped>
.mobile-step { display: none; margin-bottom: 12px; font-size: .82rem; }
.steps { display: grid; grid-template-columns: repeat(4, 1fr); list-style: none; padding: 0; margin: 0 0 44px; gap: 8px; }.steps li { position: relative; display: grid; gap: 7px; font-size: .72rem; color: var(--muted); }.steps li::after { content: ''; position: absolute; top: 14px; left: 34px; right: 2px; height: 1px; background: var(--line); }.steps li:last-child::after { display: none; }.steps span { width: 29px; height: 29px; display: grid; place-items: center; border: 1px solid #777; border-radius: 50%; background: #fff; z-index: 1; }.steps .active { color: #000; font-weight: 900; }.steps .active span, .steps .done span { background: var(--brand); border-color: #000; color: #000; }
@media (max-width: 600px) { .mobile-step { display: block; }.steps { margin-bottom: 28px; }.steps li { font-size: 0; }.steps li span { font-size: .72rem; } }
</style>
