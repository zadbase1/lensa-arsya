import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { name, price, tagline, popular, features } = body;

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database belum terhubung" }, { status: 500 });
    }

    const sql = neon(connectionString);
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    await sql`
      UPDATE packages
      SET
        name = ${name},
        price = ${price},
        tagline = ${tagline || ""},
        popular = ${Boolean(popular)},
        features = ${featuresJson}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Paket berhasil diperbarui" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui paket";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!connectionString) {
      return NextResponse.json({ success: false, error: "Database belum terhubung" }, { status: 500 });
    }

    const sql = neon(connectionString);
    await sql`DELETE FROM packages WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: "Paket berhasil dihapus" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus paket";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
