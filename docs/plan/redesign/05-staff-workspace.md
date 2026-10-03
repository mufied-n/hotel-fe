# RD-05 — Konsistensi workspace staff

Status: PLANNED, dikerjakan setelah arah guest stabil. Dependensi: RD-01. Owner: FE operations. Referensi [paket OPS](../integration/operations/README.md) dan [completion](../integration/completion/README.md).

## Arah

Workspace staff memakai logo/palet/controls yang konsisten dengan guest, dengan hierarchy lebih tenang. Staff perlu membandingkan baris, memfilter pekerjaan, dan memeriksa dampak aksi. Foto hero besar atau heading editorial setinggi layar tidak membantu pekerjaan ini.

Desktop memakai navigasi berkelompok dan area kerja luas; mobile menyediakan navigasi yang bisa dibuka, filter ringkas, dan card/detail yang tetap lengkap. Tidak membuat tabel baru kehilangan kolom penting hanya agar muat mobile; prioritaskan ringkasan dan detail row atau horizontal scroll yang jelas.

## Kelompok layar dan target

| Kelompok | Route/file `app/pages/staff/` | Perubahan UI |
|---|---|---|
| Identity | `login.vue`, `forbidden.vue`, `session-expired.vue`, `audit.vue` | Konteks peran/sesi/sample, denied recovery, audit scanning |
| Entry | `index.vue` | Pintu masuk sesuai capability; jangan tambah metrik bisnis tanpa data |
| Front desk | `front-desk/index.vue`, `front-desk/handover.vue` | Roster/filters, handover, status prioritas dan detail booking |
| Housekeeping | `housekeeping.vue` | Board/status legend, selected room, form update/OOO jelas |
| Stay | `bookings/[id]/stay.vue` | Detail stay, room move/extend form, review dampak |
| Finance | `finance/{index,cases,refunds}.vue` | Tabel/case detail, nominal, validation, confirmation |
| Catalog/inventory | `catalog.vue`, `inventory.vue` | Metadata/media, allotment date/range dan validation |
| Revenue | `rates.vue`, `promos.vue` | Paket, harga/benefit, status/date range; edit sample tetap berlabel |
| Monitoring | `channels/index.vue`, `notifications/index.vue` | Status, error/retry, batas sample/locked |
| Configuration | `configuration.vue` | Kelompok setting, perubahan belum disimpan, scope simulasi |

Shared targets: `app/layouts/staff.vue`, token/base/components CSS. Calon `app/components/staff/StaffPageHeader.vue` dan `StaffStatusBadge.vue` hanya jika pengulangan nyata. Table/filter components tidak perlu dibuat generik untuk seluruh fitur bila semantics berbeda.

## Hierarchy aksi

Filter → hasil → detail terpilih → form → preview dampak → confirmation bila operasi existing memerlukannya → feedback. Primary action hanya satu per konteks. Cancel/close jelas; nominal, booking reference, kamar, tanggal, dan alasan tetap terlihat pada review.

Perubahan visual tidak menyatukan status cleanliness/occupancy/inventory/payment menjadi satu status warna. Setiap domain memiliki label dan legend sendiri.

## Capability dan mock

- Mode sample, peran preview, dan operasi yang hanya tersimpan lokal tetap eksplisit.
- Navigasi memakai capability existing, bukan array link tanpa permission filter.
- `/staff/forbidden` dan `/staff/session-expired` mempertahankan recovery yang sesuai state.
- Trusted auth/API gates tidak dibuka oleh redesign. Role preview tidak dilabeli login operasional nyata.
- Tombol retry/simpan menampilkan hasil simulasi bila mock. Disabled capability menjelaskan kebutuhan akses/integrasi yang relevan.

## Acceptance

- [ ] Seluruh kelompok route mendapat review layout, bukan hanya dashboard pertama.
- [ ] Peran preview tetap membatasi nav/action dan route guard existing tetap berjalan.
- [ ] Filter, selected row, form errors, pending, confirmation dan feedback tidak hilang.
- [ ] Nominal/jumlah/tanggal readable dan tidak berubah semantics oleh format visual.
- [ ] Tabel mobile dapat diakses; tindakan penting tidak tersembunyi tanpa jalur detail.
- [ ] Sample success tidak menyatakan inventory/refund/channel/email live berubah.
- [ ] Shared CSS baru tidak merusak guest, print receipt, status, atau notice mode.
