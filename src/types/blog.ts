export interface Blog {
  id: number;
  slug: string;
  image: string;
  writer: string;
  title: string;
  content: string;
  category: string;
  category_code: string;
  status: string;
  created_at: string;
  random_blogs?: Blog[];
}

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

