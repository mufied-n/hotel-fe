<script setup lang="ts">
const props = defineProps<{ src: string, alt: string }>()
const ready = ref(false)
const failed = ref(false)
const image = ref<HTMLImageElement | null>(null)

async function markReady() {
  const element = image.value
  if (!element) return
  try { await element.decode() }
  catch { /* load already confirms a usable image */ }
  ready.value = true
}

function markFailed() { failed.value = true }
onMounted(() => {
  if (!image.value?.complete) return
  if (image.value.naturalWidth) markReady()
  else markFailed()
})
watch(() => props.src, () => { ready.value = false; failed.value = false })
</script>

<template>
  <figure class="room-media-frame" :class="{ 'room-media-frame--ready': ready }">
    <img v-if="!failed" ref="image" :src="src" :alt="alt" @load="markReady" @error="markFailed">
    <div v-else class="room-media-error" role="img" :aria-label="alt">Foto kamar belum dapat dimuat.</div>
  </figure>
</template>

<style scoped>
.room-media-frame { min-height: min(68vh, 650px); margin: 0; overflow: hidden; border-radius: 28px; background: var(--soft); }
.room-media-frame img { width: 100%; height: 100%; min-height: inherit; max-height: 650px; object-fit: cover; opacity: 0; }
.room-media-frame--ready img { opacity: 1; animation: room-media-in var(--motion-media) var(--ease-standard); }
.room-media-error { min-height: inherit; display: grid; place-items: center; padding: 24px; color: var(--muted); text-align: center; }
@keyframes room-media-in { from { opacity: 0; transform: scale(.99); } to { opacity: 1; transform: scale(1); } }
</style>
