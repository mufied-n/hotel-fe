import type { RatePlan } from '~/types/booking'

export const ratePlans: RatePlan[] = [
  { id: 'room_only', name: 'Room Only', breakfast: false, benefits: ['Welcome drink', 'Parking'], policy: 'Kebijakan final ditampilkan pada quote.' },
  { id: 'bed_and_breakfast', name: 'Room + Breakfast', breakfast: true, benefits: ['Sarapan', 'Welcome drink', 'Parking'], policy: 'Kebijakan final ditampilkan pada quote.' },
]
