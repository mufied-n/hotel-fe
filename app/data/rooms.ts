import type { RoomFamily } from '~/types/booking'

export const roomFamilies: RoomFamily[] = [
  { id: 'deluxe-bay', name: 'Deluxe Bay Window', description: 'Ruang terang dengan bay window untuk menikmati ritme kota.', variants: [
    { id: 'deluxe-king-bay', familyId: 'deluxe-bay', name: 'Deluxe King Bay Window', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Bay window', 'Shower', 'Wi-Fi'], imageAlt: 'Placeholder foto Deluxe King Bay Window' },
    { id: 'deluxe-twin-bay', familyId: 'deluxe-bay', name: 'Deluxe Twin Bay Window', bed: '2 Twin', capacity: 2, capacityStatus: 'sample', features: ['Bay window', 'Shower', 'Wi-Fi'], imageAlt: 'Placeholder foto Deluxe Twin Bay Window' },
  ] },
  { id: 'deluxe-balcony', name: 'Deluxe Balcony', description: 'Kamar dengan balkon pribadi dan komposisi editorial yang hangat.', variants: [
    { id: 'deluxe-king-balcony', familyId: 'deluxe-balcony', name: 'Deluxe King Balcony', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Private balcony', 'Shower', 'Wi-Fi'], imageAlt: 'Placeholder foto Deluxe King Balcony' },
    { id: 'deluxe-twin-balcony', familyId: 'deluxe-balcony', name: 'Deluxe Twin Balcony', bed: '2 Twin', capacity: 2, capacityStatus: 'sample', features: ['Private balcony', 'Shower', 'Wi-Fi'], imageAlt: 'Placeholder foto Deluxe Twin Balcony' },
  ] },
  { id: 'executive', name: 'Executive Suite', description: 'Suite luas untuk singgah lebih lama.', variants: [
    { id: 'executive-suite', familyId: 'executive', name: 'Executive Suite', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Living area', 'Breakfast', 'Wi-Fi'], imageAlt: 'Placeholder foto Executive Suite' },
  ] },
  { id: 'suite', name: 'Suite Room', description: 'Ruang istirahat dengan area duduk terpisah.', variants: [
    { id: 'suite-room', familyId: 'suite', name: 'Suite Room', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Living area', 'Breakfast', 'Wi-Fi'], imageAlt: 'Placeholder foto Suite Room' },
  ] },
  { id: 'family', name: 'Family Suite', description: 'Pilihan ruang untuk perjalanan bersama keluarga.', variants: [
    { id: 'family-suite', familyId: 'family', name: 'Family Suite', bed: '1 King + 2 Twin', capacity: 4, capacityStatus: 'sample', features: ['Two sleeping areas', 'Breakfast', 'Wi-Fi'], imageAlt: 'Placeholder foto Family Suite' },
  ] },
]

export const roomVariants = roomFamilies.flatMap(room => room.variants)
