import { describe, expect, it } from 'vitest'
import { createMockOperationsClient } from '../../app/services/mock-operations-client'

describe('operations mock client', () => {
  it('calculates housekeeping summaries from the active filter', async () => {
    const client = createMockOperationsClient()
    const board = await client.getRoomBoard({ floor: 3 })
    expect(board.totalRooms).toBe(3)
    expect(Object.values(board.summary).reduce((sum, count) => sum + count, 0)).toBe(3)
  })

  it('updates a room only inside its sample client session', async () => {
    const client = createMockOperationsClient()
    await client.updateRoomStatus('301', 'cleaning', 'Mulai dibersihkan')
    const board = await client.getRoomBoard({ status: 'cleaning' })
    expect(board.rooms.some(room => room.roomNumber === '301')).toBe(true)
    const separateClient = createMockOperationsClient()
    const original = await separateClient.getRoomBoard({ status: 'vacant_dirty' })
    expect(original.rooms.some(room => room.roomNumber === '301')).toBe(true)
  })

  it('rejects extension and refund input outside the backend bounds', async () => {
    const client = createMockOperationsClient()
    await expect(client.extendStay('demo-stay-001', { additionalNights: 31, paymentMethod: 'unconfirmed' })).rejects.toMatchObject({ code: 'INVALID_ADDITIONAL_NIGHTS' })
    await expect(client.createRefund({ bookingId: 'demo', amountMinor: 0, reason: 'Alasan valid' })).rejects.toMatchObject({ code: 'INVALID_AMOUNT' })
    const boundary = await client.extendStay('demo-stay-001', { additionalNights: 30, paymentMethod: 'unconfirmed' })
    expect(boundary.newCheckOut).toBe('2026-11-03')
  })

  it('records handover and room-move history deterministically', async () => {
    const client = createMockOperationsClient()
    await client.recordHandover({ shift: 'night', cashFloatMinor: 1000000, pendingIssues: 'Periksa late arrival.', vipGuestNotes: '' })
    expect((await client.getHandovers()).total).toBe(2)
    await client.moveRoom('demo-stay-001', { targetRoomNumber: '305', reasonCategory: 'guest_request', notes: '' })
    expect(await client.getRoomMoves('demo-stay-001')).toHaveLength(2)
  })

  it('validates voucher tokens and rejects tampered signatures', async () => {
    const client = createMockOperationsClient()
    const verified = await client.verifyVoucher({ ref: 'PKU-20261003-BKE2E001', token: 'valid-token-signature' })
    expect(verified.valid).toBe(true)
    expect(verified.verificationStatus).toBe('SIGNATURE_VERIFIED')
    expect(verified.reference).toBe('PKU-20261003-BKE2E001')

    await expect(client.verifyVoucher({ ref: 'PKU-20261003-BKE2E001', token: 'tampered_signature' }))
      .rejects.toMatchObject({ code: 'INVALID_QR_SIGNATURE' })
    await expect(client.verifyVoucher({ ref: '', token: '' }))
      .rejects.toMatchObject({ code: 'MISSING_PARAMETERS' })
  })
})
