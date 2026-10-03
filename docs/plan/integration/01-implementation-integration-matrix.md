# Matriks implementasi dan integrasi

Tanggal: 3 Oktober 2026. Semua path BFF adalah target implementasi FE, bukan endpoint BE. SOURCE_PRESENT = terdaftar pada router source; connected NOT_RUN = tidak diuji ulang pada deployed runtime oleh paket rencana. Tidak ada status “integrated” tersirat dari route availability.

## Matriks per fitur

| ID owner | Scope | Jalur pengerjaan paralel | Dependency/gate backend | FE integration awal |
|---|---|---|---|---|
| [F01](features/f01-booking-journey.md) | Pencarian, quote dan checkout | Subset API now; remaining gates explicit | BE-R06–R12, R18; kapasitas/num_guests dan breakfast multi-room harus dikunci kontraknya. Pilihan room_only satu kamar dapat menjadi vertical slice awal, multi-room/breakfast diuji terpisah sebelum aktivasi. | TODO |
| [F02](features/f02-guest-access.md) | Login penghuni dan sesi tamu | Subset API now; remaining gates explicit | BE-R03/R04/R17; canonical email BE-R05. Tidak mengirim OTP ke email pengguna nyata untuk tes. Sandbox login dapat dikerjakan saat BE memperbaiki atomicity; live menunggu acceptance. | TODO |
| [F03](features/f03-my-bookings.md) | Booking Saya dan detail privat | Subset API now; remaining gates explicit | BE-R05/R15; cursor belum tersedia. Read list/detail dapat diintegrasikan sekarang dengan empty/error/401/404; pagination penuh menunggu kontrak. | TODO |
| [F04](features/f04-confirmation-artifacts.md) | Konfirmasi, receipt dan kalender | Subset API now; remaining gates explicit | BE-R05; metadata check-in14WIB receipt vs research15WIB adalah keputusan owner C06, jangan diganti FE diam-diam. PDF backend belum ada; browser print adalah output terpisah. | TODO |
| [F05](features/f05-payment-status-recovery.md) | Pembayaran, status dan pemulihan | Subset API now; remaining gates explicit | BE-R08/R13–R16; recovery lintas perangkat/invoice lookup belum ditemukan. UI bantuan tersedia tanpa POST ulang bila hasil create ambiguous. | TODO |
| [F06](features/f06-guest-requests.md) | Pembatalan dan bantuan/perubahan booking | Subset API now; remaining gates explicit | BE-R01/R02/R05/R12. API request/amendment belum ditemukan; session cancel credential bridge wajib. UI dialog/policy bisa selesai sebelum wire. | TODO |
| [F07](features/f07-frontdesk.md) | Operasi front desk dan masa menginap | Subset API now; remaining gates explicit | BE-R01 gate mutasi/read staf live; F12 identity, worklist/filter contract dan property scope. Early checkout/no-show policy BE owner. | TODO |
| [F08](features/f08-catalog-inventory.md) | Katalog, inventory dan maintenance | Subset API now; remaining gates explicit | BE-R01/R07/R09; maintenance/block/adjust/version API belum ditemukan. Metadata editing bisa didesain, mutasi memakai identity yang telah fixed. | TODO |
| [F09](features/f09-rate-promo.md) | Pengelolaan tarif, paket dan promo | Subset API now; remaining gates explicit | BE-R09/R10, C01–C04 rate/promo/rounding authority. Rate/promo CRUD/version/validity/quota API dependency. | TODO |
| [F10](features/f10-channel-sync.md) | Sinkronisasi kanal dan sumber inventory | UI/mocks ready; API waits contract | BE-G18/F10 authority/mapping/monotonic version/idempotency; contract onboarding/channel health/action dan ops acceptance. | TODO |
| [F11](features/f11-notification.md) | Notifikasi dan status pengiriman | UI/mocks ready; API waits contract | BE-R17, BE-G16; event coverage, delivery ledger, templates/retention/retry permission dan API contract. | TODO |
| [F12](features/f12-staff-identity.md) | Identitas staf, permission dan audit | UI/mocks ready; API waits contract | BE-R01; selected staff identity provider/session/MFA plus endpoints dan audit retention. Mutasi F07/F08/F14 gated sampai ini dipenuhi. | TODO |
| [F13](features/f13-hotel-configuration.md) | Metadata hotel dan konfigurasi kebijakan | Subset API now; remaining gates explicit | C06/C12, BE-R12; approved policy/contact/source-assets dan versioned config/read/write/audit contract. | TODO |
| [F14](features/f14-finance-refunds.md) | Finance, rekonsiliasi dan refund | Subset API now; remaining gates explicit | BE-R01/R13–R16 dan delta review finance baru: authorization, concurrency saldo/refund idempotency, timeout/recovery/provider mode belum dianggap terbukti hanya karena route ada. | TODO |
| [F15](features/f15-verification-pilot.md) | Verifikasi, aksesibilitas dan pilot | Subset API now; remaining gates explicit | Bergantung milestone sebelumnya dan BE owner acceptance. Physical Safari/iOS/Chrome Android/screen reader tidak otomatis selesai dari screenshot/Playwright desktop. | TODO |

## Matriks endpoint aktual → target BFF

| ID | Go API actual | FE BFF target | Feature owner | Auth/aktivasi | Evidence awal |
|---|---|---|---|---|---|
| API-01 | GET `/healthz` | `environment probe` | BASE-04 | liveness bukan feature acceptance | SOURCE_PRESENT / connected NOT_RUN |
| API-02 | GET `/ready` | `environment probe` | BASE-04 | dependencies/migrations dicek terpisah | SOURCE_PRESENT / connected NOT_RUN |
| API-03 | POST `/api/v1/auth/guest/challenge` | `/api/bff/auth/challenge` | F02 | public; origin/rate/cooldown; OTP sandbox | SOURCE_PRESENT / connected NOT_RUN |
| API-04 | POST `/api/v1/auth/guest/verify` | `/api/bff/auth/verify` | F02 | raw token diserap BFF; HTTPOnly cookie | SOURCE_PRESENT / connected NOT_RUN |
| API-05 | GET `/api/v1/auth/guest/me` | `/api/bff/auth/me` | F02 | guest session; no-store | SOURCE_PRESENT / connected NOT_RUN |
| API-06 | POST `/api/v1/auth/guest/logout` | `/api/bff/auth/logout` | F02 | guest session; durable revoke errors | SOURCE_PRESENT / connected NOT_RUN |
| API-07 | GET `/api/v1/guest/bookings/{id}/receipt` | `/api/bff/guest/bookings/:id/receipt` | F04 | guest owner; JSON receipt/print | SOURCE_PRESENT / connected NOT_RUN |
| API-08 | GET `/api/v1/guest/bookings/{id}/calendar.ics` | `/api/bff/guest/bookings/:id/calendar.ics` | F04 | guest owner; binary download | SOURCE_PRESENT / connected NOT_RUN |
| API-09 | GET `/api/v1/guest/bookings/{id}/refund-status` | `/api/bff/guest/bookings/:id/refund-status` | F14 | guest owner; read only | SOURCE_PRESENT / connected NOT_RUN |
| API-10 | GET `/api/v1/guest/bookings/{id}` | `/api/bff/guest/bookings/:id` | F03 | guest session; allowed_actions capability check | SOURCE_PRESENT / connected NOT_RUN |
| API-11 | GET `/api/v1/guest/bookings` | `/api/bff/guest/bookings` | F03 | guest session; bounded list no invented cursor | SOURCE_PRESENT / connected NOT_RUN |
| API-12 | GET `/api/v1/catalog/rooms/{id}` | `/api/bff/catalog/rooms/:id` | F01/F08 | public read; canonical UUID | SOURCE_PRESENT / connected NOT_RUN |
| API-13 | PUT `/api/v1/catalog/rooms/{id}` | `/api/bff/staff/catalog/rooms/:id` | F08 | WAITING trusted staff + mutation acceptance | SOURCE_PRESENT / connected NOT_RUN |
| API-14 | DELETE `/api/v1/catalog/rooms/{id}` | `/api/bff/staff/catalog/rooms/:id` | F08 | WAITING trusted staff; active-use conflict | SOURCE_PRESENT / connected NOT_RUN |
| API-15 | GET `/api/v1/catalog/rooms` | `/api/bff/catalog/rooms` | F01/F08 | public read; photos/description | SOURCE_PRESENT / connected NOT_RUN |
| API-16 | POST `/api/v1/catalog/rooms` | `/api/bff/staff/catalog/rooms` | F08 | WAITING trusted staff; sandbox cleanup | SOURCE_PRESENT / connected NOT_RUN |
| API-17 | GET `/api/v1/search` | `/api/bff/search` | F01 | public search; room-price before addons | SOURCE_PRESENT / connected NOT_RUN |
| API-18 | GET `/api/v1/availability` | `/api/bff/availability` | F01/F08 | public read; no price-final/hold promise | SOURCE_PRESENT / connected NOT_RUN |
| API-19 | POST `/api/v1/quotes` | `/api/bff/quotes` | F01/F09 | quote no inventory write; server pricing only | SOURCE_PRESENT / connected NOT_RUN |
| API-20 | POST `/api/v1/bookings/{id}/cancel` | `/api/bff/bookings/:id/cancel` | F06 | booking token; session-only bridge pending | SOURCE_PRESENT / connected NOT_RUN |
| API-21 | POST `/api/v1/bookings/{id}/check-in` | `/api/bff/staff/bookings/:id/check-in` | F07 | WAITING trusted staff identity | SOURCE_PRESENT / connected NOT_RUN |
| API-22 | POST `/api/v1/bookings/{id}/check-out` | `/api/bff/staff/bookings/:id/check-out` | F07 | WAITING trusted staff identity | SOURCE_PRESENT / connected NOT_RUN |
| API-23 | POST `/api/v1/bookings/{id}/no-show` | `/api/bff/staff/bookings/:id/no-show` | F07 | WAITING trusted staff identity | SOURCE_PRESENT / connected NOT_RUN |
| API-24 | GET `/api/v1/bookings/{id}` | `/api/bff/bookings/:id` | F05 | secure booking-token match; do not accept public masked200 as owner | SOURCE_PRESENT / connected NOT_RUN |
| API-25 | POST `/api/v1/bookings` | `/api/bff/bookings` | F01/F05 | sandbox inventory/provider; frozen retry/consent/quote | SOURCE_PRESENT / connected NOT_RUN |
| API-26 | POST `/api/v1/finance/refunds` | `/api/bff/staff/finance/refunds` | F14 | WAITING staff identity + financial acceptance; no auto-retry | SOURCE_PRESENT / connected NOT_RUN |
| API-27 | POST `/api/v1/finance/cases/{id}/resolve` | `/api/bff/staff/finance/cases/:id/resolve` | F14 | WAITING staff identity; verify action side effects | SOURCE_PRESENT / connected NOT_RUN |
| API-28 | GET `/api/v1/finance/cases` | `/api/bff/staff/finance/cases` | F14 | WAITING trusted staff; scoped finance data | SOURCE_PRESENT / connected NOT_RUN |
| API-29 | GET `/api/v1/finance/reconciliations` | `/api/bff/staff/finance/reconciliations` | F14 | WAITING trusted staff; aggregate truth | SOURCE_PRESENT / connected NOT_RUN |
| API-30 | POST `/api/v1/webhooks/xendit` | `none — provider→BE` | F05/F14 | FE never calls or sets callback credential | SOURCE_PRESENT / connected NOT_RUN |
| API-31 | POST `/fake-pay/{ref}` | `/api/bff/dev/bookings/:id/confirm` (target) | F05 | Development-only explicit capability; no production route/proxy | SOURCE_PRESENT_CONDITIONAL / NOT_RUN |

Private mutations tidak otomatis enabled pada mode API hanya karena handler ada. source_present → reachable on test deployment → contract_pass → connected_pass → relevant BE gap acceptance → active capability adalah tahapan berbeda.

## Kontrak yang belum ditemukan dan UI yang boleh disiapkan

| Kontrak | Pekerjaan FE sekarang | Syarat wire/activation |
|---|---|---|
| Staff auth/me/logout/permissions | F12 login/session/forbidden mocks | Trusted identity backend dan negative-auth evidence |
| Staff reservation worklist/filter | F07 list/search/detail mocks | Route list, pagination/property filter/DTO |
| Session-owned cancel untuk historical booking | F06 dialog/policy | Session credential diterima backend secara sah; jangan tukar token |
| Invoice resume/provider lookup | F05 recovery UI/same-device initial-link support | Private durable payment view/lookup; same invoice, no new charge |
| Guest request/amendment | F06 contact/help UI | Request create/read/status/history/approval contract |
| Stock adjustment/maintenance blocks | F08 table/form mocks | Mutasi/version/audit/source authority endpoints |
| Rate/promo CRUD | F09 editor mocks, existing quote integration | Rate store, version, validity/quota API |
| Channel sync/status/retry | F10 monitor mocks | Adapter mapping/authority/version/error contract |
| Notification ledger/retry | F11 delivery UI mocks | Delivery status, permission/idempotency API |
| Hotel config read/write/version | F13 forms + existing receipt fields | Config source/policy history contract |
| Server-generated PDF | F04 printable receipt | Binary PDF endpoint bila owner membutuhkan; print browser tetap terpisah |
| Cursor pagination guest/finance | Bounded list UX sesuai API | Actual cursor/total/has_more contract; jangan mengarang next page |

Bagian ini merupakan daftar observation snapshot; owner BE boleh menambah kontrak selama FE task lain berjalan. Saat API baru muncul, update hanya row/task impacted melalui delta handoff, bukan memulai plan dari awal. Implementasi management/API baru oleh BE tidak perlu menunggu FE skeleton selesai.

## Traceability task → API → verifikasi

Setiap baris menunjuk task `<Fxx>-UI`, `<Fxx>-API`, `<Fxx>-QA` pada tracker. Nomor API mengacu ke tabel endpoint di atas; nomor V mengacu ke [matriks verifikasi](04-verification-and-release.md). Daftar endpoint pending adalah dependency, bukan target URL yang boleh dipanggil sekarang.

| Task owner | API IDs | Validation IDs | Dependency khusus | Scope yang dapat berjalan |
|---|---|---|---|---|
| F01 | 12,15,17,18,19,25 | V01–V04 | BASE-01/02/03/04 | Guest core sandbox |
| F02 | 03–06 | V05–V07 | BASE + OTP transport uji | Sandbox login |
| F03 | 10–11 | V05/V07 | F02-API | Private guest read |
| F04 | 07–08 | V11/V17 | F03-API | Private receipt/ICS |
| F05 | 24–25,30–31 | V04/V08/V09/V19 | F01-API + secure post-create access | Pending/status sandbox; provider callback BE-only |
| F06 | 20 | V05/V10 | F05 booking-token access; session cancel bridge untuk historical | Credential-limited sandbox cancel |
| F07 | 21–24 | V13/V14 | F12 trusted staff + worklist API | UI now; connected staff waits |
| F08 | 12–16,18 | V02/V13/V14 | BASE read; F12 untuk CRUD | Public read now; CRUD gate staff |
| F09 | 19 | V01/V03/V16 | F01 quote; management API pending | Guest quote now; rate management waits |
| F10 | Belum ditemukan | V16 | Channel API + F12 | UI/mock first |
| F11 | 03/30 hanya side effects terkait; delivery API pending | V06/V16 | Delivery ledger/API + F12 | Copy/UI now; delivery admin waits |
| F12 | Belum ditemukan trusted staff auth | V05/V13 | BE-R01 + identity contract | UI/mock first |
| F13 | 07/19 metadata snapshot; config API pending | V03/V11/V16 | Policy owner + config API/F12 | Snapshot display now; settings waits |
| F14 | 09,26–29 | V12/V13/V15 | F02/03 guest read; F12 + finance invariant proof untuk staff | Guest refund read now; staff financial execution waits |
| F15 | 01–31 untuk capability enabled | V01–V19 sesuai scope | Milestone selected + isolated env | Continuous proof; physical-device NOT_RUN |
