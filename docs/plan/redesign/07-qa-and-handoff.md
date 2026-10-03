# RD-07 — Verifikasi redesign dan handoff

Status: PLANNED. Owner: FE/QA; acceptance mengacu RD-00–05. Laporan baru saat eksekusi: `docs/qa/redesign/<tanggal>-redesign-ui-report.md`; evidence pada folder bernama route/state/viewport/mode. Laporan frontend lama tetap menjadi historical snapshot, tidak ditimpa sebagai bukti redesign.

## Matriks utama

| Area | Skenario wajib | Bukti |
|---|---|---|
| Shell | Search, checkout, OTP, My Bookings, staff, print | Logo/notice/nav/step/focus/offset |
| Search/results | Single room, multi-room, child ages, available/sold out/invalid/error, loading | Input, selection, quote basis, recovery |
| Room detail | Contextual entry, direct entry, back, photo absent/fail, unknown id | Query round trip dan galeri |
| Guest/review | Required errors, optional long request, edit/back, missing/expired quote, consent, pending/double click | Data/total/submit behavior |
| Status | Seluruh union status, unknown fallback, offline/stale, deadline elapsed, cancel | Label/action/freshness dan authority |
| OTP/My Bookings | Email/code/resend/ganti email, 401/expired, empty/error/list/detail | Session and returnTo regression |
| Guest service | Refund none/pending/succeeded/failed/error; request enabled/disabled/pending/declined/error | Domain states terpisah |
| Receipt | Long name/email/reference, multiple pages, different booking statuses | A4 preview/PDF render dan semua pricing/status |
| Staff | Semua kelompok RD-05; role/forbidden/session expired/locked; existing sample mutation flows | Filter/table/form/pending/review dan permission |

Fixture/scenario IDs direuse dari registry existing jika tersedia. State baru hanya ditambah bila dibutuhkan untuk regression desain/interaksi, dengan data deterministik. API behavior diuji dengan response fixtures/stubs sesuai kontrak bila environment live belum tersedia; bukti dicatat sebagai mocked API, bukan live acceptance.

## Responsive dan accessibility

- Viewport emulasi minimum 360/390/768/1024/1440. Layar prioritas: search/results/detail/guest/review/status/list/staff board/finance.
- Tidak ada page-level horizontal overflow; tabel lebar memiliki scroll region yang jelas bila memang diperlukan.
- Safe-area, sticky header/notice dan action bar tidak menutupi field, error, consent, total, ataupun aksi terakhir.
- Uji keyboard mobile secara nyata bila tersedia; emulasi viewport tidak membuktikan virtual keyboard behavior.
- Keyboard: Tab order, label, radio/select, disclosure, gallery, dialog Escape/focus restore, no keyboard trap.
- Body/helper/status contrast AA; normal text 4.5:1, large text 3:1, relevant UI boundaries 3:1. Color bukan satu-satunya petunjuk.
- 200% zoom dan reflow sempit, reduced-motion, image fail, font fail, long translations/data; active step tetap terlihat.
- Screen reader manual pada satu journey guest dan dialog/request penting jika tersedia; hasil dan tooling dicatat. NOT RUN tidak ditulis PASS.

## Regression yang sesuai perubahan

Existing `tests/e2e/booking.spec.ts` memiliki selector heading/copy dan `.room-card`. Saat layout/copy berubah, pakai roles/labels dan identifier stabil jika memang dibutuhkan. Jangan sekadar memperbarui expected text agar test hijau jika perilaku berubah.

Tambahkan test yang bermakna untuk round trip query/selection, context action bar, modal focus, consent gating, status mode/unknown/stale, dan media fallback. Test CSS class/token semata tidak diperlukan.

Test unit timer/client/money/dates/query/guest-request/staff-preview yang existing tetap menjadi regression authority domain. Tidak menulis ulang test business logic demi styling. Perubahan adapter media/query perlu unit tests pada mapping/invalidation yang benar-benar berubah.

Checks saat implementasi:

```sh
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```

Pada checkpoint kecil jalankan check/relevant tests sesuai diff; pada final jalankan suite relevan lengkap dan build. Jangan mengulang broad tests tanpa perubahan/error baru. Hasil pada plan ini belum dijalankan dan belum PASS.

## Visual comparison dan fidelity

Bandingkan dengan [evidence official](../../research/evidence/landing-audit-2026-10-03/) dan dua referensi pengguna: logo, photography, hierarchy, palet, panel, whitespace, typography. Tujuan bukan pixel-match template real estate atau menyalin hero marketing ke checkout.

Foto/logo/font approved, loading verified, dan route nyata harus tersedia sebelum mengklaim final brand fidelity. Placeholder-only dapat lolos review struktur, tetapi limitation tetap terbuka. Screenshot mencantumkan mode, scenario, viewport, dan posisi scroll; hindari frame transisi sebagai bukti final.

## Format laporan dan definition of done

Laporan memuat: baseline SHA + working tree, scope file/routes, daftar checks/results, state/viewport matrix, evidence links, defects/remaining dependency, dan status tiga outcome:

| Outcome | Syarat penutupan |
|---|---|
| UX redesign | Semua route/state dalam scope, navigasi dan interaksi verified, regressions passed |
| Brand fidelity | Approved assets/fonts/copy installed dan verified pada layar utama |
| Live readiness | Gate owner integrasi/auth/payment/DB/provider/device yang berlaku selesai; di luar klaim redesign saja |

Chrome Android/Safari iOS physical QA mencatat device/browser/version, langkah, hasil, screenshot. Bila perangkat tidak tersedia, tetap NOT RUN. Print preview yang hanya dibuka belum membuktikan semua halaman benar; periksa hasil render.

## Handoff ke owner integrasi

- Daftar perubahan view model/media/query dan invariants yang tetap berlaku.
- Capability yang masih diblokir atau membutuhkan API/credential; tidak diaktifkan hanya karena UI selesai.
- Data authority untuk contact, photos, benefit/rate, policy, quote/quantity, status/refund/request.
- Laporan UX/fidelity/device yang dapat diakses reviewer, tanpa PII tamu nyata.
- Roadmap integrasi tetap memiliki activation; dependency audit lama harus diperbarui oleh owner release sebelum dipakai sebagai fakta current.
