import { Settings } from "lucide-static";

export interface NavbarData {
  carousel: Carousel[]
  procedures: Record<string, Procedure[]>
  topProcedure: Procedure[]
  settings: Settings
}

export interface Carousel {
  path: string;
  title: string;
  subtitle: string;
}

export interface Procedure {
  id: number;
  image: string;
  slug: string;
  title: string;
  category: string;
}

export interface Settings {
  social: Social;
  contact: Contact;
}

export interface Social {
  social_facebook: string;
  social_instagram: string;
  social_threads: string;
  social_twitter: string;
  social_linkedin: string;
}

export interface Contact {
  contact_phone: string;
  contact_email: string;
  contact_location: string;
  whatsapp?: WhatsAppSettings;
}

export interface WhatsAppSettings {
  phone: string;
  default_message: string;
  is_active: boolean;
  open_in_new_tab: boolean;
}
