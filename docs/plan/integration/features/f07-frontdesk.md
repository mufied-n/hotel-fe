# F07 — Operasi front desk dan masa menginap

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M4. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/07-front-desk-stay-operations-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/07-front-desk-stay-operations-2026-10-03.md).

## Outcome dan baseline

Sesi staf terverifikasi → cari/baca booking → action eligibility → check-in assignment/check-out/no-show → refresh/audit feedback.

Baseline terverifikasi: Belum ada staff workspace. Check-in/out/no-show sudah ada; reservation worklist dan trusted staff login belum ditemukan.

## Kontrak dan perilaku

GET bookings/{id}; POST .../check-in, /check-out, /no-show. Tidak ada GET staff booking collection pada snapshot.

Bangun layout/forms/actions dengan contract mock, jangan aktifkan proxy staff ke publik. Login bukan role dropdown. UI tampilkan assigned room numbers dari response, server errors dan expected domain transitions. Tanpa worklist API, detail-by-ID hanya kapabilitas terbatas, bukan semua reservations. Role/scope berasal dari server identity.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/layouts/staff.vue; app/pages/staff/reservations/{index,[id]}.vue; app/components/staff/StayActions.vue; app/services/staff-client.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F07-UI:** Workspace frontdesk mobile/table, detail forms/action confirmation dan conflict UI dengan mock.
- [ ] **F07-API:** Staff adapter hanya setelah trusted identity + worklist contract; endpoint operasi existing diuji sandbox terisolasi.
- [ ] **F07-QA:** Contract action/state tests, lalu connected trusted staff session tests dan DB assignment evidence dari BE.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R01 gate mutasi/read staf live; F12 identity, worklist/filter contract dan property scope. Early checkout/no-show policy BE owner.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Role forbidden, non-owner property, stale status409, assignment unavailable/retry, repeated operation, early/no-show boundary, checked-out terminal.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
