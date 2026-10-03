# RD-08 — Animasi, feedback interaksi, dan loading

Tanggal: 3 Oktober 2026, Asia/Jakarta. Status: **IMPLEMENTED — fondasi dan guest core; QA manual lengkap masih berjalan**. Owner: FE/UI. Tracker tunggal: [RD-06](06-execution-tracker.md).

## 1. Outcome dan arah visual

Setiap aksi memberi respons yang dapat dikenali: siap ditekan, sedang ditekan, terpilih, sedang diproses, selesai, atau gagal. Gerak singkat dan terarah mengikuti karakter editorial PULANG: warna monokrom/oranye, pergeseran kecil, dan transisi yang tenang. Informasi transaksi segera terbaca.

Prioritas pertama adalah `/booking/results` yang sedang dibuka pengguna: hover tombol/link, feedback memilih kamar/paket, pending saat mengambil quote, dan loading hasil. Selanjutnya detail kamar, checkout/status, OTP/Booking Saya, lalu controls staff yang menggunakan primitives yang sama.

Tidak perlu splash screen, animasi logo pembuka, confetti, cursor khusus, bounce berulang, parallax checkout, atau perubahan angka harga bertahap. Semuanya menambah gerak tanpa membantu penyelesaian transaksi.

## 2. Baseline source dan gap sebelum implementasi pertama

| Source existing | Temuan source | Task |
|---|---|---|
| `app/assets/css/tokens.css` | `--motion-fast: 140ms`, `--motion-base: 300ms` | Tambah token press/feedback/easing dan konsistenkan pemakaian |
| `app/assets/css/components.css` | `.button:hover` mengangkat 2px dan mengganti background; tidak dibatasi pointer | Hover sesuai input; primary/dark/light punya contrast sendiri; tambah pressed/loading |
| `app/assets/css/base.css` | Reduced-motion memendekkan durasi secara global | Tambah fallback eksplisit untuk transform, spinner/shimmer berulang, smooth scroll |
| `app/components/brand/BrandButton.vue` | Props disabled/type/dark/to; belum ada busy/loading | Kontrak loading reusable yang menjaga label, ukuran, dan semantics |
| `app/pages/booking/results.vue` | Search punya pending + spinner; `continueBooking` belum punya quote pending guard; respons search belum memiliki generation guard | Pisahkan pending pencarian/quote, cegah duplicate request dan respons usang |
| `app/components/booking/RoomCard.vue` | Pilihan punya selected message, radio border; media placeholder | Feedback selected tidak mengganti fungsi radio/label; media reveal hanya ketika gambar siap |
| `app/pages/booking/rooms/[id].vue` | Initial load ada; pemeriksaan tanggal belum punya pending sendiri | Tombol tanggal busy, feedback hasil/error lokal pada panel |
| `app/pages/booking/{review,login}.vue` | Pending dan penggantian label sudah ada | Satukan visual loading dan guard; response tetap authority |
| `app/pages/booking/my/index.vue` | Loading/filter dan list bisa ditampilkan bersamaan | Bedakan initial skeleton dan background refresh dengan freshness jelas |
| `app/components/ui/{InlineAlert,FormField,PolicyAccordion}.vue` | Informasi ada; transisi belum terpadu; status/error live regions perlu koordinasi | Satu pengumuman per perubahan penting; focus/error/disclosure jelas |
| `app/components/booking/CancelBookingDialog.vue` | Native dialog memakai showModal/close | Animasi masuk sederhana; focus/close lifecycle tetap benar |
| `app/pages/booking/status/[id].vue` | Polling dan stale handling sudah ada | Refresh kecil tanpa mengulang seluruh animasi/menyembunyikan booking |

Tabel ini menyimpan baseline sebelum implementasi pertama; jangan membacanya sebagai gap current. Snapshot source lanjutan dan pekerjaan yang masih terbuka ada pada bagian 9.

## 3. Spesifikasi motion usulan

Angka berikut adalah keputusan awal desain untuk diuji di browser, bukan angka brand resmi atau hasil studi pengguna.

| Token/perilaku | Nilai awal | Pemakaian |
|---|---|---|
| Press | 90ms | Scale tombol sekitar 0.98 selama ditekan, kembali ketika dilepas |
| Hover/focus visual | 140ms | Background, border-color, icon shift 2px; focus ring langsung terlihat |
| Feedback | 180ms | Selected border/icon, pergantian label/status, alert masuk |
| Panel | 220ms | Fade + translateY maksimum 6px untuk panel/dialog masuk |
| Media | 280ms | Opacity gambar setelah load; frame memiliki ukuran tetap |
| Easing | `cubic-bezier(.2, 0, 0, 1)` | Hover, feedback, panel masuk |
| Spinner | 800ms linear per putaran | Hanya selama request tertunda dan reduced-motion tidak aktif |
| Skeleton | 1600ms pulse halus | Maksimum tiga siklus, kemudian statis sampai respons; reduced-motion langsung statis |

Gunakan explicit properties. Jangan `transition: all`, mengubah border width, atau menggerakkan seluruh layout saat hover. Animasi harga, stok, deadline, dan consent tidak digunakan.

### Hover, klik, focus, dan selection

| Elemen | Hover desktop | Click/touch/keyboard | Hasil yang menetap |
|---|---|---|---|
| Primary button | Shade oranye sedikit berubah; icon bergeser 2px | Press kecil; request mengaktifkan busy | Sukses/error mengikuti hasil aksi |
| Dark/light button | Shade/border sesuai variant; teks tetap kontras | Press kecil, focus terlihat | Tidak mewarisi background oranye dengan teks putih yang sulit dibaca |
| Link detail/back | Underline dan warna sesuai surface | Native link behavior, focus ring | Destination berubah; bukan loading sukses palsu |
| Paket radio | Border/tint ringan | Checked state, indicator, label | Pilihan tetap terlihat setelah pointer pergi |
| Tombol pilih kamar | Respons tekan | Pesan “Kamar dan paket dipilih” + selected style | Primary lanjut menjadi aktif bila selection valid |
| Card kamar berisi form | Tidak mengangkat seluruh card sebagai tautan | Hanya controls yang memang interaktif merespons | Card tidak dibuat klik penuh dengan nested links/buttons |
| Booking row yang merupakan link | Border/shadow tipis, translateY maksimal 2px | Press/focus | Buka detail booking |
| Field | Border tint ringan | Focus ring, error dekat field | Value/input tidak hilang saat invalid |
| Navigasi aktif | Tint ringan | Respons tekan | Active state tetap terlihat; tidak hanya animasi sesaat |
| Spesifikasi/fasilitas statis | Tetap statis | Tidak memberi efek tombol | Tidak memberi kesan dapat diklik |

Hover dekoratif hanya berlaku pada `(hover: hover) and (pointer: fine)`. Touch tetap memperoleh pressed/selected/busy state. Keyboard tidak bergantung pada hover dan aksi tetap memakai click/submit native; pointerdown tidak menjalankan pembayaran atau perubahan data.

## 4. Loading menurut konteks

### State dasar

`idle → pending → success | empty | error`, dengan refresh data existing dibedakan dari initial load. Busy menyala segera saat request dimulai. Loading tidak berarti sukses; mutation tidak ditandai selesai sebelum respons yang valid.

- Dalam 0–150ms: ubah label/busy/disabled segera; spinner dekoratif boleh ditunda 150ms untuk mengurangi kedipan pada respons cepat.
- Initial skeleton boleh muncul setelah 150ms; ruang konten dipesan sejak awal agar layout stabil. Respons cepat langsung tampil tanpa waktu tunggu minimum buatan.
- Jika masih menunggu setelah 8 detik: tampilkan pesan lebih lama dari biasanya. Ini informasi, bukan timeout/error atau izin mengirim ulang mutation.
- Timeout sebenarnya mengikuti kontrak client; error memberi recovery yang sesuai. Timer visual dibersihkan ketika selesai, komponen unmount, atau request digantikan.
- Tidak ada progress percentage apabila server tidak menyediakan ukuran pekerjaan yang nyata.

| Aksi/area | Visual dan copy | Yang dipertahankan |
|---|---|---|
| Cari kamar/navigation | Tombol merespons; results memakai 2 card skeleton sesuai layout, label “Mencari kamar…” | Tanggal/tamu tidak dihapus; hasil lama dari query berbeda tidak boleh dapat dipilih |
| Ambil quote melalui Lanjut | Spinner di tombol, “Menyiapkan total…”; selected card tetap terlihat | Selection/input snapshot; disable aksi yang mengubah pilihan selama request atau batalkan hasil usang |
| Initial detail kamar | Skeleton media/specs/sidebar, satu status loading | Back link tetap tersedia; unknown id menjadi not-found/error, bukan skeleton abadi |
| Periksa tanggal | Spinner pada tombol, “Memeriksa tanggal…”; hasil muncul di panel itu | Hasil lama ditandai stale/disembunyikan saat tanggal berubah; error tidak hanya muncul jauh di header |
| Review submit | “Membuat booking…”; spinner lokal; duplicate click guard | Data, dua consent, idempotency key; retry ambigu mengikuti attempt yang sama |
| OTP send/verify | “Mengirim kode…” / “Memverifikasi…” | Email/code/cooldown; ganti email tidak meninggalkan respons usang |
| Booking Saya initial | Skeleton rows dengan tinggi/crop yang stabil | Akses/login state diperiksa dahulu, tidak menampilkan skeleton booking pribadi sebelum sesi jelas |
| Filter list/refetch | Indikator kecil di toolbar; konten lama diberi status sedang diperbarui atau diganti skeleton bila konteks tidak cocok | Latest request wins; error tidak tampil sebagai empty |
| Polling booking/refund | Indikator kecil dekat label status/freshness | Data terakhir tetap terbaca; tidak mereset timer atau mengulang entrance seluruh halaman |
| Kirim permintaan/batalkan | Tombol busy, feedback pada panel/dialog | Status request/cancel/refund terpisah; mock selalu berlabel |
| Receipt | Skeleton dokumen hanya saat initial load | Print/unduh tidak aktif sebelum data siap; skeleton/loader tidak ikut print |
| Staff sample/API locked | Button feedback atau skeleton sesuai pending nyata | Capability guard dan label simulasi; tidak menambah delay agar simulasi terasa seperti live |

Skeleton memiliki `aria-hidden="true"`, satu label loading yang dapat dibaca, dan `aria-busy` pada region yang sedang diperbarui. Live announcer ditempatkan di luar region busy jika diperlukan agar loading diumumkan segera. Spinner dekoratif tidak menjadi pengumuman kedua.

### Success, error, dan refresh

Feedback memilih paket bersifat lokal dan dapat langsung terlihat. Konfirmasi booking/refund hanya mengikuti authority existing. Error penting inline dan tetap terlihat sampai diselesaikan; tidak hilang otomatis seperti toast. Tidak perlu sistem toast global baru untuk semua aksi.

Alert masuk memakai fade singkat, tanpa shake. Fokus diarahkan ke field pertama yang invalid atau ringkasan error saat submit; hasil polling tidak mencuri fokus. Status live region mengumumkan perubahan bermakna, bukan seluruh panel setiap 5 detik atau countdown setiap detik.

## 5. Transisi panel dan navigasi

- `PolicyAccordion` dan disclosure pencarian/promo: chevron berputar 180° dan body fade singkat ketika dibuka. Pertahankan native `details/summary`. Versi awal tidak memerlukan animasi tinggi saat menutup; semantik dan keyboard lebih utama daripada animasi yang bergantung browser tertentu.
- Dialog pembatalan: backdrop fade dan panel 6px entrance, tetap menggunakan native dialog. Close/Escape segera bekerja; exit animation opsional hanya setelah focus/cleanup terbukti benar. Tombol konfirmasi pending tetap mengikuti guard existing.
- Hasil/data baru: fade satu region, tidak stagger semua card satu per satu. Polling dengan data sama tidak memicu transition.
- Perpindahan route: tahap terakhir, opsional; content masuk 180ms tanpa memindahkan header/action bar. Hindari menunggu exit sebelum form berikutnya dapat digunakan; jangan remount draft/state karena animation key menggunakan seluruh query.
- Tidak ada `opacity: 0` default yang menyembunyikan konten SSR jika JavaScript/animation gagal. State penting tidak menunggu transitionend untuk berubah.

## 6. Target file dan batas implementasi

| File | Pekerjaan |
|---|---|
| `app/assets/css/tokens.css` | Token motion/easing baru |
| `app/assets/css/components.css` | Hover/press/focus/disabled per variant; specificity states yang konsisten |
| `app/assets/css/base.css` | Reduced-motion eksplisit; print meniadakan motion; global fallback |
| `app/components/brand/BrandButton.vue` | Props `loading`, `loadingLabel`; width stabil, `aria-busy`, guard activation; `to` tetap link jika aktif |
| Baru `app/components/ui/LoadingIndicator.vue` | Spinner dekoratif reusable; label di parent; stop untuk reduced-motion |
| Baru `app/components/ui/SkeletonBlock.vue` | Block/line/media sederhana, dimensi ditentukan consumer, statis untuk reduced-motion |
| `app/components/ui/{FormField,InlineAlert,PolicyAccordion}.vue` | Focus/error/disclosure + pengumuman terkoordinasi |
| `app/components/booking/{RoomCard,BookingStatusPanel,CancelBookingDialog,GuestRequestPanel,RefundStatusPanel}.vue` | Selected/busy/status/dialog feedback sesuai state nyata |
| `app/components/brand/{BrandHeader,MobileBookingNav}.vue`, `app/layouts/staff.vue` | Link/tab active, pointer/keyboard feedback |
| `app/pages/booking/results.vue` | Skeleton search, pending quote, generation guard; status lokal |
| `app/pages/booking/rooms/[id].vue` | Pending availability terpisah dari initial load; result/error lokal, stale date handling |
| `app/pages/booking/{review,login}.vue` | Integrasi shared busy button; guard dan data tetap dimiliki route |
| `app/pages/booking/status/[id].vue`, `app/pages/booking/my/**` | Initial/refresh/error state, latensi panjang, print-safe receipt |
| `app/components/booking/SearchForm.vue`, `app/pages/booking/index.vue` | Handoff pencarian/navigation pending jika ada waktu tunggu nyata |
| `app/pages/staff/**` | Shared feedback pada aksi existing, bertahap sesuai komponen yang memakai loading |

Rencana minimal memakai CSS dan Vue Transition yang sudah tersedia; tidak menambah animation library. Vue Transition untuk elemen conditional memerlukan root yang sesuai; hindari membungkus komponen multi-root seperti `BookingSteps` secara langsung. [Dokumentasi Vue](https://vuejs.org/guide/built-ins/transition.html).

Disabled/loading pada link tidak cukup dengan `pointer-events: none`: activation keyboard juga harus dicegah, `aria-disabled` tersedia, dan fokus tidak hilang tanpa alasan. Button submit memiliki guard handler selain visual disabled. Transform pada parent tidak mengubah positioning sticky/fixed action bar.

Pendekatan hover dan reduced-motion mengikuti capability/preferensi browser. Rule reduced-motion harus eksplisit menghentikan infinite spinner/pulse; memperpendek durasi loop ke 0.01ms saja tidak cukup. [MDN hover](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover), [MDN reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion).

## 7. Urutan delivery

1. **M1 — fondasi:** tokens, shared button hover/press/busy, spinner/skeleton, reduced-motion.
2. **M2 — results dan detail:** selected feedback, search skeleton, pending quote dan availability, duplicate/stale-response guard.
3. **M3 — checkout dan guest management:** submit/OTP/request/cancel, initial vs polling/refetch, error focus/live feedback.
4. **M4 — disclosure dan staff:** accordion/dialog, nav/rows, staff controls; route entrance hanya jika membantu setelah review.
5. **M5 — QA:** keyboard/touch, reduced-motion, request cepat/lambat/error, rapid actions, browser capture normal/reduced dan laporan.

Status RD-T19–23 dirawat pada tracker. Fondasi dan results/detail sudah terverifikasi; checkout/guest management/disclosure masih review visual, sedangkan reduced-motion/device matrix tetap berjalan. Efek media foto final menunggu foto resmi tersedia.

## 8. Acceptance dan bukti

- [x] Source/browser: primary/dark/light hover dibatasi `hover:hover` + `pointer:fine`; pressed, disabled, dan busy tidak memakai hover aktif.
- [x] Source: touch tidak bergantung pada hover dan tetap memiliki pressed/selected/busy state. Physical touch QA tetap NOT RUN.
- [x] Automated/browser: semantic button/link, disabled link guard, native details/dialog dan focus ring tetap tersedia. Screen-reader/focus recovery manual tetap NOT RUN.
- [ ] Request cepat 0–100ms tidak ditahan untuk animasi. Request 1–3 detik menunjukkan busy/loading, request lebih dari 8 detik punya copy waktu tunggu; tidak memalsukan progress.
- [x] Source: quote/check date/review/OTP mempunyai pending guard; shared button menjadi disabled saat loading.
- [x] Source: search, room detail, availability, status dan Booking Saya memakai generation guard atau cleanup pada unmount.
- [ ] Request error mengakhiri busy dan menawarkan recovery; empty bukan error/loading. Ambiguous payment tidak memicu retry otomatis.
- [ ] Loading skeleton tidak menggeser tinggi tombol/total; tidak menutupi area interaksi berikutnya.
- [x] Source: reduced-motion memendekkan transform/animation, menonaktifkan smooth scroll dan membatasi iteration menjadi satu; state tidak bergantung pada animation event. Manual OS/browser capture tetap NOT RUN.
- [ ] Polling tidak mengulang entrance atau mengumumkan data identik; timer server tidak berubah akibat motion.
- [x] Source: print stylesheet meniadakan animation/transition; receipt tidak memakai skeleton baru.
- [x] Automated: typecheck, targeted lint, unit dan full Chromium E2E selesai tanpa kegagalan baru.

Pengujian bermakna: component test busy button mouse/keyboard dan focus; E2E dengan respons tertunda/berurutan terbalik untuk pending, duplicate guard, retry, dan reduced-motion. Gunakan response fixture/deferred response atau clock test, bukan sleep arbitrer; cek state/behavior, bukan sekadar string class CSS.

Validasi viewport 360/390/768/1200/1440 pada layar relevan. Ambil bukti idle, hover, pressed/busy, result/error, dan reduced-motion; rekaman singkat bila tersedia membantu menilai timing, screenshot hanya membuktikan satu frame. Device/browser/version harus dicatat untuk physical touch QA. Laporan baru mencatat checks yang dijalankan, mode mock/API-stub, dan NOT RUN yang tersisa; tidak mengklaim device/live readiness dari emulasi.

Checks implementasi mengikuti RD-07: lint/typecheck, targeted behavior tests lalu E2E regresi dan build sesuai diff. Bukti aktual dan batas manual dicatat pada laporan QA redesign.

## 9. Desain lanjutan — section, route, dan lifecycle loading

Status: **IMPLEMENTED / IN REVIEW**, 3 Oktober 2026. [Preview motion interaktif](previews/motion-storyboard.html) memperagakan timing dan state memakai copy kamar yang sama; merupakan storyboard desain, bukan booking flow atau bukti runtime. Source aplikasi dan laporan QA tetap authority.

### 9.1 Snapshot aktual dan koreksi status

| Area | Source saat plan dibuat | Pekerjaan berikutnya |
|---|---|---|
| Button | Hover/press/loading sudah ada dalam CSS dan BrandButton | Stabilkan lebar saat label berubah; audit dark/light/focus; icon shift hanya pada icon dekoratif |
| Results | Skeleton tampil langsung; hasil memakai `v-if` tanpa transition container | Delay visual 150ms, entrance hasil satu region, empty/error lifecycle |
| Quote | Pending guard sudah ada; pilihan dan query masih dapat berubah selama quote | Snapshot input/selection, invalidasi respons usang, busy tidak menyatakan harga sudah terkunci |
| Section | Tidak ada observer/reveal | Reveal selektif satu kali, tanpa menyembunyikan form/sticky ancestor |
| Route | `app/app.vue` memakai NuxtPage tanpa page transition | Entrance konten guest; header/nav tidak bergerak |
| Photo | CSS mengaktifkan entrance saat elemen img dirender | Fade saat load/decode selesai, termasuk cache/error; bukan saat mount saja |
| Status/list | Status tetap menyimpan data; indikator loading full row; list mengganti konten dengan skeleton | Initial vs refresh terpisah; freshness untuk hasil filter lama |
| Reduced motion | Global duration .01ms + iteration 1; hover transform masih dapat diterapkan | Explicit `animation:none`, `transition:none`, hilangkan dekoratif transform; observer tidak menyembunyikan konten |
| Navigation/staff | Active link statis; shared button berubah; loading consumer staff belum menyeluruh | Feedback per control dan pending nyata, state table tanpa stagger |
| Dialog/alert | Entrance tersedia; beberapa alert juga berada dalam Vue Transition | Satu owner motion per elemen; exit dialog hanya bila cleanup/focus aman |

Status VERIFIED pada T19/T20 adalah checkpoint implementasi pertama. Acceptance tambahan pada bagian ini tetap PLANNED sampai buktinya tersedia.

### 9.2 Bahasa motion dan storyboard

Identitas mengikuti palette/typography PULANG yang sudah ada. Nilai berikut keputusan desain lokal; bukan spesifikasi resmi hotel.

| Gerak | Desain normal | Reduced motion | Trigger |
|---|---|---|---|
| Section reveal | Opacity .92 → 1, translateY 10px → 0, 280ms | Langsung terlihat, transform none | Heading atau blok editorial masuk viewport; sekali per mount |
| Route entrance | Opacity .96 → 1, translateY 6px → 0, 180ms; tanpa exit wait | Pergantian langsung | Navigasi ke path guest berbeda setelah route tersedia |
| Loading → hasil | Konten hasil opacity .96 → 1, 180ms; container lama langsung dilepas | Hasil langsung tampil | Respons current sukses; satu region, tanpa stagger card |
| Foto siap | Opacity 0 → 1, 280ms pada layer gambar | Tampil langsung | Load/decode berhasil; frame/aspect ratio sudah dipesan |
| Active navigation | Background/color 140ms; press .98 / 90ms | State langsung; tanpa scale | Hover fine pointer, press native, route active |
| Alert exit | Opacity 1 → 0 / 90ms; error aktif tetap menetap | Dilepas langsung | State diselesaikan atau diganti, bukan timer auto-dismiss |
| Dialog exit | Opsional opacity 1 → 0 / 90ms; Escape langsung close | Close langsung | Tombol Kembali, bila focus/cleanup terbukti; bukan dependency transaksi |
| Background refresh | Spinner kecil dekat status/filter; konten tetap terbaca | Teks “Memperbarui…” tanpa putaran | Refetch konteks sama; bukan entrance ulang |

Urutan pengalaman: navigasi → konten utama hadir singkat → section editorial berikutnya reveal ketika discroll → interaksi lokal memberi press/selected → pending lokal → hasil authoritative muncul. Satu elemen hanya memakai satu motion owner. Route entrance tidak boleh menumpuk dengan section/media entrance untuk bagian awal layar.

### 9.3 Penempatan per layar

| Layar | Section yang diberi reveal | Bagian yang selalu langsung terlihat | Pergantian data |
|---|---|---|---|
| `/booking` | Copy pendukung setelah hero | Hero, search fields, validation, CTA | Navigation pending pada submit search jika ada waktu tunggu |
| `/booking/results` | Heading editorial daftar; target kecil terpisah dari card form | Radio/select, room card controls, sticky Lanjut | Satu fade daftar sesudah search; quote busy lokal |
| `/booking/rooms/[id]` | Heading Tentang kamar dan heading Fasilitas | Spec values, form tanggal, availability sidebar, back link | Image-ready fade; hasil availability lokal |
| `/booking/guest` | Heading editorial bila perlu | Seluruh input/error/summary/submit | Validasi langsung; focus invalid field |
| `/booking/review` | Heading Kebijakan penting | Total, consent, submit, guest data | Pending submit tidak memulai reveal ulang |
| `/booking/status/[id]` | Tidak memakai scroll reveal pada status transaksi | Status, timer, payment/cancel actions | Initial arrival; polling kecil, data identik tidak entrance ulang |
| OTP/My Bookings | Heading editorial list opsional | Email/code, filter, booking links | OTP step fade satu panel; list initial vs refresh |
| Receipt | Tidak ada scroll reveal | Semua konten dokumen | Initial load; print semua konten visible |
| Staff | Tidak ada reveal tabel/row operasional | Worklist, totals, filters, mutation forms | Feedback nav/control; busy nyata dan latest-result guard |

Reveal tidak diterapkan pada ancestor elemen `position:sticky/fixed`, seluruh form, atau long list card. Menggunakan sentinel kecil/heading mencegah section panjang gagal melewati threshold. Ini juga menghindari perubahan containing block sticky akibat transform.

### 9.4 Kontrak reveal dan route

Rencana baru `useSectionReveal.ts`: satu observer per instance halaman dengan `root:null`, `threshold:0`, `rootMargin:'0px 0px -24px 0px'`; trigger saat sentinel mulai masuk area aktif. Observe hanya target terdaftar; setelah reveal langsung unobserve. Semua konten terlihat secara default pada SSR dan tanpa JavaScript. Preferensi reduced-motion, API observer tidak tersedia, print, fokus keyboard/anchor menuju target: tampilkan langsung. Cancel animation aktif saat preferensi berubah; disconnect dan lepas listeners ketika unmount. Jangan membuat scroll listener per frame. Referensi perilaku observer: [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

Untuk Nuxt, konfigurasi page transition di owner NuxtPage melalui mekanisme resmi setelah memastikan versi terpasang. Scope hanya guest path, satu root page wrapper. Desain memakai enter 180ms dan leave 0ms sehingga halaman berikutnya tidak menunggu animasi keluar; jangan memakai `mode:out-in` dengan exit panjang. Jangan menambah `fullPath` key yang meremount draft karena query/hash. Back/forward, direct load dan anchor navigation diuji terpisah. Scroll restoration dimiliki router; focus heading setelah navigasi client berbeda path memakai preventScroll, bukan setiap polling/query update. Dokumentasi integrasi: [Nuxt page transitions](https://nuxt.com/docs/4.x/getting-started/transitions).

### 9.5 Loading, refresh, dan request ownership

Rencana `usePendingFeedback.ts`: consumer memasok pending reactive; helper memiliki timer visual saja (`showIndicator` setelah 150ms, `isSlow` setelah 8000ms). Pending/disabled/label aktif sejak t=0. Hasil cepat langsung tampil; tanpa minimum artificial dwell. Setelah selesai/reset/unmount, kedua timer dibersihkan. Slot spinner tetap memesan ukuran, tombol mengukur/reserve lebar label normal dan pending tanpa mengumumkan label cadangan. Beralih cepat antar pending tidak mewarisi timer request sebelumnya.

| Operasi | Copy awal | Copy setelah 8 detik | Error/selesai |
|---|---|---|---|
| Search | Mencari ruang yang tersedia… | Masih memeriksa ketersediaan kamar… | Current response → ready/empty; error → recovery |
| Quote | Menyiapkan total… | Total masih sedang dihitung… | Quote snapshot valid → guest; invalidated response → tidak navigasi |
| Availability | Memeriksa tanggal… | Pemeriksaan tanggal memerlukan waktu lebih lama… | Hasil/error dekat form, tanggal current |
| Create booking | Memproses booking… | Booking masih diproses. Mohon tunggu… | Status mengikuti respons; jangan retry otomatis |
| OTP | Meminta kode… / Memverifikasi… | Verifikasi memerlukan waktu lebih lama… | Error tetap inline; cooldown mengikuti hasil challenge |
| Refresh | Memperbarui… | Data masih sedang diperbarui… | Error menyebut data terakhir belum terbaru |

Quote harus snapshot deep copy input/selection sebelum await; perubahan query/selection, load baru atau unmount meningkatkan generation quote. Respons usang tidak boleh `setQuote`/navigate atau mengakhiri busy request baru. Pilihan dapat dikunci saat pending dengan penjelasan lokal; date editor/navigasi tetap boleh membatalkan konteks. Perbaiki copy existing “Mengunci harga pilihan…” menjadi “Menyiapkan total pilihan…” karena quote pending belum mengunci harga. Invalid URL hasil search harus mengakhiri pending lama; saat ini early return pada load belum melakukan itu.

Refresh konteks sama mempertahankan data, tombol/aksi enabled hanya jika kontrak/freshness mengizinkan. Filter berubah boleh tetap menampilkan hasil lama dengan label eksplisit “Hasil sebelumnya · sedang memperbarui”; blok aksi yang berpotensi memakai konteks lama. Setelah sukses, satu fade region dan label filter baru; error tidak dianggap empty. Polling tidak mengumumkan label refresh rutin lewat live-region berulang; status bermakna berubah diumumkan sekali.

Photo wrapper baru `RoomMedia.vue` memesan aspect ratio dan menangani load, decode, complete/naturalWidth dari cache, serta error fallback dengan alt yang benar. Placeholder demo tetap berlabel. Aset resmi dapat menyusul; lifecycle boleh diuji dengan fixture lokal yang jelas sample.

### 9.6 Work packages dan file ownership

Status/dependency pekerjaan berada di RD-06; tabel berikut adalah detail delivery, bukan tracker kedua.

| Task | Target file | Output | Acceptance minimum |
|---|---|---|---|
| RD-T24 | `base.css`, `components.css`, `BrandButton.vue`, `LoadingIndicator.vue`, baru `usePendingFeedback.ts` | Reduced-motion eksplisit, satu motion owner, delay/slow label, lebar button stabil | Hover/active/loading reduced motion tidak transform; 100ms tidak flash spinner; 2s busy; >8s slow; timers cleanup |
| RD-T25 | Baru `useSectionReveal.ts`; guest route headings terkait | Reveal heading/blok editorial selektif | SSR/JS off tetap visible; sekali, focus/anchor/reduced/print langsung visible; observer cleanup |
| RD-T26 | `app/app.vue`, konfigurasi Nuxt/page meta terkait, CSS transition | Guest route entrance | Header/sticky tidak bergerak; draft/input/back/query tetap; page available tanpa exit delay |
| RD-T27 | `results.vue`, room detail, `login.vue`, list/status, request/refund consumers | State transition, refresh kecil, snapshot quote guards | Stale quote tidak setQuote/navigate; invalid query mengakhiri pending; polling tidak remount timer; retry/error jelas |
| RD-T28 | Baru `RoomMedia.vue`, gallery detail, `RoomCard.vue` bila foto tersedia | Image-ready fade + error/cache | Frame stabil, cache/error/reduced bekerja, approved asset gate tercatat |
| RD-T29 | `BrandHeader.vue`, `MobileBookingNav.vue`, staff layout/controls, dialog/alert | Nav/link/button konsisten, disclosure/exit aman | Keyboard, touch, active-link/focus; Escape dan dialog restore focus segera; locked capability tetap |
| RD-T30 | `tests/e2e` targeted motion scenarios, QA report/evidence | State/timing/regression evidence | Viewport/reduced/no-JS, delayed/error/reordered response dan cleanup tests; unit/typecheck/lint/build sesuai diff |

Urutan: **T24 → T25/T26 → T27 → T28/T29 → T30**. T25/T26 dikerjakan bertahap setelah fondasi, bukan dua motion aktif sekaligus pada target yang sama. T28 lifecycle bisa memakai fixture; approved photography tetap dependency fidelity. Exit dialog boleh didefer dengan keputusan tercatat bila tidak memberi nilai setelah focus review. Tidak perlu dependency animation baru.

### 9.7 QA dan syarat selesai

- Simulasi terkontrol: 50–100ms, 2s, >8s, error, dan respons berurutan terbalik. Gunakan fixture/deferred response/clock, bukan menambah delay production.
- Rapid quote: click/Enter berulang, ganti pilihan/query saat pending, pindah route lalu respons lama datang; hanya current snapshot boleh disimpan/navigasi.
- Desktop 1200/1440: motion/timing normal, sticky/header stability; mobile emulasi 360/390: no overflow dan CTA stabil; 768: layout transition.
- Reduced motion: set browser preference sebelum mount, lalu ubah saat animasi aktif; spinner/reveal/hover press tidak bergerak, state tetap terbaca.
- Keyboard: Tab ke target reveal/anchor, radio/select/Enter, dialog Escape/close; semua target/focus langsung visible. JS disabled: heading/konten statis tetap terbaca sesuai SSR data availability.
- Route: forward/back/direct load, same-path query/hash, draft restored; focus tidak dicuri polling dan scroll tidak meloncat karena animation wrapper.
- Photo: cached, delayed, gagal, fixture lokal; gambar tidak muncul sebelum siap dan frame tetap; print receipt semua konten visible.
- Source/checks dan capture emulasi dibedakan dari physical Chrome Android/Safari iOS, screen reader dan provider/live readiness. Physical checks tetap NOT RUN sampai benar-benar dijalankan.

Fondasi, section reveal, route entrance, pending timing, quote ownership, initial/refresh list, status refresh, guest request/refund loading, serta image-ready component sudah diimplementasikan. Scope motion selesai penuh setelah foto resmi, staff visual sweep, dan physical/accessibility QA menutup T28–30.

### 9.8 Verifikasi artefak desain

Preview HTML diperiksa melalui Chromium headless lokal: perpindahan langkah storyboard, hasil loading cepat 80ms, error 2 detik, toggle reduced-motion, preferensi browser reduced-motion, serta viewport 390×844 tanpa horizontal overflow: PASS. Implementasi aplikasi kemudian diperiksa pada results desktop/mobile dan reduced motion; detail ada pada laporan QA redesign. Skenario 9 detik tersedia pada preview, sedangkan helper slow-state dibuktikan dengan fake timer unit test. `git diff --check` PASS.
