# F02 — Login penghuni dan sesi tamu

Status: rencana implementasi, belum dikerjakan pada fase integrasi. Milestone: M2. Owner FE melaksanakan UI/adapter, BE owner menyediakan gap closure/kontrak, QA merekam evidence. Tracker resmi: [task tracker](../02-task-tracker.md). Referensi: [PRD](/mnt/code/projects/jobs/pulang/current-booking/docs/prd/02-guest-access-and-session-2026-10-03.md) · [SRS](/mnt/code/projects/jobs/pulang/current-booking/docs/srs/02-guest-access-and-session-2026-10-03.md).

## Outcome dan baseline

Email → request OTP → code verification → sesi aktif → tujuan private yang aman; logout → sesi lokal dan server dicabut.

Baseline terverifikasi: Belum ada UI login/session di FE. Backend sekarang memiliki challenge/verify/me/logout.

## Kontrak dan perilaku

POST auth/guest/challenge {email}; verify {email,code}; GET me; POST logout. BE menerima guest_session cookie, Bearer gst_sess_ atau X-Guest-Session.

BFF menyimpan token upstream dalam sesi server/cookie HttpOnly tersegel; raw token tidak diteruskan ke JSON browser/localStorage. SSR meneruskan cookie hanya ke BFF sendiri. Resend cooldown mengikuti response; pesan accepted tidak menjamin delivered. ReturnTo hanya path internal allowlist. Login wajib ada link dari header dan state status yang kehilangan akses.

BFF paths/file names di dokumen ini adalah target FE, bukan endpoint backend yang diasumsikan telah tersedia. Capability gated tidak dianggap complete hanya karena layout/mocks selesai. [Matriks API](../01-implementation-integration-matrix.md) menjadi authority availability berdasarkan snapshot.

## File dan boundary perubahan

Target: `app/pages/booking/login.vue; app/composables/useGuestSession.ts; app/middleware/guest.ts; server/api/bff/auth/*; server/utils/guest-session.ts`. Existing file boleh direfactor mengikuti fungsi yang sama; jangan membuat state/DTO duplikat. DTO snake_case upstream dipetakan di adapter, Vue menerima view model. Semua private data menggunakan no-store dan request/session-scoped state. Jangan menambah landing page atau marketing route.

## TODO implementasi

- [x] **F02-UI:** Form email/code dengan paste, inputmode numeric, labels, loading/error/cooldown dan returnTo aman.
- [ ] **F02-API:** Challenge/verify/session/me/logout BFF, private cookie lifecycle, origin protection dan 401 reset state.
- [ ] **F02-QA:** Uji sesi terisolasi, token tidak ada di browser payload/state, non-owner dan logout/reload; connected sandbox OTP dengan transport uji terkontrol.

UI → adapter/BFF → connected verification merupakan tahapan berbeda. Saat API task WAITING_BE, lanjutkan UI/mock proof dan task fitur lain. Untuk task campuran, catat subtahap READY/WAITING_BE pada evidence tracker; jangan menutup seluruh task karena bagian read sudah lulus.

## Dependensi dan handoff backend

BE-R03/R04/R17; canonical email BE-R05. Tidak mengirim OTP ke email pengguna nyata untuk tes. Sandbox login dapat dikerjakan saat BE memperbaiki atomicity; live menunggu acceptance.

Dependency umum BASE-01/02 sebelum UI contract; BASE-03/04 sebelum connected integration. F02 prerequisite private guest routes; F12 prerequisite staff calls; F01 create/ownership prerequisite F05 post-create status; F03 private detail prerequisite F04/F14 guest artifact/refund. Dependency yang tidak dipakai oleh fitur ini tidak perlu memblokirnya.

Handoff: BE memberikan request/response/error aktual, identity/ownership, relevant invariant test dan lingkungan isolated; FE mencatat mapper diff dan capability state; QA merekam expected/actual result. Jika source BE berubah, jalankan delta procedure dan perbarui task terkait sebelum merge adapter.

## State, error dan acceptance

Setiap fetch/action menyediakan loading, empty, ready, validation, unauthorized/forbidden, conflict, unavailable dan retry states yang relevan. Hindari stale response setelah navigasi/logout dan double submit; error internal tidak dipantulkan mentah ke tamu. Mutasi tidak otomatis diulang jika outcome finansial/stock belum pasti.

Acceptance fitur: OTP salah/expired/attempt limit/429, provider down, replay, session expired/revoked, invalid returnTo, logout fail, SSR refresh dan lintas tab. Jangan menyalin OTP log sebagai flow production.

Done UI: route/component accessible, semua state relevan di-render, label sample jujur. Done API: upstream aktual melalui boundary auth/BFF yang sah, DTO valid dan error/retry semantics terbukti. Done QA: unit/contract + connected evidence untuk subset enabled; tidak ada required FAIL/SKIP disembunyikan. Live activation menunggu gate khusus di atas, tanpa memblokir mock/UI independen.
