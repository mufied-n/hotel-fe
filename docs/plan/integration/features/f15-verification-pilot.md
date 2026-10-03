# F15 — Verifikasi, aksesibilitas dan pilot

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M6. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/15-operational-verification-and-hotel-pilot-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/15-operational-verification-and-hotel-pilot-2026-10-03.md).

## Outcome dan baseline

Contract tests → BFF security tests → connected isolated BE smoke → provider sandbox → device QA → scoped pilot signoff.

Baseline terverifikasi: Unit/Chromium demo evidence lama tersedia; belum bukti adapter/BFF/connected flow baru.

## Kontrak dan perilaku

Semua endpoint yang enabled diuji sesuai auth/environment; /healthz liveness dan /ready dependency bukan proof feature complete.

Pisahkan UI/mock PASS, actual backend PASS, provider sandbox PASS dan physical device PASS. Catat FAIL/SKIP/NOT_RUN, source identity/migration/provider mode dan DB effects/cleanup. Jangan menjalankan BE integration helper destructive terhadap DB pengguna. Pilot enable per capability; rollback menutup mutasi baru tanpa memalsukan existing status.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `tests/unit/*; tests/e2e/*; docs/qa/integration/*; docs/plan/integration/02-task-tracker.md`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F15-UI:** Manual responsive/accessibility checks dan evidence checklist; fix blocking UI defects.
- [ ] **F15-API:** Connected smoke matrix/environment script, provider sandbox and SSR/BFF security evidence.
- [ ] **F15-QA:** Physical-device/pilot runs, signed acceptance per capability dan final tracker status tanpa silent SKIP.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

Bergantung milestone sebelumnya dan BE owner acceptance. Physical Safari/iOS/Chrome Android/screen reader tidak otomatis selesai dari screenshot/Playwright desktop.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: End-to-end single/multi-room supported, OTP/ownership/logout, payment recovery, receipt/ICS/refund, forbidden staff, responsive/keyboard and actual device. Rollback/restart restores pending access.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
