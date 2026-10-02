# Design system PULANG ke UTTARA — hasil observasi dan adaptasi

Tanggal: 3 Oktober 2026. Status: analisis live website + proposal implementasi; bukan brand guideline resmi yang diterbitkan hotel.

## Sumber dan bukti

- [Website resmi](https://pulangkeuttara.com/): logo, hero foto, navigasi, CTA, footer, promo.
- [Rooms](https://pulangkeuttara.com/rooms/): hierarchy, layout editorial, katalog, carousel, 360°.
- [FAQs](https://pulangkeuttara.com/faqs/): accordion, lokasi, check-in 15:00 / check-out 12:00.
- Screenshot tersimpan: [home mobile](evidence/official-home-mobile.jpg), [rooms mobile](evidence/official-rooms-mobile.jpg), [rooms desktop](evidence/official-rooms-desktop.jpg), [menu mobile](evidence/official-menu-mobile.jpg), [FAQ mobile](evidence/official-faq-mobile.jpg).
- Inspeksi computed style dan CSSOM pada browser: viewport awal 457×1022; desktop override 1440×1000, lalu dikembalikan. Ini emulasi browser, bukan QA perangkat fisik. Screenshot bisa menangkap frame transisi; ukuran di bawah berasal dari computed style, bukan perkiraan piksel gambar.

## Karakter visual yang harus dipertahankan

Identitasnya editorial, berani, berbasis foto dan kultur seni. Dominan monokrom dengan oranye sebagai titik aksi. Logo tulisan tangan PULANG dan tanda Jangan Lupa Pulang adalah aset grafis, bukan teks yang dapat diganti sembarang font. Hero foto memenuhi layar; judul sangat besar, uppercase, rapat, dengan whitespace lapang. Card kamar berganti hitam/putih dan memiliki sudut besar. Kesan premium berasal dari komposisi, foto, dan tipografi, bukan emas, gradient dekoratif, atau bayangan berlebihan.

Pada mobile, logo berada di atas dan bar aksi hitam menetap di bawah, berisi menu dan BOOK. Menu memakai bidang gelap dengan daftar uppercase; halaman aktif oranye. Pada desktop, navigasi memakai header atas. Katalog rooms menjadi dua kolom teks/foto, sementara mobile satu kolom. Carousel kamar memiliki panah dan indikator foto; tersedia link 360° untuk lima keluarga kamar. Footer gelap memuat navigasi, kontak, sosial, dan newsletter.

## Token yang benar-benar terukur

| Elemen | Observasi live | Pemakaian pada redevelopment |
|---|---|---|
| Accent | `rgb(245,129,50)` = `#F58132` | Primary CTA / active navigation |
| Ink / canvas | `#000000` / `#FFFFFF` | Teks, permukaan, section inverse |
| Teks sekunder terang | Hitam 70–75% di atas putih | Gunakan token solid yang lolos contrast untuk form |
| Teks inverse sekunder | Putih 80% di atas hitam | Detail editorial |
| CTA BOOK | 13px, 700, line-height 13px, tracking .78px, padding 8px 20px, pill | Pertahankan tampilan, perbesar hit area minimal 44px |
| CTA 360° | 12px, 700, tracking .72px, padding 8px 20px, inverse pill | Link sekunder; jangan mengecilkan label form |
| Judul intro rooms | Mobile 50.27px / 46.25px; desktop 80.64px / 74.19px; tracking -2.5% | Display scale; hindari ukuran ini untuk total/policy |
| Judul kamar | Mobile 45.7px / 42.04px; desktop 46.08px / 42.39px; tracking -2.5% | Editorial room headings |
| Body intro | 15px / 24.375px | Body marketing; booking gunakan 16px |
| Body fasilitas | 16px / 26px | Room features |
| Menu mobile | 30px / 31.5px, 700, tracking .6px | Navigasi brand |
| Footer | 17px / 25.5px; heading 700 tracking 1.7px | Footer |
| Room panel | Radius 32px; padding mobile 24px, desktop 48px | Card editorial besar |
| Room grid desktop | Dua kolom 592px, gap 24px 56px pada viewport 1440 | Contoh layout desktop, bukan hardcode lebar |
| CTA transition | 300ms `cubic-bezier(0,0,.2,1)` | Hover/focus visual |
| Menu link transition | 140ms easing sama | Navigasi |
| Section reveal | Transform scale/translate terlihat pada computed style | Reveal ringan; durasi persis belum diverifikasi |

## Tipografi: declared tidak sama dengan rendered

CSS mendeklarasikan `helveticaNow` Text regular/italic/medium/bold, `Helvetica Now Display` ExtraBold/Black, serta `Montrose`. Namun seluruh elemen `main` yang diperiksa pada room page memakai computed stack `ui-sans-serif, system-ui, sans-serif...`. Karena itu belum sah menyatakan seluruh website rendered menggunakan Helvetica Now atau Montrose. Penyebab penerapan/font loading belum diaudit dari source asli.

Rencana: minta aset font brand yang telah tersedia bagi proyek saat implementasi, definisikan family/weight secara eksplisit, lalu verifikasi `document.fonts` dan computed style. Untuk UI awal gunakan fallback Arial/system sans yang dinyatakan sebagai sementara. Logo gunakan SVG/image resmi dari asset handoff. Jangan meniru logo melalui font headline, dan jangan memuat font dari URL deployment `_next` sebagai dependency permanen.

## Extension token untuk booking (proposal, bukan hasil ekstraksi)

```css
:root {
  --color-brand: #f58132;
  --color-ink: #000;
  --color-canvas: #fff;
  --color-muted: #545454;
  --color-line: #d6d6d6;
  --color-soft: #f5f5f5;
  --color-danger: #b42318;
  --color-success: #166534;
  --radius-panel: 32px;
  --radius-field: 12px;
  --radius-pill: 999px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --motion-fast: 140ms;
  --motion-base: 300ms;
}
```

Skala spacing 4px, warna status, radius field, max-width booking 1280px, dan breakpoint 768/1024 adalah keputusan desain baru untuk trial UI. Total harga: 24–32px, angka tabular, sentence-case label. Form: body 16px, helper minimal 14px, touch target 44px. Gunakan hitam di atas oranye; hindari label kecil putih di oranye tanpa uji contrast. Focus ring harus terlihat di permukaan putih/hitam/oranye.

## Komponen dan perilaku yang diwariskan

| Komponen | Brand invariant | Adaptasi transaksi |
|---|---|---|
| BrandHeader / MobileActionBar | Logo, monokrom, pill oranye | Sisakan safe area; tidak menutup tombol submit/keyboard |
| EditorialHero | Foto besar dan display type | Hero booking lebih pendek agar pencarian cepat terlihat |
| RoomGallery | Foto interior, carousel, indikator | Alt akurat, keyboard arrows, gambar gagal, tanpa autoplay wajib |
| RoomCard | Panel besar dan judul berani | Fasilitas, kapasitas, bed, pilihan paket dan total yang terbaca |
| BrandButton | Pill + uppercase pendek | Disabled/loading/focus/error; satu aksi utama per tahap |
| PolicyAccordion | Pola FAQ | Policy kritis tetap terlihat sebelum submit |
| PromoPanel | Visual promo, CTA brand | Jangan pop-up mengganggu pembayaran; promo inline di checkout |
| Footer | Hitam, kontak dan navigasi | Versi ringkas pada checkout |

## Motion dan accessibility

Gunakan fade/translate kecil untuk section marketing dan animasi singkat untuk membuka detail. Jangan animasikan angka harga hingga menunda pemahaman. `prefers-reduced-motion` menghilangkan reveal, scale, dan autoplay. Konten harus tetap ada ketika JS belum berjalan; hindari `opacity:0` permanen. Modal/menu memerlukan focus trap, Escape, restore focus, label aksesibel, dan background inert. Gambar/foto tidak menggantikan label form, harga, atau kebijakan. Form/checkout menggunakan hierarchy yang stabil walau branding homepage bersifat eksperimental.

## Batas analisis

Home, rooms, FAQ, menu, dan handoff booking diperiksa langsung. Halaman Culture, Spaces, Location, Tetangga, Events, Merch dan semua panorama belum diaudit per halaman. Rencana UI awal memprioritaskan booking; ekspansi seluruh marketing site memerlukan inventaris konten tersebut. Tidak ada klaim seluruh website lolos WCAG atau cross-browser QA. Nilai hotel 95 kamar / 15 desain adalah copy resmi; alokasi stok setiap varian belum diketahui.
