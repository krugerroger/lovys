"use client";
// app/[locale]/page.tsx
import React, { useEffect, useState } from 'react';
import { MapPin, Search, Heart, Phone, Star, Shield, TrendingUp, X, ChevronDown, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';
import { PreviewAdData } from '@/types/adsForm';
import { createClient } from '@/lib/supabase/client';
import EscortCard from '@/components/EscortCard';
import { frenchCities, languages, categories, popularCities } from './constants';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '../../../locales/client';
import { LocaleSelect } from '@/components/LocaleSelect';

// Helper function to slugify city names
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export default function LadysOneHome() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [searchCity, setSearchCity] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [featuredEscorts, setFeaturedEscorts] = useState<PreviewAdData[]>([]);
  const [loadingEscorts, setLoadingEscorts] = useState(true);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const t = useScopedI18n('HomePage' as never) as (key: string, vars?: Record<string, any>) => string;
  // Charger les recherches récentes depuis localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentCitySearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Sauvegarder les recherches récentes
  const saveSearch = (city: string) => {
    const updatedSearches = [
      city,
      ...recentSearches.filter(s => s !== city)
    ].slice(0, 5); // Garder seulement 5 recherches récentes
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentCitySearches', JSON.stringify(updatedSearches));
  };

  // Filtrer les villes basé sur la recherche
  useEffect(() => {
    if (searchCity.trim() === '') {
      setFilteredCities([]);
      return;
    }

    const filtered = frenchCities.filter(city =>
      city.toLowerCase().includes(searchCity.toLowerCase())
    ).slice(0, 10); // Limiter à 10 résultats

    setFilteredCities(filtered);
  }, [searchCity]);

  // Charger les escorts en vedette
  useEffect(() => {
    const fetchFeaturedEscorts = async () => {
      setLoadingEscorts(true);
      try {
        const supabase = createClient();
        
        // Récupérer 6 annonces approuvées aléatoires
        const { data: ads, error } = await supabase
          .from('pending_ads')
          .select('*')
          .eq('status', 'approved')
          .limit(6);

        if (error) {
          console.error('Error fetching escorts:', error);
          return;
        }

        setFeaturedEscorts(ads || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingEscorts(false);
      }
    };

    fetchFeaturedEscorts();
  }, []);

  // Fonction de recherche
  const handleSearch = (cityName?: string) => {
    const cityToSearch = cityName || selectedCity;
    
    if (!cityToSearch || cityToSearch.trim() === '') {
      // Si aucune ville sélectionnée, aller à la page générale
      router.push('/escorts');
      return;
    }

    // Sauvegarder la recherche
    saveSearch(cityToSearch);

    // Convertir le nom de la ville en slug
    const citySlug = slugify(cityToSearch);
    
    // Rediriger vers la page de la ville
    router.push(`/escorts/${citySlug}`);
  };

  // Recherche par input texte
  const handleTextSearch = () => {
    if (searchQuery.trim() === '') return;
    
    // Trouver la ville la plus proche dans la liste
    const matchedCity = frenchCities.find(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedCity) {
      setSelectedCity(matchedCity);
      handleSearch(matchedCity);
    } else {
      // Si pas trouvé, essayer avec le texte tel quel
      handleSearch(searchQuery);
    }
    setSearchQuery('');
  };

  // Sélectionner une ville du dropdown
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchCity('');
    setShowCityDropdown(false);
    handleSearch(city);
  };

  // Recherche rapide par ville populaire
  const handlePopularCityClick = (city: string) => {
    setSelectedCity(city);
    handleSearch(city);
  };

  // Recherche par région
  const handleRegionSearch = (region: string) => {
    // Pour simplifier, on prend la première ville majeure de la région
    const regionCities: { [key: string]: string } = {
      "Île-de-France": "Paris",
      "Provence-Alpes-Côte d'Azur": "Marseille",
      "Auvergne-Rhône-Alpes": "Lyon",
      "Occitanie": "Toulouse",
      "Nouvelle-Aquitaine": "Bordeaux",
      "Hauts-de-France": "Lille"
    };
    
    const mainCity = regionCities[region];
    if (mainCity) {
      setSelectedCity(mainCity);
      handleSearch(mainCity);
    }
  };

  // Effacer la recherche
  const clearSearch = () => {
    setSelectedCity('');
    setSearchCity('');
    setSearchQuery('');
    setFilteredCities([]);
  };

  // Effacer une recherche récente
  const clearRecentSearch = (city: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== city);
    setRecentSearches(updated);
    localStorage.setItem('recentCitySearches', JSON.stringify(updated));
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim() !== '') {
        handleTextSearch();
      } else if (selectedCity) {
        handleSearch();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header/>
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-900/20 via-purple-900/20 to-blue-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('hero.title')} <span className="text-pink-400">France</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* ✅ NOUVELLE SECTION - Escorts en vedette */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recherche */}
          <div className="lg:col-span-2">
            {/* Search Box */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-pink-400" />
                {t('search.title')}
              </h2>
              
              <div className="space-y-6">
                {/* Recherche par ville avec autocomplétion */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    {t('search.city.label')}
                  </label>
                  
                  <div className="relative">
                    {/* Dropdown de sélection de ville */}
                    <div className="relative">
                      <button
                        onClick={() => setShowCityDropdown(!showCityDropdown)}
                        className="w-full mt-4 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <span className={selectedCity ? 'text-white' : 'text-gray-400'}>
  {selectedCity || t('search.city.placeholder')}
</span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} />
                      </button>

                      {showCityDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-lg max-h-96 overflow-y-auto">
                          <div className="p-3 border-b border-gray-700">
                            <input
                              type="text"
                              value={searchCity}
                              onChange={(e) => setSearchCity(e.target.value)}
                              placeholder={t('search.city.filterPlaceholder')}
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                            />
                          </div>

                          {/* Villes récemment recherchées */}
                          {recentSearches.length > 0 && searchCity === '' && (
                            <div className="p-2 border-b border-gray-700">
                              <p className="text-xs text-gray-400 px-3 py-1">{t('search.city.recent')}</p>
                              {recentSearches.map((city) => (
                                <div
                                  key={`recent-${city}`}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-800 rounded-lg flex justify-between items-center group"
                                >
                                  <button
                                    onClick={() => handleCitySelect(city)}
                                    className="flex items-center gap-2 flex-1 text-left"
                                  >
                                    <MapPin className="w-3 h-3 text-gray-500" />
                                    {city}
                                  </button>
                                  <button
                                    onClick={(e) => clearRecentSearch(city, e)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white ml-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Villes filtrées */}
                          <div className="max-h-60 overflow-y-auto">
                            {(searchCity ? filteredCities : frenchCities.slice(0, 50)).map((city) => (
                              <button
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className={`w-full px-3 py-3 text-left hover:bg-gray-800 border-b border-gray-800 last:border-b-0 ${selectedCity === city ? 'bg-pink-900/20 text-pink-300' : ''}`}
                              >
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <div>
                                    <div className="font-medium">{city}</div>
                                    <div className="text-xs text-gray-400">
                                      {popularCities.includes(city) ? t('search.city.popularBadge') : t('search.city.availableBadge')}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                            
                            {searchCity && filteredCities.length === 0 && (
                              <div className="p-4 text-center text-gray-400">
                                {t('search.city.noResults', { search: searchCity })}
                              </div>
                            )}
                          </div>

                          {/* Voir toutes les villes */}
                          {!searchCity && (
                            <div className="p-3 border-t border-gray-700 bg-gray-900/50">
                              <Link
                                href="/escorts"
                                className="block w-full text-center py-2 text-pink-400 hover:text-pink-300 text-sm font-medium"
                              >
                                {t('search.city.seeAllCities')}
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>


                {/* Bouton de recherche principal */}
                <button
                  onClick={() => handleSearch()}
                  disabled={!selectedCity}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {selectedCity ? t('search.searchButton.withCity', { city: selectedCity.toUpperCase() }) : t('search.searchButton.withoutCity')}
                  <Search className="w-5 h-5" />
                </button>

                {/* Badges de confiance */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-lg">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>{t('search.trustBadges.secure')}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900/50 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{t('search.trustBadges.reviews')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catégories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-pink-400" />
                {t('categories.title')}
              </h2>
              <div className="flex flex-wrap items-center gap-0.5">
                {categories.map((category, index) => (
                  <div key={category.key} className="flex items-center">
                    <Link
                      href={`/escorts/categories/${category.key}`}
                      className="px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors whitespace-nowrap border border-gray-700/50 hover:border-pink-500/30"
                    >
                      {category.label}
                    </Link>
                    {index < categories.length - 1 && (
                      <span className="mx-0.5 text-gray-500 text-xs">/</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Villes populaires et avis */}
          <div className="space-y-8">
            {/* Villes populaires */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-pink-400" />
                {t('popularCities.title')}
              </h2>
              
              {/* Statistiques */}
              <div className="mb-4 p-3 bg-gray-900/30 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{frenchCities.length}</div>
                    <div className="text-xs text-gray-400">{t('popularCities.stats.frenchCities')}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{popularCities.length}</div>
                    <div className="text-xs text-gray-400">{t('popularCities.stats.popularCities')}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handlePopularCityClick(city)}
                    className={`w-full px-4 py-3 rounded-lg transition-all text-left flex justify-between items-center ${
                      selectedCity === city 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-900/50 hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {city}
                    </span>
                    {/* <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                      {city === 'Paris' ? '500+' : 
                       city === 'Lyon' ? '200+' : 
                       city === 'Marseille' ? '180+' : '100+'} annonces
                    </span> */}
                  </button>
                ))}
              </div>
              
              <Link 
                href="/escorts" 
                className="block w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition text-center"
              >
                {t('popularCities.exploreAll')}
              </Link>
            </div>

            {/* Recherches récentes */}
            {recentSearches.length > 0 && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  {t('recentSearches.title')}
                </h2>
                <div className="space-y-2">
                  {recentSearches.map((city) => (
                    <div key={city} className="flex items-center justify-between group">
                      <button
                        onClick={() => handleCitySelect(city)}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3" />
                        {city}
                      </button>
                      <button
                        onClick={(e) => clearRecentSearch(city, e)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Escorts en vedette */}
        <div className="my-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              {t('featuredEscorts.title')}
            </h2>
            <Link
              href="/escorts"
              className="text-pink-400 hover:text-pink-300 font-medium flex items-center gap-2"
            >
              {t('featuredEscorts.viewAll')}
              <Search className="w-4 h-4" />
            </Link>
          </div>

          {loadingEscorts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800/30 rounded-2xl p-6 animate-pulse">
                  <div className="h-64 bg-gray-700 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredEscorts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredEscorts.map((escort) => (
                <EscortCard
                  key={escort.escort_id}
                  ad={escort}
                  showActions={true}
                  city={
                    Array.isArray(escort.location?.city)
                      ? escort.location.city[0]
                      : escort.location?.city || 'Inconnue'
                  }
                  adId={escort.pending_ad_id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('featuredEscorts.empty.title')}</h3>
              <p className="text-gray-400">{t('featuredEscorts.empty.description')}</p>
            </div>
          )}
        </div>

        {/* Régions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-pink-400" />
            {t('regions.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { region: "Île-de-France", cities: 45, mainCity: "Paris" },
              { region: "Provence-Alpes-Côte d'Azur", cities: 22, mainCity: "Marseille" },
              { region: "Auvergne-Rhône-Alpes", cities: 28, mainCity: "Lyon" },
              { region: "Occitanie", cities: 18, mainCity: "Toulouse" },
              { region: "Nouvelle-Aquitaine", cities: 24, mainCity: "Bordeaux" },
              { region: "Hauts-de-France", cities: 16, mainCity: "Lille" }
            ].map((region) => (
              <button
                key={region.region}
                onClick={() => handleRegionSearch(region.region)}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:border-pink-500/30 transition-all cursor-pointer group text-left"
              >
                <h3 className="font-semibold text-white group-hover:text-pink-300 transition mb-2">
                  {region.region}
                </h3>
                <p className="text-sm text-gray-400">{region.cities} {t('regions.citiesCount')}</p>
                <div className="mt-2 text-xs text-gray-500 group-hover:text-gray-400">
                  {t('regions.seeCity', { city: region.mainCity })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">1,765,491+</div>
            <div className="text-gray-400">{t('stats.verifiedReviews')}</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{frenchCities.length}+</div>
            <div className="text-gray-400">{t('stats.citiesCovered')}</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-400">{t('stats.customerSupport')}</div>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-gray-400">{t('stats.verifiedAds')}</div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-gray-500 border-t border-gray-800/50 pt-8">
          <p className="mb-2">
            {t('footer.terms')} {' '}
            <a href="#" className="text-pink-400 hover:text-pink-300 underline">
              {t('footer.termsLink')}
            </a>
            {' '} & {' '}
            <a href="#" className="text-pink-400 hover:text-pink-300 underline">
              {t('footer.privacyLink')}
            </a>.
          </p>
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </div>
  );
}