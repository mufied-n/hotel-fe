# F09 — Pengelolaan tarif, paket dan promo

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M4. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/09-rate-plan-and-promo-management-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/09-rate-plan-and-promo-management-2026-10-03.md).

## Outcome dan baseline

Guest memilih paket/promo dan melihat quote; staff management dirender setelah CRUD/version contract tersedia.

Baseline terverifikasi: Static ratePlans demo berbeda code BE; engine punya dua plan dan promo OCTOBREAK.

## Kontrak dan perilaku

POST quotes mendukung room_only/bed_and_breakfast dan promo_code. Tidak ada GET/CRUD rate-plan atau promo administration pada snapshot.

Hapus rate code demo room-only/breakfast lewat mapper eksplisit. Jangan menetapkan15% di UI sebagai sumber harga; angka itu hasil current engine dan quote. Form staff tidak menyimpan harga seolah memengaruhi BE bila API belum ada. Preview quote harus response server dan tidak mengubah quote yang telah diaccept.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/rates.vue; app/pages/staff/promos.vue; app/components/staff/RateEditor.vue`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F09-UI:** Guest package/promo errors + staff rate/promo forms berbasis spec.
- [ ] **F09-API:** Wire quote package/promo existing; management adapter diaktifkan setelah contract tersedia.
- [ ] **F09-QA:** Quote comparison tests dan contract management validation; tidak mengklaim CRUD sampai connected evidence.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R09/R10, C01–C04 rate/promo/rounding authority. Rate/promo CRUD/version/validity/quota API dependency.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Invalid promo400, plan invalid400, promo mengubah cancellation, occupancy/breakfast boundary, quote version expired; no tariff client authority.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
