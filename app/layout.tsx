import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial", "sans-serif"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  preload: true,
  weight: ["400", "600", "700"],
  fallback: ["georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Roméga ATS — Hiring Platform",
  description: "Internal Applicant Tracking System — Roméga Solutions",
  icons: {
    icon: [
      { url: "/public/images/fav-icon.ico" },
      { url: "/public/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/public/icon-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${merriweather.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
