# Verification, source refresh dan handoff

Status acceptance plan; seluruh result baru NOT_RUN. Scope user berakhir pada FE/available contract integration; provider live charge, real email, channel writes dan policy publish bukan implicit action.

## Verification commands

Implementation checkpoint: npm run typecheck, npm run lint, relevant unit/contract tests, npm run build; browser tests untuk affected flow. Final regression npm run test:unit dan npm run test:e2e. Docs-only change cukup link/status/source reference validation.

## Acceptance matrix

| ID | Scenario | Evidence scope |
|---|---|---|
| V06-1 | Dialog keyboard/focus/Escape, late deadline, non-refundable409, double click | Component/browser fixture |
| V06-2 | Wrong token/non-owner/session expired cancel, cancelled not refund | BFF contract + connected isolated later |
| V06-3 | Guest special request ownership/category/history/declined/FEATURE_DISABLED | Contract refresh + fixtures, current deployment later |
| V04-1 | A4 long guest/note receipt, wrapped rows, totals, print controls hidden | Print output rendered/visually inspected |
| V04-2 | Receipt/ICS401/404/503, headers/body/date timezone/private cache | Contract + guest connected later |
| V05-1 | Fake clock tick/expiry/snapshot reset/hidden-visible/unmount cleanup | Lifecycle harness; assert number polls |
| V05-2 | Slow old response, offline,429, FEATURE_DISABLED, no overlap, manual refresh | Unit/browser contract |
| V05-3 | Redirect/timeout unknown, safe payment origins, no automatic repeat payment | Contract + provider sandbox later |
| V08-1 | Missing/bad photos/alt/gallery keyboard; room404/capacity | Unit/browser |
| V08-2 | Availability date range/null/missing horizon/stale requests; base price not quote | Contract + public GET smoke |
| V09-1 | Promo add/remove/invalid/expired, policy change/review, quote expiry/price diff | Unit/contract/browser |
| V09-2 | Staff rate/promo sample save has no tariff/quote upstream effects | Network/gate assertions |
| V12-1 | Unknown sample role denied/direct route/expired/logout/SSR isolation | Mock principal/browser |
| V12-2 | Spoof browser role/header cannot activate staff BFF, safe returnTo | Direct request contract |
| V10-1 | Stale/conflicting mapping/retry/stop-sell sample only | Mock/browser, zero live network |
| V11-1 | Accepted vs delivered vs unknown, masked recipient/token-free preview, retry ambiguity | Mock/browser |
| V13-1 | Dirty draft/diff/version conflict/time/currency, old receipt policy unchanged | Mock/browser |
| VREG | 360px,768px,desktop keyboard/actions and private state cache separation | Screenshots/browser; screen reader/device actual separately |

No fixture event marked real delivery/refund/approval. Silent SKIP does not count PASS. Physical Android/iOS and screen reader actual are separate NOT_RUN until exercised.

## Backend handoff per capability

Guest cancellation: ownership credential, policy/deadline mapping, idempotence/ambiguous failure; historical session bridge if supplied. Assistance: committed source+schema00015/provider-independent env, body bounds/target_time/guest-visible notes, eligibility/dedup and ff_guest_special_requests state. Catalog/quote: actual metadata/stock horizon/occupancy/breakfast/promo contract, flags enabled or known disabled.

Staff: trusted session/me/logout/property scope/permissions/audit contract; forged header role denied. Missing management APIs: request/response/enums/version/pagination/errors/retry invariant before BFF URLs implemented. Runtime flag success does not replace auth or current build verification.

## Release/rollback

Record capability activation explicitly after acceptance; leave staff mutation off until trusted auth and feature invariant pass. Feature off mid-flow must deny at server, stop poll/action, preserve safe draft and remove optimistic success. Read failure never silently switches API to fixture. Rollback capability cannot undo in-flight effects; reconcile authoritative record and do not auto repeat POST.

Rerun only affected checks after source delta; full final regression once accepted changes stable. Separate source evidence, contract harness, current Go/DB integration, provider sandbox and physical-device evidence in report.
