# F12 — Identitas staf, permission dan audit

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M4 prerequisite. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/12-staff-identity-permissions-and-audit-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/12-staff-identity-permissions-and-audit-2026-10-03.md).

## Outcome dan baseline

Trusted sign-in → principal/permissions → workspace scoped → logout/revoke; audit baca dari BE.

Baseline terverifikasi: Casbin role routing ada; staff identity source masih unverified strings/headers.

## Kontrak dan perilaku

Belum ada trusted staff auth/me/logout/permission/audit-management route. Bearer receptionist atau header role bukan kontrak login.

Bangun UI auth/permission-denied dan mocks terlebih dahulu. Backend trusted identity merupakan server gate, bukan middleware FE saja. Private BFF menyaring headers dan tidak menerima X-User-Role/ID/Testing-Role dari browser. Scope property/resource harus enforced BE; unauthorized UI bukan proof auth.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/staff/login.vue; app/middleware/staff.ts; app/composables/useStaffSession.ts; server/utils/staff-session.ts; app/pages/staff/audit.vue`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [ ] **F12-UI:** Staff login shell/session expiry/forbidden UI, permission-aware navigation dan audit views dengan mocks.
- [ ] **F12-API:** WAITING_BE untuk staff auth; setelah fixed, trusted session BFF dan adapters F07/F08/F14 diaktifkan sesuai role.
- [ ] **F12-QA:** Negative authorization tests pada direct BFF/backend dan SSR isolation; mock UI tidak menutup BE-R01.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R01; selected staff identity provider/session/MFA plus endpoints dan audit retention. Mutasi F07/F08/F14 gated sampai ini dipenuhi.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: Spoof header/token, valid session wrong role/property, expired/revoked credential, audit contains actor server identity, cache isolation.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
