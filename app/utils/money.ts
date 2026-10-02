import type { Money } from '~/types/booking'

export const money = (amount: number): Money => ({ amount, currency: 'IDR', exponent: 2 })

export function formatMoney(value: Money): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: value.currency, minimumFractionDigits: value.amount % 100 ? 2 : 0 }).format(value.amount / 10 ** value.exponent)
}

export function sumMoney(values: Money[]): Money {
  if (values.some(value => value.currency !== 'IDR' || value.exponent !== 2)) throw new Error('Money contract mismatch')
  return money(values.reduce((total, value) => total + value.amount, 0))
}
