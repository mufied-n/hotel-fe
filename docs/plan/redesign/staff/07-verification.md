# ST-07 — Verifikasi dan handoff staff

Dependency seluruh tahap; RD-S10. Owner FE QA + owner domain BE untuk activation. Status PLANNED. Laporan evidence baru di `docs/qa/redesign/staff/`; status tetap RD-06.

## Paket checkpoint

| Checkpoint | Scope commit/review | Gate minimum |
|---|---|---|
| S1 | Session/BFF/DTO + consumers auth | Unit negative auth, no-store/CSRF/body limits, 204/429/error mapping, API fixtures |
| S2 | Shell/primitives + roster/HK/cases contoh | Lint/typecheck, desktop/tablet/mobile screenshots, keyboard/dialog/reduced-motion |
| S3 | Roster/handover/housekeeping/stay | Domain states/errors, sample tests, role action matrix, direct entry |
| S4 | Finance read/review | Exact money/envelopes, unknown outcome, pending refund, live submit gate |
| S5 | Catalog/inventory/revenue | Full DTO/draft guard/validation, sample/live boundaries, quote guest regression |
| S6 | Channels/notifications/config/audit | Locked/unknown/stale/retry review, redaction, config partial contract |
| S7 | Integration activation per capability | Isolated DB/provider + deployed flags/session/permissions evidence, then live acceptance |

## Test matrix wajib

- [ ] Modes: explicit sample; API available; API capability disabled; malformed/upstream unavailable. Tidak sample fallback saat api auth error.
- [ ] Roles: receptionist, housekeeping, revenue_mgr, finance, gm_admin, unknown role; direct URL, forbidden action, invalid/revoked/expired session; two users sequential browser login tanpa leaked state.
- [ ] States: initial load, slow load, empty, no filter matches, partial error, stale refresh, selected, dirty, validation, busy, success, conflict, unknown outcome.
- [ ] Latency/order: old filter response arrives last, double submit, refresh failure setelah action sukses, change resource saat request pending, navigation/unmount.
- [ ] Visual: 390×844, 768×1024, 1024×768, 1440×900; 360px width/200% zoom edge; long names/notes/refs dan large/zero money.
- [ ] Accessibility/motion: keyboard nav/row/actions, focus trap/return, Escape, aria-busy/live feedback, contrast, normal/reduced motion dan touch. Emulation bukan physical-device/screen-reader evidence.
- [ ] Regression: guest search/detail/quote/review/status, OTP/Booking Saya, receipt print; CSS/session staff tidak mengubah guest journey.

Frontend commands setelah implementation: `npm run typecheck`, `npm run lint`, `npm run test:unit`, targeted Playwright staff suite lalu guest regression relevan, `npm run build`. Jangan buat tes yang hanya memeriksa class CSS; periksa intent, state, raw contract mapping, permission dan actual navigation.

## Live gate per domain

Session/reads: migrations/password provisioning, TLS, session revoke/expired/header spoof, Casbin migrations dan flag configuration; source route tidak membuktikan deploy route available.

Ops writes: status transitions/readiness/OOO transaction-replay/assignment overlap/version; actor provenance; multi-room stay semantics. Extension preview/payment/idempotency gate terpisah.

Finance writes: concurrency/replay/idempotency/recovery/status-write failure/sandbox provider, staff lookup balance/history; case resolution enum+effect semantics. Tidak menjalankan refund uang nyata sebagai QA.

Management writes: final contract, role matrix, validation, version/CAS, unsaved changes, preview/apply semantics. Monitoring retry memerlukan durable idempotent job dan status authority.

## Bentuk handoff

Setiap evidence mencatat commit FE/BE, environment/mode, route, role, scenario, viewport/browser/version, langkah dan hasil, screenshot bila visual, test command/output serta remaining gate. Bedakan **implemented**, **automated verified**, **rendered checked**, **device checked**, **live activated**.

Checklist docs atau historical E2E report bukan bukti deploy saat ini. PR/commit mencakup perubahan buildable dengan evidence, bukan menandai semua staff completed karena dashboard pertama sudah bagus. User approval diperlukan hanya untuk aksi deployment/external yang belum diotorisasi; pekerjaan local FE setelah diminta implementasi dapat berlanjut dalam scope plan.
