import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";

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
  title: {
    default: "BridgeHold × Torque",
    template: "%s · BridgeHold",
  },
  description:
    "Cross-chain hold streaks as Torque custom events — leaderboards, raffles, and retention loops for protocols.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1 bg-slate-50">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
