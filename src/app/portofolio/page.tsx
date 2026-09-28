"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCategories, getPhotos } from "@/lib/storage";
import { Photo } from "@/lib/types";
import { INITIAL_PHOTOS, INITIAL_CATEGORIES } from "@/lib/constants";

const photoTips = [
  {
    title: "1. Siapkan Moodboard / Referensi",
    desc: "Kumpulkan beberapa foto referensi pose atau tone warna yang Anda sukai dari Pinterest atau Instagram untuk mempermudah sesi foto.",
  },
  {
    title: "2. Harmonisasi Warna Pakaian",
    desc: "Untuk foto wisuda keluarga atau grup, pilih busana dengan palet warna senada (misal earthy tone, pastel, atau formal monokrom).",
  },
  {
    title: "3. Istirahat Cukup & Rileks",
    desc: "Tidur cukup sebelum hari pemotretan membuat mata tampak segar. Jangan khawatir soal pose, fotografer kami akan memandu Anda step-by-step!",
  },
];

export default function PortofolioPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [lightbox, setLightbox] = useState<null | Photo>(null);
  const [photosList, setPhotosList] = useState<Photo[]>(INITIAL_PHOTOS);
  const [categoriesList, setCategoriesList] = useState<string[]>([
    "Semua",
    ...INITIAL_CATEGORIES.map((c) => c.name),
  ]);

  useEffect(() => {
    Promise.all([
      fetch("/api/photos").then((r) => r.json()).catch(() => ({ data: getPhotos() })),
      fetch("/api/categories").then((r) => r.json()).catch(() => ({ data: getCategories() })),
    ]).then(([resPhotos, resCats]) => {
      const photos = resPhotos?.data?.length ? resPhotos.data : getPhotos();
      const cats = resCats?.data?.length ? resCats.data : getCategories();
      setPhotosList(photos);
      setCategoriesList(["Semua", ...cats.map((c: { name: string }) => c.name)]);
    });
  }, []);

  const filtered =
    activeFilter === "Semua" ? photosList : photosList.filter((p) => p.category === activeFilter);

  const waTextForPhoto = (title: string, category: string) =>
    `https://wa.me/6288902809479?text=${encodeURIComponent(
      `Halo Lensa Arsya, saya tertarik dengan gaya foto "${title}" (Kategori: ${category}). Apakah bisa buat konsep serupa?`
    )}`;

  return (
    <div className="pt-24 sm:pt-28 pb-24 min-h-screen relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-20 right-1/4 w-[600px] h-[350px] bg-blue-600/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-2/3 -left-32 w-96 h-96 bg-blue-700/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="section-heading mb-10 sm:mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-950/40 border border-blue-500/30 mb-3">
            Koleksi Visual
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Galeri <span className="gradient-text">Portofolio</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Jelajahi hasil karya pilihan kami. Klik pada foto untuk melihat ukuran penuh dan mendiskusikan konsep serupa langsung bersama kami.
          </p>
        </div>

        {/* Filter Chips - dynamically loaded from categories */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-14">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`filter-chip text-xs sm:text-sm font-semibold !py-2.5 !px-5 ${
                activeFilter === cat ? "active" : ""
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="photo-item aspect-[4/5] shadow-xl shadow-black/40 group relative rounded-2xl overflow-hidden"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80";
                }}
              />

              {/* Viewfinder corner watermark on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px] font-mono text-blue-400 uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm self-start">
                  <span>[ FOCUS LOCK ]</span>
                </div>
              </div>

              {/* Overlay with info */}
              <div className="photo-overlay flex flex-col justify-end p-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                      {photo.category}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl drop-shadow-md">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                    {photo.description}
                  </p>
                  <span className="text-xs text-blue-300 flex items-center gap-1 mt-2 font-medium">
                    <span>Klik untuk memperbesar</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 glass-card p-8 mb-20 max-w-md mx-auto">
            <p className="text-gray-400 text-sm">Belum ada foto untuk kategori ini.</p>
          </div>
        )}

        {/* Section: Tips Persiapan Sesi Foto */}
        <div className="glass-card p-8 sm:p-10 border-blue-500/30 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tips Pemotretan</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Persiapan Agar Hasil Foto <span className="gradient-text">Maksimal</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              Beberapa saran sederhana dari tim Lensa Arsya sebelum Anda memulai sesi photoshoot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {photoTips.map((tip, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <h3 className="font-bold text-white text-base mb-2">{tip.title}</h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="text-center p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-blue-950/40 via-blue-900/30 to-blue-950/40 border border-blue-500/40">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Punya Referensi Foto atau Konsep Khusus?
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto mb-6">
            Kirimkan foto referensi Anda ke WhatsApp kami, tim Lensa Arsya siap mewujudkan visual impian Anda dengan kualitas terbaik!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3.5">
            <a
              href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20punya%20referensi%20konsep%20foto%20yang%20ingin%20saya%20diskusikan."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-sm sm:text-base"
            >
              <span>Diskusikan Konsep Anda via WA</span>
            </a>
            <Link href="/harga" className="btn-outline text-sm sm:text-base">
              <span>Cek Daftar Paket Harga</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div
            className="relative max-w-4xl w-full mx-auto my-auto animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 right-2 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-blue-600 transition-colors z-20"
              aria-label="Tutup foto"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="glass-card overflow-hidden !rounded-2xl border-blue-500/40 shadow-2xl shadow-black/80">
              <div className="relative bg-black/70 flex items-center justify-center">
                <img
                  src={lightbox.image_url}
                  alt={lightbox.title}
                  className="w-full max-h-[65vh] sm:max-h-[70vh] object-contain"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0a0f1d]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded uppercase tracking-wider">
                      {lightbox.category}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{lightbox.title}</h3>
                  {lightbox.description && (
                    <p className="text-xs text-gray-300 mt-1 max-w-md">{lightbox.description}</p>
                  )}
                </div>

                <a
                  href={waTextForPhoto(lightbox.title, lightbox.category)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa text-xs sm:text-sm !py-2.5 !px-5 w-full sm:w-auto justify-center"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Tanya Konsep Foto Ini</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
