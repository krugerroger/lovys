"use client"
import { useEffect, useState } from 'react';
import { Instagram, MessageCircleIcon, Send, Phone, Twitch, Twitter, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AdFormData, PhysicalDetails, Rates, ServiceData, ContactSection } from '@/types/adsForm';
import { useAdForm } from '@/hooks/useAdForm';
import { toast } from 'sonner';
import { useUser } from '@/app/context/userContext';


export default function CreateAdForm() {
    const { user } = useUser();
    const [formData, setFormData] = useState<AdFormData>({
      title: '',
      location: { country: '', city: '' },
      physicalDetails: {
        age: 0,
        height: 0,
        weight: 0,
        bust: ''
      },
      currency: 'USD',
      rates: {
        oneHour: 0
      },
      services: {},
      contacts: {},
      description: '',
      categories: [],
      images: [],
    });

  const {
    errors,
    isSubmitting,
    submitAd,
    handleChange,
    handlePhysicalDetailsChange,
    handleRateChange,
    handleServiceToggle,
    handleServiceChange,
    handleContactChange,
    handleCategoryToggle,
    handleFileUpload,
  } = useAdForm({formData, setFormData});


  // Vérifier le solde
  const canPublish = user?.balance !== undefined && user.balance >= 5

  // Fonction de publication
  const handlePublish = async () => {
    if (!canPublish) {
      toast.error(`Need $5, you have $${user?.balance}`)
      return
    }

    const result = await submitAd()
    
    if (result.success) {
      toast.success('Ad submitted! $5 deducted.')
      // Rediriger ou réinitialiser le formulaire
      setFormData({
        title: '',
        location: { country: '', city: '' },
        physicalDetails: { age: 0, height: 0, weight: 0, bust: '' },
        currency: 'USD',
        rates: { oneHour: 0 },
        services: {},
        contacts: {},
        description: '',
        categories: [],
        images: [],
      })
    } else {
      toast.error(result.error || 'Failed to submit')
    }
  }


  const contactSections: ContactSection[] = [
    {
      id: "phone",
      title: "Inter phone number",
      fields: [
        {
          id: "phone",
          name: "phoneNumber",
          icon: <Phone className="w-3.5 h-3.5" />,
          bgColor: "bg-blue-500",
          placeholder: "+1 234 567 8900",
          label: "Phone Number",
          type: "tel",
          pattern: "^\\+[1-9]\\d{1,14}$",
          required: true
        }
      ]
    },
    {
      id: "messengers",
      title: "Messengers",
      fields: [
        {
          id: "whatsapp",
          name: "whatsapp",
          icon: <MessageCircleIcon className="w-4 h-4" />,
          bgColor: "bg-green-500",
          placeholder: "WhatsApp number or link",
          label: "WhatsApp",
          type: "text",
          required: false
        },
        {
          id: "telegram",
          name: "telegram",
          icon: <Send className="w-4 h-4" />,
          bgColor: "bg-blue-400",
          placeholder: "@username",
          label: "Telegram",
          type: "text",
          required: false
        },
        {
          id: "instagram",
          name: "instagram",
          icon: <Instagram className="w-4 h-4" />,
          bgColor: "bg-pink-500",
          placeholder: "@username",
          label: "Instagram",
          type: "text",
          required: false
        },
        {
          id: "twitch",
          name: "twitch",
          icon: <Twitch className="w-4 h-4" />,
          bgColor: "bg-purple-500",
          placeholder: "twitch.tv/username",
          label: "Twitch",
          type: "text",
          required: false
        },
        {
          id: "fansly",
          name: "fansly",
          icon: "S",
          bgColor: "bg-indigo-500",
          placeholder: "fans.ly/username",
          label: "Fansly",
          type: "text",
          required: false
        },
        {
          id: "onlyfans",
          name: "onlyfans",
          icon: "O",
          bgColor: "bg-teal-500",
          placeholder: "onlyfans.com/username",
          label: "OnlyFans",
          type: "text",
          required: false
        },
        {
          id: "twitter",
          name: "twitter",
          icon: <Twitter className="w-4 h-4" />,
          bgColor: "bg-black",
          placeholder: "@username",
          label: "Twitter/X",
          type: "text",
          required: false
        },
        {
          id: "signal",
          name: "signal",
          icon: "S",
          bgColor: "bg-green-600",
          placeholder: "Signal number",
          label: "Signal",
          type: "tel",
          required: false
        }
      ]
    }
  ];

  const categories = [
    'anal sex', 'asian girls', 'BBW', 'big tits',
    'blonde', 'brunette', 'CIM', 'ebony',
    'erotic massage', 'european girls', 'Kissing',
    'latina girls', 'mature', 'VIP girls'
  ];

  const services = [
    { key: 'analSex', label: 'Anal sex' },
    { key: 'oralWithoutCondom', label: 'Oral without condom' },
    { key: 'kissing', label: 'Kissing' },
    { key: 'cunnilingus', label: 'Cunnilingus' },
    { key: 'cumInMouth', label: 'Cum in mouth (CIM)' },
    { key: 'cumInFace', label: 'Cum in face (CIF)' },
    { key: 'cumOnBody', label: 'Cum on body (COB)' },
    { key: 'classicMassage', label: 'Classic massage'},
    { key: 'eroticMassage', label: 'Erotic massage'},
    { key: 'striptease', label: 'Striptease'},
    { key: 'washingInShower', label: 'Washing in the shower'},
    { key: 'strapon', label: 'Strapon' },
    { key: 'rimming', label: 'Rimming (Anilingus)' },
    { key: 'goldenShower', label: 'Golden shower (for men)' },
    { key: 'domination', label: 'Domination' },
    { key: 'blowjobInCar', label: 'Blowjob in the car' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-semibold mb-6">Create an Ad</h2>
      
      {/* Advertisement Title */}
      <div className="mb-6">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Name"
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        <p className="text-xs text-gray-500 mt-1">Advertisement title (e.g. girl's nickname)</p>
      </div>

      {/* Location Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-2">
            Location (country) <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.location.country}
            onChange={(e) => handleChange('location', { ...formData.location, country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">---</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="fr">France</option>
            <option value="de">Germany</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option>
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">
            Location (city) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => handleChange('location', { ...formData.location, city: e.target.value })}
            placeholder="Enter city"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>
      </div>

      {/* Physical Details Row */}
      <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm mb-2">
            AGE <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.physicalDetails.age || ''}
            onChange={(e) => handlePhysicalDetailsChange('age', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="18"
            max="99"
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">
            HEIGHT (cm) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.physicalDetails.height || ''}
            onChange={(e) => handlePhysicalDetailsChange('height', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="100"
            max="250"
          />
          {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">
            WEIGHT (kg) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.physicalDetails.weight || ''}
            onChange={(e) => handlePhysicalDetailsChange('weight', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="30"
            max="200"
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">
            Bust <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.physicalDetails.bust}
            onChange={(e) => handlePhysicalDetailsChange('bust', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="DD">DD</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
          {errors.bust && <p className="text-red-500 text-sm mt-1">{errors.bust}</p>}
        </div>
      </div>

      <Separator />

      {/* Preferred Currency */}
      <div className="my-6">
        <label className="block text-sm mb-2">
          Preferred Currency <span className="text-red-500">*</span>
        </label>
        <select 
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD (C$)</option>
        </select>
      </div>

      {/* Rates Grid */}
      <div className="grid max-sm:grid-cols-2 grid-cols-4 gap-4 mb-8">
        <div>
          <label className="block text-sm mb-2">30 minutes rate</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.rates.thirtyMinutes || ''}
            onChange={(e) => handleRateChange('thirtyMinutes', parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">
            1 hour rate <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.rates.oneHour || ''}
            onChange={(e) => handleRateChange('oneHour', parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.oneHour && <p className="text-red-500 text-sm mt-1">{errors.oneHour}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">2 hours rate</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.rates.twoHours || ''}
            onChange={(e) => handleRateChange('twoHours', parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-2">Full night rate</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.rates.fullNight || ''}
            onChange={(e) => handleRateChange('fullNight', parseFloat(e.target.value) || 0)}
            placeholder="Enter price"
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-6">Services</h3>
        <div className="space-y-3">
          {services.map(({ key, label }) => (
            <div key={key} className="border-b border-gray-200">
              <div className="flex items-center justify-between py-4">
                <label className="text-sm font-medium">
                  {label}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      checked={formData.services[key]?.enabled === true}
                      onChange={() => handleServiceToggle(key, true)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={key}
                      checked={formData.services[key]?.enabled === false}
                      onChange={() => handleServiceToggle(key, false)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
              
              {formData.services[key]?.enabled && (
                <div className="flex gap-4 p-3">
                  <div className='grow'>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.services[key]?.price || ''}
                      onChange={(e) => handleServiceChange(key, 'price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className='grow'>
                    <label className="block text-sm font-medium mb-1">Comment</label>
                    <input
                      value={formData.services[key]?.comment || ''}
                      onChange={(e) => handleServiceChange(key, 'comment', e.target.value)}
                      placeholder="Optional details..."
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contacts Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Contact Information
        </h3>
        
        {contactSections.map((section) => (
          <div key={section.id} className="mb-8 last:mb-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {section.title}
              </h4>
              <span className="text-xs text-gray-500">
                {section.fields.length} platform{section.fields.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.id} className="group">
                  <label 
                    htmlFor={field.id}
                    className="block text-xs font-medium text-gray-600 mb-1 ml-1"
                  >
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg ${field.bgColor} 
                      flex items-center justify-center text-white 
                      shrink-0 shadow-sm group-hover:shadow-md
                      transition-shadow duration-200
                    `}>
                      {field.icon}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type={field.type}
                        id={field.id}
                        name={field.name}
                        value={formData.contacts[field.id] || ''}
                        onChange={(e) => handleContactChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-cyan-500 
                                 focus:border-transparent transition
                                 hover:border-gray-400"
                        aria-label={field.label}
                        pattern={field.pattern}
                        required={field.required}
                      />
                      {formData.contacts[field.id] && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors[field.id] && (
                    <p className="text-red-500 text-xs mt-1 ml-14">{errors[field.id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-8">
        <label className="block text-sm font-semibold mb-2">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={6}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter description..."
        ></textarea>
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <div className="grid max-sm:grid-cols-2 grid-cols-6 gap-x-8 gap-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 cursor-pointer py-1">
              <input 
                type="checkbox" 
                checked={formData.categories.includes(cat)}
                onChange={(e) => handleCategoryToggle(cat, e.target.checked)}
                className="w-4 h-4" 
              />
              <span className="text-sm font-medium">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Upload Images */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Upload images</h3>
        <input
          type="file"
          id="images"
          multiple
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files!, 'images')}
          className="hidden"
        />
        <label htmlFor="images" className="w-full py-4 border-2 border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-gray-600 cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Upload up to 3 photos ({formData.images.length}/3)</span>
        </label>
        {formData.images.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...formData.images];
                    newImages.splice(index, 1);
                    handleChange('images', newImages);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Video */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Upload video</h3>
        <input
          type="file"
          id="video"
          accept="video/*"
          onChange={(e) => handleFileUpload(e.target.files!, 'video')}
          className="hidden"
        />
        <label htmlFor="video" className="w-full py-4 border-2 border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center gap-2 text-gray-600 cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>{formData.video ? formData.video.name : 'Upload video'}</span>
        </label>
        {formData.video && (
          <div className="mt-3">
            <video
              src={URL.createObjectURL(formData.video)}
              controls
              className="w-full max-h-64 rounded"
            />
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
      <button
        onClick={handlePublish}
        disabled={isSubmitting || !canPublish}
        className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Submitting...' : `Publish Ad ($5)`}
      </button>
        {!canPublish && (
        <p className="text-red-500 text-sm mt-2 text-center">
          Need $5 to publish. Current balance: ${user?.balance || 0}
        </p>
      )}
      </div>
    </div>
  );
}