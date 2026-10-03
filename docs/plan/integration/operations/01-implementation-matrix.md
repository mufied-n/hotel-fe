# Matriks implementasi dan integrasi

Upstream snapshot `09bc727`; seluruh path BFF di bawah adalah target FE kecuali guest refund yang sudah ada. GET staff tetap gated auth. READY_CONTRACT berarti source kontrak tersedia, bukan connected/live verified.

| Capability/UI | Upstream aktual | BFF target | Payload/query → response | Pekerjaan sekarang | Activation |
|---|---|---|---|---|---|
| Guest refund, `/booking/my/:id` | GET `/api/v1/guest/bookings/{id}/refund-status` | GET `/api/bff/guest/bookings/{id}/refund-status` existing | Session → booking_id, has_refund, refunds[] | Reuse route; error states, redaction/view model, tests | Guest session + current deployment ownership proof |
| HK board, `/staff/housekeeping` | GET `/api/v1/housekeeping/rooms` | GET `/api/bff/staff/housekeeping/rooms` | floor/status/room_type_id → total_rooms, summary, rooms[] | DTO, adapter, mock board, disabled BFF | Trusted staff read |
| HK status dialog | PUT `/api/v1/housekeeping/rooms/{id}/status` | PUT `/api/bff/staff/housekeeping/rooms/{id}/status` | to_status, notes → status, room_number, cleanliness_status, updated_at | Mock flow + gate test | Trusted permission + transition/concurrency acceptance |
| Out-of-order dialog | POST `/api/v1/housekeeping/rooms/{id}/out-of-order` | POST `/api/bff/staff/housekeeping/rooms/{id}/out-of-order` | start_date, end_date, reason → status, room_number, cleanliness_status, inventory_deducted_dates | Mock flow; exclusive end date | Trusted GM + atomicity/retry/restore scope |
| Roster, `/staff/front-desk` | GET `/api/v1/front-desk/daily-roster` | GET `/api/bff/staff/front-desk/daily-roster` | date → date, metrics, expected_arrivals, expected_departures, in_house_count | Mock UI + mapping | Trusted staff read |
| Handover, `/staff/front-desk/handover` | GET `/api/v1/front-desk/handover-notes` | GET `/api/bff/staff/front-desk/handover-notes` | limit, offset → total, notes[] | Pagination/filter state | Trusted staff read |
| Handover form | POST `/api/v1/front-desk/handover-notes` | POST `/api/bff/staff/front-desk/handover-notes` | shift, cash_float_minor, pending_issues, vip_guest_notes → status, note | Mock append + dialog | Trusted permission + duplicate outcome policy |
| Move, `/staff/bookings/:id/stay` | POST `/api/v1/bookings/{id}/room-move` | POST `/api/bff/staff/bookings/{id}/room-move` | target_room_number, reason_category, notes → status, booking_id, previous_room_number, new_room_number, move_date, message | Mock form/history/error mapping | Trusted permission + room eligibility/multi-room proof |
| Extension form | POST `/api/v1/bookings/{id}/extend-stay` | POST `/api/bff/staff/bookings/{id}/extend-stay` | additional_nights, payment_method → previous/new_check_out, additional_nights, additional_amount_minor, new_total_price_minor, payment_status? | Mock review/result; no live price promise | Trusted permission + price/payment/retry decision |
| Room-move history | GET `/api/v1/bookings/{id}/room-moves` | GET `/api/bff/staff/bookings/{id}/room-moves` | ID → booking_id, moves[] | Mock history + mapper | Trusted staff read |
| Finance, `/staff/finance` | GET `/api/v1/finance/reconciliations` | GET `/api/bff/staff/finance/reconciliations` | → total_settled_minor, total_refunded_minor, net_captured_minor, open_cases_count, total_refunds_count | Mock summary | Trusted finance read |
| Cases, `/staff/finance/cases` | GET `/api/v1/finance/cases` | GET `/api/bff/staff/finance/cases` | status, limit → total, cases[] | List/details; no invented pagination | Trusted finance read |
| Resolve dialog | POST `/api/v1/finance/cases/{id}/resolve` | POST `/api/bff/staff/finance/cases/{id}/resolve` | action, notes → status, message | Mock recording resolution | Trusted permission + validated action semantics |
| Refund, `/staff/finance/refunds` | POST `/api/v1/finance/refunds` | POST `/api/bff/staff/finance/refunds` | booking_id, amount_minor, reason → status, refund | Mock form/result | Trusted finance + refund invariant/provider proof |

## Limits source yang wajib dipertahankan

- HK `total_rooms` dan summary dihitung dari rooms setelah filter; jangan label angka itu sebagai total seluruh hotel. ID path HK adalah nomor kamar, bukan UUID; jangan memakai validator booking UUID untuk room number.
- Roster memiliki arrivals/departures dan in_house_count, tanpa daftar lengkap in-house atau general booking search. Tabel tidak boleh mengarang record dari count.
- Handover GET memiliki total dan offset; finance cases total adalah panjang response saat ini, bukan keseluruhan database. Jangan membuat pager total finance dari field tersebut.
- Room board candidate bukan bukti kamar bebas sepanjang tanggal; server tetap authority overlap/readiness. Source extension menerima 1–30 malam, tetapi belum menyediakan preview quote endpoint.
- `payment_method` extension diterima handler tetapi tidak digunakan oleh service/store path yang ditinjau; jangan mengklaim pembayaran tercatat. `ResolveCase` mencatat resolusi store, bukan memanggil ProcessRefund atau alokasi kamar.
- Guest refund response memakai model PaymentRefund lengkap termasuk actor/provider metadata. BFF/view model harus hanya mengirim field yang diperlukan tamu; reason tampil sebagai teks biasa dan ditinjau agar internal notes tidak tersalin ke publik.

## Authority referensi

[Router](/mnt/code/projects/jobs/pulang/current-booking/internal/api/router.go), [HK handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/housekeeping_handler.go), [front desk handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/frontdesk_handler.go), [stay handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/stay_handler.go), [finance handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/finance_handler.go), serta model/service dalam package yang sama. Perubahan source selama eksekusi memperbarui baris terkena sebelum adapter diaktifkan.
