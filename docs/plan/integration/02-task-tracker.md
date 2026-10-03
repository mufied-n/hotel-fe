# Task tracker implementasi dan integrasi

Tanggal baseline: 3 Oktober 2026. Ini owner tunggal status eksekusi. Checkbox per fitur adalah checklist kerja; status formal dan evidence dirawat di tabel ini saat task dieksekusi. Rencana dibuat tidak berarti task implementasi selesai.

## Status dan aturan pembaruan

- **TODO:** siap diambil setelah dependency; belum dikerjakan. **IN_PROGRESS:** ada perubahan aktif, catat file/commit dan next acceptance.
- **UI_DONE:** UI dan mocked states lulus, connected adapter belum; jangan disebut integrated.
- **WAITING_BE:** subtask memerlukan route, trusted auth, semantic decision atau invariant proof; tulis blocker spesifik dan lanjut independent work.
- **INTEGRATED_TEST:** connected environment uji lulus dengan auth nyata; bukan production ready.
- **VERIFIED:** seluruh acceptance scope task lulus, evidence ditautkan dan relevant source version cocok. **REOPENED:** contract berubah atau regression ditemukan.

Jika task mencakup subset READY dan WAITING_BE (contoh guest refund read vs staff refund execution), isi kolom evidence dengan subtahap/checklist yang selesai dan dependency yang masih tertunda; status seluruh task baru VERIFIED setelah scope terpilih jelas. Capability yang sengaja ditunda dicatat DEFERRED dengan owner/scope, bukan centang selesai.

## Register task

Scope lanjutan F06/F04/F05/F08/F09/F12/F10/F11/F13 dirinci pada [tracker completion CMP](completion/02-task-tracker.md). Status CMP dicatat di sana; tabel induk ini tetap ringkasan Fxx. Penyusunan plan tidak meningkatkan status implementasi.

Task lanjutan guest refund, housekeeping, roster/handover, stay operations dan finance memiliki [tracker OPS terperinci](operations/02-task-tracker.md). Tabel induk ini menyimpan ringkasan fitur; status subtask OPS dirawat pada tracker tersebut. Plan OPS belum berarti code implementation selesai.

| ID | Milestone | Owner | Status awal | Dependency | Task/dokumen owner | Evidence/commit/blocker |
|---|---|---|---|---|---|---|
| BASE-01 | M0 | FE | VERIFIED | none | [Snapshot kontrak/API dan delta handoff](00-contract-and-architecture.md) | Router/model source 3 Oct reviewed; API/finance delta mapped |
| BASE-02 | M0 | FE | VERIFIED | BASE-01 | [DTO mapper, Money/date/status/error adapter dan fixtures aktual](00-contract-and-architecture.md) | Backend transport types, IDR0, room/quote/status mappers; unit/build PASS |
| BASE-03 | M0 | FE | INTEGRATED_TEST | BASE-01/02 | [BFF allowlist, runtime config, private sessions, origin/no-store guards](00-contract-and-architecture.md) | Sealed HttpOnly cookie; CSRF403, invalid input400, unauth401, token redaction PASS against isolated contract server |
| BASE-04 | M0 | FE+QA | IN_PROGRESS | BASE-03 + BE test env | [Backend env smoke dan capability mode yang explicit](04-verification-and-release.md) | Mock and API mode explicit; isolated contract server PASS; current Go deployment NOT_RUN |
| REL-01 | M6 | FE+BE | TODO | milestone feature proof | [Delta review gap closure dan contract compatibility per capability](03-execution-and-handoff.md) | — |
| REL-02 | M6 | QA+owner | TODO | REL-01 + F15-QA | [Scoped pilot acceptance, activation dan rollback rehearsal](04-verification-and-release.md) | — |
| F01-UI | M1 | FE | UI_DONE | BASE-02 | [Rework search/results, selection tunggal, guest fields dan review; default tanggal Asia/Jakarta dinamis, mobile dan keyboard.](features/f01-booking-journey.md) | Single variant/rate quantity flow, phone/arrival/two consents; demo E2E3/3 PASS |
| F01-API | M1 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Adapter search/quote/create, stable UUID attempt dan body bytes; error mapping, secure ownership receipt, capability gate sandbox.](features/f01-booking-journey.md) | BFF search/quote/create and secure booking access pass contract server; current Go/DB NOT_RUN |
| F01-QA | M1 | QA+FE | IN_PROGRESS | F01-UI/API + environment | [Contract tests payload/uang/capacity + connected flow search→create→status pada DB uji; pastikan perubahan consent/harga tidak diterima diam-diam.](features/f01-booking-journey.md) | Unit/demo/BFF contract smoke PASS; real Go DB and ambiguity tests pending |
| F02-UI | M2 | FE | UI_DONE | BASE-02 | [Form email/code dengan paste, inputmode numeric, labels, loading/error/cooldown dan returnTo aman.](features/f02-guest-access.md) | Email/code/cooldown/returnTo/error UI built |
| F02-API | M2 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Challenge/verify/session/me/logout BFF, private cookie lifecycle, origin protection dan 401 reset state.](features/f02-guest-access.md) | Token absorbed into sealed cookie; verify/me/logout contract smoke PASS; Go OTP sandbox pending |
| F02-QA | M2 | QA+FE | IN_PROGRESS | F02-UI/API + environment | [Uji sesi terisolasi, token tidak ada di browser payload/state, non-owner dan logout/reload; connected sandbox OTP dengan transport uji terkontrol.](features/f02-guest-access.md) | Token redaction/logout401 PASS; two-user/atomic OTP provider evidence pending |
| F03-UI | M2 | FE | UI_DONE | BASE-02 | [Halaman daftar/detail, status chips, filters dan empty/error/login recovery.](features/f03-my-bookings.md) | List/filter/empty/detail/actions/login recovery built |
| F03-API | M2 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Session-owned fetch dan DTO mapper; request cancellation/dedup, no-store dan kemampuan aksi terverifikasi.](features/f03-my-bookings.md) | Private me/list contract smoke PASS; detail ownership on current Go pending |
| F03-QA | M2 | QA+FE | IN_PROGRESS | F03-UI/API + environment | [Dua akun/two-context isolation dan ownership; tampilkan response total yang benar dan filter tanpa kebocoran PII.](features/f03-my-bookings.md) | Error/limit semantics implemented; two-account connected test pending |
| F04-UI | M3 | FE | UI_DONE | BASE-02 | [Receipt mobile/print, tombol cetak/download, fallback bila artifact belum tersedia.](features/f04-confirmation-artifacts.md) | Private receipt view/print and ICS action built |
| F04-API | M3 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Receipt DTO dan binary ICS passthrough allowlisted; token protected dan header no-store.](features/f04-confirmation-artifacts.md) | Receipt/ICS BFF routes built; current Go ownership/binary acceptance pending |
| F04-QA | M3 | QA+FE | TODO | F04-UI/API + environment | [Connected receipt/ICS ownership + visual print inspection; nyatakan browser save PDF terpisah dari server-generated PDF.](features/f04-confirmation-artifacts.md) | — |
| F05-UI | M1/M3 | FE | UI_DONE | BASE-02 | [Rework pending/confirmed/failed/expired/cancelled/stay statuses, action link/poll/manual refresh dan assistance state.](features/f05-payment-status-recovery.md) | Domain statuses, payment action, real elapsed timer and bounded visible-tab polling built |
| F05-API | M1/M3 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Private status fetch, persisted post-create access, validated payment redirect, bounded polling/clock; fake adapter gate development.](features/f05-payment-status-recovery.md) | Access token sealed; payment origin allowlisted; create/status contract smoke PASS; Go provider recovery pending |
| F05-QA | M1/M3 | QA+FE | TODO | F05-UI/API + environment | [Connected test create→provider sandbox callback→status; mock network/clock tests terpisah. Same-device resume dibuktikan, cross-device limitation dicatat.](features/f05-payment-status-recovery.md) | — |
| F06-UI | M3 | FE | IN_PROGRESS | BASE-02 | [Dialog cancellation accessible, policy/errors, bantuan/contact dan UI perubahan dengan capability state.](features/f06-guest-requests.md) | Post-create confirmation/action/error UI built; full historical/request UI pending |
| F06-API | M3 | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Wire cancellation untuk credential yang sah; historical-session cancel dan request creation menunggu BE contract.](features/f06-guest-requests.md) | Booking-token BFF cancel built; guest-session historical cancel and requests WAITING_BE |
| F06-QA | M3 | QA+FE | TODO | F06-UI/API + environment | [Sandbox cancel membuktikan status berubah dan tidak mengklaim refund; unauthorized tidak memutasi booking.](features/f06-guest-requests.md) | — |
| F07-UI | M4 | FE | IN_PROGRESS | BASE-02 | [Workspace frontdesk mobile/table, detail forms/action confirmation dan conflict UI dengan mock.](features/f07-frontdesk.md) | Roster/handover/stay sample workspace built; full F07 scope remains |
| F07-API | M4 | FE+BE | WAITING_BE | BASE-03 + dependency fitur | [Staff adapter hanya setelah trusted identity + worklist contract; endpoint operasi existing diuji sandbox terisolasi.](features/f07-frontdesk.md) | — |
| F07-QA | M4 | QA+FE | TODO | F07-UI/API + environment | [Contract action/state tests, lalu connected trusted staff session tests dan DB assignment evidence dari BE.](features/f07-frontdesk.md) | — |
| F08-UI | M4 | FE | IN_PROGRESS | BASE-02 | [Catalog admin form/list/gallery dan inventory read UI dengan states.](features/f08-catalog-inventory.md) | Housekeeping board subset UI_DONE; catalog admin remains |
| F08-API | M4 | FE+BE | TODO | BASE-03 + dependency fitur | [Integrasi public catalog segera; staff CRUD setelah gate identity, inventory mutations menunggu kontrak.](features/f08-catalog-inventory.md) | — |
| F08-QA | M4 | QA+FE | TODO | F08-UI/API + environment | [Mapper tests + public search/catalog smoke; staff CRUD isolated with cleanup setelah identity; validate photo accessibility.](features/f08-catalog-inventory.md) | — |
| F09-UI | M4 | FE | TODO | BASE-02 | [Guest package/promo errors + staff rate/promo forms berbasis spec.](features/f09-rate-promo.md) | — |
| F09-API | M4 | FE+BE | TODO | BASE-03 + dependency fitur | [Wire quote package/promo existing; management adapter diaktifkan setelah contract tersedia.](features/f09-rate-promo.md) | — |
| F09-QA | M4 | QA+FE | TODO | F09-UI/API + environment | [Quote comparison tests dan contract management validation; tidak mengklaim CRUD sampai connected evidence.](features/f09-rate-promo.md) | — |
| F10-UI | M5 | FE | TODO | BASE-02 | [Desain monitoring/error/conflict/channel mapping UI dan mock states.](features/f10-channel-sync.md) | — |
| F10-API | M5 | FE+BE | WAITING_BE | BASE-03 + dependency fitur | [WAITING_BE: endpoint belum tersedia; setelah handoff implement adapter tanpa menebak URL.](features/f10-channel-sync.md) | — |
| F10-QA | M5 | QA+FE | TODO | F10-UI/API + environment | [Contract-first sync view tests; connected hanya setelah BE memberikan fixture, mapping dan replay evidence.](features/f10-channel-sync.md) | — |
| F11-UI | M5 | FE | TODO | BASE-02 | [Guest copy dan staff delivery table/filter/detail/mock retry states.](features/f11-notification.md) | — |
| F11-API | M5 | FE+BE | WAITING_BE | BASE-03 + dependency fitur | [WAITING_BE untuk delivery/retry; OTP challenge integration milik F02 tetap berjalan.](features/f11-notification.md) | — |
| F11-QA | M5 | QA+FE | TODO | F11-UI/API + environment | [Uji terminology/status mapping; connected provider sandbox vs actual inbox delivery evidence dipisahkan.](features/f11-notification.md) | — |
| F12-UI | M4 prerequisite | FE | TODO | BASE-02 | [Staff login shell/session expiry/forbidden UI, permission-aware navigation dan audit views dengan mocks.](features/f12-staff-identity.md) | — |
| F12-API | M4 prerequisite | FE+BE | WAITING_BE | BASE-03 + dependency fitur | [WAITING_BE untuk staff auth; setelah fixed, trusted session BFF dan adapters F07/F08/F14 diaktifkan sesuai role.](features/f12-staff-identity.md) | — |
| F12-QA | M4 prerequisite | QA+FE | TODO | F12-UI/API + environment | [Negative authorization tests pada direct BFF/backend dan SSR isolation; mock UI tidak menutup BE-R01.](features/f12-staff-identity.md) | — |
| F13-UI | M5 | FE | TODO | BASE-02 | [Policy/metadata display dan staff configuration forms dengan conflict/error states.](features/f13-hotel-configuration.md) | — |
| F13-API | M5 | FE+BE | WAITING_BE | BASE-03 + dependency fitur | [Wire existing quote/receipt fields; WAITING_BE untuk management config.](features/f13-hotel-configuration.md) | — |
| F13-QA | M5 | QA+FE | TODO | F13-UI/API + environment | [Snapshot regression tests dan owner review atas copy/hotel policy; history unchanged setelah config change.](features/f13-hotel-configuration.md) | — |
| F14-UI | M3 guest / M4 staff | FE | IN_PROGRESS | BASE-02 | [Guest refund panel sekarang; staff reconciliation/case/refund UI dan confirmation dialogs dengan mock.](features/f14-finance-refunds.md) | Guest refund hardened; staff reconciliation/cases/refund sample workspace built; connected waits auth |
| F14-API | M3 guest / M4 staff | FE+BE | IN_PROGRESS | BASE-03 + dependency fitur | [Wire guest refund read existing; staff integration WAITING_BE trusted identity dan refund acceptance, lalu sandbox mutation terkontrol.](features/f14-finance-refunds.md) | Guest refund read BFF built; staff mutation waits trusted identity/provider acceptance |
| F14-QA | M3 guest / M4 staff | QA+FE | TODO | F14-UI/API + environment | [Connected guest ownership test; staff provider sandbox membuktikan jumlah/status tanpa real-money request dan tanpa duplicate retry.](features/f14-finance-refunds.md) | — |
| F15-UI | M6 | FE | TODO | BASE-02 | [Manual responsive/accessibility checks dan evidence checklist; fix blocking UI defects.](features/f15-verification-pilot.md) | — |
| F15-API | M6 | FE+BE | TODO | BASE-03 + dependency fitur | [Connected smoke matrix/environment script, provider sandbox and SSR/BFF security evidence.](features/f15-verification-pilot.md) | — |
| F15-QA | M6 | QA+FE | TODO | F15-UI/API + environment | [Physical-device/pilot runs, signed acceptance per capability dan final tracker status tanpa silent SKIP.](features/f15-verification-pilot.md) | — |

## Checkpoint milestone

| Milestone | Exit evidence | Status |
|---|---|---|
| M0 foundation | API deployment identity, DTO fixtures, BFF/session/error tests, safe environment smoke | TODO |
| M1 core booking | Single-type room_only connected search→quote→guest→create→status + retry/expiry | TODO |
| M2 login/My Bookings | OTP/session lifecycle, ownership/private refresh/list/detail | TODO |
| M3 guest completion | Receipt/ICS, applicable cancel, refund read; bounded payment recovery | TODO |
| M4 staff | UI + trusted identity + scoped operations/catalog/finance subset; disabled if identity waits | TODO / gate BE-R01 |
| M5 management | API-by-API activation F09–F13 as routes become available | WAITING_BE untuk kontrak yang belum ada |
| M6 scoped verification/pilot | Environment/provider/device evidence and rollback; no required silent SKIP | TODO |

## Checklist update saat tiap checkpoint

- [ ] Rekam exact task/subscope, tanggal, implementer, file dan commit bila ada.
- [ ] Catat source/deploy contract version dan gap yang terkait.
- [ ] Link unit/contract results terpisah dari connected/provider/device results.
- [ ] Catat remaining blocker dan next independent task; jangan meminta user mengulangi izin pekerjaan yang sudah disepakati.
- [ ] Bila BE delta datang, reopen hanya task yang terkena; upgrade WAITING_BE bila contract sudah verified.
- [ ] Hindari persentase “selesai” dari jumlah checkbox; laporkan capability yang nyata bisa diuji pengguna.

Template evidence: `scope=...; BE snapshot/deploy=...; FE commit=...; mock=PASS/FAIL/NOT_RUN; connected=...; provider=...; device=...; blockers=...; next=...`.
