"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <footer className="relative bg-[#06070a] border-t border-red-500/20 text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* CTA Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="glass-card p-8 sm:p-12 text-center border-red-500/30 relative overflow-hidden bg-gradient-to-b from-[#121524] to-[#0c0e18]">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-red-400 bg-red-950/60 border border-red-500/30 mb-4">
            Konsultasi Langsung
          </span>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 text-white">
            Punya Pertanyaan atau <span className="gradient-text">Custom Request</span>?
          </h3>
          <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Dari sesi wisuda kilat hingga katalog produk komersial, kami siap membantu mewujudkan konsep visual impian Anda. Hubungi kami melalui WhatsApp atau email.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center max-w-2xl mx-auto">
            <a
              href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20punya%20pertanyaan%20seputar%20jasa%20foto."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa text-sm sm:text-base justify-center !py-3.5 !px-6 whitespace-nowrap flex-shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span className="whitespace-nowrap font-bold tracking-wide">0889 0280 9479</span>
            </a>
            <a
              href="mailto:crewlensaarsya@gmail.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-red-500/50 whitespace-nowrap flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <span className="whitespace-nowrap">crewlensaarsya@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Navigation & Copyright */}
      <div className="border-t border-white/10 relative z-10 bg-[#040407]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Merah Putih Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex gap-[3px] items-center">
                <div className="w-[3px] h-6 bg-[#e11d48] rounded-full"></div>
                <div className="w-[3px] h-7 bg-white rounded-full"></div>
                <div className="w-[3px] h-6 bg-[#be123c] rounded-full"></div>
              </div>
              <div className="leading-tight">
                <span className="text-base font-black tracking-tight text-white">
                  lensa<span className="text-red-500">.</span>
                </span>
                <br />
                <span className="text-base font-bold tracking-tight text-white/90">arsya</span>
              </div>
            </Link>

            {/* Tagline & Copyright */}
            <div className="text-center md:text-left">
              <p className="text-xs sm:text-sm text-gray-400">
                © {new Date().getFullYear()} Lensa Arsya. <em className="text-gray-300">More than what you see.</em>
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Konsep Fotografi Merah Putih — Profesional, Kreatif, & Terjangkau.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                Beranda
              </Link>
              <Link href="/portofolio" className="text-gray-400 hover:text-white transition-colors">
                Portofolio
              </Link>
              <Link href="/harga" className="text-gray-400 hover:text-white transition-colors">
                Harga
              </Link>
              <Link href="/tentang" className="text-gray-400 hover:text-white transition-colors">
                Tentang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
