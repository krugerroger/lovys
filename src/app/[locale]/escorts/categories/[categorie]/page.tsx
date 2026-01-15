// app/[locale]/escorts/categories/[categorie]/page.tsx
import { availableCategories } from '@/app/[locale]/constants';
import EscortCard from '@/components/EscortCard';
import { createClient } from '@/lib/supabase/client';
import { Tag, MapPin, Users, Filter, Check, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getScopedI18n } from '../../../../../../locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { Metadata } from 'next';

// Fonction pour formater le nom de la catégorie (ALGORITHME - PAS TOUCHÉ)
const formatCategoryName = (slug: string) => {
  const category = availableCategories.find(cat => cat.key === slug);
  return category?.label || slug.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
};

interface PageProps {
  params: Promise<{ locale: string; categorie: string }>;
}

// Fonction serveur pour récupérer les annonces (ALGORITHME - PAS TOUCHÉ)
async function getCategoryAds(categoryKey: string) {
  try {
    const supabase = createClient();
    
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('status', 'approved')
      .eq(`categories->${categoryKey}`, true);

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    const sortedAds = (ads || []).sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return sortedAds;
    
  } catch (error) {
    console.error('Error fetching category ads:', error);
    return [];
  }
}

// Fonction pour récupérer les statistiques (ALGORITHME - PAS TOUCHÉ)
function getCityStats(ads: any[]) {
  const cityMap = new Map<string, number>();
  
  ads.forEach(ad => {
    const cities = ad.location?.city;
    if (cities && Array.isArray(cities)) {
      cities.forEach((city: string) => {
        if (city) {
          const count = cityMap.get(city) || 0;
          cityMap.set(city, count + 1);
        }
      });
    }
  });
  
  return {
    totalCities: cityMap.size,
    topCities: Array.from(cityMap.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([city]) => city)
  };
}

// Générer les chemins statiques (ALGORITHME - PAS TOUCHÉ)
export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const params = [];
  
  for (const locale of locales) {
    for (const category of availableCategories) {
      params.push({ locale, categorie: category.key });
    }
  }
  
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city } = await params;
  
  return {
    title: `Escorts à ${city} | VotreSite`,
    description: `Trouvez des escortes à ${city}. Profitez de nos services...`,
    openGraph: {
      title: `Escorts à ${city}`,
      description: `Escortes disponibles à ${city}`,
    },
  };
}

export default async function CategoryEscortsPage({ params }: PageProps) {
  const { locale, categorie } = await params;
  setStaticParamsLocale(locale); // ← CETTE LIGNE EST CRITIQUE
  const t = await getScopedI18n('Escorts');
  const categoryName = formatCategoryName(categorie);
  const currentCategory = availableCategories.find(cat => cat.key === categorie);
  
  // Récupérer les données (ALGORITHME - PAS TOUCHÉ)
  const ads = await getCategoryAds(categorie);
  const cityStats = getCityStats(ads);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 py-8 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
                <Link 
                  href={`/${locale}/escorts/categories`}
                  className="hover:text-pink-300 hover:underline transition-colors"
                >
                  {t('CategoryPage.breadcrumb.categories')}
                </Link>
                <ChevronRight className="w-3 h-3 text-gray-500" />
                <span className="font-medium text-pink-300">{categoryName}</span>
              </div>
              
              {/* Titre et icône */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg">
                  <span className="text-2xl">{currentCategory?.icon}</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Escorts <span className="text-pink-400">{categoryName}</span>
                  </h1>
                  <p className="text-gray-300 mt-1">
                    {currentCategory?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-5 border border-gray-700 shadow-lg">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{ads.length}</div>
                  <div className="text-sm text-gray-400">{t('CategoryPage.header.profiles')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{cityStats.totalCities}</div>
                  <div className="text-sm text-gray-400">{t('CategoryPage.header.cities')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {cityStats.topCities.length > 0 ? cityStats.topCities.length : '0'}
                  </div>
                  <div className="text-sm text-gray-400">{t('CategoryPage.header.topCities')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre de filtres */}
        {ads.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">{t('CategoryPage.filters.filterByCity')}</span>
                {cityStats.topCities.map(city => (
                  <Link
                    key={city}
                    href={`/${locale}/escorts/${city.toLowerCase()}`}
                    className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-700 hover:border-pink-500/50 rounded-full hover:bg-gray-700 transition-colors text-gray-300 hover:text-white"
                  >
                    {city}
                  </Link>
                ))}
                {cityStats.totalCities > 3 && (
                  <button className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-300">
                    +{cityStats.totalCities - 3} autres
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <select className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                <option value="newest">{t('CategoryPage.filters.sortBy.newest')}</option>
                <option value="price_asc">{t('CategoryPage.filters.sortBy.priceAsc')}</option>
                <option value="price_desc">{t('CategoryPage.filters.sortBy.priceDesc')}</option>
                <option value="popular">{t('CategoryPage.filters.sortBy.popular')}</option>
              </select>
            </div>
          </div>
        )}

        {/* Affichage des annonces */}
        {ads.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-900/30 to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-pink-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-3">
              {t('CategoryPage.empty.title')}
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Aucune escort ne correspond actuellement à la catégorie "{categoryName}".
              Revenez bientôt ou explorez d'autres catégories.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href={`/${locale}/escorts/categories`}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-lg"
              >
                {t('CategoryPage.empty.viewAllCategories')}
              </Link>
              <Link
                href={`/${locale}`}
                className="px-5 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
              >
                {t('CategoryPage.empty.backHome')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Grid des annonces */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <div key={ad.escort_id || ad.pending_ad_id || ad.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative">
                    <EscortCard 
                      ad={ad}
                      adId={ad.pending_ad_id}
                      city={ad.location.city}
                      showActions={true}
                    />
                    {/* Badge de catégorie */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm rounded-full text-xs font-medium text-white flex items-center gap-1.5 border border-pink-500/30 shadow-lg">
                        <Check className="w-3 h-3 text-green-400" />
                        {categoryName}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {ads.length > 12 && (
              <div className="flex justify-center items-center gap-3 mt-12 pt-8 border-t border-gray-800/50">
                <button className="px-4 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm shadow-lg">
                  {t('CategoryPage.pagination.previous')}
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-9 h-9 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-sm shadow-lg">1</button>
                  <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">2</button>
                  <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">3</button>
                  <span className="text-gray-600 mx-2">•••</span>
                  <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors">5</button>
                </div>
                <button className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:opacity-90 rounded-lg transition-opacity text-sm shadow-lg">
                  {t('CategoryPage.pagination.next')}
                </button>
              </div>
            )}
          </>
        )}

        {/* Catégories similaires */}
        <div className="mt-16 pt-10 border-t border-gray-800/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-400" />
              {t('CategoryPage.similar.title')}
            </h3>
            <Link 
              href={`/${locale}/escorts/categories`}
              className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
            >
              {t('CategoryPage.similar.viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableCategories
              .filter(cat => cat.key !== categorie)
              .sort(() => Math.random() - 0.5)
              .slice(0, 6)
              .map((category) => (
                <Link
                  key={category.key}
                  href={`/${locale}/escorts/categories/${category.key}`}
                  className="group bg-gray-800/50 border border-gray-700/50 hover:border-pink-500/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-pink-900/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-900/50 rounded-lg group-hover:bg-pink-900/30 transition-colors">
                      <span className="text-xl">{category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white group-hover:text-pink-300 transition-colors">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{category.description}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Information sur la catégorie */}
        <div className="mt-12 bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-700 shadow-lg">
              <Tag className="w-6 h-6 text-pink-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-3">
                À propos des escorts <span className="text-pink-300">{categoryName.toLowerCase()}</span>
              </h3>
              <div className="text-gray-300 text-sm space-y-3">
                <p>
                  La catégorie <span className="text-pink-300 font-medium">"{categoryName}"</span> regroupe des escorts qui correspondent 
                  spécifiquement à ce critère. Chaque profil a été vérifié manuellement 
                  pour assurer la correspondance avec la catégorie.
                </p>
                <p>
                  {t('CategoryPage.about.description2')}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-4 text-xs text-gray-400 border-t border-gray-700/50">
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-full">
                    <Check className="w-3 h-3 text-green-400" />
                    <span>{t('CategoryPage.about.verifiedProfiles')}</span>
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-full">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span>{ads.length} annonces actives</span>
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-full">
                    <MapPin className="w-3 h-3 text-purple-400" />
                    <span>{cityStats.totalCities} villes disponibles</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conseils de recherche */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Filter className="w-4 h-4 text-pink-400" />
              {t('CategoryPage.tips.searchTip.title')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('CategoryPage.tips.searchTip.description')}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              {t('CategoryPage.tips.verifiedProfiles.title')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('CategoryPage.tips.verifiedProfiles.description')}
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              {t('CategoryPage.tips.updates.title')}
            </h4>
            <p className="text-gray-400 text-sm">
              {t('CategoryPage.tips.updates.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}