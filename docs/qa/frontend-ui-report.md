# Laporan QA frontend booking demo

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Scope akhir hanya webapp booking; `/` redirect ke `/booking`. Landing dan marketing pages tidak termasuk.

## Hasil terverifikasi

| Pemeriksaan | Hasil |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 4 files, 11 tests |
| `npm run build` | PASS — Nuxt 4.5.2 / Nitro node-server |
| `npm run test:e2e` | PASS — 3 Chromium scenarios |
| Root redirect | PASS — `/` menuju `/booking` |
| Happy path | PASS — search → results → guest → review → pending status |
| URL recovery | PASS — results dapat dibuka ulang; query invalid ditolak |
| Viewport emulation | PASS — 360, 390, 768, 1440 tanpa horizontal overflow pada route yang diperiksa |
| Runtime console/hydration | PASS pada capture akhir; tidak ada warning/error yang direkam |
| Network vendor/backend | PASS secara arsitektur: client mock tidak memiliki fetch/request vendor atau Go |
| `npm audit --omit=dev` | FAIL — 7 high findings dari `node-forge@1.4.0` melalui `nuxt → @nuxt/cli/nitropack → listhen`; advisory saat ini belum mencantumkan patched npm version dan saran `--force` akan downgrade breaking ke Nuxt 3.15.1 |

Unit test mencakup DateOnly checkout-exclusive, pergantian bulan/leap year, integer Money, query multi-room, quote aggregation, exact included charges snapshot, dan idempotency replay.

## Evidence

- `evidence/results-mobile.png` — 360px.
- `evidence/results-tablet.png` — 768px, child occupancy.
- `evidence/results-desktop.png` — 1440px.
- `evidence/guest-mobile.png` — 390px.
- `evidence/review-tablet.png` — 768px.
- `evidence/status-desktop.png` — 1440px.

Evidence memakai browser desktop Chromium melalui Playwright. Ini adalah emulasi viewport, bukan pemeriksaan perangkat fisik.

## Batas dan NOT RUN

- Physical Chrome Android: NOT RUN.
- Safari desktop dan physical Safari iOS: NOT RUN.
- Screen reader manual: NOT RUN.
- Logo, brand font, dan foto kamar resmi: pending owner handoff; UI memakai placeholder berlabel dan Arial/system fallback.
- Integrasi Go/Postgres, stock hotel, payment provider, email, dan provider sandbox: tidak termasuk prototype dan belum dijalankan.
- Scenario dev menyediakan sold-out, service error, payment states, dan offline untuk inspeksi. E2E otomatis saat ini memverifikasi happy path dan URL recovery; seluruh scenario matrix belum diotomasi.
- Dependency audit belum bersih. Prototype tidak memakai API RSA `node-forge` secara langsung, tetapi temuan transitive tetap harus dipantau dan diselesaikan melalui update Nuxt/listhen/node-forge yang didukung sebelum release.
