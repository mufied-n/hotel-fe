# Tracker OPS dan dependency

Status formal: TODO, IN_PROGRESS, UI_DONE, CONTRACT_VERIFIED, WAITING_BE, CONNECTED_VERIFIED. UI_DONE/CONTRACT_VERIFIED tidak berarti staff live aktif. Owner default FE; BE bertanggung jawab kontrak/gate, QA merekam evidence. Semua task baru belum dieksekusi. Existing guest refund baseline tidak dianggap seluruh task RF selesai.

| ID | Task dan exit criteria | Dependency | Status | Owner | Evidence/blocker |
|---|---|---|---|---|---|
| OPS-01 | Refresh SHA/source/deploy, DTO success/error fixtures | none | IN_PROGRESS | FE+BE | Source 09bc727 mapped; deployment current masih menunggu BE |
| OPS-02 | Client interface, DTO mapper, mock adapter dan safe Money/date | OPS-01 | CONTRACT_VERIFIED | FE | Types/client/fixtures + 19 unit tests PASS |
| OPS-03 | Server capabilities dan BFF disabled-before-network | OPS-01 | CONTRACT_VERIFIED | FE | Catch-all staff BFF returns CAPABILITY_DISABLED503; GET/POST E2E PASS |
| OPS-04 | Staff layout/navigation/dialog primitives, explicit sample mode | OPS-02/03 | UI_DONE | FE | Staff shell/sample banner, responsive cards/tables/forms built |
| RF-01 | Refund panel independent loading/empty/error/unknown state | OPS-01 | UI_DONE | FE | Extracted panel, independent retry/error/unknown states |
| RF-02 | Guest DTO redaction/mapping, session reset/stale guards | RF-01 | CONTRACT_VERIFIED | FE | Allowlist mapper removes actor/provider; generation guard/no-store |
| RF-03 | Refund fixtures/ownership/two-session tests | RF-02 | IN_PROGRESS | FE+QA | Mapper/money tests PASS; connected two-session belongs RF-04 |
| RF-04 | Connected owner/non-owner/refund receipt smoke | RF-03 | WAITING_BE | FE+BE+QA | Current guest deploy diperlukan |
| HK-01 | Board/filter/summary/card/detail dan fixture statuses | OPS-02/04 | UI_DONE | FE | 7 statuses, filtered summary, cards and filters built |
| HK-02 | Status dan OOO mock dialogs/validation/conflict states | HK-01/OPS-03 | UI_DONE | FE | Sample status/OOO forms; API mode locked |
| HK-03 | HK adapter/BFF allowlist contract/gate tests | HK-02 | IN_PROGRESS | FE+QA | Client adapter + disabled BFF proof; live allowlist waits auth |
| HK-04 | Connected HK read/status/OOO isolated smoke | HK-03/AUTH-01 | WAITING_BE | BE+FE+QA | OOO atomic/retry/restore decision |
| FD-01 | Roster date/metrics/arrival/departure UI | OPS-02/04 | UI_DONE | FE | Explicit Jakarta date, metrics/arrivals/departures built |
| FD-02 | Handover pagination/form/review/mock append | FD-01 | UI_DONE | FE | Sample pagination/form/append E2E PASS |
| FD-03 | FD BFF/adapter/error/permission contract tests | FD-02/OPS-03 | IN_PROGRESS | FE+QA | Client adapter + server lock built; trusted permission waits auth |
| FD-04 | Connected roster/handover permission smoke | FD-03/AUTH-01 | WAITING_BE | BE+FE+QA | Auth + duplicate handling |
| ST-01 | Stay detail entry/context, move form/history mock | HK-01/FD-01/OPS-04 | UI_DONE | FE | Candidate room, reason, history and sample move built |
| ST-02 | Extension nights/date/review/result/error UI mock | ST-01 | UI_DONE | FE | 1–30 calendar math; payment/price limits stated; E2E PASS |
| ST-03 | Stay adapter/BFF/no-auto-retry contract tests | ST-02/OPS-03 | IN_PROGRESS | FE+QA | Adapter/server lock built; connected409/timeout waits BE |
| ST-04 | Connected move/extension/history proof | ST-03/AUTH-01 | WAITING_BE | BE+FE+QA | Price/payment/retry/multi-room handoff |
| FIN-01 | Reconciliation/cases/details mock UI | OPS-02/04 | UI_DONE | FE | Summary/cases/filter/detail and response-count caveat built |
| FIN-02 | Refund/resolve forms/review/outcome unknown UI | FIN-01 | UI_DONE | FE | Sample review/results with financial limitations; E2E PASS |
| FIN-03 | Finance adapter/BFF validation/gate contract tests | FIN-02/OPS-03 | IN_PROGRESS | FE+QA | Adapter/server lock built; provider contract waits BE |
| FIN-04 | Connected finance/provider sandbox proof | FIN-03/AUTH-01 | WAITING_BE | BE+FE+QA | Durable intent/concurrency/recovery |
| AUTH-01 | Trusted staff session/permission BFF integration | BE auth contract | WAITING_BE | BE+FE | BE-R01 closure; no role-string |
| OPS-QA | Cross-feature mock E2E/accessibility/security regression | RF-03/HK-03/FD-03/ST-03/FIN-03 | IN_PROGRESS | FE+QA | type/lint/unit/build PASS; Chromium E2E 6/6 PASS; device/screen reader pending |
| OPS-ACT | Per-capability activation/rollback evidence | connected feature tasks | WAITING_BE | BE+FE+owner | Pasang hanya capability yang lulus |

## TODO eksekusi dan checkpoint

- [ ] C0 OPS-01–04: foundation; commit setelah gate tests dan mock shell lulus.
- [ ] C1 RF-01–03: guest refund completion; API route existing diperbaiki tanpa route duplikat.
- [ ] C2 HK-01–03: board/status/OOO mock dan disabled BFF.
- [ ] C3 FD-01–03: roster/handover mock dan disabled BFF.
- [ ] C4 ST-01–03: move/extension mock dan disabled BFF.
- [ ] C5 FIN-01–03: finance mock dan disabled BFF.
- [ ] C6 OPS-QA: regresi seluruh workflow; update aggregate tracker F07/F08/F14.
- [ ] C7 AUTH-01/connected tasks/OPS-ACT: hanya setelah gate tersedia; boleh aktifkan read terpisah dari mutation.

Catat setiap checkpoint: exact scope, FE SHA, BE source/deploy/migration/provider mode, command/result, screenshot bila UI, blocker, dan next task. Evidence disimpan `docs/qa/integration/operations/<date>-<checkpoint>.md`. Jangan mengubah WAITING_BE menjadi done hanya karena mock lulus. Bila BE berubah, reopen mapper/gate terkena; independent UI tetap berjalan.
