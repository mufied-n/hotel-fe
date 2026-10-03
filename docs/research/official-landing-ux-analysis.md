# Analisis landing resmi PULANG ke UTTARA untuk arah redesign booking

Tanggal observasi: **3 Oktober 2026, Asia/Jakarta**. Status: riset publik, observasi browser, dan penilaian desain; belum merupakan persetujuan brand atau perubahan aplikasi.

## 1. Kesimpulan desain

PULANG membangun identitas melalui seni, kehidupan sehari-hari, komunitas, dan rasa pulang. Kesan premiumnya datang dari fotografi, komposisi editorial, kontras, dan ruang kosong. Redesign booking sebaiknya membawa identitas ini sambil membuat tanggal, kamar, paket, biaya, dan status reservasi mudah dipahami.

Dua referensi pengguna dapat membantu komposisi dan hierarchy. Namun, mengganti warna template real estate menjadi oranye belum cukup untuk menghasilkan pengalaman PULANG. Fotografi autentik, aset logo, ritme tipografi, bahasa, dan hubungan antara kamar dengan pengalaman hotel lebih menentukan.

Rekomendasi sebelumnya yang menyebut gambar kedua sebagai visual utama perlu dipersempit: **ambil ukuran foto, kerapian informasi, dan kontrasnya; tentukan identitas visual dari website resmi**. Warna, navigasi, onboarding, kategori properti, komisi, serta karakter interior contoh tidak otomatis cocok.

## 2. Metode, sumber, dan batas bukti

### Sumber primer

| Halaman | Yang diteliti | Kedalaman bukti |
|---|---|---|
| [Home](https://pulangkeuttara.com/) | Hero, promo, logo, menu, pergantian foto, CTA, sosial, footer | Browser desktop dan emulasi mobile; DOM dan computed style |
| [Rooms](https://pulangkeuttara.com/rooms/) | Hierarchy katalog, panel, galeri, CTA, hubungan kategori dan interior | Browser desktop dan emulasi mobile; klik next photo |
| [Culture](https://pulangkeuttara.com/culture/) | Positioning, fotografi, suara brand | Konten publik dan observasi desktop |
| [Spaces](https://pulangkeuttara.com/spaces/) | Fasilitas, grid, detail bertahap, jalur inquiry | Observasi desktop; dialog Gym & Sky-Pool dibuka |
| [Location](https://pulangkeuttara.com/location/) | Alamat dan petunjuk kedatangan | Pembacaan konten/link publik |
| [Tetangga](https://pulangkeuttara.com/tetangga/) | Kurasi lingkungan dan informasi perjalanan | Pembacaan konten publik |
| [Events](https://pulangkeuttara.com/events/) | Aktivitas komunitas, arsip, inquiry | Pembacaan konten publik; seluruh pagination belum diuji |
| [Merch](https://pulangkeuttara.com/merch/) | Perpanjangan identitas dan pemesanan | Pembacaan konten/link publik; order tidak dilakukan |
| [FAQs](https://pulangkeuttara.com/faqs/) | Tone, disclosure, kebijakan praktis | Browser emulasi mobile; accordion check-in dibuka |

Pengukuran dilakukan pada viewport desktop awal 1280×720, desktop 1440×1000, capture tambahan 1200×800, dan mobile 390×844. Viewport dikembalikan ke default setelah observasi. Ini **emulasi browser**, bukan pengujian Chrome Android/Safari iOS pada perangkat fisik.

Computed style menggambarkan elemen dalam sesi ini. Screenshot dapat menangkap transisi. Beberapa capture 1440px terpotong oleh permukaan capture browser; jangan memakai pemotongan itu sebagai bukti horizontal overflow website. Capture Rooms 1200px disertakan sebagai bukti tambahan.

Tidak dilakukan checkout, pembayaran, pengiriman WhatsApp, newsletter, maupun pengisian data tamu. Link BOOK diperiksa sebagai handoff publik; flow vendor berikutnya tidak diaudit ulang. Tidak ada analytics, user interview, Lighthouse, pengukuran Core Web Vitals, audit WCAG menyeluruh, atau uji reduced-motion. Dampak pada conversion dan performance di bawah adalah hipotesis, bukan hasil pengukuran.

Dokumen terdahulu [official-design-system.md](official-design-system.md) dipakai sebagai konteks. Angka dalam laporan ini berasal dari observasi baru jika dinyatakan sebagai hasil ukur.

## 3. Positioning dan pengalaman yang dijual

[Culture](https://pulangkeuttara.com/culture/) menempatkan hotel sebagai tempat dengan hubungan emosional terhadap rumah. [Spaces](https://pulangkeuttara.com/spaces/) memperluas pengalaman ke seni, buku, makan, musik, fasilitas rekreasi, dan pertemuan. [Events](https://pulangkeuttara.com/events/) serta [Merch](https://pulangkeuttara.com/merch/) menunjukkan bahwa identitas tersebut juga hidup dalam komunitas dan benda yang dibawa pulang.

**Interpretasi desain:** PULANG memiliki karakter editorial, ekspresif, akrab, dan sedikit jenaka. Istilah premium saja terlalu umum untuk menjadi brief. Palet beige-olive, foto apartemen steril, atau dekorasi luxury generik berpotensi melemahkan pembeda hotel.

Hipotesis kebutuhan pengguna, bukan segmentasi demografi yang sudah terbukti:

- Pengunjung yang sedang menjelajah perlu memahami karakter tempat dan alasan untuk datang.
- Pengunjung yang siap menginap perlu menemukan kamar sesuai tanggal dan jumlah tamu.
- Pengunjung compound perlu informasi fasilitas, acara, atau kontak inquiry.
- Tamu yang sudah booking perlu kepastian status dan informasi kedatangan.

Keempat kebutuhan ini menjelaskan mengapa pengalaman marketing yang ekspresif dan pengalaman transaksi yang jelas perlu saling terhubung.

## 4. Struktur homepage dan jalur pengguna

### Yang teramati

Homepage menampilkan logo, akses menu, CTA BOOK, rangkaian lima foto, embed sosial, lalu footer. H1 yang menjelaskan hotel ada dalam DOM, tetapi berukuran 1×1px di luar bidang visual. Pengunjung melihat foto dan grafis brand sebagai pembuka. Pada desktop 1200×800, wadah rangkaian foto memiliki tinggi 4000px. Setelah promo ditutup dan scroll mencapai 1600px, foto ketiga terlihat dengan perubahan opacity/scale; foto lain tetap berada dalam layer.

Promo Oktober muncul pada pembukaan Home dan kembali muncul ketika Home dikunjungi lagi dalam sesi ini. Screenshot menampilkan kampanye diskon 27%. Ini snapshot kampanye, bukan tarif atau aturan permanen. [Sumber Home](https://pulangkeuttara.com/).

### Implikasi

Komposisi tersebut kuat untuk membangun suasana dan rasa penasaran. Namun, informasi praktis tidak menjadi pusat homepage. Pengunjung baru perlu membuka menu, membaca halaman pendukung, atau langsung menuju BOOK.

Ini pilihan editorial yang sah. Dugaan bahwa pengunjung tertentu akan kesulitan mengenali jenis tempat, lokasi, atau langkah berikutnya perlu dibuktikan lewat tugas usability; jangan menyebutnya penurunan conversion yang sudah terbukti.

### Rekomendasi untuk booking

Halaman awal booking cukup membawa satu foto autentik dan satu kalimat pembuka, lalu pencarian. Pengguna yang masuk melalui BOOK sudah menunjukkan niat transaksi; meminta mereka melewati ulang rangkaian hero panjang menambah pekerjaan.

Jika suatu saat landing marketing ikut direvisi, uji tambahan pengantar ringkas dan jalur Rooms yang terlihat tanpa menu. Tetap pertahankan kebebasan visual pada bagian eksplorasi. Ini usulan, bukan instruksi mengganti landing resmi sekarang.

## 5. Identitas visual dan perilaku komponen

| Unsur | Bukti baru | Implikasi desain |
|---|---|---|
| Palet | CTA memakai `rgb(245,129,50)` / `#F58132`; label hitam | Oranye menjadi aksen aksi; biarkan foto membawa warna lainnya |
| Logo | Logo grafis dan tanda Jangan Lupa Pulang | Gunakan aset resmi; jangan substitusi dengan teks miring atau font generik |
| Tipografi display | Intro Rooms 80.64px desktop / 42.9px mobile; line-height sekitar 92%; tracking sekitar −2.5% | Pertahankan karakter judul; jangan menerapkan line-height rapat pada form dan kebijakan |
| Judul kamar | 46.08px desktop / 39px mobile pada viewport yang diperiksa | Skala responsif, bukan angka yang dipukul rata untuk semua layar |
| Body fasilitas | 16px / 26px | Informasi praktis tetap lapang dan terbaca |
| Panel kamar | Radius 32px; padding 48px desktop / 24px mobile | Panel besar berfungsi sebagai komposisi editorial |
| Grid kamar | Dua kolom 592px dengan gap 56px pada desktop 1440; satu kolom pada mobile | Layout berubah mengikuti tugas dan ruang, bukan miniatur desktop |
| CTA mobile | BOOK tinggi 29px; menu 36×36px pada bounding box elemen | Untuk produk baru, perbesar area interaksi sekurangnya 44×44px sebagai target desain |
| Menu | Teks 52px desktop / 30px mobile, uppercase; halaman aktif oranye | Identitas navigasi kuat; label transaksi perlu lebih spesifik |
| Motion | Layer foto memakai opacity dan transform; menu memiliki transisi | Pakai motion untuk orientasi, jangan menunda informasi transaksi |

Stack font computed pada heading, fasilitas, navigasi, dan FAQ yang diperiksa adalah `ui-sans-serif, system-ui, sans-serif...`. **Nama font brand yang dideklarasikan pada CSS belum membuktikan font itu benar-benar dipakai oleh elemen.** Font final perlu asset handoff dan pemeriksaan pemuatan/penerapan pada implementasi baru. Laporan ini tidak menetapkan Helvetica Now sebagai font rendered seluruh website.

Pada screenshot mobile Rooms/FAQ, logo putih yang menetap di atas dapat berimpit dengan judul dan sulit dibedakan ketika latarnya putih. Ini observasi pada posisi scroll tertentu, bukan klaim seluruh header gagal contrast. Untuk booking, gunakan bidang header yang stabil atau varian logo dengan contrast yang memadai.

## 6. Fotografi sebagai sistem informasi

Foto resmi mencampur interior, manusia, seni, lingkungan, dan aktivitas. [Culture](https://pulangkeuttara.com/culture/) terutama memperlihatkan hubungan antara ruang dan cara orang menggunakannya. Interpretasinya: kehangatan berasal dari suasana yang dihuni, bukan hanya ruang yang tertata.

Dalam redesign booking, foto memiliki dua pekerjaan:

1. Foto pembuka membangun suasana dan pengenalan brand.
2. Foto katalog membantu memastikan tempat tidur, bagian ruang, dan fitur kamar yang dipilih.

Gunakan crop per breakpoint agar detail penting tidak terpotong. Jangan menaruh harga/kebijakan di atas area foto yang berubah-ubah. Jangan menganggap satu foto interior merupakan janji desain kamar tertentu bila alokasi interior belum terkonfirmasi.

Landing Rooms menyebut 95 kamar dengan 15 ekspresi interior, tetapi katalog publik menyajikan lima keluarga kamar. [Sumber Rooms](https://pulangkeuttara.com/rooms/). Implikasinya: **keluarga kamar, varian bed, desain interior, dan paket tarif perlu dibedakan** dalam informasi produk. Mapping inventory aktual tetap memerlukan konfirmasi hotel.

## 7. Navigasi, disclosure, dan handoff booking

Menu memuat delapan tujuan pendukung selain Home, sementara BOOK tetap mudah ditemukan. Pada mobile, logo berada di atas, sedangkan menu dan BOOK berada di bar hitam bawah. Pola ini memberi akses aksi sepanjang eksplorasi. Escape menutup menu yang dibuka pada desktop/mobile dalam sesi observasi; fokus kembali terlihat pada kontrol menu. Focus trap penuh belum diuji.

Galeri Rooms memakai panah dan indikator foto. Klik next pada Deluxe Balcony memulai crossfade ke foto berikutnya. Detail Spaces dibuka dalam dialog; dialog Gym & Sky-Pool memperlihatkan foto dan jam fasilitas. FAQ memakai elemen `details/summary`; membuka pertanyaan check-in membuat jawabannya terlihat tanpa menutup pertanyaan pertama. [Rooms](https://pulangkeuttara.com/rooms/), [Spaces](https://pulangkeuttara.com/spaces/), [FAQs](https://pulangkeuttara.com/faqs/).

Pola yang dapat diwariskan: informasi singkat dahulu, detail tersedia saat dibutuhkan. Pengecualiannya adalah biaya dan ketentuan yang menentukan keputusan pembayaran: informasi tersebut harus terlihat sebelum submit.

CTA BOOK menuju `https://www.book-secure.com/index.php?s=results&property=idyog30205`, tanpa tanggal atau pemilihan kamar dalam URL yang diperiksa. Halaman Rooms juga memiliki CTA booking umum di bagian akhir. Pengiriman pilihan kamar dari galeri ke vendor belum terbukti.

Untuk booking milik hotel, pertahankan konteks tanggal, tamu, kamar, dan paket selama berpindah halaman. Kehilangan konteks antara eksplorasi dan transaksi merupakan hal yang perlu dicegah, bukan sesuatu yang harus disalin demi visual parity.

## 8. Copywriting, informasi praktis, dan trust

Bahasa resmi umumnya Inggris dengan istilah Indonesia, humor, dan ungkapan akrab. [FAQs](https://pulangkeuttara.com/faqs/) memakai pendekatan ini sambil menjelaskan tarif dinamis, check-in 15:00, check-out 12:00, serta early/late sesuai ketersediaan. [Location](https://pulangkeuttara.com/location/) memberi alamat dan landmark visual. [Tetangga](https://pulangkeuttara.com/tetangga/) mengaitkan hotel dengan kehidupan lingkungan sekitar.

**Rekomendasi bahasa:** ekspresif untuk pembuka dan eksplorasi; langsung untuk jumlah tamu, biaya, pembatalan, pembayaran, dan error. Jangan menyalin humor ke pesan pembayaran gagal atau ketentuan yang dapat merugikan tamu bila disalahpahami. Bahasa Indonesia atau Inggris pada booking baru perlu keputusan locale yang konsisten; pilihan bahasa belum ditetapkan oleh riset ini.

Kontak resmi, alamat, foto autentik, dan penjelasan kebijakan adalah bahan trust yang tersedia. Embed sosial memberi konteks aktivitas hotel, tetapi bukan pengganti informasi kamar atau kepastian reservasi. Jangan membuat rating, testimoni, badge scarcity, atau benefit paket yang tidak punya sumber terverifikasi.

Informasi fasilitas dari Spaces tidak otomatis berarti semua akses termasuk dalam setiap rate plan. Informasi tarif/benefit harus mengikuti paket yang ditawarkan pada tanggal pencarian.

## 9. Temuan dan prioritas adaptasi

Prioritas di bawah adalah urutan kerja redesign yang diusulkan, bukan severity bug produksi.

| ID | Bukti / skenario | Implikasi | Rekomendasi | Acceptance desain |
|---|---|---|---|---|
| LAND-01 | Penjelasan hotel pada H1 tidak terlihat di hero Home | Pengunjung baru mengandalkan konteks foto/logo | Booking baru menampilkan pengantar dan form pencarian jelas | Dalam tugas uji, pengguna bisa mengenali tujuan halaman dan mulai mencari tanpa menu |
| LAND-02 | Homepage memakai wadah foto sepanjang lima tinggi viewport | Eksplorasi memiliki ritme panjang | Ringkas hero pada pintu masuk booking | Form utama terjangkau pada layar awal mobile yang disepakati |
| LAND-03 | Popup promo menutupi hero dan muncul kembali setelah kembali ke Home | Kampanye mendahului eksplorasi | Di booking gunakan promo inline, dengan akses tutup eksplisit bila modal diperlukan | Promo tidak menghalangi search/review; manfaat dan syarat dapat dibaca |
| LAND-04 | BOOK 29px tinggi; menu 36px pada mobile | Area aksi kecil untuk interaksi sentuh | Perbesar hit area tanpa menghilangkan bentuk pill | Area kontrol utama minimal 44×44px dan tidak bertabrakan |
| LAND-05 | Logo putih menetap di atas konten terang pada posisi tertentu | Pengenalan brand/heading bisa terganggu | Header booking dengan contrast dan ruang tetap | Logo dan judul terbaca pada seluruh posisi scroll yang diuji |
| LAND-06 | CTA booking umum tidak membawa parameter kamar/tanggal | Konteks pilihan mungkin harus dibangun ulang | Pertahankan state pencarian dan pilihan pada booking baru | Back/edit search tidak kehilangan pilihan valid; perubahan tanggal memvalidasi ulang |
| LAND-07 | Keluarga kamar dan ragam interior dinyatakan terpisah | Foto bisa disalahartikan sebagai interior pasti | Label kategori/bed/paket/foto secara akurat | Detail tidak menjanjikan desain interior tertentu tanpa kontrak katalog |
| LAND-08 | Informasi praktis tersebar pada FAQ, Rooms, Spaces | Pengguna transaksi perlu mencari lintas halaman | Tampilkan ringkasan relevan dekat keputusan kamar/review | Kebijakan penting tersedia sebelum konfirmasi |
| LAND-09 | Home memuat iframe EmbedSocial | Ada ketergantungan konten eksternal | Jaga search dan CTA mandiri dari embed sosial | Kegagalan embed tidak menghalangi booking; performance diuji terpisah |
| LAND-10 | Estimasi waktu/jarak pada Tetangga tampak perlu verifikasi rute | Informasi perjalanan dapat ditafsirkan sebagai janji | Verifikasi rute sebelum menampilkan estimasi di produk baru | Angka memiliki sumber/rute dan label perkiraan; jangan koreksi berdasarkan asumsi kecepatan saja |
| LAND-11 | Foto dan menu memiliki animasi/layer | Preferensi gerak dapat memengaruhi kenyamanan | Definisikan reduced-motion dan konten tetap terbaca | Mode reduced-motion tidak menghilangkan informasi atau aksi |
| LAND-12 | Computed font diperiksa memakai fallback sistem | Konsistensi tidak selesai dari deklarasi CSS | Dapatkan aset dan cek penerapan nyata | Font yang disetujui terverifikasi pada heading/body; fallback tetap layak |

Untuk LAND-10, contoh di halaman publik memasangkan 100 meter dengan 7 menit dan 250 meter dengan 15 menit. Ini **indikasi untuk pemeriksaan**, bukan bukti jarak salah: pintu akses, rute, atau konteks lain belum diperiksa. [Sumber Tetangga](https://pulangkeuttara.com/tetangga/).

## 10. Penilaian dua referensi pengguna

| Aspek | Gambar pertama | Gambar kedua | Keputusan yang disarankan |
|---|---|---|---|
| Hierarchy | Banyak kontrol dan metadata padat | Foto dominan, informasi lebih lapang | Gunakan hierarchy foto besar dengan metadata booking yang diprioritaskan |
| Identitas | Beige/olive, real estate | Hitam-putih/lime, interior | Bangun palet dari brand resmi; warna kedua contoh tidak diwariskan |
| Journey | Discovery, detail, daftar booking | Onboarding, feed, detail | Ambil kesinambungan layar gambar pertama; jangan mewajibkan onboarding/login sebelum eksplorasi |
| Bottom bar | Banyak tujuan tetap | Bar gelap dengan ikon dan aksi tambah | Eksplorasi boleh memakai navigasi; checkout memerlukan total dan satu aksi utama |
| Card | Kompak dan berisi banyak informasi | Foto besar dan chip metadata | Hindari chip berlebihan; label teks tetap tersedia |
| Relevansi | Kategori jual/sewa, agen, visit | Komisi dan kemitraan | Ganti struktur informasi sesuai menginap; fitur properti tidak menjadi kebutuhan hotel |

Kemiripan kedua referensi dengan official landing terutama ada pada fotografi, panel, dan kontrol membulat. Pembeda PULANG yang harus ditambahkan adalah aset grafis, judul editorial, interior autentik, kultur seni, dan suara brand. Refaktor UX bukan menyalin screenshot layar demi layar.

## 11. Brief desain sebelum implementasi

Yang dipertahankan: logo resmi, fotografi PULANG, dominasi monokrom, aksen oranye, judul ekspresif, ruang kosong, panel membulat, dan bahasa yang akrab.

Yang diadaptasi: panjang hero, skala display pada transaksi, kepadatan metadata, akses navigasi, area sentuh, promo, serta disclosure kebijakan.

Urutan pengguna yang perlu digambar dahulu: pencarian → hasil kamar → detail dan paket → detail tamu → review biaya/kebijakan → status pembayaran/reservasi → pengelolaan booking. Desain status harus jelas membedakan menunggu, berhasil, gagal, dan kedaluwarsa sesuai kontrak produk. Riset landing tidak menetapkan perilaku payment atau backend.

Desktop memerlukan ruang pembandingan kamar dan ringkasan; mobile memerlukan pemilihan bertahap dan CTA yang tidak menutupi konten. Tidak perlu memaksakan navigasi app dengan banyak ikon ke seluruh journey.

Sebelum high-fidelity final, selesaikan asset handoff logo/font/foto, mapping keluarga-varian-interior, benefit rate plan, locale, dan sumber kebijakan. Lalu uji tugas: menemukan kamar untuk jumlah tamu tertentu, membandingkan paket, menjelaskan total biaya, kembali mengubah tanggal, dan memahami status booking. Catat hasil pengguna sebelum menyimpulkan peningkatan conversion.

## 12. Bukti visual

Folder sesi: [landing-audit-2026-10-03](evidence/landing-audit-2026-10-03/).

| Bukti | Konteks |
|---|---|
| [Hero desktop](evidence/landing-audit-2026-10-03/home-hero-desktop-1200.jpg) | Home sesudah promo ditutup, 1200×800 |
| [Promo desktop](evidence/landing-audit-2026-10-03/home-desktop-1200.jpg) | Kampanye Oktober; snapshot yang dapat berubah |
| [Rangkaian foto](evidence/landing-audit-2026-10-03/home-photo-sequence-desktop-1200.jpg) | Scroll 1600px, foto malam aktif |
| [Home mobile](evidence/landing-audit-2026-10-03/home-mobile.jpg) | 390×844; capture dekat transisi penutupan menu |
| [Menu mobile](evidence/landing-audit-2026-10-03/home-menu-mobile.jpg) | Tujuan navigasi dan active state |
| [Menu desktop](evidence/landing-audit-2026-10-03/home-menu-desktop.jpg) | Desktop awal 1280×720; sebagian menu perlu scroll |
| [Card kamar mobile](evidence/landing-audit-2026-10-03/rooms-card-mobile.jpg) | Galeri, copy, CTA 360°, dan bar BOOK |
| [Rooms desktop 1200](evidence/landing-audit-2026-10-03/rooms-desktop-1200.jpg) | Capture tambahan agar sisi kanan berada dalam bidang capture |
| [Culture desktop](evidence/landing-audit-2026-10-03/culture-desktop.jpg) | Sebagian viewport 1440×1000 terpotong oleh capture |
| [Spaces desktop](evidence/landing-audit-2026-10-03/spaces-desktop.jpg) | Grid fasilitas; capture parsial viewport desktop |
| [Detail fasilitas](evidence/landing-audit-2026-10-03/spaces-detail-desktop.jpg) | Dialog Gym & Sky-Pool; capture parsial |
| [FAQ check-in](evidence/landing-audit-2026-10-03/faq-checkin-mobile.jpg) | Accordion terbuka pada mobile |

Screenshot hanya membuktikan tampilan sesi ini. Dokumen ini tidak menyatakan website official atau aplikasi baru sudah lolos accessibility, performance, device QA, atau validasi konversi.
