# Housekeeping board — HK

Owner F08 subset/M4. Tasks HK-01–04. Referensi [handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/housekeeping_handler.go), [model](/mnt/code/projects/jobs/pulang/current-booking/internal/housekeeping/model.go), [transition service](/mnt/code/projects/jobs/pulang/current-booking/internal/housekeeping/service.go).

## Screen dan data

Route `/staff/housekeeping`: status summary → floor/status/room-type filters → room cards mobile/table desktop → detail/status dialog. Response room_number adalah identifier; type/name/floor/status/notes/update metadata ditampilkan. Guest name/booking context hanya sample atau trusted read berizin. Angka total dan summary menggambarkan hasil filter, bukan tetap 95 kamar.

Tujuh status: vacant_dirty, cleaning, vacant_clean, inspected, occupied, out_of_service, out_of_order. Label Indonesian dan teks status selalu ada; warna hanya pelengkap. Board tidak menyatakan vacant_clean siap check-in karena readiness server memerlukan inspected.

## Forms dan transition

Status dialog menampilkan room/current/target/notes dan review sebelum submit. Transition options mengikuti source snapshot sebagai bantuan UX; server tetap authority dan 409 memicu refresh. Mock utama dirty→cleaning→clean→inspected. Include backward/invalid transition, occupied dan out-of-service. OOO memakai dialog khusus berisi start_date/end_date/reason; end_date eksklusif, jumlah malam jelas. Jangan lewat generic status selector untuk OOO karena status-only bukan inventory deduction proof.

Readonly API-disabled state mempertahankan alasan disabled. Mock submit mengubah fixture dan diberi simulasi. Live belum aktif. Tidak ada auto retry OOO/status setelah timeout; tampilkan outcome_unknown dan read ulang board. Restore OOO/maintenance schedule tidak ditambahkan sebagai sukses karena endpoint restore inventory eksplisit belum disepakati.

## File target

`app/pages/staff/housekeeping.vue`; `app/components/staff/housekeeping/{RoomBoard,RoomStatusDialog,OutOfOrderDialog}.vue`; shared operations DTO/client/fixtures; tiga BFF target di matriks. Boundary command input hanya to_status/notes atau dates/reason; actor tidak berasal dari client. Filter query validated; tidak meneruskan arbitrary query/headers.

## TODO dan acceptance

- [ ] HK-01: filter persistence aman tanpa PII, filtered summary, empty/error/stale refresh, sort room number yang konsisten.
- [ ] HK-02: mock transition/OOO dialogs dengan keyboard/focus return, date and notes validation, submit disabled/double-click guard.
- [ ] HK-03: mapper fixtures 7 statuses, unknown fallback, ID room encoding, 404/403/409/503, direct BFF disabled-before-network tests.
- [ ] HK-04: trusted read role matrix; update success dan illegal409; GM OOO atomic DB+inventory deduction/retry failure proof dari BE.

Activation write membutuhkan BE closure concurrency state update, OOO atomicity dan duplicate deduction; auth closure saja belum cukup. Connected smoke menggunakan isolated rooms/inventory dengan cleanup terencana. Bukti mock tidak menutup invariant database.
