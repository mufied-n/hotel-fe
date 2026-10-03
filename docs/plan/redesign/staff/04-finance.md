# ST-04 — Finance dan confirmation uang

Dependency ST-01–02; RD-S06. Owner FE finance; BE finance/payment untuk ST-C03–05. Status PLANNED. Target `app/pages/staff/finance/{index,cases,refunds}.vue`, operations types/client/adapters, `FinanceCaseDetail.vue` (baru bila diperlukan).

## Reconciliation

- [ ] Summary settled/refunded/net/open cases dari GET `/finance/reconciliations`; format integer money dengan currency, tabular numerals, zero bukan dash.
- [ ] Jelaskan agregasi global sesuai source; date range UI hanya boleh muncul setelah endpoint benar-benar mendukung periode. Tidak membuat trend/bar chart dengan angka sample di mode API.
- [ ] Timestamp refresh sukses dan stale indicator; refresh gagal mempertahankan snapshot sambil menunjukkan error. Export belum ditambahkan tanpa contract/source data jelas.

## Payment cases

- [ ] GET status+limit; total response adalah jumlah returned cases, bukan total seluruh kasus. Local search scope eksplisit, jangan pagination palsu/cursor fiktif.
- [ ] Table desktop/cards mobile: case type, amount+currency, reference, booking ID, status, age/time; selected detail drawer notes/action/resolved actor/time.
- [ ] Resolve review mengunci case ID dan action+notes. Dengan source sekarang copy **“Catat penyelesaian kasus”**; tidak menyatakan refund/reallocation dilakukan. `dismiss` tidak dilabel final dismissed jika BE mengembalikan resolved.
- [ ] BE action enum/semantics disepakati sebelum menawarkan opsi ambigu live. `CASE_ALREADY_RESOLVED` tampil conflict, refresh selected case tanpa menimpa notes draft.
- [ ] Finance tidak memanggil guest ownership endpoints untuk booking detail. Panel “detail booking belum tersedia untuk peran ini” jika diperlukan; jangan menampilkan cached PII dari user lain.

## Refund review

Flow target: pilih booking terverifikasi → baca balance/history → input nominal+reason → review → confirm → durable intent status. Kontrak balance/history/idempotency/recovery staff **belum tersedia**; UI sample dapat lengkap, live submit tetap locked.

- [ ] Review menampilkan booking, nominal+currency, alasan, saldo authoritative saat tersedia, existing pending/refund total, actor, dampak. Nilai tidak dapat berubah diam-diam selama dialog confirmation.
- [ ] Unit IDR mengikuti kontrak source/project formatter; tidak menambah perkalian/pembagian 100 tanpa kontrak currency. Nominal integer >0 dan reason ≥5, server tetap validasi.
- [ ] Busy spinner pada button, width stabil, anti double submit; dialog tidak menampilkan sukses sebelum response. `201` dengan refund pending tetap **“Refund diajukan/pending”**, succeeded baru status completed sesuai authoritative evidence.
- [ ] `BOOKING_NOT_PAID`, `OVER_REFUND_EXCEEDED`, `BOOKING_NOT_FOUND`, `GATEWAY_REFUND_FAILED` punya feedback berbeda. Gateway timeout tidak replay otomatis; tombol “Periksa status” memerlukan staff lookup intent, bukan mengirim refund baru.
- [ ] No background retry pada uang; after-submit refresh error tidak mengubah successful response menjadi failed submission. Sample success menyebut simulasi.

## Gate dan acceptance

Read summary/cases dapat diintegrasikan setelah session/env gate. Resolve write menunggu action contract dan per-role negative tests. Refund live menunggu reservation atomik, idempotency key/replay response, staff lookup/balance/history, uncertain gateway recovery, sandbox proof, gagal write setelah provider success dan concurrent over-refund tests (ST-C03–04).

- [ ] Tes raw BE finance envelopes/zero/large values/long refs; keyboard review cancel/focus return dan mobile semua informasi uang terbaca.
- [ ] Dua user/dua tab concurrent resolved conflict tercakup; refund replay/concurrent scenarios dibuktikan BE terisolasi sebelum activation.
- [ ] Tidak ada toast “dana kembali” untuk pending/timeout atau resolve action metadata.
