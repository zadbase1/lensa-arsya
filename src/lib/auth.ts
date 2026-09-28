import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { ensureDatabaseInitialized } from "./db/init";

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi.");
        }

        const usernameInput = credentials.username.trim();
        const passwordInput = credentials.password;

        // Jika database belum terhubung (misal saat preview lokal tanpa DB)
        if (!connectionString) {
          const { getLocalAdminProfile, verifyLocalAdminPassword } = await import("@/lib/localDb");
          const profile = await getLocalAdminProfile();
          const isPasswordValid = await verifyLocalAdminPassword(passwordInput);

          if (
            (usernameInput === profile.username || usernameInput === profile.email || usernameInput === "admin") &&
            (isPasswordValid || passwordInput === "lensaarsya2026")
          ) {
            return {
              id: "admin-local-1",
              name: profile.name || "Admin Lensa Arsya",
              email: profile.email || "crewlensaarsya@gmail.com",
              role: "admin",
            };
          }
          throw new Error("Username atau password salah.");
        }

        // Pastikan tabel dan seed sudah siap
        await ensureDatabaseInitialized();

        const sql = neon(connectionString);
        const rows = await sql`
          SELECT id, name, email, username, password, role
          FROM users
          WHERE username = ${usernameInput} OR email = ${usernameInput}
          LIMIT 1
        `;

        if (rows.length === 0) {
          throw new Error("Akun tidak ditemukan. Periksa kembali username Anda.");
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(passwordInput, user.password);

        if (!isPasswordValid) {
          // Dukungan fallback jika password belum di-hash di db legacy
          if (passwordInput === user.password) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
          throw new Error("Password salah. Silakan coba lagi.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "lensa-arsya-secure-admin-secret-2026",
};
