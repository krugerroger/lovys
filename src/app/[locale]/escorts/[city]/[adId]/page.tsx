// app/escorts/[city]/[adId]/page.tsx
import { createClient } from '@/lib/supabase/client';
import { 
  MapPin, Clock, Star, MessageSquare, Phone, Mail, 
  Shield, XCircle, Euro,
  Instagram, MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import ReviewSection from '@/components/ReviewSection';
import { ServiceKey } from '@/types/adsForm';
import GallerySection from '@/components/GallerySection';

interface PageProps {
  params: Promise<{ city: string, adId: number }>;
}

// Fonction pour récupérer UNE annonce spécifique
async function getEscortAd(cityName: string, adId: number) {
  try {
    const supabase = createClient();
    
    const { data: ad, error } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('status', 'approved')
      .eq('pending_ad_id', adId)
      .ilike('location->>city', `%${cityName}%`)
      .single(); // ← Important: .single() pour une seule annonce

    if (error) {
      console.error('Supabase error:', error);
      return null;
    }

    return ad;
    
  } catch (error) {
    console.error('Error fetching escort ad:', error);
    return null;
  }
}

// Fonction pour récupérer les annonces similaires
async function getSimilarAds(cityName: string, excludeAdId: number) {
  try {
    const supabase = createClient();
    
    const { data: ads, error } = await supabase
      .from('pending_ads')
      .select('*')
      .eq('status', 'approved')
      .neq('pending_ad_id', excludeAdId) // Exclure l'annonce actuelle
      .ilike('location->>city', `%${cityName}%`)
      .limit(4); // Limiter à 4 annonces similaires

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    return ads;
    
  } catch (error) {
    console.error('Error fetching similar ads:', error);
    return [];
  }
}

export default async function EscortProfilePage({ params }: PageProps) {
  const { city, adId } = await params;
  const cityName = city;

  const serviceLabels: Record<ServiceKey, string> = {
    analSex: "Sexe anal",
    oralWithoutCondom: "Oral sans préservatif",
    kissing: "Bisous",
    cunnilingus: "Cunnilingus",
    cumInMouth: "Cum in mouth (CIM)",
    cumInFace: "Cum in face (CIF)",
    cumOnBody: "Cum on body (COB)",
    eroticMassage: "Massage érotique",
    striptease: "Striptease",
    goldenShower: "Golden shower",
  };

  const categoryLabels: Record<string, string> = {
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
  
  // Récupérer l'annonce spécifique
  const ad = await getEscortAd(cityName, adId);
  
  // Récupérer les annonces similaires
  const similarAds = await getSimilarAds(cityName, adId);

  if (!ad) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Annonce non trouvée</h1>
          <p className="text-gray-400 mb-6">
            Cette annonce n'existe pas ou n'est plus disponible
          </p>
          <Link 
            href={`/escorts/${city}`}
            className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg transition"
          >
            ← Retour aux annonces de {cityName}
          </Link>
        </div>
      </div>
    );
  }

  // Formater les tarifs
  const rates = ad.rates || {};
  const hasRates = Object.values(rates as number).some(rate => rate && rate > 0);

  // Services disponibles (ad.services est un objet, pas un tableau)
  const services = ad.services || {};
  const availableServices = Object.entries(services)
    .filter(([_, value]) => value === true)
    .map(([key]) => key as ServiceKey);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section avec photo principale */}
      <div className="relative">
        {ad.images && ad.images.length > 0 ? (
          <div className="h-96 relative">
            <img 
              src={ad.images[0]} 
              alt={ad.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{ad.title}</h1>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {cityName.charAt(0).toUpperCase() + cityName.slice(1)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                       <span className="flex items-center gap-1">
                          {ad.online ? (
                            <>
                              En ligne
                            </>
                          ) : (
                            <>
                              Hors ligne
                            </>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {ad.verified && (
                      <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Vérifiée
                      </div>
                    )}
                    <div className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {ad.rating?.toFixed(1) || '4.5'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-r from-pink-900/30 via-purple-900/30 to-blue-900/30 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{ad.title}</h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : Informations principales */}
          <div className="lg:col-span-2 space-y-8">
            {/* À propos */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">À propos</h2>
              <p className="text-gray-300 leading-relaxed">
                {ad.description || "Aucune description fournie."}
              </p>
              
              {/* Détails physiques */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <h3 className="font-semibold text-white mb-4">Caractéristiques</h3>
                <div className="space-y-4">
                  {/* Caractéristiques physiques */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {ad.physicalDetails?.age && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Âge</span>
                        <span className="text-white">{ad.physicalDetails.age} ans</span>
                      </div>
                    )}
                    {ad.physicalDetails?.height && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Taille</span>
                        <span className="text-white">{ad.physicalDetails.height} cm</span>
                      </div>
                    )}
                    {ad.physicalDetails?.weight && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Poids</span>
                        <span className="text-white">{ad.physicalDetails.weight} kg</span>
                      </div>
                    )}
                    {ad.physicalDetails?.bust && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Poitrine</span>
                        <span className="text-white">{ad.physicalDetails.bust}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Services - seulement si au moins un service existe */}
                  {availableServices.length > 0 && (
                    <>
                      <h5 className="font-medium text-gray-300 text-sm mt-4 mb-2">Services proposés</h5>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {availableServices.map((serviceKey) => (
                          <div key={serviceKey} className="flex justify-between">
                            <span className="text-gray-400">{serviceLabels[serviceKey]}</span>
                            <span className="text-green-400">✓</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Contacts */}
              {ad.contacts && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="font-semibold text-white mb-4">Contacts</h3>
                  <div className="space-y-2">
                    {ad.contacts.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{ad.contacts.phoneNumber}</span>
                      </div>
                    )}
                    
                    {/* Réseaux sociaux */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {ad.contacts.whatsapp && (
                        <a
                          href={`https://wa.me/${ad.contacts.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </a>
                      )}
                      
                      {ad.contacts.telegram && (
                        <a
                          href={`https://t.me/${ad.contacts.telegram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Telegram
                        </a>
                      )}
                      
                      {ad.contacts.instagram && (
                        <a
                          href={`https://instagram.com/${ad.contacts.instagram.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-pink-400 hover:text-pink-300 text-sm"
                        >
                          <Instagram className="w-4 h-4" />
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* // Dans le JSX, remplacez la section "Galerie photos" par : */}
            {ad.images && ad.images.length > 0 && (
              <GallerySection 
                images={ad.images}
                title="Galerie photos"
                hasWatermark={true}
              />
            )}

                        {/* Section Vidéo */}
            {ad.video_url && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Vidéo de l'escort
                  </h2>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      src={ad.video_url}
                      controls
                      className="w-full h-full object-contain"
                      poster={ad.images?.[0]} // Utiliser la première image comme miniature
                    >
                      Votre navigateur ne supporte pas la lecture de vidéos.
                    </video>
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      Vidéo
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section commentaires */}
            <ReviewSection 
              escortId={ad.escort_id}
              adId={ad.pending_ad_id}
              city={cityName}
            />

            {/* Annonces similaires */}
            {similarAds.length > 0 && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4">Autres escorts à {cityName.charAt(0).toUpperCase() + cityName.slice(1)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {similarAds.map((similarAd) => (
                    <Link 
                      key={similarAd.escort_id}
                      href={`/escorts/${cityName}/${similarAd.pending_ad_id}`}
                      className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-pink-500/30 transition group"
                    >
                      <div className="flex items-start gap-4">
                        {similarAd.images && similarAd.images[0] ? (
                          <img 
                            src={similarAd.images[0]} 
                            alt={similarAd.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">📷</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium group-hover:text-pink-300 transition">
                            {similarAd.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-400">
                              {similarAd.rating?.toFixed(1) || '4.5'}
                            </span>
                          </div>
                          {similarAd.rates && Object.values(similarAd.rates as number).filter(v => v > 0).length > 0 && (
                            <p className="text-sm text-pink-400 mt-1">
                              À partir de {Math.min(...Object.values(similarAd.rates as number).filter(v => v > 0))}€
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar droite : Infos pratiques */}
          <div className="space-y-6">
            {/* Carte de contact (version simplifiée) */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Contacter</h2>
              
              <div className="space-y-4">
                {ad.contacts?.phoneNumber && (
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <Phone className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-sm text-gray-400">Téléphone</p>
                      <p className="font-medium">{ad.contacts.phoneNumber}</p>
                    </div>
                  </div>
                )}
                
                {ad.email && (
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <Mail className="w-5 h-5 text-pink-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{ad.email}</p>
                    </div>
                  </div>
                )}
                
                <button className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Envoyer un message
                </button>
              </div>
            </div>

            {/* Tarifs */}
            {hasRates && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Euro className="w-5 h-5" />
                  Tarifs
                </h2>
                
                <div className="space-y-3">
                  {rates.thirtyMinutes && rates.thirtyMinutes > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                      <span>30 minutes</span>
                      <span className="font-bold text-pink-400">{rates.thirtyMinutes}€</span>
                    </div>
                  )}
                  
                  {rates.oneHour && rates.oneHour > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                      <span>1 heure</span>
                      <span className="font-bold text-pink-400">{rates.oneHour}€</span>
                    </div>
                  )}
                  
                  {rates.twoHours && rates.twoHours > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                      <span>2 heures</span>
                      <span className="font-bold text-pink-400">{rates.twoHours}€</span>
                    </div>
                  )}
                  
                  {rates.fullNight && rates.fullNight > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                      <span>Nuit complète</span>
                      <span className="font-bold text-pink-400">{rates.fullNight}€</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Services (version badges) */}
            {availableServices.length > 0 && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4">Services</h2>
                
                <div className="flex flex-wrap gap-2">
                  {availableServices.map((serviceKey) => (
                    <div 
                      key={serviceKey}
                      className="px-3 py-1.5 bg-pink-500/10 text-pink-400 rounded-full text-sm border border-pink-500/20"
                    >
                      {serviceLabels[serviceKey]}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infos pratiques */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold mb-4">Informations</h2>
              
              <div className="space-y-3">
                {ad.physicalDetails?.age && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Âge</span>
                    <span>{ad.physicalDetails.age} ans</span>
                  </div>
                )}
                
                {ad.physicalDetails?.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taille</span>
                    <span>{ad.physicalDetails.height} cm</span>
                  </div>
                )}
                
                {ad.physicalDetails?.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Poids</span>
                    <span>{ad.physicalDetails.weight} kg</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Statut</span>
                  <span className="flex items-center gap-1">
                    {ad.online ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        En ligne
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        Hors ligne
                      </>
                    )}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Dernière mise à jour</span>
                  <span>{new Date(ad.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Bouton retour */}
            <Link 
              href={`/escorts/${cityName}`}
              className="block w-full py-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-center border border-gray-700/50 transition"
            >
              ← Retour aux annonces
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}