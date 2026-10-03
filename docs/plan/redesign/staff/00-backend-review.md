# ST-00 — Review backend sebelum redesign staff

Review: 3 Oktober 2026. Scope: kontrak staff, auth/RBAC, operasional, finance, catalog dan management surfaces; bukan audit seluruh backend atau verifikasi deployment.

## Snapshot dan authority

Backend: `/mnt/code/projects/jobs/pulang/current-booking`, HEAD **3236e59cc97eb5fd3a83981014da3ad89c8fb522**. Saat review awal perubahan durable quote masih working tree; pada pembacaan ulang sudah masuk commit `3236e59`. Snapshot ini mengikuti HEAD terakhir yang diperiksa. Backend berubah selama review: pengecekan akhir juga menemukan working changes di `internal/api/{router,router_test,webhook_test}.go` dan `internal/booking/{booking,payment_attempt,postgres,service,service_test}.go`. `docs/gap/README.md` berubah dan banyak dokumen PRD/SRS/tech/reaudit masih untracked. Jangan memasukkan perubahan tersebut ke commit FE atau menganggap proposalnya deployed.

Delta akhir yang dibaca: booking charge mencatat intent sebelum gateway, membedakan `unknown_timeout` dari definitive failure, dan handler menambah `504 GATEWAY_TIMEOUT` / `502 PAYMENT_FAILED`. Ini perubahan working tree BE-R13, bukan staff payment-attempt recovery API baru dan bukan perbaikan refund. Perubahan akhir tersebut belum diuji ulang dalam review ini; pemeriksaan ulang baseline/contract sebelum eksekusi FE wajib karena BE sedang aktif dikerjakan.

Frontend baseline: commit `5d40ce0`, BFF staff fail closed, role preview dan operational mock sudah tersedia. Source aktual lebih tinggi authority daripada laporan lama. Khusus `docs/gap/12-post-commit-delta-review-2026-10-03.md`, klaim staff belum mempunyai trusted identity sudah tertinggal oleh implementasi auth.

Perubahan terbaru meliputi trusted staff auth, hardening guest auth/privacy, capacity invariant, catalog→rate engine, breakfast multi-room/child age tiers dan Valkey quote store. Rate engine yang tersedia **tidak otomatis berarti API editor rate/promo tersedia**.

## Kontrak yang ditemukan

Semua path di tabel diawali `/api/v1`. Sumber utama: [router](</mnt/code/projects/jobs/pulang/current-booking/internal/api/router.go:140>), [auth middleware](</mnt/code/projects/jobs/pulang/current-booking/internal/api/middleware.go:65>), migrations 00003/00005/00009–00015/00017. Role efektif adalah irisan sesi terverifikasi, Casbin dan feature flag, bukan hanya label di nav.

| Surface | Route existing | Data / batas penting |
|---|---|---|
| Identity | POST `/auth/staff/login`, GET `/auth/staff/me`, POST `/auth/staff/logout` | Login token/expires_at/staff; me username/role; logout 204 |
| Roster | GET `/front-desk/daily-roster?date=YYYY-MM-DD` | Metrics, arrivals, departures, **in_house_count**, bukan list in-house |
| Handover | GET/POST `/front-desk/handover-notes` | limit/offset dan total; shift, cash_float_minor, pending_issues, vip_guest_notes |
| Housekeeping | GET `/housekeeping/rooms`; PUT `/:id/status`; POST `/:id/out-of-order` | floor/status/room_type_id; :id nomor kamar; OOO GM saja, rentang [start,end) |
| Booking actions | GET `/bookings/:id`; POST `/:id/check-in`, `check-out`, `no-show` | Role dan status guard; full booking untuk staff, guest_token disanitasi |
| Stay | POST `/bookings/:id/room-move`, `extend-stay`; GET `room-moves` | Target inspected belum menjamin availability; extension 1–30 malam, biaya baru di response |
| Requests | GET `/front-desk/special-requests`; PUT `/:id/status` | Resource bantuan tamu terpisah dari handover; adapter/request filters perlu mengikuti handler |
| Finance | GET `/finance/reconciliations`, `/finance/cases`; POST `/finance/cases/:id/resolve`, `/finance/refunds` | Summary global; cases status/limit tanpa cursor; refund response `{status,refund}` |
| Catalog | GET/POST `/catalog/rooms`; GET/PUT/DELETE `/:id` | Full RoomVariant, code/family/bed/capacity/base_price_minor/media; duplicate/in-use conflicts |
| Configuration parsial | GET `/admin/feature-flags`; PUT `/:key` | Enabled/allowed_roles; bukan hotel policy editor |

Tidak ditemukan route management inventory calendar/blocks, rate-plan CRUD, promo CRUD, channels/retry jobs, delivery log/retry, hotel policy CRUD, atau audit feed pada router snapshot. Rule Casbin yang menyebut `/rates` atau `/inventory/blocks` bukan bukti adanya handler. Dokumen SRS F08–F14 numbered menyatakan **PROPOSED / REQUIRES CONTRACT REVIEW**; URI/payload targetnya tidak boleh langsung dipakai adapter.

## Temuan dan implikasi implementasi

Prioritas berikut adalah prioritas gate redesign/integrasi, bukan klaim severity produksi dari penetration test.

| ID / prioritas | Bukti dan skenario | Dampak / rekomendasi / acceptance |
|---|---|---|
| ST-C01 / P0 FE | [BFF staff](../../../../server/api/bff/staff/[...path].ts) selalu 503; [preview](../../../../app/composables/useStaffPreview.ts) default GM dan belum punya revenue_mgr | Buat session staff nyata terpisah dan action capabilities. Tambah revenue_mgr. Invalid/expired token tidak turun ke sample/GM; role header dari browser tidak diteruskan |
| ST-C02 / P0 FE | [API operations client](../../../../app/services/api-operations-client.ts) mengembalikan raw payload sebagai domain camelCase; BE models snake_case, beberapa response terbungkus note/refund | `roomNumber`, totals dan referenceId akan undefined saat proxy dibuka. Buat DTO/mappers runtime, unwrap envelope, tes payload backend literal termasuk null arrays; jangan memperbaiki dengan type assertion |
| ST-C03 / P0 refund | [balance](</mnt/code/projects/jobs/pulang/current-booking/internal/finance/postgres.go:23>) memakai pool.QueryRow FOR UPDATE tanpa transaksi yang melingkupi [create intent](</mnt/code/projects/jobs/pulang/current-booking/internal/finance/postgres.go:54>); service memisahkan keduanya | Dua request dapat membaca remaining yang sama sebelum insert. BE perlu reservation atomik dengan lock/transaction. Uji dua refund paralel melebihi saldo gabungan: paling banyak satu diterima, saldo tidak negatif; FE submit lock bukan solusi server |
| ST-C04 / P0 refund | [service](</mnt/code/projects/jobs/pulang/current-booking/internal/finance/service.go:92>) membuat reference dari UnixNano per request; update status error diabaikan; nil gateway menyatakan sukses mock | Replay setelah timeout bisa intent baru; provider success bisa beda dari DB. Butuh request idempotency durable, lookup staff intent/balance/history, uncertain outcome dan provider reconciliation. Refund live tetap locked sampai replay/sandbox/DB-write-failure evidence ada |
| ST-C05 / P1 cases | [ResolveCase](</mnt/code/projects/jobs/pulang/current-booking/internal/finance/service.go:184>) langsung store update; [SQL](</mnt/code/projects/jobs/pulang/current-booking/internal/finance/postgres.go:213>) selalu status resolved, menyimpan action bebas | “refund/reallocate/dismiss” bukan workflow finansial/stock yang dieksekusi. Copy FE: catat penyelesaian, bukan dana dikembalikan/kamar dialokasi. Kontrak action enum dan dismiss semantics perlu BE amendment; tes UI tidak mengklaim side effect |
| ST-C06 / P0 OOO | [MarkRoomOutOfOrder](</mnt/code/projects/jobs/pulang/current-booking/internal/housekeeping/service.go:172>) update status lalu deduct inventory terpisah; actor hardcoded gm_admin; generic status update juga menerima OOO untuk GM | Kegagalan kedua dapat menyisakan status tanpa kuota; replay OOO dapat mengurangi kuota lagi, generic update tidak deduct. BE perlu maintenance resource/range, idempotency, transaction, actor nyata dan restore semantics. FE hanya dedicated OOO form, live locked sampai failure/replay proof |
| ST-C07 / P1 conflict | HK GetRoom→validate→update tidak compare version; catalog PUT dan flags PUT tanpa expected_version/ETag | Read-before-write FE tidak mencegah lost update. Refresh + preserve draft/409 recovery dapat dibangun; jangan menyatakan concurrency safe. Version/CAS mutation membutuhkan BE amendment dan uji dua editor |
| ST-C08 / P0 extension | [ExtendStay](</mnt/code/projects/jobs/pulang/current-booking/internal/stay/service.go:91>) menghitung lalu mutate; payment_method tidak dipakai store; tidak ada preview quote/commit atau payment confirmation workflow | Jangan menghitung biaya final dari sample/nightly price guest. Live extension locked hingga server preview terkait booking/version/expiry, commit idempotency dan payment handling disepakati; hasil extension bukan bukti pembayaran |
| ST-C09 / P1 access | Migration 00010 memberi receptionist HK GET saja; 00005 memberi revenue_mgr POST/PUT catalog, bukan DELETE; finance tidak mewarisi guest booking GET | Preview capability luas bukan izin aksi. Bedakan read/create/edit/delete; GM broader. Stay view receptionist tidak boleh gagal total saat data ops lain denied. Finance detail booking perlu kontrak/izin sendiri, jangan guest token fallback |
| ST-C10 / P1 auth | [login](</mnt/code/projects/jobs/pulang/current-booking/internal/staffauth/service.go:92>) baca failed_attempts lalu [RecordFailure](</mnt/code/projects/jobs/pulang/current-booking/internal/staffauth/postgres.go:33>) overwrite | Login salah paralel bisa kehilangan hitungan; perlu increment/lock atomik dan parallel failure test BE. FE tetap mendukung 429 Retry-After; timer bukan rate limit security |

Tambahan UX: housekeeping `total_rooms`/summary menghitung hasil **yang difilter**, bukan total properti. Reconciliation tidak menerima tanggal/period, sehingga date filter tidak boleh mengubah label agregasi seolah scoped. Roster default UTC; FE selalu kirim tanggal operasional WIB secara eksplisit. Handover adalah create/list, bukan edit/acknowledge/read-receipt. Refund staff list/detail/balance belum tersedia; jangan menggunakan endpoint guest beremail lain untuk staff.

## Auth yang kini dapat digunakan

[Staff auth](</mnt/code/projects/jobs/pulang/current-booking/internal/api/staff_auth.go:65>) dan [service](</mnt/code/projects/jobs/pulang/current-booking/internal/staffauth/service.go:18>): opaque token `stf_`, SHA256 token hash tersimpan, bcrypt password, sesi 8 jam, lima gagal→lock 15 menit, password reset mencabut sesi. PostgreSQL verifier memeriksa expiry/revocation/is_active. Header role palsu dan literal bearer role tidak memberikan staff privilege. Login 401 INVALID_CREDENTIALS, 429 ACCOUNT_LOCKED + Retry-After, 503 AUTH_UNAVAILABLE. `/me` tidak menyediakan permission list/full_name/expiry; FE tidak boleh mengarang server permissions.

Migrations/password provisioning/TLS/Casbin/flags tetap perlu verifikasi environment. Feature flag nil middleware fail-open untuk backward compatibility; feature flag tidak menggantikan auth. Health 200 tidak membuktikan provider/refund capability aktif.

## Verifikasi review ini

Targeted non-DB tests **PASS enam package** pada source saat command dijalankan, sebelum delta payment working tree terakhir: `internal/api`, `staffauth`, `finance`, `housekeeping`, `frontdesk`, `stay`, dengan `GOEXPERIMENT=jsonv2 go test ... -count=1` dan selector unit/API untuk staff auth, RBAC, feature flags, finance, housekeeping, roster/handover dan stay. Selector sengaja tidak mencakup Postgres tests, yang sebagian mencoba DB default dan memutasi fixture. Tidak menjalankan live E2E, provider refund, migrasi atau seluruh race suite.

Command exact selector:

```sh
GOEXPERIMENT=jsonv2 go test ./internal/api ./internal/staffauth ./internal/finance ./internal/housekeeping ./internal/frontdesk ./internal/stay -run '^(TestIdentifySubject_StaffTokens|TestStaffLoginHandler|TestStaffMeAndLogout|TestRBACRouteProtection|TestFailClosedEnforcer|TestHousekeepingAPI_.*|TestFrontDeskAPI_.*|TestFinanceAPI_.*|TestStayAPI_.*|TestRequireFeature_Middleware|TestAdminFeatureFlags_API|TestFeatureFlags_WiredGuards_TableDriven|TestLogin.*|TestVerifyStaffToken.*|TestSetPassword|TestFinanceService_.*|TestHousekeepingService_.*|TestFrontDeskService_.*|TestStayService_.*)$' -count=1
```

[Laporan auth E2E existing](</mnt/code/projects/jobs/pulang/current-booking/testing/e2e/report/2026-10-03-134800-staff-authentication-e2e-report.md>) mendokumentasikan stack test terisolasi dan token spoof/logout/lockout. Itu evidence historis dari author laporan, **tidak direrun dalam review ini** dan tidak menutup ST-C03–10. Temuan concurrency di atas berasal dari jalur source; reproduction DB/provider menjadi acceptance remediation berikutnya.
