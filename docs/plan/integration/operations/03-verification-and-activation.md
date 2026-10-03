# Verifikasi dan activation OPS

Dokumen ini adalah acceptance plan, bukan hasil test. Evidence per checkpoint memuat FE SHA, BE source/deploy SHA, migrations, mode provider, command/result, expected/actual, dan screenshot bila UI.

## Checks implementasi

Setiap checkpoint code: `npm run typecheck`, `npm run lint`, unit/contract tests terkait, `npm run build`; E2E flow terkait bila halaman berubah. Final OPS-QA menjalankan `npm run test:unit` dan `npm run test:e2e` seluruh suite. Dokumen saja cukup link/reference/status consistency validation; tidak menjalankan ulang aplikasi untuk perubahan docs.

## Matriks skenario

| ID | Skenario | Mode/bukti wajib |
|---|---|---|
| QA-01 | Default API config: seluruh direct staff GET/POST/PUT ditolak dan tidak ada upstream call | BFF contract test |
| QA-02 | Mock preview explicit; API failure tidak fallback sample | Unit + browser |
| QA-03 | Guest refund empty/partial/multiple/pending/failed/unknown dan unavailable | Fixture + UI |
| QA-04 | Dua guest sessions: owner200/non-owner404; logout removes data; actor/token redacted | Contract; kemudian current BE connected |
| QA-05 | HK filtered summary, tujuh statuses, missing room, transition409 | Mock/unit; connected setelah gate |
| QA-06 | OOO date end eksklusif, duplicate submit guard, timeout outcome_unknown | Contract/UI; DB atomic/retry proof BE sebelum activation |
| QA-07 | Roster date switch response race, no arrivals/departures, metrics server | Mock/unit + browser |
| QA-08 | Handover total/pages, empty notes, cash validation, append/timeout | Mock/contract; actor/duplicate proof connected |
| QA-09 | Move same-room, invalid reason/status, readiness/overlap409, history | Mock/contract; assignments/DB proof connected |
| QA-10 | Extension 1/30 boundary, 0/31 reject, dates, cost unknown, availability409 | Mock/unit; authoritative price/payment proof sebelum activation |
| QA-11 | Finance limited list count, pending201, over-refund409, gateway502, unknown timeout | Mock/contract; provider/ledger proof connected |
| QA-12 | Resolve result tidak mengklaim actual refund/realocation | UI copy + contract |
| QA-13 | SSR/private isolation, stale response setelah logout/nav, text escape, cross-origin mutation denied | BFF/unit/browser |
| QA-14 | Keyboard tabs/dialog trap/Escape/return focus/error announcements; 360px/768px/desktop | Browser inspection + screenshot |
| QA-15 | Capability dimatikan saat halaman terbuka: BFF menolak tanpa side effect | Contract + later connected |

Browser evidence dilakukan dengan fixture aman. Physical Android/iOS dan screen-reader aktual dicatat terpisah NOT_RUN sampai benar-benar diuji; desktop screenshot tidak menggantikan device acceptance.

## Handoff sebelum connected

BE menyediakan environment uji terisolasi, build identity dan migration version, trusted staff session transport/lifecycle/permission matrix, guest accounts/booking IDs, fixture room/inventory/cases, provider mode, DTO success/error, serta cleanup. Local `18080` sebelumnya memberi route baru404; probe ulang setelah rebuild. BFF contract server proof berbeda dari connected Go proof.

Mutation test harus menggunakan isolated DB/inventory dan provider sandbox tanpa uang nyata. Tentukan resources/cleanup sebelum test. Gunakan acceptance proof BE untuk locking/rollback; browser response200 tidak membuktikan atomicity. Jangan menjalankan shared truncate fixture suite terhadap DB operasional.

## Activation dan rollback

1. Refresh audit auth staff: forged role/header harus gagal, expired/revoked session gagal, scope/permissions verified. Tidak ada bypass deployment.
2. Aktifkan staff reads per capability setelah ownership/PII/no-store/SSR tests dan current deployment proof.
3. Aktifkan handover/status/move hanya setelah masing-masing invariant dan conflict/retry decision tersedia. OOO/extension/refunds/resolve tetap off jika acceptance khusus belum terpenuhi.
4. Rekam accepted capability, owner, FE/BE SHA, evidence dan feature flags; update local tracker serta aggregate F07/F08/F14.
5. Rollback mematikan capability server dan menolak direct request. Refresh UI memperlihatkan disabled reason. Request in-flight mungkin sudah diproses: lakukan read/reconcile, jangan memutar balik ledger/stock melalui UI atau mengulang POST.

## Definition of done

UI_DONE: screens/states/accessibility/mock scenarios lulus. CONTRACT_VERIFIED: request/response/error mapping dan BFF gates lulus dengan fixture source-compatible. CONNECTED_VERIFIED: trusted identity dan actual deployment resource effects lulus untuk capability terpilih. Production activation bukan target otomatis dari paket ini; ditentukan melalui scoped acceptance di atas. Tidak ada silent FAIL/SKIP yang diberi status PASS.
