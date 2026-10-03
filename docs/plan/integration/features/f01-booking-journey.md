# F01 — Pencarian, quote dan checkout

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M1. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/01-booking-journey-completion-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/01-booking-journey-completion-2026-10-03.md).

## Outcome dan baseline

Katalog → search → satu varian/paket untuk jumlah kamar → quote server → guest → review → create → status.

Baseline terverifikasi: UI demo sudah ada; client masih mock, Money exponent2 dan selection mixed per kamar berbeda dari v1 backend.

## Kontrak dan perilaku

GET catalog/rooms + search/availability; POST quotes/bookings. room_type_id, rate_plan_code, check_in/out, num_rooms, num_guests, promo_code; create memakai quote_id dan flat guest fields.

IDR rupiah integer/exponent0; breakdown room/breakfast/discount/tax dari server. Search price diberi label harga kamar sebelum tambahan, bukan total final. Gunakan quote_id/expiry/policy server, dua consent terms/privacy, phone dan HH:mm arrival. Hapus navigasi ganda SearchForm; invalidasi quote/consent/attempt ketika input berubah. Booking v1 hanya satu varian dan paket, jangan pecah mixed cart menjadi create terpisah.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/booking/{index,results,guest,review}.vue; app/components/booking/{SearchForm,RoomCard,PriceBreakdown,BookingSummary}.vue; app/services/api-booking-client.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [x] **F01-UI:** Rework search/results, selection tunggal, guest fields dan review; default tanggal Asia/Jakarta dinamis, mobile dan keyboard.
- [ ] **F01-API:** Adapter search/quote/create, stable UUID attempt dan body bytes; error mapping, secure ownership receipt, capability gate sandbox.
- [ ] **F01-QA:** Contract tests payload/uang/capacity + connected flow search→create→status pada DB uji; pastikan perubahan consent/harga tidak diterima diam-diam.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R06–R12, R18; kapasitas/num_guests dan breakfast multi-room harus dikunci kontraknya. Pilihan room_only satu kamar dapat menjadi vertical slice awal, multi-room/breakfast diuji terpisah sebelum aktivasi.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Ubah input setelah quote; sold-out saat create; invalid promo; quote expired/mismatch; raw-body retry; dua browser tidak berbagi draft. Total FE identik server tanpa skala100 atau diskon demo27%.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
