<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{ to?: RouteLocationRaw, dark?: boolean, type?: 'button' | 'submit', disabled?: boolean, loading?: boolean, loadingLabel?: string, slowLoadingLabel?: string }>(), { type: 'button', loadingLabel: 'Memproses…', slowLoadingLabel: 'Masih memproses…' })
const inactive = computed(() => Boolean(props.disabled || props.loading))
const loadingRef = toRef(props, 'loading')
const { showIndicator, isSlow } = usePendingFeedback(loadingRef)
const pendingLabel = computed(() => isSlow.value ? props.slowLoadingLabel : props.loadingLabel)
function preventInactive(event: MouseEvent) { if (inactive.value) event.preventDefault() }
</script>
<template>
  <NuxtLink v-if="to" :to="to" class="button" :class="{ 'button--dark': dark, 'button--loading': loading }" :aria-disabled="inactive || undefined" :aria-busy="loading || undefined" :tabindex="inactive ? -1 : undefined" @click="preventInactive">
    <span class="button__layout"><span class="button__indicator"><UiLoadingIndicator v-if="loading && showIndicator" size="small" /></span><span class="button__labels"><span class="button__label button__label--idle"><slot /></span><span class="button__label button__label--pending">{{ pendingLabel }}</span></span></span>
  </NuxtLink>
  <button v-else :type="type" class="button" :class="{ 'button--dark': dark, 'button--loading': loading }" :disabled="inactive" :aria-busy="loading || undefined">
    <span class="button__layout"><span class="button__indicator"><UiLoadingIndicator v-if="loading && showIndicator" size="small" /></span><span class="button__labels"><span class="button__label button__label--idle"><slot /></span><span class="button__label button__label--pending">{{ pendingLabel }}</span></span></span>
  </button>
</template>
