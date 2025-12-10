"use client"
import { useEffect, useState } from 'react';
import { Instagram, MessageCircleIcon, Send, Phone, Twitch, Twitter, Upload } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AdFormData, PhysicalDetails, Rates, ServiceData, ContactSection } from '@/types/adsForm';
import { useAdForm } from '@/hooks/useAdForm';
import { toast } from 'sonner';
import { useUser } from '@/app/context/userContext';


export default function CreateAdForm() {
  const { user,pendingAd } = useUser();
  const [formData, setFormData] = useState<AdFormData>({
    escort_id:'',
    title: '',
    email: '',
    username: user?.username || '',
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
    categories: [],
    images: [],
  });

  // Mettre à jour formData quand user change
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
      }));
    }
  }, [user]);

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
  } = useAdForm({ adData: formData, setadData: setFormData });

  // Vérifier que l'utilisateur peut publier
  const canPublish = user?.user_type === 'escort' && user?.balance !== undefined;

  // Fonction de publication
  const handlePublish = async () => {
    if (!user) {
      toast.error('You must be logged in to publish an ad');
      return;
    }

    if (user.user_type !== 'escort') {
      toast.error('Only escorts can create ads');
      return;
    }

    const result = await submitAd();
    
    if (result?.success) {
      toast.success('Ad submitted successfully!');
      
      // Réinitialiser le formulaire mais garder les infos utilisateur
      setFormData({
        escort_id: user.user_id,
        title: '',
        email: user.email || '',
        username: user.username || '',
        location: { country: '', city: '' },
        physicalDetails: { age: 0, height: 0, weight: 0, bust: '' },
        currency: 'USD',
        rates: { oneHour: 0 },
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
        categories: [],
        images: [],
      });
    } else {
      toast.error(result?.error || 'Failed to submit ad');
      console.log('Ad submission error:', result?.error);
      console.log('Form Data at error:', result);
    }
  };


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
          placeholder: pendingAd?.contacts.phoneNumber || "+1 234 567 8900",
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
          placeholder: pendingAd?.contacts.whatsapp || "WhatsApp number or link",
          label: "WhatsApp",
          type: "text",
          required: false
        },
        {
          id: "telegram",
          name: "telegram",
          icon: <Send className="w-4 h-4" />,
          bgColor: "bg-blue-400",
          placeholder: pendingAd?.contacts.telegram || "@username",
          label: "Telegram",
          type: "text",
          required: false
        },
        {
          id: "instagram",
          name: "instagram",
          icon: <Instagram className="w-4 h-4" />,
          bgColor: "bg-pink-500",
          placeholder: pendingAd?.contacts.instagram || "@username",
          label: "Instagram",
          type: "text",
          required: false
        },
        {
          id: "twitch",
          name: "twitch",
          icon: <Twitch className="w-4 h-4" />,
          bgColor: "bg-purple-500",
          placeholder: pendingAd?.contacts.twitch || "twitch.tv/username",
          label: "Twitch",
          type: "text",
          required: false
        },
        {
          id: "fansly",
          name: "fansly",
          icon: "S",
          bgColor: "bg-indigo-500",
          placeholder: pendingAd?.contacts.fansly || "fans.ly/username",
          label: "Fansly",
          type: "text",
          required: false
        },
        {
          id: "onlyfans",
          name: "onlyfans",
          icon: "O",
          bgColor: "bg-teal-500",
          placeholder: pendingAd?.contacts.onlyfans || "onlyfans.com/username",
          label: "OnlyFans",
          type: "text",
          required: false
        },
        {
          id: "twitter",
          name: "twitter",
          icon: <Twitter className="w-4 h-4" />,
          bgColor: "bg-black",
          placeholder: pendingAd?.contacts.twitter || "@username",
          label: "Twitter/X",
          type: "text",
          required: false
        },
        {
          id: "signal",
          name: "signal",
          icon: "S",
          bgColor: "bg-green-600",
          placeholder: pendingAd?.contacts.signal || "Signal number",
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
           placeholder={pendingAd?.title || "Advertisement Title *"}
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
            <option value="fr">France</option>
            {/* <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="de">Germany</option>
            <option value="es">Spain</option>
            <option value="it">Italy</option> */}
          </select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
<div>
  <label className="block text-sm mb-2">
    Location (city) <span className="text-red-500">*</span>
  {pendingAd?.location?.city && <span className="text-gray-400 inline-flex text-sm">&nbsp; Actual city : {pendingAd.location.city}</span>}
  </label>
  <select
    value={formData.location.city}
    onChange={(e) => handleChange('location', { ...formData.location, city: e.target.value })}
    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
<option value="">Select a city</option>
<option value="Aix-en-Provence">Aix-en-Provence</option>
<option value="Ajaccio">Ajaccio (Corse)</option>
<option value="Alfortville">Alfortville</option>
<option value="Amiens">Amiens</option>
<option value="Angers">Angers</option>
<option value="Annecy">Annecy</option>
<option value="Antony">Antony</option>
<option value="Arcueil">Arcueil</option>
<option value="Arles">Arles</option>
<option value="Argenteuil">Argenteuil</option>
<option value="Athis-Mons">Athis-Mons</option>
<option value="Aubagne">Aubagne</option>
<option value="Aubervilliers">Aubervilliers</option>
<option value="Aulnay-sous-Bois">Aulnay-sous-Bois</option>
<option value="Auxerre">Auxerre</option>
<option value="Avignon">Avignon</option>
<option value="Bagneux">Bagneux</option>
<option value="Bagnolet">Bagnolet</option>
<option value="Bastia">Bastia (Corse)</option>
<option value="Bayonne">Bayonne</option>
<option value="Beauvais">Beauvais</option>
<option value="Besançon">Besançon</option>
<option value="Blois">Blois</option>
<option value="Bobigny">Bobigny</option>
<option value="Bondy">Bondy</option>
<option value="Bordeaux">Bordeaux</option>
<option value="Bourges">Bourges</option>
<option value="Boulogne-Billancourt">Boulogne-Billancourt</option>
<option value="Boulogne-sur-Mer">Boulogne-sur-Mer</option>
<option value="Bourg-la-Reine">Bourg-la-Reine</option>
<option value="Brest">Brest</option>
<option value="Brétigny-sur-Orge">Brétigny-sur-Orge</option>
<option value="Bry-sur-Marne">Bry-sur-Marne</option>
<option value="Cachan">Cachan</option>
<option value="Cagnes-sur-Mer">Cagnes-sur-Mer</option>
<option value="Caen">Caen</option>
<option value="Cahors">Calais</option>
<option value="Cannes">Cannes</option>
<option value="Cayenne">Cayenne (Guyane)</option>
<option value="Cergy">Cergy</option>
<option value="Châlons-en-Champagne">Châlons-en-Champagne</option>
<option value="Chalon-sur-Saône">Chalon-sur-Saône</option>
<option value="Chambéry">Chambéry</option>
<option value="Champigny-sur-Marne">Champigny-sur-Marne</option>
<option value="Charenton-le-Pont">Charenton-le-Pont</option>
<option value="Chartres">Chartres</option>
<option value="Châtillon">Châtillon</option>
<option value="Châtenay-Malabry">Châtenay-Malabry</option>
<option value="Chaville">Chaville</option>
<option value="Chelles">Chelles</option>
<option value="Cholet">Cholet</option>
<option value="Clamart">Clamart</option>
<option value="Clermont-Ferrand">Clermont-Ferrand</option>
<option value="Clichy">Clichy</option>
<option value="Clichy-sous-Bois">Clichy-sous-Bois</option>
<option value="Colmar">Colmar</option>
<option value="Colombes">Colombes</option>
<option value="Compiègne">Compiègne</option>
<option value="Corbeil-Essonnes">Corbeil-Essonnes</option>
<option value="Cormeilles-en-Parisis">Cormeilles-en-Parisis</option>
<option value="Courbevoie">Courbevoie</option>
<option value="Créteil">Créteil</option>
<option value="Dijon">Dijon</option>
<option value="Drancy">Drancy</option>
<option value="Draveil">Draveil</option>
<option value="Dunkerque">Dunkerque</option>
<option value="Échirolles">Échirolles</option>
<option value="Élancourt">Élancourt</option>
<option value="Épinay-sur-Seine">Épinay-sur-Seine</option>
<option value="Évry">Évry</option>
<option value="Fontaine">Fontaine</option>
<option value="Fontenay-aux-Roses">Fontenay-aux-Roses</option>
<option value="Fontenay-sous-Bois">Fontenay-sous-Bois</option>
<option value="Fort-de-France">Fort-de-France (Martinique)</option>
<option value="Franconville">Franconville</option>
<option value="Frênes">Frênes</option>
<option value="Gagny">Gagny</option>
<option value="Garges-lès-Gonesse">Garges-lès-Gonesse</option>
<option value="Gennevilliers">Gennevilliers</option>
<option value="Gonesse">Gonesse</option>
<option value="Goussainville">Goussainville</option>
<option value="Grasse">Grasse</option>
<option value="Grenoble">Grenoble</option>
<option value="Guyancourt">Guyancourt</option>
<option value="Houilles">Houilles</option>
<option value="Issy-les-Moulineaux">Issy-les-Moulineaux</option>
<option value="Istres">Istres</option>
<option value="Ivry-sur-Seine">Ivry-sur-Seine</option>
<option value="Joinville-le-Pont">Joinville-le-Pont</option>
<option value="La Courneuve">La Courneuve</option>
<option value="La Rochelle">La Rochelle</option>
<option value="La Seyne-sur-Mer">La Seyne-sur-Mer</option>
<option value="Le Blanc-Mesnil">Le Blanc-Mesnil</option>
<option value="Le Chesnay">Le Chesnay</option>
<option value="Le Havre">Le Havre</option>
<option value="Le Kremlin-Bicêtre">Le Kremlin-Bicêtre</option>
<option value="Le Mans">Le Mans</option>
<option value="Le Perreux-sur-Marne">Le Perreux-sur-Marne</option>
<option value="Le Plessis-Robinson">Le Plessis-Robinson</option>
<option value="Le Pré-Saint-Gervais">Le Pré-Saint-Gervais</option>
<option value="Le Tampon">Le Tampon (La Réunion)</option>
<option value="Levallois-Perret">Levallois-Perret</option>
<option value="Lille">Lille</option>
<option value="Limoges">Limoges</option>
<option value="Livry-Gargan">Livry-Gargan</option>
<option value="Lyon">Lyon</option>
<option value="Malakoff">Malakoff</option>
<option value="Mantes-la-Jolie">Mantes-la-Jolie</option>
<option value="Marseille">Marseille</option>
<option value="Massy">Massy</option>
<option value="Maurepas">Maurepas</option>
<option value="Meaux">Meaux</option>
<option value="Meudon">Meudon</option>
<option value="Metz">Metz</option>
<option value="Mérignac">Mérignac</option>
<option value="Montauban">Montauban</option>
<option value="Montélimar">Montélimar</option>
<option value="Montfermeil">Montfermeil</option>
<option value="Montmorency">Montmorency</option>
<option value="Montpellier">Montpellier</option>
<option value="Montreuil">Montreuil</option>
<option value="Montrouge">Montrouge</option>
<option value="Mulhouse">Mulhouse</option>
<option value="Nancy">Nancy</option>
<option value="Nantes">Nantes</option>
<option value="Nanterre">Nanterre</option>
<option value="Narbonne">Neuilly-Plaisance</option>
<option value="Neuilly-sur-Marne">Neuilly-sur-Marne</option>
<option value="Neuilly-sur-Seine">Neuilly-sur-Seine</option>
<option value="Nice">Nice</option>
<option value="Nîmes">Nîmes</option>
<option value="Nogent-sur-Marne">Nogent-sur-Marne</option>
<option value="Noisy-le-Grand">Noisy-le-Grand</option>
<option value="Noisy-le-Sec">Noisy-le-Sec</option>
<option value="Orléans">Orléans</option>
<option value="Pantin">Pantin</option>
<option value="Paris">Paris</option>
<option value="Pau">Pau</option>
<option value="Perpignan">Perpignan</option>
<option value="Pessac">Pessac</option>
<option value="Pierrefitte-sur-Seine">Pierrefitte-sur-Seine</option>
<option value="Plaisir">Plaisir</option>
<option value="Poissy">Poissy</option>
<option value="Poitiers">Poitiers</option>
<option value="Pontoise">Pontoise</option>
<option value="Puteaux">Puteaux</option>
<option value="Quimper">Quimper</option>
<option value="Reims">Reims</option>
<option value="Rennes">Rennes</option>
<option value="Rillieux-la-Pape">Rillieux-la-Pape</option>
<option value="Ris-Orangis">Romainville</option>
<option value="Roissy-en-France">Roissy-en-France</option>
<option value="Rosny-sous-Bois">Rosny-sous-Bois</option>
<option value="Roubaix">Roubaix</option>
<option value="Rouen">Rouen</option>
<option value="Rueil-Malmaison">Rueil-Malmaison</option>
<option value="Saint-Brieuc">Saint-Brieuc</option>
<option value="Saint-Chamond">Saint-Chamond</option>
<option value="Saint-Cloud">Saint-Cloud</option>
<option value="Saint-Denis">Saint-Denis</option>
<option value="Saint-Denis">Saint-Denis (La Réunion)</option>
<option value="Saint-Germain-en-Laye">Saint-Germain-en-Laye</option>
<option value="Saint-Herblain">Saint-Herblain</option>
<option value="Saint-Jean-de-Braye">Saint-Jean-de-Braye</option>
<option value="Saint-Louis">Saint-Louis (La Réunion)</option>
<option value="Saint-Mandé">Saint-Mandé</option>
<option value="Saint-Maur-des-Fossés">Saint-Maur-des-Fossés</option>
<option value="Saint-Michel-sur-Orge">Saint-Michel-sur-Orge</option>
<option value="Saint-Nazaire">Saint-Nazaire</option>
<option value="Saint-Ouen">Saint-Ouen</option>
<option value="Saint-Paul">Saint-Paul (La Réunion)</option>
<option value="Saint-Pierre">Saint-Pierre (La Réunion)</option>
<option value="Saint-Priest">Saint-Priest</option>
<option value="Saint-Quentin">Saint-Quentin</option>
<option value="Saint-Raphaël">Saint-Raphaël</option>
<option value="Sainte-Geneviève-des-Bois">Sainte-Geneviève-des-Bois</option>
<option value="Sannois">Sannois</option>
<option value="Sarcelles">Sarcelles</option>
<option value="Sartrouville">Sartrouville</option>
<option value="Sceaux">Sceaux</option>
<option value="Sevran">Sevran</option>
<option value="Suresnes">Suresnes</option>
<option value="Talence">Talence</option>
<option value="Taverny">Taverny</option>
<option value="Thionville">Thionville</option>
<option value="Tourcoing">Tourcoing</option>
<option value="Tours">Tours</option>
<option value="Toulon">Toulon</option>
<option value="Toulouse">Toulouse</option>
<option value="Trappes">Trappes</option>
<option value="Tremblay-en-France">Tremblay-en-France</option>
<option value="Troyes">Troyes</option>
<option value="Valence">Valence</option>
<option value="Valenciennes">Valenciennes</option>
<option value="Vanves">Vanves</option>
<option value="Vaulx-en-Velin">Vaulx-en-Velin</option>
<option value="Versailles">Versailles</option>
<option value="Vigneux-sur-Seine">Vigneux-sur-Seine</option>
<option value="Ville-d'Avray">Ville-d'Avray</option>
<option value="Villebon-sur-Yvette">Villebon-sur-Yvette</option>
<option value="Villejuif">Villejuif</option>
<option value="Villemomble">Villemomble</option>
<option value="Villeparisis">Villeparisis</option>
<option value="Villepinte">Villepinte</option>
<option value="Villeurbanne">Villeurbanne</option>
<option value="Villeneuve-Saint-Georges">Villeneuve-Saint-Georges</option>
<option value="Vincennes">Vincennes</option>
<option value="Viry-Châtillon">Viry-Châtillon</option>
<option value="Vitry-sur-Seine">Vitry-sur-Seine</option>

  </select>
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
             placeholder={pendingAd?.physicalDetails?.age ? pendingAd.physicalDetails.age.toString() : ''}
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
            placeholder={pendingAd?.physicalDetails?.height ? pendingAd.physicalDetails.height.toString() : ''}
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
            placeholder={pendingAd?.physicalDetails?.weight ? pendingAd.physicalDetails.weight.toString() : ''}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="30"
            max="200"
          />
          {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
        </div>
        <div>
          <label className="block text-sm mb-2">
            Bust <span className="text-red-500">*</span>
            {pendingAd?.physicalDetails?.bust && <span className="text-gray-400 inline-flex text-sm">&nbsp; Actual bust : {pendingAd.physicalDetails.bust}</span>}
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
          {pendingAd?.currency && <span className="text-gray-400 inline-flex text-sm">&nbsp; Actual currency : {pendingAd.currency}</span>}
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
            placeholder={pendingAd?.rates?.thirtyMinutes ? pendingAd.rates.thirtyMinutes.toString() : 'Enter price'}
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
            placeholder={pendingAd?.rates?.oneHour ? pendingAd.rates.oneHour.toString() : 'Enter price'}
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
             placeholder={pendingAd?.rates?.twoHours ? pendingAd.rates.twoHours.toString() : 'Enter price'}
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
            placeholder={pendingAd?.rates?.fullNight ? pendingAd.rates.fullNight.toString() : 'Enter price'}
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
                       placeholder={pendingAd?.services?.[key]?.price?.toString() ?? "0.00"}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div className='grow'>
                    <label className="block text-sm font-medium mb-1">Comment</label>
                    <input
                      value={formData.services[key]?.comment || ''}
                      onChange={(e) => handleServiceChange(key, 'comment', e.target.value)}
                      placeholder={pendingAd?.services?.[key]?.comment ?? "Optional details..."}
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
      {section.fields.map((field) => {
        // Corriger le mapping des noms
        const contactFieldName = field.name as keyof typeof formData.contacts; // 'phoneNumber', 'whatsapp', etc.
        const fieldValue = formData.contacts[contactFieldName] || '';
        
        return (
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
                  name={contactFieldName as string} // Utiliser le nom correct
                  value={fieldValue}
                  onChange={(e) => handleContactChange(contactFieldName, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500 
                           focus:border-transparent transition
                           hover:border-gray-400"
                  aria-label={field.label}
                  pattern={field.pattern}
                  required={field.required}
                />
                {fieldValue && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
            {errors[contactFieldName] && (
              <p className="text-red-500 text-xs mt-1 ml-14">{errors[contactFieldName]}</p>
            )}
          </div>
        );
      })}
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
          placeholder={pendingAd?.description || "Write a detailed description of your services... *"}
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
        {isSubmitting ? 'Submitting...' : `submit Ad`}
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