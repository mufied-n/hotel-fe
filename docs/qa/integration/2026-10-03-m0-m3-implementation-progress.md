# Progress implementasi FE/API M0–M3

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Scope: foundation, guest booking vertical slice, auth/session, Booking Saya dan artifacts. Status evidence ini diperbarui dari source FE lokal; connected backend belum dinyatakan PASS.

## Implementasi

- Mode `mock` tetap default. Mode `api` eksplisit melalui runtime config.
- Nitro BFF memakai allowlist route, URL backend private, secure sealed HttpOnly cookie, no-store untuk data privat, header anti-CSRF dan same-origin check untuk mutasi.
- Browser tidak menerima guest session token atau guest access token. Booking token disimpan per booking dalam sesi BFF.
- DTO backend untuk katalog/search/quote/create/status/guest bookings/receipt/refund tersedia. Money API memakai IDR exponent 0; demo lama tetap dapat memakai exponent 2.
- Search–quote–checkout memakai satu tipe dan paket untuk seluruh jumlah kamar, sesuai v1 backend. Quote dan policy berasal dari server pada mode API.
- Login OTP, me/logout, Booking Saya, detail privat, receipt printable dan ICS proxy tersedia.
- Pembatalan same-device memakai booking token yang tersimpan di sesi BFF; tidak menganggap cancellation sebagai refund.

## Verifikasi lokal

| Check | Result | Catatan |
|---|---|---|
| `npm run typecheck` | PASS | Ada warning plugin Volar yang tidak menggagalkan command |
| `npm run lint` | PASS | Setelah implementasi awal; diulang pada final checkpoint |
| `npm run test:unit` | PASS, 13/13 | Mock client/date/query dan IDR exponent0/mixed-exponent guard |
| `npm run build` | PASS | Final Nitro routes dan SSR/client bundle terbentuk |
| BFF mutation tanpa CSRF | PASS (ditolak 403) | Preview build lokal port 3002 |
| BFF invalid email | PASS (ditolak 400) | Dengan header anti-CSRF |
| Private `/auth/me` tanpa sesi | PASS (ditolak 401) | Token tidak diberikan ke browser |
| Playwright demo regression | PASS, 3/3 | Root redirect, single-room flow dan URL restoration Chromium |
| BFF contract-backend smoke | PASS | Search, quote, OTP verify/me/list/logout, create/status dan payment-origin allowlist pada HTTP server terisolasi port19090 |
| Token redaction | PASS | Raw guest session/access token tidak muncul pada response browser maupun cookie jar; cookie sealed HttpOnly/SameSite=Lax |
| Connected Go API aktual | NOT RUN | Service port18080 sebelumnya tidak cocok dengan router source; perlu deploy/build test yang current |
| Provider sandbox, physical device, screen reader | NOT RUN | Bukan bukti dari build/desktop tests |

## Batas dan dependency

- Checkout API membutuhkan `NUXT_SESSION_PASSWORD` random minimal 32 karakter untuk menyimpan booking access. Mode API tanpa secret fail-closed 503.
- Payment URL hanya diberikan bila origin terdapat pada allowlist dan HTTPS pada production. Fake localhost hanya untuk development/test.
- Pembatalan historical booking belum dipasang karena guest session dan X-Guest-Token adalah credential berbeda.
- Timer/status belum memiliki polling bounded penuh dan server-time anchor pada GET; termasuk task F05 lanjutan.
- OTP backend atomicity, checkout idempotency concurrency, payment ambiguity, staff identity dan provider delivery tetap backend gates sesuai docs/gap.

## Next checkpoint

Final rerun lint/typecheck/unit/build setelah perubahan timer/refund UI. Setelah backend test deployment current tersedia, jalankan read-only search/guest route smoke lebih dahulu, lalu connected create pada isolated inventory/provider mode.
