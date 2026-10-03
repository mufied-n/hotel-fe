# Front desk roster dan handover — FD

Owner F07 subset/M4. Tasks FD-01–04. Referensi [handler](/mnt/code/projects/jobs/pulang/current-booking/internal/api/frontdesk_handler.go), [model](/mnt/code/projects/jobs/pulang/current-booking/internal/frontdesk/model.go).

## Screen dan flow

`/staff/front-desk` menampilkan tanggal operasional eksplisit Asia/Jakarta, metrics server, expected arrivals, expected departures dan in-house count. Tabel arrivals memuat guest, type, room quantity, assigned rooms, guests, ETA dan requests di detail. Departures memuat room numbers dan dates. Link booking mengarah `/staff/bookings/:id/stay`; booking ID divalidasi. Tidak membuat daftar in-house dari count atau general worklist lintas tanggal yang belum tersedia.

`/staff/front-desk/handover` menampilkan history terbaru, limit/offset pager, shift dan detail note. Form shift morning/afternoon/night, cash_float_minor integer nonnegative sebagai batas UX, pending_issues dan vip_guest_notes. Minimal satu note bermakna sesuai service; client trim tanpa menghilangkan isi. Label WIB, currency IDR, empty note fields tidak diberi placeholder seolah data actual.

Review dialog menampilkan shift/cash/note dan dampak append-only. Success memakai returned note lalu refresh history; jangan hanya increment total secara optimistic. Tidak membuat edit/delete feature. Timeout mempertahankan draft dan meminta cek history sebelum submit baru; similarity note bukan bukti dedup server.

## File target dan contract

`app/pages/staff/front-desk/index.vue`, `handover.vue`; components `{RosterMetrics,ArrivalList,DepartureList,HandoverForm,HandoverHistory}.vue`; operations client/DTO; GET roster, GET/POST handover BFF. Query date explicit; response date diperiksa agar tidak menampilkan data tanggal lama. Handover total adalah total server, berbeda dari finance cases count.

## TODO dan acceptance

- [ ] FD-01: date picker, counts/occupancy, arrival/departure lists, no assignment state, no arrivals/departures, date-switch stale guard.
- [ ] FD-02: pagination/reset/filter UI, shift form/review, mock append and unknown outcome; accessible multiline notes.
- [ ] FD-03: date/limit/offset/cash validation; 400/401/403/503; permission UI mock; direct BFF capability denial and PII isolation tests.
- [ ] FD-04: trusted roles read/write sesuai Casbin policy snapshot, note actor verified server, history total/pages and append effects proven.

Activation handover mutation menunggu duplicate handling/unknown outcome contract serta trusted session. Roster default BE menggunakan UTC; FE selalu kirim date eksplisit. Tidak otomatis menambahkan check-in/out/no-show scope ke paket ini; bila perlu, follow-up memakai rencana F07 induk.
