import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Cinzel } from "next/font/google";
import { LocaleProvider } from "@/i18n/client";
import { MESSAGES } from "@/i18n/messages";
import { getLocale } from "@/i18n/server";
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
  metadataBase: new URL("https://tusst.dev"),
  title: "TUSST — The Ultimate Stellar Supreme Tutorial",
  description:
    "Hands-on, gamified coding challenges. Master Rust first, then ship real Soroban smart contracts on Stellar. No setup — just code.",
  keywords: [
    "Stellar",
    "Soroban",
    "Rust",
    "smart contracts",
    "learn to code",
    "gamified",
    "web3",
  ],
  authors: [{ name: "TUSST" }],
  creator: "TUSST",
  openGraph: {
    title: "TUSST — The Ultimate Stellar Supreme Tutorial",
    description:
      "Hands-on, gamified coding challenges. Master Rust first, then ship real Soroban smart contracts on Stellar. No setup — just code.",
    url: "https://tusst.dev",
    siteName: "TUSST",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/sky-shattered.png",
        width: 1200,
        height: 630,
        alt: "TUSST — forge your path from Rust to Stellar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TUSST — The Ultimate Stellar Supreme Tutorial",
    description:
      "Hands-on, gamified coding challenges. Master Rust first, then ship real Soroban smart contracts on Stellar. No setup — just code.",
    images: ["/sky-shattered.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-fg">
        <LocaleProvider locale={locale} messages={MESSAGES[locale]}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
