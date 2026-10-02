# FE-04 — status, hold dan recovery UI

Status IMPLEMENTED FOR LOCAL DEMO (3 Oktober 2026). Depends FE-03. Backend gates BE-G09–G13/G16/G20. Status pages dan scenario dev tersedia tanpa integrasi payment/provider.

Target: `pages/booking/status/[id].vue`, `BookingStatusPanel.vue`, `HoldTimer.vue`, `useBookingClient.ts`, `data/scenarios.ts`.

## State contract

| State UI | Pesan dan aksi |
|---|---|
| Pending payment | Total, room/stay, deadline demo, lanjut simulasi |
| Processing | Sedang memeriksa pembayaran; jangan submit charge baru |
| Confirmed demo | Ringkasan + ID demo; label tidak ada reservasi nyata |
| Failed | Pembayaran gagal demo; retry sesuai attempt policy |
| Expired | Hold expired demo; search/quote ulang, harga bisa berubah |
| Needs assistance | Pembayaran terlambat/hasil belum pasti; kontak hotel dan reference |
| Unauthorized/not found | Tidak tampilkan detail guest; jalur recovery aman |
| Offline/service error | Status belum diketahui; retry status, bukan bayar ulang |

- [ ] Semua state tersedia melalui scenario switch khusus dev; scenario choice tidak menjadi production status authority.
- [ ] HoldTimer berdasarkan expiresAt dan serverTime dari mock/server, bukan t+30m FE. Zero timer tidak otomatis set expired/confirmed; trigger refresh status.
- [ ] Pada integration, return gateway query `success=true` hanya signal untuk check status backend. Poll bounded/backoff, stop ketika terminal/unmount, resume on visibility; tidak perlu SSE saat ini.
- [ ] Late payment tidak dipaksa confirmed; tampilkan assistance dan reference sampai backend merekonsiliasi.
- [ ] Confirmation demo memuat policy/stay/contact; jangan klaim email dikirim. Download receipt/ICS optional tahap lanjut, bukan wajib UI pertama.
- [ ] Copy booking UUID/access terpisah; access token tidak dicetak sebagai reference publik atau di log.

## Acceptance

- [ ] Expired/offline/pending/failed/confirmed demo bisa diinspeksi tanpa transaksi nyata.
- [ ] Test timer drift/visibility/unmount; tidak ada interval leak atau polling tak terbatas.
- [ ] Screen reader menerima status change yang penting tanpa announce tiap detik.
- [ ] Direct route ID invalid/missing draft tidak memperlihatkan fixture orang lain atau seolah booking hotel ditemukan.
