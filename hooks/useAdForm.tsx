"use client";

import { createAd } from "@/lib/supabase/action/createAd";
import { AdFormData, PhysicalDetails, Rates, ServiceData } from "@/types/adsForm";
import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

export const useAdForm = ({ formData, setFormData }: { formData: AdFormData; setFormData: Dispatch<SetStateAction<AdFormData>>}) => {


  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})


  // Validation du formulaire
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validation des champs requis
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.country) newErrors.country = 'Country is required';
    if (!formData.location.city) newErrors.city = 'City is required';
    if (formData.physicalDetails.age < 18 || !formData.physicalDetails.age) newErrors.age = 'Must be at least 18 years old';
    if (formData.physicalDetails.height <= 0) newErrors.height = 'Height is required';
    if (formData.physicalDetails.weight <= 0) newErrors.weight = 'Weight is required';
    if (!formData.physicalDetails.bust.trim()) newErrors.bust = 'Bust is required';
    if (!formData.rates.oneHour || formData.rates.oneHour <= 0) newErrors.oneHour = '1 hour rate is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    // Validation du téléphone si fourni
    const phone = formData.contacts.phone;
    if (phone && !/^\+[1-9]\d{1,14}$/.test(phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Sauvegarde automatique en brouillon
  const autoSave = useCallback(async () => {
    if (!validateForm()) return;
    
    try {
      const draftData = {
        ...formData,
        images: [], // Ne pas sauvegarder les fichiers dans localStorage
      };
      
      localStorage.setItem('ad_draft', JSON.stringify(draftData));
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [formData, validateForm]);

  // Upload d'un fichier
  const uploadFile = async (file: File, folder: string): Promise<string> => {
    // Pour l'instant, simuler l'upload - à remplacer par votre logique d'upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/${folder}/${file.name}`);
      }, 1000);
    });
  };

  const submitAd = async () => {
    setIsSubmitting(true)
    setErrors({})
    
    try {
       const response = await fetch('/api/ads/createAds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit ad')
      }
 return {
        success: true,
        data: result
      }

    } catch (error: any) {
      console.error('Submit error:', error)
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gestionnaire de changement générique
  const handleChange = useCallback((field: keyof AdFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Gestion des détails physiques
  const handlePhysicalDetailsChange = useCallback((field: keyof PhysicalDetails, value: string | number) => {
    setFormData(prev => ({
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

  // Gestion des tarifs
  const handleRateChange = useCallback((field: keyof Rates, value: number) => {
    setFormData(prev => ({
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

  // Gestion des services
  const handleServiceToggle = useCallback((key: string, enabled: boolean) => {
    setFormData(prev => ({
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
    setFormData(prev => ({
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

  // Gestion des contacts
  const handleContactChange = useCallback((fieldId: string, value: string) => {
    setFormData(prev => ({
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

  // Gestion des catégories
  const handleCategoryToggle = useCallback((category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  }, []);

  // Gestion des fichiers
  const handleFileUpload = useCallback((files: FileList, type: 'images' | 'video') => {
    const fileArray = Array.from(files);
    
    if (type === 'images') {
      // Limiter à 3 images
      const newImages = [...formData.images, ...fileArray].slice(0, 3);
      handleChange('images', newImages);
    } else if (type === 'video') {
      // Limiter à 1 vidéo
      handleChange('video', fileArray[0]);
    }
  }, [formData.images, handleChange]);

  return {
    formData,
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
    autoSave
  };
};