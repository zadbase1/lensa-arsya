import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lensa Arsya — More Than What You See",
  description:
    "Jasa fotografi profesional untuk wisuda, produk, dan berbagai momen spesial Anda. Abadikan cerita Anda bersama Lensa Arsya.",
  keywords: ["fotografi", "fotografer", "wisuda", "foto produk", "Lensa Arsya", "jasa foto"],
  openGraph: {
    title: "Lensa Arsya — More Than What You See",
    description: "Jasa fotografi profesional untuk wisuda, produk, dan berbagai momen spesial Anda.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppButton />
        </AuthProvider>
      </body>
    </html>
  );
}
