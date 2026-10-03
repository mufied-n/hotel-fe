# RD-00 — Scope, baseline, dan keputusan desain

Status: PLANNED. Owner: UI/UX dan FE. Referensi: [analisis landing](../../research/official-landing-ux-analysis.md), [design system observasi](../../research/official-design-system.md).

## Baseline yang diperiksa

HEAD FE pada penyusunan: `d1681b5`, **dengan working tree berisi banyak perubahan dan file baru**. Snapshot source working tree menjadi dasar plan, bukan klaim seluruh fitur telah committed atau live. Tidak menjalankan ulang aplikasi/tests pada pekerjaan perencanaan ini.

| Source | Keadaan dari inspeksi | Arah perubahan |
|---|---|---|
| `nuxt.config.ts`, `package.json` | Nuxt 4/Vue/TS; root redirect; scripts lint/unit/E2E/build | Pertahankan tooling dan route utama |
| `app/layouts/booking.vue` | Header, notice mode sticky, footer | Shell responsif dan notice mode yang jelas dengan ruang lebih efisien |
| `app/components/brand/BrandHeader.vue` | Logo dibuat dari teks | Slot aset resmi dengan fallback berlabel |
| `app/assets/css/{tokens,base,components}.css` | Oranye, panel 32px; heading global besar; kelas staff berbagi file | Pisahkan skala guest/staff serta aturan print; hindari kebocoran CSS |
| `app/pages/booking/index.vue` | Intro tanpa foto dan form luas; copy fixture/teknis | Hero singkat dan search yang langsung terlihat |
| `app/pages/booking/results.vue`, `RoomCard.vue` | Pemilihan varian/paket inline; satu pilihan berlaku untuk jumlah kamar | Card lebih mudah dipindai, pilihan bertahap, batas multi-room dalam bahasa tamu |
| `app/pages/booking/rooms/[id].vue` | Detail memakai tanggal baru; link results tanpa query | Pertahankan konteks pencarian; direct entry punya recovery eksplisit |
| `app/components/booking/BookingSteps.vue` | Label step disembunyikan pada mobile | Tampilkan nama tahap aktif dan progres yang terbaca |
| `BookingSummary.vue`, `BookingStatusPanel.vue` | Ada quote/policy, timer/status, copy teknis | Hierarchy transaksi, state/copy mode yang akurat |
| `app/pages/booking/login.vue`, `my/**` | OTP/list/detail/receipt tersedia; beberapa aksi historis masih terbatas | Auth tanpa onboarding wajib; capability state yang jelas |
| `app/layouts/staff.vue`, `app/pages/staff/**` | Workspace sample dan role preview sudah ada | Layout operasional konsisten; capability lock dipertahankan |
| `public/asset-manifest.json` | `placeholder-only`; daftar aset kosong | Handoff logo/font/foto dan provenance per file |
| `app/data/hotel.ts` | Kontak/alamat fixture berbeda dari official yang diamati | Rekonsiliasi metadata sebelum menambah link bantuan |
| `tests/e2e/booking.spec.ts` | Delapan skenario deklaratif pada source, termasuk guest/staff | Perbarui selector/copy serta tambah regresi yang relevan; bukan bukti pass baru |

## Scope route

Guest: `/booking`, `/booking/results`, `/booking/rooms/:id`, `/booking/guest`, `/booking/review`, `/booking/status/:id`, `/booking/login`, `/booking/my`, `/booking/my/:id`, `/booking/my/:id/receipt`.

Staff: login/index/forbidden/session-expired; front-desk dan handover; housekeeping; booking stay; finance/index/cases/refunds; catalog/inventory; rates/promos; channels; notifications; configuration; audit. Detail per kelompok dimiliki RD-05.

Tidak menambah marketing Home/Rooms/FAQ, social feed, marketplace, onboarding registrasi, wishlist, atau dashboard analytics baru. Link official/help hanya ditambahkan bila destination dan metadata terverifikasi. Staff termasuk rencana fase lanjutan agar istilah webapp memiliki cakupan jelas.

## Keputusan kerja

1. **Identitas:** monokrom, oranye brand, foto PULANG, editorial display, whitespace, panel/pill. Olive/lime referensi tidak dipakai sebagai accent baru.
2. **Bahasa:** Bahasa Indonesia dan IDR mengikuti kontrak FE sekarang. Marketing boleh ekspresif; transaksi dan error langsung. Jangan menambah switch locale/currency palsu.
3. **Discovery:** gambar dan informasi ringkas lebih dahulu; varian/paket dibuka saat dibutuhkan, tetap bisa dibandingkan.
4. **Checkout:** satu aksi utama per tahap; summary desktop sticky, mobile total/action contextual. Tidak menumpuk dua bar bawah fixed.
5. **Login:** akses untuk mengelola booking, bukan syarat menjelajah/mencari kamar.
6. **Staff:** berbagi brand/tokens dasar, tetapi font display dan galeri besar tidak mendominasi pekerjaan operasional.
7. **Mode:** demo/uji tetap eksplisit. Keberhasilan demo tidak memakai copy yang menyiratkan konfirmasi hotel nyata.
8. **Motion:** singkat untuk orientasi; reduced-motion; harga/kebijakan langsung tersedia.

Ini keputusan desain yang diusulkan dalam plan. Tidak merupakan brand guideline resmi hotel atau aktivasi capability.

## Batas kontrak dan perubahan logic

- Quote/client tetap authority harga; tidak menghitung ulang tarif, pajak, refund, atau status dari komponen visual.
- `Money` sekarang mendukung exponent 0/2; gunakan helper/view model sesuai mode, jangan memperbaiki tampilannya dengan pembagian angka ad hoc.
- Source results sekarang menduplikasi satu varian/rate untuk seluruh kamar. Tulis “Semua kamar menggunakan tipe dan paket yang sama” bila batas ini berlaku; pemilihan berbeda per kamar menunggu kontrak/implementasi tersendiri.
- Timer mengikuti deadline server, bukan transisi halaman atau animasi. Return payment tidak dianggap confirmed.
- Allowed actions, ownership, guest session, CSRF, permission dan capability locks dipertahankan. Redesign tidak membuka aksi historis yang credential/API-nya belum tersedia.
- Perubahan state/query yang diperlukan untuk UI boleh direncanakan secara sempit, dengan regresi. Perubahan endpoint/domain/sesi masuk owner integrasi dan harus dicatat sebagai dependency, bukan disisipkan ke styling.

## Acceptance RD-00

- [ ] Baseline working tree dan route inventory diperbarui saat mulai implementasi; perubahan pengguna tidak ditimpa.
- [ ] Aset dan metadata yang tersedia/pending dicatat berdasarkan file nyata.
- [ ] Batas multi-room, media, rate plan, OTP, payment recovery, dan historical cancellation diperiksa ulang dari source sebelum mockup final.
- [ ] Kontrak yang diperlukan dibedakan dari pilihan UI; tidak ada capability yang dijanjikan karena tampilan referensi.
- [ ] Tiga layar representatif, state, dan ukuran viewport untuk review ditetapkan.
