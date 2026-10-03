# Guest refund status — RF

Owner scope F14 guest/M3. Tasks RF-01–04 di [tracker](../02-task-tracker.md). Referensi [finance handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/finance_handler.go:197) dan [existing detail](/mnt/code/projects/jobs/pulang/mimiking-booking-secure/app/pages/booking/my/[id].vue).

## Outcome dan baseline

Tamu login membuka detail booking dan memperoleh status refund miliknya. Existing BFF route sudah session-protected/no-store; existing detail fetch memakai catch→null sehingga server unavailable tampak seperti tidak ada refund. Perbaikan difokuskan pada state eksplisit, redaction, dan verifikasi.

## Flow dan states

Detail booking dan refund dimuat independen; kegagalan refund tidak menghilangkan detail/receipt. Refund loading memiliki skeleton/status. Response has_refund=false menunjukkan belum ada refund tercatat, tidak menjanjikan hak refund. has_refund=true menampilkan amount/currency, tanggal, status dan reference aman bila dibutuhkan. Pending berarti proses; succeeded berarti hasil server; failed memberi bantuan tanpa tombol kirim refund baru. Unknown enum ditampilkan sebagai status belum diketahui, bukan selesai.

401 membersihkan guest state dan menuju login dengan returnTo internal; 404 generik tanpa mengungkap keberadaan booking lain; 501/503 menampilkan status belum tersedia dengan manual retry. Refresh mempertahankan item lama sebagai stale, bukan mengubahnya menjadi kosong. Navigasi ke booking lain/logout membatalkan atau mengabaikan response lama.

## File dan kontrak

- Reuse `server/api/bff/guest/bookings/[id]/refund-status.get.ts` dan `shared/types/backend.ts`; tambah allowlisted response mapper bila diperlukan.
- Extract `app/components/booking/RefundStatusPanel.vue`; simplify `app/pages/booking/my/[id].vue`; composable hanya jika state logic perlu reuse/test.
- Browser menerima id, amount_minor, currency, status, created/updated_at dan reason guest-safe; actor_id/actor_role, payment_attempt_id, provider_refund_id dan internal metadata tidak diperlukan. Jangan copy upstream object lengkap.
- Money IDR exponent0; unknown currency tidak dipaksa menjadi rupiah. Null arrays/invalid money ditangani schema error; reason dirender escaped text.

## TODO dan acceptance

- [ ] RF-01: loading/no-refund/one/multiple/partial/pending/succeeded/failed/unknown/error panels, manual refresh dan bantuan.
- [ ] RF-02: BFF redaction, view model mapping, per-booking fetch guard, 401 cleanup, no-store.
- [ ] RF-03: unit/contract tests null/empty/invalid money, text escaping, 404/503, two sessions, logout/reload, stale response after navigation.
- [ ] RF-04: current backend connected owner GET200 dan non-owner404; bukti jumlah/status sesuai ledger fixture tanpa memicu refund uang nyata.

Selesai UI/contract ketika detail tetap berfungsi pada refund error dan seluruh states lulus. Connected verification terpisah setelah guest deployment tersedia. Refund panel tidak menyediakan cancel/request/refund mutation dan tidak mengklaim semua cancelled booking otomatis direfund.
