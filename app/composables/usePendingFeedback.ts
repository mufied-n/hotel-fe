import { onScopeDispose, readonly, ref, watch, type Ref } from 'vue'

export function usePendingFeedback(pending: Readonly<Ref<boolean>>, indicatorDelay = 150, slowDelay = 8000) {
  const showIndicator = ref(false)
  const isSlow = ref(false)
  let indicatorTimer: ReturnType<typeof setTimeout> | undefined
  let slowTimer: ReturnType<typeof setTimeout> | undefined

  function clearTimers() {
    if (indicatorTimer) clearTimeout(indicatorTimer)
    if (slowTimer) clearTimeout(slowTimer)
    indicatorTimer = undefined
    slowTimer = undefined
  }

  function reset() {
    clearTimers()
    showIndicator.value = false
    isSlow.value = false
  }

  watch(pending, (active) => {
    reset()
    if (!active || import.meta.server) return
    indicatorTimer = setTimeout(() => { showIndicator.value = true }, indicatorDelay)
    slowTimer = setTimeout(() => { isSlow.value = true }, slowDelay)
  }, { immediate: true })

  onScopeDispose(reset, true)
  return { showIndicator: readonly(showIndicator), isSlow: readonly(isSlow) }
}
