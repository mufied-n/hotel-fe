# RD-06 — Tracker eksekusi redesign

Tanggal: 3 Oktober 2026. Tracker diperbarui setelah checkpoint guest redesign. Dokumen plan selesai bukan berarti task implementasi selesai.

Status yang dipakai: PLANNED → IN PROGRESS → IN REVIEW → VERIFIED. Dependency yang belum tersedia ditulis terpisah sebagai BLOCKED/NOT RUN dengan alasan. UI verified tidak berarti live verified.

## Task dan dependency

| Task | Owner acceptance | Dependensi | Output/checkpoint | Status |
|---|---|---|---|---|
| RD-T01 | RD-00 | Riset | Snapshot source/route/contract dan daftar batas aktual | VERIFIED |
| RD-T02 | RD-01 | T01 | Asset/metadata manifest; kontak/font/media status | IN REVIEW — kontak diselaraskan; aset masih placeholder |
| RD-T03 | RD-01 | T01 | Tokens, typography, primitives, notice mode | VERIFIED |
| RD-T04 | RD-01 | T03 | Header/footer, steps, nav/action bar, gallery fallback | VERIFIED |
| RD-T05 | RD-01/02/03 | T02–04 | Results mobile, detail mobile, review desktop representatif | VERIFIED dengan placeholder |
| RD-T06 | RD-02 | T05 visual direction stable | Search/editor/promo state | VERIFIED |
| RD-T07 | RD-02 | T06 | Results, controlled selection, price labels | VERIFIED |
| RD-T08 | RD-02 | T07 | Detail/query/back/direct entry round trip | VERIFIED |
| RD-T09 | RD-03 | T07–08 | Guest/review, total, policy/consent, action bar | VERIFIED |
| RD-T10 | RD-03 | T09 | Status matrix, cancel dialog, timer/stale/error layout | IN REVIEW — shared panel selesai; seluruh visual state belum dicapture |
| RD-T11 | RD-04 | T04, T10 status primitives | OTP, list/detail, request/refund states | IN REVIEW |
| RD-T12 | RD-04 | T11 | Receipt screen/A4/calendar regression | PLANNED |
| RD-T13 | RD-05 | T05, guest core stable | Staff shell, identity/nav/capability state | IN REVIEW — shared shell selesai |
| RD-T14 | RD-05 | T13 | Front desk/housekeeping/stay | PLANNED |
| RD-T15 | RD-05 | T13 | Finance/catalog/inventory/revenue/monitoring/config/audit | PLANNED |
| RD-T16 | RD-07 | Per checkpoint | Responsive/accessibility/regression evidence | IN PROGRESS |
| RD-T17 | RD-01/07 | Approved assets available | Font/logo/photo fidelity final | BLOCKED — approved handoff belum tersedia |
| RD-T18 | RD-07 | T06–17 sesuai availability | Handoff report dan remaining gates | IN PROGRESS |
| RD-T19 | RD-08 | Fondasi existing | M1: tokens, hover/press/busy button, spinner/skeleton, reduced-motion | VERIFIED — shared primitives, typecheck/lint/unit/E2E PASS |
| RD-T20 | RD-08 | T19 | M2: results/detail pending, selected, duplicate/stale response guards | VERIFIED — browser loading/selection/quote busy + E2E flow PASS |
| RD-T21 | RD-08 | T19–20 | M3: checkout/OTP/guest management/status feedback | IN REVIEW — review/OTP/list/status/cancel wired; full state capture pending |
| RD-T22 | RD-08 | T19 | M4: disclosure/dialog, nav/rows dan staff controls | IN REVIEW — accordion/dialog/linked rows/shared controls wired; staff visual sweep pending |
| RD-T23 | RD-08/RD-07 | T19–22 | M5: normal/reduced motion, keyboard/touch, latency/error/regression evidence | IN PROGRESS — automated regression PASS; manual reduced-motion/device matrix NOT RUN |
| RD-T24 | RD-08 §9 | T19 | Reduced-motion eksplisit, width-stable button, delayed/slow pending helper | VERIFIED — fake-timer unit, typecheck/lint/build PASS |
| RD-T25 | RD-08 §9 | T24 | Section reveal selektif, observer/focus/SSR/print fallback | VERIFIED — results/detail/review targets; normal/reduced browser checks PASS |
| RD-T26 | RD-08 §9 | T24–25 | Guest route entrance tanpa exit wait, shell stabil, draft/scroll/focus aman | VERIFIED — Nuxt page transition + complete guest journey PASS |
| RD-T27 | RD-08 §9 | T24–26 | Loading→content, refresh, quote snapshot/stale guard dan slow feedback | VERIFIED — guest core, detail/list/status, request/refund consumers wired; unit/E2E PASS |
| RD-T28 | RD-08 §9 | T24, T27 | Image-ready lifecycle cache/error/fallback; approved photography terpisah | IN REVIEW — component/cache/error source built; real-photo visual state awaits approved media |
| RD-T29 | RD-08 §9 | T24, T27 | Nav/controls staff, single-owner alert/disclosure motion, optional dialog exit | IN REVIEW — shared guest/staff navigation and button controls wired; dialog exit intentionally deferred; full staff visual sweep pending |
| RD-T30 | RD-08 §9/RD-07 | T25–29 | Controlled latency/reordered responses, reduced/SSR/viewport/focus/regression QA | IN REVIEW — automated unit/E2E/build + normal/reduced responsive browser PASS; physical devices/screen reader NOT RUN |

T02 inventory dapat selesai ketika handoff pending sudah tercatat; T17 tetap menunggu approved assets. UX dapat diverifikasi dengan fallback, tetapi screenshot final brand tidak boleh memakai placeholder sebagai bukti fidelity.

## Checkpoint dan batas review/PR

| Checkpoint | Lingkup review | Verifikasi minimum |
|---|---|---|
| R0 | Baseline/contract/assets | Source inventory, keputusan scope; belum mengubah UI |
| R1 | Tokens/shell + tiga layar representatif | Typecheck/lint, guest/staff shell smoke, visual review 390/1440, keyboard |
| R2 | Search/results/detail | Round trip search/detail/back, invalid query, multi-room, selection, quote error |
| R3 | Guest/review/status | Consent/total, repeat submit, status/timer/stale/cancel, mock/API copy |
| R4 | OTP/My Bookings/receipt | Auth/allowed actions, refund/request, print dan long data |
| R5 | Staff | Existing operational flows dan role/capability locks |
| R6 | Aset/QA akhir | State/viewport matrix, build, full relevant regression, remaining gates |

Checkpoint dapat menjadi commit/PR jika alur repository mendukungnya; plan ini tidak membuat branch/commit/PR. Hindari satu PR yang sekaligus mengubah shell, seluruh routes, endpoint, dan payment contract. Jangan memecah per file ketika komponen dan consumer perlu berubah bersama agar build tetap valid.

Sebelum mengedit source, periksa diff terbaru agar uncommitted changes pengguna tetap terpelihara. Saat membuat PR kelak, sertakan problem/outcome, route/state evidence, checks yang dijalankan, dan batas aset/integrasi. Dokumen owner diperbarui jika scope implementasi berubah.

## Update status yang sah

VERIFIED mensyaratkan file aktual, acceptance dokumen owner, dan bukti terhubung pada laporan QA. Screenshot-only tidak memverifikasi contract/runtime; unit pass tidak memverifikasi layout; emulasi tidak menutup device QA. Laporan berisi route/scenario/viewport/mode/tanggal, bukan hanya “responsive PASS”.

## Dependency yang harus ditindaklanjuti

| Dependency | Dampak | Owner |
|---|---|---|
| Approved logo/font/photos | Fidelity final | Hotel/brand + FE assets |
| Contact/config authority | Bantuan/footer akurat | Hotel/config owner |
| Same-variant multi-room semantics | Label dan selection | Integration catalog/booking |
| API photo/rate metadata | Card/gallery/benefit | FE adapter + catalog/rate owner |
| Payment recovery/historical cancellation | Eligible action pada My Bookings | Integration guest/payment |
| Trusted staff auth/capabilities | Live staff action | Integration identity/ops |
| Browser/device availability | Physical-device QA | QA/user device access |

Tidak memperkirakan tanggal selesai sebelum dependency dan kapasitas eksekusi diketahui. Urutan dan gate cukup untuk mulai implementasi setelah pengguna meminta eksekusi.
