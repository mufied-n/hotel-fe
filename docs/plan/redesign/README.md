# Rencana redesign webapp PULANG

Tanggal: **4 Oktober 2026, Asia/Jakarta**. Status: **IN PROGRESS — guest journey dan staff route pass telah diimplementasikan; reliability completion RD-09, asset fidelity, dan device QA masih terbuka**.

Tujuan: membuat booking webapp terasa sebagai kelanjutan PULANG ke UTTARA, dengan fotografi autentik, komposisi editorial, dan transaksi yang mudah dipahami. Dua referensi pengguna membantu hierarchy dan layout; identitas berasal dari [riset official landing](../../research/official-landing-ux-analysis.md).

## Scope dan hasil

- **Prioritas pertama:** seluruh perjalanan tamu, dari pencarian sampai status, OTP, Booking Saya, permintaan khusus, refund, dan receipt.
- **Tahap berikutnya:** konsistensi dan usability workspace staff yang sudah tersedia. Layout staff mengutamakan scanning, tabel, filter, dan aksi operasional.
- Landing official, halaman marketing, dan website vendor tidak dibangun ulang. `/` tetap menuju `/booking`.
- Redesign mempertahankan model booking, mode mock/API, serta gate integrasi. Aktivasi API/payment/staff live tetap dimiliki roadmap integrasi.

Outcome dibedakan menjadi: **UX selesai** dengan seluruh state dan fallback yang benar; **brand fidelity selesai** setelah aset resmi terpasang dan diperiksa; **live acceptance** melalui gate integrasi terpisah. Screenshot indah atau build hijau tidak menutup ketiga outcome sekaligus.

## Paket dokumen

| ID | Owner dokumen | Hasil | Dependensi |
|---|---|---|---|
| RD-00 | [Scope dan baseline](00-scope-and-baseline.md) | Inventaris source, batas perubahan, keputusan desain | Riset official |
| RD-01 | [Brand dan fondasi komponen](01-brand-foundation.md) | Token, aset, shell, forms, galeri, aksi mobile | RD-00 |
| RD-02 | [Search dan pemilihan kamar](02-search-room-selection.md) | Search, results, detail, varian/paket, konteks navigasi | RD-01 |
| RD-03 | [Checkout dan status](03-checkout-status.md) | Guest, review, total, consent, timer, recovery | RD-01–02 |
| RD-04 | [Booking Saya dan layanan tamu](04-my-bookings.md) | OTP, list/detail, request/refund, receipt | RD-01; RD-03 untuk status bersama |
| RD-05 | [Workspace staff](05-staff-workspace.md), [paket implementasi](staff/README.md) | Review backend terbaru + lima kelompok staff, session/adapter, navigation, boards, editor dan QA | RD-01; gate per capability |
| RD-06 | [Tracker dan urutan eksekusi](06-execution-tracker.md) | Task, checkpoint, dependensi, batas review | Seluruh owner |
| RD-07 | [QA dan handoff](07-qa-and-handoff.md) | State matrix, visual/accessibility/regression evidence | Dikerjakan sejak fondasi |
| RD-08 | [Animasi dan feedback](08-motion-and-feedback.md) | Fondasi + section/route/loading lanjutan pada bagian 9; [preview timing](previews/motion-storyboard.html) | Core implemented; RD-T27–30 review/QA tersisa |
| RD-09 | [Frontend reliability dan completion](09-frontend-reliability-and-completion.md) | Staff state/filter/editor/monitoring hardening serta guest status/OTP/receipt completion | RD-02–08; backend gates tetap terpisah |
| RD-10 | [Controlled failure dan responsive QA](10-controlled-failure-responsive-qa.md) | Deterministic stale/latency evidence, viewport sweep, screenshot review dan fixes | RD-09 |

RD-06 merupakan satu-satunya tracker status. Checklist dalam dokumen fitur merupakan acceptance yang harus dibuktikan, bukan board status kedua. `app/`, `server/`, dan `tests/` tetap authority implementasi; daftar target baru di paket ini belum berarti file sudah ada.

## Urutan delivery

**Baseline → fondasi + tiga layar representatif → discovery lengkap → checkout/status → Booking Saya → staff → QA akhir.**

Tiga layar representatif adalah results mobile, room detail mobile, dan review desktop. Ketiganya menguji referensi, brand, kepadatan informasi, serta transaksi sebelum pola diperluas. Review dilakukan lewat halaman aplikasi dan screenshot; hindari prototype terpisah yang memakai data/alur berbeda.

Preview RD-08 adalah storyboard timing/state terisolasi dengan copy kamar existing dan semua aksi berlabel simulasi. Ini bukan alternatif booking flow; implementasi dan acceptance tetap diuji pada aplikasi.

## Hubungan dengan rencana lama

[Frontend awal](../frontend/README.md) adalah baseline fase demo. Paket ini memiliki redesign; [integrasi](../integration/README.md), [completion](../integration/completion/README.md), dan [operasional](../integration/operations/README.md) tetap memiliki fitur/API/activation masing-masing. Perbedaan status dokumen lama dengan working tree harus diverifikasi dari source saat eksekusi, bukan dianggap selesai oleh dokumen redesign.
