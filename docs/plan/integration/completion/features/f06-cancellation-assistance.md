# F06 — Cancellation, assistance dan special requests

Tasks CMP-06-*; owner FE/QA dengan contract handoff BE. Reuse current cancellation BFF dan status page, guest detail dan OPS layout. [Owner SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/06-guest-assistance-and-booking-requests-2026-10-03.md).

## Outcome dan scope

Guest membaca policy → accessible review dialog → cancel dengan credential sah → refetch authoritative status. Cancellation success menunjukkan cancelled, refund dilihat terpisah. Guest assistance menunjukkan form/history dan follow-up status tanpa menjanjikan permintaan dipenuhi atau perubahan tanggal disetujui.

Existing status page menggunakan window.confirm dan menampilkan cancel berdasarkan status saja. Ganti dengan CancelBookingDialog; eligibility berdasarkan credential/capability serta policy/deadline jika tersedia, bukan status saja. Policy tidak ada berarti belum dapat dinilai; jangan menyatakan refundable/non-refundable sendiri.

## Contract dan UI

Booking-token cancel: POST BFF existing → upstream bookings/{id}/cancel. Sesi guest historical tidak sama dengan booking token. Historical cancel tetap disabled sampai ownership credential bridge disepakati. Response non-refundable/deadline409 ditampilkan dengan policy; 401/403/404 tidak membuka PII. Timeout outcome_unknown, read dulu sebelum ulang.

Special request local BE: kategori dan description, target_time opsional; GET history. Department ditetapkan BE; creation status pending, bukan approved. Dietary/allergy notes bisa sensitif; no-store, bounded note input, escaped text, tidak masuk URL/analytics. Error400 invalid category/empty description, ownership404,401,503 FEATURE_DISABLED. Tidak menjadikan late_departure sebagai extend-stay booking mutation.

Change dates/cancellation request workflow yang belum punya API tetap sample/capability-off. Contact resmi reuse hotel metadata tervalidasi; bila belum tersedia gunakan pesan hubungi hotel tanpa nomor/tautan rekaan.

## File/TODO

- [ ] CMP-06-UI: CancelBookingDialog focus trap/Escape/return focus, review dampak/deadline, submitting/rejected/unknown/success states; GuestRequestForm/History sample.
- [ ] CMP-06-API: reuse cancel BFF; add explicit session-owned guest request GET/POST setelah freeze contract. Redact handled_by/internal staff notes sesuai handoff. Mode API failure tidak fallback mock.
- [ ] CMP-06-QA: double click, stale policy, expiry during dialog, wrong token/non-owner, timeout→read, request failed/disabled, note escape dan dialog keyboard tests.
- [ ] CMP-06-LIVE: owner/non-owner connected isolated booking; cancelled DB state dan absence refund auto-claim; request persisted satu intent atau duplicate recovery documented.

Target: existing status/[id].vue dan BookingStatusPanel.vue; components booking/CancelBookingDialog.vue, GuestRequestForm.vue, GuestRequestHistory.vue; guest-request client/types; BFF guest/bookings/[id]/special-requests routes. Paths target, tidak dianggap existing.

## Acceptance/batas

UI/contract dapat selesai dengan fixtures. Connected guest request menunggu source commit/deploy/migration00015/ff_guest_special_requests; bukan tetap “endpoint tidak ada”. Historical cancel tetap WAITING_BE. Staff queue hanya mock/permitted scope, live staff auth gate unchanged.
