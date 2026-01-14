export interface Procedures {
  procedures: Procedure[]
}

export interface Procedure {
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
