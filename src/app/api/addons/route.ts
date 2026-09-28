import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { INITIAL_ADDONS } from "@/lib/constants";
import { getLocalAddons, addLocalAddon } from "@/lib/localDb";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureAddonsTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS addons (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
}

export async function GET() {
  try {
    if (!connectionString) {
      const addons = await getLocalAddons();
      return NextResponse.json({ success: true, data: addons, source: "local-file" });
    }

    const sql = neon(connectionString);
    await ensureAddonsTable(sql);

    const rows = await sql`
      SELECT id, name, price, description as desc, created_at
      FROM addons
      ORDER BY created_at ASC
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: true, data: INITIAL_ADDONS, source: "postgres-empty" });
    }

    return NextResponse.json({ success: true, data: rows, source: "postgres" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal mengambil data addon";
    const local = await getLocalAddons().catch(() => INITIAL_ADDONS);
    return NextResponse.json({ success: true, data: local, warning: msg });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, price, desc } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, error: "Nama dan harga add-on wajib diisi." },
        { status: 400 }
      );
    }

    if (!connectionString) {
      const newAddon = await addLocalAddon({ name, price, desc });
      return NextResponse.json({
        success: true,
        data: newAddon,
        source: "local-file",
      });
    }

    const sql = neon(connectionString);
    await ensureAddonsTable(sql);
    const newId = `addon-${Date.now()}`;

    await sql`
      INSERT INTO addons (id, name, price, description)
      VALUES (${newId}, ${name.trim()}, ${price.trim()}, ${desc?.trim() || ""})
    `;

    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        name: name.trim(),
        price: price.trim(),
        desc: desc?.trim() || "",
      },
      source: "postgres",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambahkan add-on";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
