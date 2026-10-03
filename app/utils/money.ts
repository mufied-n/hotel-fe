import type { Money } from '~/types/booking'

export const money = (amount: number, exponent: 0 | 2 = 2): Money => ({ amount, currency: 'IDR', exponent })

export const rupiah = (amount: number): Money => {
  if (!Number.isSafeInteger(amount)) throw new Error('IDR amount is outside the safe integer range')
  return money(amount, 0)
}

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: value.currency, minimumFractionDigits: value.amount % 100 ? 2 : 0 }).format(value.amount / 10 ** value.exponent)
}

export function sumMoney(values: Money[]): Money {
  const exponent = values[0]?.exponent ?? 0
  if (values.some(value => value.currency !== 'IDR' || value.exponent !== exponent)) throw new Error('Money contract mismatch')
  return money(values.reduce((total, value) => total + value.amount, 0), exponent)
}
