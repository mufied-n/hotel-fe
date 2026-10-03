# Rencana guest refund dan workspace operasional

Tanggal: 3 Oktober 2026. Status: **PLANNED — implementasi lanjutan belum dimulai**. Scope disetujui: guest refund status, housekeeping, front desk roster/handover, room move/extend stay, dan finance workspace. Webapp saja; tidak ada landing page.

Baseline FE: commit `7fdf87d`. Baseline kontrak BE: `09bc727`; source handler/model/service diperiksa saat penyusunan. [Delta audit BE](/mnt/code/projects/jobs/pulang/current-booking/docs/gap/12-post-commit-delta-review-2026-10-03.md) merekam auth staff dan deployment drift. Snapshot bukan jaminan instance sudah memakai build tersebut. Refresh kontrak sebelum implementasi dan activation.

## Dokumen dan ownership

- [Arsitektur, mode dan gate](00-architecture-and-gates.md).
- [Matriks implementasi/API](01-implementation-matrix.md).
- [Task tracker dan urutan eksekusi](02-task-tracker.md).
- [Verifikasi dan activation](03-verification-and-activation.md).
- [Guest refund status](features/01-guest-refund.md).
- [Housekeeping board](features/02-housekeeping.md).
- [Front desk roster/handover](features/03-frontdesk.md).
- [Room move/extend stay](features/04-stay-operations.md).
- [Finance workspace](features/05-finance.md).

Paket ini merinci subset M3/M4 dari [rencana induk](../README.md). Tracker lokal memiliki task OPS-*; tracker induk tetap merangkum F07/F08/F14, tanpa menyalin seluruh task OPS. Status implementasi OPS dirawat hanya di tracker lokal. Dokumen fitur memuat checklist acceptance, bukan tracker kedua.

## Outcome dan tahap delivery

1. Tamu dapat membedakan belum ada refund, refund diproses, selesai, gagal, dan status belum diketahui tanpa kehilangan detail booking.
2. Staff dapat mencoba board dan form operasional dengan data sample deterministik melalui mode mock. Semua keberhasilan mock diberi label simulasi.
3. DTO dan adapter mencerminkan endpoint BE aktual; handler BFF memblokir request staff sebelum network call ketika identity/capability belum aktif.
4. Integrasi staff read dan mutation diaktifkan per capability setelah trusted staff auth serta acceptance fitur dipenuhi. Sampai saat itu tidak memakai role-string atau header identitas dari browser.

## Urutan

Foundation capability/client/fixtures → guest refund → housekeeping → roster/handover → stay operations → finance → regresi lintas fitur. Housekeeping menyediakan konteks kamar untuk stay operations; roster menyediakan pintu masuk booking tetapi belum merupakan daftar seluruh booking. Finance dapat memakai explicit booking ID dalam mock karena endpoint refundable-balance/detail staff khusus belum tersedia.

Checkpoint commit terpisah per tahap setelah implementation checks lulus. Pembuatan dokumen ini tidak menjalankan mutasi backend, implementasi aplikasi, atau activation.
