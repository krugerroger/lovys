"use client";

import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { AdFormData, PhysicalDetails, Rates, ServiceData } from "@/types/adsForm";
import { Form } from "lucide-react";

export const useAdForm = ({ 
  adData, 
  setadData 
}: { 
  adData: AdFormData; 
  setadData: Dispatch<SetStateAction<AdFormData>>
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!adData.title.trim()) newErrors.title = 'Title is required';
    if (!adData.location?.country) newErrors.country = 'Country is required';
    if (!adData.location?.city) newErrors.city = 'City is required';
    if (adData.physicalDetails?.age < 18) newErrors.age = 'Must be at least 18 years old';
    if (adData.physicalDetails?.height <= 0) newErrors.height = 'Height is required';
    if (adData.physicalDetails?.weight <= 0) newErrors.weight = 'Weight is required';
    if (!adData.physicalDetails?.bust) newErrors.bust = 'Bust is required';
    if (!adData.rates?.oneHour || adData.rates.oneHour <= 0) newErrors.oneHour = '1 hour rate is required';
    if (!adData.description?.trim()) newErrors.description = 'Description is required';
    if (!adData.images || adData.images.length === 0) newErrors.images = 'At least one image is required';
    
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

const submitAd = async () => {
  if (!validateForm()) {
    return {
      success: false,
      error: 'Validation failed'
    };
  }

  setIsSubmitting(true);
  setErrors({});

  try {
    // 1. Préparer les données pour l'API
    const formData = new FormData();
    formData.append('escort_id', '');
    formData.append('title', adData.title);
    formData.append('email', '');
    formData.append('username', adData.username);
    formData.append('location_country', adData.location.country || '');
    formData.append('location_city', adData.location.city || '');
    formData.append('physicalAge', adData.physicalDetails.age.toString());
    formData.append('physicalAge', adData.physicalDetails.age.toString());
    formData.append('physicalHeight', adData.physicalDetails.height.toString());
    formData.append('physicalWeight', adData.physicalDetails.weight.toString());
    formData.append('physicalBust', adData.physicalDetails.bust.toString());
    formData.append('currency', adData.currency);
    formData.append('ratesThirtyMinutes', adData.rates.thirtyMinutes?.toString() || '');
    formData.append('ratesOneHour', adData.rates.oneHour?.toString() || '');
    formData.append('ratesTwoHours', adData.rates.twoHours?.toString() || '');
    formData.append('ratesOvernight', adData.rates.fullNight?.toString() || '');
    formData.append('servicesEnabled', adData.services.enabled ? 'true' : 'false');
    formData.append('servicesPrice', adData.services.price?.toString() || '');
    formData.append('servicesComment', adData.services.comment?.toString() || '');
    formData.append('contactsPhoneNumber', adData.contacts.phoneNumber || '');
    formData.append('contactsWhatsapp', adData.contacts.whatsapp || '');
    formData.append('contactsTelegram', adData.contacts.telegram || '');
    formData.append('contactsInstagram', adData.contacts.instagram || '');
    formData.append('contactsTwitch', adData.contacts.twitch || '');
    formData.append('contactsFansly', adData.contacts.fansly || '');
    formData.append('contactsOnlyfans', adData.contacts.onlyfans || '');
    formData.append('contactsTwitter', adData.contacts.twitter || '');
    formData.append('contactsSignal', adData.contacts.signal || '');
    formData.append('description', adData.description);
      if (adData.categories.length > 0) {
    formData.append('categories', adData.categories.join('|'));
  } else {
    formData.append('categories', '');
  }

    adData.images.forEach((image) => {
      formData.append('images', image);
    });

    if (adData.video) {
      formData.append('video', adData.video, adData.video.name);
    }

    const response = await fetch('/api/ads/createAds', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit ad');
    }

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.log('Submit error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  } finally {
    setIsSubmitting(false);
  }
};


  // ... reste des fonctions de gestion (handleChange, etc.) inchangées
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
        [key]: {
          ...prev.services[key],
          enabled,
          price: enabled ? (prev.services[key]?.price || 0) : undefined,
          comment: enabled ? (prev.services[key]?.comment || '') : ''
        }
      }
    }));
  }, []);

  const handleServiceChange = useCallback((key: string, field: keyof ServiceData, value: string | number) => {
    setadData(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [key]: {
          ...prev.services[key] || { enabled: true },
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

  const handleCategoryToggle = useCallback((category: string, checked: boolean) => {
    setadData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  }, []);

  const handleFileUpload = useCallback((files: FileList, type: 'images' | 'video') => {
    const fileArray = Array.from(files);
    
    if (type === 'images') {
      const newImages = [...adData.images, ...fileArray].slice(0, 3);
      handleChange('images', newImages);
    } else if (type === 'video') {
      handleChange('video', fileArray[0]);
    }
  }, [adData.images, handleChange]);

  return {
    adData,
    errors,
    isSubmitting,
    handleChange,
    handlePhysicalDetailsChange,
    handleRateChange,
    handleServiceToggle,
    handleServiceChange,
    handleContactChange,
    handleCategoryToggle,
    handleFileUpload,
    submitAd,
    validateForm,
  };
};