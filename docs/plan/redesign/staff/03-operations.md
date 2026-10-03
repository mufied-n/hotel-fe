# ST-03 — Roster, housekeeping, stay dan handover

Dependency ST-01–02. RD-S03–S05. Owner FE operations; BE operations untuk reliability/preview amendment. Status PLANNED. Referensi kontrak/error dan gate: [ST-00](00-backend-review.md).

## Roster dan handover — S03

Target `app/pages/staff/front-desk/{index,handover}.vue`, `app/pages/staff/index.vue`, operations client/types/adapters; test baru `tests/e2e/staff-operations.spec.ts`.

- [ ] Header tanggal operasional WIB, picker, Today dan refresh; query GET selalu date eksplisit.
- [ ] Summary dari metrics response, tabs arrivals/departures. In-house hanya count sampai list endpoint tersedia; tidak membuat list fiktif dari arrivals.
- [ ] Filter nama/reference/room type lokal diberi scope “hasil tanggal ini”; pencarian historis/global tidak diklaim ada. URL menyimpan filter non-PII yang aman.
- [ ] Baris menunjukkan guest, booking reference, assigned rooms, room type, arrival/departure; detail drawer menyediakan aksi role/status appropriate. Availability/readiness bukan inferensi dari badge booking.
- [ ] Check-in/out/no-show punya review snapshot booking+kamar+tanggal, disabled pending dan refresh booking/roster/board setelah sukses. `ILLEGAL_TRANSITION`/readiness/NO_SHOW_TOO_EARLY ditangani dekat aksi, preserve selection dan reload authoritative.
- [ ] Handover list pagination limit/offset/total; shift labels morning/afternoon/night; editor cash float integer IDR + pending issues + VIP notes; review jelas sebelum create.
- [ ] Dirty form guard pada leave/close, reset setelah create sukses; tidak membuat edit/ack receipt karena API hanya create/list. Finance cash float bukan settlement accounting.

Acceptance: selected booking tetap konsisten saat filter berubah; empty tanggal dibedakan error; role housekeeping roster read tidak mendapat booking action; note actor dari server; double submit handover dicegah secara UI tetapi tidak diklaim server idempotent. Setelah timeout create, refresh/list review sebelum pengguna memilih tindakan berikutnya.

## Housekeeping — S04

Target `app/pages/staff/housekeeping.vue`, `app/components/staff/HousekeepingRoomCard.vue` (baru bila perlu), operations adapters dan unit transition fixture tests.

- [ ] Board ringkas per room number/floor, legend tujuh cleanliness status; toggle board/list; room type/floor/status filter, reset dan jumlah **hasil filter**.
- [ ] Selected room outline + detail status/current booking jika role berhak/notes/updated_by/updated_at. Card bukan draggable mutation: pilih lalu aksi jelas.
- [ ] Pilihan transition mengikuti state machine source; dirty→cleaning→vacant_clean→inspected sebagai jalur umum, recovery states juga tersedia sesuai permission. Receptionist read-only; OOO hanya dedicated GM flow.
- [ ] Review perubahan status sebelum submit bila berdampak readiness/occupancy; notes dan before→after; jangan mengizinkan manual occupancy change seolah check-in booking telah terjadi tanpa product contract.
- [ ] `INVALID_STATUS_TRANSITION` refresh room dan pertahankan notes; `UNAUTHORIZED_TRANSITION`/403 tampil denied; tidak auto retry write.
- [ ] OOO review nomor/tipe/rentang [start,end), jumlah malam dan alasan. Preview lokal tidak menyatakan jumlah inventory final; live tetap locked ST-C06. Restore maintenance tidak dibuat sebagai generic “undo”.

Acceptance: filtered total tidak diberi label 95 kamar properti; scroll/focus tidak reset saat refresh; request filter lama dibatalkan/diabaikan; changing room dengan notes kotor punya guard. Lost update/version guarantee tetap menunggu CAS BE (ST-C07); refresh saja bukan concurrency protection.

## Stay — S05

Target `app/pages/staff/bookings/[id]/stay.vue`, `StayReviewPanel.vue` (baru bila dipakai lebih dari sekali), booking read mapper, operations clients/types.

- [ ] Booking context dari staff GET: status, dates, rooms/count, guest bila permitted; history list terpisah error state. Direct URL tidak bergantung state roster sebelumnya.
- [ ] Pisah room move dan extension; review drawer/step dengan stable snapshot, alasan/catatan, booking ID dan current→target room.
- [ ] Board inspected adalah kandidat kesiapan, bukan jaminan bebas/kompatibel; backend `TARGET_ROOM_NOT_READY`, `ROOM_PHYSICAL_OVERLAP`, `INVALID_BOOKING_STATUS` tetap otoritatif.
- [ ] Booking multi-room tidak diringkas menjadi “kamar saat ini” tunggal; current BE move input tidak memilih source assignment. Lock scope ambiguous dan minta amendment BE untuk multi-room source selection sebelum live action.
- [ ] Extension 1–30 malam, before/after dates; sample estimate berlabel simulasi. Live preview authoritative ST-C08 diperlukan sebelum commit; angka returned mutation tidak digunakan sebagai pre-confirmation quote.
- [ ] Tidak melabel `payment_method` sebagai payment captured; tidak membuat payment URL/refund dari response extension. Live extension gate berdiri sendiri.
- [ ] Refresh gagal setelah mutation berhasil menampilkan “aksi tersimpan, data terbaru belum dimuat”, bukan tombol ulang mutation. Timeout menjadi unknown outcome dan read recovery.

Acceptance: direct entry/session expired, stale candidate, room overlap, invalid booking, missing history, multi-room ambiguity dan extension quote unavailable tercakup tes; successful action refresh scopes yang tepat. No optimistic success untuk stock/assignment mutation.
