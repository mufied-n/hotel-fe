import { describe, expect, it } from 'vitest'
import { stableSnapshot } from '../../app/composables/useUnsavedChanges'

describe('unsaved change snapshots', () => {
  it('is stable across object key order and detects nested edits', () => {
    expect(stableSnapshot({ b: 2, a: { value: 1 }, tags: ['a'] })).toBe(stableSnapshot({ tags: ['a'], a: { value: 1 }, b: 2 }))
    expect(stableSnapshot({ tags: ['a'] })).not.toBe(stableSnapshot({ tags: ['a', 'b'] }))
  })
})
