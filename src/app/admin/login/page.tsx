"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username: username.trim(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || "Username atau password salah. Silakan coba lagi.");
        setIsLoading(false);
      } else {
        // Berhasil login, refresh dan arahkan ke dashboard
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan saat menghubungi server autentikasi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#07080d]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-red-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-red-700/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 group mb-4">
            <div className="flex gap-[3.5px] items-center">
              <div className="w-[3.5px] h-7 bg-[#e11d48] rounded-full shadow-[0_0_8px_rgba(225,29,72,0.6)]"></div>
              <div className="w-[3.5px] h-8 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"></div>
              <div className="w-[3.5px] h-7 bg-[#be123c] rounded-full shadow-[0_0_8px_rgba(190,18,60,0.6)]"></div>
            </div>
            <div className="leading-none text-left">
              <span className="text-2xl font-black tracking-tight text-white">
                lensa<span className="text-[#e11d48]">.</span>
              </span>
              <br />
              <span className="text-2xl font-bold tracking-tight text-white/90">arsya</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Portal Khusus Subdomain Admin Lensa Arsya
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-6 sm:p-8 border-red-500/30 shadow-2xl shadow-black/80">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password admin"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full !py-3.5 mt-2 text-sm font-bold shadow-lg shadow-red-600/30"
            >
              <span>{isLoading ? "Memproses Autentikasi..." : "Masuk ke Dashboard"}</span>
            </button>
          </form>

          {/* Default Credentials Information Card */}
          <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
            <div className="font-semibold text-white mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span>Informasi Login Default (Vercel Postgres & NextAuth):</span>
            </div>
            <div className="space-y-1 text-gray-300 font-mono">
              <div>Username: <strong className="text-white">admin</strong></div>
              <div>Password: <strong className="text-white">lensaarsya2026</strong></div>
            </div>
            <div className="text-[11px] text-gray-400 mt-2">
              Password diamankan dengan enkripsi bcrypt dan dapat diubah melalui tab Pengaturan Admin.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
