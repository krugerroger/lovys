// src/constants/categories.ts
export interface Category {
  key: string;
  label: string;
  icon: string;
}

export const categories: Category[] = [
  { key: 'analSex', label: 'Anal sex', icon: '🍑' },
  { key: 'asianGirls', label: 'Asian girls', icon: '🌸' },
  { key: 'bbw', label: 'BBW', icon: '🔥' },
  { key: 'bigTits', label: 'Big tits', icon: '🍒' },
  { key: 'blonde', label: 'Blonde', icon: '💛' },
  { key: 'brunette', label: 'Brunette', icon: '🤎' },
  { key: 'cim', label: 'CIM', icon: '💦' },
  { key: 'ebony', label: 'Ebony', icon: '🖤' },
  { key: 'eroticMassage', label: 'Erotic massage', icon: '💆‍♀️' },
  { key: 'europeanGirls', label: 'European girls', icon: '🌍' },
  { key: 'kissing', label: 'Kissing', icon: '💋' },
  { key: 'latinaGirls', label: 'Latina girls', icon: '🔥' },
  { key: 'mature', label: 'Mature', icon: '👩' },
  { key: 'vipGirls', label: 'VIP girls', icon: '👑' },
];

export const availableCategories: { key: string; label: string; icon: string; description: string }[] = [
  { key: 'ebony', label: 'Ebony', icon: '🌑', description: 'Profils afro-descendants' },
  { key: 'analSex', label: 'Sexe Anal', icon: '⭐', description: 'Prestations anales' },
  { key: 'bigTits', label: 'Gros Seins', icon: '🍒', description: 'Poitrine généreuse' },
  { key: 'kissing', label: 'Baisers', icon: '💋', description: 'French kiss' },
  { key: 'vipGirls', label: 'VIP', icon: '👑', description: 'Escorts haut de gamme' },
  { key: 'bbw', label: 'BBW', icon: '👗', description: 'Curvy et voluptueuse' },
  { key: 'cim', label: 'CIM', icon: '💦', description: 'Prestations spécifiques' },
  { key: 'blonde', label: 'Blonde', icon: '👱‍♀️', description: 'Cheveux blonds' },
  { key: 'mature', label: 'Mature', icon: '👩‍🦳', description: '+35 ans' },
  { key: 'brunette', label: 'Brune', icon: '👩‍🦱', description: 'Cheveux bruns' },
  { key: 'asianGirls', label: 'Asiatique', icon: '🌸', description: 'Origine asiatique' },
  { key: 'latinaGirls', label: 'Latina', icon: '💃', description: 'Origine latino' },
  { key: 'eroticMassage', label: 'Massage', icon: '💆', description: 'Massage érotique' },
  { key: 'europeanGirls', label: 'Européenne', icon: '🇪🇺', description: 'Origine européenne' },
];

export const categoryLabels: Record<string, string> = {
    analSex: "Anal sex",
    asianGirls: "Asian girls",
    bbw: "BBW",
    bigTits: "Big tits",
    blonde: "Blonde",
    brunette: "Brunette",
    cim: "CIM",
    ebony: "Ebony",
    eroticMassage: "Erotic massage",
    europeanGirls: "European girls",
    kissing: "Kissing",
    latinaGirls: "Latina girls",
    mature: "Mature",
    vipGirls: "VIP girls",
  };