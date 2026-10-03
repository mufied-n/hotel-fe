# F12 — Staff login shell, permissions dan audit sample

Tasks CMP-12-*; staff shell and locked BFF exist. Plan adds UX/identity state abstraction, bukan credential/security provider baru.

## Screen/flow

/staff/login explains unavailable actual login and offers explicit sample workspace. Tidak meminta/menyimpan password/OTP nyata ketika auth endpoint belum tersedia. Sample principal roles receptionist/housekeeping/revenue_mgr/finance/gm_admin used only to demonstrate permissions; banner says sample role, never authenticated staff.

/staff/session-expired clears simulated principal/private views and links re-enter preview. /staff/forbidden supplies context/safe navigation without exposing resource data. /staff/audit shows actor/action/time/resource/diff sample with PII masking. Sample principal state request-scoped useState, default denied if unknown; role switch/logout resets cached views. Direct staff API remains503 regardless sample role.

## Navigation

Define permission map tied planned capabilities. Sample receptionist sees roster/handover/stay; HK sees board; finance sees finance; revenue sample rates/promos; GM sample management. These mappings are UI fixture, not claim actual policy-approved permission. Existing staff layout reused; hide disallowed nav, direct route shows forbidden. SSR cannot mix user state.

## File/TODO

- [ ] CMP-12-UI: login/expired/forbidden/audit pages, explicit preview entry and identity/status controls.
- [ ] CMP-12-API: useStaffSession abstraction/mock permissions/middleware; trusted adapter stub only, no invented login URL; BFF disabled remains.
- [ ] CMP-12-QA: unknown role deny, direct route, reset role/logout cache, SSR contexts, returnTo external rejected, header spoof unable to activate BFF.
- [ ] CMP-12-LIVE: WAITING_BE auth issuer/audience/session expiry/revoke/property permissions/audit actual contract and negative proof.

Target app/composables/useStaffSession.ts, app/middleware/staff.ts, staff layout and new pages; sample audit client/data. Do not add localStorage credential or role header. Feature flag enabled does not grant permission. Admin flags UI is separate scope.
