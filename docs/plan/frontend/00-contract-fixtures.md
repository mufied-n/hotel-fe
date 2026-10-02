# FE-00 — kontrak view model dan fixture

Status IMPLEMENTED FOR LOCAL DEMO (3 Oktober 2026). Depends: [parity](../../research/booking-flow-parity.md). Owner: FE; backend meninjau kontrak integrasi setelah gap audit. Kontrak di bawah adalah view model prototype, bukan endpoint existing atau OpenAPI yang sudah disetujui.

## Target file dan TODO

| File | Tugas |
|---|---|
| `app/types/booking.ts` | DateOnly, Money, Hotel, RoomFamily/Variant, Occupancy, RatePlan, Quote, Draft, BookingStatus dan ApiError |
| `app/data/hotel.ts` | Property name/contact/address/Asia-Jakarta/check-in 15:00/check-out 12:00 |
| `app/data/rooms.ts` | 5 keluarga, 7 varian mock, bed/facility/media/alt; capacity belum verified diberi status sample |
| `app/data/rate-plans.ts` | Room Only/Breakfast, snapshot promo/policy; benefits per rate bukan digabung bebas |
| `app/data/scenarios.ts` | Available, sold out, loading/error, price changed, pending, expired dan paid demo |
| `app/services/booking-client.ts` | Interface client terpisah dari DTO transport |
| `app/services/mock-booking-client.ts` | Async fixture, latency/error deterministik; tidak ada network ke vendor/Go |
| `app/utils/money.ts` | Integer amount/exponent formatter; IDR mock exponent dipilih eksplisit |
| `app/utils/dates.ts` | Date-only kalender; hari checkout tidak dihitung malam |

- [ ] Semua angka kapasitas/stok yang tidak ada bukti owner ditandai sample. Jangan memakai 100 kamar seed BE sebagai data hotel.
- [ ] Snapshot Rp1.131.500 deluxe room-only menjadi contoh demo 3–4 Oktober, bukan harga selalu berlaku.
- [ ] Tipe minimal: Money `{ amount: integer, currency: 'IDR', exponent: number }`; Quote `{ id, variantId, ratePlanId, stay, occupancy, nights, original, discount, subtotal, taxes, service, total, expiresAt, policySnapshot }`.
- [ ] Jelaskan `taxes/service included` vs added; total fixture = final payable, tidak ditambah dua kali.
- [ ] SearchInput memakai checkIn/checkOut DateOnly, array occupancy per room (adults, childrenAges), promoCode optional, locale/currency.
- [ ] BookingDraft menyimpan search, selectedQuote, guest details, requests dan consent; data guest hanya in-memory untuk tahap UI.
- [ ] BookingStatus view terpisah dari domain status Go: processing/needs_assistance bisa mewakili payment recovery tanpa mengubah domain enum sepihak.

## Client interface yang diusulkan

`search(input)`, `quote(selection)`, `createBooking(draft, idempotencyKey)`, `getBookingStatus(id, access)`; hasil berupa Promise dan error terstruktur. Fixture impl menghasilkan ID `demo-*` dan simulated status. Backend endpoint final harus dipetakan lewat adapter setelah contract review; jangan menganggap `/search` atau `/quotes` sudah ada.

Error view memerlukan `code`, user message, optional field errors dan retry guidance: VALIDATION_ERROR, SOLD_OUT, QUOTE_EXPIRED, PRICE_CHANGED, HOLD_EXPIRED, PAYMENT_PENDING, PAYMENT_FAILED, UNAUTHORIZED dan SERVICE_UNAVAILABLE.

## Acceptance

- [ ] Scenario tidak bergantung real clock/random sehingga screenshot konsisten; tanggal valid dijaga terhadap demo clock yang jelas.
- [ ] Fixture satu/multi-room dan child occupancy menghasilkan summary sama di semua tahap.
- [ ] Money/date test memverifikasi rounding pilihan, checkout exclusive, pergantian bulan dan timezone browser berbeda.
- [ ] Tidak ada provider secret, PII nyata, request vendor, atau backend mutation.
