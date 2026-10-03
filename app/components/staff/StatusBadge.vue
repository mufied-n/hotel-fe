<script setup lang="ts">
const props = defineProps<{ label: string, status?: string }>()
const tone = computed(() => {
  if (['failed', 'out_of_order', 'denied', 'expired'].includes(props.status || '')) return 'danger'
  if (['attention', 'dirty', 'vacant_dirty', 'pending', 'investigating'].includes(props.status || '')) return 'warning'
  if (['healthy', 'delivered', 'inspected', 'resolved', 'succeeded'].includes(props.status || '')) return 'success'
  return 'neutral'
})
</script>
<template><span class="staff-status" :class="`staff-status--${tone}`"><span class="staff-status__dot" aria-hidden="true" />{{ label }}</span></template>
<style scoped>.staff-status { display: inline-flex; align-items: center; gap: 6px; width: fit-content; border-radius: 999px; padding: 5px 9px; background: #eee; color: #333; font-size: .71rem; font-weight: 900; letter-spacing: .045em; text-transform: uppercase; }.staff-status__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }.staff-status--danger { background: #fee9e7; color: #9f2018; }.staff-status--warning { background: #fff1d7; color: #704500; }.staff-status--success { background: #e5f4ea; color: #176334; }</style>
