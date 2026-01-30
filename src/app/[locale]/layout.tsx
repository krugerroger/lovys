// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "./context/userContext";
import { Providers } from "./providers";
import { ReactNode } from "react";

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
    default: "Lovira | Find Local Independent Escorts Near You",
    template: "%s | Lovira",
  },

  description:
    "Lovira helps you find verified, independent escorts near you. Browse local profiles, choose your city, and connect safely with trusted companions.",

  keywords: [
    "escort near me",
    "local escort services",
    "independent escorts",
    "verified escorts",
    "escort directory",
    "adult companionship",
    "escort booking platform",
  ],

  applicationName: "Lovira",

  authors: [{ name: "Lovira" }],
  creator: "Lovira",

  metadataBase: new URL("https://lovira.one"),

  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
      de: "/de",
      es: "/es",
      pt: "/pt",
    },
  },

  openGraph: {
    title: "Lovira | Find Local Independent Escorts Near You",
    description:
      "Discover trusted, independent escorts near your location. Browse profiles, cities, and connect discreetly with Lovira.",
    url: "https://lovira.one",
    siteName: "Lovira",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lovira escort directory",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lovira | Local Independent Escorts",
    description:
      "Find verified independent escorts near you. Safe, discreet, and location-based browsing.",
    images: ["/favicon.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};


// IMPORTANT: Générez les paramètres statiques
export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'fr' }, 
    { locale: 'de' },
    { locale: 'es' },
    { locale: 'pt' }
  ];
}

export default async function LocaleLayout({ params, children }: { params: Promise<{ locale: string }>, children: ReactNode  }) {
  const { locale } = await params
  
  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers locale={locale}>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}