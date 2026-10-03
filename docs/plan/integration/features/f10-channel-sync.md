# F10 — Sinkronisasi kanal dan sumber inventory

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M5. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/10-channel-inventory-synchronization-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/10-channel-inventory-synchronization-2026-10-03.md).

## Outcome dan baseline

Tampilkan health/sync state → exception review → authorized reconciliation/retry saat API tersedia.

Baseline terverifikasi: Belum ada UI atau route channel sync pada snapshot.

## Kontrak dan perilaku

Belum ada channel mapping, cursor, reconciliation/retry API yang terdaftar. Outbox/stock lokal bukan channel API.

UI mock memuat source authority, last-success/lag/error, stop-sell state dan pending reconciliation; semua sample berlabel. Jangan menganggap available_rooms adalah gabungan semua OTA atau membuat scheduler FE menjadi sync engine.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/channels.vue; app/components/staff/ChannelSyncStatus.vue`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F10-UI:** Desain monitoring/error/conflict/channel mapping UI dan mock states.
- [ ] **F10-API:** WAITING_BE: endpoint belum tersedia; setelah handoff implement adapter tanpa menebak URL.
- [ ] **F10-QA:** Contract-first sync view tests; connected hanya setelah BE memberikan fixture, mapping dan replay evidence.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-G18/F10 authority/mapping/monotonic version/idempotency; contract onboarding/channel health/action dan ops acceptance.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Out-of-order/replayed updates, timeout/outage, stale cursor, negative stock/stop-sell, action denied; outcome dari server.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
