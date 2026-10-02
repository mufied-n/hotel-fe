# Book Secure → booking milik hotel: flow dan parity

Tanggal observasi: 3 Oktober 2026. [Pencarian sumber](https://www.book-secure.com/index.php?s=results&property=idyog30205&arrival=2026-10-03&departure=2026-10-04&adults1=1&children1=0&locale=en_GB&currency=IDR&stid=w4fszfb1n). [Summary screenshot](evidence/book-secure-summary-mobile.jpg).

## Flow yang teramati

1. CTA website resmi menuju Book Secure dengan `property=idyog30205`. Link default website tidak membawa tanggal; contoh URL pengguna membawa arrival/departure, adults1/children1, locale, currency, stid.
2. Device verification otomatis selesai tanpa CAPTCHA manual. Ini perilaku vendor; bukan requirement untuk backend baru.
3. Results: tanggal, 1 room/1 adult, promo code, bahasa/currency, pilihan display offers first. Tujuh varian kamar; setiap deluxe memiliki Room Only dan Breakfast, suite menampilkan Breakfast pada snapshot ini.
4. Rate details menampilkan OCTOBREAK, diskon 27%, benefit, pajak/service dan terms. Ketentuan: non-cancellable/non-modifiable, pay now, no-show 100%. Terms menyebut full charge setelah booking confirmed; wording ini tidak membuktikan urutan transaksi internal vendor.
5. Memilih Deluxe King Bay Window Room Only membawa ke `s=validate-collect`: detail hotel, tanggal, room/rate, diskon, total, breakdown pajak/service, special request maksimal 500 karakter, terms/privacy dan tombol BOOK.
6. Audit berhenti sebelum BOOK, acceptance terms, pengisian PII, atau pembayaran. Form guest/payment berikutnya, confirmation receipt, email nyata, dan booking management vendor belum diobservasi. Jangan mengklaim parity bagian itu telah terbukti.

## Harga snapshot (1 malam, 1 orang)

| Varian | Room Only (IDR) | Breakfast (IDR) |
|---|---:|---:|
| Deluxe King Bay Window | 1,131,500 | 1,241,000 |
| Deluxe Twin Bay Window | 1,131,500 | 1,241,000 |
| Deluxe King Balcony | 1,131,500 | 1,241,000 |
| Deluxe Twin Balcony | 1,131,500 | 1,241,000 |
| Executive Suite | — | 2,518,500 |
| Suite Room | — | 2,810,500 |
| Family Suite | — | 6,460,500 |

Deluxe Room Only: harga awal 1,550,000; diskon 418,500; total 1,131,500 **sudah termasuk** VAT 101,936.94 + service 102,863.64. Jangan menambahkan Included Taxes & Fees sekali lagi. Selisih breakfast deluxe 109,500 berlaku untuk pencarian ini, bukan rumus universal per tamu.

Offer details menyebut welcome drink, minibar, parking, valet, keychain, gallery visit untuk 2 orang subject to availability. Poster promo website menyebut room + breakfast, welcome drink + snack. Ada variasi copy benefit antar sumber; perlu owner hotel menyetujui benefit per rate, bukan FE menggabungkan semua benefit ke semua paket.

## Matriks kebutuhan → backend sekarang

| Kebutuhan | Bukti publik / target | Implementasi Go saat audit | Gap |
|---|---|---|---|
| Katalog kamar + foto/bed/amenity | 5 keluarga resmi, 7 varian results | Seed 5 tipe generik; tidak ada catalog route | BE-G01 |
| Search tanggal + occupancy semua varian | Results lintas kamar | GET satu room_type_id; tidak filter jumlah kamar/tamu | BE-G02/G03 |
| Rate plan / sarapan / promo | Room Only vs Breakfast; OCTOBREAK | Base map + weekend factor | BE-G04 |
| Total tax/service/discount | Included breakdown | Satu total + nightly rate | BE-G05 |
| Quote konsisten dengan checkout | Harga dipilih lalu recap | Tidak ada quote ID/version/expiry | BE-G06 |
| Review, request, policy consent | Recap + request + terms/privacy | Create hanya guest name/email + counts | BE-G07/G08 |
| Hold sementara | Requirement internal backend | DB hold + sweep + task | BE-G12: deadline authority/recovery |
| Payment | Pay now, full amount | Fake gateway + fake-pay endpoint | BE-G10/G11 |
| Recovery/retry booking | Kebutuhan custom checkout | Create tanpa idempotency key | BE-G09 |
| Private booking status | Kebutuhan custom management | GET UUID public mengembalikan PII | BE-G13 |
| Front desk operations | Requirement internal | Casbin route guard; role header belum trusted, fail-open saat init gagal | BE-G14/G17 |
| Notifications | Target desain email/desk | LogNotifier; event handler log | BE-G16 |
| Hotel metadata/locale/currency | IDR/English; jam/lokasi | Currency IDR hardcoded; metadata tidak di API | BE-G19 |
| Inventory kanal lain/maintenance | Target desain hotel | Stok lokal seeded; belum integrasi/admin | BE-G18 |

## Flow baru yang direncanakan (proposal)

`Search → pilih room + rate → guest details → review & policy → create hold + payment attempt → hosted payment → processing → confirmed / failed / expired / needs assistance`.

UI tahap awal memakai fixture dan simulasi lokal. Search/review tidak mengurangi stok; hold dibuat saat submit final sebelum redirect payment. Countdown muncul hanya setelah mendapat deadline hold dari server pada fase integrasi. Saat tanggal/tamu/rate berubah, pilihan quote sebelumnya invalid. Return URL payment hanya memulai status check; confirmation hanya dari backend terverifikasi. Manual review/refund untuk pembayaran terlambat merupakan keputusan backend/operasional, bukan FE menetapkan confirmed sendiri.

## Perbaikan UX yang disengaja

Gunakan step dengan label, total tetap terbaca, kebijakan pembatalan di samping pilihan rate, dan bahasa jelas untuk no-show/pay now. Grupkan varian bed dalam keluarga room bila mapping inventory disetujui. Sticky summary desktop; summary collapsible/mobile action bar tanpa menutupi form. Foto dan tipografi memakai brand resmi; jangan menyalin template vendor hitam/abu/oranye sebagai design system hotel.
