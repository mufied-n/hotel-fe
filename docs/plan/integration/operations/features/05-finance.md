# Finance workspace — FIN

Owner F14 staff/M4. Tasks FIN-01–04. Referensi [handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/finance_handler.go), [service](/mnt/code/projects/jobs/pulang/current-booking/internal/finance/service.go), [model](/mnt/code/projects/jobs/pulang/current-booking/internal/finance/model.go).

## Routes dan data

`/staff/finance`: settled/refunded/net captured, open cases, refund count. Data berupa agregat saat ini; tidak mengarang grafik time series atau date-range filter karena query tersebut belum tersedia.

`/staff/finance/cases`: status/limit, rows/detail case type/status/amount/reference/notes/resolution. `total` dari handler adalah jumlah rows response, bukan total semua cases. Tampilkan batas hasil dan manual refresh; tidak menawarkan next page/cursor tanpa API. Detail dapat memakai row list karena GET case detail belum tersedia.

`/staff/finance/refunds`: booking ID, amount integer IDR, reason minimal 5 karakter sesuai service; review booking/amount/reason/dampak uang. Tidak ada refundable balance endpoint, sehingga live form tidak mengklaim remaining amount dari hitungan lokal atau memaksakan saldo booking total sebagai captured. Mock fixture boleh menampilkan balance sample. Refund history guest bukan endpoint staff refund history.

## Refund outcome

Submit hanya sekali, result berdasarkan response.refund. HTTP201/status=success bukan jaminan refund succeeded: baca refund.status. Pending/succeeded/failed/unknown memiliki copy berbeda. 409 OVER_REFUND_EXCEEDED/BOOKING_NOT_PAID, 404 BOOKING_NOT_FOUND, 400 INVALID_AMOUNT/REASON_REQUIRED, 502 GATEWAY_REFUND_FAILED, timeout dan 5xx dipetakan. Timeout/gateway failure tidak otomatis diulang karena provider outcome bisa ambigu; perlu lookup/durable intent/reconciliation dari BE sebelum activation.

Reference refund dibuat BE berbasis waktu, bukan stable client intent pada source ini. FE tidak menambahkan Idempotency-Key seolah sudah didukung. Tombol double-submit guard mengurangi kesalahan pengguna tetapi tidak menutup duplicate/concurrency backend.

## Resolve outcome

Dialog action/notes hanya sample sampai action enum dan semantics divalidasi BE. Source ResolveCase meneruskan action ke store; tidak memanggil refund gateway atau room allocation. UI harus menyebut catatan resolusi, bukan dana sudah dikembalikan atau kamar sudah dialokasikan. Refund/realokasi actual perlu bukti workflow terpisah. CASE_ALREADY_RESOLVED409 merefresh state; modal tidak otomatis mengulang request.

## File target

`app/pages/staff/finance/{index,cases,refunds}.vue`; components `ReconciliationSummary.vue`, `PaymentCaseDetail.vue`, `RefundForm.vue`, `ResolveCaseDialog.vue`; operations DTO/client/fixtures; finance BFF routes pada matriks. Amount formatter yang sama dipakai guest/staff, tanpa menggandakan transport guest API. Raw provider error/internal DB detail tidak dipantulkan ke UI.

## TODO dan acceptance

- [ ] FIN-01: summary/case list/detail/filter, empty/unavailable/stale, unknown case/status, multiple currencies fallback.
- [ ] FIN-02: sample refund review/result and resolve record dialog; amount safe integer validation, failed/pending/unknown paths, no auto-repeat.
- [ ] FIN-03: explicit BFF payload validation, no client actor, request/capability denial, 409/502/timeout contract fixtures, SSR financial data isolation.
- [ ] FIN-04: trusted finance permission/read; provider sandbox refund and durable status proof; concurrent over-refund/duplicate request acceptance; resolution action semantics; outcome recovery.

Activation refunds membutuhkan trusted identity, approved sandbox/provider mode, durable idempotency/recovery dan over-refund concurrency proof. Nil gateway mock-success di BE tidak boleh menjadi bukti pengembalian dana nyata. Finance read boleh diaktifkan lebih awal setelah auth; refunds dan resolve masing-masing capability terpisah.
