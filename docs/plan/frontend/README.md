# Rencana frontend Nuxt 4 — UI booking PULANG

Tanggal: 3 Oktober 2026. Status: IMPLEMENTED FOR LOCAL DEMO; live integration dan physical-device QA belum selesai. Root FE: `/mnt/code/projects/jobs/pulang/mimiking-booking-secure`. Backend: `/mnt/code/projects/jobs/pulang/current-booking`.

## Outcome tahap pertama

Prototype UI yang dapat dinavigasi dari pencarian sampai status booking, memakai identitas official website dan data fixture. Tidak memesan stok atau memproses pembayaran nyata. Semua halaman transaksi menampilkan badge “Demo — tidak membuat reservasi”. Simulasi sukses bukan bukti confirmed dari hotel.

Scope akhir adalah webapp pengganti flow Book Secure dengan brand shell hotel. Per arahan owner saat implementasi, landing page dan seluruh marketing pages—termasuk Rooms serta FAQ publik—tidak dibuat; `/` langsung mengarah ke `/booking`. Jangan menampilkan dead links seolah halaman tersedia.

## Urutan task / batas PR

Panduan pelaksanaan: [Rencana eksekusi implementasi](06-implementation-execution.md). Dokumen ini menambahkan checkpoint bootstrap, penajaman kontrak multi-room/clock/refresh, dan urutan verifikasi; acceptance tetap dimiliki FE-00–FE-05 di bawah.

| ID | Dokumen owner | Dependensi | Hasil review |
|---|---|---|---|
| FE-00 | [Data contract & fixture](00-contract-fixtures.md) | Analisis design/parity | Tipe dan skenario deterministik |
| FE-01 | [Foundation & design components](01-foundation-design-system.md) | FE-00 | Shell, token, forms, gallery |
| FE-02 | [Search & results](02-search-room-results.md) | FE-01 | Pilih tanggal/occupancy/room/rate |
| FE-03 | [Guest & review](03-checkout-review.md) | FE-02 | Form, summary, policy, mock submit |
| FE-04 | [Status & recovery](04-status-recovery.md) | FE-03 | Pending/confirmed/expired/failure demo |
| FE-05 | [QA & integration handoff](05-qa-handoff.md) | FE-01–04 | Review visual, navigation, accessibility |

Setiap PR hanya menutup task setelah acceptance dokumen pemilik terpenuhi. Setiap perubahan tipe menyesuaikan fixture dan skenario terkait. Source file menjadi authority, tidak perlu generated duplicate index. Tidak perlu state library besar, CMS, dashboard staff, websocket, atau payment SDK untuk fase ini.

## Struktur yang direncanakan

```text
nuxt.config.ts
app/
  app.vue
  assets/css/{tokens,base,components}.css
  layouts/{default,booking}.vue
  pages/
    booking/{index,results,guest,review}.vue
    booking/status/[id].vue
  components/
    brand/{BrandHeader,BrandFooter,BrandButton,MobileActionBar}.vue
    ui/{FormField,DialogPanel,PolicyAccordion,InlineAlert}.vue
    booking/{SearchForm,DateRangeField,GuestSelector,RoomCard,RoomGallery,
      RatePlanOption,PriceBreakdown,BookingSummary,BookingSteps,HoldTimer,
      BookingStatusPanel}.vue
  composables/{useBookingDraft,useBookingClient}.ts
  types/booking.ts
  data/{hotel,rooms,rate-plans,scenarios}.ts
  services/{booking-client,mock-booking-client}.ts
  utils/{dates,money,validation}.ts
public/brand/      # aset handoff resmi
public/rooms/      # media lokal yang disetujui
```

Ini target file, bukan klaim file sudah dibuat. Nuxt 4 menggunakan `app/`; `app.vue` merender NuxtLayout/NuxtPage. `useState` untuk draft serializable yang request-scoped; jangan singleton `ref` pada module server. Fixture client async bisa dikonsumsi melalui `useAsyncData`; `$fetch` untuk aksi ketika integrasi nyata dimulai. Rujukan resmi: [app.vue](https://nuxt.com/docs/4.x/directory-structure/app), [state management](https://nuxt.com/docs/4.x/getting-started/state-management), [data fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching), diakses 3 Oktober 2026.

## Gate integrasi

UI boleh dikerjakan sekarang. Pemakaian backend live membutuhkan katalog/search/occupancy/quote/policy (BE-G01–G08), idempotency/payment/deadline/recovery (G09–G12), privacy/auth/API guard (G13–G15), serta inventory/delivery/DB verification (G16–G22 sesuai scope). Rincian: [register backend](/mnt/code/projects/jobs/pulang/current-booking/docs/gap/README.md). Tidak memasang `fake-pay` atau public UUID read sebagai shortcut produksi.
