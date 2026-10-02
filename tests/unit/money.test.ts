import { describe, expect, it } from 'vitest'
import { formatMoney, money, sumMoney } from '../../app/utils/money'

describe('money contract', () => {
  it('formats integer minor units for IDR', () => {
    expect(formatMoney(money(113150000))).toContain('1.131.500')
    expect(formatMoney(money(10193694))).toContain('101.936,94')
  })

  it('sums without floating point arithmetic', () => {
    expect(sumMoney([money(100), money(250)])).toEqual(money(350))
  })
})
