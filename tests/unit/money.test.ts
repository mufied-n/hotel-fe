import { describe, expect, it } from 'vitest'
import { formatMoney, money, rupiah, sumMoney } from '../../app/utils/money'

describe('money contract', () => {
  it('formats integer minor units for IDR', () => {
    expect(formatMoney(money(113150000))).toContain('1.131.500')
    expect(formatMoney(money(10193694))).toContain('101.936,94')
  })

  it('sums without floating point arithmetic', () => {
    expect(sumMoney([money(100), money(250)])).toEqual(money(350))
  })

  it('formats backend IDR integer rupiah without dividing by 100', () => {
    expect(formatMoney(rupiah(750_000))).toContain('750.000')
    expect(sumMoney([rupiah(550_000), rupiah(55_000)])).toEqual(rupiah(605_000))
  })

  it('rejects mixed money exponents', () => {
    expect(() => sumMoney([rupiah(1), money(100)])).toThrow('Money contract mismatch')
  })
})
