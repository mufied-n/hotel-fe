# Dokumentasi redevelopment booking PULANG

Tanggal: 3 Oktober 2026 (Asia/Jakarta). Webapp demo sudah tersedia; implementasi API berikutnya direncanakan dalam paket integrasi. Source backend dikembangkan terpisah dan tidak diubah oleh pekerjaan dokumentasi FE ini.

## Mulai di sini

1. [Design system resmi dan adaptasi booking](research/official-design-system.md).
   Analisis lanjutan: [Landing resmi, identitas brand, UX, dan implikasi redesign](research/official-landing-ux-analysis.md), dengan bukti browser 3 Oktober 2026.
2. [Flow Book Secure dan matriks parity](research/booking-flow-parity.md).
3. [Register gap backend](/mnt/code/projects/jobs/pulang/current-booking/docs/gap/README.md).
4. [Rencana frontend Nuxt 4](plan/frontend/README.md).
5. [Rencana implementasi FE dan integrasi API](plan/integration/README.md): per fitur, task tracker, matriks API, dependency dan verification gates.
6. [Rencana redesign webapp](plan/redesign/README.md): identitas official, seluruh guest journey, konsistensi staff, urutan implementasi, dan QA. Status PLANNED; tidak mengaktifkan integrasi live.

## Otoritas sumber

Website resmi menjadi sumber identitas visual dan deskripsi kamar; Book Secure menjadi bukti perilaku publik yang terlihat pada satu pencarian. Source Go dan SQL menjadi sumber status implementasi backend. Dokumen desain backend menyatakan target, bukan bukti implementasi. Proposal API, token baru, dan mock UI dalam paket ini belum merupakan keputusan operasional hotel.

Snapshot harga/promo berlaku untuk pencarian 3–4 Oktober 2026, 1 kamar, 1 dewasa, tanpa anak, IDR, English. Jangan jadikan snapshot harga sebagai tarif produksi permanen.
