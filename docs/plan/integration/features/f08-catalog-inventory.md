# F08 — Katalog, inventory dan maintenance

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M4. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/08-catalog-inventory-and-maintenance-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/08-catalog-inventory-and-maintenance-2026-10-03.md).

## Outcome dan baseline

Browse katalog → edit metadata → preview; baca availability rentang; maintenance/adjustment hanya jika API tersedia.

Baseline terverifikasi: FE rooms fixture; backend katalog CRUD dan availability read tersedia.

## Kontrak dan perilaku

GET/POST catalog/rooms; GET/PUT/DELETE catalog/rooms/{id}; GET availability. Photos {url,alt}, family_name, bed_type, room_size_sqm, max_capacity/max_adults/max_children, base_price_minor.

Explicit DTO→view mapper, canonical IDs, null arrays, gallery placeholder jujur. DELETE dapat CANNOT_DELETE_ACTIVE_VARIANT. Jangan menyebut perubahan base_price sebagai update tariff engine. Inventory read bukan stock adjustment; availability bukan jaminan continuous physical room allocation.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/catalog/{index,[id]}.vue; app/pages/staff/inventory.vue; app/components/staff/RoomVariantForm.vue`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F08-UI:** Catalog admin form/list/gallery dan inventory read UI dengan states.
- [ ] **F08-API:** Integrasi public catalog segera; staff CRUD setelah gate identity, inventory mutations menunggu kontrak.
- [ ] **F08-QA:** Mapper tests + public search/catalog smoke; staff CRUD isolated with cleanup setelah identity; validate photo accessibility.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R01/R07/R09; maintenance/block/adjust/version API belum ditemukan. Metadata editing bisa didesain, mutasi memakai identity yang telah fixed.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Duplicate code409, invalid room400, delete active conflict, image missing, stock missing/incomplete interval, stale updates; rate unchanged tidak disamarkan.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
