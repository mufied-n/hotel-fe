# F04 — Receipt, print dan kalender hardening

Tasks CMP-04-*; baseline receipt UI/BFF/ICS existing. Scope memperbaiki kualitas dan tests, tanpa membuat server PDF/invoice pajak feature baru.

## Journey

Guest private booking → receipt ready/loading/error/unavailable → browser print atau ICS download. Receipt totals/policy/stay/payment berasal server snapshot. Receipt inaccessible bagi non-owner; session expired ke login returnTo internal. Pembatalan/booking state yang tidak memenuhi artifact guard tidak dipaksa menjadi invoice success.

## Print dan download

Inspect mobile dan desktop, browser print preview/A4 long content: hotel/contact, booking reference, guest/stay, room item, breakdown, payment/policies terbaca dan tidak terpotong. @media print hides navigation/demo/actions; page break rules avoid splitting essential rows; panjang guest/request text wraps. Nama artifact dan date/timezone benar. Browser Save PDF disebut hasil browser, bukan PDF generated BE.

ICS memakai existing binary passthrough; Content-Type/text/calendar, Content-Disposition, timezone/check-in/out di file sesuai contract. Empty/bad upstream body bukan successful download. Privacy cache no-store; request session dari BFF, no query token.

## File/TODO

- [ ] CMP-04-UI: inspect/update receipt print CSS dan download disabled/loading/error fallback; perbaiki wrap/page break.
- [ ] CMP-04-API: verify receipt money/status mapper, header ICS, session/no-store; unknown currencies/status handled without reinterpreting payment.
- [ ] CMP-04-QA: long-name/note, zero breakfast, discount/tax totals, cancelled/404,401,503 flag disabled, binary calendar and print PDF render inspection.
- [ ] CMP-04-LIVE: guest ownership connected + receipt/ICS snapshot consistency; output proof labeled environment/provider mode.

Target existing app/pages/booking/my/[id]/receipt.vue; server guest receipt/calendar routes, DTO/helpers dan tests. Evidence: screenshot receipt mobile/desktop, rendered print pages and named assertions. Server-generated QR validation/payment evidence di luar scope kecuali contract tersedia; QR payload bukan payment proof.
