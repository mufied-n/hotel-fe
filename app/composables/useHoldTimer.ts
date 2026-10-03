export function remainingHoldSeconds(serverTime: string, expiresAt: string, elapsedMs = 0) {
  const duration = Date.parse(expiresAt) - Date.parse(serverTime) - elapsedMs
  return Number.isFinite(duration) ? Math.max(0, Math.ceil(duration / 1000)) : 0
}

export function useHoldTimer(serverTime: Ref<string>, expiresAt: Ref<string>, onElapsed?: () => void) {
  const elapsed = ref(0)
  const remainingSeconds = computed(() => {
    return remainingHoldSeconds(serverTime.value, expiresAt.value, elapsed.value)
  })
  let timer: ReturnType<typeof setInterval> | undefined
  let startedAt = 0
  let notified = false
  function reset() { startedAt = Date.now(); elapsed.value = 0; notified = false; update() }
  function update() {
    elapsed.value = Date.now() - startedAt
    if (remainingSeconds.value === 0 && !notified) {
      notified = true
      onElapsed?.()
    }
  }
  onMounted(() => {
    reset()
    timer = setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
  })
  watch([serverTime, expiresAt], reset)
  onBeforeUnmount(() => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', update)
  })
  return { remainingSeconds }
}
