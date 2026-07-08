import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Cinzel } from "next/font/google";
import "./globals.css";

const sans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Display face for the campaign layer (act titles, card names): carved
// medieval capitals, matching the painted card set.
const display = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "TUSST — The Ultimate Stellar Supreme Tutorial",
  description:
    "Hands-on, gamified coding challenges. Master Rust first, then ship real Soroban smart contracts on Stellar. No setup — just code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-fg">{children}</body>
    </html>
  );
}
