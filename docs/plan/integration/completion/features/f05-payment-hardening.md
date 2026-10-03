# F05 — Timer, polling, network dan ambiguity hardening

Tasks CMP-05-*; scope existing status page, hold timer/composable, BFF read and safe payment URL.

## Concrete behavior

Current timer baseline dimulai saat mount dan belum watch snapshot changes. Status load failure membersihkan booking; interval watch status tidak memberi explicit visibility refresh. Plan menutup reset snapshot, overlapping/racing requests, stale display, cancellation status interference, dan unknown result paths.

Latest serverTime/expiresAt becomes baseline; validate timestamps; reset elapsed on snapshot change; Date.now elapsed/visibility event; notify once per deadline snapshot. Clock tick nol memicu server refresh, status authoritative tetap unknown/pending sampai GET membuktikan expired.

Poll only eligible API statuses, visible tab, one request at time. Stop on terminal/unmount/logout/flag-off. Backoff bounded on network/429; immediate read when visible, manual refresh reachable. Navigation changes booking ID invalidate old response. Preserve previous status as stale when fetch fails; hide payment action when eligibility/deadline/outcome uncertain.

## Payment action dan recovery

Only validated server URL origins; reject javascript/data/untrusted origin, enforce HTTPS deployment. Redirect bukan proof paid. Pending without URL memberi bantuan; timeout create/payment/refresh jangan mendorong bayar ulang. Same-device receipt token recovery tested; cross-device resume API belum ada, tetap explanation/help. Demo failed/expired labels jangan bocor ke API copy.

## File/TODO

- [ ] CMP-05-UI: pending/processing/unknown/stale/disabled/error states, payment link/action eligibility, copy distinct mock/API.
- [ ] CMP-05-API: timer reset/watch and cleanup; visibility refresh, poll cancellation/backoff, stale generation, payment origin safety.
- [ ] CMP-05-QA: controlled clock at deadline, server snapshot update, hidden→visible, unmount, rapid navigation, delayed response,429/503 FEATURE_DISABLED, bad URL, ambiguous paid redirect.
- [ ] CMP-05-LIVE: current backend isolated create→sandbox provider callback→status; same-device reload and wrong-token proof, cross-device limitation recorded.

Test composable via Vue lifecycle harness/fake timers, bukan sleep-based flaky test. Trace number of GET calls and zero automatic repeat financial POSTs. Unknown outcome clears only after authoritative read/assistance outcome.
