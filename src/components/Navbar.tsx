"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Beranda" },
    { href: "/portofolio", label: "Portofolio" },
    { href: "/harga", label: "Harga" },
    { href: "/tentang", label: "Tentang" },
  ];

  // Do not render public Navbar on admin or login pages
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[var(--color-surface)]/90 backdrop-blur-xl shadow-lg shadow-black/40 border-b border-red-500/15"
          : "bg-gradient-to-b from-[var(--color-surface)]/90 via-[var(--color-surface)]/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Merah Putih concept */}
          <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMobileOpen(false)}>
            {/* 3 bars with Merah Putih scheme: Red, White, Red */}
            <div className="flex gap-[3.5px] items-center">
              <div className="w-[3.5px] h-7 bg-[#e11d48] rounded-full shadow-[0_0_8px_rgba(225,29,72,0.6)] group-hover:scale-110 transition-transform"></div>
              <div className="w-[3.5px] h-8 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)] group-hover:scale-110 transition-transform delay-75"></div>
              <div className="w-[3.5px] h-7 bg-[#be123c] rounded-full shadow-[0_0_8px_rgba(190,18,60,0.6)] group-hover:scale-110 transition-transform delay-150"></div>
            </div>
            <div className="leading-none select-none">
              <span className="text-xl font-black tracking-tight text-white">
                lensa<span className="text-[#e11d48] drop-shadow-[0_0_6px_rgba(225,29,72,0.8)]">.</span>
              </span>
              <br />
              <span className="text-xl font-bold tracking-tight text-white/90">arsya</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm font-semibold tracking-wide transition-colors ${
                    isActive ? "text-white active" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20tertarik%20dengan%20jasa%20foto%20Anda."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm !py-2.5 !px-5"
            >
              <span>Booking Sesi</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2.5 text-white rounded-xl bg-white/5 border border-white/10 hover:border-red-500/40 active:scale-95 transition-all"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {isMobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden border-b border-red-500/20 bg-[var(--color-surface)]/98 backdrop-blur-2xl ${
          isMobileOpen ? "max-h-[380px] opacity-100 py-4 shadow-2xl" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="px-4 space-y-1.5 max-w-md mx-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? "text-white bg-gradient-to-r from-[#e11d48]/25 to-transparent border-l-4 border-[#e11d48]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#e11d48] shadow-[0_0_8px_#e11d48]"></span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10 mt-3 space-y-2">
            <a
              href="https://wa.me/6288902809479?text=Halo%20Lensa%20Arsya%2C%20saya%20tertarik%20dengan%20jasa%20foto%20Anda."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center !py-3 text-sm font-bold"
            >
              <span>Booking via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
