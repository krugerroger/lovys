

export type ServicesDataState = Record<string, ServiceData>;

// types/adForm.ts

export type Service = {
  key: string;
  label: string;
  price?: number;
  comment?: string;
  enabled: boolean;
};

export type Rate = {
  thirtyMinutes?: number;
  oneHour: number;
  twoHours?: number;
  fullNight?: number;
};

export type PhysicalDetails = {
  age: number;
  height: number;
  weight: number;
  bust: string;
};

export type Rates = {
  thirtyMinutes?: number;
  oneHour?: number;
  twoHours?: number;
  fullNight?: number;
};

export type ServiceData = {
        analSex?: boolean,
        oralWithoutCondom?: boolean,
        kissing?: boolean,
        cunnilingus?: boolean,
        cumInMouth?: boolean,
        cumInFace?: boolean,
        cumOnBody?: boolean,
        eroticMassage?: boolean,
        striptease?: boolean,
        goldenShower?: boolean,
};
export type ContactCategory ={
    phoneNumber: string;
    whatsapp?: string;
    telegram?: string;
    instagram?: string;
    twitch?: string;
    fansly?: string;
    onlyfans?: string;
    twitter?: string;
    signal?: string;
}

export type AdFormData = {
  pending_ad_id: string
  escort_id: string;
  title: string;
  email: string;
  username: string;
  location: Location;
  physicalDetails: PhysicalDetails;
  currency: string;
  rates: Rates;
  services: ServiceData;
  contacts: {
    phoneNumber?: string;
    whatsapp?: string;
    telegram?: string;
    instagram?: string;
    twitch?: string;
    fansly?: string;
    onlyfans?: string;
    twitter?: string;
    signal?: string;
}
  description: string;
  categories: {
    analSex?: boolean,
    asianGirls?: boolean,
    bbw?: boolean,
    bigTits?: boolean,
    blonde?: boolean,
    brunette?: boolean,
    cim?: boolean,
    ebony?: boolean,
    eroticMassage?: boolean,
    europeanGirls?: boolean,
    kissing?: boolean,
    latinaGirls?: boolean,
    mature?: boolean,
    vipGirls?: boolean,
}
;
  images: File[];
  video?: File;
};
export type UpdateFormData = {
  pending_ad_id: string
  escort_id: string;
  title: string;
  email: string;
  username: string;
  physicalDetails: PhysicalDetails;
  currency: string;
  rates: Rates;
  services: ServiceData;
  contacts: {
    phoneNumber: string;
    whatsapp?: string;
    telegram?: string;
    instagram?: string;
    twitch?: string;
    fansly?: string;
    onlyfans?: string;
    twitter?: string;
    signal?: string;
}
  description: string;
  categories?: {
  analSex?: false,
    asianGirls?: false,
    bbw?: false,
    bigTits?: false,
    blonde?: false,
    brunette?: false,
    cim?: false,
    ebony?: false,
    eroticMassage?: false,
    europeanGirls?: false,
    kissing?: false,
    latinaGirls?: false,
    mature?: false,
    vipGirls?: false,
}
;
  images: File[];
  video?: File;
};

export type Location = {
  country: string;
  city: string;
};

// export type Contacts = {
//   phone: string;
//   telegram: string;
//   whatsapp: string;
// };

export type PreviewAdData = {
  pending_ad_id: string
  escort_id: string
  title: string
  email: string
  username: string
  location: {
    city: string
    country: string
  }
  physicalDetails: {
    age: number
    height: number
    weight: number
    bust: string
  }
  currency: string
  rates: {
    thirtyMinutes?: number
    oneHour?: number
    twoHours?: number
    fullNight?: number
  }
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
  }
  contacts: {
    phoneNumber?: string
    whatsapp?: string
    telegram?: string
    instagram?: string,
    twitch?: string,
    fansly?: string,
    onlyfans?: string,
    twitter?: string,
    signal?: string
  }
  description: string
  categories: {
    analSex?: false,
    asianGirls?: false,
    bbw?: false,
    bigTits?: false,
    blonde?: false,
    brunette?: false,
    cim?: false,
    ebony?: false,
    eroticMassage?: false,
    europeanGirls?: false,
    kissing?: false,
    latinaGirls?: false,
    mature?: false,
    vipGirls?: false,
  }

  images: string[]
  video_url: string | null
  status: string
  created_at: string
  updated_at: string
  verified: boolean
  online: boolean
  rating: number
  reviews: number
   city_boosted_at?: {
    [city: string]: string; // Clé = nom de ville en minuscule, valeur = ISO string du timestamp
  }
}

export type ContactField = {
  id: string;
  name: string;
  icon: React.ReactElement;
  bgColor: string;
  placeholder: string;
  label: string;
  type: string;
  required?: boolean; // Rendre required optionnel
  pattern?: string;
};

export type ContactSection = {
  id: string;
  title: string;
  fields: ContactField[];
};

export type ServiceKey =
  | 'analSex'
  | 'oralWithoutCondom'
  | 'kissing'
  | 'cunnilingus'
  | 'cumInMouth'
  | 'cumInFace'
  | 'cumOnBody'
  | 'eroticMassage'
  | 'striptease'
  | 'goldenShower';
