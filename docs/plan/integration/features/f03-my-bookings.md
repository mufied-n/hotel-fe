# F03 — Booking Saya dan detail privat

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M2. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/03-my-bookings-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/03-my-bookings-2026-10-03.md).

## Outcome dan baseline

Login → daftar milik sesi → filter → detail → aksi yang benar-benar tersedia → refresh aman.

Baseline terverifikasi: Belum ada daftar booking; status demo hanya berdasarkan map proses.

## Kontrak dan perilaku

GET guest/bookings?status=all|upcoming|completed|cancelled&limit=20 → {data,total}; GET guest/bookings/{id} → {booking,allowed_actions}.

Email ownership dari sesi upstream, bukan query input. Preserve domain status pending/confirmed/checked_in/checked_out/cancelled/expired/failed/no_show. total sekarang jumlah response, bukan total semua booking; jangan tampilkan pagination fiktif. allowed_actions adalah input eligibility, tetap cek capability/policy/error. Detail login dan post-create status memiliki auth transport berbeda.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/booking/my/index.vue; app/pages/booking/my/[id].vue; app/components/booking/MyBookingCard.vue; app/services/guest-client.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [x] **F03-UI:** Halaman daftar/detail, status chips, filters dan empty/error/login recovery.
- [ ] **F03-API:** Session-owned fetch dan DTO mapper; request cancellation/dedup, no-store dan kemampuan aksi terverifikasi.
- [ ] **F03-QA:** Dua akun/two-context isolation dan ownership; tampilkan response total yang benar dan filter tanpa kebocoran PII.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R05/R15; cursor belum tersedia. Read list/detail dapat diintegrasikan sekarang dengan empty/error/401/404; pagination penuh menunggu kontrak.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Empty200 [], non-owner404, expired401, refresh/deep link, filter changed stale response, >limit dataset tanpa klaim semua booking, status/room name historis.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
