# ST-06 — Monitoring dan administration

Dependency ST-01–02; RD-S09. Owner FE administration, BE adapters/config/audit. Status PLANNED. Target `app/pages/staff/channels/index.vue`, `notifications/index.vue`, `configuration.vue`, `audit.vue`, management types/client/adapters.

## Channels

- [ ] Table/cards status, last confirmed sync, pending count hanya jika response tersedia, stale/unknown berbeda dari healthy.
- [ ] Filter channel/status/local sample search; detail drawer operation/resource, version, attempts, sanitized error, last event.
- [ ] Retry review menjelaskan operasi dan resource yang akan dikirim; tidak retry booking/payload secara generik, tidak optimistic healthy toast.
- [ ] Contract gate: source belum memiliki channel jobs list/detail/retry API. BE harus menetapkan job ID/version, latest event authority, retry eligibility/idempotency, permission dan conflict codes. Semua aksi sekarang sample/locked.

## Notifications

- [ ] Filter delivery channel/status/template/time hanya sesuai backend kelak; list→detail recipient yang disanitasi, template/reference, attempts/status timeline.
- [ ] Bedakan accepted/queued/sent/delivered/failed/unknown; sample current enum bukan bukti provider status mapping. Jangan menyatakan email terkirim karena request accepted.
- [ ] Retry dialog menampilkan recipient/template dan konsekuensi duplikasi; OTP expired tidak dirancang “kirim ulang” sebagai intent lama.
- [ ] Contract gate: delivery log/retry handler belum tersedia; butuh durable intent/idempotency, provider event status, retry expiry, recipient privacy/retention dan role matrix. Detail tidak menampilkan secret/OTP/raw credentials.

## Configuration

Existing API hanya GET/PUT `/admin/feature-flags`, GM. UI pisahkan **Feature flags** dari hotel policy/settings sample. GET `{total,flags}`, PUT body `{enabled,allowed_roles}` dan result `{status,flag}`; adapter mengikuti actual featureflag model.

- [ ] Editor flag key read-only, enabled/roles, before→after confirmation, affected feature context, pending, dirty guard dan refresh timestamp.
- [ ] “allowed_roles” tidak memperluas Casbin privileges; disabled feature recovery jelas. Tidak menjanjikan current session user diberi akses hanya dari flag.
- [ ] Flag version/CAS belum ada (ST-C07); reload preserves draft; version field tidak dibuat sendiri. Live write membutuhkan conflict policy/acceptance BE; read dapat diprioritaskan setelah env gate.
- [ ] Hotel check-in/out/cancellation/contact config tetap sample/locked sampai DTO/read/write/validation/version/policy effective dates tersedia. Defaults bukan official policy edits tersimpan.

## Audit

- [ ] List actor/role/action/resource/time/result, filter, selected drawer dan before/after bila disediakan; redact PII dan free text sensitif.
- [ ] Source room_move_logs/handover actors bukan global audit feed. Jangan menyatukan local sample success menjadi “audit server” atau menyatakan login audit ada.
- [ ] Contract gate audit list/detail/pagination/timezone/filters, scope events, stable event ID, role visibility, append-only authority dan redaction. Existing fixture AuditSnapshot enum boleh direvisi setelah contract, bukan dipakai sebagai server evidence.

## Acceptance

Filter state dan drawer selection survive refresh; page refresh error terpisah dari per-row retry error. Unknown/stale version tidak berubah menjadi success. API mode tidak diam-diam mengambil fixture. Secrets/OTP/provider credentials tidak render. Retry version conflicts refresh authoritative detail sebelum confirmation ulang. Sample, locked, no matches, empty system dan unavailable punya copy berbeda.
