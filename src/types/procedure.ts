export interface Procedures {
  procedures: Procedure[]
}

export interface Procedure {
  id: number;
  status: string;
  slug: string;
  image: string;
  views: number;
  title: string;
  subtitle: string;
  category: string;
  category_code: string;
  created_at: string;
  section: ProcedureSection[];
  preStep: PreparationStep[];
  phase: RecoveryPhase[];
  do: Recommendation[];
  dont: Recommendation[];
  faq: Faq[];
  gallery: GalleryItem[];
  whatsapp_number?: string | null;
  whatsapp_active?: boolean;
  whatsapp_message?: string | null;
  whatsapp_open_new_tab?: boolean;
}

export interface ProcedureSection {
  id: number;
  type: 'what_is' | 'technique' | 'recovery';
  image: string | null;
  title: string;
  contentOne: string;
  contentTwo: string;
}

export interface PreparationStep {
  id: number;
  title: string;
  description: string;
  order: number;
}

export interface RecoveryPhase {
  id: number;
  period: string;
  title: string;
  description: string;
  order: number;
}

export interface Recommendation {
  id: number;
  type: 'do' | 'dont';
  order: number;
  content: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface GalleryItem {
  id: number;
  path: string;
  order: number | null;
}

export interface Data {
  id: number;
  status: string;
  slug: string;
  image: string;
  title: string;
  subtitle: string;
  category: string;
  category_code: string;
  created_at: string;
}

export interface CategoryData {
  title: string;
  code: string;
}
