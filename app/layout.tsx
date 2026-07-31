import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Encuesta Ciudadana 2027 · Riobamba y Chimborazo",
  description:
    "Encuesta ciudadana independiente para medir el pulso político de la Alcaldía de Riobamba y la Prefectura de Chimborazo. No vinculante, no oficial.",
  openGraph: {
    title: "Encuesta Ciudadana 2027 · Riobamba y Chimborazo",
    description: "Participa en la encuesta ciudadana independiente. Toma menos de 2 minutos.",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Encuesta Ciudadana Riobamba 2027",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Encuesta Ciudadana 2027 · Riobamba y Chimborazo",
    description: "Participa en la encuesta ciudadana independiente.",
    images: ["/og-image.png"],
  },
  robots: {
    index: false, // cambiar a true solo cuando el cliente confirme que quiere indexación pública
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-EC" className={`${fraunces.variable} ${publicSans.variable}`}>
      <body className="font-body antialiased bg-bg text-ink">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
