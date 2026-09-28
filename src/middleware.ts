import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";
  const pathname = url.pathname;

  // Lewati file statis, aset Next.js, dan favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Deteksi apakah request berasal dari subdomain admin
  // Contoh: admin.lensaarsya.com, admin.localhost:3000, admin.projeklensa.vercel.app
  const isAdminSubdomain =
    host.startsWith("admin.") ||
    host.includes("admin.localhost") ||
    host.split(".")[0] === "admin";

  // ==========================================
  // KASUS 1: PENGUNJUNG DI DOMAIN UTAMA
  // ==========================================
  if (!isAdminSubdomain) {
    // Jika seseorang mencoba mengakses rute admin atau login di domain utama,
    // langsung redirect ke halaman utama (/) agar dashboard admin tersembunyi total.
    if (pathname.startsWith("/admin") || pathname === "/login") {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Halaman publik berjalan seperti biasa
    return NextResponse.next();
  }

  // ==========================================
  // KASUS 2: PENGUNJUNG DI SUBDOMAIN ADMIN
  // ==========================================
  const secret = process.env.NEXTAUTH_SECRET || "lensa-arsya-secure-admin-secret-2026";
  const token = await getToken({ req, secret });
  const isAuthenticated = Boolean(token);

  // Jika pengunjung membuka halaman login di subdomain admin:
  if (pathname === "/login" || pathname === "/admin/login") {
    // Jika sudah login, lempar ke dashboard (/)
    if (isAuthenticated) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    // Tampilkan tampilan login admin
    url.pathname = "/admin/login";
    return NextResponse.rewrite(url);
  }

  // Untuk semua halaman lainnya di subdomain admin (misal / atau /admin):
  if (!isAuthenticated) {
    // Belum login -> arahkan ke /login di subdomain admin
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Sudah login: jika membuka root subdomain (/), tampilkan dashboard admin (/admin)
  if (pathname === "/") {
    url.pathname = "/admin";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua request kecuali:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, dll.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
