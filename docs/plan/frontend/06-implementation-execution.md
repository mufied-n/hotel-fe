# Rencana eksekusi implementasi UI booking

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Status: IMPLEMENTED FOR LOCAL DEMO; QA perangkat fisik dan asset fidelity masih terbuka. Dokumen ini mengatur urutan pelaksanaan FE-00–FE-05. Acceptance tetap berada di masing-masing dokumen owner.

## Baseline dan outcome

Workspace frontend berisi `docs/` dan screenshot referensi. Belum ditemukan `package.json`, aplikasi Nuxt, test runner, atau aset logo/font/foto terpisah yang siap dipakai. Screenshot audit adalah referensi visual, bukan aset produksi. Direktori `.git` tidak dapat dikenali sebagai checkout oleh `git status` pada pemeriksaan ini; batas PR di bawah menjadi checkpoint lokal sampai Git tersedia.

Outcome: prototype Nuxt 4 yang dapat dinavigasi melalui search → results → guest → review → status, dengan fixture deterministik, identitas visual PULANG, dan badge **“Demo — tidak membuat reservasi”** pada semua halaman transaksi. Per arahan owner pada implementasi, scope akhir hanya webapp booking: root mengarah ke `/booking`, sedangkan landing page, rooms marketing, dan FAQ publik dikeluarkan. Acceptance marketing FE-01 tidak berlaku pada scope ini.

Register gap backend menyatakan integrasi live belum siap. Register tersebut dibaca sebagai handoff, bukan audit ulang kode Go pada pekerjaan ini. Implementasi UI dapat berjalan memakai mock tanpa request vendor/Go, stok nyata, payment SDK, atau klaim email terkirim.

## Penajaman kontrak sebelum komponen dibuat

| Topik | Usulan untuk prototype | Dokumen owner saat implementasi |
|---|---|---|
| Multi-room | Setiap occupancy memiliki `roomIndex` stabil dan pilihan variant/rate sendiri. Quote agregat memiliki `items[]` yang memetakan setiap roomIndex, occupancy, variant, rate, dan breakdown; satu ID/version/expiry untuk checkout keseluruhan. Single-room memakai satu item. Submit hanya boleh setelah semua room memiliki pilihan valid. | FE-00, FE-02, FE-03 |
| Harga | Money amount adalah integer minor units. Untuk fixture IDR gunakan exponent **2**, sehingga Rp1.131.500 = amount 113150000 dan tax Rp101.936,94 = 10193694. Original − discount = payable; karena snapshot charges included, subtotal sebelum charges + taxes + service = payable. Simpan nilai fixture, jangan menebak rumus pajak dari satu snapshot. Semua operasi mensyaratkan currency/exponent sama. | FE-00 |
| Harga lintas tanggal | Snapshot resmi hanya untuk 3–4 Oktober 2026. Untuk tanggal/occupancy lain, tabel harga dan aturan total adalah sample deterministik, diberi label demo. Breakfast entitlement dan kapasitas sample tidak diklaim sebagai aturan hotel. | FE-00, FE-02 |
| Clock demo | Inject clock ke mock/client timer. Kalender demo mulai pada 3 Oktober 2026 di Asia/Jakarta, ditampilkan eksplisit. Mode review/screenshot membekukan clock; mode timer menggerakkan logical clock dari anchor yang sama. Tests dapat advance clock. Tanpa `Date.now()`/random tersebar sebagai otoritas fixture. | FE-00, FE-04 |
| Search URL | Codec versioned untuk daftar occupancy per room dan children ages; validasi jumlah, tipe, rentang, tanggal, dan panjang input. DateOnly diparse sebagai kalender; gunakan ordinal hari untuk nights, bukan selisih local timestamp. Query hanya membawa search non-PII. | FE-02 |
| Draft dan refresh | Search dapat dipulihkan dari URL. Quote, data guest, consent, mock attempt, dan access hanya hidup dalam sesi navigasi in-memory. Refresh guest/review/status menjelaskan sesi demo hilang dan menawarkan pilih ulang; tidak merekonstruksi booking orang lain dari ID. | FE-00, FE-03, FE-04 |
| Invalidation | Perubahan tanggal/occupancy/variant/rate/promo/currency menghapus quote dan submit attempt lama; consent reset saat quote/policy berubah. Edit guest mempertahankan quote. Response async lama tidak boleh mengganti hasil pencarian terbaru. | FE-02, FE-03 |
| Error dan retry | Error terstruktur memuat guidance yang bisa dipetakan ke edit/requote/status retry. Untuk submit ambigu, pertahankan attempt key dan payload yang sama; edit payload membentuk attempt baru setelah review. Mock scoped per app/session, tanpa mutable singleton SSR. | FE-00, FE-03 |
| Bahasa | Copy awal Bahasa Indonesia, currency IDR, timezone hotel Asia/Jakarta. Locale formatter didefinisikan eksplisit. Switch bahasa/currency lain ditunda; tidak menampilkan kontrol yang belum berfungsi. | FE-00, FE-01 |
| Asset fidelity | Sampai handoff tersedia, gunakan placeholder berlabel untuk logo/media dan Arial/system fallback. Jangan menggambar logo tiruan atau memakai screenshot satu halaman sebagai foto kamar. Manifest mencatat file, provenance, alt, dimensi, dan status placeholder/approved. | FE-01, FE-05 |

Usulan multi-room memperluas bentuk Quote singular pada FE-00. Saat memulai implementasi, revisi kontrak pada dokumen owner dan types terlebih dahulu agar services, results, review, dan status memakai model yang sama. Exponent fixture tidak menetapkan exponent provider pembayaran kelak.

## Urutan pelaksanaan dan checkpoint

FE-01 perlu dipisah menjadi bootstrap tooling awal dan shell visual setelah kontrak; ini memungkinkan test FE-00 berjalan tanpa menunggu halaman selesai. Tidak ada dependensi backend live pada jalur ini.

### Checkpoint 0 — bootstrap tooling (bagian awal FE-01)

- [ ] Periksa Node/package manager, kompatibilitas Nuxt 4, dan aturan workspace saat eksekusi; pin dependency yang dipilih dan commit lockfile ketika Git tersedia.
- [ ] Buat `package.json`, lockfile, `.gitignore`, `nuxt.config.ts`, `tsconfig.json`, `app/app.vue`, dan halaman minimal yang dapat dirender.
- [ ] Konfigurasikan scripts `dev`, `build`, `typecheck`, `lint`, `test:unit`, `test:e2e`. Gunakan Nuxt + TypeScript, ESLint konfigurasi Nuxt, Vitest, Nuxt test utils bila perlu runtime component, dan Playwright untuk browser.
- [ ] Tambahkan config lint/test pada root dan direktori `tests/{unit,component,e2e}`. Pisahkan test pure TypeScript dari test runtime Nuxt.
- [ ] Verifikasi startup, build, typecheck dan lint awal. Belum menyatakan FE-01 selesai sebelum shell/accessibility acceptance terpenuhi.

### Checkpoint 1 — model, fixture dan mock client (FE-00)

Owner: [00-contract-fixtures.md](00-contract-fixtures.md).

- [ ] Buat types, hotel, room families/variants, rate plans, dan scenario registry sesuai penajaman kontrak.
- [ ] Buat date/money/validation helpers serta `app/utils/search-query.ts` dan `app/services/demo-clock.ts` sebagai tambahan target file.
- [ ] Implementasikan interface client dan mock async: search, quote, createBooking, getBookingStatus. Tentukan signature payload/return/error sebelum page memakainya.
- [ ] Mock quote adalah authority harga demo; promo dan price change menghasilkan quote baru, bukan kalkulasi mandiri di komponen.
- [ ] Tentukan latency, error injection, ID sequence dan reset deterministik. Mock create mengembalikan pending, expiry/serverTime/access; key yang sama + payload sama mengembalikan attempt yang sama.
- [ ] Unit test nights checkout-exclusive, tanggal invalid/leap year/pergantian bulan, timezone berbeda, integer Money, included charges, multi-room aggregate, expiry, serta replay attempt.

Gate: satu/multi-room/child menghasilkan quote konsisten; fixture tidak memakai PII nyata atau network. Tipe dan scenario ID menjadi fondasi komponen berikutnya.

### Checkpoint 2 — brand shell dan reusable UI (sisa FE-01)

Owner: [01-foundation-design-system.md](01-foundation-design-system.md).

- [ ] Implementasikan CSS tokens/base/components dan layouts default/booking; semua halaman transaksi mendapat demo badge dari booking layout.
- [ ] Buat BrandHeader/Footer/Button/MobileActionBar dan FormField/InlineAlert/PolicyAccordion/DialogPanel.
- [ ] Buat home, rooms, FAQ dengan link yang memiliki destination nyata di prototype. Informasi belum terverifikasi diberi label sample.
- [ ] Tambahkan manifest `public/asset-manifest.json` untuk asset yang benar-benar dipakai; catat pending handoff di laporan QA.
- [ ] Gallery/menu/dialog memiliki keyboard, Escape, focus trap/restore. Hindari autoplay dan reveal yang menyembunyikan konten sebelum JS.
- [ ] Review shell pada 360/390/768/1440px terhadap screenshot resmi, termasuk footer/action bar/safe area dan focus pada permukaan inverse.

Gate: shell rendered, tanpa overflow/hydration error pada pemeriksaan; placeholder/font fallback dicatat. Asset pending membatasi fidelity, bukan menghambat implementasi flow demo.

### Checkpoint 3 — search sampai pemilihan kamar (FE-02)

Owner: [02-search-room-results.md](02-search-room-results.md).

- [ ] Implementasikan `useBookingDraft`, `useBookingClient`, SearchForm/DateRangeField/GuestSelector. Mulai native date input berlabel; tambah calendar library hanya bila acceptance membutuhkan navigasi custom.
- [ ] Buat `/booking` dan `/booking/results`, codec URL, error invalid query, back/refresh restoration, dan edit search.
- [ ] Results mengelompokkan 5 keluarga/7 varian, menampilkan rate yang tersedia per variant, occupancy sample, policy kritis, dan total stay/semua rooms.
- [ ] Single-room dapat lanjut langsung; multi-room memilih variant/rate untuk setiap occupancy sebelum quote agregat final.
- [ ] Implementasikan promo states, loading/sold-out/missing inventory/error/image failure, stale response protection dan invalidation.
- [ ] Uji search URL round-trip/invalid values, rate selection keyboard, response search yang terlambat, serta satu/multi-room/child sampai quote terpilih.

Gate: search/select tidak create booking. Semua pilihan dan breakdown dapat dibaca konsisten oleh tahap berikutnya.

### Checkpoint 4 — guest, review dan submit (FE-03)

Owner: [03-checkout-review.md](03-checkout-review.md).

- [ ] Buat `/booking/guest`, `/booking/review`, BookingSteps/Summary/PriceBreakdown dan `app/middleware/booking-draft.ts` untuk guard.
- [ ] Form nama/email wajib; phone ditunda sampai scope disepakati. Special request maksimal 500 karakter dengan aturan hitung Unicode yang didokumentasikan dan diuji.
- [ ] Review memakai quote snapshot: semua rooms/guests/rates, breakfast per rate, benefit, included charges, total, jam hotel, kontak, policy.
- [ ] Tampilkan terms/privacy demo yang dapat dibaca, label bahwa belum merupakan kebijakan final hotel, dan consent required unchecked. Policy kritis tetap terbaca tanpa membuka accordion.
- [ ] CTA “Simulasikan pembayaran” memulai mock pending; lock submit, key stabil untuk retry payload yang sama, dan error dapat dipulihkan tanpa menghapus guest selama sesi.
- [ ] Uji invalid form/focus, consent, double-click, network retry, quote expired/price changed/sold-out, back/edit dan refresh tanpa draft.

Gate: satu attempt per submit yang sama; harga review sama dengan quote; pending tidak ditulis confirmed atau email sent.

### Checkpoint 5 — status dan recovery (FE-04)

Owner: [04-status-recovery.md](04-status-recovery.md).

- [ ] Buat route status, BookingStatusPanel/HoldTimer dan status response dengan `serverTime`, `expiresAt`, reference demo, serta snapshot tanpa token yang dicetak.
- [ ] Tambahkan `app/components/dev/DemoScenarioPanel.vue` hanya untuk development; browser tests menjalankan mode dev untuk scenario injection. Preview build menyediakan happy path deterministik tanpa switch dev.
- [ ] Semua state dalam FE-04 dapat dipilih melalui tooling dev; setiap state memiliki aksi yang sesuai. Unknown/unauthorized ID tidak menampilkan guest snapshot.
- [ ] Timer memakai server/clock anchor, refresh status saat zero; expiry/confirmed ditetapkan response mock, bukan timer atau query success.
- [ ] Poll, bila dipakai, bounded/backoff; stop saat terminal/unmount, refresh saat kembali visible. Offline menawarkan retry status.
- [ ] Uji clock drift/visibility/unmount, polling limit, pending → processing → confirmed/expired/assistance, dan invalid access/ID.

Gate: status/recovery dapat didemokan tanpa charge baru, interval leak, atau klaim reservasi nyata.

### Checkpoint 6 — acceptance dan handoff (FE-05)

Owner: [05-qa-handoff.md](05-qa-handoff.md).

- [ ] Jalankan `npm run build`, `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run test:e2e` setelah scripts dikonfigurasikan; simpan command, versi dan hasil aktual.
- [ ] Browser test happy path serta back/edit/reset, multi-room/children, promo, stale quote, duplicate submit dan recovery. Test scenario matrix sesuai FE-05, tidak hanya screenshot default.
- [ ] Review keyboard, screen reader status penting, contrast, 200% zoom, reduced-motion, overflow dan CTA/summary pada empat viewport.
- [ ] Simpan screenshot di `docs/qa/evidence/` dengan route/scenario/viewport pada nama file. Catat hasil di `docs/qa/frontend-ui-report.md` dan jalur reproduksi demo pada README root baru.
- [ ] Periksa network selama flow untuk memastikan tidak ada request vendor/backend; periksa console/hydration dan persistence guest pada URL/storage.
- [ ] Bedakan browser desktop/emulation dengan physical Chrome Android/Safari iOS. Hasil yang tidak dijalankan ditulis NOT RUN, termasuk screen reader/perangkat yang tidak tersedia.
- [ ] Tandai acceptance di dokumen owner hanya setelah bukti ada. Kegagalan atau NOT RUN tidak diubah menjadi pass dari build atau screenshot.

Gate akhir: flow prototype lengkap dengan bukti checks yang benar-benar dijalankan dan keterbatasan asset/device tercatat. Ini bukan readiness reservasi/payment live.

## Scenario minimum yang harus bisa direproduksi

| Kelompok | Skenario | Fokus bukti |
|---|---|---|
| Search | Single room, multi-room berbeda bed/rate, children ages, invalid dates/occupancy/query | Summary, codec, validation |
| Results | Loading, available, sold-out, missing inventory, service error, failed image | Aksi pulih dan availability copy |
| Promo/quote | Invalid/expired/ineligible promo, price changed, quote expired, stale search response | Quote final dan invalidation |
| Checkout | Invalid name/email, special request limit, consent unchecked, double-click, retry ambiguous | Focus, satu attempt, payload/key |
| Navigation | Back/edit date/guest/rate, URL refresh results, refresh guest/review/status, reset | In-memory boundary dan recovery copy |
| Status | Pending, processing, confirmed demo, failed, expired, assistance, offline, unauthorized/not found | Deadline authority dan retry status |
| Lifecycle | Timer zero, clock drift, tab hidden/visible, unmount, poll bound | Tidak auto-confirm atau interval leak |

Fixture scenario registry menjadi sumber skenario; test dan tooling dev merujuk ID yang sama. Setiap skenario memiliki expected result, bukan state dipaksa oleh halaman.

## Batas integrasi setelah UI selesai

Adapter live dikerjakan dalam pekerjaan terpisah setelah kontrak DTO/error disetujui dan bukti gate [register backend](/mnt/code/projects/jobs/pulang/current-booking/docs/gap/README.md) tersedia. Prioritas handoff: catalog/search/occupancy → Money/rate/quote/policy → idempotency/hold/access → payment/status/recovery → inventory/notification/real-DB verification sesuai scope.

Mock tetap tersedia untuk regression. Font/logo/media resmi dibutuhkan sebelum menyatakan fidelity final; provider, access model, stock, child/breakfast rules dan final policies dibutuhkan sebelum integrasi terkait. Tidak ada gate tersebut yang dianggap selesai dari rencana ini.

## Rujukan tooling

Nuxt `useState` menyediakan state SSR-safe yang harus serializable; shared mutable module state perlu dihindari. Komponen runtime diuji dengan tooling Nuxt bila diperlukan, dan typecheck dijalankan eksplisit. Rujukan resmi diperiksa 3 Oktober 2026: [state management](https://nuxt.com/docs/4.x/getting-started/state-management), [testing](https://nuxt.com/docs/4.x/getting-started/testing), [typecheck CLI](https://nuxt.com/docs/4.x/api/commands/typecheck).

Tidak memasang dependency atau menjalankan build/tests pada tahap perencanaan ini. Versi final, command hasil QA dan checkboxes completion diisi saat implementasi.
