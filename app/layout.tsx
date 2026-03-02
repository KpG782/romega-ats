import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Romega ATS",
  description: "Internal Applicant Tracking System — Romega Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-theme="light" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
