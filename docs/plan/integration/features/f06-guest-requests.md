# F06 — Pembatalan dan bantuan/perubahan booking

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M3. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/06-guest-assistance-and-booking-requests-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/06-guest-assistance-and-booking-requests-2026-10-03.md).

## Outcome dan baseline

Baca policy → dialog dampak → cancel → refetch; bantuan menampilkan contact resmi bila tersedia.

Baseline terverifikasi: Belum ada aksi tamu; backend cancel langsung tersedia, workflow request/perubahan belum ditemukan.

## Kontrak dan perilaku

POST bookings/{id}/cancel memakai X-Guest-Token pada route lama. Guest login detail tidak mengembalikan token tersebut; session-based cancel belum tampak di route.

Jangan mengirim guest session sebagai X-Guest-Token; dua credential berbeda. Cancel post-create dapat dipakai bila booking token masih ada. Untuk authenticated historical booking, tunggu session-owned cancel contract atau capability token aman dari BE. Return cancelled tidak berarti refund. Change/assistance request tidak dibuat sebagai POST rebooking.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/components/booking/CancelBookingDialog.vue; app/pages/booking/my/[id].vue; app/services/guest-request-client.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F06-UI:** Dialog cancellation accessible, policy/errors, bantuan/contact dan UI perubahan dengan capability state.
- [ ] **F06-API:** Wire cancellation untuk credential yang sah; historical-session cancel dan request creation menunggu BE contract.
- [ ] **F06-QA:** Sandbox cancel membuktikan status berubah dan tidak mengklaim refund; unauthorized tidak memutasi booking.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R01/R02/R05/R12. API request/amendment belum ditemukan; session cancel credential bridge wajib. UI dialog/policy bisa selesai sebelum wire.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Non-refundable/deadline409, wrong token403, expired session401, cancelled idempotent, double click, action stale, cancel sukses tetapi refund belum diproses.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
