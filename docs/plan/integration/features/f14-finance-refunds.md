# F14 — Finance, rekonsiliasi dan refund

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M3 guest / M4 staff. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/14-finance-reconciliation-and-refunds-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/14-finance-reconciliation-and-refunds-2026-10-03.md).

## Outcome dan baseline

Tamu login → lihat status refund; staf finance verified → ringkasan/cases → review tindakan/nominal → execute → status.

Baseline terverifikasi: API baru refund/cases/resolve/reconciliations dan guest refund-status sekarang terdaftar; source gap audit sebelumnya mendahului tambahan ini.

## Kontrak dan perilaku

GET guest/bookings/{id}/refund-status. POST finance/refunds {booking_id,amount_minor,reason}; GET finance/cases?status&limit; POST cases/{id}/resolve {action,notes}; GET finance/reconciliations.

Guest view map has_refund/refunds[] dan pending/succeeded/failed dari server; refund bukan cancel. Staff POST refund dapat mengeksekusi uang, bukan sekadar submit request. Dialog harus menyebut dampak dan tidak retry otomatis pada timeout. Nilai integer IDR; actor dari upstream verified principal, bukan browser. Resolve action reallocate/refund perlu actual semantics handoff.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/components/booking/RefundStatusPanel.vue; app/pages/staff/finance/{index,cases,refunds}.vue; app/services/finance-client.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F14-UI:** Guest refund panel sekarang; staff reconciliation/case/refund UI dan confirmation dialogs dengan mock.
- [ ] **F14-API:** Wire guest refund read existing; staff integration WAITING_BE trusted identity dan refund acceptance, lalu sandbox mutation terkontrol.
- [ ] **F14-QA:** Connected guest ownership test; staff provider sandbox membuktikan jumlah/status tanpa real-money request dan tanpa duplicate retry.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R01/R13–R16 dan delta review finance baru: authorization, concurrency saldo/refund idempotency, timeout/recovery/provider mode belum dianggap terbukti hanya karena route ada.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: No refund, partial/multiple, failed/pending unknown, over-refund409, unpaid409, gateway502, non-owner404, forbidden403, duplicate intent, timeout tanpa auto-repeat.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
