# F04 — Konfirmasi, receipt dan kalender

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M3. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/04-booking-confirmation-artifacts-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/04-booking-confirmation-artifacts-2026-10-03.md).

## Outcome dan baseline

Booking confirmed → baca receipt → print/save-as-PDF browser atau unduh ICS privat.

Baseline terverifikasi: Belum ada artifact UI. Receipt JSON dan ICS sudah terdaftar; endpoint PDF server belum ditemukan.

## Kontrak dan perilaku

GET guest/bookings/{id}/receipt → ReceiptDTO; GET .../calendar.ics → text/calendar, Content-Disposition, no-store.

Render hotel_info, stay_details, guest_details, room_item, pricing_breakdown, payment_summary, policies. Escape text Vue; hindari v-html. Print memakai receipt server, bukan draft. Label cetak sesuai objek backend; tidak mengklaim invoice pajak. Download melalui BFF yang menjaga auth/header/content type; jangan membentuk event ICS alternatif dari snapshot FE. QR tidak boleh berisi bearer token; perlu verifikasi payload sebelum render.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/booking/my/[id]/receipt.vue; app/components/booking/ReceiptView.vue; app/assets/css/print.css; server/api/bff/guest/bookings/[id]/{receipt,calendar.ics}.get.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [x] **F04-UI:** Receipt mobile/print, tombol cetak/download, fallback bila artifact belum tersedia.
- [ ] **F04-API:** Receipt DTO dan binary ICS passthrough allowlisted; token protected dan header no-store.
- [ ] **F04-QA:** Connected receipt/ICS ownership + visual print inspection; nyatakan browser save PDF terpisah dari server-generated PDF.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R05; metadata check-in14WIB receipt vs research15WIB adalah keputusan owner C06, jangan diganti FE diam-diam. PDF backend belum ada; browser print adalah output terpisah.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Pending artifact ditolak, non-owner404, blob/filename aman, long names/requests, total identik receipt, page breaks, no PII cached, calendar timezone/dates cocok.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
