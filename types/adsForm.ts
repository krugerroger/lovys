

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
  oneHour: number;
  twoHours?: number;
  fullNight?: number;
};

export type ServiceData = {
  enabled: boolean;
  price?: number;
  comment?: string;
};

export type AdFormData = {
  title: string;
  location: Location;
  physicalDetails: PhysicalDetails;
  currency: string;
  rates: Rates;
  services: Record<string, ServiceData>;
  contacts: Record<string, string>;
  description: string;
  categories: string[];
  images: File[];
  video?: File;
};

export type Location = {
  country: string;
  city: string;
};

export type ContactField = {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  placeholder: string;
  label: string;
  type: string;
  pattern?: string;
  required: boolean;
};

export type ContactSection = {
  id: string;
  title: string;
  fields: ContactField[];
};