# RD-02 — Search, results, dan detail kamar

Status: PLANNED. Dependensi: RD-00/01. Owner: FE guest journey. Referensi LAND-01/02/06/07, serta [contract/frontend](../frontend/00-contract-fixtures.md).

## Alur dan hierarchy

`Cari tanggal/tamu → hasil → lihat detail/varian/paket → pilih → quote → detail tamu`.

### `/booking`

Logo dan notice mode → foto pembuka singkat → judul/penjelasan ringkas → tanggal dan tamu → promo opsional → Cari kamar. Mobile memprioritaskan input pencarian; desktop mempertemukan foto/copy dan panel form. Judul tidak mendorong form jauh di bawah layar.

Tanggal awal tetap menggunakan mekanisme date-only/timezone aplikasi. Jangan menambah date picker custom bila native date input sudah memenuhi kebutuhan; kalender range baru hanya jika terbukti membantu dan punya keyboard/validation coverage.

Jumlah kamar, dewasa, anak, dan usia anak tetap sesuai kontrak. Ringkasan tamu bisa compact, tetapi editor per kamar tetap tersedia. Kode promo memakai disclosure opsional dan feedback yang jelas; promo historis tidak dipresentasikan sebagai penawaran current tanpa data.

### `/booking/results`

Ringkasan tanggal/tamu dengan Ubah pencarian → judul dan jumlah hasil → card keluarga kamar → varian/tempat tidur → paket → indikator pilihan → aksi lanjut.

Card default: foto besar, nama, pembeda utama, kapasitas/tempat tidur terpilih bila ada, dasar harga yang jelas, dan Lihat detail. Hindari seluruh fasilitas/policy/form tampil sekaligus di setiap card. Pengguna dapat membuka pilihan varian/paket inline; state disimpan di parent results, bukan hilang ketika card ditutup.

Harga pertama pada `RoomCard.vue` saat ini berasal dari varian pertama; UI baru tidak boleh menyajikannya sebagai harga varian/rate aktif tanpa mapping. Bila hanya tersedia harga indikatif, beri label basis yang benar dan final quote sesudah memilih. Jangan membuat harga per malam dari total agregat tanpa mengetahui scope nightly/room dan charges.

Pembandingan paket menampilkan label, benefit terverifikasi, kebijakan, dan biaya yang tersedia. `ratePlans` fixture/global tidak otomatis authority benefit semua rate API; jika metadata live belum lengkap, dependency dicatat pada roadmap integrasi. Jangan menampilkan benefit yang disimpulkan dari poster campaign.

### `/booking/rooms/:id`

Kembali ke hasil → galeri → nama/bed/kapasitas → fasilitas → varian/paket relevan → kebijakan → pilihan/CTA. Model id sekarang adalah varian; jangan mengganti menjadi family id tanpa migration/link strategy.

Konteks tanggal/tamu dari URL atau draft dibawa dari results. Direct entry tanpa search menjelaskan perlunya memilih tanggal; tidak menampilkan hasil palsu. Link kembali membawa query yang valid atau menuju search jika konteks tidak tersedia. Ketersediaan detail sekarang memakai endpoint berbeda dari aggregated search; jangan menyamakan bentuk respons atau menyatakan seluruh rentang tersedia dari subset data.

Pilihan di detail dikembalikan ke results/quote melalui satu owner state. Jangan membuat jalur checkout kedua yang menghitung harga sendiri.

## Target file dan kontrak presentasi

| File | Task |
|---|---|
| `app/pages/booking/index.vue` | Hero/form hierarchy dan copy yang relevan |
| `app/components/booking/SearchForm.vue` | Ringkasan occupancy, editor, field errors, promo opsional |
| `app/pages/booking/results.vue` | Search summary, parent selection state, disclosure, quote continuation |
| `app/components/booking/RoomCard.vue` | Foto/metadata ringkas; controlled selection; basis harga akurat |
| `app/pages/booking/rooms/[id].vue` | Konteks query/back, galeri, detail dan state direct entry |
| `app/components/booking/RoomGallery.vue` | Shared card/detail media |
| `app/types/booking.ts` | Optional metadata media hanya bila source tersedia; tidak mengubah makna Money/Quote |
| `app/services/api-booking-client.ts` | Map foto yang sudah ada pada DTO; sekarang `mapVariant` belum meneruskan foto |
| `app/data/rooms.ts` | Media fixture/provenance dan fallback konsisten |
| `app/composables/useBookingDraft.ts`, `app/utils/search-query.ts` | Perubahan sempit hanya bila perlu untuk round trip navigasi, tetap tanpa PII pada query |

Calon extraction `RatePlanOption.vue` hanya bila results/detail menggunakan kontrol yang sama. API endpoint baru atau perubahan sellable model bukan bagian otomatis RD-02.

## State wajib

| State | Tampilan/aksi |
|---|---|
| Initial/loading | Reserved layout, status memuat, tidak ada harga stok yang tampak sudah final |
| Available | Foto/metadata, pilihan varian/paket, CTA sesuai kelengkapan |
| Sold out | Penjelasan tanggal, ubah tanggal/tamu; tanpa scarcity palsu |
| Invalid URL/date/occupancy | Field-level error dan recovery search |
| Service error | Retry pencarian yang sama; input tetap tersimpan |
| Partial/missing media | Fallback; search/selection tetap berfungsi |
| Quote expired/changed/error | Review ulang harga/policy, bukan silently lanjut memakai nilai lama |
| Detail missing/unknown id | Not-found state dan kembali ke hasil/search yang valid |

## Acceptance

- [ ] Search masih memuat seluruh occupancy/children ages sesuai input; validasi tidak berkurang karena editor compact.
- [ ] Open/close detail tidak menghapus pilihan; back/edit search mempertahankan konteks valid.
- [ ] Perubahan tanggal/tamu membatalkan quote/pilihan yang tidak lagi valid; async response lama tidak menimpa pencarian baru.
- [ ] Multi-room mengikuti batas same variant/rate aktual dan copy menjelaskan batas itu tanpa jargon backend.
- [ ] Tidak ada “harga varian aktif” yang berasal dari varian pertama tanpa label.
- [ ] Galeri tidak menjanjikan interior/kapasitas yang belum verified.
- [ ] Direct detail dan reload results punya recovery yang jelas.
- [ ] Primary CTA hanya aktif ketika pilihan/quote sesuai tahap; duplicate click tidak membuat submit baru.
