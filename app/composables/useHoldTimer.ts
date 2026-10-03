export function useHoldTimer(serverTime: Ref<string>, expiresAt: Ref<string>, onElapsed?: () => void) {
  const elapsed = ref(0)
  const remainingSeconds = computed(() => Math.max(0, Math.ceil((Date.parse(expiresAt.value) - Date.parse(serverTime.value) - elapsed.value) / 1000)))
  let timer: ReturnType<typeof setInterval> | undefined
  let startedAt = 0
  let notified = false
  function update() {
    elapsed.value = Date.now() - startedAt
    if (remainingSeconds.value === 0 && !notified) {
      notified = true
      onElapsed?.()
    }
  }
  onMounted(() => {
    startedAt = Date.now()
    timer = setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
  })
  onBeforeUnmount(() => {
    clearInterval(timer)
    document.removeEventListener('visibilitychange', update)
  })
  return { remainingSeconds }
}
