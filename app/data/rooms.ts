import type { RoomFamily, RoomPhoto } from '~/types/booking'

const BAY_PHOTOS: RoomPhoto[] = [
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/1.jpg', alt: 'Deluxe Bay Window - Tempat tidur dan bay window' },
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/2.jpg', alt: 'Deluxe Bay Window - Sudut bay window dan cahaya alami' },
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/3.jpg', alt: 'Deluxe Bay Window - Sudut santai' },
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/4.jpg', alt: 'Deluxe Bay Window - Kamar mandi dan shower' },
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/5.jpg', alt: 'Deluxe Bay Window - Detail seni interior' },
  { url: 'https://pulangkeuttara.com/asset/rooms/bay/6.jpg', alt: 'Deluxe Bay Window - Tata ruang kamar' },
]

const BALCONY_PHOTOS: RoomPhoto[] = [
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/1.jpg', alt: 'Deluxe Balcony - Ruang tidur dan suasana balkon' },
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/2.jpg', alt: 'Deluxe Balcony - Sudut interior dan tempat tidur' },
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/3.jpg', alt: 'Deluxe Balcony - Area santai balkon luar' },
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/4.jpg', alt: 'Deluxe Balcony - Kamar mandi modern' },
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/5.jpg', alt: 'Deluxe Balcony - Detail karya seni kamar' },
  { url: 'https://pulangkeuttara.com/asset/rooms/balcony/6.jpg', alt: 'Deluxe Balcony - Pemandangan ruang keseluruhan' },
]

const EXEC_PHOTOS: RoomPhoto[] = [
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/1.jpg', alt: 'Executive Suite - Kamar tidur utama king bed' },
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/2.jpg', alt: 'Executive Suite - Ruang tamu terpisah dan sofa' },
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/3.jpg', alt: 'Executive Suite - Area kerja dan dekorasi' },
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/4.jpg', alt: 'Executive Suite - Balkon dengan pemandangan kota' },
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/5.jpg', alt: 'Executive Suite - Kamar mandi luas dan amenitas premium' },
  { url: 'https://pulangkeuttara.com/asset/rooms/exec/6.jpg', alt: 'Executive Suite - Detail interior desainer' },
]

const SUITE_PHOTOS: RoomPhoto[] = [
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/1.jpg', alt: 'Suite Room - Area tidur luas dan lounge chair' },
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/2.jpg', alt: 'Suite Room - Sudut baca dan area makan pribadi' },
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/3.jpg', alt: 'Suite Room - Komposisi interior editorial dan balkon' },
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/4.jpg', alt: 'Suite Room - Kamar mandi walk-in shower' },
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/5.jpg', alt: 'Suite Room - Furnitur seni dan pencahayaan' },
  { url: 'https://pulangkeuttara.com/asset/rooms/suite/6.jpg', alt: 'Suite Room - Tata ruang terbuka dan hangat' },
]

const FAMILY_PHOTOS: RoomPhoto[] = [
  { url: 'https://pulangkeuttara.com/asset/rooms/family/1.jpg', alt: 'Family Suite - Ruang kumpul keluarga yang lapang' },
  { url: 'https://pulangkeuttara.com/asset/rooms/family/2.jpg', alt: 'Family Suite - Kamar tidur utama king bed' },
  { url: 'https://pulangkeuttara.com/asset/rooms/family/3.jpg', alt: 'Family Suite - Kamar tidur kedua twin bed' },
  { url: 'https://pulangkeuttara.com/asset/rooms/family/4.jpg', alt: 'Family Suite - Area duduk bersama dan meja makan' },
  { url: 'https://pulangkeuttara.com/asset/rooms/family/5.jpg', alt: 'Family Suite - Kamar mandi ganda untuk keluarga' },
  { url: 'https://pulangkeuttara.com/asset/rooms/family/6.jpg', alt: 'Family Suite - Interior ramah keluarga' },
]

export const ROOM_PHOTOS: Record<string, RoomPhoto[]> = {
  'deluxe-bay': BAY_PHOTOS,
  'deluxe-balcony': BALCONY_PHOTOS,
  'executive': EXEC_PHOTOS,
  'suite': SUITE_PHOTOS,
  'family': FAMILY_PHOTOS,
}

export const roomFamilies: RoomFamily[] = [
  {
    id: 'deluxe-bay',
    name: 'Deluxe Bay Window',
    description: 'Ruang terang dengan bay window untuk menikmati ritme kota.',
    imageUrl: BAY_PHOTOS[0]!.url,
    photos: BAY_PHOTOS,
    variants: [
      { id: 'deluxe-king-bay', familyId: 'deluxe-bay', name: 'Deluxe King Bay Window', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Bay window', 'Shower', 'Wi-Fi'], imageAlt: 'Foto Deluxe King Bay Window', imageUrl: BAY_PHOTOS[0]!.url, photos: BAY_PHOTOS },
      { id: 'deluxe-twin-bay', familyId: 'deluxe-bay', name: 'Deluxe Twin Bay Window', bed: '2 Twin', capacity: 2, capacityStatus: 'sample', features: ['Bay window', 'Shower', 'Wi-Fi'], imageAlt: 'Foto Deluxe Twin Bay Window', imageUrl: BAY_PHOTOS[0]!.url, photos: BAY_PHOTOS },
    ],
  },
  {
    id: 'deluxe-balcony',
    name: 'Deluxe Balcony',
    description: 'Kamar dengan balkon pribadi dan komposisi editorial yang hangat.',
    imageUrl: BALCONY_PHOTOS[0]!.url,
    photos: BALCONY_PHOTOS,
    variants: [
      { id: 'deluxe-king-balcony', familyId: 'deluxe-balcony', name: 'Deluxe King Balcony', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Private balcony', 'Shower', 'Wi-Fi'], imageAlt: 'Foto Deluxe King Balcony', imageUrl: BALCONY_PHOTOS[0]!.url, photos: BALCONY_PHOTOS },
      { id: 'deluxe-twin-balcony', familyId: 'deluxe-balcony', name: 'Deluxe Twin Balcony', bed: '2 Twin', capacity: 2, capacityStatus: 'sample', features: ['Private balcony', 'Shower', 'Wi-Fi'], imageAlt: 'Foto Deluxe Twin Balcony', imageUrl: BALCONY_PHOTOS[0]!.url, photos: BALCONY_PHOTOS },
    ],
  },
  {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Suite luas untuk singgah lebih lama.',
    imageUrl: EXEC_PHOTOS[0]!.url,
    photos: EXEC_PHOTOS,
    variants: [
      { id: 'executive-suite', familyId: 'executive', name: 'Executive Suite', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Living area', 'Breakfast', 'Wi-Fi'], imageAlt: 'Foto Executive Suite', imageUrl: EXEC_PHOTOS[0]!.url, photos: EXEC_PHOTOS },
    ],
  },
  {
    id: 'suite',
    name: 'Suite Room',
    description: 'Ruang istirahat dengan area duduk terpisah.',
    imageUrl: SUITE_PHOTOS[0]!.url,
    photos: SUITE_PHOTOS,
    variants: [
      { id: 'suite-room', familyId: 'suite', name: 'Suite Room', bed: '1 King', capacity: 2, capacityStatus: 'sample', features: ['Living area', 'Breakfast', 'Wi-Fi'], imageAlt: 'Foto Suite Room', imageUrl: SUITE_PHOTOS[0]!.url, photos: SUITE_PHOTOS },
    ],
  },
  {
    id: 'family',
    name: 'Family Suite',
    description: 'Pilihan ruang untuk perjalanan bersama keluarga.',
    imageUrl: FAMILY_PHOTOS[0]!.url,
    photos: FAMILY_PHOTOS,
    variants: [
      { id: 'family-suite', familyId: 'family', name: 'Family Suite', bed: '1 King + 2 Twin', capacity: 4, capacityStatus: 'sample', features: ['Two sleeping areas', 'Breakfast', 'Wi-Fi'], imageAlt: 'Foto Family Suite', imageUrl: FAMILY_PHOTOS[0]!.url, photos: FAMILY_PHOTOS },
    ],
  },
]

export const roomVariants = roomFamilies.flatMap(room => room.variants)
