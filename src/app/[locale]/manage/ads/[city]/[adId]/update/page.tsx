"use client"
import { useEffect, useState } from 'react';
import { Instagram, MessageCircleIcon, Send, Phone, Twitter, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AdFormData, ContactSection } from '@/types/adsForm';
import { useAdForm } from '@/hooks/useAdForm';
import { toast } from 'sonner';
import { useUser } from '@/app/[locale]/context/userContext';
import { useParams } from 'next/navigation';
import { useScopedI18n } from '../../../../../../../../locales/client';

export default function UpdateAdForm() {
  const { user, getAdById } = useUser();
  const params = useParams();
  const adId = params.adId as string;
  const city = params.city as string;
  const t = useScopedI18n('Manage.Update' as never) as (key: string, vars?: Record<string, any>) => string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string>();
  const ad = getAdById(adId);
  
  // Initialiser le formulaire avec des valeurs par défaut
  const [formData, setFormData] = useState<AdFormData>({
    pending_ad_id: adId,
    title: ad?.title || '',
    email: user?.email || '',
    username: user?.username || '',
    escort_id: user?.user_id || '',
    location: {
      country: 'fr',
      city: ad?.location.city || city
    },
    physicalDetails: ad?.physicalDetails || {
      age: 0,
      height: 0,
      weight: 0,
      bust: ''
    },
    currency: 'EUR',
    rates: ad?.rates || {
      thirtyMinutes: 0,
      oneHour: 0,
      twoHours: 0,
      fullNight: 0
    },
    services: ad?.services || {
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
    contacts: ad?.contacts || {
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
    description: ad?.description || '',
    categories: ad?.categories || {
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

  // Charger les données de l'annonce existante
  useEffect(() => {
    const fetchAdData = async () => {
      if (!adId || !user) return;
      
      setIsLoading(true);
      try {
        
        if (ad) {
          // Mettre à jour le formulaire avec les données existantes
          setFormData({
            pending_ad_id: adId,
            title: ad.title || '',
            email: user.email || '',
            username: user.username || '',
            escort_id: user.user_id || '',
            location: { 
              country: ad.location?.country || 'fr', 
              city: ad.location?.city,
            },
            physicalDetails: {
              age: ad.physicalDetails?.age || 0,
              height: ad.physicalDetails?.height || 0,
              weight: ad.physicalDetails?.weight || 0,
              bust: ad.physicalDetails?.bust || ''
            },
            currency: ad.currency || 'EUR',
            rates: {
              thirtyMinutes: ad.rates?.thirtyMinutes || 0,
              oneHour: ad.rates?.oneHour || 0,
              twoHours: ad.rates?.twoHours || 0,
              fullNight: ad.rates?.fullNight || 0
            },
            services: ad.services || {
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
            contacts: ad.contacts || {
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
            description: ad.description || '',
            categories: ad.categories || {
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
          
          // Sauvegarder les URLs des images existantes
          if (ad.images && Array.isArray(ad.images)) {
            setExistingImages(ad.images);
          }
          if(ad.video_url) {
            setExistingVideo(ad.video_url)}
        }
      } catch (error) {
        console.error('Error fetching ad data:', error);
        toast.error(t('messages.loadError'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdData();
  }, [adId, user]);

  // ✅ INTÉGRATION DU HOOK
  const {
    errors,
    isUpdating,
    handleChange,
    updateAd,
    cityOperations,
    handlePhysicalDetailsChange,
    handleRateChange,
    handleServiceToggle,
    handleCategoryToggle,
    handleContactChange,
    handleFileUpload,
  } = useAdForm({ adData: formData, setadData: setFormData });

  const handleUpdate = async () => {
    if (!user) {
      toast.error(t('messages.loginRequired'));
      return;
    }

    if (!adId) {
      toast.error(t('messages.adIdMissing'));
      return;
    }

    if (user.user_type !== 'escort') {
      toast.error(t('messages.escortOnly'));
      return;
    }

    // Validation de la ville
    if (!formData.location.city) {
      toast.error(t('messages.cityRequired'));
      return;
    }

    // Appeler la fonction updateAd avec les images existantes
    const result = await updateAd(adId, existingImages);
    
    if (result?.success) {
      toast.success(t('messages.updateSuccess'));
      
      // Vous pouvez rediriger l'utilisateur vers la page de l'annonce
      // ou laisser le formulaire tel quel pour plus de modifications
      // window.location.href = `/manage/ads/${formData.location.city}/${adId}`;
    } else {
      toast.error(result?.error || t('messages.updateError'));
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

  // Afficher un loading pendant le chargement
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

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
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={t('placeholders.adTitle')}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <Separator className="my-8" />

      {/* Physical Details */}
      <div className="grid min-md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.age')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <select
            value={formData.physicalDetails.age}
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
            value={formData.physicalDetails.height}
            onChange={(e) => handlePhysicalDetailsChange('height', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">{t('placeholders.selectHeight')}</option>
            {Array.from({ length: 81 }, (_, i) => i + 120).map((height) => {
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
            value={formData.physicalDetails.weight}
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
            value={formData.physicalDetails.bust}
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

      <div className="grid min-md:grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.thirtyMinutes')}</label>
          <input
            type="number"
            value={formData.rates.thirtyMinutes}
            onChange={(e) => handleRateChange('thirtyMinutes', parseFloat(e.target.value) || 0)}
            placeholder={t('fields.thirtyMinutes')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('fields.oneHour')} <span className="text-red-500">{t('fields.required')}</span>
          </label>
          <input
            type="number"
            value={formData.rates.oneHour}
            onChange={(e) => handleRateChange('oneHour', parseFloat(e.target.value) || 0)}
            placeholder={t('fields.oneHour')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {errors.oneHour && <p className="text-red-500 text-sm mt-1">{errors.oneHour}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.twoHours')}</label>
          <input
            type="number"
            value={formData.rates.twoHours}
            onChange={(e) => handleRateChange('twoHours', parseFloat(e.target.value) || 0)}
            placeholder={t('fields.twoHours')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('fields.fullNight')}</label>
          <input
            type="number"
            value={formData.rates.fullNight}
            onChange={(e) => handleRateChange('fullNight', parseFloat(e.target.value) || 0)}
            placeholder={t('fields.fullNight')}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('sections.services')}</h3>
        <div className="space-y-2">
          {services.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b"
            >
              <span className="font-medium">{label}</span>

              <div className="flex gap-4">
                {/* YES */}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={key}
                    checked={formData.services[key as keyof typeof formData.services] === true}
                    onChange={() => handleServiceToggle(key, true)}
                    className="w-4 h-4"
                  />
                  <span>{t('options.yes')}</span>
                </label>

                {/* NO */}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={key}
                    checked={formData.services[key as keyof typeof formData.services] === false}
                    onChange={() => handleServiceToggle(key, false)}
                    className="w-4 h-4"
                  />
                  <span>{t('options.no')}</span>
                </label>
              </div>
            </div>
          ))}
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
                      value={formData.contacts[field.name as keyof typeof formData.contacts] || ''}
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
          value={formData.description}
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
            return (
              <label 
                key={key} 
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input 
                  type="checkbox" 
                  checked={formData.categories[key as keyof typeof formData.categories] === true}
                  onChange={(e) => handleCategoryToggle(key, e.target.checked)}
                  className="w-5 h-5 accent-pink-500 cursor-pointer" 
                />
                <span className="text-sm font-medium">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Images existantes */}
      {existingImages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">{t('messages.currentImages')}</h3>
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative">
                <img
                  src={imageUrl}
                  alt={`Current image ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t('currentMedia.description')}
          </p>
        </div>
      )}

      {/* Nouvelles images */}
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{t('messages.uploadNewImages')}</h3>
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
          <span>{t('messages.uploadButton')} ({formData.images.length}/10)</span>
        </label>
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`New image preview ${index + 1}`}
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
      {/* Video existantes */}
      {existingVideo && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">{t('messages.currentVideo')}</h3>
          <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <video
                  src={existingVideo}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {t('currentMedia.description')}
          </p>
        </div>
      )}

      {/* Nouvelle video */}
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
        onClick={handleUpdate}
        disabled={isUpdating}
        className="w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-semibold text-lg"
      >
        {isUpdating ? t('buttons.updating') : t('buttons.update')}
      </button>
    </div>
  );
}