import { describe, expect, it } from 'vitest'
import { createMockOperationsClient } from '../../app/services/mock-operations-client'
import { createLatestRequestOwner } from '../../app/utils/latest-request'
import { parseOperationsQAControls, preserveOperationsQAQuery } from '../../app/utils/qa-controls'

describe('controlled frontend QA', () => {
  it('bounds and allowlists mock-only query controls', () => {
    expect(parseOperationsQAControls({ qa_delay: '9999', qa_fail: 'room-board', qa_fail_after: '1' }, true)).toEqual({ delayMs: 2000, failOperation: 'room-board', failAfter: 1 })
    expect(parseOperationsQAControls({ qa_delay: '500', qa_fail: 'refund', qa_fail_after: '-1' }, true)).toEqual({ delayMs: 500, failOperation: undefined, failAfter: Number.MAX_SAFE_INTEGER })
    expect(parseOperationsQAControls({ qa_delay: '500', qa_fail: 'room-board', qa_fail_after: '0' }, false)).toEqual({ delayMs: 0, failAfter: Number.MAX_SAFE_INTEGER })
    expect(preserveOperationsQAQuery({ qa_delay: '400', qa_fail: 'daily-roster', email: 'guest@example.com' }, true)).toEqual({ qa_delay: '400', qa_fail: 'daily-roster' })
  })

  it('fails only after the configured successful read', async () => {
    const client = createMockOperationsClient({ delayMs: 1, failOperation: 'room-board', failAfter: 1 })
    await expect(client.getRoomBoard()).resolves.toMatchObject({ totalRooms: 6 })
    await expect(client.getRoomBoard()).rejects.toMatchObject({ code: 'QA_CONTROLLED_FAILURE' })
  })

  it('allows only the latest request generation to commit', async () => {
    const owner = createLatestRequestOwner()
    const first = owner.begin()
    const second = owner.begin()
    expect(owner.isLatest(first)).toBe(false)
    expect(owner.isLatest(second)).toBe(true)
    owner.invalidate()
    expect(owner.isLatest(second)).toBe(false)
  })
})
