# F11 — Notification delivery/retry sample

Tasks CMP-11-*; OTP/confirmed Resend adapters are BE existing, not notification management API. Scope /staff/notifications table/filter/detail and sample resend review.

## Status semantics

Distinguish queued, sending, provider_accepted, delivered, failed, retry_scheduled and unknown as proposed view-model states. Actual event enums/receipts require BE contract. Accepted API request or mock send success does not prove inbox delivered. Email address masked by default; details synthetic/no token/OTP/provider secrets.

Detail shows sample event/reference/time/attempts/error class/template preview. Retry review mentions recipient and duplicate risk; sample result only. Uncertain provider outcome disables automatic repeated resend. No new notification, email or SMS sent by this FE task.

## File/TODO

- [ ] CMP-11-UI: notification list/filter/detail, masked recipient, template preview, retry review/error/unknown.
- [ ] CMP-11-API: mock delivery client/DTOs only; APIs ledger/status/retry missing; API mode unavailable, no fallback sample.
- [ ] CMP-11-QA: queued vs accepted vs delivered copy, no OTP/token in DOM/log/fixture, duplicate retry UI guard, timeout ambiguity,401/403 fixture.
- [ ] CMP-11-LIVE: WAITING_BE delivery-ledger pagination/filter/lookup/redrive contracts, permission, provider sandbox and actual inbox proof separated.

Target pages staff/notifications/index.vue and [id].vue; notification-client/view-model/fixtures components. Existing guest challenge integration remains F02, is not rewritten. Staff retries gated by trusted auth and durable intent; feature-flag config is not notification ledger.
