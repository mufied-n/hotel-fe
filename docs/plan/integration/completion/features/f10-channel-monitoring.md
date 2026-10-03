# F10 — Channel sync monitoring sample

Tasks CMP-10-*; no upstream sync/mapping/replay/stop-sell routes found. Scope sample workspace /staff/channels and details, no OTA connection or external inventory mutation.

## Workflow/data

Channel list: sample provider identity, enabled status, last sync time, backlog/lag/error/conflict counts. Detail: mapping room/rate external/internal, timeline, conflict inventory view, last successful cursor/version, stale status. Cursor/version are proposed UI fields until BE handoff.

Review simulated retry/reconcile/stop-sell displays affected rooms/date horizon, reason, sample-only result. Timeout→outcome_unknown fixture. Disabled/stale/conflict/outage states explicit. Never infer stock guaranteed from successful sync label; mock conflict resolution doesn't change booking inventory.

## File/TODO

- [ ] CMP-10-UI: channels/list/details/filter, mappings/conflict/retry review and explicit sample action states.
- [ ] CMP-10-API: management client interface + deterministic fixtures; API mode returns unavailable; upstream URL absent.
- [ ] CMP-10-QA: empty/stale/unknown channel, conflicting mappings, invalid dates, duplicate/retry UI guard, forbidden navigation, no upstream calls.
- [ ] CMP-10-LIVE: WAITING_BE source-of-truth inventory, mapping/import/export/pagination/replay/idempotency/stop-sell endpoints, trusted auth and sandbox.

Target pages staff/channels/index.vue and [id].vue, management channel-client/types/fixtures/components. Dependency CMP-12 mock principal + shared date/money/error, existing inventory display. UI_done requires keyboard/mobile and visible label; live remains unavailable.
