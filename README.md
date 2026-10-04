# PULANG booking demo

Webapp Nuxt 4 untuk prototype alur booking PULANG ke UTTARA. Root langsung membuka pencarian booking; tidak ada landing page atau marketing pages. Semua transaksi memakai fixture lokal dan tidak membuat reservasi, mengurangi stok, menghubungi backend/vendor, memproses pembayaran, atau mengirim email.

## Repositori Terkait

* **Frontend (Nuxt 4 Webapp):** [https://github.com/mufied-n/hotel-fe](https://github.com/mufied-n/hotel-fe)
* **Backend (Go API Service):** [https://github.com/mufied-n/hotel-be](https://github.com/mufied-n/hotel-be)

Frontend dapat dijalankan dalam mode offline mock atau terhubung langsung ke backend via BFF layer (`/api/bff`), dikonfigurasi melalui `NUXT_BACKEND_BASE_URL` dan `NUXT_PUBLIC_BOOKING_MODE=api` pada `.env`.

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

Aset foto resmi kamar dan hero telah terhubung secara dinamis via CDN resmi `pulangkeuttara.com` dengan fallback otomatis. Logo dan font brand resmi mengikuti spesifikasi editorial. Lihat [rencana dan batas implementasi](docs/plan/frontend/06-implementation-execution.md) serta [manifest aset](public/asset-manifest.json).
