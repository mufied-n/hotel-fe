export function useHoldTimer(serverTime: Ref<string>, expiresAt: Ref<string>, onElapsed?: () => void) {
  const elapsed = ref(0)
  const remainingSeconds = computed(() => Math.max(0, Math.ceil((Date.parse(expiresAt.value) - Date.parse(serverTime.value) - elapsed.value) / 1000)))
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    timer = setInterval(() => {
      elapsed.value += 1000
      if (remainingSeconds.value === 0) {
        clearInterval(timer)
        onElapsed?.()
      }
    }, 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return { remainingSeconds }
}
