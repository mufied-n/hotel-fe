# FE-05 — QA UI dan handoff integrasi

Status PARTIAL QA (3 Oktober 2026). Depends FE-01–04. Build, typecheck, lint, unit, Chromium E2E, console/hydration, responsive emulation dan screenshot telah dijalankan; physical Chrome Android, Safari/iOS, dan screen-reader QA tetap NOT RUN. Bukti: [laporan QA](../../qa/frontend-ui-report.md).

## Definition of done tahap UI

- [ ] Build, TypeScript dan lint lulus dengan command/versi tersimpan.
- [ ] Navigasi search→results→guest→review→demo status berjalan; back/edit/reset tidak kehilangan konteks tanpa penjelasan.
- [ ] Skenario loading, sold-out, invalid dates/occupancy, promo error, quote expired/price change, duplicate submit, pending/failure/expired/offline/assistance teruji.
- [ ] Keyboard lengkap, visible focus, dialog trap/restore/Escape, accordion semantic, labels/field errors, alt, aria-live status.
- [ ] Contrast WCAG AA diuji untuk teks/body/helper/status/focus; 200% zoom dan reduced-motion.
- [ ] Responsive browser 360/390/768/1440: tanpa overflow, summary/CTA tidak menutup konten, keyboard mobile tidak menghalangi fields. Browser emulation tidak ditulis sebagai physical-device pass.
- [ ] QA Chrome dan Safari aktual bila tersedia: catat device/browser/version/steps/result. Yang tidak dijalankan tetap NOT RUN.
- [ ] Screenshot evidence home/room result/guest/review/status setiap viewport utama disimpan, nama scenario jelas.
- [ ] Semua sample prices/stock/capacity ditandai demo; tidak ada request mutasi ke vendor atau Go.
- [ ] Tidak ada console/hydration errors; layout gambar reserved, hero/image prioritized wajar, lazy-load sisanya; ukur performa sebelum memberi target angka pass.

## Test scope yang bermakna

Unit: date-only/nights, Money formatting/rounding contract, draft invalidation dan guards. Component: rate selection, consent/form errors, timer lifecycle. Browser/E2E dengan mock client: happy path, back/edit, stale quote dan payment processing→expired/assistance. Hindari test yang hanya mencocokkan class CSS; visual review dibandingkan [source design](../../research/official-design-system.md).

## Handoff backend

| UI membutuhkan | Gap gate | Bukti sebelum replace mock |
|---|---|---|
| Catalog/results | G01–G03/G18/G19 | Catalog mapping hotel, complete search response, limits |
| Rate/quote/summary | G04–G08 | Money/quote/policy snapshot + error contract |
| Submit/retry | G09/G12/G15 | Idempotency+hold deadline, cancellation/recovery tests |
| Hosted payment/status | G10–G13 | Provider sandbox, verified events, owner authorization |
| Confirmation/operations | G14/G16–G22 | Staff protection, notification, DB/channel concurrency |

Saat BE ready, tulis transport adapter yang memetakan DTO final ke view model FE; mock client tetap untuk regression/UI review. Nuxt server/BFF jika dipilih hanya proxy/session boundary, tidak menghitung harga atau inventory ulang. Source of truth booking/payment/hold tetap Go/Postgres.

## Keputusan yang belum final

Font/logo/media handoff, stock per sellable variant, occupancy anak, breakfast entitlement, promo benefit konsisten, rounding/exponent provider, payment provider, guest access model, cancellation/refund exception, channel-manager authority, serta scope marketing pages di luar booking. UI demo tidak terblokir oleh semua keputusan ini; integrasi live memerlukan owner yang jelas dan bukti gate terkait.
