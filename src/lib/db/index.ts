import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export function getDb() {
  if (!connectionString) {
    throw new Error(
      "Koneksi database belum dikonfigurasi. Pastikan variabel lingkungan POSTGRES_URL atau DATABASE_URL telah diisi di Vercel Dashboard atau file .env.local."
    );
  }
  const client = neon(connectionString);
  return drizzle(client, { schema });
}

export function isDbConfigured(): boolean {
  return Boolean(
    process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL
  );
}

export { schema };
