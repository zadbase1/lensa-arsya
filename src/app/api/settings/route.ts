import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { DEFAULT_HERO_BG_URL } from "@/lib/constants";
import { getLocalSettings, updateLocalSettings } from "@/lib/localDb";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureSettingsTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET() {
  try {
    if (!connectionString) {
      const settings = await getLocalSettings();
      return NextResponse.json({
        success: true,
        data: settings,
        source: "local-file",
      });
    }

    const sql = neon(connectionString);
    await ensureSettingsTable(sql);

    const rows = await sql`
      SELECT key, value FROM site_settings WHERE key = 'hero_bg_url' LIMIT 1
    `;

    const heroBgUrl = rows.length > 0 ? rows[0].value : DEFAULT_HERO_BG_URL;

    return NextResponse.json({
      success: true,
      data: {
        hero_bg_url: heroBgUrl,
      },
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil pengaturan situs";
    const local = await getLocalSettings().catch(() => ({ hero_bg_url: DEFAULT_HERO_BG_URL }));
    return NextResponse.json({
      success: true,
      data: local,
      warning: msg,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { hero_bg_url } = body;

    if (!hero_bg_url || typeof hero_bg_url !== "string" || !hero_bg_url.trim()) {
      return NextResponse.json(
        { success: false, error: "URL gambar background wajib diisi." },
        { status: 400 }
      );
    }

    const cleanUrl = hero_bg_url.trim();

    if (!connectionString) {
      const updated = await updateLocalSettings({ hero_bg_url: cleanUrl });
      return NextResponse.json({
        success: true,
        data: updated,
        message: "Background beranda berhasil diperbarui di database lokal!",
        source: "local-file",
      });
    }

    const sql = neon(connectionString);
    await ensureSettingsTable(sql);

    await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES ('hero_bg_url', ${cleanUrl}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = ${cleanUrl}, updated_at = NOW();
    `;

    // Also update local cache for consistency
    await updateLocalSettings({ hero_bg_url: cleanUrl }).catch(() => {});

    return NextResponse.json({
      success: true,
      data: { hero_bg_url: cleanUrl },
      message: "Background beranda berhasil diperbarui di cloud database!",
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menyimpan pengaturan background";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
