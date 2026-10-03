<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: string[], resultLabel?: string, busy?: boolean }>(), { active: () => [] })
defineEmits<{ apply: [], reset: [] }>()
const open = ref(false)
const regionId = useId()
const hasActive = computed(() => props.active.length > 0)
</script>

<template>
  <section class="staff-filter" aria-label="Filter data">
    <div class="staff-filter__summary">
      <button class="staff-filter__toggle" type="button" :aria-expanded="open" :aria-controls="regionId" @click="open = !open">{{ open ? 'Sembunyikan filter' : 'Tampilkan filter' }}<span aria-hidden="true">{{ open ? '−' : '+' }}</span></button>
      <div v-if="hasActive" class="staff-filter__chips" aria-label="Filter aktif"><span v-for="label in active" :key="label">{{ label }}</span></div>
      <span v-else class="muted">Tanpa filter tambahan</span>
      <small v-if="resultLabel">{{ resultLabel }}</small>
    </div>
    <form :id="regionId" class="ops-toolbar staff-filter__fields" :class="{ 'staff-filter__fields--open': open }" @submit.prevent="$emit('apply')">
      <slot />
      <div class="staff-filter__actions"><BrandButton type="submit" :loading="busy" loading-label="Menerapkan…">Terapkan</BrandButton><BrandButton type="button" :disabled="!hasActive || busy" @click="$emit('reset')">Reset</BrandButton></div>
    </form>
  </section>
</template>

<style scoped>
.staff-filter { display: grid; gap: 12px; }.staff-filter__summary { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }.staff-filter__toggle { display: none; min-height: 44px; align-items: center; justify-content: space-between; gap: 16px; width: 100%; border: 1px solid var(--line); border-radius: 14px; padding: 10px 14px; background: #fff; color: var(--ink); font-weight: 900; }.staff-filter__chips { display: flex; flex-wrap: wrap; gap: 6px; }.staff-filter__chips span { border: 1px solid var(--line); border-radius: 999px; padding: 5px 10px; background: var(--soft); font-size: .82rem; font-weight: 800; }.staff-filter__summary small { margin-left: auto; }.staff-filter__actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: end; }
@media (max-width: 719px) { .staff-filter__toggle { display: flex; }.staff-filter__fields { display: none; }.staff-filter__fields--open { display: flex; }.staff-filter__summary small { width: 100%; margin-left: 0; } }
</style>
