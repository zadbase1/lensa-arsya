import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { ensureDatabaseInitialized } from "@/lib/db/init";
import { INITIAL_CATEGORIES } from "@/lib/constants";
import { getLocalCategories, addLocalCategory } from "@/lib/localDb";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export async function GET() {
  try {
    if (!connectionString) {
      const localCats = await getLocalCategories();
      return NextResponse.json({ success: true, data: localCats, source: "local-file" });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const rows = await sql`
      SELECT id, name, created_at
      FROM categories
      ORDER BY created_at ASC
    `;

    return NextResponse.json({
      success: true,
      data: rows.length > 0 ? rows : INITIAL_CATEGORIES,
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data kategori";
    return NextResponse.json({ success: false, error: msg, data: INITIAL_CATEGORIES }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Nama kategori wajib diisi." }, { status: 400 });
    }

    if (!connectionString) {
      const newCat = await addLocalCategory(name);
      return NextResponse.json({
        success: true,
        data: newCat,
        source: "local-file",
      });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const newId = `cat-${Date.now()}`;

    await sql`
      INSERT INTO categories (id, name)
      VALUES (${newId}, ${name.trim()})
      ON CONFLICT (name) DO NOTHING;
    `;

    return NextResponse.json({
      success: true,
      data: { id: newId, name: name.trim() },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambahkan kategori";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
