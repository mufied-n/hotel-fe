# F09 — Guest package/promo dan admin sample

Tasks CMP-09-*; existing rate IDs already room_only/bed_and_breakfast. Jangan melakukan code rename yang sudah selesai.

## Guest behavior

Comparison Room Only vs Room + Breakfast memuat benefit/policy price sesuai quote. Breakfast headcount semantics mengikuti BE, bukan asumsi max occupants. Invalid/expired promo gabungan error karena BE ErrInvalidPromoCode tidak membedakan keduanya. UI tidak membangun jadwal expiry promo sendiri.

Apply/remove code → new quote → compare old/new totals and cancellation → review/accept. Jangan retain accepted old quote dengan prices/policy baru. Promo may force non-refundable; explain sebelum submit. Backend quote expiry15m authoritative; jika expired req new quote, show changed data, minta review lagi. Demo promo percentages/history tidak digunakan sebagai final API rate authority.

## Staff sample

/staff/rates dan /staff/promos memuat plans/night/date/rules, validity/quota simulation, version conflict, draft/review/sample save. Endpoints CRUD/version/validity/quota belum ada; field schemas adalah proposal UI, bukan DTO actual. Sample preview tidak memodifikasi booking quote ataupun BE engine.

## File/TODO

- [ ] CMP-09-UI: RatePlanComparison, promo feedback, changed-policy/pricing review; admin rates/promos sample.
- [ ] CMP-09-API: refine quote adapter/package codes, clear stale quote on mutation inputs, preserve server breakdown/expiry/policy; no management upstream request.
- [ ] CMP-09-QA: invalid/expired/blank/remove promo, unknown plan, breakfast/occupancy, rounding IDR0, concurrent quote order, price/policy changes, expired accepted quote.
- [ ] CMP-09-LIVE: known plan/code quote actual deployment and totals/policy reference; admin live remains WAITING_BE APIs/auth.

Target rate-plans.ts metadata, RoomCard/RatePlanComparison, draft/results/review adapter, staff rates/promos, fixture/client/types. Jangan hardcode discount di Vue; validasi integer amount. API FEATURE_DISABLED ditangani sebagai quote capability disabled.
