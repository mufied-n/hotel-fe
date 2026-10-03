# RD-10 — Controlled failure dan responsive visual QA

Tanggal: **4 Oktober 2026, Asia/Jakarta**. Status: **IN REVIEW — automated controlled failure, responsive matrix, screenshot inspection dan full regression selesai; physical device/manual browser zoom tetap terbuka**. Owner: FE/QA. Tracker authority tetap [RD-06](06-execution-tracker.md).

## Tujuan

Menutup gap QA frontend yang masih dapat dikerjakan tanpa backend live:

1. Membuktikan data lama tetap terlihat ketika refresh gagal atau lambat.
2. Membuktikan respons lama tidak menimpa pilihan/filter terbaru.
3. Memeriksa layout representatif pada 360, 390, 768, 1024 dan 1440 CSS px.
4. Memeriksa reflow sempit yang mewakili tekanan layout pada zoom 200%.
5. Menyimpan screenshot reviewable dan laporan dengan batas evidence yang jelas.

Physical Android/iOS, virtual keyboard dan screen reader tidak termasuk bukti ini dan tetap `NOT RUN`.

## Prinsip test harness

- Controlled delay/failure hanya tersedia pada operations **mock mode** dan development/test build.
- Kontrol menggunakan query berawalan `qa_`; tidak masuk client API production dan tidak mengubah kontrak backend.
- Failure deterministic berdasarkan nama operation dan nomor pemanggilan, sehingga first load dapat sukses lalu refresh berikutnya gagal.
- Copy UI tetap menyebut sample; test tidak mengklaim backend outage nyata.
- Request-ordering logic diuji pada utility kecil dengan deferred promises; route E2E membuktikan stale snapshot dan recovery yang terlihat pengguna.

## Task dan urutan

### RD-T36 — Controlled failure harness

Target:

- `app/services/mock-operations-client.ts`: options delay/fail operation/fail-after-call.
- `app/composables/useOperationsClient.ts`: parse allowlisted `qa_delay`, `qa_fail`, `qa_fail_after` hanya pada mock dev/test.
- `app/utils/latest-request.ts`: generation owner kecil untuk menerima hasil terbaru saja.
- Front desk, housekeeping dan finance cases: gunakan owner yang sama; selection dan snapshot tetap ada saat refresh gagal.
- Unit tests: invalid QA query ignored, delay bounded, deterministic fail count, latest request wins.

Acceptance:

- First load sukses, refresh kedua gagal, snapshot tetap terlihat dengan stale label dan retry.
- Retry failure tidak memicu mutation atau menghapus selection/draft.
- Dua promise selesai terbalik; hanya generation terbaru boleh commit.
- QA parameters tidak aktif pada API mode atau production build.

### RD-T37 — Responsive and zoom-pressure sweep

Route representatif:

- Guest: `/booking`, results, room detail, review/status fixture yang dapat dicapai tanpa PII.
- Staff: housekeeping board, finance cases, rates editor, channels detail.

Matrix:

| Label | Viewport | Fokus |
|---|---:|---|
| mobile-small | 360×800 | no horizontal overflow, filter disclosure, CTA |
| mobile | 390×844 | cards, drawer/dialog, bottom actions |
| tablet-portrait | 768×1024 | split collapse, editor reachability |
| tablet-landscape | 1024×768 | sidebar/workspace and sticky editor |
| desktop | 1440×900 | hierarchy, density and max-width |
| zoom-pressure | 640×800 | 200% equivalent reflow pressure; not manual browser zoom proof |

Automated assertions:

- `scrollWidth <= clientWidth + 1` pada document dan main content.
- Primary heading dan aksi utama terlihat.
- Filter disclosure pada mobile; desktop fields terlihat.
- Drawer/dialog tidak lebih lebar/tinggi dari viewport.
- Long fixture text membungkus tanpa page-level overflow.

Screenshot evidence disimpan di `docs/qa/redesign/evidence/2026-10-04-responsive/` untuk kombinasi representatif, bukan setiap state duplikat.

### RD-T38 — Findings, fixes dan final verification

- Inspeksi screenshot aktual; perbaiki overflow/focus/sticky/density yang ditemukan.
- Jalankan ulang focused tests setelah setiap fix.
- Final: typecheck, lint, unit, full E2E, build dan diff check.
- Perbarui RD-06 dan buat laporan `docs/qa/redesign/2026-10-04-controlled-failure-responsive.md`.

## Perkiraan commit boundaries

1. `test: add controlled frontend failure scenarios` — harness, utilities dan tests.
2. `fix: harden responsive frontend layouts` — hanya jika sweep menemukan defect source.
3. `docs: record responsive and failure QA evidence` — screenshots, report dan tracker.

Commit boleh digabung menjadi satu checkpoint bila perubahan saling bergantung dan seluruh gate hijau. Tidak membuat baseline screenshot assertion yang rapuh terhadap setiap perubahan copy.

## Definition of done

- Controlled stale refresh dan latest-response ownership dibuktikan otomatis.
- Semua viewport matrix tidak memiliki page-level horizontal overflow pada route yang diperiksa.
- Screenshot representatif telah dilihat, bukan hanya dibuat.
- Temuan source diperbaiki dan full regression lulus.
- Laporan menyebut browser/version, mode, route, viewport, hasil dan remaining gates.
