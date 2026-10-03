# F13 — Hotel metadata/policy configuration sample

Tasks CMP-13-*; hotel-info receipt/static FE metadata existing. Hotel configuration management API absent; admin feature flags newly available are a separate control surface and do not fill this gap.

## Sample form and lifecycle

/staff/configuration: hotel name/contact/address, locale/currency/timezone, check-in/out, cancellation/no-show text. Draft→validate→review diff→sample publish; unsaved changes prompt, version conflict/reload, unavailable/error/unknown outcome sample. Display effective time and immutable published version only as proposed view model.

Use Asia/Jakarta and IDR current defaults; avoid silently reinterpreting DateOnly or money exponent if sample currency changes. Sample config never changes actual guest checkout/policy snapshot/receipt. Invalid contact/time/URL and required policy text indicate field error. Official contacts not fabricated; fixture clearly sample.

## File/TODO

- [ ] CMP-13-UI: metadata/policy forms, accessible tabs/sections, review diff/sample publish/conflict/discard.
- [ ] CMP-13-API: sample config client/view models/version fixtures; no hotel write endpoint guessed; metadata display stays existing source snapshot.
- [ ] CMP-13-QA: time/URL/phone/currency validation, version conflict, dirty state, old booking policy unchanged, unknown publish not auto-repeat, SSR role separation.
- [ ] CMP-13-LIVE: WAITING_BE read/write/version/effective/publish/history contracts, trusted authority and config snapshot acceptance.

Target staff/configuration.vue, ConfigurationForm/PolicyDiff, management config client/types/fixtures. Staff GM permission sample only; actual governance/approval roles supplied by BE/hotel before activation. No claim hotel approval from form save.
