# FE-01 — foundation Nuxt dan design system

Status IMPLEMENTED FOR BOOKING WEBAPP (3 Oktober 2026). Depends FE-00. Sumber visual: [hasil ekstraksi resmi](../../research/official-design-system.md). Landing, Rooms marketing, dan FAQ dikeluarkan atas arahan owner; logo/font/foto resmi masih menunggu handoff.

## Target file / tugas

| File | TODO |
|---|---|
| `package.json`, lockfile, `nuxt.config.ts` | Nuxt 4 + TypeScript, scripts dev/build/typecheck/lint; dependency version dipin saat bootstrap |
| `app/app.vue`, `layouts/default.vue`, `layouts/booking.vue` | NuxtLayout/NuxtPage, marketing shell vs compact checkout shell |
| `app/assets/css/tokens.css` | Brand #F58132/#000/#fff, proposed field/status tokens; documented font fallback |
| `app/assets/css/base.css` | Font weights, headings/body, focus, reduced-motion, safe-area, reset |
| `components/brand/*` | Logo header, footer, pill button, mobile action bar |
| `components/ui/*` | Fields/errors, dialog/drawer, accordion, alert |
| `pages/index.vue`, `rooms/index.vue`, `faqs.vue` | Entry preview ke booking, room catalogue fixture, policy/help |
| `public/brand/*`, `public/rooms/*` | Asset handoff/manifest; local files, alt, aspect ratio dan attribution provenance |

- [ ] Periksa assets project terlebih dahulu; gunakan file resmi yang diberikan untuk logo/media. Bila belum tersedia, tandai placeholder, bukan fabricate branding atau hotlink `_next` assets.
- [ ] Helvetica Now/Montrose declared di web tetapi computed style observed system font. Binding font baru harus explicit dan verified; fallback tidak dianggap fidelity final.
- [ ] Card editorial radius 32px; field 12px proposal; primary label black-on-orange. Min hit area 44px meskipun pill visual kecil.
- [ ] Mobile satu kolom; desktop room editorial dua kolom. Booking layout max 1280px proposal; breakpoints 768/1024 proposal.
- [ ] Header/footer dan action bar safe-area tidak menutup content, focus target atau keyboard. Dialog memiliki Escape/focus trap/restore; gallery keyboard dan alt.
- [ ] Default tanpa component theme framework yang mengubah brand; gunakan native inputs + CSS/Vue primitives. Calendar primitive hanya ditambah bila diperlukan untuk navigasi tanggal aksesibel.
- [ ] Reveal ringan 140–300ms, tidak menunda transaksi. Reduced motion menonaktifkan transform/autoplay.

## Acceptance

- [ ] Tokens digunakan konsisten; visual dibandingkan screenshot official, bukan Book Secure template.
- [ ] Build/typecheck/lint lulus; halaman basic tidak hydration warning.
- [ ] At 360/390/768/1440px tidak horizontal overflow; 200% zoom readable; focus ring jelas semua theme.
- [ ] Jika aset/font belum tersedia, catat fidelity limitation sebelum FE-05.
