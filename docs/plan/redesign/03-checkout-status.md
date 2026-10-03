# RD-03 — Detail tamu, review, dan status booking

Status: PLANNED. Dependensi: RD-01/02. Owner: FE checkout. Referensi: [integration F01](../integration/features/f01-booking-journey.md), [F05](../integration/features/f05-payment-status-recovery.md), [completion payment](../integration/completion/features/f05-payment-hardening.md).

## `/booking/guest`

Step aktif → judul ringkas → nama/email → telepon/perkiraan tiba opsional → permintaan khusus → ringkasan → Tinjau booking.

Desktop memakai form dengan summary di samping. Mobile menampilkan konteks kamar/tanggal ringkas, form, lalu total/action yang tetap dapat dijangkau. Permintaan opsional dapat dibuka tanpa memaksa pengguna mengisi semuanya. Error berada dekat field dan ringkasan error memindahkan fokus bila submit gagal; input tetap tersimpan saat back.

Nama/email/permintaan tidak disimpan pada query, screenshot publik, atau localStorage sebagai shortcut desain. Kebijakan draft/refresh mengikuti implementasi owner state yang berlaku.

## `/booking/review`

Kamar/varian/paket → tanggal/malam/jumlah kamar/tamu → data tamu dengan Edit → rincian biaya → kebijakan penting → consent terpisah → primary CTA.

Label harga menyebut scope secara eksplisit. Pajak/service yang included tidak ditambahkan lagi. Total akhir tampil konsisten pada summary dan action bar dari objek quote yang sama. Promo dijelaskan sebagai diskon yang diterapkan; quote ID/version tidak menjadi copy utama tamu.

Policy cancellation/payment/no-show yang menentukan keputusan tidak disembunyikan semuanya dalam accordion. Consent tidak dicentang otomatis. Data tamu dapat diedit tanpa kehilangan quote valid; perubahan pilihan/policy mengikuti invalidation.

Copy primary CTA berbeda menurut mode: demo tetap menjelaskan simulasi; API/uji tidak menyatakan produksi. Menekan aksi final berarti membuat booking sesuai kontrak yang tersedia, bukan hanya menyetujui visual review.

## `/booking/status/:id`

Status utama → reference → tanggal/kamar bila tersedia → apa yang perlu dilakukan → primary action yang eligible → alternatif/retry/bantuan.

| State | Copy dan hierarchy aksi |
|---|---|
| pending/pending_payment | Batas pembayaran, link valid jika tersedia, Periksa status; jangan membuat payment URL baru dari FE |
| processing | Pembayaran sedang diperiksa; Periksa status/Bantuan; jangan mendorong bayar ulang |
| confirmed | Ringkasan kedatangan dan Booking Saya; mode demo menyebut hasil simulasi |
| failed | Jelaskan kegagalan terverifikasi dan recovery sesuai client; jangan menyimpulkan dana tidak terpotong |
| expired | Batas waktu habis; status server tetap authority, cari ulang sesuai hasil verifikasi |
| needs_assistance | Hasil belum pasti, reference dan kontak verified, tanpa klaim confirmed |
| cancelled | Pembatalan terpisah dari refund; arahkan status refund bila tersedia |
| checked_in/checked_out/no_show | Label keadaan menginap akurat dan aksi yang relevan |
| loading/offline/stale/error | Tampilkan freshness/retry; status terakhir diberi label belum diperbarui |

Timer nol memicu pengecekan sesuai lifecycle sekarang; tidak mengganti status sendiri. Polling, visibility refresh, generation guard, dan unmount cleanup dipertahankan. Unknown status memakai fallback aman, bukan panel kosong atau success default.

## Target file

- `app/pages/booking/{guest,review}.vue`: layout, copy, form/review hierarchy.
- `app/pages/booking/status/[id].vue`: state layout dan recovery; lifecycle tetap dimiliki route/client.
- `app/components/booking/{BookingSummary,PriceBreakdown,BookingSteps,BookingStatusPanel,HoldTimer,CancelBookingDialog}.vue`: hierarchy, mode copy, numeric/semantic status, dialog/action state.
- `app/components/booking/BookingActionBar.vue`: total dan submit context; form submit tidak diduplikasi di luar state pending/consent owner.
- `app/composables/useHoldTimer.ts`: tidak diubah untuk styling; perubahan hanya jika ada bug lifecycle yang dibuktikan dan diuji.

Shared summary sekarang menggunakan `quote.numRooms || 1` untuk item. Saat redesign, verifikasi representasi singular/agregat dan jumlah item agar kuantitas kamar tidak digandakan oleh layout baru. Kontrak quote menentukan makna jumlah, bukan card visual.

## Acceptance

- [ ] Nama/email, optional fields, error, back/edit, dan recovery sesi hilang tetap berfungsi.
- [ ] Satu submit owner; tombol bar dan form mengikuti disabled/pending/consent yang sama.
- [ ] Total/discount/charges konsisten dengan quote; tidak ada kalkulasi visual alternatif.
- [ ] Policy dan dua consent terbaca sebelum primary action; consent tidak auto-checked.
- [ ] Double submit/retry memakai idempotency behavior yang berlaku.
- [ ] Demo confirmed tidak menyatakan hotel telah membuat reservasi nyata.
- [ ] Status stale/offline tidak menyiratkan sukses/gagal terbaru; timer nol menunggu authority server.
- [ ] Cancel dialog jelas, Escape/focus restore bekerja, refund tidak dinyatakan otomatis selesai.
- [ ] Semua status di type union punya label/aksi, dan unknown status punya recovery.
