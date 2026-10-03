# Staff redesign implementation evidence — 2026-10-03

Status: automated verification complete for mock/read-safe frontend scope; live backend session and mutation activation not run. Frontend baseline before work `5d40ce0`; working tree implementation not yet committed.

## Implemented

- Sealed HttpOnly staff session BFF with login, me and logout. Browser never receives the bearer token in the JSON response.
- Exact method/path/query allowlist for staff read routes. Mock mode and unknown routes remain fail-closed; refund/OOO/stay/case/catalog/flag mutations remain locked.
- Snake-case backend DTO adapters for roster, housekeeping, handover, stay history/results, finance cases/summary and refund envelope.
- Role-aware grouped sidebar, mobile drawer, status bar, per-role landing, forbidden and expired recovery.
- Shared staff page header, status badge, loading/error/empty state, selected cards, pending button and reduced-motion-compatible transitions.
- Operational, finance, catalog/inventory/revenue and monitoring/admin route visual pass. Catalog includes full RoomVariant editor, dirty/discard guard, metadata fields and live read-only state. Feature flags support live read-only GM view.

## Automated evidence

- `npm run typecheck`: PASS. Nuxt prints the existing non-fatal Volar route-block plugin warning.
- `npm run lint`: PASS.
- `npm run test:unit`: PASS, 12 files / 33 tests. New coverage includes snake-case/envelope adapters, role separation and BFF route allowlist.
- `npm run build`: PASS, Nuxt production client/server output generated.
- `npm run test:e2e`: PASS, 9 Chromium scenarios. Staff flows cover sample permissions, read gate, housekeeping/handover, stay/refund review, plus guest regression.
- Browser inspection: login, role navigation, front desk accessibility tree and catalog editor checked in local Chromium. A grid placement bug caused sidebar/content overlap and was repaired with explicit grid areas; a reactive clone error in catalog was also reproduced and fixed.
- API-mode probe on local FE port 3001: direct `/staff/front-desk` → 302 login, read without session → 401, locked refund mutation → 503 `CAPABILITY_DISABLED`. The running backend on port 18080 returned 404 for `/api/v1/auth/staff/login`, although current backend source contains the route. Therefore successful staff login/read integration is `WAITING_ENV`; this is deployment/runtime drift, not a frontend success.

## Boundaries and next gates

No real staff password, migration, PostgreSQL fixture, provider refund, OTA, notification or deployed environment was used. API-mode login/read requires an environment with `NUXT_PUBLIC_OPERATIONS_MODE=api`, a valid 32+ character session password, deployed staff migrations/Casbin/flags and provisioned staff password. Live mutation remains intentionally disabled until ST-C03–08 acceptance evidence exists. Physical Android/iOS, screen reader and 200% zoom are not run.
