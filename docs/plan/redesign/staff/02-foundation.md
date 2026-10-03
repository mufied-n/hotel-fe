# ST-02 — Fondasi staff dan desain interaksi

Dependency: ST-00 dan RD-01/RD-08; RD-S02. Owner FE design/operations. Status PLANNED. Shell sample bisa dikerjakan sebelum live session selesai.

## Susunan layar

Desktop ≥1200: sidebar sekitar 240px, workspace min-width:0; topbar identitas/mode/refresh/logout; header judul + konteks + satu CTA; summary kompak; filter; content; drawer detail di kanan. Sidebar kelompok Operations, Finance, Inventory & Revenue, Monitoring & Administration, hanya tujuan yang dapat dilihat role. Subnav finance dan revenue tetap jelas; active parent/child tidak menyalakan semua link.

Tablet 768–1199: rail ringkas atau sidebar collapse dengan label saat dibuka; filter wrap; drawer overlay. Mobile 360–767: topbar + tombol menu, nav drawer fokus-terkelola; summary wrap; filter disclosure; kartu operasional dengan detail fullscreen. Detail finance tetap mempertahankan nominal/currency/reference. Tabel audit/reconciliation kompleks boleh horizontal scroll dalam region berlabel, dengan petunjuk kolom lanjutan; jangan membuat seluruh body overflow.

Breakpoints merupakan usulan desain untuk diuji, bukan bukti QA. Layar kecil tidak menambah desktop sidebar horizontal panjang sebagai satu-satunya navigasi.

## Target dan reuse

| File | TODO |
|---|---|
| `app/layouts/staff.vue` | Sidebar groups/collapse/mobile dialog, status bar, skip link, role-aware entry, nav aria-current, session/logout consumer |
| `app/components/staff/StaffPageHeader.vue` (baru) | Eyebrow konteks, h1 moderat, description, action slot dan breadcrumb bila perlu |
| `StaffStatusBadge.vue` (baru) | Label/domain/icon; status tidak hanya warna; unknown value aman |
| `StaffFilterBar.vue` (baru) | Active filters, reset, search dan mobile disclosure; domain owns field semantics |
| `StaffDetailDrawer.vue`, `StaffActionDialog.vue` (baru) | Focus trap/return, Escape sesuai pending state, heading, review snapshot, primary/cancel; shared mechanics, content domain-specific |
| `StaffDataState.vue` (baru) | First load skeleton, empty/no matches, partial error, stale refresh, unavailable/denied; retry hanya bila tepat |
| `app/assets/css/{tokens,components}.css`, `staff.css` (baru bila perlu) | Staff density/surface/selected/focus tokens scoped; font angka tabular, stable columns; guest styles tidak bocor |
| Existing `BrandButton`, `ui/{FormField,InlineAlert,SkeletonBlock,LoadingIndicator}` | Reuse busy/focus/validation/reduced motion; tambah hanya kebutuhan nyata, jangan membuat dua button system |

Table/board jangan dipaksa menjadi satu komponen generik raksasa. Mulai dari dua consumer sebelum mengekstrak pola baris/toolbar. Row selected punya background, indikator dan accessible state; tombol terpisah agar klik action tidak ikut memilih/navigate.

## Feedback dan motion

| Interaksi | Desain target |
|---|---|
| Hover/focus | Border/surface/icon 120–160ms; hover hanya pointer fine; focus-visible ring tegas |
| Press | Scale kecil sekitar .98 hanya controls, 80–100ms; disabled tidak beranimasi |
| Row/room selection | Outline + background 140–180ms, selected tetap terlihat saat drawer terbuka |
| Dialog/drawer | Opacity + gerak 8–12px sekitar 180–220ms; segera fokus heading/field; tidak menunggu exit untuk action |
| First load | Skeleton mengikuti struktur final; aria-busy; indicator memakai helper delay existing agar tidak flash |
| Refresh | Pertahankan data + label “Memperbarui”; last success timestamp; filter request lama tidak menimpa terbaru |
| Mutation | Busy hanya action/resource terkait, review snapshot terkunci; sukses setelah response authoritative, error dekat form |
| Section | Reveal sekali pada summary/header bila membantu; hindari stagger tiap row/room atau setiap poll |

Ikuti token RD-08 existing sebelum menambah timing. Reduced motion menghapus translate/scale/stagger/shimmer, feedback state tetap muncul. Tidak ada min-duration loading palsu atau animation delay sebelum tugas staff bisa dijalankan. Bedakan error mutation dari gagal refresh setelah mutation sukses.

## Acceptance

- [ ] Viewport 390/768/1024/1440 dan zoom 200%: controls dapat dijangkau, tidak kehilangan informasi penting.
- [ ] Keyboard lengkap, skip link, focus-visible, menu/drawer/dialog trap dan return, heading hierarchy, aria-current dan live feedback.
- [ ] Initial load/error/empty/no matches/stale/partial/forbidden/sample/locked punya representasi berbeda.
- [ ] Long guest names, refs, notes, 0 totals, unknown status dan banyak nav items tidak merusak layout.
- [ ] Dark nav/brand orange konsisten dengan guest; status merah/hijau/amber semantic tidak menjadi branding baru.
- [ ] Normal/reduced motion, touch dan latency diperiksa; scroll/focus/selection tidak reset saat refresh.
