
// utils/slugify.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Normaliser les accents
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères spéciaux par des tirets
    .replace(/(^-|-$)/g, ''); // Supprimer les tirets en début et fin
}

export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Liste prédéfinie de tous les slugs de ville
export const allCitySlugs = [
  "paris", "lyon", "marseille", "nice", "toulouse", "bordeaux", 
  "lille", "nantes", "strasbourg", "montpellier", "rennes", "grenoble",
  "aix-en-provence", "ajaccio", "amiens", "angers", "annecy",
  "avignon", "besancon", "brest", "caen", "cannes", "clermont-ferrand",
  "dijon", "le-havre", "le-mans", "limoges", "metz", "mulhouse",
  "nancy", "orleans", "perpignan", "reims", "rouen", "saint-denis",
  "toulon", "tours", "valence"
];