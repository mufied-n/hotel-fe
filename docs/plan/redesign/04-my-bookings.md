# RD-04 — OTP, Booking Saya, dan layanan tamu

Status: PLANNED. Dependensi: RD-01; RD-03 untuk status/summary bersama. Owner: FE guest management. Referensi [F02](../integration/features/f02-guest-access.md), [F03](../integration/features/f03-my-bookings.md), [completion F06](../integration/completion/features/f06-cancellation-assistance.md).

## Akses `/booking/login`

Pengantar tujuan akses → email booking → kirim kode → OTP → verifikasi → kembali ke tujuan valid. Gunakan satu input OTP yang mendukung paste/autocomplete; kotak per digit tidak diperlukan untuk mengikuti referensi.

Tampilkan email tujuan, resend cooldown, ganti email, pending, invalid/expired code, rate limit, dan layanan gagal. Jangan menjelaskan HttpOnly/token sebagai copy utama pengguna. Notice demo/uji tetap benar; tidak mengklaim email sungguhan terkirim bila mode hanya simulasi.

Redirect allowlist/ownership/session behavior tetap berlaku. Login diperlukan untuk data booking pribadi; pencarian kamar tidak diubah menjadi gated login.

## Daftar `/booking/my`

Judul → filter tersedia → list booking → card berisi status, nama kamar, tanggal/malam/jumlah kamar, total, Lihat detail. Foto thumbnail hanya ketika media dapat dipadankan dengan booking; jika DTO tidak memiliki foto, gunakan fallback akurat tanpa membuat request endpoint baru hasil tebakan.

Filter all/upcoming/completed/cancelled tetap mengikuti contract sekarang. Jangan mengubah semantics filter hanya agar sama dengan referensi. Batas 20 booking saat ini perlu penjelasan manusiawi bila hasil lebih banyak; pagination/load more baru menunggu dukungan API, bukan menampilkan kontrol palsu.

State: session checking, unauthenticated, loading, ready, empty per filter, error/retry, session expired. Empty state mengarah Cari kamar. Loading tidak terlihat sebagai “belum ada booking”.

## Detail `/booking/my/:id`

Status/reference dan tanggal → kamar/paket/tamu → tindakan eligible → kebijakan → refund → permintaan khusus.

Receipt/calendar hanya tersedia sesuai allowed actions. Payment recovery lintas perangkat dan historical cancellation pada source masih memiliki keterbatasan; redesign mengganti copy teknis dengan guidance yang jujur, **tidak mengubahnya menjadi tombol aktif** sampai owner integrasi menyelesaikan kontrak credential dan URL.

Refund dipisahkan dari status reservasi: belum ada, pending, succeeded, failed, unknown, loading/error. Kesalahan mengambil refund tidak disajikan sebagai “tidak ada refund”.

Permintaan khusus mempertahankan kategori, isi, target time, riwayat, dan status respons staff. Form menjelaskan permintaan bergantung persetujuan, bukan perubahan otomatis kamar/tanggal. Feature disabled punya bantuan yang relevan, bukan empty state palsu.

## Receipt `/booking/my/:id/receipt`

On-screen receipt memakai hierarchy dokumen yang rapi; A4 print menghilangkan shell/bar/control dan mempertahankan status, reference, detail menginap, pricing, dan policy. Cetak/simpan PDF dari browser tidak dilabeli PDF server atau invoice pajak.

Uji reference/email/nama panjang dan multi-page agar total/heading tidak terpotong. Calendar tetap melalui endpoint existing, bukan file baru dibuat dari copy visual.

## Target file

- `app/pages/booking/login.vue`.
- `app/pages/booking/my/index.vue`, `app/pages/booking/my/[id].vue`.
- `app/pages/booking/my/[id]/receipt.vue`.
- `app/components/booking/{RefundStatusPanel,GuestRequestPanel,CancelBookingDialog}.vue`.
- Calon `GuestBookingCard.vue` bila list membutuhkan card reusable; jangan membuat model booking kedua.
- `app/composables/useGuestSession.ts`, `server/api/bff/guest/**`: kontrak existing, bukan target styling. Perubahan behavior hanya bila ditemukan kebutuhan yang disetujui dan mendapat regresi owner integrasi.

## Acceptance

- [ ] OTP paste/autocomplete/resend/ganti email dan returnTo valid berfungsi.
- [ ] List/detail tidak bocor pada unauthorized/expired session; error tidak dianggap empty.
- [ ] Allowed actions dan limitation API tidak diubah menjadi fitur yang tampak sudah aktif.
- [ ] Status booking/refund/request berbeda, memakai label dan icon selain warna.
- [ ] Form request menghormati enabled/disabled/pending; sample tetap jelas tidak dikirim ke hotel.
- [ ] Receipt terbaca di layar/A4, panjang data aman, heading/total tidak terpotong; status nyata atau demo tetap terlihat saat print.
- [ ] Tidak ada foto booking atau benefit yang dibuat berdasarkan tebakan.
