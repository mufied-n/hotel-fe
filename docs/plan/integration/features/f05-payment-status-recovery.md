# F05 — Pembayaran, status dan pemulihan

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M1/M3. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/05-payment-hold-and-recovery-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/05-payment-hold-and-recovery-2026-10-03.md).

## Outcome dan baseline

Create response → secure same-device access → pending invoice → provider redirect → fetch status backend → terminal/assistance.

Baseline terverifikasi: Panel demo/scenario dan timer interval relatif; tombol lanjut simulasi belum terhubung.

## Kontrak dan perilaku

Create mengembalikan booking, guest_access_token, payment_url, reference, expires_at, server_time. GET bookings/{id} memakai X-Guest-Token; guest detail untuk logged-in path. Fake-pay POST development-only.

Simpan akses post-create di cookie HttpOnly/session BFF; token jangan di URL. Validasi HTTPS/provider origin allowlist payment_url, localhost fake hanya dev. Link pembayaran response awal dapat dipertahankan same-device dengan TTL; jangan mengarang resume endpoint. Polling bounded (usulan5s pending, berhenti terminal/hidden, refresh on focus), timeout/backoff; cancellation AbortController. Timer pakai elapsed monotonic/time anchor, expiry hanya memicu re-fetch bukan menetapkan expired. GET tanpa server_time memakai observedAt BFF dengan label batas akurasi; butuh server clock anchor untuk deadline presisi.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/booking/status/[id].vue; app/components/booking/BookingStatusPanel.vue; app/composables/{useHoldTimer,useBookingStatus}.ts; server/api/bff/bookings/[id]/*`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [x] **F05-UI:** Rework pending/confirmed/failed/expired/cancelled/stay statuses, action link/poll/manual refresh dan assistance state.
- [ ] **F05-API:** Private status fetch, persisted post-create access, validated payment redirect, bounded polling/clock; fake adapter gate development.
- [ ] **F05-QA:** Connected test create→provider sandbox callback→status; mock network/clock tests terpisah. Same-device resume dibuktikan, cross-device limitation dicatat.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R08/R13–R16; recovery lintas perangkat/invoice lookup belum ditemukan. UI bantuan tersedia tanpa POST ulang bila hasil create ambiguous.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: payment=success/failed tidak mengubah status; refresh setelah create; cookie hilang; polling overlap; tab sleep; late callback; hold expired; network lost after submit. Fake confirmation hanya lewat explicit dev action.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
