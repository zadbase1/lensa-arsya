import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { ensureDatabaseInitialized } from "@/lib/db/init";
import { INITIAL_PACKAGES } from "@/lib/constants";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export async function GET() {
  try {
    if (!connectionString) {
      return NextResponse.json({ success: true, data: INITIAL_PACKAGES, source: "fallback" });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const rows = await sql`
      SELECT id, name, price, tagline, popular, features, created_at
      FROM packages
      ORDER BY created_at ASC
    `;

    // Parse features JSON string to array
    const parsed = rows.map((r) => ({
      ...r,
      features: typeof r.features === "string" ? JSON.parse(r.features) : r.features,
    }));

    return NextResponse.json({
      success: true,
      data: parsed.length > 0 ? parsed : INITIAL_PACKAGES,
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data paket harga";
    return NextResponse.json({ success: false, error: msg, data: INITIAL_PACKAGES }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, tagline, popular, features } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: "Nama paket dan harga wajib diisi." }, { status: 400 });
    }

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database belum terhubung" }, { status: 500 });
    }

    await ensureDatabaseInitialized();
    const sql = neon(connectionString);
    const newId = `pkg-${Date.now()}`;
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    await sql`
      INSERT INTO packages (id, name, price, tagline, popular, features)
      VALUES (
        ${newId},
        ${name.trim()},
        ${price.trim()},
        ${tagline?.trim() || ""},
        ${Boolean(popular)},
        ${featuresJson}
      )
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        name,
        price,
        tagline: tagline || "",
        popular: Boolean(popular),
        features: Array.isArray(features) ? features : [],
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambahkan paket";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
