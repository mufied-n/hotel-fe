# FE-02 — search, room dan rate selection

Status IMPLEMENTED FOR LOCAL DEMO (3 Oktober 2026). Depends FE-00/01. Backend dependencies untuk integration: BE-G01–G06/G19. Implementasi memakai fixture dan belum membuat hold nyata.

## Route dan file

`/booking` menampilkan heading brand yang singkat + search form. `/booking/results?check_in=...&check_out=...&adults=...&rooms=...` menampilkan summary dan daftar kamar. Query untuk sample single-room boleh sederhana; multi-room gunakan codec yang tervalidasi. Jangan membawa PII atau access token di query.

Files: `pages/booking/index.vue`, `results.vue`, `SearchForm.vue`, `DateRangeField.vue`, `GuestSelector.vue`, `RoomCard.vue`, `RoomGallery.vue`, `RatePlanOption.vue`, `PriceBreakdown.vue`, `useBookingDraft.ts`, `useBookingClient.ts`, `utils/validation.ts`.

## Interaction TODO

- [ ] Tanggal check-out > check-in; tampilkan nights dari DateOnly, default memakai timezone hotel; jangan hardcode tanggal snapshot sebagai tanggal production default.
- [ ] Guest selector adults/children/ages per room; batas sample diambil fixture dan status sample jelas.
- [ ] Promo input optional memiliki apply/loading/invalid/expired/eligible state; display harga yang berubah dari mock quote, bukan discount dihitung terpisah UI.
- [ ] Search update disimpan di URL untuk back/refresh; invalid query dikembalikan ke form dengan penjelasan.
- [ ] Grup room family dengan varian king/twin yang benar; label bed dan feature jelas, selectable rate Room Only vs Breakfast.
- [ ] Total untuk seluruh stay/rooms sebagai angka utama; per-night label sekunder. Show included tax/service dan cancellation/payment badge sebelum select.
- [ ] Select menyimpan seluruh quote ID/version/input; perubahan tanggal/guests/variant/rate/currency menghapus stale selectedQuote.
- [ ] Room detail gallery drawer/accordion membantu compare; 360° link optional berdasarkan asset mapping.
- [ ] Edit search tidak menghilangkan fields secara diam-diam. Empty result punya aksi ubah tanggal; unavailable tidak selectable.

## State matrix

| State | UI / aksi |
|---|---|
| Loading | Skeleton dimensi stabil; summary tetap terlihat |
| Available | Room cards + rate options + select |
| Sold out | Pesan tanggal tidak tersedia; edit search |
| Missing inventory | Demo error terpisah; tidak menyatakan sold-out hotel |
| Error/offline | Inline error, retry; hasil lama tidak diklaim current |
| Quote expired/price changed | Review harga baru dan select ulang |
| Image failure | Placeholder aspect-ratio + alt; harga/action tetap ada |

## Acceptance

- [ ] Single/multi-room/child fixture, URL back/refresh, invalid query, sold-out, promo error dan stale selection dapat didemokan.
- [ ] Rate plan selection radio aksesibel, loading diumumkan, results heading dapat difokuskan setelah search.
- [ ] Search/select tidak memanggil create booking, mengurangi stok atau menciptakan payment attempt.
- [ ] Screenshot room results mobile/desktop memakai brand tanpa mengorbankan keterbacaan policies.
