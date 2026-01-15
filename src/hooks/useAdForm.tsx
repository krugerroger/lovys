"use client";

import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { AdFormData, PhysicalDetails, Rates, ServiceData } from "@/types/adsForm";
import { toast } from "sonner";

export const useAdForm = ({ 
  adData, 
  setadData 
}: { 
  adData: AdFormData; 
  setadData: Dispatch<SetStateAction<AdFormData>>
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation du formulaire (pour création et mise à jour)
  const validateForm = useCallback((isUpdate: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!adData.title.trim()) newErrors.title = 'Title is required';
    if (!adData.location?.country) newErrors.country = 'Country is required';
    
    // Validation des villes
    if (!adData.location?.city) {
      newErrors.city = 'Please select a city';
    }
    
    if (adData.physicalDetails?.age < 18) newErrors.age = 'Must be at least 18 years old';
    if (!adData.physicalDetails?.height) newErrors.height = 'Height is required';
    if (!adData.physicalDetails?.weight) newErrors.weight = 'Weight is required';
    if (!adData.physicalDetails?.bust) newErrors.bust = 'Bust is required';
    if (!adData.rates?.oneHour || adData.rates.oneHour <= 0) newErrors.oneHour = '1 hour rate is required';
    if (!adData.description?.trim()) newErrors.description = 'Description is required';
    
    // Validation des images (seulement pour création)
    if (!isUpdate && (!adData.images || adData.images.length === 0)) {
      newErrors.images = 'At least one image is required';
    }
    
    // Validation taille des images
    if (adData.images?.some(img => img.size > 5 * 1024 * 1024)) {
      newErrors.images = 'Each image must be less than 5MB';
    }
    
    // Validation vidéo optionnelle
    if (adData.video && adData.video.size > 15 * 1024 * 1024) {
      newErrors.video = 'Video must be less than 15MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [adData]);

  // Soumission pour création d'une nouvelle annonce
  const submitAd = async () => {
    if (!validateForm(false)) {
      toast.error('Please fix validation errors');
      return {
        success: false,
        error: 'Validation failed'
      };
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = prepareFormData(adData, false);
      
      const response = await fetch('/api/ads/createAds', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit ad');
      }

      toast.success('Ad created successfully!');
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.log('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to create ad: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mise à jour d'une annonce existante
  const updateAd = async (pendingAdId: string, existingImages?: string[]) => {
    if (!pendingAdId) {
      toast.error('Ad ID is required for update');
      return {
        success: false,
        error: 'Ad ID is required'
      };
    }

    if (!validateForm(true)) {
      toast.error('Please fix validation errors');
      return {
        success: false,
        error: 'Validation failed'
      };
    }

    setIsUpdating(true);
    setErrors({});

    try {
      const formData = prepareFormData(adData, true, existingImages);
      formData.append('pending_ad_id', pendingAdId);
      
      const response = await fetch('/api/ads/createAds', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update ad');
      }

      toast.success('Ad updated successfully!');
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.log('Update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error(`Failed to update ad: ${errorMessage}`);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsUpdating(false);
    }
  };

  // Fonction utilitaire pour préparer les FormData
  const prepareFormData = (data: AdFormData, isUpdate: boolean, existingImages?: string[]): FormData => {
    const formData = new FormData();
    
    // Données de base
    formData.append('title', data.title);
    formData.append('username', data.username);
    formData.append('location_country', data.location.country || '');
    formData.append('location_city', data.location.city || '');
    formData.append('physicalAge', data.physicalDetails.age?.toString() || '');
    formData.append('physicalHeight', data.physicalDetails.height?.toString() || '');
    formData.append('physicalWeight', data.physicalDetails.weight?.toString() || '');
    formData.append('physicalBust', data.physicalDetails.bust?.toString() || '');
    formData.append('currency', data.currency);
    formData.append('ratesThirtyMinutes', data.rates.thirtyMinutes?.toString() || '');
    formData.append('ratesOneHour', data.rates.oneHour?.toString() || '');
    formData.append('ratesTwoHours', data.rates.twoHours?.toString() || '');
    formData.append('ratesOvernight', data.rates.fullNight?.toString() || '');
    formData.append('services', JSON.stringify(data.services || {}));
    formData.append('categories', JSON.stringify(data.categories || {}));
    formData.append('contactsPhoneNumber', data.contacts.phoneNumber || '');
    formData.append('contactsWhatsapp', data.contacts.whatsapp || '');
    formData.append('contactsTelegram', data.contacts.telegram || '');
    formData.append('contactsInstagram', data.contacts.instagram || '');
    formData.append('contactsTwitch', data.contacts.twitch || '');
    formData.append('contactsFansly', data.contacts.fansly || '');
    formData.append('contactsOnlyfans', data.contacts.onlyfans || '');
    formData.append('contactsTwitter', data.contacts.twitter || '');
    formData.append('contactsSignal', data.contacts.signal || '');
    formData.append('description', data.description);

    // Gestion des images
    if (isUpdate && existingImages) {
      formData.append('existing_images', JSON.stringify(existingImages));
    }
    
    // Ajouter les nouvelles images (File objects)
    data.images.forEach((image) => {
      if (image instanceof File) {
        formData.append('images', image);
      }
    });

    // Gestion de la vidéo
    if (data.video instanceof File) {
      formData.append('video', data.video, data.video.name);
    }

    return formData;
  };

  // Fonction principale de changement pour les champs simples
  const handleChange = useCallback((field: keyof AdFormData, value: any) => {
    setadData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Fonction spécifique pour gérer les villes
  const handleCityChange = useCallback((action: 'add' | 'remove' | 'toggle' | 'set' | 'clear' | 'input', cityValue?: string | string[]) => {
    setadData(prev => {
      const currentCity = prev.location?.city || '';
      let newCity: string = '';
      
      switch (action) {
        case 'add':
        case 'toggle':
        case 'set':
          if (typeof cityValue === 'string') {
            newCity = cityValue;
          } else if (Array.isArray(cityValue) && cityValue.length > 0) {
            newCity = cityValue[0];
          }
          break;
          
        case 'remove':
          if (typeof cityValue === 'string' && currentCity === cityValue) {
            newCity = '';
          } else {
            newCity = currentCity;
          }
          break;
          
        case 'clear':
          newCity = '';
          break;
          
        case 'input':
          if (typeof cityValue === 'string') {
            newCity = cityValue;
          }
          break;
          
        default:
          newCity = currentCity;
      }
      
      if (errors.city && newCity !== '') {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.city;
          return newErrors;
        });
      }
      
      return {
        ...prev,
        location: {
          ...prev.location,
          city: newCity
        }
      };
    });
  }, [errors]);

  const handlePhysicalDetailsChange = useCallback((field: keyof PhysicalDetails, value: string | number) => {
    setadData(prev => ({
      ...prev,
      physicalDetails: {
        ...prev.physicalDetails,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleRateChange = useCallback((field: keyof Rates, value: number) => {
    setadData(prev => ({
      ...prev,
      rates: {
        ...prev.rates,
        [field]: value
      }
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleServiceToggle = useCallback((key: string, enabled: boolean) => {
    setadData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: enabled
      }
    }));
  }, []);

  const handleCategoryToggle = useCallback((key: string, enabled: boolean) => {
    setadData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [key]: enabled
      }
    }));
  }, []);

  const handleServiceChange = useCallback((key: string, field: keyof ServiceData, value: string | number) => {
    setadData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: {
          ...prev.services || { enabled: true },
          [field]: value
        }
      }
    }));
  }, []);

  const handleContactChange = useCallback((fieldId: string, value: string) => {
    setadData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [fieldId]: value
      }
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  }, [errors]);

  const handleFileUpload = useCallback((files: FileList, type: 'images' | 'video') => {
    const fileArray = Array.from(files);
    
    if (type === 'images') {
      const newImages = [...adData.images, ...fileArray].slice(0, 10); // Limite à 10 images
      handleChange('images', newImages);
    } else if (type === 'video') {
      handleChange('video', fileArray[0]);
    }
  }, [adData.images, handleChange]);

  // Fonctions utilitaires pour les villes
  const cityOperations = {
    addCity: (cityValue: string) => {
      handleCityChange('add', cityValue);
    },
    
    removeCity: (cityValue: string) => {
      handleCityChange('remove', cityValue);
    },
    
    toggleCity: (cityValue: string) => {
      handleCityChange('toggle', cityValue);
    },
    
    setCities: (cities: string[]) => {
      handleCityChange('set', cities);
    },
    
    clearCities: () => {
      handleCityChange('clear');
    },
    
    selectMajorCities: () => {
      const majorCities = ['paris', 'marseille', 'lyon', 'toulouse', 'nice'];
      handleCityChange('set', majorCities);
    },
    
    selectParisOnly: () => {
      handleCityChange('set', ['paris']);
    }
  };

  return {
    adData,
    errors,
    isSubmitting,
    isUpdating,
    handleChange,
    handleCityChange,
    cityOperations,
    handlePhysicalDetailsChange,
    handleRateChange,
    handleServiceToggle,
    handleCategoryToggle,
    handleServiceChange,
    handleContactChange,
    handleFileUpload,
    submitAd,
    updateAd, // Nouvelle fonction exportée
    validateForm,
  };
};