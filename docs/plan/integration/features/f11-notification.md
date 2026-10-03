# F11 — Notifikasi dan status pengiriman

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M5. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/11-notification-delivery-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/11-notification-delivery-2026-10-03.md).

## Outcome dan baseline

Tamu membaca booking confirmation; staff memantau accepted/sent/delivered/failed dan retry yang diizinkan.

Baseline terverifikasi: Resend confirmed/OTP ada; FE belum memiliki status delivery dan administration.

## Kontrak dan perilaku

Belum ada notification delivery/list/retry API. OTP challenge response memberikan cooldown, bukan delivery ledger.

Confirmation UI tidak menyatakan email delivered berdasarkan booking.confirmed. Jangan membuat POST resend baru sendiri. BFF tidak mengirim email dari provider key; side effect tetap BE. Tampilkan copy request diterima dan recovery yang sesuai.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/notifications.vue; app/components/booking/NotificationStatus.vue`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F11-UI:** Guest copy dan staff delivery table/filter/detail/mock retry states.
- [ ] **F11-API:** WAITING_BE untuk delivery/retry; OTP challenge integration milik F02 tetap berjalan.
- [ ] **F11-QA:** Uji terminology/status mapping; connected provider sandbox vs actual inbox delivery evidence dipisahkan.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R17, BE-G16; event coverage, delivery ledger, templates/retention/retry permission dan API contract.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Accepted tanpa delivery, provider429/down, duplicate retry intent, template failure, email redaction, restricted access.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
