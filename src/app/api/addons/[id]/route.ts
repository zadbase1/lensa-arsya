import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";
import { updateLocalAddon, deleteLocalAddon } from "@/lib/localDb";

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
    const { name, price, desc } = body;

    if (!name || !price) {
      return NextResponse.json({ success: false, error: "Nama dan harga wajib diisi" }, { status: 400 });
    }

    if (!connectionString) {
      const updated = await updateLocalAddon(id, { name, price, desc });
      if (!updated) {
        return NextResponse.json({ success: false, error: "Add-on tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Add-on berhasil diperbarui di database lokal" });
    }

    const sql = neon(connectionString);
    await sql`
      UPDATE addons
      SET
        name = ${name.trim()},
        price = ${price.trim()},
        description = ${desc?.trim() || ""}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: "Add-on berhasil diperbarui" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui add-on";
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
      const deleted = await deleteLocalAddon(id);
      if (!deleted) {
        return NextResponse.json({ success: false, error: "Add-on tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Add-on berhasil dihapus dari database lokal" });
    }

    const sql = neon(connectionString);
    await sql`DELETE FROM addons WHERE id = ${id}`;

    return NextResponse.json({ success: true, message: "Add-on berhasil dihapus" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus add-on";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
