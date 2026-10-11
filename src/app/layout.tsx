import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { UserProvider } from "@/providers/UserProvider";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Présence — Espace étudiant",
  description: "Scan de présence et suivi des cours",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16233E",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${display.variable} ${sans.variable} font-sans bg-paper text-ink antialiased`}
      >
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
