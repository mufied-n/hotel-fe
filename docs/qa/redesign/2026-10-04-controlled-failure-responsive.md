# Controlled failure dan responsive QA — 2026-10-04

Status: automated mock failure and emulated responsive scope complete. Baseline commit `1bb62d5`; evidence created from the following working tree before its checkpoint commit.

## Environment

- Browser: Google Chrome `145.0.7632.75`, driven by Playwright `1.63.0` on local Linux.
- Modes: booking mock and operations mock. Controlled failure parameters are parsed only for operations mock in dev/test.
- Motion: reduced motion enabled for screenshot stability.
- Physical Android/iOS, virtual keyboard, screen reader and manual browser zoom: `NOT RUN`.

## Controlled failure evidence

- `qa_fail`, `qa_fail_after` and `qa_delay` are allowlisted, bounded and ignored when controls are disabled. Arbitrary query fields are not preserved.
- Housekeeping first load succeeded; second room-board read failed deterministically. Six existing room cards remained visible, stale copy appeared, and QA parameters survived the filter URL update.
- Shared latest-request owner rejects earlier generations after a newer request begins or a component unmount invalidates ownership.
- No mutation retry was introduced. The harness does not run in API mode or production build.

## Responsive matrix

| Scenario | Routes | Result | Evidence |
|---|---|---|---|
| 360×800 mobile-small | Guest results, housekeeping | PASS, no page overflow | [guest](evidence/2026-10-04-responsive/mobile-small-guest-1.jpg), [staff](evidence/2026-10-04-responsive/mobile-small-staff-housekeeping.jpg) |
| 390×844 mobile | Room detail, rates | PASS, no page overflow | [guest](evidence/2026-10-04-responsive/mobile-guest-1.jpg), [staff](evidence/2026-10-04-responsive/mobile-staff-rates.jpg) |
| 768×1024 tablet portrait | Guest results, rates | PASS, no page overflow | [guest](evidence/2026-10-04-responsive/tablet-portrait-guest-1.jpg), [staff](evidence/2026-10-04-responsive/tablet-portrait-staff-rates.jpg) |
| 1024×768 tablet landscape | Housekeeping, finance cases | PASS after fix | [housekeeping](evidence/2026-10-04-responsive/tablet-landscape-staff-housekeeping.jpg), [finance](evidence/2026-10-04-responsive/tablet-landscape-staff-finance-cases.jpg) |
| 1440×900 desktop | Guest results, channels | PASS, no page overflow | [guest](evidence/2026-10-04-responsive/desktop-guest-1.jpg), [staff](evidence/2026-10-04-responsive/desktop-staff-channels.jpg) |
| 640×800 zoom pressure | Housekeeping, rates | PASS, no page overflow | [housekeeping](evidence/2026-10-04-responsive/zoom-pressure-staff-housekeeping.jpg), [rates](evidence/2026-10-04-responsive/zoom-pressure-staff-rates.jpg) |

Screenshots wait for route-specific final-content markers. The first capture attempt exposed loading frames and was discarded/replaced. Twelve final files were inspected as a contact sheet; mobile-small housekeeping, tablet-landscape housekeeping and desktop guest results were additionally inspected at original resolution.

## Finding and remediation

At 1024×768, the staff sidebar reduced usable content width while global `.ops-split` still forced a two-column layout. Housekeeping overflowed the document by 13 CSS px. The staff layout now keeps `.ops-split` in one column from 960 through 1199px and restores the wider split at desktop width. The focused matrix passed after the fix.

## Final checks

- `npm run typecheck`: PASS; existing non-fatal Volar route-block warning remains.
- `npm run lint`: PASS.
- `npm run test:unit`: PASS, 16 files / 42 tests.
- `npm run test:e2e`: PASS, 19 Chromium scenarios in 47.5 seconds.
- `npm run build`: PASS; Nuxt client/server and Nitro output generated.
- `git diff --check`: PASS.

## Remaining boundaries

The 640px case creates equivalent layout pressure but is not evidence of a real browser set to 200% zoom. Screenshots come from desktop Chrome viewport emulation and do not prove touch behavior, Safari/iOS rendering, Android Chrome, virtual keyboard or screen-reader announcements. Official photography/font/logo handoff and live API/provider workflows remain separate gates.
