# Room move dan extend stay — ST

Owner F07 subset/M4. Tasks ST-01–04. Referensi [handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/stay_handler.go), [service](/mnt/code/projects/jobs/pulang/current-booking/internal/stay/service.go), [store](/mnt/code/projects/jobs/pulang/current-booking/internal/stay/postgres.go).

## Screen dan context

`/staff/bookings/:id/stay` memuat booking context dan room-move history, lalu dua actions terpisah. Mock fixture memuat confirmed/checked_in/checked_out dan current room. Source booking GET tersedia untuk staff tetapi live memerlukan trusted auth. Roster/history saja tidak cukup membentuk seluruh booking context; mapping current room/detail harus cocok response actual ketika integration diaktifkan.

## Room move

Flow: pilih target room → pilih maintenance_defect/noise_complaint/upgrade/guest_request → notes → review room/date/reason → submit → hasil server dan refresh context/history/board. Target room board hanya kandidat; inspected belum menjamin bebas sepanjang stay. Same-room ditolak; move hanya checked_in menurut store. Unknown booking/status, target not ready dan physical overlap dibedakan.

Mock happy path menggunakan satu kamar. Booking multi-room tidak ditawarkan live move sampai source selection/current assignment semantics disepakati; jangan diam-diam memilih assignment pertama. Upgrade lintas tipe memerlukan keputusan pricing/inventory; jangan menjanjikan gratis atau adjustment otomatis.

## Extension

Input additional_nights 1–30; render tanggal checkout baru dengan arithmetic kalender. Booking confirmed atau checked_in adalah candidate sesuai service, tetapi server final authority. Source POST mengembalikan tambahan biaya setelah perubahan; preview endpoint tidak ada. Mock review boleh menampilkan fixture estimate berlabel sample. Live activation membutuhkan server preview/price consent contract atau keputusan workflow yang jelas sebelum mutasi.

Field payment_method belum dipakai oleh service/store yang ditinjau. Form production tidak boleh menyatakan cash/payment berhasil. Payment status absent berarti belum diketahui, bukan paid. Result menampilkan dates dan amounts authoritative; extension tidak membuat invoice/pay link baru di FE.

404 BOOKING_NOT_FOUND; 400 INVALID_ADDITIONAL_NIGHTS/INVALID_REASON/INVALID_INPUT; 409 INVALID_BOOKING_STATUS/TARGET_ROOM_NOT_READY/ROOM_PHYSICAL_OVERLAP/NO_AVAILABILITY_FOR_EXTENSION memuat alasan dan refresh. Timeout setelah POST menjadi outcome_unknown: refresh detail/history, jangan POST ulang otomatis. Extension tidak memiliki history endpoint khusus atau idempotency contract yang dapat dipakai FE untuk membuktikan retry aman.

## File target

`app/pages/staff/bookings/[id]/stay.vue`; components `RoomMoveDialog.vue`, `ExtendStayDialog.vue`, `RoomMoveHistory.vue`; operations DTO/client/fixtures; explicit BFF move/extension/history routes serta gated staff booking context GET jika diperlukan. Reuse date/money helpers; mutation body tidak memuat actor role/user ID.

## TODO dan acceptance

- [ ] ST-01: booking context, candidate rooms, reason validation, history order/empty/error, move mock success/conflicts.
- [ ] ST-02: extension nights/calendar, mock review/result, cost unknown state, invalid status, availability conflict, payment unknown copy.
- [ ] ST-03: body allowlist, role/capability server checks, no automatic POST retry, history/context stale guards, modal focus tests.
- [ ] ST-04: isolated trusted staff tests; room assignments/GiST/history proof; extension stock/date/price proof; unknown outcome recovery; multi-room scope acknowledged.

Done now = mock workflow + adapters/contracts + blocked live BFF. Live move and live extension memiliki gate terpisah; extension tetap disabled walau move sudah memenuhi acceptance.
