import type { Metadata } from "next";
import { Geist, JetBrains_Mono, Cinzel } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const OG_LOCALES = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
  fr: "fr_FR",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const messages = MESSAGES[locale];
  const title = "TUSST — The Ultimate Stellar Supreme Tutorial";
  const description = messages.landing.metaDescription;

  return {
    metadataBase: new URL("https://tusst.xyz"),
    title,
    description,
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
      title,
      description,
      url: "https://tusst.xyz",
      siteName: "TUSST",
      type: "website",
      locale: OG_LOCALES[locale],
      images: [
        {
          url: "/landing/og.jpg",
          width: 1200,
          height: 630,
          alt: messages.landing.metaImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/landing/og.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

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
        <Analytics />
      </body>
    </html>
  );
}
