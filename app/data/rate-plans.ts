import type { RatePlan } from '~/types/booking'

export const ratePlans: RatePlan[] = [
  { id: 'room-only', name: 'Room Only', breakfast: false, benefits: ['Welcome drink', 'Parking'], policy: 'Tidak dapat dibatalkan atau diubah. Bayar sekarang.' },
  { id: 'breakfast', name: 'Room + Breakfast', breakfast: true, benefits: ['Sarapan', 'Welcome drink', 'Parking'], policy: 'Tidak dapat dibatalkan atau diubah. Bayar sekarang.' },
]
