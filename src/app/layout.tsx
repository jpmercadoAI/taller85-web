import "./globals.css";
import Header from "@/components/layout/header";
import WhatsAppButton from "@/components/ui/whatsapp-button";
import { Manrope } from "next/font/google";
import type { Metadata } from "next";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = "https://www.taller85.cl";
const siteName = "Taller 85";
const siteTitle = "Taller 85 | Soluciones para proyectos, espacios y marcas";
const siteDescription =
  "Taller 85 desarrolla soluciones en construcción, espacios, manufactura, branding y media para proyectos, espacios y marcas.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Taller 85",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo-taller85-v2.png",
    shortcut: "/logo-taller85-v2.png",
    apple: "/logo-taller85-v2.png",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Taller 85 | Soluciones para proyectos, espacios y marcas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og/og-home.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={manrope.variable}>
      <meta name="google-site-verification" content="Xs1yfClgiuA2qr6L0weBNXAYOK1jpd7SzlcX83954eI" />
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Header />

        <main className="flex-1 pt-[88px]">{children}</main>

        <footer className="border-t border-black/5 py-6 text-center text-sm text-slate-500">
          © 2026 Taller 85 · Soluciones para proyectos, espacios y marcas
        </footer>

        <WhatsAppButton />
      </body>
    </html>
  );
}