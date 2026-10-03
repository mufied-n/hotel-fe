# Completion task tracker

Tanggal 3 Oktober 2026. FE checkpoint C1–C6 sudah dieksekusi pada working tree. Tracker ini owner status CMP, tracker induk merangkum Fxx. Owner FE default; BE menyediakan kontrak/gates, QA mencatat evidence. `UI_DONE` dan `CONTRACT_VERIFIED` bukan bukti deployment atau production readiness.

## Status

TODO → IN_PROGRESS → UI_DONE atau CONTRACT_VERIFIED → CONNECTED_VERIFIED sesuai scope. WAITING_BE tetap ketika credential/API/env belum ada. CONTRACT_VERIFIED dapat melalui isolated contract harness dan tidak disebut current Go connected. Status gabungan harus mencatat subset selesai dan unresolved acceptance. Aktivasi capability berbeda dari code completion.

## Register

| Task | Scope/exit criteria | Dependency | Status | Owner | Evidence/blocker |
|---|---|---|---|---|---|
| CMP-00 | Refresh source/deploy/migration/flags; shared mock principal + disabled/error semantics plan | d1681b5 | CONTRACT_VERIFIED | FE+BE | BE HEAD 882ba4d + local assistance diff diperiksa; deploy/flag masih perlu handoff |
| CMP-06-UI | [Cancellation/assistance: screens/state/keyboard/sample](features/f06-cancellation-assistance.md) | CMP-00; F03 | UI_DONE | FE | Accessible cancel dialog + request history/form/sample |
| CMP-06-API | [Cancellation/assistance: adapters, safe existing APIs atau sample-only client](features/f06-cancellation-assistance.md) | CMP-06-UI; CMP-00 | CONTRACT_VERIFIED | FE | Guest-session BFF GET/POST; live deployment belum dibuktikan |
| CMP-06-QA | [Cancellation/assistance: unit/contract/browser acceptance](features/f06-cancellation-assistance.md) | CMP-06-UI/API | IN_PROGRESS | FE+QA | Mapper/body unit, 401 boundary, dialog Escape/cancel browser PASS; connected flag/ownership pending |
| CMP-06-LIVE | [Cancellation/assistance: connected scope/activation](features/f06-cancellation-assistance.md) | CMP-06-QA + handoff | WAITING_BE | BE+FE+QA | Guest request local contract/deploy/flag; historical cancel bridge |
| CMP-04-UI | [Receipt/print/ICS: screens/state/keyboard/sample](features/f04-artifacts-hardening.md) | CMP-00; F03 | UI_DONE | FE | A4 margin, wrapping, break isolation, screen-only controls |
| CMP-04-API | [Receipt/print/ICS: adapters, safe existing APIs atau sample-only client](features/f04-artifacts-hardening.md) | CMP-04-UI; CMP-00 | CONTRACT_VERIFIED | FE | Existing private receipt/ICS BFF retained |
| CMP-04-QA | [Receipt/print/ICS: unit/contract/browser acceptance](features/f04-artifacts-hardening.md) | CMP-04-UI/API | IN_PROGRESS | FE+QA | Build PASS; rendered A4 visual and connected ownership/header QA NOT_RUN |
| CMP-04-LIVE | [Receipt/print/ICS: connected scope/activation](features/f04-artifacts-hardening.md) | CMP-04-QA + handoff | WAITING_BE | BE+FE+QA | Current guest deployment/ownership/artifact flags |
| CMP-05-UI | [Timer/poll/payment recovery: screens/state/keyboard/sample](features/f05-payment-hardening.md) | CMP-00; F01 | UI_DONE | FE | Timer reset, visibility refresh, stale-state preservation, ambiguity copy |
| CMP-05-API | [Timer/poll/payment recovery: adapters, safe existing APIs atau sample-only client](features/f05-payment-hardening.md) | CMP-05-UI; CMP-00 | CONTRACT_VERIFIED | FE | Existing booking-token status/cancel retained |
| CMP-05-QA | [Timer/poll/payment recovery: unit/contract/browser acceptance](features/f05-payment-hardening.md) | CMP-05-UI/API | IN_PROGRESS | FE+QA | Countdown unit + browser flow PASS; provider sandbox/cross-device NOT_RUN |
| CMP-05-LIVE | [Timer/poll/payment recovery: connected scope/activation](features/f05-payment-hardening.md) | CMP-05-QA + handoff | WAITING_BE | BE+FE+QA | Sandbox payment/current deployment; cross-device resume missing |
| CMP-08-UI | [Public catalog/admin inventory sample: screens/state/keyboard/sample](features/f08-catalog-inventory.md) | CMP-00 | UI_DONE | FE | Public detail/gallery/facilities/availability + catalog/inventory sample |
| CMP-08-API | [Public catalog/admin inventory sample: adapters, safe existing APIs atau sample-only client](features/f08-catalog-inventory.md) | CMP-08-UI; CMP-00 | CONTRACT_VERIFIED | FE | Public detail/availability BFF implemented; staff mutation remains off |
| CMP-08-QA | [Public catalog/admin inventory sample: unit/contract/browser acceptance](features/f08-catalog-inventory.md) | CMP-08-UI/API | IN_PROGRESS | FE+QA | Mock public detail/availability browser PASS; connected catalog smoke pending |
| CMP-08-LIVE | [Public catalog/admin inventory sample: connected scope/activation](features/f08-catalog-inventory.md) | CMP-08-QA + handoff | WAITING_BE | BE+FE+QA | Staff auth/ff_catalog_write; inventory adjustment routes missing |
| CMP-09-UI | [Package/promo/admin sample: screens/state/keyboard/sample](features/f09-packages-promo.md) | CMP-08-API; F01 | UI_DONE | FE | Benefit comparison, promo snapshot feedback, rate/promo sample workspace |
| CMP-09-API | [Package/promo/admin sample: adapters, safe existing APIs atau sample-only client](features/f09-packages-promo.md) | CMP-09-UI; CMP-00 | CONTRACT_VERIFIED | FE | Existing quote adapter retained; management API absent |
| CMP-09-QA | [Package/promo/admin sample: unit/contract/browser acceptance](features/f09-packages-promo.md) | CMP-09-UI/API | IN_PROGRESS | FE+QA | Valid/invalid/expired promo unit PASS; connected quote/flag pending |
| CMP-09-LIVE | [Package/promo/admin sample: connected scope/activation](features/f09-packages-promo.md) | CMP-09-QA + handoff | WAITING_BE | BE+FE+QA | Rate/promo CRUD/auth missing; quote flag/deploy |
| CMP-12-UI | [Identity/permissions/audit sample: screens/state/keyboard/sample](features/f12-staff-identity-ui.md) | CMP-00; OPS shell | UI_DONE | FE | Login/session-expired/forbidden, role nav, route middleware, audit sample |
| CMP-12-API | [Identity/permissions/audit sample: adapters, safe existing APIs atau sample-only client](features/f12-staff-identity-ui.md) | CMP-12-UI; CMP-00 | WAITING_BE | FE | Tidak ada trusted session/me/logout/permissions/audit contract |
| CMP-12-QA | [Identity/permissions/audit sample: unit/contract/browser acceptance](features/f12-staff-identity-ui.md) | CMP-12-UI/API | IN_PROGRESS | FE+QA | Role unit + nav browser PASS; spoof resistance/live session pending |
| CMP-12-LIVE | [Identity/permissions/audit sample: connected scope/activation](features/f12-staff-identity-ui.md) | CMP-12-QA + handoff | WAITING_BE | BE+FE+QA | Trusted auth/session/permissions/audit API missing |
| CMP-10-UI | [Channel monitoring sample: screens/state/keyboard/sample](features/f10-channel-monitoring.md) | CMP-12-UI | UI_DONE | FE | Health/delay/attention queue + retry simulation |
| CMP-10-API | [Channel monitoring sample: adapters, safe existing APIs atau sample-only client](features/f10-channel-monitoring.md) | CMP-10-UI; CMP-00 | WAITING_BE | FE | Management contract absent; no guessed upstream URL |
| CMP-10-QA | [Channel monitoring sample: unit/contract/browser acceptance](features/f10-channel-monitoring.md) | CMP-10-UI/API | UI_DONE | FE+QA | Offline retry browser PASS; live conflict/stop-sell pending with API |
| CMP-10-LIVE | [Channel monitoring sample: connected scope/activation](features/f10-channel-monitoring.md) | CMP-10-QA + handoff | WAITING_BE | BE+FE+QA | Channel contracts/sandbox/auth missing |
| CMP-11-UI | [Notifications sample: screens/state/keyboard/sample](features/f11-notifications.md) | CMP-12-UI | UI_DONE | FE | Masked delivery status/attempt/retry sample |
| CMP-11-API | [Notifications sample: adapters, safe existing APIs atau sample-only client](features/f11-notifications.md) | CMP-11-UI; CMP-00 | WAITING_BE | FE | Delivery ledger/retry API absent |
| CMP-11-QA | [Notifications sample: unit/contract/browser acceptance](features/f11-notifications.md) | CMP-11-UI/API | UI_DONE | FE+QA | Static states and no live send; provider delivery proof pending with API |
| CMP-11-LIVE | [Notifications sample: connected scope/activation](features/f11-notifications.md) | CMP-11-QA + handoff | WAITING_BE | BE+FE+QA | Delivery/retry ledger API/auth/provider proof missing |
| CMP-13-UI | [Hotel configuration sample: screens/state/keyboard/sample](features/f13-hotel-configuration.md) | CMP-12-UI | UI_DONE | FE | Timezone/check-in/out/cancellation sample editor |
| CMP-13-API | [Hotel configuration sample: adapters, safe existing APIs atau sample-only client](features/f13-hotel-configuration.md) | CMP-13-UI; CMP-00 | WAITING_BE | FE | Versioned config/publish API absent |
| CMP-13-QA | [Hotel configuration sample: unit/contract/browser acceptance](features/f13-hotel-configuration.md) | CMP-13-UI/API | UI_DONE | FE+QA | Offline save browser PASS; conflict/policy immutability pending with API |
| CMP-13-LIVE | [Hotel configuration sample: connected scope/activation](features/f13-hotel-configuration.md) | CMP-13-QA + handoff | WAITING_BE | BE+FE+QA | Config management/version/publish API/auth missing |
| CMP-REG | Cross-feature no-store/session isolation, responsive, mutation gates and failure regressions | CMP-*-QA | IN_PROGRESS | FE+QA | Automated gates PASS; print/mobile physical/screen-reader and connected failures remain |
| CMP-HANDOFF | Exact enabled scope, BE gaps, versions/evidence and rollback | CMP-REG | UI_DONE | FE+BE | Evidence report written; no automatic live activation |

## Checkpoint TODO

- [x] C0: CMP-00, freeze API/DTO fixtures and sample principal contracts.
- [x] C1: CMP-06 FE + provisional request BFF; connected acceptance remains gated.
- [ ] C2: CMP-04/CMP-05 FE complete; actual A4 print and provider recovery acceptance remain.
- [x] C3: CMP-08 public catalog + admin sample; connected public smoke remains.
- [x] C4: CMP-09 server-authoritative quote adapter + sample revenue management.
- [x] C5: CMP-12 explicit sample login/session/permission/audit.
- [x] C6: CMP-10/CMP-11/CMP-13 sample-only missing contracts.
- [ ] C7: CMP-REG/HANDOFF, tracker and evidence, connected activation per gate.

At checkpoint record actual paths, FE SHA, BE HEAD/local diff/deploy SHA, migrations/flag/provider mode, test commands PASS/FAIL/NOT_RUN, screenshots/print pages, blockers and next independent task. Evidence target docs/qa/integration/completion/<date>-<checkpoint>.md. Jangan menghitung persentase dari checkbox sebagai production completeness.
