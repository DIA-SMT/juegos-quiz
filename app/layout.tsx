import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";

import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ruleta Educativa | Prevención de adicciones",
  description:
    "Girá la ruleta y poné a prueba tus conocimientos sobre prevención de adicciones y bienestar.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1763E0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${nunito.variable} ${fredoka.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
