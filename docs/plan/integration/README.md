# Rencana implementasi FE dan integrasi API PULANG

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Status: **IN PROGRESS — M0 dan guest vertical slice M1–M3 sudah mulai diimplementasikan**. Root FE: `/mnt/code/projects/jobs/pulang/mimiking-booking-secure`; backend: `/mnt/code/projects/jobs/pulang/current-booking`. User mengembangkan gap BE, agen mengerjakan FE dan API yang sudah tersedia. Status rinci dan bukti berada di [task tracker](02-task-tracker.md) serta [progress report](../../qa/integration/2026-10-03-m0-m3-implementation-progress.md).

## Outcome

Mengubah webapp demo menjadi client backend nyata secara bertahap: search/quote/checkout/status, login penghuni, Booking Saya, receipt/kalender, cancellation yang memiliki credential sah dan status refund. Workspace staf serta management roadmap disiapkan paralel sebagai UI/contract work; endpoint yang ada tetap diuji sesuai trusted auth dan safety invariants, bukan ditunda bersama seluruh roadmap.

Scope tetap **webapp**, tanpa landing page atau marketing pages. Existing demo merupakan fondasi UI, bukan implementasi API. `/` tetap ke `/booking`. Integrasi lingkungan uji dapat berjalan selama BE memperbaiki gap; pengaktifan live per capability memakai acceptance terpisah.

## Cara menjalankan rencana

Paket lanjutan untuk lima task yang disepakati tersedia di [guest refund dan workspace operasional](operations/README.md): rencana per fitur, matriks API, tracker OPS, gate staff dan verification/activation. Paket ini merinci subset F07/F08/F14 tanpa mengganti status implementasi yang sudah ada.

1. [Kontrak, arsitektur dan baseline](00-contract-and-architecture.md): authority, DTO, BFF, money/auth/retry dan observed endpoints.
2. [Matriks implementasi dan integrasi](01-implementation-integration-matrix.md): F01–F15, API aktual, BFF target dan gate.
3. [Task tracker](02-task-tracker.md): 51 task, status, dependency, owner dan evidence; semua task integrasi masih TODO/WAITING_BE.
4. [Urutan eksekusi dan handoff](03-execution-and-handoff.md): M0–M6, checkpoint commit, delta source dan blocker handling.
5. [Verifikasi, environment dan activation](04-verification-and-release.md): skenario, evidence, sandbox/device serta rollback.
6. Dokumen per fitur di tabel berikut: spesifikasi kerja, TODO per task, target file, contract/error/state, dependency dan acceptance.

## Dokumen per fitur

| ID | Dokumen pemilik | Milestone | Status awal |
|---|---|---|---|
| F01 | [Pencarian, quote dan checkout](features/f01-booking-journey.md) | M1 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F02 | [Login penghuni dan sesi tamu](features/f02-guest-access.md) | M2 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F03 | [Booking Saya dan detail privat](features/f03-my-bookings.md) | M2 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F04 | [Konfirmasi, receipt dan kalender](features/f04-confirmation-artifacts.md) | M3 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F05 | [Pembayaran, status dan pemulihan](features/f05-payment-status-recovery.md) | M1/M3 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F06 | [Pembatalan dan bantuan/perubahan booking](features/f06-guest-requests.md) | M3 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F07 | [Operasi front desk dan masa menginap](features/f07-frontdesk.md) | M4 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F08 | [Katalog, inventory dan maintenance](features/f08-catalog-inventory.md) | M4 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F09 | [Pengelolaan tarif, paket dan promo](features/f09-rate-promo.md) | M4 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F10 | [Sinkronisasi kanal dan sumber inventory](features/f10-channel-sync.md) | M5 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F11 | [Notifikasi dan status pengiriman](features/f11-notification.md) | M5 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F12 | [Identitas staf, permission dan audit](features/f12-staff-identity.md) | M4 prerequisite | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F13 | [Metadata hotel dan konfigurasi kebijakan](features/f13-hotel-configuration.md) | M5 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F14 | [Finance, rekonsiliasi dan refund](features/f14-finance-refunds.md) | M3 guest / M4 staff | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |
| F15 | [Verifikasi, aksesibilitas dan pilot](features/f15-verification-pilot.md) | M6 | UI: TODO; adapter: TODO/WAITING_BE sesuai kontrak |

## Pekerjaan yang bisa mulai dan pekerjaan bersyarat

**Mulai sekarang:** foundation/DTO/BFF, rework booking single-type, status server, login OTP, list/detail guest, receipt JSON/ICS dan refund read pada backend test yang route/migration-nya cocok. UI staf/management dan contract mocks dapat berjalan tanpa credential staf production. Read API tidak dianggap deployment-ready hanya karena terdaftar.

**Aktivasi bersyarat:** checkout mutasi dan provider sandbox membutuhkan DB uji/stock/provider mode jelas; multi-room/breakfast menunggu semantics/acceptance; staff operations/finance execution menunggu trusted identity dan review mutasi; missing management API tetap WAITING_BE. Tidak membuat endpoint proposal seolah ada atau mensimulasikan sukses pada mode API.

Rujukan [gap backend](../../../../current-booking/docs/gap/README.md) adalah snapshot review, bukan authority absence selamanya. Source BE telah menambah route finance setelah laporan gap; matriks paket ini merekam tambahan tersebut. Bila ada perubahan sesudah tanggal/snapshot, gunakan delta review, jangan mengulang gap lama tanpa verifikasi.

Paket [frontend UI lama](../frontend/README.md) tetap baseline demo dan evidence historis. Paket ini menjadi owner untuk implementasi integrasi berikutnya; tidak mengubah acceptance demo menjadi bukti integration/live.
