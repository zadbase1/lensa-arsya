"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPackages } from "@/lib/storage";
import { PackageItem, AddonItem } from "@/lib/types";
import { INITIAL_PACKAGES, INITIAL_ADDONS } from "@/lib/constants";

const includedInAll = [
  {
    title: "Google Drive Cloud Storage",
    desc: "Seluruh hasil jepretan diunggah ke cloud storage aman dan dapat diunduh tanpa penurunan kualitas resolusi.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    title: "Arahan Pose Ramah",
    desc: "Tidak perlu kaku di depan kamera. Fotografer kami berpengalaman mengarahkan sudut dan gesture terbaik Anda.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Resolusi Penuh Siap Cetak",
    desc: "File foto diekspor dalam format resolusi tinggi sehingga tajam saat dicetak ukuran poster atau banner besar.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Konsultasi Konsep Gratis",
    desc: "Diskusi konsep foto, pemilihan outfit/warna, dan referensi moodboard tanpa dipungut biaya tambahan.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const pricingFaqs = [
  {
    q: "Berapa DP untuk mengunci jadwal pemotretan?",
    a: "Uang muka (DP) mulai dari 30%–50% dari total paket untuk mengunci tanggal dan jam fotografer agar tidak diambil klien lain.",
  },
  {
    q: "Apakah bisa mengajukan reschedule jadwal?",
    a: "Bisa, Anda dapat mengajukan reschedule maksimal H-3 sebelum tanggal pemotretan tanpa potongan biaya tambahan (selama jadwal fotografer masih tersedia).",
  },
  {
    q: "Metode pembayaran apa saja yang didukung?",
    a: "Kami menerima transfer antar bank (BCA, Mandiri, BRI, BNI), QRIS seluruh e-wallet (GoPay, OVO, Dana, ShopeePay), dan uang tunai pada hari pemotretan.",
  },
  {
    q: "Bagaimana jika saya butuh konsep khusus untuk grup besar atau katalog produk banyak?",
    a: "Kami menyediakan harga khusus untuk rombongan wisuda bersama (kelompok 5-15 orang) atau sesi produk batch besar. Silakan klik tombol 'Custom Request' via WhatsApp!",
  },
];

function buildWaLink(name: string, price: string) {
  const text = `Halo Lensa Arsya, Saya ingin memesan *Paket ${name} (${price})*. Bisa minta info jadwal dan detailnya?`;
  return `https://wa.me/6288902809479?text=${encodeURIComponent(text)}`;
}

export default function HargaPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [packageList, setPackageList] = useState<PackageItem[]>(INITIAL_PACKAGES);
  const [addonsList, setAddonsList] = useState<AddonItem[]>(INITIAL_ADDONS);

  useEffect(() => {
    // Background fetch packages
    fetch("/api/packages")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data?.length) {
          setPackageList(res.data);
        }
      })
      .catch(() => {});

    // Background fetch addons
    fetch("/api/addons")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data?.length) {
          setAddonsList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="pt-24 sm:pt-28 pb-24 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-700/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="section-heading mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-950/40 border border-blue-500/30 mb-3">
            Transparan & Fleksibel
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Daftar Paket <span className="gradient-text">Harga</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Investasi visual terjangkau dengan hasil profesional. Pilih paket yang pas atau konsultasikan kebutuhan custom Anda bersama kami.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 items-stretch mb-20">
          {packageList.map((pkg) => (
            <div
              key={pkg.id || pkg.name}
              className={`glass-card p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                pkg.popular
                  ? "!border-blue-500/60 lg:-translate-y-2 shadow-2xl shadow-blue-950/60 bg-[rgba(15,23,42,0.85)]"
                  : "hover:border-blue-500/40"
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="badge-popular">★ Paling Diminati</span>
                </div>
              )}

              <div className={pkg.popular ? "pt-2" : ""}>
                <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                  {pkg.tagline}
                </div>
                <h3 className="text-2xl font-black text-white mb-2">{pkg.name}</h3>

                {/* Price Display */}
                <div className="mb-5 pb-5 border-b border-white/10">
                  <span className="text-3xl sm:text-4xl font-black gradient-text">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-gray-400 block mt-1">/ sesi acara</span>
                </div>

                {/* Feature List */}
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300">
                      <svg
                        className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <a
                href={buildWaLink(pkg.name, pkg.price)}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-center py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  pkg.popular
                    ? "btn-primary !shadow-lg !shadow-blue-600/30"
                    : "border border-blue-500/40 text-white bg-white/5 hover:bg-blue-600 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/25"
                }`}
              >
                <span>Pilih {pkg.name}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Feature Highlights: Included in all packages */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Nilai Tambah</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Semua Paket <span className="gradient-text">Sudah Termasuk</span>
            </h2>
            <p className="text-sm text-gray-400 mt-2">Standar pelayanan yang Anda dapatkan tanpa biaya tersembunyi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {includedInAll.map((item, idx) => (
              <div key={idx} className="glass-card p-6 border-blue-500/20 hover:border-blue-500/40">
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Layanan Tambahan / Add-ons */}
        <div className="mb-20">
          <div className="glass-card p-8 sm:p-10 border-blue-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Opsi Tambahan</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  Add-On & Layanan <span className="gradient-text">Kustom</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">Tambahkan fasilitas berikut sesuai kebutuhan acara Anda</p>
              </div>
              <a
                href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20ingin%20tanya%20layanan%20add-on%20foto."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm !py-2.5 !px-5 self-start md:self-auto"
              >
                <span>Tanya Add-On via WA</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addonsList.map((addon, idx) => (
                <div key={addon.id || idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white text-sm sm:text-base">{addon.name}</span>
                      <span className="text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                        {addon.price}
                      </span>
                    </div>
                    {addon.desc && <p className="text-xs text-gray-400 leading-relaxed">{addon.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Seputar Harga */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tanya Jawab</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              FAQ Seputar <span className="gradient-text">Paket & Pembayaran</span>
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="glass-card overflow-hidden border-blue-500/20">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-white hover:text-blue-300 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <span className="text-blue-400 flex-shrink-0 text-xl font-bold">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Request Banner */}
        <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-blue-900/20 to-blue-950/40 border border-blue-500/30">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Punya Kebutuhan Khusus atau Rombongan Besar?
          </h3>
          <p className="text-sm text-gray-300 mb-6 max-w-xl mx-auto">
            Kami siap memberikan penawaran khusus untuk wisuda kelompok, sesi event instansi, maupun katalog brand berkapasitas banyak.
          </p>
          <a
            href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20ingin%20custom%20request%20paket%20foto."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa text-sm sm:text-base"
          >
            <span>Hubungi Kami untuk Custom Request</span>
          </a>
        </div>
      </div>
    </div>
  );
}
