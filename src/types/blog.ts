export interface Data {
  id: number;
  title: string;
  slug: string;
  image: string;
  status: string;
  writer: string;
  excerpts: string;
  category: string;
  category_code: string;
  created_at: string;
}

export interface CategoryData {
  title: string;
  code: string;
  count: number;
}
