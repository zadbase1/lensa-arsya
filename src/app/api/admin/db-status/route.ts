import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { ensureDatabaseInitialized } from "@/lib/db/init";
import { getLocalDbStats } from "@/lib/localDb";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!connectionString) {
      const stats = await getLocalDbStats();
      return NextResponse.json({
        connected: true,
        isLocal: true,
        message: "Mode File Database Lokal Aktif (data/local-db.json). Anda dapat mengetes fitur tambah, edit, dan hapus foto/paket secara langsung tanpa konfigurasi database cloud!",
        stats,
      });
    }

    const initResult = await ensureDatabaseInitialized();
    const sql = neon(connectionString);

    const [photosCount] = await sql`SELECT count(*)::int as count FROM photos`;
    const [catsCount] = await sql`SELECT count(*)::int as count FROM categories`;
    const [pkgsCount] = await sql`SELECT count(*)::int as count FROM packages`;
    const [usersCount] = await sql`SELECT count(*)::int as count FROM users`;

    return NextResponse.json({
      connected: true,
      message: "Database Vercel Postgres aktif dan terhubung dengan sukses!",
      stats: {
        photos: photosCount?.count || 0,
        categories: catsCount?.count || 0,
        packages: pkgsCount?.count || 0,
        admins: usersCount?.count || 0,
      },
      initMessage: initResult.message,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengecek koneksi database";
    return NextResponse.json({ connected: false, message: msg }, { status: 500 });
  }
}
