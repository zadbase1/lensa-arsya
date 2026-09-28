import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { INITIAL_CATEGORIES, INITIAL_PACKAGES, INITIAL_PHOTOS } from "../constants";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

let isInitialized = false;

export async function ensureDatabaseInitialized() {
  if (isInitialized) return { success: true, message: "Database sudah terinisialisasi sebelumnya" };
  if (!connectionString) {
    return {
      success: false,
      message: "POSTGRES_URL / DATABASE_URL belum dikonfigurasi.",
    };
  }

  const sql = neon(connectionString);

  try {
    // 1. Buat Tabel Users jika belum ada
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // 2. Buat Tabel Categories
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // 3. Buat Tabel Packages
    await sql`
      CREATE TABLE IF NOT EXISTS packages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        tagline TEXT NOT NULL,
        popular BOOLEAN NOT NULL DEFAULT FALSE,
        features TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // 4. Buat Tabel Photos
    await sql`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT NOT NULL,
        category TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;

    // 5. Seed Admin User jika belum ada
    const existingUsers = await sql`SELECT id FROM users LIMIT 1`;
    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash("lensaarsya2026", 10);
      await sql`
        INSERT INTO users (id, name, username, password, role)
        VALUES ('admin-1', 'Admin Lensa Arsya', 'admin', ${hashedPassword}, 'admin');
      `;
    }

    // 6. Seed Categories jika kosong
    const existingCategories = await sql`SELECT id FROM categories LIMIT 1`;
    if (existingCategories.length === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await sql`
          INSERT INTO categories (id, name)
          VALUES (${cat.id}, ${cat.name})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    // 7. Seed Packages jika kosong
    const existingPackages = await sql`SELECT id FROM packages LIMIT 1`;
    if (existingPackages.length === 0) {
      for (const pkg of INITIAL_PACKAGES) {
        await sql`
          INSERT INTO packages (id, name, price, tagline, popular, features)
          VALUES (
            ${pkg.id},
            ${pkg.name},
            ${pkg.price},
            ${pkg.tagline || ""},
            ${Boolean(pkg.popular)},
            ${JSON.stringify(pkg.features || [])}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    // 8. Seed Photos jika kosong
    const existingPhotos = await sql`SELECT id FROM photos LIMIT 1`;
    if (existingPhotos.length === 0) {
      for (const p of INITIAL_PHOTOS) {
        await sql`
          INSERT INTO photos (id, title, description, image_url, category, sort_order)
          VALUES (
            ${p.id},
            ${p.title},
            ${p.description || ""},
            ${p.image_url},
            ${p.category},
            ${p.sort_order || 1}
          )
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    isInitialized = true;
    return { success: true, message: "Inisialisasi tabel dan auto-seed database Vercel Postgres berhasil!" };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal inisialisasi database";
    console.error("[Database Init Error]:", msg);
    return { success: false, message: msg };
  }
}
