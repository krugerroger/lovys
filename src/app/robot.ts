import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Next.js interne
          '/_next/',

          // Routes API → jamais à indexer
          '/api/',

          // Auth
          '/*/login',
          '/*/register/',
          '/*/adminLogin',

          // Admin
          '/*/admin/',

          // Espace escorte connectée
          '/*/manage/',

          // Espace client connecté
          '/*/profile/',
        ],
      },
    ],
    sitemap: 'https://lovira.one/sitemap.xml',
  };
}