PRD: Website Portofolio Fotografer - Lensa Arsya
Versi: 1.0 — Draf untuk dieksekusi via Antigravity Status: Siap dikembangkan (asumsi & pertanyaan terbuka ada di bagian akhir)

1. Ringkasan
Website fullstack untuk fotografer, berisi katalog portofolio yang bisa difilter per tema, tombol kontak WhatsApp dengan pesan otomatis, halaman harga/paket, dan dashboard admin agar pemilik bisa mengelola katalog & harga sendiri tanpa bantuan developer.

2. Tujuan
Jadi etalase digital yang meningkatkan kepercayaan calon klien
Mempermudah calon klien menjelajah portofolio berdasarkan jenis layanan (tema)
Mempercepat konversi pengunjung menjadi chat WhatsApp
Admin bisa mandiri mengelola foto, kategori, dan harga
3. Target Pengguna
Peran	Kebutuhan utama
Pengunjung / calon klien	Lihat portofolio, filter tema, cek harga, kontak cepat
Admin / pemilik	Upload & atur foto, kelola tema, kelola paket harga
4. Ruang Lingkup
In-scope (Fase 1)

Halaman publik: Beranda, Portofolio (dengan filter tema), Tentang, Harga & Paket
Tombol WA (floating + kontekstual per tema) dengan teks otomatis
Dashboard admin: login, CRUD foto, kelola tema, kelola paket harga
Desain responsif (mobile-first) & SEO dasar
Out-of-scope (dicatat sebagai Fase 2, lihat bagian 12)

Galeri privat berpassword
Booking/kalender ketersediaan, pembayaran online
Multi-admin/role, integrasi feed Instagram otomatis
5. Peta Situs
Beranda — hero, highlight foto terbaik, CTA WA, ringkasan layanan
Portofolio/Katalog — grid foto, filter tema (default: All, plus Foto Produk, Wisuda, dst — dikelola dinamis dari admin)
Detail Foto — lightbox: gambar besar, deskripsi, navigasi ke foto berikutnya
Tentang — profil, gaya foto, pengalaman
Harga & Paket — daftar paket per tema/layanan dengan CTA WA per paket
Login Admin → Dashboard Admin
6. Functional Requirements
6.1 Halaman Publik
Katalog menampilkan grid foto (thumbnail + judul singkat)
Filter tema berupa tab/chip; default state = "All"
Tema bersifat dinamis: kategori baru yang dibuat admin otomatis muncul sebagai filter
Klik foto → lightbox (gambar penuh + deskripsi + tombol WA "tanya soal foto ini")
Tombol WA mengambang di semua halaman, membuka https://wa.me/6288902809479?text=<pesan-otomatis>
Teks WA otomatis menyesuaikan konteks, contoh:
Umum: "Halo Lensa Arsya, saya tertarik dengan jasa foto Anda."
Dari tema tertentu: "Halo Lensa Arsya, saya tertarik dengan tema {NamaTema}."
Dari halaman harga (klik tombol tiap paket, misal "Pilih Standar"): "Halo Lensa Arsya, Saya ingin memesan *{NamaPaket} ({Harga})*. Bisa minta info lebih lanjut?" (Catatan: teks di dalam tanda * akan bercetak tebal di WA).
Halaman Harga menampilkan kartu paket (Standar, Menengah, Premium, Eksklusif) berisi nama, harga, fitur, dan tombol CTA WA spesifik paket.
Di bagian bawah (footer/halaman akhir) terdapat seksi "Punya pertanyaan atau custom request?" yang berisi:
- Link ke WhatsApp: 0889 0280 9479 (mengarahkan ke WA)
- Link ke Email: crewlensaarsya@gmail.com (mengarahkan ke aplikasi email)
6.2 Dashboard Admin & Akses Subdomain
- Akses Eksklusif Subdomain: Dashboard admin hanya dapat diakses melalui subdomain `admin.<domain>` (misal: `admin.lensaarsya.com` atau `admin.localhost:3000` di lingkungan lokal).
- Zero Public Footprint: Tidak ada tombol/link login atau admin di website utama. Jika URL `/admin` atau `/login` dibuka di domain utama, sistem otomatis mengarahkan (redirect) pengunjung kembali ke halaman beranda (`/`).
- Autentikasi NextAuth.js: Login terproteksi menggunakan sesi NextAuth.js dengan password terenkripsi (bcryptjs).
- Kelola Foto: Upload foto (staged upload ke Cloudinary), edit judul/deskripsi/kategori, hapus, atur urutan tampil.
- Kelola Tema/Kategori: Tambah, edit, dan hapus kategori dinamis yang langsung tersinkron ke filter galeri publik.
- Kelola Paket Harga: Tambah/edit/hapus paket harga & fitur yang otomatis tampil di halaman Harga.
- Pemantauan Database: Status koneksi Vercel Postgres real-time dan jumlah baris data.

7. Model Data (Vercel Postgres & Drizzle ORM)
Database menggunakan Vercel Postgres (PostgreSQL / Neon) dengan skema Drizzle ORM:
- Tabel "users": id (PK), name, email, username (unique), password (bcrypt hash), role ('admin'), created_at, updated_at
- Tabel "categories": id (PK), name (unique), created_at
- Tabel "packages": id (PK), name, price, tagline, popular (boolean), features (JSON array), created_at
- Tabel "photos": id (PK), title, description, image_url, category, sort_order (int), created_at
*Catatan: Sistem dilengkapi auto-seed: jika tabel masih kosong saat pertama kali diakses, sistem akan otomatis menginisialisasi akun admin default dan data awal Lensa Arsya.*

8. Non-Functional Requirements
Performa: lazy-loading gambar, kompresi/optimasi otomatis saat upload, target waktu muat < 3 detik
Responsif: mobile-first, karena mayoritas trafik diperkirakan dari HP
SEO: meta title/description per halaman, alt text foto, sitemap.xml
Keamanan: password admin di-hash bcrypt, proteksi rute middleware subdomain, session token JWT
Skalabilitas: foto disimpan di Cloudinary, database terkelola di Vercel Postgres

9. Tech Stack Terkonfirmasi
- Frontend: Next.js (React) + Tailwind CSS (App Router)
- Backend: Next.js API Routes & Server Actions
- Database: Vercel Postgres (Neon) + Drizzle ORM
- Autentikasi: NextAuth.js (Credentials Provider + bcryptjs)
- Routing Subdomain: Next.js Middleware (`admin.<domain>`)
- Storage Foto: Cloudinary (API URL: CLOUDINARY_URL=cloudinary://579251134143585:BmZI37AVN3AcZK8RhGL0wN1LJpo@ihfrcyan)
- Hosting: Vercel
10. Metrik Keberhasilan
Jumlah klik tombol WA (per halaman/tema)
Jumlah kunjungan katalog per tema
Waktu admin menambah 1 foto baru (target < 2 menit)
11. Asumsi
Semua konten (foto & teks) diunggah manual oleh admin — tidak ada auto-import dari Instagram di Fase 1
Bahasa website: Bahasa Indonesia
Satu studio/satu admin (bukan multi-tenant)
Tidak ada pembayaran online; transaksi lanjut manual via WA
12. Data yang Sudah Dikonfirmasi
Nama Brand: Lensa Arsya (terdapat referensi logo dengan teks "lensa. arsya more than what you see")
Nomor WA Resmi: 0889 0280 9479
Email Resmi: crewlensaarsya@gmail.com
Paket Harga Umum:
1. Standar (Rp 150.000)
   - semua foto via google drive
   - pengiriman file digital cepat
   - file mentahan (tanpa edit)
2. Menengah (Rp 300.000)
   - semua foto via google drive
   - pengeditan foto lanjutan (retouch & color grading)
   - pengiriman file digital cepat
3. Premium [Paling Diminati] (Rp 500.000)
   - semua foto via google drive
   - video singkat (highlight/Reels)
   - pengiriman file digital cepat
   - prioritas pengerjaan
4. Ekslusif (Rp 800.000)
   - sesi dokumentasi intensif 2 jam
   - video sinematik rangkaian acara
   - master file & hasil edit digital
   - bebas request konsep
Gaya Visual: Desain modern, menarik, profesional, berwarna, dan atraktif (tidak hitam putih melainkan menggunakan estetika modern yang cocok untuk fotografi).
Kategori Awal: Foto Produk dan Wisuda (kategori ini bersifat dinamis, nantinya admin bisa menambah atau menghapus via dashboard).
Analitik (Google Analytics): Tidak diperlukan.

13. Roadmap Fase 2 (opsional, di luar scope awal)
Galeri privat berpassword per klien
Blog/artikel untuk SEO
Booking/kalender ketersediaan jadwal
Multi-admin/role tim
Watermark otomatis pada foto
Integrasi feed Instagram otomatis