# Kontrak, architecture dan gates completion

## Source dan reuse

Reuse booking client/API adapter, BFF session/CSRF/no-store, Money IDR0, date-only helpers, staff layout/operations mode, error alert, dan guest detail/refund panel. Jangan mengubah existing demo evidence menjadi connected proof.

Referensi source:
- [Status page](/mnt/code/projects/jobs/pulang/mimiking-booking-secure/app/pages/booking/status/[id].vue), [status panel](/mnt/code/projects/jobs/pulang/mimiking-booking-secure/app/components/booking/BookingStatusPanel.vue), [hold timer](/mnt/code/projects/jobs/pulang/mimiking-booking-secure/app/composables/useHoldTimer.ts).
- [Backend router](/mnt/code/projects/jobs/pulang/current-booking/internal/api/router.go), [feature gate](/mnt/code/projects/jobs/pulang/current-booking/internal/api/featureflag_middleware.go), [assistance handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/assistance_handler.go), [assistance model](/mnt/code/projects/jobs/pulang/current-booking/internal/assistance/model.go).
- [BE pricing engine](/mnt/code/projects/jobs/pulang/current-booking/internal/rates/engine.go), [identity middleware](/mnt/code/projects/jobs/pulang/current-booking/internal/api/middleware.go).

Router HEAD + local modifications teramati; special requests belum commit/deploy verified. Feature disabled memberi HTTP503 code FEATURE_DISABLED. Manager nil source fail-open tidak menjadi activation proof. Admin feature-flags GET/PUT tersedia, tetapi bukan public capability endpoint atau hotel-config API; pengelolaan flag admin di luar scope paket.

## Modes dan trust

Guest API memakai credential sesuai audience: booking token untuk legacy cancel, guest session untuk private artifacts/requests. Token tidak dipertukarkan. BFF menghapus identity/actor headers dari browser dan hanya mengirim credential yang dimilikinya sendiri.

Staff preview memakai principal sample dan permissions lokal khusus mock. Pilihan role sample bukan login, tidak menghasilkan credential backend. API staff tetap CAPABILITY_DISABLED; menu permission-aware membantu UX tetapi direct BFF/backend tetap wajib enforce permission.

Untuk F10/F11/F13 dan staff F09 yang belum endpoint: client interface + fixture saja, no invented URL. API mode menampilkan unavailable; tidak fallback otomatis ke fixture. Sample perubahan hanya in-memory dan tidak mengubah tariff, room availability, notification, policy booking ataupun backend flags.

## State dan retry rules

Read: idle/loading/ready/empty/error/disabled/stale. 401 clears private state; returnTo internal saja; 403 forbidden; 404 generic; 409 conflict/refetch; 429 bounded retry sesuai headers; FEATURE_DISABLED tidak diperlakukan transient network failure yang dipoll terus.

Mutation: draft/review/submitting/success/rejected/outcome_unknown. Auto-repeat dilarang pada cancel/request/config/retry-delivery ketika timeout/5xx bisa berarti server sudah mengeksekusi. Read authoritative dulu; stable intent hanya dipakai jika BE mendukungnya. Jangan menambah idempotency key yang dianggap bekerja tanpa BE contract.

Timer countdown nol memicu refresh server, bukan mutasi status lokal menjadi expired. Snapshot baru serverTime/expiresAt harus mereset baseline elapsed. Visibility return melakukan refresh; poll stops on unmount/logout/terminal/disabled dan tidak overlap. Body consent/harga/policy berubah memerlukan review ulang.

## File boundaries yang direncanakan

- Guest components: CancelBookingDialog, GuestRequestForm/History, RatePlanComparison, room gallery/detail dan recovery states.
- Public room pages: `app/pages/booking/rooms/[id].vue`; BFF room detail/availability explicit, bukan generic proxy.
- Sample staff pages: catalog/inventory, rates/promos, login/expired/forbidden/audit, channels, notifications, configuration.
- Sample principal/composable dan management clients/fixtures request-scoped, tidak module-global shared PII.
- Shared contracts hanya actual DTO upstream; proposed management view models disimpan di app/types dan diberi status proposal.
- Unit/contract/E2E additions dan evidence di `docs/qa/integration/completion/`.

Target file boleh disesuaikan dengan convention repo; catat actual mapping di evidence. Photo URLs validated scheme/allowed origin sesuai architecture; request notes escaped; notification body tidak memasukkan raw token; private API no-store.

## Gate handoff

Connected guest membutuhkan current isolated deployment, migrations/flag state, accounts/bookings, ownership, sample contact resmi dan provider mode. Staff membutuhkan trusted session/me/permissions/logout/audit contract beserta spoof-header/revocation/scope acceptance. Management membutuhkan version/conflict/idempotency/pagination contracts sebelum live save.

Allowed_actions bukan sole policy authority. Assistance accepted bukan amendment approved; cancelled bukan refund succeeded; notification accepted bukan delivered; stop-sell sample bukan stock changed; draft policy bukan published. Semua copy UI harus mengikuti bukti tersebut.
