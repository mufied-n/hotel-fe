# Staff interaction accessibility evidence — 2026-10-04

Status: automated browser and build verification complete for the local sample/read-safe frontend scope. Physical devices and screen readers remain not run.

## Implemented behavior

- Mobile staff navigation is inert and hidden from assistive navigation while closed. Opening it locks body scroll, moves focus to the first visible navigation item, contains Tab and Shift+Tab, closes with Escape, and restores focus to the menu button.
- Housekeeping room editing and finance case resolution use a shared native detail drawer. The drawer focuses its heading, supports Escape, and keeps before-to-after operational context visible.
- Refund review uses a shared native confirmation dialog. The review preserves booking, amount, currency and reason at the confirmation boundary; Escape returns to the initiating control.
- Drawer and dialog motion use existing staff timing and reduced-motion rules. Busy state prevents accidental dismissal during a pending action.

## Automated evidence

- `npm run typecheck`: PASS. Existing non-fatal Volar route-block plugin warning remains.
- `npm run lint`: PASS.
- `npm run test:unit`: PASS, 12 files / 33 tests.
- `npm run build`: PASS; Nuxt client, server and Nitro output generated.
- `npm run test:e2e`: PASS, 11 Chromium scenarios in 45.1 seconds.
- New browser coverage verifies mobile menu focus containment and restoration, housekeeping drawer Escape recovery, and refund confirmation Escape recovery. The tests wait for Nuxt hydration before interaction so native pre-hydration form behavior is not mistaken for application behavior.
- `git diff --check`: PASS.

## Evidence boundary

Chromium viewport automation verifies DOM focus behavior and the local sample flows; it does not prove virtual-keyboard behavior, touch ergonomics, screen-reader announcements, 200% zoom, or Android/iOS browser behavior. Finance and housekeeping actions remain sample/locked unless their backend capability gates are enabled and verified. No real refund, room-state mutation, database write, or provider call was executed.
