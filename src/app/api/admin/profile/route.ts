import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { ensureDatabaseInitialized } from "@/lib/db/init";

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
      return NextResponse.json({
        success: true,
        data: { username: "admin", name: "Admin Lensa Arsya", email: "crewlensaarsya@gmail.com" },
      });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const rows = await sql`SELECT id, username, name, email FROM users LIMIT 1`;

    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: { username: "admin" } });
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data admin";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { username, newPassword } = await req.json();

    if (!connectionString) {
      return NextResponse.json({
        success: false,
        error: "Database Vercel Postgres belum terhubung.",
      }, { status: 500 });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);

    if (newPassword && newPassword.length >= 6) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (username && username.trim()) {
        await sql`
          UPDATE users
          SET username = ${username.trim()}, password = ${hashedPassword}, updated_at = NOW()
          WHERE role = 'admin' OR id = 'admin-1'
        `;
      } else {
        await sql`
          UPDATE users
          SET password = ${hashedPassword}, updated_at = NOW()
          WHERE role = 'admin' OR id = 'admin-1'
        `;
      }
    } else if (username && username.trim()) {
      await sql`
        UPDATE users
        SET username = ${username.trim()}, updated_at = NOW()
        WHERE role = 'admin' OR id = 'admin-1'
      `;
    }

    return NextResponse.json({
      success: true,
      message: "Profil admin dan password berhasil diperbarui!",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui profil admin";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
