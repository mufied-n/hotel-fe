# Matriks UI, kontrak dan integration mode

Path BFF target adalah rencana; upstream hanya dinyatakan available jika ditemukan pada source. Availability source tidak membuktikan deployment.

| Area | Existing baseline | Upstream aktual/provisional | Pekerjaan FE | Mode/gate |
|---|---|---|---|---|
| F06 cancel | Booking-token BFF cancel + confirmation sederhana | POST /api/v1/bookings/{id}/cancel | Accessible dialog, policy/error mapping, re-fetch status | Existing sealed booking token; connected QA isolated |
| F06 historical cancel | Allowed actions/detail ada | Session-owned cancel belum ditemukan | Disabled action + contact; sample request/change | WAITING_BE credential bridge |
| F06 guest requests | Belum FE adapter | GET/POST /api/v1/guest/bookings/{id}/special-requests; local uncommitted | BFF session, form/history/enum mapper | Contract refresh + guest flag/deploy/ownership |
| F06 staff queue | OPS roster existing | GET /api/v1/front-desk/special-requests; PUT /{id}/status local uncommitted | Mock queue optional di scope assistance; staff live tetap blocked | Trusted auth + local contract acceptance |
| F04 artifacts | Receipt view, JSON/ICS BFF ada | GET private receipt/calendar.ics | Print styles, loading/error, download headers/ownership tests | Guest session; no claim server PDF |
| F05 status/recovery | BFF status, bounded visible polling/timer existing | GET bookings/{id}; create response payment URL | Timer reset/cleanup/race tests, unknown outcomes, safe URL | Same-device token; cross-device resume WAITING_BE |
| F08 public catalog | Catalog list BFF existing | GET catalog/rooms, catalog/rooms/{id}, availability | Room detail/gallery/facilities, availability adapter | Public GET; current deploy/params |
| F08 admin | HK existing; catalog admin belum | POST/PUT/DELETE catalog rooms source exists | Admin sample form/list, inventory read/sample adjustments | Trusted auth + ff_catalog_write; mutations off |
| F09 guest packages | room_only/bed_and_breakfast adapter existing | POST quotes {rate_plan_code,promo_code,...} | Compare benefits/price, promo/quote errors/review | ff_quote_locking_engine; server price/policy |
| F09 admin | Belum UI/CRUD API | Rate/promo management routes belum ditemukan | Mock rates/promos forms/preview/version conflict | SAMPLE_ONLY / WAITING_BE |
| F12 identity | Staff shell exists, BFF staff lock | Trusted staff login/me/logout/permissions/audit routes belum ditemukan | Login shell, expired/forbidden, mock permissions/audit | Mock identity only; trusted auth pending |
| F10 channel | Belum workspace | Sync/status/mapping/replay routes belum ditemukan | Mock channel list/detail/conflict/stop-sell preview | SAMPLE_ONLY; no external writes |
| F11 notifications | OTP/Resend adapters BE | Delivery ledger/retry admin routes belum ditemukan | Mock status/filter/detail/resend review | SAMPLE_ONLY; no mail sent |
| F13 hotel config | Metadata/static hotel info/receipt | Hotel config GET/PUT/version routes belum ditemukan | Mock metadata/policy/timezone/draft/publish/conflict | SAMPLE_ONLY; admin flags bukan config |

## Actual payload boundaries

- Guest request POST: category, description, target_time. booking_id berasal path; guest_email/handled_by/status/department bukan input browser. GET response booking_id/requests[]. Categories: early_arrival, late_departure, high_floor, quiet_room, bed_type, celebration_setup, baby_crib, dietary_allergy, other. States pending/acknowledged/fulfilled/declined. Field staff_notes harus dianggap guest-visible hanya setelah copy/privacy semantics BE ditentukan; handled_by internal tidak otomatis diteruskan.
- Staff request queue filters department/status/booking_id; response items/total. PUT status body to_status/staff_notes; actor server. Scope target_time formatting belum constrained source; dokumentasikan handoff HH:mm/timezone sebelum live validation, jangan mengklaim standar yang tidak ditegakkan.
- Catalog detail memakai BackendRoomVariant; photos[] url/alt, amenities[], capacity/adults/children, size, description. base_price_minor bukan authoritative final quote.
- Availability memakai room_type_id/check_in/check_out sesuai handler getAvailability; response availability/quotes/total_minor. Total catalog room variants berbeda physical rooms.
- Quote snapshot: expires_at, cancellation_policy/description, nightly_rates dan breakdown IDR0. Unknown promo400 tidak membedakan invalid vs expired di BE; UI menggunakan copy gabungan.
- Admin identity/config/channel/notification/rate payload hanya proposal view model/fixture. Tidak ditempatkan dalam shared transport sebagai kontrak BE actual.

## Capability invalidation

Feature flag off saat flow berjalan: 503 FEATURE_DISABLED → stop relevant poll/action, preserve draft aman, show unavailable/contact/manual later refresh. Frontend tidak membaca admin flag registry publik dan tidak mengaktifkan staff karena flag true. Flag eligibility serta permissions wajib diperiksa server.
