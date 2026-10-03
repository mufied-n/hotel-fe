# QA checkpoint redesign guest webapp

Tanggal: 3 Oktober 2026, Asia/Jakarta. Scope: shared brand shell, search, results, room detail, guest, review, status, OTP/Booking Saya presentation, dan shared staff shell. Mode runtime yang diperiksa: mock/demo.

## Outcome

Guest journey telah mendapat hierarchy editorial PULANG, search/result cards yang lebih mudah dipindai, detail dengan recovery pencarian, checkout dengan total/policy yang jelas, mode-aware status copy, dan Booking Saya yang lebih terstruktur. Shared staff shell berubah menjadi sidebar desktop dan navigation strip mobile tanpa membuka capability live.

Brand fidelity belum final. Logo menggunakan wordmark fallback berbasis teks dan foto memakai placeholder yang jelas. Approved logo/font/room photos belum tersedia.

## Checks

| Check | Hasil sesi ini |
|---|---|
| `npm run typecheck` | PASS; tooling menulis warning non-fatal `vue-router/volar/sfc-route-blocks` |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS — 9 files, 26 tests |
| `npm run test:e2e` | PASS — 8 Chromium scenarios setelah selector diselaraskan dengan copy final |
| `npm run build` | PASS — final source checkpoint setelah anchor mobile dan shared staff shell |
| `git diff --check` | PASS |

E2E memverifikasi root redirect, single-room booking sampai status/cancel, URL recovery/invalid query, catalog detail, serta capability/sample staff flows. Ini bukan bukti API hotel, provider payment, atau email live.

## Browser review

| Route/state | Viewport | Temuan |
|---|---:|---|
| `/booking` | 390×844 | Header/notice/steps/hero terbaca; mobile nav menuju anchor search; form berada setelah hero ringkas |
| `/booking/results` loading/ready | 390×844 | Search summary, disclosure, room card dan sticky continuation; no page-level horizontal overflow observed |
| `/booking/review` ready | 390×844 | Guest, policy dan total mengikuti normal flow; CTA tidak ditumpuk dengan nav |
| `/booking/review` ready | 1200×800 | Form/review dan sticky summary dua kolom; total dan guest visible dalam hierarchy yang sama |

Evidence:

- [search mobile](../evidence/redesign-2026-10-03/search-mobile.jpg)
- [results mobile](../evidence/redesign-2026-10-03/results-mobile.jpg)
- [review mobile](../evidence/redesign-2026-10-03/review-mobile.jpg)
- [review desktop](../evidence/redesign-2026-10-03/review-desktop.jpg)

Capture browser adalah emulasi viewport Chromium desktop, bukan physical-device QA. Screenshot results tersimpan pada loading state; ready/card diperiksa langsung dalam sesi browser tetapi belum disimpan sebagai file checkpoint.

## Remaining gates

- Approved logo, brand font, room photos, mapping family/variant/interior, dan asset provenance: OPEN.
- Seluruh visual status matrix, OTP response states, My Bookings dengan backend fixture/stub, receipt multi-page print: NOT RUN pada checkpoint ini.
- Route-level visual pass semua staff workspace: NOT RUN; existing E2E sample/capability regression PASS.
- Screen reader manual, 200% zoom, measured contrast audit, reduced-motion manual, virtual keyboard, Chrome Android, Safari macOS/iOS physical: NOT RUN.
- API/Go/Postgres/payment/email/provider/live staff acceptance: di luar checkpoint dan tetap mengikuti integration gates.

Status checkpoint: **guest core VERIFIED WITH PLACEHOLDERS**. Brand fidelity, complete staff pass, device/accessibility manual QA, dan live readiness tetap terbuka.

## Revisi lanjutan — bagian Tentang kamar

Permintaan pengguna: redesign ulang bagian tentang kamar. Perubahan terbatas pada `app/pages/booking/rooms/[id].vue`: heading lebih ringkas, kartu spesifikasi tempat tidur/kapasitas/luas, daftar fasilitas dua kolom, label data demo, dan panel ketersediaan dengan dua field tanggal serta link kembali yang terintegrasi. Luas ditampilkan hanya ketika nilainya positif; informasi yang belum tersedia tidak diberi angka buatan.

Verifikasi revisi: typecheck PASS (warning tooling yang sama), ESLint file PASS, satu E2E catalog/availability PASS. Browser pada Deluxe King Balcony: desktop 1200×900, mobile 390×844, dan mobile 360×800 tanpa page-level horizontal overflow. Tombol Periksa tanggal pada 360px menampilkan hasil simulasi. Pemeriksaan ini tetap emulasi desktop; device QA belum dilakukan.

- [Tentang kamar desktop](../evidence/redesign-2026-10-03/about-room-desktop.jpg)
- [Tentang kamar mobile](../evidence/redesign-2026-10-03/about-room-mobile.jpg)

## Revisi lanjutan — motion, interaction feedback, dan loading

Fondasi motion sekarang menggunakan token press/feedback/panel/media dan easing bersama. Hover tombol, field, serta linked booking row hanya aktif pada perangkat dengan hover dan fine pointer; touch/keyboard tetap memperoleh pressed, focus, selected, disabled, dan busy state. `BrandButton` memiliki kontrak loading bersama dengan `aria-busy`, label kontekstual, spinner dekoratif, dan pencegahan aktivasi ulang.

Results menampilkan skeleton dengan satu status loading, selected card feedback, pending quote lokal, serta latest-request guard. Detail kamar memisahkan loading halaman dari pending/error pemeriksaan tanggal dan membuang hasil ketika tanggal berubah. Review, OTP, status, pembatalan, serta Booking Saya memakai busy feedback yang sama; Booking Saya dan status melindungi respons usang. Accordion dan dialog memakai entrance singkat tanpa mengubah semantik native.

Verifikasi revisi: typecheck PASS (warning tooling non-fatal yang sama), targeted ESLint PASS, unit PASS 9 files/26 tests, full Chromium E2E PASS 8/8, dan `git diff --check` PASS. Browser IAB Chromium memverifikasi loading pencarian, perubahan selected state, serta tombol quote menjadi disabled dengan label “Menyiapkan total…”. Pemeriksaan ini membuktikan state dan alur mock, bukan timing pada jaringan produksi.

Reduced-motion sudah memiliki fallback source-level yang menghentikan pengulangan animasi dan smooth scroll. Capture manual dengan preferensi OS reduced-motion, physical touch device, screen reader, request >8 detik, respons terbalik terkontrol, dan seluruh staff visual state masih **NOT RUN**. Build final dijalankan sebagai gate terpisah setelah perubahan dokumentasi.

## Revisi lanjutan — section, route, dan loading lifecycle

Implementasi RD-T24–29 menambahkan pending feedback bersama dengan spinner tertunda 150ms dan slow-state 8 detik, lebar tombol yang stabil, reduced-motion eksplisit, section reveal satu kali, Nuxt page entrance 180ms, serta transisi loading menuju results. Results sekarang memakai snapshot input/selection dan generation guard untuk quote; controls pilihan terkunci selama pending. Invalid URL juga mengakhiri pending lama. Detail kamar memakai image-ready component yang menangani decode/cache/error, sementara Booking Saya membedakan initial skeleton dari background refresh yang mempertahankan data lama. Status polling mempertahankan panel dan memakai indikator refresh kecil.

Verifikasi source: typecheck PASS (warning tooling `vue-router/volar/sfc-route-blocks` tetap non-fatal), full ESLint PASS, unit PASS 10 files/28 tests termasuk fake timer 150ms/8s/cleanup, production build PASS, dan `git diff --check` PASS. Full Chromium E2E PASS 9/9, termasuk complete booking journey, staff sample/capability flows, reduced-motion, selected state, dan quote feedback. Assertion guest special-request dikoreksi dari 401 menjadi 503 karena environment test tidak memiliki private session password; `sessionConfig` secara eksplisit menjadikan konfigurasi tersebut service unavailable sebelum guest token dapat dibaca. Perubahan ini menyelaraskan test dengan kontrak source tanpa mengubah endpoint runtime.

Browser Chromium lokal pada results: desktop 1200×900 dan mobile 390×844. Section animation bernama `section-reveal-in`, hover button terukur sekitar translateY −2px, reduced-motion menghasilkan `animation-name:none` dan `transition-duration:0s`, tidak ada page-level horizontal overflow atau console error. Physical touch, Safari/iOS, screen reader, semua staff visual state, real network >8 detik, dan foto resmi tetap **NOT RUN** atau menunggu aset.

- [Motion results desktop](../evidence/redesign-2026-10-03/motion-results-desktop.jpg)
- [Motion results mobile](../evidence/redesign-2026-10-03/motion-results-mobile.jpg)
