import { effectScope, nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePendingFeedback } from '../../app/composables/usePendingFeedback'

afterEach(() => vi.useRealTimers())

describe('pending feedback timing', () => {
  it('delays decorative loading, reports slow work, and resets both states', async () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const pending = ref(false)
    const feedback = scope.run(() => usePendingFeedback(pending))!

    pending.value = true
    await nextTick()
    expect(feedback.showIndicator.value).toBe(false)
    vi.advanceTimersByTime(149)
    expect(feedback.showIndicator.value).toBe(false)
    vi.advanceTimersByTime(1)
    expect(feedback.showIndicator.value).toBe(true)
    vi.advanceTimersByTime(7850)
    expect(feedback.isSlow.value).toBe(true)

    pending.value = false
    await nextTick()
    expect(feedback.showIndicator.value).toBe(false)
    expect(feedback.isSlow.value).toBe(false)
    scope.stop()
  })

  it('clears scheduled feedback when its scope is disposed', async () => {
    vi.useFakeTimers()
    const scope = effectScope()
    const pending = ref(true)
    const feedback = scope.run(() => usePendingFeedback(pending))!
    scope.stop()
    vi.runAllTimers()
    expect(feedback.showIndicator.value).toBe(false)
    expect(feedback.isSlow.value).toBe(false)
  })
})
