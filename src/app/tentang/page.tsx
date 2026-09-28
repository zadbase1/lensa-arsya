import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang — Lensa Arsya",
  description: "Kenali lebih dekat Lensa Arsya, fotografer profesional yang mengabadikan momen berharga Anda dengan konsep visual modern.",
};

const stats = [
  { value: "500+", label: "Foto Terkirim" },
  { value: "100+", label: "Klien Puas" },
  { value: "3+", label: "Tahun Dedikasi" },
  { value: "4.9★", label: "Rating Kepuasan" },
];

const gears = [
  {
    category: "Kamera Utama",
    items: "Full-Frame High Resolution Sensor dengan dynamic range luas untuk detail warna maksimal.",
  },
  {
    category: "Lensa Cinema & Prime",
    items: "Lensa 85mm f/1.4 portrait, 35mm f/1.8 street & produk, dan 24-70mm f/2.8 fleksibel untuk berbagai situasi.",
  },
  {
    category: "Lighting & Modifiers",
    items: "Studio Strobe, Speedlight portabel, Softbox bundar, dan Reflector untuk pencahayaan lembut.",
  },
  {
    category: "Stabilisasi & Video",
    items: "Gimbal 3-Axis elektronik untuk rekaman video sinematik vertikal yang sangat mulus.",
  },
];

export default function TentangPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-24 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-blue-700/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="section-heading mb-12 sm:mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-blue-400 bg-blue-950/40 border border-blue-500/30 mb-3">
            Di Balik Lensa
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4">
            Tentang <span className="gradient-text">Lensa Arsya</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Cerita, filosofi visual, dan komitmen kami dalam mengabadikan momen berharga Anda
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          {/* Photographer Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-blue-500/25 shadow-2xl shadow-black/60">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
                alt="Fotografer Lensa Arsya"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-transparent to-transparent opacity-80" />
            </div>

            {/* Floating rating badge */}
            <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-6 glass-card p-4 sm:p-5 !rounded-2xl border-blue-500/40 shadow-xl max-w-[210px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-white">4.9</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-400">Rating kepuasan klien di Google & WhatsApp</p>
            </div>
          </div>

          {/* Story & Philosophy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Filosofi Kami
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight text-white">
              Bukan Sekadar Memotret,
              <br />
              Kami <span className="gradient-text">Mengabadikan Kisah</span>
            </h2>

            <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-white">Lensa Arsya</strong> lahir dari kecintaan terhadap seni fotografi dan keyakinan bahwa setiap momentum memiliki jiwa tersendiri. Dengan tagline kebanggaan kami{" "}
                <em className="text-blue-400 font-semibold">&ldquo;More than what you see&rdquo;</em>, kami memandang fotografi lebih dari sekadar komposisi teknis di atas kertas atau layar ponsel.
              </p>
              <p>
                Bagi kami, sebuah foto adalah pengingat perjuangan saat toga wisuda disematkan di kepala, atau cerita kerja keras seorang pebisnis saat meluncurkan produk terbarunya ke pasar luas.
              </p>
              <p>
                Mengusung dedikasi visual yang profesional, inovatif, dan berintegritas tinggi, kami terus menghadirkan karya fotografi berkelas, fleksibel, bersahabat, serta dapat diakses dengan harga yang terjangkau.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20ingin%20konsultasi%20foto."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm sm:text-base !py-3 !px-6"
              >
                <span>Konsultasi Gratis via WA</span>
              </a>
              <Link href="/portofolio" className="btn-outline text-sm sm:text-base !py-3 !px-6">
                <span>Lihat Karya Kami</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center border-blue-500/20">
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Equipment & Gear Section */}
        <div className="mb-20">
          <div className="glass-card p-8 sm:p-12 border-blue-500/30">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Perangkat Profesional</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Peralatan & Gear <span className="gradient-text">Terstandarisasi</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-2">
                Kami selalu menggunakan perangkat terdepan demi menjamin ketajaman optik dan reproduksi warna yang akurat
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gears.map((gear, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-white/[0.03] border border-white/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-blue-500/30">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base mb-1">{gear.category}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{gear.items}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Komitmen Pelayanan</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Prinsip Kerja <span className="gradient-text">Lensa Arsya</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="glass-card p-7 text-center border-blue-500/20">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5 text-blue-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Tepat Waktu & Cepat</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Jadwal pemotretan disiplin dan hasil file foto digital dikirimkan tepat sesuai janji waktu yang disepakati.
              </p>
            </div>

            <div className="glass-card p-7 text-center border-blue-500/20">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5 text-blue-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sentuhan Artistik</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Setiap frame dikurasi dengan cermat. Warna, kontras, dan ekspresi disesuaikan untuk hasil estetis berkelas.
              </p>
            </div>

            <div className="glass-card p-7 text-center border-blue-500/20">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center mx-auto mb-5 text-blue-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ramah & Menyenangkan</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Suasana photoshoot santai dan interaktif membuat Anda tidak canggung, sehingga hasil foto tampak bahagia alami.
              </p>
            </div>
          </div>

          {/* Kolaborasi Digital & Website Architect */}
          <div className="mt-14 glass-card p-8 border-blue-500/25 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_25px_rgba(37,99,235,0.1)]">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-1.5 z-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Digital Experience & Technology</span>
              <h3 className="text-xl font-extrabold text-white">Platform Resmi Lensa Arsya</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
                Website interaktif dan sistem manajemen katalog ini dirancang serta dikembangkan secara profesional oleh <span className="text-white font-semibold">ZielSa Project</span>.
              </p>
            </div>
            <div className="z-10 flex-shrink-0">
              <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-950/90 via-blue-900/60 to-slate-900 border border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.25)] flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">
                  ZielSa Project
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
