import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrocPDF — Every Document Tool You Need",
  description: "Privacy-first document conversion platform. Convert JPG, PNG, JPEG images to PDF instantly. 100% secure, local in-browser conversion or fast cloud processing. Free, open source, no watermarks.",
  metadataBase: new URL('https://krocpdf.app'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#060608] text-neutral-100 relative">
        <BackgroundEffects />
        <Navbar />
        <main className="flex-1 pt-16 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
