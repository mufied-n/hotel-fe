# FE-03 — guest details, review dan submit demo

Status IMPLEMENTED FOR LOCAL DEMO (3 Oktober 2026). Depends FE-02. Integration blocked oleh BE-G05–G15. Guest form, policy review, dan one-submit simulation tersedia tanpa mutation backend.

## Route / target files

`/booking/guest`, `/booking/review`. Files: `pages/booking/guest.vue`, `review.vue`, `BookingSteps.vue`, `BookingSummary.vue`, `PriceBreakdown.vue`, `FormField.vue`, `PolicyAccordion.vue`, `useBookingDraft.ts`, client mock.

Flow label: Pilih kamar → Detail tamu → Tinjau & bayar → Status. Summary desktop sticky; mobile collapsible dengan total tetap terbaca. Bar bawah tidak menimpa primary CTA.

## TODO

- [ ] Guard route: guest/review tanpa selectedQuote diarahkan results/search. Refresh yang kehilangan in-memory draft meminta pemilihan ulang secara jelas.
- [ ] Nama dan email wajib; phone hanya jika scope contact disepakati. Field error dekat field, error summary dan focus pada invalid pertama. Jangan menganggap validasi FE menggantikan BE.
- [ ] Special request max 500 karakter, counter, Unicode; copy permintaan bergantung availability, bukan guarantee.
- [ ] Review memuat dates/nights/rooms/adults/children, variant/bed, rate/breakfast, benefit per rate, discount, final total, included charges, check-in/out, contacts.
- [ ] Non-cancellable/non-modifiable/no-show 100% dan pay-now terlihat sebelum CTA; terms/privacy dapat dibaca. Consent terpisah, default unchecked, tidak dipilih otomatis.
- [ ] Edit dates/room/rate kembali ke step terkait dan invalidate quote; edit guest tidak perlu search ulang.
- [ ] Demo CTA “Simulasikan pembayaran”; badge demo konsisten. Submit mock membuat `demo-*` ID dan state pending; tidak membuka payment URL live.
- [ ] Double submit dicegah dengan pending state; mock idempotency key stabil untuk satu attempt. Retry network mempertahankan key, bukan create attempt baru otomatis.
- [ ] Quote expired/price changed/sold-out saat submit menghasilkan actionable error dan kembali review/search; data guest tetap in-memory selama navigasi aman.
- [ ] Tidak persist guest details di URL/localStorage/analytics; clear draft setelah reset demo.

## Acceptance

- [ ] Happy path demo dan validation paths dapat dinavigasi via keyboard.
- [ ] Consent required, disabled/loading tombol, double-click, server error simulation, stale quote dan back/edit tidak membuat summary inkonsisten.
- [ ] Review total sama persis fixture quote; UI tidak menambah included tax/service lagi.
- [ ] Status pending sesudah submit tidak disebut booking confirmed atau email sent.
