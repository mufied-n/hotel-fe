# RD-09 — Frontend reliability dan completion plan

Tanggal: **4 Oktober 2026, Asia/Jakarta**. Status: **IN REVIEW — implementation pass selesai; live environment, physical device, screen reader dan full visual matrix tetap terbuka**. Owner: FE staff + FE guest. Tracker authority tetap [RD-06](06-execution-tracker.md).

Dokumen ini merencanakan lima scope yang disetujui: state handling staff, form/editor protection, monitoring dan administration, reusable staff filters, serta sisa guest-facing frontend. Implementasi mempertahankan identitas editorial PULANG dan mode sample/API yang sudah ada. Plan ini tidak mengaktifkan mutation backend yang masih dikunci.

## Baseline source dan gap

| Area | Baseline saat ini | Gap yang ditutup |
|---|---|---|
| Staff state | `StaffDataState` membedakan loading, error, empty; beberapa route sudah memakai generation guard | Initial load, refreshing, stale snapshot, partial error, no matches, forbidden, locked dan conflict belum konsisten |
| Filters | Front desk, housekeeping dan finance memiliki form filter sendiri | Belum ada active-filter summary, reset seragam, mobile disclosure, URL round trip, atau scope label yang konsisten |
| Editor | Catalog memiliki `dirty`, confirm saat ganti item dan route leave | Rates, promo, inventory dan configuration belum memiliki baseline snapshot, discard, leave guard, validation summary, atau before/after review |
| Monitoring/admin | Channels, notifications dan audit berupa fixture cards; configuration dapat membaca feature flags | Belum ada filter, selected drawer, retry review, redaction detail, freshness, conflict, atau preservation saat refresh gagal |
| Guest completion | Status, OTP, Booking Saya, request/refund dan receipt sudah ada | State matrix belum seluruhnya diregresi; receipt A4/calendar, OTP recovery, list/detail stale/error dan long-data belum memiliki bukti lengkap |

## Keputusan implementasi

1. Data lama tetap terlihat saat refresh gagal dan diberi label **“Data terakhir berhasil dimuat…”**. Error refresh tidak mengganti snapshot menjadi empty.
2. First load, refresh, empty system dan no filter matches merupakan state berbeda. Tombol reset hanya muncul pada no matches yang memiliki filter aktif.
3. Hanya query non-PII yang masuk URL: tanggal operasional, status, floor, room type, channel, template dan result. Nama tamu, email, reference, notes dan recipient tidak disimpan di URL.
4. Request list memakai generation/abort ownership sehingga respons lama tidak menimpa filter terbaru. Mutation tidak diulang otomatis.
5. Dirty state berasal dari perbandingan baseline dan draft, bukan hanya event input. Save gagal mempertahankan draft; discard mengembalikan baseline terakhir.
6. Review mutation mengunci snapshot yang dilihat pengguna. Perubahan draft setelah dialog terbuka tidak boleh mengubah review diam-diam.
7. Retry channel/notification, inventory/rate/promo publish, policy write, dan audit live tetap sample/locked sampai kontrak backend tersedia.
8. Guest status dan refund memakai authority response. Offline/stale/unknown tidak dipetakan menjadi success atau failed.

## Workstream A — Reusable state dan filter foundation (RD-T31)

### Target file

| File | Perubahan |
|---|---|
| `app/components/staff/DataState.vue` | Tambah variant `refreshing`, `stale`, `no-results`, `forbidden`, `locked`, `conflict`; retry/reset slot; live announcement tunggal |
| `app/components/staff/FilterBar.vue` (baru) | Mobile disclosure, field slot, active-filter chips, result scope, reset dan submit; tidak memiliki semantics domain |
| `app/components/staff/FreshnessStatus.vue` (baru bila dua consumer membutuhkannya) | Last successful refresh, refreshing dan stale copy |
| `app/composables/useStaffFilterQuery.ts` (baru) | Parse/serialize allowlisted non-PII query, defaults, reset dan `router.replace`; typed per consumer |
| `app/composables/useLatestRequest.ts` (baru hanya bila dipakai minimal dua route) | Generation/abort lifecycle, initial vs refresh pending, stale snapshot dan cleanup |
| `app/pages/staff/front-desk/index.vue` | Date/status filter melalui shared bar; snapshot tetap saat refresh gagal |
| `app/pages/staff/housekeeping.vue` | Floor/status/room type URL round trip, reset, no matches dan selected-room preservation |
| `app/pages/staff/finance/cases.vue` | Status filter, local-scope label dan selected case preservation |
| `app/assets/css/staff.css` | Disclosure/filter/chip/freshness layout untuk 360–1440px |

### Acceptance

- Direct URL dan back/forward memulihkan filter yang aman; invalid query kembali ke default tanpa loop navigasi.
- Respons filter A yang datang setelah filter B diabaikan.
- Refresh gagal mempertahankan data, selection dan scroll; first-load failure tetap memakai full error state.
- Empty system dan no matches memiliki copy serta recovery berbeda.
- Filter bar dapat dipakai dengan keyboard, tidak menutup hasil pada 200% zoom, dan disclosure memiliki `aria-expanded`/`aria-controls`.

## Workstream B — Editor protection dan change review (RD-T32)

### Target file

| File | Perubahan |
|---|---|
| `app/composables/useUnsavedChanges.ts` (baru) | Baseline/draft comparison, dirty state, route leave, `beforeunload`, discard dan saved-baseline reset |
| `app/components/staff/UnsavedChangesDialog.vue` (baru) | Stay/discard/cancel choice untuk selected-item change; native dialog focus lifecycle |
| `app/components/staff/ChangeReview.vue` (baru) | Before→after rows, added/removed values, money/date formatting slots; domain tidak disederhanakan menjadi string generik |
| `app/pages/staff/catalog.vue` | Ganti boolean dirty manual dengan baseline comparison; validation summary, media change preview dan save-failure preservation |
| `app/pages/staff/inventory.vue` | Typed draft untuk room/date range/allotment/reason, validation, affected-night preview dan locked confirmation |
| `app/pages/staff/rates.vue` | Draft per rate, dirty guard, benefit/price before→after dan sample impact preview |
| `app/pages/staff/promos.vue` | Code/type/value/date/applicability validation, selected promo editor, discard dan deterministic preview |
| `app/pages/staff/configuration.vue` | Pisahkan feature flag read state dari hotel-policy draft; dirty guard dan policy before→after review |

### Validation minimum

- Catalog: code/name required, capacity ≥1, numeric fields nonnegative, base price >0; cross-field rules yang belum authoritative diberi label proposal.
- Inventory: start < end, allotment ≥0, reason required; range memakai `[start,end)` dan menampilkan jumlah malam.
- Rates: price integer ≥0, benefits tidak hilang saat discard/select; harga preview tidak diklaim quote final.
- Promo: code 1–24, percent 1–100 atau fixed >0, start < end; stacking/usage/blackout tetap unavailable.
- Configuration: waktu valid, timezone read-only, cancellation required; tidak menyatakan policy live tersimpan.

### Acceptance

- Route leave, browser close/reload dan pemilihan item lain memberi guard ketika dirty.
- Save gagal tidak membuang draft; save sample berhasil memperbarui baseline dan menghapus dirty badge.
- Review snapshot tetap stabil selama dialog terbuka, confirmation tidak dapat double-submit, Escape diblok saat busy.
- API read-only mode tidak menampilkan tombol seolah mutation tersedia.

## Workstream C — Monitoring dan administration depth (RD-T33)

### Data fixture dan types

Perluas `app/types/management.ts` dan `app/data/management-scenarios.ts` dengan data deterministik:

- Channel: operation/resource, version label sample, attempts, last event, sanitized error dan retry eligibility.
- Notification: masked recipient, template/reference, accepted/queued/sent/delivered/failed/unknown timeline dan attempts.
- Audit: resource type/id, result, sanitized before/after serta actor/time. Jangan menambahkan raw OTP, credential, guest notes atau recipient lengkap.

### Route implementation

| File | Perubahan |
|---|---|
| `app/pages/staff/channels/index.vue` | Filter status/channel, freshness, selected detail drawer, sample retry review dan conflict/stale copy |
| `app/pages/staff/notifications/index.vue` | Filter channel/status/template, masked detail timeline, retry eligibility dan duplicate-delivery warning |
| `app/pages/staff/audit.vue` | Filter actor role/result/resource, selected drawer, sanitized before/after dan long-reference handling |
| `app/pages/staff/configuration.vue` | Feature flag selected detail dan locked edit review; hotel policy tetap terpisah |
| Shared staff components dari T31–T32 | Filter, drawer, action dialog, change review dan data states direuse |

### Acceptance

- Healthy, delayed, stale, unknown dan failed tidak hanya dibedakan dengan warna.
- Retry review menyebut intent/resource/recipient masked dan risiko duplikasi; hasil sample tidak mengubah status menjadi healthy secara optimistis.
- Filter dan selected item bertahan saat refresh; selected item yang hilang menghasilkan stale/conflict state, bukan drawer kosong.
- API mode tidak fallback ke fixture pada error.
- Audit sample tetap berlabel sample dan tidak dinyatakan sebagai server audit trail.

## Workstream D — Guest-facing completion (RD-T34)

### Status dan recovery

- `app/pages/booking/status/[id].vue` dan `BookingStatusPanel.vue`: uji seluruh union status, unknown fallback, stale/offline, elapsed timer, cancel error, generation guard dan visibility refresh.
- Pisahkan cancel success dari refund state; tidak menampilkan “dana kembali” tanpa refund authority.
- Pertahankan satu action owner agar retry/status refresh tidak dapat menjadi double mutation.

### OTP dan Booking Saya

- `app/pages/booking/login.vue`: invalid/expired OTP, resend cooldown, rate limit, service unavailable, ganti email dan valid `returnTo`; input memakai autocomplete/paste.
- `app/pages/booking/my/index.vue`: checking-session, unauthenticated, initial loading, refresh-with-snapshot, empty system, empty filter dan expired session.
- `app/pages/booking/my/[id].vue`: detail stale/refresh error terpisah dari refund/request child errors; allowed actions tetap authoritative.
- `GuestRequestPanel.vue` dan `RefundStatusPanel.vue`: unknown status fallback, long text, reload preservation dan no false-empty on error.

### Receipt dan calendar

- `app/pages/booking/my/[id]/receipt.vue`: print hierarchy A4, repeated/multi-page content, long guest/reference/email, page-break protection, print-only mode/status/source label.
- Calendar tetap memakai endpoint BFF existing. Test memeriksa response/content headers dan auth behavior; FE tidak membuat ICS alternatif.
- Tambah screenshot/PDF-render evidence hanya bila renderer tersedia; tanpa itu status dicatat source/browser-print verified, bukan PDF artifact verified.

### Acceptance

- Semua status booking/refund/request memiliki readable fallback dan tidak default success.
- OTP recovery tidak mengubah email atau `returnTo` secara tersembunyi.
- Error child panel tidak menghapus detail booking utama.
- Receipt screen dan print tidak memotong total/status; controls dan booking shell tidak ikut tercetak.
- Guest journey regression tetap berjalan pada mode sample dan API-stub scope yang tersedia.

## Workstream E — Verification dan handoff (RD-T35)

### Automated tests

| Test | Coverage |
|---|---|
| `tests/unit/staff-filter-query.test.ts` (baru) | Allowlist, defaults, invalid values, round trip dan PII exclusion |
| `tests/unit/latest-request.test.ts` (baru jika composable diekstrak) | Out-of-order response, stale snapshot dan unmount cleanup |
| `tests/unit/unsaved-changes.test.ts` (baru) | Baseline equality, nested arrays, discard/save reset dan route decision |
| `tests/unit/management-scenarios.test.ts` (baru) | Redaction invariant, status fallback dan deterministic preview |
| Existing guest unit tests | Unknown/refund/request/timer behavior yang berubah |
| `tests/e2e/booking.spec.ts` | Staff filter URL/back, stale refresh, dirty leave/discard, retry dialog focus, guest status matrix, OTP recovery, receipt print/calendar smoke |

Jangan menulis tes yang hanya memeriksa class CSS. Controlled latency/error dapat memakai fixture atau route interception dan harus menyebut bahwa bukti tersebut mocked.

### Viewport dan accessibility matrix

- 360×800, 390×844, 768×1024, 1024×768, 1440×900 dan zoom 200%.
- Keyboard: filter disclosure, chip reset, drawer/dialog trap and return, dirty guard, retry review dan print controls.
- Normal/reduced motion, pointer fine/touch emulation, long data, zero/large money dan unknown status.
- Physical Android/iOS dan screen reader dicatat `NOT RUN` sampai perangkat/tool benar-benar digunakan.

### Required checks per final checkpoint

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run build
git diff --check
```

## Urutan commit dan dependency

| Urutan | Commit scope | Dependency | Review gate |
|---|---|---|---|
| 1 | T31 shared state/filter foundation + front desk/HK/cases consumers | Existing staff shell | Unit filter + focused E2E + typecheck/lint |
| 2 | T32 unsaved changes/change review + catalog/rates/promo/inventory/config consumers | T31 data states | Unit dirty lifecycle + focused editor E2E |
| 3 | T33 channels/notifications/audit/config detail and retry review | T31–32 components | Redaction test + role/direct route + dialog E2E |
| 4 | T34 guest status/OTP/My Bookings/receipt completion | Existing guest contracts | Guest unit + journey/status/print/calendar E2E |
| 5 | T35 cross-route QA, docs and handoff | T31–34 | Full checks/build + viewport evidence |

Setiap commit harus buildable dan reviewable. Jangan menggabungkan activation mutation backend dengan commit UI ini. Bila implementasi menemukan kontrak baru atau backend berubah, perbarui owner plan terkait sebelum mengaktifkan aksi.

## Gates dan non-scope

| Gate | Dampak |
|---|---|
| Staff API runtime masih berbeda dari source | Live login/read E2E tetap `WAITING_ENV`; sample dan API-failure states dapat dikerjakan |
| Channel/notification/audit API belum ada | List/detail/retry tetap fixture sample/locked |
| Inventory/rate/promo/policy write contract belum ada | Editor dan impact review dapat lengkap; publish/save live tidak diaktifkan |
| Feature flag CAS/version belum ada | Conflict UX dapat disimulasikan; tidak diklaim concurrency-safe |
| Approved logo/font/photo belum tersedia | Reliability completion tidak menutup final brand fidelity |
| Physical devices/screen reader belum tersedia | Automation/emulation tidak menutup device/accessibility acceptance |

Tidak termasuk dalam paket ini: landing marketing baru, endpoint backend baru, pembayaran/refund nyata, OTA/provider call, upload media, global audit feed, atau deployment produksi.

## Definition of done paket

- T31–T35 memiliki implementation evidence di `docs/qa/redesign/` dan status RD-06 diperbarui berdasarkan bukti aktual.
- Seluruh route target memiliki initial/refresh/empty/no-match/error/stale/locked yang relevan tanpa fallback sample tersembunyi dalam API mode.
- Semua editor target menjaga draft dan memberi review dampak yang jujur.
- Monitoring/admin dapat dipindai, difilter dan ditinjau lewat drawer/dialog tanpa membocorkan data sensitif.
- Guest status, OTP, Booking Saya, receipt dan calendar memiliki regression yang sesuai contract.
- Full checks lulus; gate backend, aset dan physical-device yang belum dijalankan tetap dinyatakan terbuka.
