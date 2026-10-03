# OPS mock workspace implementation evidence

Tanggal: 3 Oktober 2026. FE baseline sebelum perubahan: `7fdf87d`. Backend source contract: `09bc727`; connected deployment belum digunakan. Scope: guest refund hardening serta mock workspace housekeeping, front desk/handover, stay operations dan finance.

## Implementasi

- Guest refund dipisah dari load detail; empty/loading/error/unknown status dan retry tampil eksplisit. BFF memetakan allowlist guest dan membuang actor/provider metadata.
- Staff shell dan mode `operationsMode` ditambah. Default mock menampilkan label sample; API mode memakai client terpisah.
- Sample housekeeping memiliki filter/summary/status/OOO forms. Front desk memiliki roster dan handover. Stay memiliki room move/history/extension. Finance memiliki reconciliation/cases/resolve/refund review.
- Seluruh `/api/bff/staff/**` dikunci server-side dengan `CAPABILITY_DISABLED` 503. Mutation tetap melewati CSRF/origin guard sebelum capability denial. Tidak ada role-string atau request ke backend staff.
- Fixtures anonim dan deterministik; sample state tidak persisten setelah client/page baru. UI tidak mengklaim extension payment, resolve side effect, refundable balance, provider completion atau global case total yang tidak ada.

## Evidence

| Check | Hasil |
|---|---|
| `npm run typecheck` | PASS; warning plugin Volar existing/nonfatal |
| `npm run lint` | PASS |
| `npm run test:unit` | PASS, 6 files / 19 tests |
| `npm run build` | PASS |
| Chromium E2E existing + OPS | PASS, 6/6 scenarios |
| Manual local visual inspection | Housekeeping mobile viewport rendered; sample banner, filters, counts and cards visible |

Target connected RF-04/HK-04/FD-04/ST-04/FIN-04 tetap WAITING_BE trusted staff auth/current deployment dan acceptance invariant masing-masing. Device Android/iOS serta screen reader actual NOT_RUN.
