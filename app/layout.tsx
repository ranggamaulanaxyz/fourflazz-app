import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FourFlazz — Beli Pulsa, Data & Produk Digital",
  description:
    "Platform pembelian produk digital terpercaya. Beli pulsa, paket data, token PLN, dan voucher game dengan harga terbaik.",
  keywords: [
    "pulsa",
    "paket data",
    "token PLN",
    "voucher",
    "produk digital",
    "PPOB",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          {children}
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
