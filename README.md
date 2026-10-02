# PULANG booking demo

Webapp Nuxt 4 untuk prototype alur booking PULANG ke UTTARA. Root langsung membuka pencarian booking; tidak ada landing page atau marketing pages. Semua transaksi memakai fixture lokal dan tidak membuat reservasi, mengurangi stok, menghubungi backend/vendor, memproses pembayaran, atau mengirim email.

## Menjalankan

```bash
npm install --cache /tmp/npm-cache-mimiking
npm run dev
```

Buka `/booking` untuk flow utama. Pada development, panel scenario tersedia di results dan status. Gunakan `OCTOBREAK` sebagai promo demo.

## Verifikasi

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Logo, font brand, dan foto kamar resmi masih menunggu handoff. Placeholder selalu diberi label. Lihat [rencana dan batas implementasi](docs/plan/frontend/06-implementation-execution.md).
