# ST-05 — Catalog, inventory, rates dan promo

Dependency ST-01–02; RD-S07–S08. Owner FE catalog/revenue, BE catalog/inventory/rates. Status PLANNED. Source existing: [catalog model](</mnt/code/projects/jobs/pulang/current-booking/internal/catalog/catalog.go:22>) dan router CRUD; management lain masih proposal.

## Catalog — S07

Target `app/pages/staff/catalog.vue`, `app/types/management.ts`, management DTO/adapters/client baru mengikuti pola operations; komponen editor/media preview domain-specific.

- [ ] List varian + selected editor; bedakan family_name, bed_type, code, ID dan physical room number. Jangan menyamakan editorial interior dengan unit inventory tertentu.
- [ ] Editor memuat semua RoomVariant: code/name/family/bed/size/max_capacity/max_adults/max_children/base_price_minor/description/amenities/photos URL+alt. PUT full object tidak kehilangan field yang tak ditampilkan.
- [ ] Validation sesuai handler/store existing, integer nonnegative sesuai field, required code/name, max_capacity≥1, base_price_minor>0; tambahan cross-field capacity invariant disepakati BE, tidak diklaim enforced jika store belum memvalidasi.
- [ ] Photo URL/alt/reorder preview; upload tidak diciptakan tanpa API storage. Media gagal punya fallback yang menjaga editor bekerja.
- [ ] Dirty snapshot, save/discard, guard route/close/selected item; session expiry tidak menyimpan draft PII/token di persistent browser storage.
- [ ] Before→after preview untuk metadata dan harga; base price memengaruhi dynamic rate engine setelah R09, bukan harga final semua tanggal. Search/quote locked snapshots existing mengikuti BE, jangan invalidasi booking/quote secara lokal.
- [ ] `CONFLICT_ROOM_CODE`, invalid room, not found dan delete-in-use mengikuti router code aktual; error inline dan preserve draft. Delete GM saja sesuai migration snapshot, confirmation nama/code dan impact.
- [ ] Version conflict UI target tersedia sample; live CAS/expected_version belum ada. Re-read sebelum save membantu deteksi tetapi tidak mencegah race; jangan klaim protected edit.

## Inventory — S07

Target `app/pages/staff/inventory.vue`. Existing availability read dipakai sebagai read contract yang sesuai parameter handler, bukan management inventory calendar. Room readiness berbeda dari sellable allotment, allocated rooms, held stock dan maintenance blocks.

- [ ] Sample date grid tipe kamar: availability, block context, selected date/range; editor allotment/block tetap labeled sample/locked.
- [ ] Impact review range [start,end), room type, affected nights, before/after dan reason; jangan infer jumlah kamar bisa dijual dari jumlah inspected saja.
- [ ] BE handoff: calendar read, block CRUD/restore, constraints committed/held inventory, version+idempotency, audit actor, scope dates/timezone dan conflict envelopes.

## Revenue — S08

Target `app/pages/staff/{rates,promos}.vue`. Pricing/search/quote engine tersedia; belum ada management rate/promo route. SRS F09 untracked/proposed bukan izin memakai URI baru.

- [ ] Rate list/editor: plan/variant/date range/base price/benefits, selected state, dirty guard dan validation. Bedakan room_only, breakfast benefits, per-room/per-person charges dan child age tiers yang kini ada di BE R10.
- [ ] Promo editor: code/type/value/validity/applicability, sample validation dan preview scenarios tanpa mengklaim published/active di backend.
- [ ] Impact preview menggunakan sample deterministic atau server preview kelak; angka final dan stacking/min nights/blackout/usage limit memerlukan contract. Tidak hardcode aturan marketing dari snapshot vendor.
- [ ] BE handoff rate/promo read/write, full DTO/enums, effective dates, price unit, stacking/benefit rules, version/collision, preview/apply dan role permissions. Publish/schedule mutation disabled hingga kontrak available.

## Acceptance

Catalog raw full DTO round trip tidak membuang fields; role revenue_mgr create/edit tetapi delete denied. Editor dirty leave/cancel/save-failure/select-other tidak kehilangan draft tanpa keputusan pengguna. Local estimate diberi label, priced quote tidak dianggap management write. Inventory/rates/promo sample success tidak menyatakan stock/quote/promo live berubah. Financially meaningful price preview final harus berasal dari backend.
