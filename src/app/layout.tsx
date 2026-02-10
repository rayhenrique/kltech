import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "KL Tecnologia — Engenharia Full Stack & Soluções Digitais",
  description:
    "Desenvolvimento de software sob medida, sistemas para saúde e governo, e vitrine de produtos digitais. Next.js, TypeScript, Supabase.",
  keywords: [
    "desenvolvimento full stack",
    "sistemas para saúde",
    "automação",
    "Next.js",
    "TypeScript",
    "Supabase",
    "scripts PHP",
    "KL Tecnologia",
  ],
  openGraph: {
    title: "KL Tecnologia — Engenharia Full Stack & Soluções Digitais",
    description:
      "Portfólio de engenharia de software e vitrine de produtos digitais.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
