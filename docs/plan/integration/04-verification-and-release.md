# Verifikasi, environment, acceptance dan rollback

## Environment dan data uji

Mode `mock` untuk UI/contract deterministic; mode `api-test` terhubung Go server + PostgreSQL/Valkey isolated + fake/provider sandbox explicit; mode `production` hanya setelah gate capability. Hindari auto-select mode dari healthz atau ketika API error. .env example memuat nama config tanpa secret: private BE base URL/session secret/provider origins, public UX mode, capability flags. Credential nyata disimpan environment di luar repo.

BASE-04 memastikan base URL, router build identity, migration version termasuk guest/finance schema yang aktif, provider mode dan test dataset. Tidak otomatis rebuild/migrate DB pengguna atau menjalankan TRUNCATE suite. Gunakan database/namespace yang disetujui untuk testing, fixture email/domain test dan cleanup resource IDs; provider production/email nyata memerlukan intent eksplisit tersendiri.

## Matriks skenario verifikasi

| ID | Scope/test | Layer | Expected evidence |
|---|---|---|---|
| V01 | IDR0, sum/breakdown, unsafe ints, date-only/Jakarta | unit/contract | Total dan formatting sesuai BE, bukan cents demo |
| V02 | Search/selection, sold-out/missing inventory, stale requests | unit + browser + connected read | URL restore, available rooms truthful, no stale price |
| V03 | Quote promo/policy/expiry/mismatch, single vs multi semantics | contract + connected | Server total unchanged, no quote-less fallback |
| V04 | Guest fields/terms/privacy, raw-body frozen retry | unit + BFF + isolated create | Body/key identical, same-device result recovery; BE concurrent proof terpisah |
| V05 | Secure sessions SSR/two users, token/header/PII redaction | BFF + browser | No shared state, no token in payload/localStorage/query, CSRF/origin denied |
| V06 | OTP invalid/expired/max attempts/cooldown/revoke/DB error | contract + connected | Error states truthful, logout server failure tidak disebut revoked |
| V07 | My Bookings/filter/list limit/private detail | connected two-account | Non-owner404, session expired401, total semantics honest |
| V08 | Pending polling/hidden/focus/clock/redirect/refetch | fake-clock unit + browser + connected | No client-confirm/expiry, bounded polling and safe redirect |
| V09 | Create timeout/unknown payment outcome | contract/fault + BE evidence | No automatic second booking/invoice; support/recovery state |
| V10 | Applicable cancel/wrong credential/policy/deadline | connected isolated DB | Status server correct; no fake refund; no session-token substitution |
| V11 | Receipt/print/ICS ownership and binary headers | connected + visual print | Snapshot totals, timezone policy mismatch recorded, no PII caching |
| V12 | Guest refund no/partial/pending/failed/non-owner | connected read | Server status shown; no cancel→refund assumptions |
| V13 | Staff direct auth/spoof/role/property checks | BFF + BE security acceptance | Protected even without UI route guard; no trusted string roles |
| V14 | Staff operations/catalog CRUD conflict/assignment | connected staff sandbox | Response/DB side effect, cleanup and role scope |
| V15 | Finance execute/resolve timeout/idempotency/saldo | provider sandbox + realDB BE proof | No real charges/refunds; no auto-repeat ambiguous mutation |
| V16 | New management capabilities F09–F13 | contract + connected when available | WAITING_BE remains explicit until API provided |
| V17 | 360/390/768/1440px, keyboard/focus/errors/dialogs | Chromium responsive + manual | No overflow, correct loading/live regions, visible focus |
| V18 | Chrome Android, Safari iOS, screen reader | physical/manual | Device/OS/browser/version, steps, actual result/screenshots |
| V19 | Restart/deploy/rollback with pending booking/session | connected + ops rehearsal | Existing booking access recoverable; mutations gated, no fake confirmed fallback |

## Perubahan test suite FE

Existing money/mock-client/e2e demo tests adalah baseline, bukan integration proof. Tambahkan tests untuk mappers, API clients, stable retry serialization, timers/request cancellation dan session/CSRF behavior; adapt browser tests ke API-test fixture yang actual backend contract-compatible. Mode mock tests tetap berguna tetapi report terpisah. Tidak menulis tests yang sekadar menyalin implementasi; pilih boundary/error/race/state scenarios di atas.

Per slice jalankan focused unit/contract terlebih dahulu. Checkpoint validasi FE: `npm run typecheck`, `npm run lint`, `npm run test:unit`, `npm run build`; browser `npm run test:e2e` untuk changed flow + final core regression. Report menyebut environment/mode. Typecheck/build green bukan bukti API/DB/provider/session integration. Test BE dijalankan owner di isolated environment, terutama integration helper yang dapat TRUNCATE.

## Definisi siap dicoba vs siap live

**Siap dicoba API-test:** route deploy/migration sesuai, credentials/data/provider uji terisolasi, happy/error paths connected lulus untuk scope enabled, privacy/BFF boundary benar, limitations ditampilkan. Defect BE yang masih OPEN tidak disembunyikan; task correction/recovery didokumentasikan dan feature gated bila tidak aman.

**Siap live capability:** trusted identity/ownership, money/occupancy/consent/idempotency/payment deadlines/recovery invariants terkait telah fixed dan verified; configuration provider tidak fallback diam-diam; release owner menerima scope/limitations dan support/rollback. Staff and financial mutations tidak diaktifkan hanya karena UI atau source route hadir. Guest read/artifact subset dapat memiliki activation terpisah selama backend exposure security tetap dipenuhi deployment owner.

**Evidence:** simpan `docs/qa/integration/<date>-<scope>.md` dengan task ID, source/deploy identity, commands/exit codes, PASS/FAIL/SKIP/NOT_RUN, mocked vs connected/provider/device, expected/actual API dan DB effects tanpa secret/PII, screenshots bila diperlukan, cleanup, remaining risk dan owner acceptance. Jangan centang required physical checks dari desktop screenshot atau dokumen report saja.

## Rollback dan monitoring

Capability flags runtime mematikan mutation baru tanpa mengubah booking existing menjadi demo. Tetap arahkan user ke authoritative read/status atau safe unavailable/help state. Jangan route private booking/status ke public masked response pada session failure. Preserve secure session access/attempt recovery sesuai TTL; deployment restart yang menghapus quote/session adalah failure yang perlu dicatat, bukan reset diam-diam.

Observability FE/BFF mencatat correlation/request IDs, endpoint class, HTTP status/latency dan error code dengan redaction email/token/body. Tidak mengirim guest draft ke analytics tanpa scope/owner keputusan. BE tetap source inventory/provider/notification monitoring; FE tidak menjalankan reconciler atau outbox scheduler.

Acceptance pilot per capability: named owner, tanggal/environment, actual supported flow, known limits, support contact, rollback trigger dan results. Kegagalan auth/privacy/duplicate financial mutation menghentikan capability terkait; fitur independen yang verified tetap bisa ditinjau di test mode.
