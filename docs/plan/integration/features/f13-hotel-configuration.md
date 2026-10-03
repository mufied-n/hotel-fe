# F13 — Metadata hotel dan konfigurasi kebijakan

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M5. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/13-hotel-policy-and-configuration-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/13-hotel-policy-and-configuration-2026-10-03.md).

## Outcome dan baseline

Guest membaca policy snapshot quote/receipt; staff mengedit approved config ketika versioned API tersedia.

Baseline terverifikasi: Hotel metadata static FE dan receipt backend tersedia; config read/write/version API belum ditemukan.

## Kontrak dan perilaku

Quote cancellation_description dan receipt hotel_info/stay_details/policies tersedia. Endpoint management config belum terdaftar.

Server snapshot berotoritas untuk booking; fallback static contact harus provenance-approved dan tidak mengubah history. Pisahkan check-in time, cancellation cutoff, hold dan quote TTL. Jangan menggabungkan aturan vendor non-refundable dengan flexible quote tanpa validasi.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/settings.vue; app/services/hotel-config-client.ts; app/data/hotel.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F13-UI:** Policy/metadata display dan staff configuration forms dengan conflict/error states.
- [ ] **F13-API:** Wire existing quote/receipt fields; WAITING_BE untuk management config.
- [ ] **F13-QA:** Snapshot regression tests dan owner review atas copy/hotel policy; history unchanged setelah config change.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

C06/C12, BE-R12; approved policy/contact/source-assets dan versioned config/read/write/audit contract.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Old booking retains policy, current config changes, invalid timezone, conflicting cutoff values, unavailable contact/assets; safe links.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
