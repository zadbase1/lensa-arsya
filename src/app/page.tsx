"use client";

import { useState } from "react";
import Link from "next/link";

const highlights = [
  {
    src: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800&q=80",
    alt: "Foto Wisuda",
    category: "Wisuda",
    desc: "Momen kelulusan penuh kebanggaan bersama keluarga & sahabat",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    alt: "Foto Produk Komersial",
    category: "Foto Produk",
    desc: "Visualisasi produk berkelas untuk meningkatkan konversi penjualan",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    alt: "Momen Spesial & Acara",
    category: "Event & Momen",
    desc: "Tangkap emosi dan atmosfer autentik di setiap detik berharga",
  },
];

const services = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "Foto Produk",
    tagline: "Komersial & Brand",
    desc: "Tingkatkan daya tarik bisnis Anda dengan foto produk berkualitas studio, lighting terarah, dan color grading profesional.",
    features: ["White background / Konsep Lifestyle", "High-Resolution untuk marketplace", "Retouch detail tekstur produk"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    title: "Foto Wisuda",
    tagline: "Graduation Moment",
    desc: "Abadikan pencapaian istimewa Anda dengan pose elegan, arahan gaya yang natural, dan dokumentasi bersama keluarga tercinta.",
    features: ["Sesi individu, pasangan & keluarga", "Arahan gaya fotografer ramah", "Pilihan outdoor atau studio"],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
    title: "Video Sinematik",
    tagline: "Reels & Highlights",
    desc: "Bukan sekadar foto, ceritakan atmosfer momen Anda lewat video sinematik vertikal untuk TikTok, Instagram Reels, dan YouTube.",
    features: ["Transisi mulus & pemilihan musik", "Color grading sinematik", "Siap upload format vertikal / horizontal"],
  },
];

const workflows = [
  {
    step: "01",
    title: "Konsultasi & Pilih Paket",
    desc: "Diskusikan kebutuhan foto Anda bersama tim Lensa Arsya melalui WhatsApp. Kami bantu rekomendasikan paket terbaik.",
  },
  {
    step: "02",
    title: "Penjadwalan & Konsep",
    desc: "Tentukan tanggal, jam, dan lokasi pemotretan. Anda bebas mengajukan referensi gaya atau moodboard yang diinginkan.",
  },
  {
    step: "03",
    title: "Sesi Photoshoot Menyenangkan",
    desc: "Fotografer kami memandu pose dan memastikan Anda merasa nyaman agar hasil ekspresi tampak natural dan memukau.",
  },
  {
    step: "04",
    title: "Editing & Delivery Cepat",
    desc: "Proses kurasi dan retouching profesional. Hasil foto resolusi tinggi langsung diunggah ke Google Drive siap download.",
  },
];

const testimonials = [
  {
    name: "Aulia Rachman",
    role: "Wisudawan Universitas Padjadjaran",
    content: "Hasil fotonya di luar ekspektasi! Warnanya hidup banget, pengarah gaya sangat sabar pas foto sama keluarga besar. Pengiriman via Google Drive juga cepet banget!",
    rating: 5,
    tag: "Wisuda",
  },
  {
    name: "Dimas & Sarah",
    role: "Owner Brand Kuliner Sambal Roa",
    content: "Foto produk makanan kami jadi kelihatan mewah dan menggugah selera. Sejak pasang foto dari Lensa Arsya, penjualan online kami naik signifikan.",
    rating: 5,
    tag: "Foto Produk",
  },
  {
    name: "Rizky Pratama",
    role: "Wisudawan Teknik ITB",
    content: "Ambil Paket Premium dapet video Reels juga. Keren parah hasilnya sinematik, temen-temen banyak yang nanyain foto di mana. Recommended banget!",
    rating: 5,
    tag: "Paket Premium",
  },
];

const faqs = [
  {
    q: "Berapa lama proses pengeditan dan pengiriman foto?",
    a: "Untuk file mentahan bisa diakses dalam 24 jam setelah sesi selesai. Untuk file hasil retouch dan editing biasanya selesai dalam 3–5 hari kerja tergantung paket yang Anda pilih.",
  },
  {
    q: "Apakah bisa request konsep atau lokasi tertentu?",
    a: "Sangat bisa! Anda bebas mendiskusikan konsep, mood warna, referensi foto Pinterest/Instagram, serta lokasi photoshoot baik indoor maupun outdoor.",
  },
  {
    q: "Bagaimana cara booking dan pembayarannya?",
    a: "Cukup klik tombol 'Hubungi Kami' atau chat langsung via WhatsApp 0889 0280 9479. Anda cukup membayar DP untuk mengunci jadwal, dan pelunasan dapat dilakukan setelah sesi pemotretan.",
  },
  {
    q: "Apakah semua paket sudah termasuk link Google Drive?",
    a: "Ya, semua paket mulai dari Standar hingga Eksklusif mendapatkan penyimpanan cloud Google Drive tanpa kompresi resolusi agar Anda mudah mengunduh kapan saja.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
        {/* Background visual with rich overlays */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1920&q=80')",
            }}
          />
          {/* Deep dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#090a0f]/90 via-[#090a0f]/75 to-[#090a0f]" />
          
          {/* Ambient Red & White light glows */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-red-600/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-red-700/15 rounded-full blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Camera Viewfinder Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(225,29,72,0.25)] animate-fade-in-up">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span>● REC 4K UHD</span>
              <span className="text-white/40">|</span>
              <span className="text-white font-medium">Buka Jadwal Booking 2026</span>
            </div>

            {/* Main Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-white animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              More Than
              <br />
              What You{" "}
              <span className="gradient-text drop-shadow-[0_4px_25px_rgba(225,29,72,0.5)]">See</span>
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-base sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-normal" style={{ animationDelay: "0.2s" }}>
              Abadikan momen berharga dan produk Anda dengan sentuhan visual berkelas. Setiap jepretan bukan sekadar gambar, melainkan cerita yang abadi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 animate-fade-in-up mb-12" style={{ animationDelay: "0.3s" }}>
              <Link href="/portofolio" className="btn-primary text-base w-full sm:w-auto !py-3.5 !px-8">
                <span>Lihat Portofolio</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/harga" className="btn-outline text-base w-full sm:w-auto !py-3.5 !px-8">
                <span>Daftar Paket Harga</span>
              </Link>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-white/10 max-w-3xl mx-auto">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-white">500+</div>
                <div className="text-xs text-gray-400 mt-0.5">Foto Terkirim</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-white">100+</div>
                <div className="text-xs text-gray-400 mt-0.5">Klien Puas</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-1">
                  <span>4.9</span>
                  <span className="text-amber-400 text-base">★</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">Rating Klien</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-gray-400 mt-0.5">Google Drive Cloud</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient bottom red fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-surface)] to-transparent pointer-events-none" />
      </section>

      {/* Highlights Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Ambient red orbs */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              Galeri Unggulan
            </span>
            <h2>
              Karya <span className="gradient-text">Terbaik</span> Kami
            </h2>
            <p>Setiap foto menangkap emosi, estetika, dan cerita autentik yang tak terulang kembali</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="photo-item aspect-[4/5] rounded-2xl overflow-hidden group shadow-xl shadow-black/50"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="photo-overlay flex flex-col justify-end p-6">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-red-600 text-white mb-2 self-start shadow-md">
                    {item.category}
                  </span>
                  <h3 className="text-white font-bold text-xl mb-1">{item.alt}</h3>
                  <p className="text-xs text-gray-300 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/portofolio" className="btn-primary text-base">
              <span>Buka Semua Galeri Portofolio →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 sm:py-28 relative bg-gradient-to-b from-transparent via-red-950/15 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              Layanan Fotografi
            </span>
            <h2>
              Layanan <span className="gradient-text">Spesialis</span> Kami
            </h2>
            <p>Dukungan fotografi menyeluruh dengan standar estetika tinggi untuk kebutuhan personal maupun brand bisnis</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((svc, i) => (
              <div key={i} className="glass-card p-7 sm:p-8 flex flex-col justify-between group hover:border-red-500/50">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600/20 to-red-900/30 border border-red-500/30 flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                    {svc.icon}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1">{svc.tagline}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{svc.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">{svc.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="text-xs font-semibold text-white/80 mb-2 uppercase tracking-wide">Termasuk:</div>
                  <ul className="space-y-1.5">
                    {svc.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Keunggulan Kami */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        {/* Ambient red light */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              Keunggulan Kami
            </span>
            <h2>
              Kenapa Memilih <span className="gradient-text">Lensa Arsya</span>?
            </h2>
            <p>Dedikasi kami adalah menghadirkan hasil karya yang tak lekang oleh waktu dengan pengalaman sesi foto yang santai dan profesional</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 border-red-500/20">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 font-bold text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kamera & Lensa Pro</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Sensor resolusi tinggi dan lensa prime cinema menghasilkan ketajaman maksimal dan bokeh optik yang mempesona.
              </p>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 font-bold text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Retouch & Color Grading</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Karakter warna elegan, kulit natural tanpa over-edit, serta mood sinematik yang mengangkat nilai estetika foto.
              </p>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 font-bold text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Pengiriman Cloud Cepat</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Seluruh file disimpan di Google Drive berkapasitas besar. Unduh kapan saja tanpa takut foto terkompresi.
              </p>
            </div>

            <div className="glass-card p-6 border-red-500/20">
              <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400 mb-4 font-bold text-lg">
                04
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Bebas Request Konsep</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Bebas konsultasi gaya, lokasi pemotretan, hingga referensi moodboard agar hasil foto sesuai ekspektasi impian Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Kerja / Workflow Section */}
      <section className="py-20 sm:py-28 relative bg-[#0d0e17]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              Proses Mudah
            </span>
            <h2>
              4 Langkah Mudah <span className="gradient-text">Booking</span>
            </h2>
            <p>Dari ide awal hingga file foto ada di tangan Anda, proses dibuat simpel dan nyaman</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {workflows.map((wf, idx) => (
              <div key={idx} className="relative glass-card p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-red-500/80 tracking-tight">{wf.step}</span>
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{wf.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{wf.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20ingin%20konsultasi%20jadwal%20foto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-base"
            >
              <span>Mulai Konsultasi Gratis Sekarang</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimoni Klien */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              Ulasan Klien
            </span>
            <h2>
              Apa Kata <span className="gradient-text">Mereka</span>?
            </h2>
            <p>Kepuasan klien adalah prioritas utama kami di setiap sesi pemotretan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((item, idx) => (
              <div key={idx} className="glass-card p-7 flex flex-col justify-between hover:border-red-500/40">
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(item.rating)].map((_, s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed italic mb-6">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.role}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-900/30 text-red-400 border border-red-500/30">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 relative bg-[#0d0e17]/80 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-heading">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/40 border border-red-500/30 mb-3">
              FAQ
            </span>
            <h2>
              Pertanyaan yang Sering <span className="gradient-text">Diajukan</span>
            </h2>
            <p>Jawaban cepat untuk pertanyaan umum seputar jasa dan sesi foto kami</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="glass-card overflow-hidden transition-all duration-200 border-red-500/20"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-white hover:text-red-300 transition-colors"
                  >
                    <span className="text-base sm:text-lg">{faq.q}</span>
                    <span className="text-red-400 flex-shrink-0 text-xl font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-red-600/20 via-rose-600/15 to-transparent rounded-full blur-[140px]" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card p-8 sm:p-14 border-red-500/40 shadow-2xl shadow-red-950/50">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/60 border border-red-500/30 mb-4">
              Mulai Sesi Anda
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-white">
              Siap Mengabadikan <span className="gradient-text">Momen Spesial</span> Anda?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Jadwalkan tanggal pemotretan sekarang sebelum kuota harian penuh. Konsultasi konsep dan pemilihan paket 100% gratis!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/harga" className="btn-primary text-base !py-3.5 !px-8">
                <span>Pilih Paket Harga</span>
              </Link>
              <a
                href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20tertarik%20dengan%20jasa%20foto%20Anda."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa text-base !py-3.5 !px-8"
              >
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
