import "./globals.css";
import Header from "@/components/layout/header";
import Image from "next/image";
import WhatsAppButton from "@/components/ui/whatsapp-button";

import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taller 85",
  description: "Soluciones para proyectos, espacios y marcas.",
  icons: {
    icon: "/logo-taller85-v2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={manrope.variable}>
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <Header />

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-black/5 py-6 text-center text-sm text-slate-500">
          © 2026 Taller 85 · Soluciones para proyectos, espacios y marcas
        </footer>


        <WhatsAppButton />
      </body>
    </html>
  );
}