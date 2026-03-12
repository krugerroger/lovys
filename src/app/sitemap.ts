import { MetadataRoute } from 'next';

const BASE_URL = 'https://lovira.one';

const locales = ['fr', 'en', 'de', 'es'];

const popularCitySlugs = [
  "paris", "lyon", "marseille", "nice", "toulouse", "bordeaux",
  "lille", "nantes", "strasbourg", "montpellier", "rennes", "grenoble",
  "aix-en-provence", "ajaccio", "amiens", "angers", "annecy",
  "avignon", "besancon", "brest", "caen", "clermont-ferrand", "cannes",
  "dijon", "le-havre", "le-mans", "limoges", "metz", "mulhouse",
  "nancy", "orleans", "perpignan", "reims", "rouen", "saint-denis",
  "toulon", "tours", "valence"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Pages d'accueil par locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
  }

  // Page listing escorts par locale
  for (const locale of locales) {
    entries.push({
      url: `${BASE_URL}/${locale}/escorts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });
  }

  // Pages villes par locale
  for (const locale of locales) {
    for (const city of popularCitySlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/escorts/${city}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.8,
      });
    }
  }

  return entries;
}