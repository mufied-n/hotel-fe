# F08 — Public catalog detail dan inventory/admin sample

Tasks CMP-08-*; catalog list BFF existing, public detail/gallery belum. OPS housekeeping sudah ada, tidak dibuat ulang.

## Public flow

Results → room detail /booking/rooms/:id → gallery/facilities/size/capacity → date/occupancy availability → return selection/quote. Reuse BackendRoomVariant and search criteria. Gallery fallback for no photos/bad image, alt text, controls keyboard and clear current image. Capacity/max_adults/max_children explicit; FE tidak mengisi hotel-approved facilities yang tidak ada source.

GET catalog list/detail authoritative metadata; availability uses room_type_id/check_in/check_out → availability/quotes/total_minor. Stok per date bukan reservasi/hold; harga base katalog bukan final tax/package quote. Missing horizon/date inventory404 memberi unavailable reason, bukan “pasti sold out” jika unknown.

## Admin sample

/staff/catalog list/form for code/name/family/bed/size/capacity/description/amenities/photos. /staff/inventory read calendar/table, stock/block adjustment sample review. Catalog CRUD source tersedia tetapi trusted identity dan ff_catalog_write required; actual stock-adjustment/block APIs belum ditemukan. Sample publish/save tidak mengubah engine base rate/inventory.

## File/TODO

- [ ] CMP-08-UI: room detail/gallery/facilities/capacity, availability loading/empty/unknown; admin sample list/form/stock view.
- [ ] CMP-08-API: explicit public catalog/{id} and availability BFF allowlist/ID/date query; DTO mapping photo URLs/money/null arrays.
- [ ] CMP-08-QA: room404, images fail, unknown availability, date complete range, alt/focus, filter race, malformed photo scheme, admin direct API locked.
- [ ] CMP-08-LIVE: current public catalog/detail/availability smoke; staff CRUD activation separate gate/cleanup after identity.

Target pages booking/rooms/[id].vue, staff/catalog.vue, staff/inventory.vue; RoomGallery/RoomFacilities, catalog-client/mapper/fixtures; BFF catalog/rooms/[id].get.ts and availability.get.ts. Preserve search URL/draft; opening detail must not silently replace selection or consume stock.
