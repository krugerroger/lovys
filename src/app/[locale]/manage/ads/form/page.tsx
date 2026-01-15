"use client"
import { useEffect, useState } from 'react';
import { Instagram, MessageCircleIcon, Send, Phone, Twitter, Upload, ChevronDown, ChevronUp, X, Check, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AdFormData, ContactSection } from '@/types/adsForm';
import { useAdForm } from '@/hooks/useAdForm';
import { toast } from 'sonner';
import { useUser } from '@/app/[locale]/context/userContext';
import { frenchCitiesForm } from '@/app/[locale]/constants';
import { useScopedI18n } from '../../../../../../locales/client';

export default function CreateAdForm() {
  const { user } = useUser();
  const t = useScopedI18n('Manage.Create' as never) as (key: string, vars?: Record<string, any>) => string;
  
  // States pour la recherche de villes
  const [showCitySearch, setShowCitySearch] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(frenchCitiesForm);
  
  // ✅ CORRECTION : Initialiser rates avec des valeurs par défaut
  const [formData, setFormData] = useState<AdFormData>({
    pending_ad_id: '',
    escort_id: user?.user_id || '',
    title: '',
    email: user?.email || '',
    username: user?.username || '',
    location: { 
      country: 'fr', 
      city: ''
    },
    physicalDetails: {
      age: 0,
      height: 0,
      weight: 0,
      bust: ''
    },
    currency: 'EUR',
    // ✅ CORRECTION : Initialiser rates avec des valeurs par défaut
    rates: {
      thirtyMinutes: 0,
      oneHour: 0,
      twoHours: 0,
      fullNight: 0
    },
    services: {
      analSex: false,
      oralWithoutCondom: false,
      kissing: false,
      cunnilingus: false,
      cumInMouth: false,
      cumInFace: false,
      cumOnBody: false,
      eroticMassage: false,
      striptease: false,
      goldenShower: false,
    },
    contacts: {
      phoneNumber: '',
      whatsapp: '',
      telegram: '',
      instagram: '',
      twitch: '',
      fansly: '',
      onlyfans: '',
      twitter: '',
      signal: ''
    },
    description: '',
    categories: {
      analSex: false,
      asianGirls: false,
      bbw: false,
      bigTits: false,
      blonde: false,
      brunette: false,
      cim: false,
      ebony: false,
      eroticMassage: false,
      europeanGirls: false,
      kissing: false,
      latinaGirls: false,
      mature: false,
      vipGirls: false,
    },
    images: [],
  });

  // ✅ INTÉGRATION DU HOOK AVEC handleCityChange et cityOperations
  const {
    errors,
    isSubmitting,
    submitAd,
    handleChange,
    handleCityChange, // ✅ Fonction pour gérer les villes
    cityOperations, // ✅ Objet avec les opérations pratiques sur les villes
    handlePhysicalDetailsChange,
    handleRateChange,
    handleServiceToggle,
    handleCategoryToggle,
    handleServiceChange,
    handleContactChange,
    handleFileUpload,
  } = useAdForm({ adData: formData, setadData: setFormData });

  // Filtrer les villes basé sur la recherche
  useEffect(() => {
    if (!citySearchTerm.trim()) {
      setFilteredCities(frenchCitiesForm);
    } else {
      const filtered = frenchCitiesForm.filter(city =>
        city.label.toLowerCase().includes(citySearchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchTerm]);

  // ✅ Utilisation de handleCityChange pour gérer les villes
  const toggleCity = (cityValue: string) => {
    handleCityChange('toggle', cityValue);
  };

  const removeCity = (cityValue: string) => {
    handleCityChange('remove', cityValue);
  };

  // Fonction pour obtenir le nom d'une ville
  const getCityLabel = (cityValue: string) => {
    const city = frenchCitiesForm.find(c => c.value === cityValue);
    return city ? city.label : cityValue;
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error(t('messages.loginRequired'));
      return;
    }

    if (user.user_type !== 'escort') {
      toast.error(t('messages.escortOnly'));
      return;
    }

    // ✅ Validation des villes via handleCityChange
    if (formData.location.city.length === 0) {
      toast.error(t('messages.cityRequired'));
      return;
    }

    const result = await submitAd();
    
    if (result?.success) {
      toast.success(t('messages.submitSuccess'));
      
      // Reset form
      setFormData({
        pending_ad_id: '',
        escort_id: user.user_id || '',
        title: '',
        email: user.email || '',
        username: user.username || '',
        location: { 
          country: 'fr', 
          city: '' 
        },
        physicalDetails: { 
          age: 0, 
          height: 0, 
          weight: 0, 
          bust: '' 
        },
        currency: 'EUR',
        rates: { 
          oneHour: 0 
        },
        services: {},
        contacts: {
          phoneNumber: '',
          whatsapp: '',
          telegram: '',
          instagram: '',
          twitch: '',
          fansly: '',
          onlyfans: '',
          twitter: '',
          signal: ''
        },
        description: '',
        categories: {},
        images: [],
      });
    } else {
      toast.error(result?.error || t('messages.submitError'));
    }
  };

  // Mettez à jour votre contactSections
  const contactSections: ContactSection[] = [
    {
      id: "phone",
      title: t('contactSections.phone'),
      fields: [
        {
          id: "phoneNumber",
          name: "phoneNumber",
          icon: <Phone className="w-4 h-4" />,
          bgColor: "bg-blue-500",
          placeholder: t('placeholders.phoneNumber'),
          label: t('fields.phoneNumber'),
          type: "tel",
          required: true
        }
      ]
    },
    {
      id: "messengers",
      title: t('contactSections.messengers'),
      fields: [
        {
          id: "whatsapp",
          name: "whatsapp",
          icon: <MessageCircleIcon className="w-4 h-4" />,
          bgColor: "bg-green-500",
          placeholder: t('placeholders.whatsapp'),
          label: t('fields.whatsapp'),
          type: "text"
        },
        {
          id: "telegram",
          name: "telegram",
          icon: <Send className="w-4 h-4" />,
          bgColor: "bg-blue-400",
          placeholder: t('placeholders.telegram'),
          label: t('fields.telegram'),
          type: "text"
        },
        {
          id: "instagram",
          name: "instagram",
          icon: <Instagram className="w-4 h-4" />,
          bgColor: "bg-pink-500",
          placeholder: t('placeholders.instagram'),
          label: t('fields.instagram'),
          type: "text"
        },
        {
          id: "twitter",
          name: "twitter",
          icon: <Twitter className="w-4 h-4" />,
          bgColor: "bg-black",
          placeholder: t('placeholders.twitter'),
          label: t('fields.twitter'),
          type: "text"
        }
      ]
    }
  ];

  const categories = [
    { key: 'analSex', label: t('categories.analSex') },
    { key: 'asianGirls', label: t('categories.asianGirls') },
    { key: 'bbw', label: t('categories.bbw') },
    { key: 'bigTits', label: t('categories.bigTits') },
    { key: 'blonde', label: t('categories.blonde') },
    { key: 'brunette', label: t('categories.brunette') },
    { key: 'cim', label: t('categories.cim') },
    { key: 'ebony', label: t('categories.ebony') },
    { key: 'eroticMassage', label: t('categories.eroticMassage') },
    { key: 'europeanGirls', label: t('categories.europeanGirls') },
    { key: 'kissing', label: t('categories.kissing') },
    { key: 'latinaGirls', label: t('categories.latinaGirls') },
    { key: 'mature', label: t('categories.mature') },
    { key: 'vipGirls', label: t('categories.vipGirls') },
  ];

  const services = [
    { key: 'analSex', label: t('services.analSex') },
    { key: 'oralWithoutCondom', label: t('services.oralWithoutCondom') },
    { key: 'kissing', label: t('services.kissing') },
    { key: 'cunnilingus', label: t('services.cunnilingus') },
    { key: 'cumInMouth', label: t('services.cumInMouth') },
    { key: 'cumInFace', label: t('services.cumInFace') },
    { key: 'cumOnBody', label: t('services.cumOnBody') },
    { key: 'eroticMassage', label: t('services.eroticMassage') },
    { key: 'striptease', label: t('services.striptease') },
    { key: 'goldenShower', label: t('services.goldenShower') },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-8">{t('title')}</h2>
      
      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {t('fields.adTitle')} <span className="text-red-500">{t('fields.required')}</span>
        </label>
        <input
          type="text"
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={t('placeholders.adTitle')}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Location */}
      <div className="grid min-md:grid-cols-2 gap-6 mb-6">
        {/* Country */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.country')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select 
            value="fr"
            onChange={(e) => handleChange('location', { ...formData.location, country: e.target.value })}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-400"
            disabled
          >
            <option value="fr">{t('countries.fr')}</option>
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2">
            <div className="flex items-center">
              <span>{t('fields.city')}</span>
              <span className="text-red-500 ml-1">{t('fields.required')}</span>
            </div>
          </label>
          
          {/* Bouton dropdown */}
          <button
            type="button"
            onClick={() => setShowCitySearch(!showCitySearch)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white hover:border-gray-400"
          >
            <span className={!formData.location.city ? 'text-gray-400' : 'text-gray-900'}>
              {!formData.location.city 
                ? t('placeholders.selectCity')
                : getCityLabel(formData.location.city)
              }
            </span>
            {showCitySearch ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {/* Ville sélectionnée (chip) */}
          {formData.location.city && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {getCityLabel(formData.location.city)}
                <button
                  type="button"
                  onClick={() => {
                    // Effacer la ville sélectionnée
                    handleCityChange('clear');
                  }}
                  className="ml-1 hover:text-blue-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          {/* Dropdown avec sélection unique */}
          {showCitySearch && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-xl max-h-96 overflow-hidden">
              {/* Search input */}
              <div className="sticky top-0 bg-white border-b p-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
                    placeholder={t('placeholders.searchCity')}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {filteredCities.length} {t('messages.citiesAvailable')}
                </p>
              </div>

              {/* Actions rapides */}
              <div className="flex gap-2 p-3 border-b bg-gray-50">
                <button
                  type="button"
                  onClick={() => {
                    handleCityChange('set', 'paris');
                    setShowCitySearch(false);
                    setCitySearchTerm('');
                  }}
                  className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-100"
                >
                  {t('buttons.selectParis')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCityChange('set', 'lyon');
                    setShowCitySearch(false);
                    setCitySearchTerm('');
                  }}
                  className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-100"
                >
                  {t('buttons.selectLyon')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCityChange('set', 'marseille');
                    setShowCitySearch(false);
                    setCitySearchTerm('');
                  }}
                  className="text-xs px-3 py-1 bg-white border rounded hover:bg-gray-100"
                >
                  {t('buttons.selectMarseille')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCityChange('clear');
                    setShowCitySearch(false);
                  }}
                  className="text-xs px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100"
                >
                  {t('buttons.clear')}
                </button>
              </div>

              {/* Liste des villes */}
              <div className="overflow-y-auto max-h-64">
                {filteredCities.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {t('messages.noCitiesFound')}
                  </div>
                ) : (
                  filteredCities.map(city => {
                    const isSelected = formData.location.city === city.value;
                    return (
                      <button
                        key={city.value}
                        type="button"
                        onClick={() => {
                          handleCityChange('set', city.value);
                          setShowCitySearch(false);
                          setCitySearchTerm('');
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-blue-50 ${
                          isSelected ? 'bg-blue-50' : ''
                        }`}
                      >
                        <span className={isSelected ? 'font-medium text-blue-600' : ''}>
                          {city.label}
                        </span>
                        {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {formData.location.city 
                    ? `1 ${t('messages.citySelected')}` 
                    : t('messages.noCitySelected')
                  }
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowCitySearch(false);
                    setCitySearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t('buttons.done')}
                </button>
              </div>
            </div>
          )}

          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Physical Details */}
      <div className="grid min-md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.age')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select
            onChange={(e) => handlePhysicalDetailsChange('age', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            required
          >
            <option value="">{t('placeholders.selectAge')}</option>
            {Array.from({ length: 43 }, (_, i) => i + 18).map((age) => (
              <option key={age} value={age}>
                {age} {t('options.years')}
              </option>
            ))}
          </select>
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.height')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select
            onChange={(e) => handlePhysicalDetailsChange('height', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{t('placeholders.selectHeight')}</option>
            {Array.from({ length: 81 }, (_, i) => i + 120).map((height) => {
              // Conversion en pieds/pouces pour l'affichage
              const feet = Math.floor(height / 30.48);
              const inches = Math.round((height / 30.48 - feet) * 12);
              
              return (
                <option key={height} value={height}>
                  {height}cm / {feet}'{inches}"
                </option>
              );
            })}
          </select>
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.weight')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select
            onChange={(e) => handlePhysicalDetailsChange('weight', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{t('placeholders.selectWeight')}</option>
            {Array.from({ length: 86 }, (_, i) => i + 35).map((weight) => {
              const lbs = Math.round(weight * 2.20462);
              return (
                <option key={weight} value={weight}>
                  {weight}kg / {lbs}lbs
                </option>
              );
            })}
          </select>
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.bust')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select
            onChange={(e) => handlePhysicalDetailsChange('bust', e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('options.select')}</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="DD">DD+</option>
          </select>
          {errors.bust && <p className="text-red-500 text-sm mt-1">{errors.bust}</p>}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Currency & Rates */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          {t('fields.currency')} <span className="text-red-500">{t('fields.required')}</span>
        </label>
        <select 
          onChange={(e) => handleChange('currency', e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="EUR">{t('currencies.EUR')}</option>
          <option value="USD">{t('currencies.USD')}</option>
          <option value="GBP">{t('currencies.GBP')}</option>
        </select>
      </div>

      <div className="grid min-md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.thirtyMinutes')} <span className="text-red-500">{t('fields.required')}</span></label>
          <input
            type="number"
            onChange={(e) => handleRateChange('thirtyMinutes', parseFloat(e.target.value) || 0)}
            placeholder={t('placeholders.thirtyMinutes')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.oneHour')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <input
            type="number"
            onChange={(e) => handleRateChange('oneHour', parseFloat(e.target.value) || 0)}
            placeholder={t('placeholders.oneHour')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.oneHour && <p className="text-red-500 text-sm mt-1">{errors.oneHour}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.twoHours')} <span className="text-red-500">{t('fields.required')}</span></label>
          <input
            type="number"
            onChange={(e) => handleRateChange('twoHours', parseFloat(e.target.value) || 0)}
            placeholder={t('placeholders.twoHours')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.fullNight')} <span className="text-red-500">{t('fields.required')}</span></label>
          <input
            type="number"
            onChange={(e) => handleRateChange('fullNight', parseFloat(e.target.value) || 0)}
            placeholder={t('placeholders.fullNight')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('sections.services')}</h3>
        <div className="space-y-2">
          {services.map(({ key, label }) => {
            const isChecked = formData.services[key as keyof typeof formData.services] === true;
            return(
              <div key={key} className="flex items-center justify-between py-3 border-b">
                <span className="font-medium">{label}</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={key}
                      checked={isChecked}
                      onChange={() => handleServiceToggle(key, true)}
                      className="w-4 h-4"
                    />
                    <span>{t('options.yes')}</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={key}
                      checked={!isChecked}
                      onChange={() => handleServiceToggle(key, false)}
                      className="w-4 h-4"
                    />
                    <span>{t('options.no')}</span>
                  </label>
                </div>
              </div>
            )}
          )}
        </div>
      </div>

      {/* Contacts */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('sections.contacts')}</h3>
        {contactSections.map(section => (
          <div key={section.id} className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-3">{section.title}</h4>
            <div className="space-y-3">
              {section.fields.map(field => {
                const isRequiredField = 'required' in field && field.required === true;
                
                return (
                  <div key={field.id} className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${field.bgColor} rounded-lg flex items-center justify-center text-white`}>
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      onChange={(e) => handleContactChange(field.name as any, e.target.value)}
                      placeholder={field.placeholder}
                      className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required={isRequiredField}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          {t('fields.description')} <span className="text-red-500">{t('fields.required')}</span>
        </label>
        <textarea
          rows={6}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder={t('placeholders.description')}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('sections.categories')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map(({ key, label }) => {
            const isChecked = formData.categories[key as keyof typeof formData.categories] === true;
            return (
              <label 
                key={key} 
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={isChecked}
                  onChange={(e) => handleCategoryToggle(key, e.target.checked)}
                  className="w-5 h-5 accent-pink-500 cursor-pointer" 
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Images */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('messages.uploadImages')} (max 10)</h3>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files!, 'images')}
          className="hidden"
        />
        <label 
          htmlFor="images" 
          className="flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <Upload className="w-5 h-5" />
          <span>{t('messages.uploadImages')} ({formData.images.length}/10)</span>
        </label>
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = formData.images.filter((_, i) => i !== index);
                    handleChange('images', newImages);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
      </div>
      
      {/* Vidéo */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('messages.uploadVideo')}</h3>

        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleChange('video', file)
          }}
          className="hidden"
        />

        <label
          htmlFor="video"
          className="flex items-center justify-center gap-2 w-full py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <Upload className="w-5 h-5" />
          <span>{t('messages.uploadButton')}</span>
        </label>

        {formData.video && (
          <div className="mt-4 relative w-full max-w-md">
            <video
              src={URL.createObjectURL(formData.video)}
              controls
              className="w-full h-48 object-cover rounded-lg"
            />

            <button
              type="button"
              onClick={() => handleChange('video', null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}

        {errors.video && (
          <p className="text-red-500 text-sm mt-1">{errors.video}</p>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handlePublish}
        disabled={isSubmitting}
        className="w-full py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 font-semibold text-lg"
      >
        {isSubmitting ? t('buttons.publishing') : t('buttons.publish')}
      </button>
    </div>
  );
}