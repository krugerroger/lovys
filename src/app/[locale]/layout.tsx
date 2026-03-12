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
    default: "Lovira | Trouvez des Escortes Indépendantes Près de Vous",
    template: "%s | Lovira",
  },

  description:
    "Lovira vous aide à trouver des escortes indépendantes et vérifiées près de chez vous. Parcourez les profils locaux, choisissez votre ville et connectez-vous en toute sécurité avec des accompagnatrices de confiance.",

  keywords: [
    "escorte près de moi",
    "services d'escorte locaux",
    "escortes indépendantes",
    "escortes vérifiées",
    "annuaire d'escortes",
    "accompagnement adulte",
    "escorte paris",
    "escorte lille",
    "escorte lyon",
    "escorte marseille",
    "escorte toulouse",
    "plateforme d'escorte discrète",
    "plateforme de réservation d'escortes",
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
    title: "Lovira | Trouvez des Escortes Indépendantes Près de Vous",
    description:
      "Découvrez des escortes indépendantes et de confiance près de chez vous. Parcourez les profils, les villes et connectez-vous discrètement avec Lovira.",
    url: "https://lovira.one",
    siteName: "Lovira",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Annuaire d'escortes Lovira",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Lovira | Escortes Indépendantes Locales",
    description:
      "Trouvez des escortes indépendantes et vérifiées près de chez vous. Navigation sécurisée, discrète et géolocalisée.",
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