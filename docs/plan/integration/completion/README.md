# Rencana penyelesaian guest journey dan management FE

Tanggal: 3 Oktober 2026, Asia/Jakarta. Status **FE IMPLEMENTED, LIVE GATES OPEN**. FE baseline awal `d1681b5`. Paket ini mencakup F06, hardening F04/F05, F08/F09, F12 UI, serta F10/F11/F13 sample workspace. Implementasi FE tersedia pada working tree; aktivasi live tetap mengikuti gate kontrak, deployment, flag, dan trusted staff authentication.

## Authority dan baseline

[Rencana induk](../README.md) tetap owner roadmap F01–F15. [Paket OPS](../operations/README.md) memiliki housekeeping/front desk/stay/finance yang sudah dibuat. Paket completion melanjutkan pekerjaan tersisa; tidak menggandakan board atau refund workspace. [Tracker lokal](02-task-tracker.md) memiliki task CMP-*; tracker induk hanya menyimpan ringkasan feature.

BE HEAD teramati `882ba4d` setelah feature flag runtime; working tree BE juga memiliki bantuan/special-request handler, package assistance, migration 00015 dan wiring router yang belum di-commit. Karena kontrak itu belum snapshot commit stabil, source files lebih tepat daripada klaim seluruh contract ada pada HEAD. Refresh SHA, diff, handler, service, migration dan deployment saat task mulai.

## Dokumen

- [Kontrak, architecture dan safety gates](00-contract-and-gates.md).
- [Matriks implementasi/integrasi](01-implementation-matrix.md).
- [Task tracker, dependencies dan checkpoint](02-task-tracker.md).
- [Skenario verifikasi dan handoff](03-verification-and-handoff.md).
- [F06 cancellation/assistance](features/f06-cancellation-assistance.md).
- [F04 receipt/print hardening](features/f04-artifacts-hardening.md).
- [F05 timer/payment recovery hardening](features/f05-payment-hardening.md).
- [F08 catalog/inventory](features/f08-catalog-inventory.md).
- [F09 packages/promo](features/f09-packages-promo.md).
- [F12 staff identity UI](features/f12-staff-identity-ui.md).
- [F10 channel monitoring](features/f10-channel-monitoring.md).
- [F11 notification management](features/f11-notifications.md).
- [F13 hotel configuration](features/f13-hotel-configuration.md).

## Tahap delivery

C0 refresh source/contract + capability/error foundations → C1 F06 → C2 F04/F05 → C3 F08 → C4 F09 → C5 F12 shell → C6 F10/F11/F13 → C7 regressions. F12 mock principal architecture boleh disiapkan C0, walau user-facing login/audit screen tetap C5. Feature bisa diuji dengan fixtures sebelum connected gate tersedia.

Public catalog, quote dan booking-token cancellation memakai existing API sesuai env uji. Guest special requests dapat diadaptasi setelah contract lokal dibekukan dan deployment/flag/ownership diverifikasi. Historical guest-session cancellation tetap menunggu credential bridge. Staff read/write tetap locked hingga trusted auth; missing management API tidak dibuat sebagai upstream URL hasil tebakan.

Output yang sudah dibuat: UI/DTO/BFF guest assistance dan public catalog, sample management workflows berlabel, explicit capability state, serta unit/browser regression. Evidence checkpoint dicatat di [laporan C1–C6](../../../qa/integration/completion/2026-10-03-c1-c6.md). Sisa pekerjaan adalah acceptance live terhadap deployment backend, visual print/device QA, dan management integration setelah trusted auth/API tersedia.
