# Arsitektur dan gate operasional

## Baseline yang digunakan kembali

FE memakai Nuxt 4/Vue 3, existing UI tokens/components, IDR exponent 0, helpers date/money, dan BFF `server/utils/bff.ts`. Guest session tersegel dalam cookie HttpOnly; upstream token tidak masuk state browser. `shared/types/backend.ts` dan BFF guest refund route sudah ada. Detail guest sekarang mengubah kegagalan refund fetch menjadi null; perbaiki menjadi state error eksplisit.

Staff layout, client, fixtures, BFF staff routes dan trusted staff session belum ada. Kontrak identity staff baru harus disepakati BE; jangan mengarang endpoint login atau mengisi Bearer dengan role. Referensi: [middleware BE](/mnt/code/projects/jobs/pulang/current-booking/internal/api/middleware.go:66), [router BE](/mnt/code/projects/jobs/pulang/current-booking/internal/api/router.go:90).

## Mode dan capability

| Mode | Data guest | Data staff | Mutation staff |
|---|---|---|---|
| Mock | Fixture sesuai bookingMode | Sample fixtures | Hanya fixture in-memory, jelas simulasi |
| API, auth staff belum tersedia | BFF guest session | Layar unavailable atau explicit sample preview | Ditolak BFF, tanpa upstream call |
| API, trusted staff session tersedia | BFF guest session | Read sesuai permission/capability | Tetap disabled sampai gate mutation fitur lulus |
| API, fitur diaktifkan | BFF guest session | Read sesuai principal | Scoped mutation sesuai principal dan capability |

Mode mock staff harus dipilih secara eksplisit dan diberi label persistent; API failure tidak boleh fallback otomatis ke fixture. BookingMode API tidak otomatis mengaktifkan staff. Rancangan capability server: staffRead, housekeepingWrite, outOfOrderWrite, handoverWrite, roomMoveWrite, extendStayWrite, financeRefundWrite, financeResolveWrite. Default seluruhnya false. Nama/config final dipilih saat implementasi; tidak diperlakukan sebagai field BE existing.

## Request boundary

Vue → domain client → adapter mock atau BFF → allowlisted BE endpoint. BFF memeriksa capability, trusted session/permission, ID/query/body, origin/CSRF untuk mutation, lalu upstream. Disabled capability harus menghasilkan kode stabil `CAPABILITY_DISABLED` dengan status 503 dan nol upstream calls, termasuk request langsung yang melewati disabled button. Missing session 401; forbidden principal 403; upstream 404/409/502 dinormalisasi.

Semua staff reads juga menunggu trusted auth karena roster/room board/history memuat PII. Sampai contract auth tersedia, buat client interface, mock implementation, DTO mappers dan disabled BFF handlers; jalur trusted credential forwarding tetap WAITING_BE. Contract harness menggunakan identitas uji terinjeksi hanya dalam test process; tidak menambahkan bypass auth ke runtime deployment.

## File yang direncanakan

| Boundary | Target |
|---|---|
| Transport DTO | `shared/types/operations-backend.ts`, reuse existing refund DTO |
| View models | `app/types/operations.ts`, guest refund view model minimal |
| Client | `app/services/operations-client.ts`, `api-operations-client.ts`, `mock-operations-client.ts` |
| Mode/capability | `app/composables/useOperationsClient.ts`, `server/utils/staff-capabilities.ts` |
| UI shell | `app/layouts/staff.vue`, `app/components/staff/StaffNavigation.vue`, status/dialog primitives |
| Fixtures | `app/data/operations-scenarios.ts`, deterministic anonymized data |
| BFF | `server/api/bff/staff/**`, explicit per route; tidak generic proxy |
| Tests/evidence | `tests/unit/operations-*.test.ts`, `tests/e2e/operations.spec.ts`, `docs/qa/integration/operations/` |

Target path adalah rencana FE; boleh disesuaikan saat implementasi dengan tracker mencatat keputusan. Reuse primitives yang cocok; hindari komponen tabel/form abstrak yang belum diperlukan.

## State dan consistency

- Fetch: idle/loading/ready/empty/error/unavailable/unauthorized/forbidden. Pertahankan data terakhir dengan label stale saat refresh gagal; jangan tampilkan sebagai data baru.
- Mutation: draft/review/submitting/success/rejected/outcome_unknown. Tidak otomatis retry mutation pada timeout/5xx; read ulang resource/history dan eskalasi bila outcome tidak dapat dipastikan.
- Abort atau generation guard mencegah response lama menimpa filter/booking baru. Logout/401 menghapus state privat semua workspace, termasuk SSR state; cache tidak dibagi antar-user.
- Actor/role berasal dari principal server; browser hanya mengirim field bisnis yang allowlisted. Private BFF memakai no-store; tidak menyimpan PII/token pada localStorage atau URL.
- Money integer aman; IDR exponent0; reject unsafe integer/negative input yang tidak sesuai contract. Tanggal operasional YYYY-MM-DD tanpa konversi timezone UTC otomatis; timestamps tampil Asia/Jakarta. Kirim date eksplisit untuk roster agar tidak bergantung default UTC BE.
- UI keyboard-first, focus trap/return focus dialog, error terkait label, live status singkat, status dengan teks selain warna. Mobile gunakan cards/detail drawer, desktop tabel; action selalu terjangkau.

## Gate handoff

Auth trusted adalah prerequisite seluruh staff API. Mutation membutuhkan bukti tambahan per fitur: OOO atomic inventory/idempotency; room move overlap dan multi-room semantics; extension preview/price/payment/audit/retry; finance durable intent/over-refund/concurrency/provider recovery; handover duplicate handling. Tombol disabled memiliki alasan yang jelas di UI; alasan teknis lengkap di docs, bukan memenuhi halaman produk dengan detail engineering.
