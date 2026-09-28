import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { ensureDatabaseInitialized } from "@/lib/db/init";
import { INITIAL_PHOTOS } from "@/lib/constants";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export async function GET() {
  try {
    if (!connectionString) {
      return NextResponse.json({ success: true, data: INITIAL_PHOTOS, source: "fallback" });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const rows = await sql`
      SELECT id, title, description, image_url, category, sort_order, created_at
      FROM photos
      ORDER BY sort_order ASC, created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: rows.length > 0 ? rows : INITIAL_PHOTOS,
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data foto";
    return NextResponse.json({ success: false, error: msg, data: INITIAL_PHOTOS }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, image_url, category, sort_order } = body;

    if (!title || !image_url || !category) {
      return NextResponse.json(
        { success: false, error: "Judul, gambar, dan kategori wajib diisi." },
        { status: 400 }
      );
    }

    if (!connectionString) {
      return NextResponse.json({
        success: false,
        error: "POSTGRES_URL belum dikonfigurasi di lingkungan Vercel.",
      }, { status: 500 });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const newId = `photo-${Date.now()}`;

    await sql`
      INSERT INTO photos (id, title, description, image_url, category, sort_order)
      VALUES (
        ${newId},
        ${title.trim()},
        ${description?.trim() || ""},
        ${image_url.trim()},
        ${category.trim()},
        ${Number(sort_order) || 1}
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        title,
        description,
        image_url,
        category,
        sort_order: Number(sort_order) || 1,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menyimpan foto";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
