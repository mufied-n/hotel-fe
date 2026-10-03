# RD-01 — Brand, aset, shell, dan komponen

Status: PLANNED. Dependensi: RD-00. Owner: UI/UX + FE; hotel menyediakan aset/metadata. Riset terkait: LAND-04/05/11/12 dalam [analisis landing](../../research/official-landing-ux-analysis.md).

## Spesifikasi visual usulan

| Unsur | Arah | Batas |
|---|---|---|
| Canvas/ink | Putih/hitam; neutral lembut untuk pengelompokan | Beige referensi tidak mendominasi identitas |
| Accent | `#F58132`, label hitam | Status error/success memiliki warna semantic dan teks |
| Display guest | 36–64px mobile/desktop menurut layar; bold, tracking rapat | Intro lebih ekspresif; heading transaksi 28–40px |
| Body/helper | 16px body; helper minimal 14px | Jangan mengecilkan policy/biaya untuk menghemat ruang |
| Staff hierarchy | Title 24–36px; body 14–16px menurut kepadatan | Angka/tabel tetap terbaca dan dapat zoom |
| Radius | Panel 24–32px; field 12–16px; pill untuk aksi | Variasi berasal dari token, bukan angka baru per halaman |
| Spacing | Skala 4/8/12/16/24/32/48 | Card compact berbeda dari panel editorial |
| Touch/focus | Target area minimal 44×44px, focus visible di semua surface | Focus tidak memakai orange-on-orange |
| Motion | Sekitar 140–300ms, tanpa reveal wajib atau autoplay | Reduced-motion tetap memuat seluruh informasi |

Skala ini proposal untuk transaksi, bukan hasil ekstraksi seluruh official landing. Font final memakai aset yang disetujui; sebelum tersedia gunakan system fallback yang dinyatakan sementara.

## Asset dan metadata handoff

- Logo light/dark SVG atau image dengan dimensi, safe area, dan provenance.
- Font dengan weight yang tersedia dan izin pemakaian; verifikasi penerapan setelah font dimuat.
- Foto per keluarga/varian dengan mapping, urutan, alt, dimensi, crop/focal point, dan status penggunaan.
- Foto kategori tidak menjamin interior kamar tertentu. Tampilan menjelaskan variasi interior jika relevan.
- Metadata bantuan dipadankan dengan [official](https://pulangkeuttara.com/) dan sumber konfigurasi yang berlaku. Observasi official memakai `hello@pulangkeuttara.com` dan WhatsApp `+62 821 3444 4909`; fixture saat ini berbeda. Catat sumber/tanggal, jangan memilih kontak lama tanpa pemeriksaan.
- `public/asset-manifest.json` menyimpan status approved/placeholder. Screenshot riset tidak digunakan sebagai aset foto produksi. Aset placeholder tidak boleh menampilkan kamar hotel lain seolah PULANG.

## Target file

| File existing | Perubahan |
|---|---|
| `app/assets/css/tokens.css` | Semantic color/surface/typography/spacing/offset tokens |
| `app/assets/css/base.css` | Body/focus/reduced-motion, heading yang tidak memaksa semua layar memakai display besar |
| `app/assets/css/components.css` | Shared primitives; audit pengaruh `.panel`, `.badge`, `.button`, dan kelas ops |
| `app/components/brand/BrandHeader.vue` | Logo asset, header ringkas, link valid, active state |
| `app/components/brand/BrandFooter.vue` | Kontak/official link terverifikasi; notice sesuai mode, bukan copy demo permanen untuk API |
| `app/components/brand/BrandButton.vue` | Hierarchy primary/secondary/text/loading tanpa kehilangan semantic button/link |
| `app/layouts/booking.vue` | Header, notice demo/uji, spacing, footer, slot navigasi/aksi bawah |
| `app/components/ui/{FormField,InlineAlert,PolicyAccordion}.vue` | Field/error/help, contrast, disclosure, live region |
| `app/components/booking/BookingSteps.vue` | Label tahap aktif dan progres mobile |
| `app/data/hotel.ts`, `public/asset-manifest.json` | Metadata/asset provenance sesuai source yang disepakati |

Target baru **hanya jika belum tersedia ketika eksekusi**:

- `app/components/brand/MobileBookingNav.vue`: Cari kamar / Booking Saya dan akses Bantuan terverifikasi. Bantuan berupa aksi/link jelas, tidak membuat route dummy.
- `app/components/booking/BookingActionBar.vue`: satu total kontekstual, label tahap, primary CTA, pending/disabled.
- `app/components/booking/RoomGallery.vue`: media/alt/fallback, next/previous, indikator, keyboard; tidak membuat gambar autoplay.
- `app/components/ui/EmptyState.vue`: empty/unavailable dengan recovery relevan.
- `public/brand/`, `public/rooms/`: file lokal hasil handoff, bukan dependensi URL build official.

Ekstrak komponen ketika dipakai ulang atau memiliki interaksi mandiri. Hindari wrapper per heading/card yang hanya memindahkan markup sederhana. Nuxt component naming mengikuti folder saat ini.

## Shell per konteks

| Konteks | Mobile | Desktop |
|---|---|---|
| Search/results/room | Header ringkas, nav eksplorasi; hasil/detail boleh mengganti nav dengan action bar saat pilihan aktif | Header + layout hasil/detail; sidebar sesuai ruang |
| Guest/review | Step aktif, total/action bar; navigasi utama bawah tidak ditumpuk | Form + summary sticky, batas top mengikuti header/notice |
| Status/My Bookings | Status utama dan recovery; navigasi kembali jelas | Card/list dengan ruang scanning |
| OTP | Form tunggal; tanpa bottom bar yang mengganggu keyboard | Panel/form ringkas dengan konteks akses |
| Receipt print | Shell dan bar aksi tidak ikut cetak | Dokumen A4; print rules eksplisit |

Notice lingkungan tetap terlihat, tetapi tidak menjadi blok dominan pada setiap section. Panel skenario demo disimpan dalam area review/dev yang bisa dibuka; bukan kontrol utama tamu dan tidak tersedia sebagai manipulasi state API.

## Acceptance

- [ ] Header/logo dapat dibaca di atas putih, hitam, dan foto; tidak berimpit dengan judul saat scroll.
- [ ] Tidak ada dua bottom bar fixed; safe-area dan ruang akhir konten sesuai bar aktif.
- [ ] Saat keyboard terbuka, field/error dan tombol submit tetap dapat dijangkau; fixed CTA boleh kembali ke normal flow.
- [ ] Step aktif memiliki label terlihat pada mobile dan `aria-current`.
- [ ] Galeri/accordion/menu memiliki label, focus, Escape/restore sesuai pola interaksi.
- [ ] Loading layout stabil; media gagal/absen memiliki fallback akurat.
- [ ] Font/asset pending tetap tercatat; fidelity tidak dinyatakan selesai dari placeholder.
- [ ] Tiga layar representatif diverifikasi terhadap official dan brief sebelum styling diperluas.
