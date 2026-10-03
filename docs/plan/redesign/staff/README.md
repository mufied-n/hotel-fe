# Redesign workspace staff — paket implementasi

Tanggal: 3 Oktober 2026, Asia/Jakarta. Status: **IN PROGRESS — fondasi, session/BFF read, route redesign dan sample state telah diimplementasikan; live mutation tetap mengikuti gate domain**. Owner: FE operations. Paket ini memperinci RD-05, sesuai lima kelompok yang diminta pengguna. Review source backend dilakukan dahulu; dokumen proposal backend dibedakan dari route yang berjalan di source.

## Keputusan utama

Desain membawa identitas PULANG melalui hitam/putih, aksen oranye `#F58132`, judul kuat, dan controls yang sudah digunakan guest. Kepadatan workspace mengikuti tugas staff: ringkasan → daftar/board → detail → review → aksi → hasil. Foto besar hanya relevan di katalog. Landasan brand tetap [riset official](../../../research/official-landing-ux-analysis.md), bukan palet hijau dari referensi real estate.

Trusted staff authentication **sudah ada di backend** pada snapshot review. FE masih preview dan BFF staff masih menolak seluruh request. Menyelesaikan session/BFF/adapter menjadi tahap pertama, bukan membuka semua mutation saat mengganti layout.

| Dokumen | Tujuan | Dependency |
|---|---|---|
| [00 — Review backend](00-backend-review.md) | Fakta kontrak, perubahan, risiko, batas verifikasi | Source BE dan FE |
| [01 — Session dan adapter](01-session-and-contracts.md) | Login, capability, allowlist BFF, DTO | 00 |
| [02 — Fondasi desain](02-foundation.md) | Shell, navigation, states, responsive, motion | 00; live identity dari 01 |
| [03 — Operasional](03-operations.md) | Roster, housekeeping, stay, handover | 01–02; gate per aksi |
| [04 — Finance](04-finance.md) | Reconciliation, cases, refund review | 01–02; gate refund BE |
| [05 — Inventory dan revenue](05-inventory-and-revenue.md) | Catalog, inventory, rates, promos | 01–02; kontrak management parsial |
| [06 — Monitoring dan admin](06-monitoring-and-administration.md) | Channels, notifications, flags/config, audit | 01–02; kontrak management parsial |
| [07 — Verifikasi dan handoff](07-verification.md) | State matrix, kontrak, layout, activation evidence | Semua tahap |

Tracker status tunggal tetap [RD-06](../06-execution-tracker.md), task RD-S01–S10. Checklist per dokumen adalah acceptance, bukan klaim completion. Integration roadmap tetap memiliki activation; paket ini memiliki desain dan implementasi FE.

## Urutan delivery

1. S01 kontrak/session/adapter; S02 shell dan primitives. Review tiga layar representatif: roster desktop, housekeeping tablet, kasus finance mobile.
2. S03 roster/handover; S04 housekeeping; S05 stay. Dahulukan read dan interaksi sample, buka mutation per gate.
3. S06 finance: summary/cases read dahulu, penyelesaian kasus sebagai pencatatan; refund live menunggu remediation.
4. S07 katalog/inventory dan S08 rates/promo; katalog CRUD tersedia sebagian, management lain tetap sample/locked.
5. S09 monitoring/admin; feature flags terpisah dari hotel policy. S10 QA lintas role/viewport/mode dan handoff.

Setiap tahap menghasilkan commit yang buildable beserta consumer dan tes relevan. Jangan satukan auth, perubahan kontrak uang, dan seluruh route dalam satu perubahan sulit direview. Tidak mengestimasi tanggal tanpa kapasitas dan kesepakatan kontrak BE.

## Batas hasil

Seluruh lima kelompok dapat didesain dan dibangun dengan state sample yang eksplisit. Integrasi live hanya mencakup kontrak existing yang lolos gate masing-masing. UI selesai tidak berarti provider refund, delivery email, channel sync, atau audit menyeluruh sudah berjalan. Source backend tidak diubah dalam review ini.
