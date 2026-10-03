# ST-01 — Session, permissions dan adapter

Dependency: ST-00; task RD-S01. Owner FE integration, BE identity untuk amendment. Status PLANNED. Session nyata dapat dibuat dari kontrak existing; setiap mutation masih punya gate domain.

## Target per file

| Target | Pekerjaan |
|---|---|
| `server/utils/staff-session.ts` (baru) | Session sealed HttpOnly cookie terpisah dari `pulang_bff`, secure production, SameSite, server expiry tidak melampaui expires_at BE; token tidak masuk response login/SSR payload/log |
| `server/api/bff/staff/auth/{login.post,me.get,logout.post}.ts` (baru) | Login username/password, upstream bearer server-owned; `/me` role dari BE; 204 logout tanpa JSON parse; forward Retry-After yang valid; no-store seluruh response/error |
| `server/utils/bff.ts` | Helper private upstream staff token, body size aktual termasuk chunked, origin/CSRF enforcement; guest session dan booking token tetap terpisah |
| `server/utils/staff-capabilities.ts`, `server/api/bff/staff/[...path].ts` | Ganti deny-all dengan method/path/query allowlist eksplisit untuk capability yang diaktifkan; unknown route denied; refund/OOO/extension gate independen; jangan proxy semua `/api/v1/*` |
| `shared/types/backend.ts`, `app/utils/operations-adapters.ts` (baru) | DTO snake_case per handler, response envelopes dan mapper ke `app/types/operations.ts`; validasi shape/error code, null arrays→[] bila kontrak mengizinkan, unknown enum jadi label aman |
| `app/services/api-operations-client.ts`, `app/types/operations.ts` | Unwrap note/refund/moves; map nested room/metrics/cases/results; tambahkan booking read dan check-in/out/no-show; pertahankan integer money/date-only |
| `app/composables/useStaffSession.ts` (baru), `useStaffPreview.ts`, `app/types/management.ts` | Pisah principal/session nyata dari sample role; tambah revenue_mgr; action capabilities bukan satu boolean seluruh fitur |
| `app/middleware/staff-permissions.global.ts`, `app/pages/staff/{login,forbidden,session-expired}.vue` | SSR/direct URL session check, safe internal return URL, invalid credentials/lockout/unavailable recovery; api mode tidak pernah fallback preview GM |
| `tests/unit/{staff-session,operations-adapters,staff-preview,operations-client}.test.ts` | Raw payload literal backend, malformed response, auth expiry/revoked, role/action matrix, method allowlist, header spoof, 204 dan Retry-After |

Daftar nama file baru merupakan usulan implementasi, belum file existing. Final handler layout boleh disederhanakan ketika consumer jelas.

## Model akses

| Role BE | Kemampuan source yang relevan | Batas |
|---|---|---|
| receptionist | Roster/handover, booking actions/stay, HK read, requests | Tidak HK mutation, finance/refund atau catalog write |
| housekeeping | HK read/status, roster read, requests | OOO GM saja; handover/booking actions denied |
| revenue_mgr | Catalog read/create/edit, roster read, availability | Catalog delete belum rule role ini; rates/promo management belum handler |
| finance | Summary/cases/refund route, room-move history | Staff booking detail access tidak tersedia dari inheritance guest; refund gate tetap locked |
| gm_admin | Broad `/api/v1/*` | Harus session valid; broad RBAC tidak menutup reliability gate |

Matrix UI merefleksikan snapshot migrations, bukan permission authority. BE tetap memutuskan setiap request; konfigurasi flag bisa menolak role yang lolos Casbin. `/me` belum memberi capability endpoint untuk seluruh role: gunakan mapping action yang diuji dan safe deny bila role tak dikenal; jangan mengambil GM-only flags sebagai syarat bootstrap semua staff. Amendment capabilities endpoint dicatat sebagai kebutuhan BE, bukan dependency wajib UI sample.

## Lifecycle dan feedback

Login → valid principal → landing sesuai akses. Render status “Data sample” atau “Terhubung ke backend” hanya berdasarkan mode/environment terverifikasi, bukan healthz. Refresh browser tidak memilih role default GM. Logout sukses upstream baru menyatakan sesi dicabut; bila upstream gagal, hapus akses lokal dan jelaskan pencabutan server belum terkonfirmasi.

401: hapus sesi lokal, hentikan action, arahkan expired; jangan persist draft sensitif lintas user. 403: forbidden/aksi denied tanpa menghapus sesi valid. 429: cooldown server dan retry manual. FEATURE_DISABLED 503 berbeda dari AUTH_UNAVAILABLE/transport error. Response timeout mutation menjadi hasil belum diketahui; tidak otomatis replay. Refresh GET boleh bounded manual retry.

## Acceptance

- [ ] Token/password tidak muncul di DOM, useState payload, localStorage, URL atau log; cookie guest tetap bekerja.
- [ ] SSR/direct entry/back/refresh dan sesi expired diuji; sample role hanya tersedia di mode preview.
- [ ] Upstream username/role/actor authoritative; spoof header/body actor dari browser tidak memberikan privilege.
- [ ] Semua operation result melalui mapper: roster.metrics, rooms, handover.note, refund.refund, stay results dan history terbaca benar.
- [ ] no-store, CSRF/origin negatif, chunked oversize, 204, 429 dan malformed payload punya tes meaningful.
- [ ] Gate domain default denied jika environment evidence belum ada; membuka auth tidak membuka seluruh mutation.
